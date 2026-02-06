import { useMemo, useState } from "react";
import { useRouter } from "next/router";

const MODE_A = "A";
const MODE_B = "B";

const content = {
  A: {
    label: "Portfolio candidat",
    title: "Je cree votre portfolio candidat, clair et credible",
    subtitle: "Projets + preuves + competences, pour declencher des entretiens",
    cta: "Demander mon portfolio",
    secondary: "Voir un exemple",
    deliverables: [
      "Portfolio pro + profil + competences",
      "Projets presentes avec preuves",
      "Contact rapide (WhatsApp + email)",
      "Mobile-first et rapide",
    ],
    steps: [
      "Brief + CV + 2-3 projets",
      "Validation objectif/positionnement",
      "Creation structure + textes",
      "Ajustements + livraison (48h apres elements)",
    ],
  },
  B: {
    label: "Vitrine entreprise",
    title: "Je cree votre page vitrine entreprise, prete a convertir",
    subtitle: "Offres + credibilite + contact, pour generer des demandes",
    cta: "Demander ma vitrine",
    secondary: "Voir des exemples",
    deliverables: [
      "Page vitrine (services/offres)",
      "Bloc preuves (realisations, photos, references)",
      "CTA contact (WhatsApp + formulaire)",
      "Mobile-first et clair",
    ],
    steps: [
      "Brief entreprise + logo + offres + visuels",
      "Structure offre + CTA",
      "Creation vitrine + textes",
      "Ajustements + livraison (48h apres elements)",
    ],
  },
};

function ModeSwitch({ mode, onChange }) {
  return (
    <div className="chips" style={{ marginBottom: 12 }}>
      <button
        className={`btn ${mode === MODE_A ? "primary" : ""}`}
        onClick={() => onChange(MODE_A)}
        type="button"
      >
        Particulier (A)
      </button>
      <button
        className={`btn ${mode === MODE_B ? "primary" : ""}`}
        onClick={() => onChange(MODE_B)}
        type="button"
      >
        Entreprise (B)
      </button>
    </div>
  );
}

export default function Service() {
  const router = useRouter();
  const [notice, setNotice] = useState("");

  const mode = useMemo(() => {
    const queryMode = (router.query.mode || "").toString().toUpperCase();
    return queryMode === MODE_B ? MODE_B : queryMode === MODE_A ? MODE_A : "";
  }, [router.query.mode]);

  const payload = mode ? content[mode] : null;

  const updateMode = (nextMode) => {
    router.push(`/service?mode=${nextMode}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!mode) {
      setNotice("Merci de choisir un parcours A ou B.");
      return;
    }
    setNotice(
      mode === MODE_A
        ? "Demande candidat recue. Nous revenons vers vous rapidement."
        : "Demande entreprise recue. Reponse rapide apres analyse des elements."
    );
  };

  if (!mode) {
    return (
      <div className="container">
        <header className="nav">
          <div className="logo">
            <span className="logo-badge">Service</span>
            <span>Mon Portfolio</span>
          </div>
          <a className="btn" href="/">Retour accueil</a>
        </header>

        <section className="hero">
          <div className="hero-grid">
            <div>
              <span className="pill">Choix obligatoire</span>
              <h1 className="hero-title">
                Choisissez votre <strong>parcours</strong>
              </h1>
              <p className="hero-sub">Aucun contenu ne s affiche sans votre choix.</p>
            </div>
            <div className="cards">
              <div className="card emphasis">
                <h3>Portfolio candidat</h3>
                <p style={{ color: "var(--muted)" }}>
                  Pour postuler (emploi, stage, alternance) avec des preuves solides.
                </p>
                <button className="btn primary" onClick={() => updateMode(MODE_A)}>
                  Continuer (A)
                </button>
              </div>
              <div className="card emphasis">
                <h3>Vitrine entreprise</h3>
                <p style={{ color: "var(--muted)" }}>
                  Pour presenter vos offres et generer des demandes qualifiees.
                </p>
                <button className="btn primary" onClick={() => updateMode(MODE_B)}>
                  Continuer (B)
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="nav">
        <div className="logo">
          <span className="logo-badge">Service</span>
          <span>{payload.label}</span>
        </div>
        <a className="btn" href="/">Accueil</a>
      </header>

      <ModeSwitch mode={mode} onChange={updateMode} />

      <section className="hero">
        <div className="hero-grid">
          <div>
            {mode === MODE_A ? (
              <div className="portrait">
                <div className="badge">A</div>
              </div>
            ) : (
              <div className="mockup">
                <div className="mockup-hero" />
                <div className="mockup-grid">
                  <div className="mockup-card" />
                  <div className="mockup-card" />
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="logo-badge">Service portfolio</span>
            <h1 className="hero-title">{payload.title}</h1>
            <p className="hero-sub">{payload.subtitle}</p>
            <div className="actions">
              <button className="btn primary">{payload.cta}</button>
              <button className="btn">{payload.secondary}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <h2>Ce que vous obtenez</h2>
            <ul className="list">
              {payload.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Comment ca se passe</h2>
            <ul className="list">
              {payload.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Exemples</h2>
        <div className="chips">
          <a className="chip" href="https://www.pieagency.fr/" target="_blank" rel="noreferrer">
            pieagency.fr
          </a>
          <a className="chip" href="https://innovaplus.africa/" target="_blank" rel="noreferrer">
            innovaplus.africa
          </a>
        </div>
      </section>

      <section className="section">
        <h2>Formulaire {mode === MODE_A ? "candidat" : "entreprise"}</h2>
        <p className="hero-sub">
          Remplissez ce que vous avez. Nous pouvons completer ensuite.
        </p>
        <form onSubmit={handleSubmit}>
          {mode === MODE_A ? (
            <div className="form-grid">
              <input className="input" placeholder="Nom complet" />
              <input className="input" placeholder="Pays" />
              <input className="input" placeholder="Ville" />
              <input className="input" placeholder="Email" />
              <input className="input" placeholder="WhatsApp / Telephone" />
              <input className="input" placeholder="Poste / role vise" />
              <input className="input" placeholder="Domaine" />
              <input className="input" placeholder="Langue principale" />
              <textarea placeholder="2-3 projets (liens/titres)" />
              <textarea placeholder="Forces cles" />
              <textarea placeholder="Style souhaite" />
            </div>
          ) : (
            <div className="form-grid">
              <input className="input" placeholder="Nom entreprise" />
              <input className="input" placeholder="Activite / secteur" />
              <input className="input" placeholder="Pays" />
              <input className="input" placeholder="Ville" />
              <input className="input" placeholder="Email pro" />
              <input className="input" placeholder="WhatsApp / Telephone" />
              <textarea placeholder="Services / produits (3 a 7 items)" />
              <input className="input" placeholder="Zone de service (option)" />
              <input className="input" placeholder="Horaires (option)" />
              <input className="input" placeholder="Prix / forfaits (option)" />
              <textarea placeholder="Realisations / references" />
              <input className="input" placeholder="Reseaux sociaux (option)" />
              <input className="input" placeholder="Couleurs (option)" />
            </div>
          )}
          <div className="actions">
            <button className="btn primary" type="submit">
              {mode === MODE_A ? "Envoyer ma demande (candidat)" : "Envoyer ma demande (entreprise)"}
            </button>
            <a className="btn" href="https://wa.me/22892092572" target="_blank" rel="noreferrer">
              WhatsApp direct
            </a>
          </div>
          {notice ? <div className="notice">{notice}</div> : null}
        </form>
      </section>

      <div className="footer">© 2026 Mon Portfolio  Tous droits reserves.</div>
    </div>
  );
}
