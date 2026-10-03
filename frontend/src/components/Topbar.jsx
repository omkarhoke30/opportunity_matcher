import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/format";

// searchPath: the page the search box sends you to, e.g. "/student/opportunities"
export default function Topbar({ user, onMenu, searchPath }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const firstName = user.name.split(" ")[0];
  const title = user.role === "admin" ? "Administrator" : "Student";

  const handleSearch = (e) => {
    e.preventDefault();
    const query = text.trim();
    navigate(query ? `${searchPath}?search=${encodeURIComponent(query)}` : searchPath);
  };

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu">
        <i className="fa-solid fa-bars" />
      </button>

      <form className="search-bar topbar-search" onSubmit={handleSearch} role="search">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search opportunities..."
          aria-label="Search opportunities"
        />
      </form>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <i className="fa-regular fa-bell" />
        </button>
        <div className="user-chip">
          <span className="avatar">{getInitials(user.name)}</span>
          <div className="user-meta">
            <strong>{firstName}</strong>
            <small>{title}</small>
          </div>
        </div>
      </div>
    </header>
  );
}
