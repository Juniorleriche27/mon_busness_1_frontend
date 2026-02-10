import { useRouter } from "next/router";

const RATE = 600;
const PRICES = {
  A: 29900,
  B: 59900,
  CV: 9900,
  LM: 4900,
  HOST_MONTH: 2000,
  HOST_YEAR: 24000,
};

const SERVICES = [
  {
    mode: "A",
    title: "Portfolio candidat",
    subtitle: "Emploi, stage, alternance",
    details: "Positionnement, projets, preuves et contact direct.",
    price: PRICES.A,
  },
  {
    mode: "B",
    title: "Vitrine entreprise",
    subtitle: "Site business sur mesure",
    details: "Architecture de conversion, pages de vente, preuves et CTA.",
    price: PRICES.B,
    from: true,
  },
  {
    mode: "CV",
    title: "CV professionnel",
    subtitle: "Candidature ciblee",
    details: "Structure claire, mots-cles metier, version finale exploitable.",
    price: PRICES.CV,
  },
  {
    mode: "LM",
    title: "Lettre de motivation",
    subtitle: "Emploi, universite, bourse",
    details: "Argumentaire adapte au poste ou programme vise.",
    price: PRICES.LM,
  },
];

function formatCfa(value) {
  return value.toLocaleString("fr-FR");
}

function formatUsd(value) {
  return (value / RATE).toFixed(2);
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="layout">
      <header className="site-header glass">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <strong>Mon Portfolio Studio</strong>
            <small>Portfolio, Vitrine, CV, Lettre</small>
          </div>
        </div>
        <div className="header-actions">
          <a className="btn btn-light" href="mailto:senirolamadokou@gmail.com">Email</a>
          <a className="btn btn-primary" href="https://wa.me/22892092572" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </header>

      <section className="home-hero panel-glow">
        <div className="hero-copy">
          <span className="tag">Studio digital</span>
          <h1>Commandez votre service avec un brief complet et exploitable</h1>
          <p>
            Le formulaire est concu pour filtrer les demandes serieuses et accelerer la livraison.
            Vous pouvez combiner plusieurs services dans une seule commande.
          </p>
          <div className="hero-kpi-grid">
            <article>
              <strong>4 services</strong>
              <span>Portfolio, Vitrine, CV, Lettre</span>
            </article>
            <article>
              <strong>24h - 72h</strong>
              <span>selon la complexite</span>
            </article>
            <article>
              <strong>CFA + USD</strong>
              <span>tarifs clairs</span>
            </article>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card large" />
          <div className="visual-row">
            <div className="visual-card" />
            <div className="visual-card" />
          </div>
          <div className="visual-strip" />
        </div>
      </section>

      <section className="panel section-spacing">
        <div className="section-head compact">
          <h2>Choisissez votre parcours</h2>
          <p>Un clic pour ouvrir le formulaire de service.</p>
        </div>

        <div className="service-grid home-grid">
          {SERVICES.map((service) => (
            <article className="service-tile" key={service.mode}>
              <h3>{service.title}</h3>
              <p className="muted">{service.subtitle}</p>
              <p>{service.details}</p>
              <div className="price-line strong">
                {service.from ? "A partir de " : ""}
                {formatCfa(service.price)} CFA (~${formatUsd(service.price)})
              </div>
              <button className="btn btn-primary block" type="button" onClick={() => router.push(`/service?mode=${service.mode}`)}>
                Continuer
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel section-spacing">
        <div className="pricing-ribbon">
          <article>
            <h4>Hebergement mensuel</h4>
            <p>{formatCfa(PRICES.HOST_MONTH)} CFA (~${formatUsd(PRICES.HOST_MONTH)}) / mois</p>
          </article>
          <article>
            <h4>Hebergement annuel</h4>
            <p>{formatCfa(PRICES.HOST_YEAR)} CFA (~${formatUsd(PRICES.HOST_YEAR)}) / an</p>
          </article>
          <article>
            <h4>Contact direct</h4>
            <p>senirolamadokou@gmail.com | +228 92 09 25 72</p>
          </article>
        </div>
      </section>

      <footer className="footer-note">2026 Mon Portfolio Studio. Brief complet = execution plus rapide.</footer>
    </main>
  );
}
