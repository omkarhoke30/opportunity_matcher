import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { TypeIcon } from "../../components/Badge";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../services/api";
import { opportunityTypes, typeColors } from "../../data/constants";
import { formatDate, getGreeting } from "../../utils/format";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(() => adminApi.stats(), []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const { stats, recentOpportunities } = data;
  const total = stats.byType.reduce((sum, t) => sum + t.count, 0);

  // Each donut segment is a circle stroke: its length is its share of 100 (the circle's circumference)
  let used = 0;
  const segments = stats.byType.map((t) => {
    const share = (t.count / total) * 100;
    const segment = { ...t, share, offset: 25 - used };
    used += share;
    return segment;
  });

  return (
    <>
      <section className="banner">
        <div>
          <h1>{getGreeting()}, {user.name.split(" ")[0]}! 👋</h1>
          <p>Here's an overview of the platform activity and opportunities.</p>
        </div>
        <i className="fa-solid fa-chart-line banner-icon" />
      </section>

      <div className="stats-grid">
        <StatCard icon="fa-bullseye" value={stats.totalOpportunities} label="Total Opportunities" color="blue" />
        <StatCard icon="fa-users" value={stats.totalStudents} label="Total Students" color="green" />
        <StatCard icon="fa-file-lines" value={stats.totalApplications} label="Total Applications" color="purple" />
        <StatCard icon="fa-hourglass-half" value={stats.pendingApplications} label="Pending Applications" color="orange" />
      </div>

      <div className="admin-two">
        <section className="card">
          <h3 className="card-title">Opportunities by Type</h3>
          {total === 0 ? (
            <p className="text-muted">No opportunities yet. Add your first one to see the chart.</p>
          ) : (
            <div className="donut-wrap">
              <div className="donut">
                <svg viewBox="0 0 42 42" role="img" aria-label="Opportunities by type">
                  <circle cx="21" cy="21" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  {segments.map((s) => (
                    <circle
                      key={s.type}
                      cx="21"
                      cy="21"
                      r="15.9155"
                      fill="none"
                      stroke={typeColors[s.type]}
                      strokeWidth="5"
                      strokeDasharray={`${s.share} ${100 - s.share}`}
                      strokeDashoffset={s.offset}
                    />
                  ))}
                </svg>
                <div className="donut-center">
                  <strong>{total}</strong>
                  <span>Total</span>
                </div>
              </div>

              <ul className="legend">
                {segments.map((s) => (
                  <li key={s.type}>
                    <span className="swatch" style={{ background: typeColors[s.type] }} />
                    {opportunityTypes[s.type].label}s
                    <span>{s.count} ({Math.round(s.share)}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h3 className="card-title">Recent Opportunities</h3>
            <Link to="/admin/opportunities" className="link">View All</Link>
          </div>
          {recentOpportunities.length === 0 ? (
            <p className="text-muted">Nothing here yet.</p>
          ) : (
            <div className="recent-list">
              {recentOpportunities.map((o) => (
                <Link key={o._id} to={`/admin/opportunities/edit/${o._id}`} className="recent-item">
                  <TypeIcon type={o.type} />
                  <div>
                    <strong>{o.title}</strong>
                    <small>{opportunityTypes[o.type].label}</small>
                  </div>
                  <small>{formatDate(o.deadline)}</small>
                  <i className="fa-solid fa-chevron-right" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
