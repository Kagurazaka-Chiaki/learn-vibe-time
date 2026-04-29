use chrono::{DateTime, NaiveDateTime};
use serde::Serialize;
use serde_json::Value;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeSyncResponse {
    utc_ms: i64,
    captured_at_ms: i64,
    precision_ms: f64,
    source_name: String,
}

struct TimeSource {
    name: &'static str,
    url: &'static str,
}

const TIME_SOURCES: &[TimeSource] = &[
    TimeSource {
        name: "worldtimeapi",
        url: "https://worldtimeapi.org/api/timezone/Etc/UTC",
    },
    TimeSource {
        name: "timeapi",
        url: "https://timeapi.io/api/Time/current/zone?timeZone=UTC",
    },
];

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

#[tauri::command]
pub async fn sync_utc_time() -> Result<TimeSyncResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(8))
        .build()
        .map_err(|error| format!("failed to create time sync client: {error}"))?;

    let mut errors = Vec::new();

    for source in TIME_SOURCES {
        let request_start_ms = now_ms()?;
        let request_start_mono = std::time::Instant::now();
        let response_result = client
            .get(source.url)
            .header("accept", "application/json")
            .send()
            .await;
        let request_end_ms = now_ms()?;
        let round_trip_ms = request_start_mono.elapsed().as_secs_f64() * 1000.0;

        match response_result {
            Ok(response) => {
                let status = response.status();
                if !status.is_success() {
                    errors.push(format!("{} returned HTTP {}", source.name, status));
                    continue;
                }

                match response.json::<Value>().await {
                    Ok(payload) => {
                        if let Some(utc_ms) = extract_epoch_ms(&payload) {
                            return Ok(TimeSyncResponse {
                                utc_ms,
                                captured_at_ms: request_start_ms + ((request_end_ms - request_start_ms) / 2),
                                precision_ms: (round_trip_ms / 2.0).max(1.0),
                                source_name: source.name.to_string(),
                            });
                        }

                        errors.push(format!("{} response did not contain a recognizable timestamp", source.name));
                    }
                    Err(error) => errors.push(format!("{} JSON parse failed: {error}", source.name)),
                }
            }
            Err(error) => errors.push(format!("{} request failed: {error}", source.name)),
        }
    }

    Err(format!("UTC time synchronization failed: {}", errors.join("; ")))
}
