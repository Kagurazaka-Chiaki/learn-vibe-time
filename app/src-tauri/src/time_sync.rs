use chrono::{DateTime, NaiveDateTime};
use serde::Serialize;
use serde_json::Value;
use std::net::UdpSocket;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeSyncResponse {
    offset_ms: f64,
    delay_ms: f64,
    estimated_error_ms: f64,
    source_name: String,
    source_host: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeSourceOption {
    id: &'static str,
    name: &'static str,
    kind: &'static str,
}

#[derive(Clone, Copy)]
struct TimeSource {
    id: &'static str,
    name: &'static str,
    kind: TimeSourceKind,
}

#[derive(Clone, Copy)]
enum TimeSourceKind {
    HttpJson { url: &'static str },
    Ntp { host: &'static str },
}

const TIME_SOURCES: &[TimeSource] = &[
    TimeSource {
        id: "au-pool",
        name: "澳大利亚 NTP Pool",
        kind: TimeSourceKind::Ntp {
            host: "au.pool.ntp.org:123",
        },
    },
    TimeSource {
        id: "cloudflare",
        name: "Cloudflare Time",
        kind: TimeSourceKind::Ntp {
            host: "time.cloudflare.com:123",
        },
    },
    TimeSource {
        id: "google",
        name: "Google Public NTP",
        kind: TimeSourceKind::Ntp {
            host: "time.google.com:123",
        },
    },
    TimeSource {
        id: "cn-pool",
        name: "中国 NTP Pool",
        kind: TimeSourceKind::Ntp {
            host: "cn.pool.ntp.org:123",
        },
    },
    TimeSource {
        id: "tencent",
        name: "腾讯云 NTP",
        kind: TimeSourceKind::Ntp {
            host: "ntp.tencent.com:123",
        },
    },
    TimeSource {
        id: "aliyun",
        name: "阿里云 NTP",
        kind: TimeSourceKind::Ntp {
            host: "ntp.aliyun.com:123",
        },
    },
    TimeSource {
        id: "global-pool",
        name: "全球 NTP Pool",
        kind: TimeSourceKind::Ntp {
            host: "pool.ntp.org:123",
        },
    },
    TimeSource {
        id: "ntsc",
        name: "国家授时中心 NTP",
        kind: TimeSourceKind::Ntp {
            host: "ntp.ntsc.ac.cn:123",
        },
    },
    TimeSource {
        id: "worldtimeapi",
        name: "worldtimeapi",
        kind: TimeSourceKind::HttpJson {
            url: "https://worldtimeapi.org/api/timezone/Etc/UTC",
        },
    },
    TimeSource {
        id: "timeapi",
        name: "timeapi",
        kind: TimeSourceKind::HttpJson {
            url: "https://timeapi.io/api/Time/current/zone?timeZone=UTC",
        },
    },
];

const NTP_UNIX_EPOCH_OFFSET_SECONDS: u64 = 2_208_988_800;
const NTP_FRACTION_SCALE: f64 = 4_294_967_296.0;

fn source_kind_label(kind: TimeSourceKind) -> &'static str {
    match kind {
        TimeSourceKind::Ntp { .. } => "ntp",
        TimeSourceKind::HttpJson { .. } => "httpJson",
    }
}

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

fn parse_datetime_ms(value: &str) -> Option<i64> {
    if let Ok(parsed) = DateTime::parse_from_rfc3339(value) {
        return Some(parsed.timestamp_millis());
    }

    let without_z = value.trim_end_matches('Z');
    for format in [
        "%Y-%m-%dT%H:%M:%S%.f",
        "%Y-%m-%d %H:%M:%S%.f",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
    ] {
        if let Ok(parsed) = NaiveDateTime::parse_from_str(without_z, format) {
            return Some(parsed.and_utc().timestamp_millis());
        }
    }

    None
}

fn extract_epoch_ms(value: &Value) -> Option<i64> {
    match value {
        Value::Number(number) => {
            let numeric = number.as_f64()?;
            if numeric > 1e12 {
                Some(numeric.round() as i64)
            } else if numeric > 1e9 {
                Some((numeric * 1000.0).round() as i64)
            } else {
                None
            }
        }
        Value::String(text) => {
            if let Ok(numeric) = text.parse::<f64>() {
                if numeric > 1e12 {
                    return Some(numeric.round() as i64);
                }
                if numeric > 1e9 {
                    return Some((numeric * 1000.0).round() as i64);
                }
            }

            parse_datetime_ms(text)
        }
        Value::Object(map) => {
            for key in [
                "epochMs",
                "currentTimeMillis",
                "timestamp",
                "unixtime",
                "unixTime",
                "serverTime",
                "serverTimeMs",
                "datetime",
                "dateTime",
                "utc_datetime",
                "utcDateTime",
                "utcNow",
                "iso",
                "now",
            ] {
                if let Some(result) = map.get(key).and_then(extract_epoch_ms) {
                    return Some(result);
                }
            }

            map.values().find_map(extract_epoch_ms)
        }
        Value::Array(items) => items.iter().find_map(extract_epoch_ms),
        _ => None,
    }
}

fn query_ntp_source(source: &TimeSource, host: &str) -> Result<TimeSyncResponse, String> {
    let socket = UdpSocket::bind("0.0.0.0:0").map_err(|error| format!("{} UDP bind failed: {error}", source.name))?;

    socket
        .set_read_timeout(Some(Duration::from_secs(4)))
        .map_err(|error| format!("{} read timeout setup failed: {error}", source.name))?;
    socket
        .set_write_timeout(Some(Duration::from_secs(4)))
        .map_err(|error| format!("{} write timeout setup failed: {error}", source.name))?;
    socket
        .connect(host)
        .map_err(|error| format!("{} connect failed: {error}", source.name))?;

    let mut request = [0_u8; 48];
    request[0] = 0x1b;
    let t1_ms = now_ms()? as f64;
    write_ntp_timestamp_ms(t1_ms, &mut request[40..48])
        .map_err(|error| format!("{} request timestamp failed: {error}", source.name))?;

    socket
        .send(&request)
        .map_err(|error| format!("{} request send failed: {error}", source.name))?;

    let mut response = [0_u8; 48];
    let received = socket
        .recv(&mut response)
        .map_err(|error| format!("{} response receive failed: {error}", source.name))?;
    let t4_ms = now_ms()? as f64;

    if received < response.len() {
        return Err(format!("{} returned a short NTP packet: {received} bytes", source.name));
    }

    let t2_ms = read_ntp_timestamp_ms(&response[32..40])
        .map_err(|error| format!("{} receive timestamp failed: {error}", source.name))?;
    let t3_ms = read_ntp_timestamp_ms(&response[40..48])
        .map_err(|error| format!("{} transmit timestamp failed: {error}", source.name))?;
    let (offset_ms, delay_ms, estimated_error_ms) = calculate_sntp_metrics(t1_ms, t2_ms, t3_ms, t4_ms);

    Ok(TimeSyncResponse {
        offset_ms,
        delay_ms,
        estimated_error_ms,
        source_name: source.name.to_string(),
        source_host: host.to_string(),
    })
}

async fn query_http_json_source(
    client: &reqwest::Client,
    source: &TimeSource,
    url: &str,
) -> Result<TimeSyncResponse, String> {
    let request_start_ms = now_ms()?;
    let request_start_mono = std::time::Instant::now();
    let response = client
        .get(url)
        .header("accept", "application/json")
        .send()
        .await
        .map_err(|error| format!("{} request failed: {error}", source.name))?;
    let request_end_ms = now_ms()?;
    let round_trip_ms = request_start_mono.elapsed().as_secs_f64() * 1000.0;

    let status = response.status();
    if !status.is_success() {
        return Err(format!("{} returned HTTP {}", source.name, status));
    }

    let payload = response
        .json::<Value>()
        .await
        .map_err(|error| format!("{} JSON parse failed: {error}", source.name))?;
    let utc_ms = extract_epoch_ms(&payload)
        .ok_or_else(|| format!("{} response did not contain a recognizable timestamp", source.name))?;
    let captured_at_ms = request_start_ms + ((request_end_ms - request_start_ms) / 2);
    let delay_ms = round_trip_ms.max(0.0);

    Ok(TimeSyncResponse {
        offset_ms: utc_ms as f64 - captured_at_ms as f64,
        delay_ms,
        estimated_error_ms: (delay_ms / 2.0).max(1.0),
        source_name: source.name.to_string(),
        source_host: url.to_string(),
    })
}

#[tauri::command]
pub fn list_time_sources() -> Vec<TimeSourceOption> {
    TIME_SOURCES
        .iter()
        .map(|source| TimeSourceOption {
            id: source.id,
            name: source.name,
            kind: source_kind_label(source.kind),
        })
        .collect()
}

#[tauri::command]
pub async fn sync_utc_time(source_id: Option<String>) -> Result<TimeSyncResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(8))
        .build()
        .map_err(|error| format!("failed to create time sync client: {error}"))?;

    let mut errors = Vec::new();
    let selected_source = source_id
        .as_deref()
        .filter(|id| !id.is_empty() && *id != "auto")
        .map(|id| {
            TIME_SOURCES
                .iter()
                .find(|source| source.id == id)
                .ok_or_else(|| format!("unknown time source: {id}"))
        })
        .transpose()?;

    let sources: Vec<&TimeSource> = match selected_source {
        Some(source) => vec![source],
        None => TIME_SOURCES.iter().collect(),
    };

    for source in sources {
        let result = match source.kind {
            TimeSourceKind::Ntp { host } => query_ntp_source(source, host),
            TimeSourceKind::HttpJson { url } => query_http_json_source(&client, source, url).await,
        };

        match result {
            Ok(response) => return Ok(response),
            Err(error) => errors.push(error),
        }
    }

    Err(format!("UTC time synchronization failed: {}", errors.join("; ")))
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
