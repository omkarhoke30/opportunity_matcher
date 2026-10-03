import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { useAuth } from "../context/AuthContext";

// links: [{ to, label, icon, end?, also? }]
//   end  → highlight only on an exact match
//   also → extra path prefixes that should highlight this link
function isActive(pathname, link) {
  const alsoMatch = (link.also ?? []).some((p) => pathname.startsWith(p));
  if (link.end) return pathname === link.to || alsoMatch;
  return pathname.startsWith(link.to) || alsoMatch;
}

export default function Sidebar({ links, brandTo, open, onClose }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Brand to={brandTo} />

        <nav className="sidebar-nav">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={onClose}
              className={`sidebar-link ${isActive(pathname, l) ? "active" : ""}`}
            >
              <i className={`fa-solid ${l.icon}`} />
              {l.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="sidebar-link" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket" />
          Logout
        </button>
      </aside>

      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}
