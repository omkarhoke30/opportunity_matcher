import { Link, useNavigate } from "react-router-dom";
import OpportunityForm from "../../components/OpportunityForm";
import { opportunityApi } from "../../services/api";

const tips = [
  "Add a clear and detailed description.",
  "Mention the eligibility criteria and required skills.",
  "Add the correct deadline and registration link.",
];

export default function AddOpportunity() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await opportunityApi.create(data);
    navigate("/admin/opportunities");
  };

  return (
    <>
      <Link to="/admin/opportunities" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Back to Manage
      </Link>

      <div className="page-head">
        <div>
          <h1>Add New Opportunity</h1>
          <p>Fill in the details to create a new opportunity for students.</p>
        </div>
      </div>

      <div className="form-layout">
        <OpportunityForm submitLabel="Save Opportunity" onSubmit={handleCreate} />

        <aside className="card">
          <h3 className="card-title"><i className="fa-regular fa-lightbulb tip-icon" /> Quick Tips</h3>
          <ul className="check-list">
            {tips.map((t) => (
              <li key={t}><i className="fa-solid fa-circle-check" /> {t}</li>
            ))}
          </ul>
          <p className="side-note">Help students find the right opportunities!</p>
        </aside>
      </div>
    </>
  );
}
