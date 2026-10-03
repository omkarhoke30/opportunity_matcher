import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import OpportunityCard from "../../components/OpportunityCard";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import useSaved from "../../hooks/useSaved";
import { opportunityApi } from "../../services/api";

const chips = [
  { label: "All", value: "" },
  { label: "Hackathons", value: "hackathon" },
  { label: "Workshops", value: "workshop" },
  { label: "Competitions", value: "competition" },
  { label: "Internships", value: "internship" },
  { label: "Events", value: "event" },
];

// Filters live in the URL: /student/opportunities?search=react&type=hackathon
// The search box in the top bar sets "search" for you.
export default function StudentOpportunities() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const search = params.get("search") ?? "";
  const type = params.get("type") ?? "";
  const mode = params.get("mode") ?? "";
  const sort = params.get("sort") ?? "newest";

  const { data, loading, error, reload } = useFetch(
    () => opportunityApi.list({ search, type, mode, sort }),
    [search, type, mode, sort]
  );
  const { isSaved, toggleSave } = useSaved();

  // set one filter and keep the others
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>All Opportunities</h1>
          <p>Discover the best opportunities based on your interests and skills.</p>
        </div>
        <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
          <i className="fa-solid fa-filter" /> Filter
        </button>
      </div>

      {showFilters && (
        <div className="filter-bar card">
          <label className="field">
            <span>Mode</span>
            <select className="input" value={mode} onChange={(e) => setFilter("mode", e.target.value)}>
              <option value="">All modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="field">
            <span>Sort by</span>
            <select className="input" value={sort} onChange={(e) => setFilter("sort", e.target.value === "newest" ? "" : e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="deadline">Deadline (soonest)</option>
            </select>
          </label>
        </div>
      )}

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

      {search && (
        <p className="result-note">
          Results for “{search}”
          <button type="button" className="link" onClick={() => setFilter("search", "")}> Clear</button>
        </p>
      )}

      {loading && <Loader text="Loading opportunities..." />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {data && data.count === 0 && (
        <div className="card empty chips-gap">
          <h3>No opportunities found</h3>
          <p className="text-muted">Try another keyword or clear your filters.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}

      {data && data.count > 0 && (
        <div className="opp-grid chips-gap">
          {data.opportunities.map((o) => (
            <OpportunityCard key={o._id} item={o} saved={isSaved(o._id)} onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </>
  );
}
