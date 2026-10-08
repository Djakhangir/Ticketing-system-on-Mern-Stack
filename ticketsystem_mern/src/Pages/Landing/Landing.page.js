import React from "react";
import { useHistory } from "react-router-dom";

const FEATURES = [
  {
    k: "Residents",
    t: "Report in seconds",
    d: "Tenants describe the issue, snap a photo, and leave a callback number. A live glass-panel chat keeps them in the loop until it's fixed.",
  },
  {
    k: "Superintendents",
    t: "Triage & dispatch",
    d: "See every apartment's request in one queue, reply instantly, assign the right person, and push status updates that notify the resident.",
  },
  {
    k: "Management",
    t: "Run the building",
    d: "Order parts, track arrivals, and book professional appointments. Emergencies surface to the top automatically.",
  },
  {
    k: "Landlords",
    t: "Full oversight",
    d: "Read-only visibility across every conversation, ticket, and package — the whole portfolio at a glance, without the noise.",
  },
];

const STEPS = [
  { n: "01", t: "Resident opens a request", d: "Photo, description, priority, and phone — from any device." },
  { n: "02", t: "Staff respond & dispatch", d: "Assign, chat, order parts, schedule the visit. Everyone is notified by email and in-app." },
  { n: "03", t: "Resolved & on record", d: "Full history per unit, per building. Packages logged at the lobby notify residents instantly." },
];

const PLANS = [
  { name: "Starter", price: "$0", unit: "/ up to 10 units", points: ["1 building", "Tickets & chat", "Email notifications", "Package log"], cta: "Start free" },
  { name: "Building", price: "$99", unit: "/ month", points: ["Unlimited units", "Parts & appointments", "Staff roles & assignment", "Priority support"], featured: true, cta: "Get started" },
  { name: "Portfolio", price: "Let's talk", unit: "", points: ["Multiple buildings", "Landlord oversight", "SMS notifications", "Onboarding help"], cta: "Contact sales" },
];

const Landing = () => {
  const history = useHistory();

  return (
    <div className="lux-land">
      {/* ambient facade behind the hero */}
      <div className="lux-scene" aria-hidden="true">
        <div className="lux-facade">
          <div className="lux-door" />
        </div>
      </div>

      <header className="lux-land-nav">
        <div className="brand">Apartment&nbsp;Care</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="lux-btn lux-btn-ghost lux-btn-sm" onClick={() => history.push("/login")}>
            Sign in
          </button>
          <button className="lux-btn lux-btn-sm" onClick={() => history.push("/registration")}>
            Get started
          </button>
        </div>
      </header>

      <section className="lux-land-hero">
        <p className="lux-kicker">Property maintenance, elevated</p>
        <h1>The concierge your building deserves.</h1>
        <p className="lux-land-sub">
          One refined platform for residents, superintendents, management, and landlords —
          maintenance requests, live chat, parts, appointments, and lobby packages, all in one place.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
          <button className="lux-btn" onClick={() => history.push("/registration")}>
            Start free
          </button>
          <button className="lux-btn lux-btn-ghost" onClick={() => history.push("/login")}>
            See the demo
          </button>
        </div>
        <p className="lux-muted" style={{ marginTop: 16, fontSize: "0.85rem" }}>
          Demo logins (password <strong>Passw0rd!</strong>): tenant@demo.com · super@demo.com · office@demo.com · owner@demo.com
        </p>
      </section>

      <section className="lux-land-section">
        <p className="lux-kicker" style={{ textAlign: "center" }}>Built for every role</p>
        <h2 className="lux-land-h2">Four views. One source of truth.</h2>
        <div className="lux-grid cols-4" style={{ marginTop: 30 }}>
          {FEATURES.map((f) => (
            <div className="lux-card" key={f.k}>
              <span className="lux-badge gold">{f.k}</span>
              <h3 style={{ margin: "12px 0 6px" }}>{f.t}</h3>
              <p className="lux-soft" style={{ fontSize: "0.92rem" }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lux-land-section">
        <p className="lux-kicker" style={{ textAlign: "center" }}>How it works</p>
        <h2 className="lux-land-h2">From report to resolved.</h2>
        <div className="lux-grid cols-3" style={{ marginTop: 30 }}>
          {STEPS.map((s) => (
            <div className="lux-card" key={s.n}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.4rem", color: "var(--lux-gold)" }}>{s.n}</div>
              <h3 style={{ margin: "6px 0" }}>{s.t}</h3>
              <p className="lux-soft" style={{ fontSize: "0.92rem" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lux-land-section">
        <p className="lux-kicker" style={{ textAlign: "center" }}>Pricing</p>
        <h2 className="lux-land-h2">Simple, per-building pricing.</h2>
        <div className="lux-grid cols-3" style={{ marginTop: 30 }}>
          {PLANS.map((p) => (
            <div
              className="lux-card"
              key={p.name}
              style={p.featured ? { borderColor: "rgba(212,175,55,0.6)", transform: "translateY(-6px)" } : undefined}
            >
              {p.featured && <span className="lux-badge gold">Most popular</span>}
              <h3 style={{ margin: "10px 0 2px" }}>{p.name}</h3>
              <div style={{ fontSize: "2rem", fontFamily: "Cormorant Garamond, serif" }}>
                {p.price} <span className="lux-muted" style={{ fontSize: "0.9rem" }}>{p.unit}</span>
              </div>
              <hr className="lux-hairline" />
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
                {p.points.map((pt) => (
                  <li key={pt} className="lux-soft" style={{ padding: "5px 0", fontSize: "0.92rem" }}>
                    · {pt}
                  </li>
                ))}
              </ul>
              <button
                className={`lux-btn ${p.featured ? "" : "lux-btn-ghost"}`}
                style={{ width: "100%" }}
                onClick={() => history.push("/registration")}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="lux-land-cta">
        <h2 className="lux-land-h2">Ready to give your residents the white-glove experience?</h2>
        <button className="lux-btn" style={{ marginTop: 16 }} onClick={() => history.push("/registration")}>
          Create your building
        </button>
      </section>

      <footer className="lux-land-foot">
        <span>© {new Date().getFullYear()} Apartment Care</span>
        <span className="lux-muted">Maintenance · Chat · Parts · Appointments · Packages</span>
      </footer>
    </div>
  );
};

export default Landing;
