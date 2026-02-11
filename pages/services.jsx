import { useMemo } from "react";
import {
  CONTACT_EMAIL,
  SERVICE_CATEGORIES,
  SERVICES,
  WHATSAPP_LINK,
  servicePriceLabel,
} from "../lib/catalog";

export default function ServicesPage() {
  const grouped = useMemo(() => {
    return SERVICE_CATEGORIES.map((category) => ({
      ...category,
      services: SERVICES.filter((service) => service.category === category.id),
    }));
  }, []);

  return (
    <main className="layout">
      <header className="site-header glass">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <strong>Nos services</strong>
            <small>Catalogue complet</small>
          </div>
        </div>
        <div className="header-actions">
          <a className="btn btn-light" href="/">Accueil</a>
          <a className="btn btn-light" href={`mailto:${CONTACT_EMAIL}`}>Email</a>
          <a className="btn btn-primary" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </header>

      <section className="panel section-spacing">
        <div className="section-head compact">
          <h1>Services disponibles</h1>
          <p>Choisissez le service qui correspond a votre besoin et continuez vers le formulaire dedie.</p>
        </div>
      </section>

      {grouped.map((category) => (
        <section className="panel section-spacing" key={category.id}>
          <div className="section-head compact">
            <h2>{category.label}</h2>
            <p>{category.services.length} service(s) dans cette categorie.</p>
          </div>

          <div className="service-grid">
            {category.services.map((service) => (
              <article className="service-tile" key={service.id}>
                <h3>{service.title}</h3>
                <p className="muted">{service.cardDescription}</p>
                <div className="price-line strong">{servicePriceLabel(service)}</div>
                <a className="btn btn-primary block" href={`/order/${service.id}`}>Continuer</a>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className="footer-note">2026 Mon Portfolio Studio. Plus de services sur demande.</footer>
    </main>
  );
}
