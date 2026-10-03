import { Link, useNavigate, useParams } from "react-router-dom";
import OpportunityForm from "../../components/OpportunityForm";
import { TypeIcon, TypeBadge, StatusBadge } from "../../components/Badge";
import { Loader } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { opportunityApi } from "../../services/api";
import { formatDate, getStatus } from "../../utils/format";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(() => opportunityApi.get(id), [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card empty">
        <h2>Opportunity not found</h2>
        <Link to="/admin/opportunities" className="btn btn-primary">Back to Manage</Link>
      </div>
    );
  }

  const item = data.opportunity;

  const handleUpdate = async (formData) => {
    await opportunityApi.update(item._id, formData);
    navigate("/admin/opportunities");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.title}"? This also removes its applications and saved copies.`)) return;
    try {
      await opportunityApi.remove(item._id);
      navigate("/admin/opportunities");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Link to="/admin/opportunities" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Back to Manage
      </Link>

      <div className="page-head">
        <div>
          <h1>Edit Opportunity</h1>
          <p>Update the details of the opportunity.</p>
        </div>
      </div>

      <div className="form-layout">
        <OpportunityForm key={item._id} initial={item} submitLabel="Update Opportunity" onSubmit={handleUpdate} />

        <div className="side-stack">
          <aside className="card">
            <div className="card-head">
              <h3 className="card-title">Current Status</h3>
              <StatusBadge status={getStatus(item.deadline)} />
            </div>
            <dl className="kv">
              <dt>Created On</dt>
              <dd>{formatDate(item.createdAt)}</dd>
              <dt>Last Updated</dt>
              <dd>{formatDate(item.updatedAt)}</dd>
            </dl>
            <button type="button" className="btn btn-danger btn-block detail-link" onClick={handleDelete}>
              Delete Opportunity
            </button>
          </aside>

          <aside className="card">
            <h3 className="card-title">Preview</h3>
            <div className="preview">
              <TypeIcon type={item.type} />
              <div>
                <strong>{item.title}</strong>
                <small>{item.organization}</small>
              </div>
            </div>
            <div className="tags preview-tags">
              <TypeBadge type={item.type} />
              <span className="badge badge-mode">{item.mode}</span>
            </div>
            <p className="preview-text">{item.description}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
