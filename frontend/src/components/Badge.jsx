import { opportunityTypes } from "../data/constants";

// Colours come from the data-type / data-status attributes (see global.css)

export function TypeIcon({ type, large = false }) {
  return (
    <span className={`type-icon ${large ? "lg" : ""}`} data-type={type}>
      <i className={`fa-solid ${opportunityTypes[type]?.icon ?? "fa-star"}`} />
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span className="badge" data-type={type}>
      {opportunityTypes[type]?.label ?? type}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className="status" data-status={status}>
      {status}
    </span>
  );
}
