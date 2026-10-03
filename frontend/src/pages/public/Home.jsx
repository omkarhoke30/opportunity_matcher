import { Link, useNavigate } from "react-router-dom";
import { TypeIcon } from "../../components/Badge";
import OpportunityCard from "../../components/OpportunityCard";
import { Loader, ErrorMessage } from "../../components/Feedback";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { opportunityApi } from "../../services/api";

const features = [
  { icon: "fa-user-check", text: "Personalized Recommendations" },
  { icon: "fa-layer-group", text: "Multiple Categories" },
  { icon: "fa-clock", text: "Track Deadlines" },
  { icon: "fa-rocket", text: "Build Your Future" },
];

const types = [
  { type: "hackathon", name: "Hackathons", tagline: "Code · Build · Innovate" },
  { type: "internship", name: "Internships", tagline: "Learn · Gain Experience · Grow" },
  { type: "competition", name: "Competitions", tagline: "Showcase · Win · Excel" },
  { type: "workshop", name: "Workshops", tagline: "Learn · Practice · Improve" },
  { type: "event", name: "Events", tagline: "Connect · Network · Explore" },
];

const steps = [
  { icon: "fa-user-pen", title: "Create your profile", text: "Add your skills, interests and preferred mode so you can see what suits you." },
  { icon: "fa-magnifying-glass", title: "Discover opportunities", text: "Browse hackathons, internships, workshops and more, and save the ones you like." },
  { icon: "fa-paper-plane", title: "Apply and track", text: "Apply through the organizer's link and follow every application in one place." },
];

const highlights = [
  { icon: "fa-sliders", title: "Search and filter", text: "Narrow listings by type, mode and deadline to find what fits you." },
  { icon: "fa-bookmark", title: "Save for later", text: "Bookmark opportunities and come back when you are ready to apply." },
  { icon: "fa-hourglass-half", title: "Deadline tracking", text: "See what closes soon so you never miss a registration date." },
  { icon: "fa-list-check", title: "Application tracking", text: "Follow each application from submitted to the final result." },
  { icon: "fa-id-card", title: "Your own profile", text: "Keep your skills and interests in one place for better matches." },
  { icon: "fa-shield-halved", title: "Reviewed listings", text: "Opportunities are posted by admins so details stay clear and accurate." },
];

const popularSkills = [
  "JavaScript", "React", "Node.js", "Python", "Machine Learning", "C++",
  "Java", "UI/UX", "Flutter", "Data Structures", "MongoDB", "HTML",
];

const faqs = [
  { q: "Is it free for students?", a: "Yes. Creating an account, browsing opportunities, saving them and tracking your applications costs nothing." },
  { q: "What kinds of opportunities can I find?", a: "Hackathons, workshops, competitions, internships, events and student projects, all added by our admin team." },
  { q: "How do I apply?", a: "Open an opportunity, check the eligibility and deadline, then press Apply Now. Your application is recorded and you can finish registration on the organizer's page." },
  { q: "Can I save opportunities for later?", a: "Yes. Tap the bookmark on any card and it appears under Saved Opportunities in your dashboard." },
  { q: "Who adds the opportunities?", a: "Only admins can post and edit listings, so students always see reviewed details." },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => opportunityApi.list({ deadline: "active", limit: 4 }),
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const text = new FormData(e.target).get("search").trim();
    navigate(text ? `/opportunities?search=${encodeURIComponent(text)}` : "/opportunities");
  };

  // Students open the details page, visitors are sent to log in first
  const cardLink = (id) => (user?.role === "student" ? `/student/opportunity/${id}` : "/login");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero container">
        <div className="hero-text">
          <span className="eyebrow">Your Future. Our Mission</span>
          <h1>
            Find Opportunities That Match Your <span className="gradient-text">Potential</span>
          </h1>
          <p>
            Discover internships, hackathons, competitions, workshops and more, all in one place.
            Build your skills, grow your network and take the next step towards your future.
          </p>

          <form className="search-bar hero-search" onSubmit={handleSearch} role="search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              name="search"
              aria-label="Search opportunities"
              placeholder="Search for opportunities (e.g. internship, hackathon...)"
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>

          <ul className="feature-row">
            {features.map((f) => (
              <li key={f.text}>
                <span className="feature-icon"><i className={`fa-solid ${f.icon}`} /></span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual">
          <img src="/hero.webp" alt="A student exploring hackathons, workshops and competitions" />
        </div>
      </section>

      {/* ---------- Popular types ---------- */}
      <section className="container section">
        <div className="section-head">
          <h2>Popular Opportunity Types</h2>
          <Link to="/opportunities" className="link">
            View All <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
        <div className="type-cards">
          {types.map((t) => (
            <Link to={`/opportunities?type=${t.type}`} key={t.type} className="type-card">
              <TypeIcon type={t.type} />
              <h3>{t.name}</h3>
              <p>{t.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Latest opportunities (live from the API) ---------- */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2>Latest Opportunities</h2>
            <p className="section-sub">Fresh listings that are still open for applications.</p>
          </div>
          <Link to="/opportunities" className="link">
            View All <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {loading && <Loader text="Loading opportunities..." />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {data && data.opportunities.length === 0 && (
          <div className="card empty">
            <h3>No open opportunities right now</h3>
            <p className="text-muted">Check back soon, new listings are added regularly.</p>
          </div>
        )}
        {data && data.opportunities.length > 0 && (
          <div className="opp-grid">
            {data.opportunities.map((o) => (
              <OpportunityCard key={o._id} item={o} to={cardLink(o._id)} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- How it works ---------- */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2>How it works</h2>
            <p className="section-sub">From sign up to your first application in three steps.</p>
          </div>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li className="step card" key={s.title}>
              <span className="step-num">{i + 1}</span>
              <span className="feature-icon lg"><i className={`fa-solid ${s.icon}`} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Highlights ---------- */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2>Everything you need in one place</h2>
            <p className="section-sub">Simple tools that make finding and tracking opportunities easy.</p>
          </div>
        </div>
        <div className="feature-grid">
          {highlights.map((h) => (
            <div className="highlight" key={h.title}>
              <span className="feature-icon lg"><i className={`fa-solid ${h.icon}`} /></span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Explore by skill ---------- */}
      <section className="container section">
        <div className="skills-card card">
          <div>
            <h2>Explore by skill</h2>
            <p className="section-sub">Jump straight to opportunities that fit what you already know.</p>
          </div>
          <div className="chips">
            {popularSkills.map((skill) => (
              <Link key={skill} to={`/opportunities?search=${encodeURIComponent(skill)}`} className="chip">
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="container section">
        <div className="faq-layout">
          <div>
            <h2>Frequently asked questions</h2>
            <p className="section-sub">
              Still have a question? <Link to="/contact" className="link">Contact us</Link>
            </p>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="container section">
        <div className="cta-banner">
          <div>
            <h2>Ready to find your next opportunity?</h2>
            <p>Create a free account, build your profile and start applying in minutes.</p>
            <div className="cta-actions">
              <Link to={user ? "/student/dashboard" : "/signup"} className="btn btn-primary">
                {user ? "Go to dashboard" : "Create free account"}
              </Link>
              <Link to="/opportunities" className="btn btn-outline">Browse opportunities</Link>
            </div>
          </div>
          <img src="/logo.png" alt="" className="cta-logo" />
        </div>
      </section>
    </>
  );
}
