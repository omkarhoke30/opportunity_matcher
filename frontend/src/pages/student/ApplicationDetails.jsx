import { Link, useParams } from "react-router-dom";
import { TypeIcon, TypeBadge, StatusBadge } from "../../components/Badge";
import { Loader } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { applicationApi } from "../../services/api";
import { formatDate } from "../../utils/format";

// How far along the timeline each status is (index of the last completed step)
const reached = { applied: 0, shortlisted: 1, accepted: 2, rejected: 2 };

export default function ApplicationDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => applicationApi.get(id), [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card empty">
        <h2>Application not found</h2>
        <Link to="/student/applications" className="btn btn-primary">Back to applications</Link>
      </div>
    );
  }

  const app = data.application;
  const item = app.opportunity;

  const finalLabel =
    app.status === "accepted" ? "Accepted" : app.status === "rejected" ? "Not selected" : "Final result";
  const steps = ["Application submitted", "Shortlisted", finalLabel];

  return (
    <>
      <Link to="/student/applications" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Back to applications
      </Link>

      <section className="card detail-head">
        <TypeIcon type={item.type} large />
        <div className="detail-title">
          <TypeBadge type={item.type} />
          <h1>{item.title}</h1>
          <p className="text-muted">{item.organization}</p>
        </div>
        <StatusBadge status={app.status} />
      </section>

      <div className="detail-body detail-gap">
        <div className="card">
          <h3>Application Progress</h3>
          <ol className="timeline">
            {steps.map((label, i) => (
              <li key={label} className={i <= reached[app.status] ? "done" : ""}>
                <span className="step-dot"><i className="fa-solid fa-check" /></span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
        </div>

        <aside className="card">
          <h3>Application Details</h3>
          <dl className="kv">
            <dt>Applied On</dt>
            <dd>{formatDate(app.appliedAt)}</dd>
            <dt>Deadline</dt>
            <dd>{formatDate(item.deadline)}</dd>
            <dt>Mode</dt>
            <dd className="cap">{item.mode}</dd>
            <dt>Location</dt>
            <dd>{item.location}</dd>
          </dl>
          <Link to={`/student/opportunity/${item._id}`} className="btn btn-outline btn-block detail-link">
            View opportunity
          </Link>
        </aside>
      </div>
    </>
  );
}
