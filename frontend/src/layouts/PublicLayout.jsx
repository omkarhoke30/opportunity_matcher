import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Navbar + page + footer. The footer shows on every public page.
export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
