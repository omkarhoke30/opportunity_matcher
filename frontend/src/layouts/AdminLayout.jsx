import PanelLayout from "./PanelLayout";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "fa-house", end: true },
  { to: "/admin/opportunities", label: "Manage Opportunities", icon: "fa-list-check", end: true, also: ["/admin/opportunities/edit/"] },
  { to: "/admin/opportunities/add", label: "Add Opportunity", icon: "fa-square-plus" },
  { to: "/admin/students", label: "Manage Students", icon: "fa-user-graduate" },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return <PanelLayout links={links} user={user} brandTo="/admin/dashboard" searchPath="/admin/opportunities" />;
}
