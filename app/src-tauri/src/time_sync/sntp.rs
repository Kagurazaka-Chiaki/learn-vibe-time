use super::TimeSyncResponse;
use std::net::UdpSocket;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const NTP_UNIX_EPOCH_OFFSET_SECONDS: u64 = 2_208_988_800;
const NTP_FRACTION_SCALE: f64 = 4_294_967_296.0;
const NTP_PACKET_LEN: usize = 48;
const NTP_MODE_SERVER: u8 = 4;
const NTP_LEAP_UNSYNCHRONIZED: u8 = 3;

fn now_ms() -> Result<i64, String> {
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| format!("system time is before Unix epoch: {error}"))?;

    Ok(duration.as_millis() as i64)
}

fn read_ntp_timestamp_ms(bytes: &[u8]) -> Result<f64, String> {
    if bytes.len() < 8 {
        return Err("NTP timestamp is shorter than 8 bytes".to_string());
    }

    let seconds = u32::from_be_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]) as u64;
    let fraction = u32::from_be_bytes([bytes[4], bytes[5], bytes[6], bytes[7]]) as f64;

    if seconds == 0 && fraction == 0.0 {
        return Err("NTP timestamp is empty".to_string());
    }

    if seconds < NTP_UNIX_EPOCH_OFFSET_SECONDS {
        return Err("NTP timestamp is before Unix epoch".to_string());
    }

    let unix_seconds = seconds - NTP_UNIX_EPOCH_OFFSET_SECONDS;
    Ok((unix_seconds as f64 * 1000.0) + ((fraction * 1000.0) / NTP_FRACTION_SCALE))
}

fn write_ntp_timestamp_ms(ms: f64, bytes: &mut [u8]) -> Result<(), String> {
    if bytes.len() < 8 {
        return Err("NTP timestamp target is shorter than 8 bytes".to_string());
    }
    if !ms.is_finite() || ms < 0.0 {
        return Err("NTP timestamp source is invalid".to_string());
    }

    let unix_seconds = (ms / 1000.0).floor() as u64;
    let fraction_ms = ms - (unix_seconds as f64 * 1000.0);
    let mut ntp_seconds = unix_seconds + NTP_UNIX_EPOCH_OFFSET_SECONDS;
    let mut fraction = ((fraction_ms / 1000.0) * NTP_FRACTION_SCALE).round() as u64;

    if fraction >= (1_u64 << 32) {
        ntp_seconds += 1;
        fraction = 0;
    }

    bytes[0..4].copy_from_slice(&(ntp_seconds as u32).to_be_bytes());
    bytes[4..8].copy_from_slice(&(fraction as u32).to_be_bytes());
    Ok(())
}

fn calculate_sntp_metrics(t1_ms: f64, t2_ms: f64, t3_ms: f64, t4_ms: f64) -> (f64, f64, f64) {
    let offset_ms = ((t2_ms - t1_ms) + (t3_ms - t4_ms)) / 2.0;
    let delay_ms = ((t4_ms - t1_ms) - (t3_ms - t2_ms)).max(0.0);
    let estimated_error_ms = (delay_ms / 2.0).max(1.0);

    (offset_ms, delay_ms, estimated_error_ms)
}

fn validate_sntp_response(
    response: &[u8],
    request_transmit_timestamp: &[u8],
) -> Result<(), String> {
    if response.len() < NTP_PACKET_LEN {
        return Err(format!(
            "returned a short NTP packet: {} bytes",
            response.len()
        ));
    }

    let leap_indicator = response[0] >> 6;
    if leap_indicator == NTP_LEAP_UNSYNCHRONIZED {
        return Err("returned an unsynchronized NTP packet".to_string());
    }

    let mode = response[0] & 0b0000_0111;
    if mode != NTP_MODE_SERVER {
        return Err(format!("returned NTP mode {mode}, expected server mode 4"));
    }

    let stratum = response[1];
    if !(1..=15).contains(&stratum) {
        return Err(format!("returned invalid NTP stratum {stratum}"));
    }

    if response[24..32] != request_transmit_timestamp[..8] {
        return Err(
            "returned an NTP originate timestamp that does not match the request".to_string(),
        );
    }

    read_ntp_timestamp_ms(&response[32..40])
        .map_err(|error| format!("receive timestamp failed: {error}"))?;
    read_ntp_timestamp_ms(&response[40..48])
        .map_err(|error| format!("transmit timestamp failed: {error}"))?;

    Ok(())
}

pub(super) fn query_ntp_source(source_name: &str, host: &str) -> Result<TimeSyncResponse, String> {
    let socket = UdpSocket::bind("0.0.0.0:0")
        .map_err(|error| format!("{source_name} UDP bind failed: {error}"))?;

    socket
        .set_read_timeout(Some(Duration::from_secs(4)))
        .map_err(|error| format!("{source_name} read timeout setup failed: {error}"))?;
    socket
        .set_write_timeout(Some(Duration::from_secs(4)))
        .map_err(|error| format!("{source_name} write timeout setup failed: {error}"))?;
    socket
        .connect(host)
        .map_err(|error| format!("{source_name} connect failed: {error}"))?;

    let mut request = [0_u8; NTP_PACKET_LEN];
    request[0] = 0x1b;
    let t1_ms = now_ms()? as f64;
    write_ntp_timestamp_ms(t1_ms, &mut request[40..48])
        .map_err(|error| format!("{source_name} request timestamp failed: {error}"))?;

    socket
        .send(&request)
        .map_err(|error| format!("{source_name} request send failed: {error}"))?;

    let mut response = [0_u8; NTP_PACKET_LEN];
    let received = socket
        .recv(&mut response)
        .map_err(|error| format!("{source_name} response receive failed: {error}"))?;
    let t4_ms = now_ms()? as f64;

    validate_sntp_response(&response[..received], &request[40..48])
        .map_err(|error| format!("{source_name} {error}"))?;

    let t2_ms = read_ntp_timestamp_ms(&response[32..40])
        .map_err(|error| format!("{source_name} receive timestamp failed: {error}"))?;
    let t3_ms = read_ntp_timestamp_ms(&response[40..48])
        .map_err(|error| format!("{source_name} transmit timestamp failed: {error}"))?;
    let (offset_ms, delay_ms, estimated_error_ms) =
        calculate_sntp_metrics(t1_ms, t2_ms, t3_ms, t4_ms);

    Ok(TimeSyncResponse {
        offset_ms,
        delay_ms,
        estimated_error_ms,
        source_name: source_name.to_string(),
        source_host: host.to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_response_packet() -> ([u8; NTP_PACKET_LEN], [u8; 8]) {
        let mut request_timestamp = [0_u8; 8];
        write_ntp_timestamp_ms(1_700_000_000_000.0, &mut request_timestamp).unwrap();

        let mut packet = [0_u8; NTP_PACKET_LEN];
        packet[0] = 0b00_100_100;
        packet[1] = 2;
        packet[24..32].copy_from_slice(&request_timestamp);
        write_ntp_timestamp_ms(1_700_000_000_100.0, &mut packet[32..40]).unwrap();
        write_ntp_timestamp_ms(1_700_000_000_120.0, &mut packet[40..48]).unwrap();

        (packet, request_timestamp)
    }

    #[test]
    fn ntp_timestamp_round_trips_unix_milliseconds() {
        let source_ms = 1_700_000_000_123.0;
        let mut bytes = [0_u8; 8];

        write_ntp_timestamp_ms(source_ms, &mut bytes).expect("timestamp write should succeed");
        let parsed_ms = read_ntp_timestamp_ms(&bytes).expect("timestamp read should succeed");

        assert!((parsed_ms - source_ms).abs() < 0.001);
    }

    #[test]
    fn calculates_sntp_offset_and_delay_from_four_timestamps() {
        let (offset_ms, delay_ms, estimated_error_ms) =
            calculate_sntp_metrics(1_000.0, 1_120.0, 1_130.0, 1_210.0);

        assert_eq!(offset_ms, 20.0);
        assert_eq!(delay_ms, 200.0);
        assert_eq!(estimated_error_ms, 100.0);
    }

    #[test]
    fn accepts_valid_sntp_response_packet() {
        let (packet, request_timestamp) = valid_response_packet();

        assert!(validate_sntp_response(&packet, &request_timestamp).is_ok());
    }

    #[test]
    fn rejects_wrong_server_mode() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[0] = 0b00_100_011;

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("mode"));
    }

    #[test]
    fn rejects_unsynchronized_leap_indicator() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[0] = 0b11_100_100;

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("unsynchronized"));
    }

    #[test]
    fn rejects_invalid_stratum() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[1] = 0;

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("stratum"));
    }

    #[test]
    fn rejects_originate_timestamp_mismatch() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[24] ^= 0xff;

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("originate timestamp"));
    }

    #[test]
    fn rejects_zero_receive_timestamp() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[32..40].fill(0);

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("receive timestamp"));
    }

    #[test]
    fn rejects_zero_transmit_timestamp() {
        let (mut packet, request_timestamp) = valid_response_packet();
        packet[40..48].fill(0);

        assert!(validate_sntp_response(&packet, &request_timestamp)
            .unwrap_err()
            .contains("transmit timestamp"));
    }
}
