import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TypeIcon, TypeBadge, StatusBadge } from "../../components/Badge";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { opportunityApi } from "../../services/api";
import { formatDate, getStatus } from "../../utils/format";

const chips = [
  { label: "All", value: "" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Workshop", value: "workshop" },
  { label: "Competition", value: "competition" },
  { label: "Internship", value: "internship" },
  { label: "Event", value: "event" },
];

export default function ManageOpportunities() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const type = params.get("type") ?? "";

  const [searchText, setSearchText] = useState(search);
  useEffect(() => setSearchText(search), [search]);

  const { data, loading, error, reload } = useFetch(
    () => opportunityApi.list({ search, type }),
    [search, type]
  );

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This also removes its applications and saved copies.`)) return;
    try {
      await opportunityApi.remove(item._id);
      reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Manage Opportunities</h1>
          <p>View, edit or delete all opportunities posted on the platform.</p>
        </div>
        <Link to="/admin/opportunities/add" className="btn btn-primary btn-sm">
          <i className="fa-solid fa-plus" /> Add Opportunity
        </Link>
      </div>

      <div className="toolbar">
        <form
          className="search-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter("search", searchText.trim());
          }}
        >
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search opportunities..."
            aria-label="Search opportunities"
          />
        </form>
        <div className="chips">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              className={`chip ${type === c.value ? "active" : ""}`}
              onClick={() => setFilter("type", c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {data && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Organization</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.opportunities.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <div className="cell-main">
                        <TypeIcon type={o.type} />
                        <div>
                          <strong>{o.title}</strong>
                          <small>{o.location} · <span className="cap">{o.mode}</span></small>
                        </div>
                      </div>
                    </td>
                    <td><TypeBadge type={o.type} /></td>
                    <td>{o.organization}</td>
                    <td>{formatDate(o.deadline)}</td>
                    <td><StatusBadge status={getStatus(o.deadline)} /></td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/admin/opportunities/edit/${o._id}`} className="icon-action" aria-label={`Edit ${o.title}`}>
                          <i className="fa-solid fa-pen" />
                        </Link>
                        <button type="button" className="icon-action danger" aria-label={`Delete ${o.title}`} onClick={() => handleDelete(o)}>
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.count === 0 && (
                  <tr><td colSpan={6} className="text-muted">No opportunities found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <span>Showing {data.count} {data.count === 1 ? "opportunity" : "opportunities"}</span>
          </div>
        </div>
      )}
    </>
  );
}
