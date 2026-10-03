import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner container">
        <Brand />

        <div className={`nav-menu ${open ? "open" : ""}`}>
          <nav className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={close}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                  className="btn btn-primary btn-sm"
                  onClick={close}
                >
                  Dashboard
                </Link>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={close}>Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>Sign Up</Link>
              </>
            )}
          </div>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>
    </header>
  );
}
