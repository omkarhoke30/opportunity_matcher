import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import useSaved from "../../hooks/useSaved";
import { useAuth } from "../../context/AuthContext";
import { profileApi, opportunityApi, applicationApi } from "../../services/api";
import { getInitials } from "../../utils/format";

export default function Profile() {
  const { user } = useAuth();
  const profile = useFetch(() => profileApi.get(), []);
  const opps = useFetch(() => opportunityApi.list(), []);
  const apps = useFetch(() => applicationApi.list(), []);
  const { saved, loading: savedLoading } = useSaved();

  if (profile.loading || opps.loading || apps.loading || savedLoading) return <Loader />;

  const error = profile.error || opps.error || apps.error;
  if (error) return <ErrorMessage message={error} onRetry={profile.reload} />;

  const p = profile.data.profile;

  return (
    <>
      <div className="page-head">
        <h1>My Profile</h1>
      </div>

      <section className="card profile-card">
        <span className="avatar lg">{getInitials(user.name)}</span>
        <div>
          <h2>{user.name}</h2>
          <ul>
            <li><i className="fa-regular fa-envelope" /> {user.email}</li>
            <li><i className="fa-solid fa-id-badge" /> Student ID: STU-{user.id.slice(-6).toUpperCase()}</li>
            {p.phone && <li><i className="fa-solid fa-phone" /> {p.phone}</li>}
          </ul>
        </div>
        <Link to="/student/profile/edit" className="btn btn-outline btn-sm">
          <i className="fa-solid fa-pen" /> Edit Profile
        </Link>
      </section>

      <div className="stats-grid three">
        <StatCard icon="fa-bullseye" value={opps.data.count} label="Opportunities Found" color="blue" />
        <StatCard icon="fa-bookmark" value={saved.length} label="Saved" color="cyan" />
        <StatCard icon="fa-paper-plane" value={apps.data.count} label="Applications" color="purple" />
      </div>

      <div className="profile-grid">
        <div className="stack">
          <div className="card">
            <h3>About Me</h3>
            <p>{p.bio || "You haven't added a bio yet."}</p>
          </div>
          <div className="card">
            <h3>Education</h3>
            <p>{p.education || "Not added yet."}</p>
            {p.branch && <p className="text-muted">Branch: {p.branch}</p>}
          </div>
          <div className="card">
            <h3>Projects</h3>
            {p.projects.length ? (
              <div className="tags">{p.projects.map((x) => <span className="tag" key={x}>{x}</span>)}</div>
            ) : (
              <p>No projects added yet.</p>
            )}
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <h3>Skills</h3>
            {p.skills.length ? (
              <div className="tags">{p.skills.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            ) : (
              <p>No skills added yet.</p>
            )}
          </div>
          <div className="card">
            <h3>Interests</h3>
            {p.interests.length ? (
              <div className="tags">{p.interests.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            ) : (
              <p>No interests added yet.</p>
            )}
          </div>
          <div className="card">
            <h3>Preferred Mode</h3>
            <div className="tags">
              <span className="tag cap"><i className="fa-solid fa-globe" />&nbsp;{p.preferredMode}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
