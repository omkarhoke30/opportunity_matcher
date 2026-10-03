import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import PublicOpportunities from "../pages/public/PublicOpportunities";
import Contact from "../pages/public/Contact";
import Auth from "../pages/public/Auth";
import NotFound from "../pages/public/NotFound";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentOpportunities from "../pages/student/StudentOpportunities";
import OpportunityDetails from "../pages/student/OpportunityDetails";
import SavedOpportunities from "../pages/student/SavedOpportunities";
import Applications from "../pages/student/Applications";
import ApplicationDetails from "../pages/student/ApplicationDetails";
import Profile from "../pages/student/Profile";
import ProfileEdit from "../pages/student/ProfileEdit";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageOpportunities from "../pages/admin/ManageOpportunities";
import AddOpportunity from "../pages/admin/AddOpportunity";
import EditOpportunity from "../pages/admin/EditOpportunity";
import ManageStudents from "../pages/admin/ManageStudents";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // ---------- Public website ----------
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/opportunities", element: <PublicOpportunities /> },
          { path: "/contact", element: <Contact /> },
        ],
      },
      { path: "/login", element: <Auth key="login" mode="login" /> },
      { path: "/signup", element: <Auth key="signup" mode="signup" /> },

      // ---------- Student panel (students only) ----------
      {
        element: <ProtectedRoute role="student" />,
        children: [
          {
            path: "/student",
            element: <StudentLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <StudentDashboard /> },
              { path: "opportunities", element: <StudentOpportunities /> },
              { path: "opportunity/:id", element: <OpportunityDetails /> },
              { path: "saved", element: <SavedOpportunities /> },
              { path: "applications", element: <Applications /> },
              { path: "application/:id", element: <ApplicationDetails /> },
              { path: "profile", element: <Profile /> },
              { path: "profile/edit", element: <ProfileEdit /> },
            ],
          },
        ],
      },

      // ---------- Admin panel (admins only) ----------
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "opportunities", element: <ManageOpportunities /> },
              { path: "opportunities/add", element: <AddOpportunity /> },
              { path: "opportunities/edit/:id", element: <EditOpportunity /> },
              { path: "students", element: <ManageStudents /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
