import { useState } from "react";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { adminApi } from "../../services/api";
import { formatDate, getInitials } from "../../utils/format";

export default function ManageStudents() {
  const { data, loading, error, reload } = useFetch(() => adminApi.students(), []);
  const [search, setSearch] = useState("");

  const handleDelete = async (student) => {
    if (!window.confirm(`Remove ${student.name}? Their profile, applications and saved items are deleted too.`)) return;
    try {
      await adminApi.removeStudent(student._id);
      reload();
    } catch (err) {
      alert(err.message);
    }
  };

  // Simple search in the browser: the list is small
  const text = search.trim().toLowerCase();
  const students = (data?.students ?? []).filter(
    (s) => !text || s.name.toLowerCase().includes(text) || s.email.toLowerCase().includes(text)
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Manage Students</h1>
          <p>View and manage all registered students on the platform.</p>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-bar">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            aria-label="Search students"
          />
        </label>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {data && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Interests</th>
                  <th>Joined On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="cell-main">
                        <span className="avatar">{getInitials(s.name)}</span>
                        <strong>{s.name}</strong>
                      </div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.skills.join(", ") || "—"}</td>
                    <td>{s.interests.join(", ") || "—"}</td>
                    <td>{formatDate(s.joinedAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="icon-action danger" aria-label={`Remove ${s.name}`} onClick={() => handleDelete(s)}>
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={6} className="text-muted">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <span>Showing {students.length} of {data.count} students</span>
          </div>
        </div>
      )}
    </>
  );
}
