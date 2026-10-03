import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TypeIcon, TypeBadge } from "../../components/Badge";
import { Loader } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import useSaved from "../../hooks/useSaved";
import { opportunityApi, applicationApi } from "../../services/api";
import { formatDate, getDaysLeft } from "../../utils/format";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "requirements", label: "Requirements" },
  { key: "organizer", label: "About Organizer" },
];

// key={id}: opening another opportunity starts with fresh state (tab, "applied" notice...)
export default function OpportunityDetails() {
  const { id } = useParams();
  return <DetailsContent key={id} id={id} />;
}

function DetailsContent({ id }) {
  const [tab, setTab] = useState("overview");
  const [applying, setApplying] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [message, setMessage] = useState("");

  const opp = useFetch(() => opportunityApi.get(id), [id]);
  const apps = useFetch(() => applicationApi.list(), []);
  const { isSaved, toggleSave } = useSaved();

  if (opp.loading) return <Loader />;

  if (opp.error) {
    return (
      <div className="card empty">
        <h2>Opportunity not found</h2>
        <p className="text-muted">It may have been removed or the link is incorrect.</p>
        <Link to="/student/opportunities" className="btn btn-primary">Browse opportunities</Link>
      </div>
    );
  }

  const item = opp.data.opportunity;
  const saved = isSaved(item._id);
  const days = getDaysLeft(item.deadline);
  const closed = days !== null && days < 0;
  const alreadyApplied =
    justApplied || apps.data?.applications.some((a) => a.opportunity._id === item._id);

  const handleApply = async () => {
    setApplying(true);
    setMessage("");
    try {
      await applicationApi.apply(item._id);
      setJustApplied(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Link to="/student/opportunities" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Back
      </Link>

      <section className="card detail-head">
        <TypeIcon type={item.type} large />
        <div className="detail-title">
          <TypeBadge type={item.type} />
          <h1>{item.title}</h1>
          <p className="text-muted">{item.organization}</p>
          <div className="detail-meta">
            <span><i className="fa-solid fa-globe" /> <span className="cap">{item.mode}</span></span>
            <span><i className="fa-regular fa-calendar" /> Apply by: {formatDate(item.deadline)}</span>
            <span><i className="fa-solid fa-location-dot" /> {item.location}</span>
          </div>
        </div>

        <div className="detail-actions">
          {alreadyApplied ? (
            <button className="btn btn-primary" type="button" disabled>
              <i className="fa-solid fa-check" /> Applied
            </button>
          ) : closed ? (
            <button className="btn btn-primary" type="button" disabled>Applications closed</button>
          ) : (
            <button className="btn btn-primary" type="button" onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
          <button className="btn btn-outline" type="button" onClick={() => toggleSave(item)}>
            <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </section>

      {message && <div className="alert error detail-gap" role="alert">{message}</div>}
      {alreadyApplied && (
        <div className="alert success detail-gap" role="status">
          Your application is recorded.{" "}
          {item.registrationLink && (
            <>
              Finish registration on the organizer's page:{" "}
              <a href={item.registrationLink} target="_blank" rel="noreferrer" className="link">Open registration page</a>
            </>
          )}
        </div>
      )}

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="detail-body">
        <div className="card">
          {tab === "overview" && (
            <>
              <h3>About this opportunity</h3>
              <p>{item.description}</p>
              {item.skills.length > 0 && (
                <>
                  <h4>Skills Required</h4>
                  <div className="tags">
                    {item.skills.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                </>
              )}
              {item.eligibility && (
                <>
                  <h4>Eligibility</h4>
                  <p>{item.eligibility}</p>
                </>
              )}
            </>
          )}

          {tab === "requirements" && (
            <>
              <h3>Requirements</h3>
              <ul className="check-list">
                {item.skills.map((s) => (
                  <li key={s}><i className="fa-solid fa-circle-check" /> Working knowledge of {s}</li>
                ))}
                {item.eligibility && (
                  <li><i className="fa-solid fa-circle-check" /> {item.eligibility}</li>
                )}
                {item.skills.length === 0 && !item.eligibility && (
                  <li className="text-muted">No specific requirements were listed.</li>
                )}
              </ul>
            </>
          )}

          {tab === "organizer" && (
            <>
              <h3>{item.organization}</h3>
              <p>Organizer details will appear here once organization profiles are added.</p>
            </>
          )}
        </div>

        <aside className="card">
          <h3>Key Details</h3>
          <dl className="kv">
            <dt>Type</dt>
            <dd className="cap">{item.type}</dd>
            <dt>Mode</dt>
            <dd className="cap">{item.mode}</dd>
            <dt>Location</dt>
            <dd>{item.location}</dd>
            <dt>Start Date</dt>
            <dd>{formatDate(item.startDate)}</dd>
            <dt>Deadline</dt>
            <dd>{formatDate(item.deadline)}</dd>
            {item.registrationLink && (
              <>
                <dt>Registration Link</dt>
                <dd><a href={item.registrationLink} target="_blank" rel="noreferrer" className="link">{item.registrationLink}</a></dd>
              </>
            )}
          </dl>
        </aside>
      </div>
    </>
  );
}
