import { useRouter } from "next/router";

const services = [
  {
    mode: "A",
    title: "Portfolio candidat",
    subtitle: "Emploi, stage, alternance. Portfolio clair et credible.",
    price: "29 900 CFA",
  },
  {
    mode: "B",
    title: "Vitrine entreprise",
    subtitle: "Page pro pour convertir et recevoir des demandes.",
    price: "59 900 CFA",
  },
  {
    mode: "CV",
    title: "CV professionnel",
    subtitle: "Un CV clair, moderne et efficace.",
    price: "9 900 CFA",
  },
  {
    mode: "LM",
    title: "Lettre de motivation",
    subtitle: "Lettre concise, impactante, adaptee au poste.",
    price: "4 900 CFA",
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
            <p className="hero-sub">Simple, direct et rapide. On s occupe du reste.</p>
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
            <h2>Pourquoi nous</h2>
            <ul className="list">
              <li>Un rendu professionnel et moderne.</li>
              <li>Un message clair pour convaincre.</li>
              <li>Un suivi rapide apres votre brief.</li>
            </ul>
          </div>
          <div>
            <h2>Process simple</h2>
            <ul className="list">
              <li>Choisissez un service.</li>
              <li>Remplissez le formulaire (meme partiel).</li>
              <li>Nous vous contactons rapidement.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="footer">© 2026 Mon Portfolio  Tous droits reserves.</div>
    </div>
  );
}
