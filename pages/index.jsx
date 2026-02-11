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
              <strong>{SERVICES.length} services</strong>
              <span>{SERVICE_CATEGORIES.map((cat) => cat.label).join(" · ")}</span>
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

      <section className="panel section-spacing">
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
