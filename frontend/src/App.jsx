import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Root of every route: resets scroll on navigation, then shows the matched page
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
