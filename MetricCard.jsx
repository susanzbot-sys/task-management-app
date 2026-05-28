export default function MetricCard({ label, value }) {
  return (
    <section className="metric-card">
      <p>{label}</p>
      <h2>{value}</h2>
    </section>
  );
}
