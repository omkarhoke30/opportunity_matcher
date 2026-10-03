import PageBanner from "../../components/PageBanner";
import { APP_NAME } from "../../data/constants";

const info = [
  { icon: "fa-envelope", title: "support@opportunityhub.com", note: "We'll respond as soon as possible" },
  { icon: "fa-phone", title: "+91 98765 43210", note: "Mon - Sat, 9:00 AM - 6:00 PM" },
  { icon: "fa-location-dot", title: "Pune, Maharashtra, India", note: "Government Polytechnic Pune" },
];

export default function Contact() {
  // UI only for now: sending the message is added with the backend later.
  const handleSubmit = (e) => e.preventDefault();

  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us for any questions, feedback or support."
        icon="fa-envelope-open-text"
      />

      <section className="container contact-grid">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>
          <div className="form-grid">
            <label className="field">
              <span>Full Name <b className="req">*</b></span>
              <input className="input" required placeholder="Enter your name" />
            </label>
            <label className="field">
              <span>Email Address <b className="req">*</b></span>
              <input className="input" type="email" required placeholder="Enter your email" />
            </label>
            <label className="field span-2">
              <span>Subject <b className="req">*</b></span>
              <select className="input" required defaultValue="">
                <option value="" disabled>Select a subject</option>
                <option>General question</option>
                <option>Report an issue</option>
                <option>Partnership</option>
                <option>Feedback</option>
              </select>
            </label>
            <label className="field span-2">
              <span>Message <b className="req">*</b></span>
              <textarea className="input" required placeholder="Type your message here..." />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">
              <i className="fa-solid fa-paper-plane" /> Send Message
            </button>
          </div>
        </form>

        <aside className="card">
          <h2>Get in Touch</h2>
          <ul className="contact-list">
            {info.map((i) => (
              <li className="contact-item" key={i.title}>
                <span className="feature-icon"><i className={`fa-solid ${i.icon}`} /></span>
                <div>
                  <strong>{i.title}</strong>
                  <small>{i.note}</small>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="follow-title">Follow Us</h3>
          <div className="socials">
            <a href="https://github.com" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
            <a href="https://instagram.com" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="https://youtube.com" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
          </div>

          <div className="idea-card">
            <i className="fa-regular fa-lightbulb" />
            <div>
              <strong>Have a project idea or partnership proposal?</strong>
              <small>{APP_NAME} is always open to collaboration.</small>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
