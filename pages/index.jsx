import { useRouter } from "next/router";

const RATE = 600;
const pricing = {
  A: 29900,
  B: 59900,
  CV: 9900,
  LM: 4900,
  HOST_MONTH: 2000,
  HOST_YEAR: 24000,
};

const formatCfa = (value) => value.toLocaleString("fr-FR");
const formatUsd = (value) => (value / RATE).toFixed(2);

const services = [
  {
    mode: "A",
    title: "Portfolio candidat",
    subtitle: "Emploi, stage, alternance.",
    price: `${formatCfa(pricing.A)} CFA (~$${formatUsd(pricing.A)})`,
  },
  {
    mode: "B",
    title: "Vitrine entreprise",
    subtitle: "Page pro pour convertir.",
    price: `A partir de ${formatCfa(pricing.B)} CFA (~$${formatUsd(pricing.B)})`,
  },
  {
    mode: "CV",
    title: "CV professionnel",
    subtitle: "CV clair et moderne.",
    price: `${formatCfa(pricing.CV)} CFA (~$${formatUsd(pricing.CV)})`,
  },
  {
    mode: "LM",
    title: "Lettre de motivation",
    subtitle: "Lettre courte et impactante.",
    price: `${formatCfa(pricing.LM)} CFA (~$${formatUsd(pricing.LM)})`,
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <header className="nav">
        <div className="logo">
          <span className="logo-badge">Service</span>
          <span>Mon Portfolio</span>
        </div>
        <a className="btn" href="https://wa.me/22892092572" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="pill">Choix rapide</span>
            <h1 className="hero-title">
              Choisissez votre <strong>service</strong>
            </h1>
            <p className="hero-sub">Simple, direct, efficace.</p>
            <div className="chips">
              <span className="chip">Livraison rapide</span>
              <span className="chip">Message clair</span>
              <span className="chip">Design pro</span>
            </div>
          </div>
          <div className="cards">
            {services.map((card) => (
              <div className="card emphasis" key={card.mode}>
                <h3>{card.title}</h3>
                <p style={{ color: "var(--muted)" }}>{card.subtitle}</p>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>{card.price}</div>
                <button
                  className="btn primary"
                  onClick={() => router.push(`/service?mode=${card.mode}`)}
                >
                  Continuer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section lead">
        <div className="split">
          <div>
            <h2>Hebergement</h2>
            <ul className="list">
              <li>{formatCfa(pricing.HOST_MONTH)} CFA (~$${formatUsd(pricing.HOST_MONTH)}) / mois</li>
              <li>{formatCfa(pricing.HOST_YEAR)} CFA (~$${formatUsd(pricing.HOST_YEAR)}) / an</li>
            </ul>
          </div>
          <div>
            <h2>Process simple</h2>
            <ul className="list">
              <li>Choisissez un service.</li>
              <li>Remplissez le formulaire complet.</li>
              <li>Nous vous contactons rapidement.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="footer">© 2026 Mon Portfolio  Tous droits reserves.</div>
    </div>
  );
}
