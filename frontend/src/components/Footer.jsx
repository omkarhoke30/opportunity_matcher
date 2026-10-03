import { Link } from "react-router-dom";
import Brand from "./Brand";
import { APP_NAME, opportunityTypes } from "../data/constants";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign Up" },
];

const footerTypes = ["hackathon", "workshop", "competition", "internship", "event"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Brand />
          <p>
            Discover hackathons, workshops, competitions, internships and events that match your
            skills, all in one place.
          </p>
          <div className="socials">
            <a href="https://github.com" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
            <a href="https://instagram.com" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="https://youtube.com" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Opportunity types">
          <h4>Opportunities</h4>
          <ul>
            {footerTypes.map((t) => (
              <li key={t}>
                <Link to={`/opportunities?type=${t}`}>{opportunityTypes[t].label}s</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li><i className="fa-solid fa-envelope" /> support@opportunityhub.com</li>
            <li><i className="fa-solid fa-phone" /> +91 98765 43210</li>
            <li><i className="fa-solid fa-location-dot" /> Pune, Maharashtra, India</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
        <button type="button" className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <i className="fa-solid fa-arrow-up" /> Back to top
        </button>
      </div>
    </footer>
  );
}
