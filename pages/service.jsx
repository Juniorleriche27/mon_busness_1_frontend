import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

const MODE_A = "A";
const MODE_B = "B";
const MODE_CV = "CV";
const MODE_LM = "LM";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api-wov6.onrender.com";

const content = {
  A: {
    label: "Portfolio candidat",
    title: "Portfolio candidat, clair et credible",
    subtitle: "Projets + preuves + competences.",
    price: "29 900 CFA",
    cta: "Demander mon portfolio",
    secondary: "Voir un exemple",
    deliverables: ["Profil + competences", "Projets avec preuves", "Contact rapide"],
    steps: ["Brief + CV + projets", "Structure + textes", "Livraison"],
  },
  B: {
    label: "Vitrine entreprise",
    title: "Page vitrine entreprise, prete a convertir",
    subtitle: "Offres + credibilite + contact.",
    price: "59 900 CFA",
    cta: "Demander ma vitrine",
    secondary: "Voir des exemples",
    deliverables: ["Page vitrine", "Bloc preuves", "CTA contact"],
    steps: ["Brief entreprise", "Structure offre + CTA", "Livraison"],
  },
  CV: {
    label: "CV professionnel",
    title: "CV moderne et efficace",
    subtitle: "Clair, structure, adapte au poste.",
    price: "9 900 CFA",
    cta: "Demander mon CV",
    secondary: "Voir un exemple",
    deliverables: ["CV clair", "Mise en page pro", "Conseils ciblage"],
    steps: ["Infos + experiences", "Rédaction", "Livraison"],
  },
  LM: {
    label: "Lettre de motivation",
    title: "Lettre courte et convaincante",
    subtitle: "Impactante, adaptee au poste.",
    price: "4 900 CFA",
    cta: "Demander ma lettre",
    secondary: "Voir un exemple",
    deliverables: ["Lettre claire", "Argumentaire fort", "Ton pro"],
    steps: ["Infos + poste", "Rédaction", "Livraison"],
  },
};

function ModeSwitch({ mode, onChange }) {
  return (
    <div className="chips" style={{ marginBottom: 12 }}>
      {[MODE_A, MODE_B, MODE_CV, MODE_LM].map((m) => (
        <button
          key={m}
          className={`btn ${mode === m ? "primary" : ""}`}
          onClick={() => onChange(m)}
          type="button"
        >
          {m === MODE_A
            ? "Portfolio (A)"
            : m === MODE_B
            ? "Vitrine (B)"
            : m === MODE_CV
            ? "CV"
            : "Lettre"}
        </button>
      ))}
    </div>
  );
}

export default function Service() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);

  const examplesRef = useRef(null);
  const formRef = useRef(null);

  const mode = useMemo(() => {
    const queryMode = (router.query.mode || "").toString().toUpperCase();
    if ([MODE_A, MODE_B, MODE_CV, MODE_LM].includes(queryMode)) return queryMode;
    return "";
  }, [router.query.mode]);

  const payload = mode ? content[mode] : null;

  const updateMode = (nextMode) => {
    router.push(`/service?mode=${nextMode}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    if (!mode) {
      setNotice("Merci de choisir un parcours.");
      return;
    }
    setSubmitting(true);
    setNotice("Envoi en cours...");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Erreur serveur");
      }
      const result = await res.json();
      setNotice(`Demande recue. Reference: ${result.id}`);
      if (formEl) formEl.reset();
    } catch (err) {
      setNotice(`Erreur d'envoi: ${err.message}. Merci de reessayer.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssistant = async (event) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const message = formData.get("assistant_message").toString().trim();
    if (!message) return;
    setAssistantLoading(true);
    setAssistantReply("...");
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setAssistantReply(data.reply || "Bonjour ! Comment puis-je vous aider ?");
      formEl.reset();
    } catch (err) {
      setAssistantReply("Erreur. Merci de reessayer.");
    } finally {
      setAssistantLoading(false);
    }
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
              <h1 className="hero-title">Choisissez votre service</h1>
              <p className="hero-sub">Aucun contenu ne s affiche sans votre choix.</p>
            </div>
            <div className="cards">
              {[MODE_A, MODE_B, MODE_CV, MODE_LM].map((m) => (
                <div className="card emphasis" key={m}>
                  <h3>{content[m].label}</h3>
                  <p style={{ color: "var(--muted)" }}>{content[m].subtitle}</p>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>{content[m].price}</div>
                  <button className="btn primary" onClick={() => updateMode(m)}>
                    Continuer
                  </button>
                </div>
              ))}
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
            {mode === MODE_B ? (
              <div className="mockup">
                <div className="mockup-hero" />
                <div className="mockup-grid">
                  <div className="mockup-card" />
                  <div className="mockup-card" />
                </div>
              </div>
            ) : (
              <div className="portrait">
                <div className="badge">{mode}</div>
              </div>
            )}
          </div>
          <div>
            <span className="logo-badge">Service portfolio</span>
            <h1 className="hero-title">{payload.title}</h1>
            <p className="hero-sub">{payload.subtitle}</p>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>{payload.price}</div>
            <div className="actions">
              <button className="btn primary" type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>
                {payload.cta}
              </button>
              <button className="btn" type="button" onClick={() => examplesRef.current?.scrollIntoView({ behavior: "smooth" })}>
                {payload.secondary}
              </button>
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

      <section className="section" ref={examplesRef}>
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

      <section className="section" ref={formRef}>
        <h2>Formulaire</h2>
        <p className="hero-sub">Remplissez ce que vous avez. Nous pouvons completer ensuite.</p>
        <form onSubmit={handleSubmit}>
          {mode === MODE_A && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" />
              <input className="input" name="country" placeholder="Pays" />
              <input className="input" name="city" placeholder="Ville" />
              <input className="input" name="email" placeholder="Email" />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" />
              <input className="input" name="target_role" placeholder="Poste / role vise" />
              <textarea name="projects" placeholder="Projets / liens" />
            </div>
          )}
          {mode === MODE_B && (
            <div className="form-grid">
              <input className="input" name="company_name" placeholder="Nom entreprise" />
              <input className="input" name="sector" placeholder="Activite / secteur" />
              <input className="input" name="country" placeholder="Pays" />
              <input className="input" name="city" placeholder="Ville" />
              <input className="input" name="email" placeholder="Email pro" />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" />
              <textarea name="services" placeholder="Services / produits" />
              <input className="input" name="service_area" placeholder="Zone de service" />
              <input className="input" name="hours" placeholder="Horaires" />
              <input className="input" name="pricing" placeholder="Prix / forfaits" />
              <textarea name="proofs" placeholder="Realisations / references" />
            </div>
          )}
          {mode === MODE_CV && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" />
              <input className="input" name="email" placeholder="Email" />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" />
              <input className="input" name="target_role" placeholder="Poste vise" />
              <textarea name="experiences" placeholder="Experiences principales" />
              <textarea name="skills" placeholder="Competences" />
            </div>
          )}
          {mode === MODE_LM && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" />
              <input className="input" name="email" placeholder="Email" />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" />
              <input className="input" name="target_role" placeholder="Poste vise" />
              <textarea name="motivation" placeholder="Pourquoi ce poste ?" />
              <textarea name="experience" placeholder="Experience pertinente" />
            </div>
          )}

          <div className="actions">
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? "Envoi..." : "Envoyer ma demande"}
            </button>
            <a className="btn" href="https://wa.me/22892092572" target="_blank" rel="noreferrer">
              WhatsApp direct
            </a>
          </div>
          {notice ? <div className="notice">{notice}</div> : null}
        </form>
      </section>

      <section className="section">
        <h2>Assistant</h2>
        <p className="hero-sub">Questions sur nos services uniquement.</p>
        <form onSubmit={handleAssistant}>
          <div className="form-grid">
            <input className="input" name="assistant_message" placeholder="Posez votre question" />
          </div>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={assistantLoading}>
              {assistantLoading ? "En cours..." : "Envoyer"}
            </button>
          </div>
          {assistantReply ? <div className="notice">{assistantReply}</div> : null}
        </form>
      </section>

      <div className="footer">© 2026 Mon Portfolio  Tous droits reserves.</div>
    </div>
  );
}
