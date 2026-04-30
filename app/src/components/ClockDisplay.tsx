type ClockDisplayProps = {
  dayPeriod: string;
  time: string;
  label: string;
};

export default function ClockDisplay({ dayPeriod, time, label }: ClockDisplayProps) {
  return (
    <time className="clock-display" aria-live="off" aria-label={`当前时间 ${label}`}>
      {dayPeriod ? <span className="clock-day-period">{dayPeriod}</span> : null}
      <span className="clock-time-value">{time}</span>
    </time>
  );
}
