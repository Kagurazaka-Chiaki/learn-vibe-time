export type LocalDateParts = {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: string;
  minute: string;
  second: string;
};

export type ClockHourMode = "12" | "24";

export type FormatTimeOptions = {
  showSeconds?: boolean;
  showMilliseconds?: boolean;
  hourMode?: ClockHourMode;
};

export type ClockDisplayParts = {
  dayPeriod: string;
  time: string;
  text: string;
};

function normalizeHour(hour: string): string {
  return hour === "24" ? "00" : hour;
}

export function getLocalDateParts(date: Date, timeZone: string): LocalDateParts {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: map.weekday,
    hour: normalizeHour(map.hour),
    minute: map.minute,
    second: map.second,
  };
}

export function getIsoWeek(year: number, month: number, day: number): number {
  const working = new Date(Date.UTC(year, month - 1, day));
  const dayNum = working.getUTCDay() || 7;
  working.setUTCDate(working.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(working.getUTCFullYear(), 0, 1));
  return Math.ceil(((working.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getDayOfYear(year: number, month: number, day: number): number {
  const current = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 0));
  return Math.floor((current.getTime() - start.getTime()) / 86400000);
}

export function formatTimePartsInZone(date: Date, timeZone: string, options: FormatTimeOptions = {}): ClockDisplayParts {
  const showMilliseconds = options.showMilliseconds ?? false;
  const showSeconds = showMilliseconds || (options.showSeconds ?? true);
  const hourMode = options.hourMode ?? "24";
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
  };

  if (hourMode === "12") {
    formatOptions.hour12 = true;
  } else {
    formatOptions.hourCycle = "h23";
  }

  const parts = new Intl.DateTimeFormat("zh-CN", formatOptions).formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  const hour = hourMode === "24" ? normalizeHour(map.hour) : map.hour;
  const millisecondText = String(date.getMilliseconds()).padStart(3, "0");
  const time = showMilliseconds
    ? `${hour}:${map.minute}:${map.second}.${millisecondText}`
    : showSeconds ? `${hour}:${map.minute}:${map.second}` : `${hour}:${map.minute}`;
  const dayPeriod = map.dayPeriod ?? "";

  return {
    dayPeriod,
    time,
    text: dayPeriod ? `${dayPeriod} ${time}` : time,
  };
}

export function formatTimeInZone(date: Date, timeZone: string, options: FormatTimeOptions = {}): string {
  return formatTimePartsInZone(date, timeZone, options).text;
}

export function formatClockParts(date: Date, timeZone: string, options: FormatTimeOptions = {}): ClockDisplayParts {
  return formatTimePartsInZone(date, timeZone, { showSeconds: true, ...options });
}

export function formatClock(date: Date, timeZone: string, options: FormatTimeOptions = {}): string {
  return formatClockParts(date, timeZone, options).text;
}

export function formatCityTime(date: Date, timeZone: string, options: FormatTimeOptions = {}): string {
  return formatTimeInZone(date, timeZone, { showSeconds: false, ...options });
}

export function formatChineseDate(date: Date, timeZone: string): string {
  const parts = getLocalDateParts(date, timeZone);
  const week = getIsoWeek(parts.year, parts.month, parts.day);
  return `${parts.year}年${parts.month}月${parts.day}日${parts.weekday}， 第${week}周`;
}

export function formatHm(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return `${normalizeHour(map.hour)}:${map.minute}`;
}

export function formatPrecision(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return "0.000";
  }

  return (ms / 1000).toFixed(3);
}

export function formatAbsoluteSeconds(ms: number): string {
  return (Math.abs(ms) / 1000).toFixed(1);
}
