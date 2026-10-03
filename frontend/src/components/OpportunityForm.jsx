import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { opportunityTypes } from "../data/constants";
import { splitList, toDateInput } from "../utils/format";

// Shared by Add and Edit.
//   initial   → pre-fills the fields when editing
//   onSubmit  → async function that receives the form data and talks to the API
export default function OpportunityForm({ initial = {}, submitLabel = "Save Opportunity", onSubmit }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const goBack = () => navigate("/admin/opportunities");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const data = {
      title: form.get("title"),
      type: form.get("type"),
      organization: form.get("organization"),
      description: form.get("description"),
      startDate: form.get("startDate") || null,
      deadline: form.get("deadline") || null,
      mode: form.get("mode"),
      location: form.get("location") || undefined,
      eligibility: form.get("eligibility"),
      skills: splitList(form.get("skills")),
      registrationLink: form.get("registrationLink"),
    };

    setSaving(true);
    setError("");
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <div className="alert error" role="alert">{error}</div>}

      <div className="form-grid">
        <label className="field">
          <span>Title <b className="req">*</b></span>
          <input className="input" name="title" required defaultValue={initial.title} placeholder="Enter opportunity title" />
        </label>

        <label className="field">
          <span>Type <b className="req">*</b></span>
          <select className="input" name="type" required defaultValue={initial.type ?? ""}>
            <option value="" disabled>Select type</option>
            {Object.entries(opportunityTypes).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </label>

        <label className="field span-2">
          <span>Organization <b className="req">*</b></span>
          <input className="input" name="organization" required defaultValue={initial.organization} placeholder="Enter organization name" />
        </label>

        <label className="field span-2">
          <span>Description <b className="req">*</b></span>
          <textarea className="input" name="description" required maxLength={1000} defaultValue={initial.description} placeholder="Enter detailed description..." />
        </label>

        <label className="field">
          <span>Start Date</span>
          <input className="input" type="date" name="startDate" defaultValue={toDateInput(initial.startDate)} />
        </label>

        <label className="field">
          <span>Deadline <b className="req">*</b></span>
          <input className="input" type="date" name="deadline" required defaultValue={toDateInput(initial.deadline)} />
        </label>

        <label className="field">
          <span>Mode</span>
          <select className="input" name="mode" defaultValue={initial.mode ?? "online"}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>

        <label className="field">
          <span>Location</span>
          <input className="input" name="location" defaultValue={initial.location} placeholder="e.g. Pune or Online" />
        </label>

        <label className="field">
          <span>Eligibility</span>
          <input className="input" name="eligibility" defaultValue={initial.eligibility} placeholder="e.g. B.E/B.Tech, Diploma, etc." />
        </label>

        <label className="field">
          <span>Skills Required</span>
          <input className="input" name="skills" defaultValue={initial.skills?.join(", ")} placeholder="e.g. React, Python, C++ (comma separated)" />
        </label>

        <label className="field span-2">
          <span>Registration Link</span>
          <input className="input" type="url" name="registrationLink" defaultValue={initial.registrationLink} placeholder="https://... (optional)" />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
        <button type="button" className="btn btn-outline" onClick={goBack}>Cancel</button>
      </div>
    </form>
  );
}
