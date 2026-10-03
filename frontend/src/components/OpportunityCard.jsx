import { Link } from "react-router-dom";
import { TypeIcon, TypeBadge } from "./Badge";
import { formatDate } from "../utils/format";

// onToggleSave is optional: without it no bookmark button is shown (public pages)
export default function OpportunityCard({ item, saved = false, onToggleSave, to }) {
  return (
    <div className="opp-card">
      <Link to={to ?? `/student/opportunity/${item._id}`} className="opp-card-link">
        <div className="opp-card-top">
          <TypeIcon type={item.type} />
        </div>
        <h3>{item.title}</h3>
        <p className="text-muted">{item.organization}</p>
        <div className="opp-card-tags">
          <TypeBadge type={item.type} />
          <span className="badge badge-mode">{item.mode}</span>
        </div>
        <div className="opp-card-foot">
          <i className="fa-regular fa-clock" /> Apply by: {formatDate(item.deadline)}
        </div>
      </Link>

      {onToggleSave && (
        <button
          type="button"
          className={`bookmark ${saved ? "on" : ""}`}
          onClick={() => onToggleSave(item)}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          aria-pressed={saved}
        >
          <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} />
        </button>
      )}
    </div>
  );
}
