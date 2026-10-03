import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Feedback";

// Keeps the wrong people out of /student and /admin.
// This only improves the experience: the backend still checks the role on every API call.
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Checking your session..." full />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  return <Outlet />;
}
