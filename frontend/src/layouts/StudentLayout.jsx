import PanelLayout from "./PanelLayout";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/student/dashboard", label: "Dashboard", icon: "fa-house", end: true },
  { to: "/student/opportunities", label: "Find Opportunities", icon: "fa-magnifying-glass", also: ["/student/opportunity/"] },
  { to: "/student/saved", label: "Saved Opportunities", icon: "fa-bookmark" },
  { to: "/student/applications", label: "My Applications", icon: "fa-paper-plane", also: ["/student/application/"] },
  { to: "/student/profile", label: "My Profile", icon: "fa-user" },
];

export default function StudentLayout() {
  const { user } = useAuth();
  return <PanelLayout links={links} user={user} brandTo="/student/dashboard" searchPath="/student/opportunities" />;
}
