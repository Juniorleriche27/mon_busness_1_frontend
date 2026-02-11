import { useRouter } from "next/router";
import {
  CONTACT_EMAIL,
  HOSTING,
  SERVICE_CATEGORIES,
  SERVICES,
  WHATSAPP_LINK,
  servicePriceLabel,
} from "../lib/catalog";

const HOME_SERVICE_IDS = ["portfolio", "vitrine", "cv", "lettre"];
const HOME_SERVICES = SERVICES.filter((service) => HOME_SERVICE_IDS.includes(service.id));

const formatUsd = (value) => (value / 600).toFixed(2);
const CATEGORY_LABELS = SERVICE_CATEGORIES.map((cat) => cat.label).join(" / ");

const PROMISE_KPIS = [
  { title: "24-72h", subtitle: "Delai moyen" },
  { title: "10 services", subtitle: "Candidature / Web / Data" },
  { title: "Brief en 5 min", subtitle: "Formulaire rapide" },
];

const PROCESS_STEPS = [
  {
    step: "Etape 1",
    title: "Brief rapide",
    text: "Vous partagez vos objectifs, contenus et contraintes.",
  },
  {
    step: "Etape 2",
    title: "Validation & plan",
    text: "Nous confirmons le scope et les priorites avant production.",
  },
  {
    step: "Etape 3",
    title: "Livraison & suivi",
    text: "Livraison propre + ajustements si necessaire.",
  },
];

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
          <a className="btn btn-light" href="/services">Voir tous les services</a>
          <a className="btn btn-light" href={`mailto:${CONTACT_EMAIL}`}>Email</a>
          <a className="btn btn-primary" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </header>

      <section className="home-hero panel-glow reveal">
        <div className="hero-copy">
          <span className="tag">Studio digital</span>
          <h1>Commandez votre service avec un brief complet et exploitable</h1>
          <p>
            Le formulaire est concu pour filtrer les demandes serieuses et accelerer la livraison.
            Vous pouvez combiner plusieurs services dans une seule commande.
          </p>
          <div className="hero-kpi-grid">
            <article className="kpi-card">
              <strong>{SERVICES.length} services</strong>
              <span>{CATEGORY_LABELS}</span>
            </article>
            <article className="kpi-card">
              <strong>24h - 72h</strong>
              <span>selon la complexite</span>
            </article>
            <article className="kpi-card">
              <strong>CFA + USD</strong>
              <span>tarifs clairs</span>
            </article>
          </div>
        </div>

        <div className="hero-visual floaty">
          <div className="visual-card large shimmer" />
          <div className="visual-row">
            <div className="visual-card shimmer" />
            <div className="visual-card shimmer" />
          </div>
          <div className="visual-strip shimmer" />
        </div>
      </section>

      <section className="promise-band reveal delay-1">
        <div className="promise-header">
          <span className="promise-tag">Notre promesse</span>
          <h2>Un service pro, livre vite, avec un brief precis.</h2>
          <p>Des livrables clairs, une communication directe et une execution rapide.</p>
        </div>
        <div className="promise-kpis">
          {PROMISE_KPIS.map((kpi) => (
            <article className="promise-card" key={kpi.title}>
              <strong>{kpi.title}</strong>
              <span>{kpi.subtitle}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel section-spacing reveal delay-2">
        <div className="section-head compact">
          <h2>Choisissez votre parcours</h2>
          <p>Un clic pour ouvrir le formulaire de service.</p>
        </div>

        <div className="service-grid home-grid">
          {HOME_SERVICES.map((service) => (
            <article className="service-tile" key={service.id}>
              <h3>{service.title}</h3>
              <p className="muted">{service.short}</p>
              <p>{service.cardDescription}</p>
              <div className="price-line strong">{servicePriceLabel(service)}</div>
              <button
                className="btn btn-primary block"
                type="button"
                onClick={() => router.push(`/order/${service.id}`)}
              >
                Continuer
              </button>
            </article>
          ))}
        </div>

        <div className="actions">
          <a className="btn btn-light" href="/services">Voir tous les services</a>
        </div>
      </section>

      <section className="panel section-spacing reveal delay-3">
        <div className="section-head compact">
          <h2>Comment ca se passe</h2>
          <p>Un process simple et efficace en 3 etapes.</p>
        </div>
        <div className="process-grid">
          {PROCESS_STEPS.map((step) => (
            <article className="process-card" key={step.step}>
              <span className="step-tag">{step.step}</span>
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel section-spacing reveal delay-4">
        <div className="pricing-ribbon">
          <article>
            <h4>Hebergement mensuel</h4>
            <p>{HOSTING.monthly.toLocaleString("fr-FR")} CFA (~${formatUsd(HOSTING.monthly)}) / mois</p>
          </article>
          <article>
            <h4>Hebergement annuel</h4>
            <p>{HOSTING.yearly.toLocaleString("fr-FR")} CFA (~${formatUsd(HOSTING.yearly)}) / an</p>
          </article>
          <article>
            <h4>Contact direct</h4>
            <p>{CONTACT_EMAIL} | +228 92 09 25 72</p>
          </article>
        </div>
      </section>

      <footer className="footer-note">2026 Mon Portfolio Studio. Brief complet = execution plus rapide.</footer>
    </main>
  );
}
