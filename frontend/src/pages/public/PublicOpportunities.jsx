import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageBanner from "../../components/PageBanner";
import { TypeIcon, TypeBadge } from "../../components/Badge";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { opportunityApi } from "../../services/api";
import { opportunityTypes } from "../../data/constants";
import { formatDate } from "../../utils/format";

const filterTypes = ["hackathon", "internship", "competition", "workshop", "event"];

// The URL is the single source of truth: /opportunities?search=react&type=hackathon
export default function PublicOpportunities() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();

  const applied = {
    search: params.get("search") ?? "",
    type: params.get("type") ?? "",
    mode: params.get("mode") ?? "",
    deadline: params.get("deadline") ?? "",
    sort: params.get("sort") ?? "newest",
  };

  // "draft" holds what the sidebar shows until Apply is pressed
  const [draft, setDraft] = useState(applied);
  useEffect(() => {
    setDraft(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const { data, loading, error, reload } = useFetch(() => opportunityApi.list(applied), [params.toString()]);

  const applyFilters = (next) => {
    const query = {};
    Object.entries(next).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "newest")) query[key] = value;
    });
    setParams(query);
  };

  const selectedTypes = draft.type ? draft.type.split(",") : [];
  const toggleType = (type) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setDraft({ ...draft, type: next.join(",") });
  };

  const hasFilters = applied.search || applied.type || applied.mode || applied.deadline;
  const detailsLink = (id) => (user?.role === "student" ? `/student/opportunity/${id}` : "/login");

  return (
    <>
      <PageBanner
        title="Opportunities"
        subtitle="Explore a wide range of opportunities tailored for you."
        icon="fa-bullseye"
      />

      <section className="container opp-layout">
        <aside className="filter-panel card">
          <h3><i className="fa-solid fa-sliders" /> Filter</h3>

          <h4>Opportunity Type</h4>
          {filterTypes.map((t) => (
            <label key={t} className="check">
              <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)} />
              {opportunityTypes[t].label}s
            </label>
          ))}

          <h4>Mode</h4>
          <select className="input" value={draft.mode} onChange={(e) => setDraft({ ...draft, mode: e.target.value })}>
            <option value="">All modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <h4>Deadline</h4>
          <select className="input" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}>
            <option value="">Any time</option>
            <option value="active">Still open</option>
            <option value="week">Next 7 days</option>
            <option value="month">Next 30 days</option>
          </select>

          <div className="filter-actions">
            <button className="btn btn-outline btn-sm" type="button" onClick={() => setParams({})}>Reset</button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => applyFilters(draft)}>Apply</button>
          </div>
        </aside>

        <div>
          <div className="list-tools">
            <form
              className="search-bar"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters(draft);
              }}
            >
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                value={draft.search}
                onChange={(e) => setDraft({ ...draft, search: e.target.value })}
                placeholder="Search by title, organization or skill..."
                aria-label="Search opportunities"
              />
            </form>
            <select
              className="input"
              value={applied.sort}
              aria-label="Sort opportunities"
              onChange={(e) => applyFilters({ ...applied, sort: e.target.value })}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="deadline">Sort by: Deadline</option>
            </select>
          </div>

          {loading && <Loader text="Loading opportunities..." />}
          {error && <ErrorMessage message={error} onRetry={reload} />}

          {data && (
            <>
              <p className="result-note">
                {data.count} {data.count === 1 ? "opportunity" : "opportunities"} found
                {hasFilters && (
                  <button type="button" className="link" onClick={() => setParams({})}> Clear filters</button>
                )}
              </p>

              {data.count === 0 ? (
                <div className="card empty">
                  <h3>No opportunities match your filters</h3>
                  <p className="text-muted">Try a different keyword or clear the filters.</p>
                </div>
              ) : (
                <div className="opp-list">
                  {data.opportunities.map((o) => (
                    <article key={o._id} className="opp-row card">
                      <TypeIcon type={o.type} />
                      <div className="opp-row-main">
                        <h3>{o.title}</h3>
                        <p className="text-muted">{o.organization}</p>
                        <div className="opp-row-meta">
                          <TypeBadge type={o.type} />
                          <span><i className="fa-regular fa-calendar" /> {formatDate(o.deadline)}</span>
                          <span><i className="fa-solid fa-location-dot" /> {o.location}</span>
                        </div>
                      </div>
                      <div className="opp-row-side">
                        <Link to={detailsLink(o._id)} className="btn btn-primary btn-sm">
                          {user?.role === "student" ? "View Details" : "Apply Now"}
                        </Link>
                        <small className="text-muted">{o.eligibility}</small>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
