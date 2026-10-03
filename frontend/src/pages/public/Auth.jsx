import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../../components/Brand";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../data/constants";

const points = [
  { icon: "fa-bullseye", text: "Access personalized opportunities" },
  { icon: "fa-paper-plane", text: "Track your applications" },
  { icon: "fa-rocket", text: "Build your career with the right opportunities" },
];

const dashboardFor = (role) => (role === "admin" ? "/admin/dashboard" : "/student/dashboard");

// One page for both /login and /signup
export default function Auth({ mode = "login" }) {
  const isLogin = mode === "login";
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();

  // Already logged in? Skip this page.
  if (!loading && user) return <Navigate to={dashboardFor(user.role)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        // The tab is a friendly check only. The real role comes from the database.
        const loggedIn = await login(form.get("email"), form.get("password"), role);
        navigate(dashboardFor(loggedIn.role));
      } else {
        await register(form.get("name"), form.get("email"), form.get("password"));
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div>
          <Brand />
          <h1>{isLogin ? "Welcome Back!" : `Join ${APP_NAME}`}</h1>
          <p className="text-muted">
            {isLogin ? "Login to continue to your account" : "Create your student account in a minute"}
          </p>
          <ul className="auth-points">
            {points.map((p) => (
              <li key={p.text}>
                <span className="feature-icon"><i className={`fa-solid ${p.icon}`} /></span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <svg className="auth-art" viewBox="0 0 400 200" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mtn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7a5cff" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path d="M0 200 L110 80 L165 135 L240 30 L335 160 L400 110 V200 Z" fill="url(#mtn)" opacity=".22" />
          <path d="M0 200 L110 80 L165 135 L240 30 L335 160 L400 110" stroke="url(#mtn)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M240 30 V6 L266 14 L240 22" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />
        </svg>

        <p className="auth-quote">"Opportunities don't happen, you create them."</p>
      </aside>

      <main className="auth-main">
        <div className="auth-mobile-brand"><Brand /></div>

        <div className="auth-card card">
          {isLogin && (
            <div className="role-tabs" role="tablist">
              {["student", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  className={role === r ? "active" : ""}
                  onClick={() => {
                    setRole(r);
                    setError("");
                  }}
                >
                  {r === "student" ? "Student" : "Admin"}
                </button>
              ))}
            </div>
          )}

          <h2>{isLogin ? "Login" : "Create Account"}</h2>
          <p className="text-muted">
            {isLogin ? "Enter your email and password" : "Fill in your details to get started"}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="alert error" role="alert">{error}</div>}

            {!isLogin && (
              <label className="field">
                <span>Full Name</span>
                <div className="input-icon">
                  <i className="fa-regular fa-user" />
                  <input className="input" name="name" required placeholder="Enter your name" autoComplete="name" />
                </div>
              </label>
            )}

            <label className="field">
              <span>Email Address</span>
              <div className="input-icon">
                <i className="fa-regular fa-envelope" />
                <input className="input" type="email" name="email" required placeholder="Enter your email" autoComplete="email" />
              </div>
            </label>

            <label className="field">
              <span>Password</span>
              <div className="input-icon">
                <i className="fa-solid fa-lock" />
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={isLogin ? undefined : 6}
                  placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </label>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Admin accounts are created by the seed script, never by sign up */}
          {role === "student" && (
            <p className="auth-switch">
              {isLogin ? (
                <>Don't have an account? <Link to="/signup" className="link">Sign Up</Link></>
              ) : (
                <>Already have an account? <Link to="/login" className="link">Login</Link></>
              )}
            </p>
          )}
        </div>

        <p className="auth-foot">
          © {new Date().getFullYear()} {APP_NAME} ·{" "}
          <Link to="/">Home</Link> · <Link to="/opportunities">Opportunities</Link> · <Link to="/contact">Contact</Link>
        </p>
      </main>
    </div>
  );
}
