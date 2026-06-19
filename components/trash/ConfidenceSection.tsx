export default function ConfidenceSection({
  confidence,
}: {
  confidence: number;
}) {
  const pct = Math.round(confidence * 100);
  const level = pct >= 85 ? "tinggi" : pct >= 60 ? "sedang" : "rendah";
  const color = pct >= 85 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
  const barStyle = { width: `${pct}%`, background: color };
  const labelStyle = { color };
  return (
    <section className="confidence">
      <h3>Tingkat Keyakinan Model</h3>
      <div className="confidence-bar">
        <div className="confidence-fill" style={barStyle} />
      </div>
      <p>
        <strong style={labelStyle}>{pct}%</strong> — keyakinan {level}
        {level === "rendah" && " (sebaiknya ditinjau ulang)"}
      </p>
    </section>
  );
}
