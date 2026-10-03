import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Shared shell for the student and admin panels (sidebar + topbar + page)
export default function PanelLayout({ links, user, brandTo, searchPath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="panel">
      <Sidebar links={links} brandTo={brandTo} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="panel-main">
        <Topbar user={user} searchPath={searchPath} onMenu={() => setMenuOpen(true)} />
        <main className="panel-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
