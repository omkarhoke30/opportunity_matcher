import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <i className="fa-solid fa-compass" />
      <h1>Page not found</h1>
      <p className="text-muted">The page you are looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
