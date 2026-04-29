type DatePanelProps = {
  dateText: string;
  tagText: string;
  sunLine: string;
};

export default function DatePanel({ dateText, tagText, sunLine }: DatePanelProps) {
  return (
    <>
      <section className="date-panel" aria-label="日期信息">
        <div className="date-line">{dateText}</div>
        <div className="tag-line">{tagText}</div>
      </section>

      <div className="sun-line">{sunLine}</div>
    </>
  );
}
