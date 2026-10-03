export function Loader({ text = "Loading...", full = false }) {
  return (
    <div className={`loader ${full ? "full" : ""}`} role="status">
      <span className="spinner" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card empty">
      <i className="fa-solid fa-triangle-exclamation error-icon" />
      <h2>Something went wrong</h2>
      <p className="text-muted">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
