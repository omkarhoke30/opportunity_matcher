import { Link } from "react-router-dom";
import OpportunityCard from "../../components/OpportunityCard";
import { Loader } from "../../components/Feedback";
import useSaved from "../../hooks/useSaved";

export default function SavedOpportunities() {
  const { saved, loading, isSaved, toggleSave } = useSaved();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Saved Opportunities</h1>
          <p>Opportunities you bookmarked to look at later.</p>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && saved.length === 0 && (
        <div className="card empty">
          <h2>No saved opportunities yet</h2>
          <p className="text-muted">Tap the bookmark on any opportunity to keep it here.</p>
          <Link to="/student/opportunities" className="btn btn-primary">Find opportunities</Link>
        </div>
      )}

      {saved.length > 0 && (
        <div className="opp-grid">
          {saved.map((o) => (
            <OpportunityCard key={o._id} item={o} saved={isSaved(o._id)} onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </>
  );
}
