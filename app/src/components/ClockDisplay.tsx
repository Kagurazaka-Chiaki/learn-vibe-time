type ClockDisplayProps = {
  clockText: string;
};

export default function ClockDisplay({ clockText }: ClockDisplayProps) {
  return (
    <time className="clock-display" aria-live="off" aria-label={`当前时间 ${clockText}`}>
      {clockText}
    </time>
  );
}
