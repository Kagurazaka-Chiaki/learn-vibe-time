use chrono::{DateTime, NaiveDateTime};
use serde::Serialize;
use serde_json::Value;
use std::net::UdpSocket;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeSyncResponse {
    utc_ms: i64,
    captured_at_ms: i64,
    precision_ms: f64,
    source_name: String,
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
    let request_start_ms = now_ms()?;
    let request_start_mono = std::time::Instant::now();
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
    socket
        .send(&request)
        .map_err(|error| format!("{} request send failed: {error}", source.name))?;

    let mut response = [0_u8; 48];
    let received = socket
        .recv(&mut response)
        .map_err(|error| format!("{} response receive failed: {error}", source.name))?;
    let request_end_ms = now_ms()?;

    if received < response.len() {
        return Err(format!("{} returned a short NTP packet: {received} bytes", source.name));
    }

    let seconds = u32::from_be_bytes([response[40], response[41], response[42], response[43]]) as u64;
    let fraction = u32::from_be_bytes([response[44], response[45], response[46], response[47]]) as u64;

    if seconds < NTP_UNIX_EPOCH_OFFSET_SECONDS {
        return Err(format!("{} returned a timestamp before Unix epoch", source.name));
    }

    let unix_seconds = seconds - NTP_UNIX_EPOCH_OFFSET_SECONDS;
    let fraction_ms = (fraction * 1000) >> 32;
    let utc_ms = (unix_seconds * 1000 + fraction_ms) as i64;
    let round_trip_ms = request_start_mono.elapsed().as_secs_f64() * 1000.0;

    Ok(TimeSyncResponse {
        utc_ms,
        captured_at_ms: request_start_ms + ((request_end_ms - request_start_ms) / 2),
        precision_ms: (round_trip_ms / 2.0).max(1.0),
        source_name: source.name.to_string(),
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

    Ok(TimeSyncResponse {
        utc_ms,
        captured_at_ms: request_start_ms + ((request_end_ms - request_start_ms) / 2),
        precision_ms: (round_trip_ms / 2.0).max(1.0),
        source_name: source.name.to_string(),
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
