import { Link } from "react-router-dom";
import PageBanner from "../../components/PageBanner";
import { APP_NAME } from "../../data/constants";

const stats = [
  { icon: "fa-bullseye", value: "100+", label: "Opportunities Listed" },
  { icon: "fa-users", value: "500+", label: "Active Students" },
  { icon: "fa-handshake", value: "50+", label: "Partner Organizations" },
];

const audience = [
  { icon: "fa-user-graduate", title: "For Students", text: "Find the right opportunities, build your skills, expand your network and achieve your goals." },
  { icon: "fa-chalkboard-user", title: "For Teachers", text: "Discover talented students, share opportunities and support their growth." },
  { icon: "fa-building", title: "For Organizations", text: "Reach the right talent, promote your events and create meaningful opportunities." },
];

export default function About() {
  return (
    <>
      <PageBanner title="About Us" subtitle="Connecting Students with Opportunities" icon="fa-graduation-cap" />

      <section className="container about-grid">
        <div>
          <h2>Our Mission</h2>
          <p>
            At {APP_NAME}, we aim to bridge the gap between students and opportunities. We believe
            that every student has unique talent and potential, and the right opportunity can make
            a big difference in their journey.
          </p>
          <p>
            Our platform helps students discover, apply and track opportunities like internships,
            hackathons, competitions, workshops and events, all in one place. We also help build
            stronger connections between students, teachers and organizations.
          </p>

          <div className="stats-row">
            {stats.map((s) => (
              <div className="stat-mini card" key={s.label}>
                <i className={`fa-solid ${s.icon}`} />
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="audience">
          {audience.map((a) => (
            <div className="audience-card card" key={a.title}>
              <span className="feature-icon"><i className={`fa-solid ${a.icon}`} /></span>
              <div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <Link to="/signup" className="cta-strip">
          <span className="feature-icon"><i className="fa-solid fa-people-group" /></span>
          <div>
            <h3>Together we build a brighter future</h3>
            <p>More opportunities. More connections. More possibilities.</p>
          </div>
          <i className="fa-solid fa-chevron-right" />
        </Link>
      </section>
    </>
  );
}
