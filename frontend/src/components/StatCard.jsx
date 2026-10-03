// color: blue | green | purple | orange | cyan
export default function StatCard({ icon, value, label, color = "blue", trend }) {
  return (
    <div className="stat-card" data-color={color}>
      <span className="stat-icon">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      {trend && (
        <em className="stat-trend">
          <i className="fa-solid fa-arrow-up" /> {trend}
        </em>
      )}
    </div>
  );
}
