import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { profileApi } from "../../services/api";
import { splitList } from "../../utils/format";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(() => profileApi.get(), []);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const p = data.profile;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    setSaveError("");

    try {
      await profileApi.update({
        phone: form.get("phone"),
        preferredMode: form.get("preferredMode"),
        education: form.get("education"),
        branch: form.get("branch"),
        skills: splitList(form.get("skills")),
        interests: splitList(form.get("interests")),
        projects: splitList(form.get("projects")),
        bio: form.get("bio"),
      });
      navigate("/student/profile");
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  };

  return (
    <>
      <Link to="/student/profile" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Back to profile
      </Link>

      <div className="page-head">
        <div>
          <h1>Edit Profile</h1>
          <p>Keep your details up to date to get better recommendations.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        {saveError && <div className="alert error" role="alert">{saveError}</div>}

        <div className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input className="input" defaultValue={user.name} readOnly />
          </label>
          <label className="field">
            <span>Email Address</span>
            <input className="input" defaultValue={user.email} readOnly />
          </label>
          <label className="field">
            <span>Phone</span>
            <input className="input" name="phone" defaultValue={p.phone} placeholder="Enter your phone number" />
          </label>
          <label className="field">
            <span>Preferred Mode</span>
            <select className="input" name="preferredMode" defaultValue={p.preferredMode}>
              <option value="any">Any</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="field">
            <span>Education</span>
            <input className="input" name="education" defaultValue={p.education} placeholder="e.g. Diploma in Computer Engineering" />
          </label>
          <label className="field">
            <span>Branch</span>
            <input className="input" name="branch" defaultValue={p.branch} placeholder="e.g. Computer Engineering" />
          </label>
          <label className="field span-2">
            <span>Skills</span>
            <input className="input" name="skills" defaultValue={p.skills.join(", ")} placeholder="Comma separated, e.g. React, Node.js" />
          </label>
          <label className="field span-2">
            <span>Interests</span>
            <input className="input" name="interests" defaultValue={p.interests.join(", ")} placeholder="Comma separated, e.g. AI, Web Development" />
          </label>
          <label className="field span-2">
            <span>Projects</span>
            <input className="input" name="projects" defaultValue={p.projects.join(", ")} placeholder="Comma separated" />
          </label>
          <label className="field span-2">
            <span>Bio</span>
            <textarea className="input" name="bio" maxLength={500} defaultValue={p.bio} placeholder="Tell us a little about yourself" />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link to="/student/profile" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
