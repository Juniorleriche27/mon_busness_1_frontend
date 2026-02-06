import { useRouter } from "next/router";

const variants = {
  A: {
    title: "Portfolio candidat",
    subtitle: "Pour postuler (emploi, stage, alternance) avec des preuves solides.",
    cta: "Continuer (A)",
    href: "/service?mode=A",
  },
  B: {
    title: "Vitrine entreprise",
    subtitle: "Pour presenter vos offres et generer des demandes qualifiees.",
    cta: "Continuer (B)",
    href: "/service?mode=B",
  },
};

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
              Choisissez votre <strong>besoin</strong>
            </h1>
            <p className="hero-sub">
              Deux parcours distincts, deux offres claires. Vous gagnez du temps, et vos visiteurs
              comprennent en 5 secondes.
            </p>
            <div className="chips">
              <span className="chip">Design premium</span>
              <span className="chip">Message clair</span>
              <span className="chip">Conversion rapide</span>
              <span className="chip">Mobile-first</span>
            </div>
          </div>
          <div className="cards">
            {Object.values(variants).map((card) => (
              <div className="card emphasis" key={card.title}>
                <h3>{card.title}</h3>
                <p style={{ color: "var(--muted)" }}>{card.subtitle}</p>
                <button className="btn primary" onClick={() => router.push(card.href)}>
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section lead">
        <div className="split">
          <div>
            <h2>Pourquoi ce choix ?</h2>
            <ul className="list">
              <li>Chaque parcours parle directement a son public cible.</li>
              <li>Un brief plus propre et des infos exploitables rapidement.</li>
              <li>Un site moderne inspire confiance et augmente le taux de contact.</li>
            </ul>
          </div>
          <div>
            <h2>Ce que vous obtenez</h2>
            <ul className="list">
              <li>Structure claire, design pro, texte qui convertit.</li>
              <li>CTA visibles, sections utiles, parcours sans ambiguite.</li>
              <li>Livraison rapide des qu on a les elements.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Commencer en 30 secondes</h2>
        <div className="cards">
          <div className="card">
            <strong>1. Choisissez A ou B</strong>
            <p>Vous accedez au parcours adapte a votre besoin.</p>
          </div>
          <div className="card">
            <strong>2. Remplissez le brief</strong>
            <p>Indiquez l essentiel. Vous pourrez completer apres.</p>
          </div>
          <div className="card">
            <strong>3. Livraison rapide</strong>
            <p>Nous preparons et ajustons jusqu a validation.</p>
          </div>
        </div>
      </section>

      <div className="footer">© 2026 Mon Portfolio — Tous droits reserves.</div>
    </div>
  );
}
