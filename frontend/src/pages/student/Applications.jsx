import { Link } from "react-router-dom";
import { TypeIcon, TypeBadge, StatusBadge } from "../../components/Badge";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { applicationApi } from "../../services/api";
import { formatDate } from "../../utils/format";

export default function Applications() {
  const { data, loading, error, reload } = useFetch(() => applicationApi.list(), []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My Applications</h1>
          <p>Track the status of everything you have applied to.</p>
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {data && data.count === 0 && (
        <div className="card empty">
          <h2>You haven't applied to anything yet</h2>
          <p className="text-muted">Open an opportunity and press Apply Now to start tracking it here.</p>
          <Link to="/student/opportunities" className="btn btn-primary">Find opportunities</Link>
        </div>
      )}

      {data && data.count > 0 && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Type</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div className="cell-main">
                        <TypeIcon type={a.opportunity.type} />
                        <div>
                          <strong>{a.opportunity.title}</strong>
                          <small>{a.opportunity.organization}</small>
                        </div>
                      </div>
                    </td>
                    <td><TypeBadge type={a.opportunity.type} /></td>
                    <td>{formatDate(a.appliedAt)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <Link to={`/student/application/${a._id}`} className="icon-action" aria-label="View application">
                        <i className="fa-solid fa-eye" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
