import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { TypeBadge, StatusBadge } from "../../components/Badge";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import useSaved from "../../hooks/useSaved";
import { useAuth } from "../../context/AuthContext";
import { opportunityApi, applicationApi, profileApi } from "../../services/api";
import { formatDate, getStatus, getGreeting, getDaysLeft } from "../../utils/format";

export default function StudentDashboard() {
  const { user } = useAuth();
  const opps = useFetch(() => opportunityApi.list(), []);
  const apps = useFetch(() => applicationApi.list(), []);
  const profile = useFetch(() => profileApi.get(), []);
  const { saved, isSaved, toggleSave, loading: savedLoading } = useSaved();

  if (opps.loading || apps.loading || profile.loading || savedLoading) return <Loader />;

  const error = opps.error || apps.error || profile.error;
  if (error) return <ErrorMessage message={error} />;

  const opportunities = opps.data.opportunities;
  const open = opportunities.filter((o) => getStatus(o.deadline) === "active");

  // "Recommended": open opportunities that share the most skills with your profile
  const mySkills = profile.data.profile.skills.map((s) => s.toLowerCase());
  const score = (o) => o.skills.filter((s) => mySkills.includes(s.toLowerCase())).length;
  const recommended = [...open].sort((a, b) => score(b) - score(a)).slice(0, 3);

  const upcoming = open.filter((o) => {
    const days = getDaysLeft(o.deadline);
    return days !== null && days <= 30;
  }).length;

  return (
    <>
      <section className="banner">
        <div>
          <h1>{getGreeting()}, {user.name.split(" ")[0]}! 👋</h1>
          <p>Here's what's happening with your opportunities and applications.</p>
        </div>
        <img src="/hero.webp" alt="" className="banner-img" />
      </section>

      <div className="stats-grid">
        <StatCard icon="fa-bullseye" value={opportunities.length} label="Total Opportunities" color="blue" />
        <StatCard icon="fa-bookmark" value={saved.length} label="Saved Opportunities" color="green" />
        <StatCard icon="fa-paper-plane" value={apps.data.count} label="Applied" color="purple" />
        <StatCard icon="fa-hourglass-half" value={upcoming} label="Upcoming Deadlines" color="orange" />
      </div>

      <div className="section-head">
        <h2>Recommended For You</h2>
        <Link to="/student/opportunities" className="link">
          View All <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
      {recommended.length === 0 ? (
        <div className="card empty">
          <h3>No open opportunities yet</h3>
          <p className="text-muted">New listings will appear here as soon as admins add them.</p>
        </div>
      ) : (
        <div className="opp-grid">
          {recommended.map((o) => (
            <OpportunityCard key={o._id} item={o} saved={isSaved(o._id)} onToggleSave={toggleSave} />
          ))}
        </div>
      )}

      <div className="section-head">
        <h2>Recent Opportunities</h2>
      </div>
      <div className="card table-card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Organization</th>
                <th>Type</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.slice(0, 4).map((o) => (
                <tr key={o._id}>
                  <td><Link to={`/student/opportunity/${o._id}`} className="row-link">{o.title}</Link></td>
                  <td>{o.organization}</td>
                  <td><TypeBadge type={o.type} /></td>
                  <td>{formatDate(o.deadline)}</td>
                  <td><StatusBadge status={getStatus(o.deadline)} /></td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr><td colSpan={5} className="text-muted">No opportunities have been added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
