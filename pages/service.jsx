import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

const MODE_A = "A";
const MODE_B = "B";
const MODE_CV = "CV";
const MODE_LM = "LM";
const RATE = 600;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api-wov6.onrender.com";

const pricing = {
  A: 29900,
  B: 59900,
  CV: 9900,
  LM: 4900,
  HOST_MONTH: 2000,
  HOST_YEAR: 24000,
};

const serviceOptions = [
  { id: MODE_A, label: "Portfolio candidat", price: pricing.A },
  { id: MODE_B, label: "Vitrine entreprise", price: pricing.B },
  { id: MODE_CV, label: "CV professionnel", price: pricing.CV },
  { id: MODE_LM, label: "Lettre de motivation", price: pricing.LM },
];

const content = {
  A: {
    label: "Portfolio candidat",
    title: "Portfolio candidat, clair et credible",
    subtitle: "Projets, preuves, competences. Simple et efficace.",
    cta: "Demander mon portfolio",
    secondary: "Voir un exemple",
    deliverables: ["Profil + competences", "Projets avec preuves", "Contact rapide"],
    steps: ["Brief + CV + projets", "Structure + textes", "Livraison"],
  },
  B: {
    label: "Vitrine entreprise",
    title: "Page vitrine entreprise, prete a convertir",
    subtitle: "Offres, credibilite, contact.",
    cta: "Demander ma vitrine",
    secondary: "Voir des exemples",
    deliverables: ["Page vitrine", "Bloc preuves", "CTA contact"],
    steps: ["Brief entreprise", "Structure offre + CTA", "Livraison"],
  },
  CV: {
    label: "CV professionnel",
    title: "CV moderne et efficace",
    subtitle: "Clair, structure, adapte au poste.",
    cta: "Demander mon CV",
    secondary: "Voir un exemple",
    deliverables: ["CV clair", "Mise en page pro", "Conseils ciblage"],
    steps: ["Infos + experiences", "Redaction", "Livraison"],
  },
  LM: {
    label: "Lettre de motivation",
    title: "Lettre de motivation",
    subtitle: "Pour emploi, universite ou bourse.",
    cta: "Demander ma lettre",
    secondary: "Voir un exemple",
    deliverables: ["Lettre claire", "Structure adaptee", "Ton professionnel"],
    steps: ["Infos + objectif", "Redaction", "Livraison"],
  },
};

const formatCfa = (value) => value.toLocaleString("fr-FR");
const formatUsd = (value) => (value / RATE).toFixed(2);

function priceLabel(mode) {
  if (mode === MODE_B) {
    return `A partir de ${formatCfa(pricing.B)} CFA (~$${formatUsd(pricing.B)})`;
  }
  const base = pricing[mode];
  return `${formatCfa(base)} CFA (~$${formatUsd(base)})`;
}

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

function formToObject(formData) {
  const data = {};
  for (const [key, value] of formData.entries()) {
    if (key in data) {
      const current = data[key];
      data[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      data[key] = value;
    }
  }
  return data;
}

export default function Service() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [extras, setExtras] = useState([]);

  const examplesRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const existing = window.localStorage.getItem("assistant_session");
    if (existing) {
      setSessionId(existing);
    } else {
      const id = `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem("assistant_session", id);
      setSessionId(id);
    }
  }, []);

  const mode = useMemo(() => {
    const queryMode = (router.query.mode || "").toString().toUpperCase();
    if ([MODE_A, MODE_B, MODE_CV, MODE_LM].includes(queryMode)) return queryMode;
    return "";
  }, [router.query.mode]);

  const payload = mode ? content[mode] : null;
  const basePrice = pricing[mode] || 0;
  const baseLabel = mode === MODE_B
    ? `A partir de ${formatCfa(pricing.B)} CFA (~$${formatUsd(pricing.B)})`
    : `${formatCfa(basePrice)} CFA (~$${formatUsd(basePrice)})`;
  const extrasTotal = extras.reduce((sum, id) => {
    const found = serviceOptions.find((item) => item.id === id);
    return sum + (found ? found.price : 0);
  }, 0);
  const totalLabel = mode === MODE_B
    ? `Total estimatif: a partir de ${formatCfa(basePrice + extrasTotal)} CFA (~$${formatUsd(basePrice + extrasTotal)})`
    : `Total estimatif: ${formatCfa(basePrice + extrasTotal)} CFA (~$${formatUsd(basePrice + extrasTotal)})`;

  const updateMode = (nextMode) => {
    router.push(`/service?mode=${nextMode}`);
  };

  useEffect(() => {
    setExtras([]);
  }, [mode]);

  const toggleExtra = (id) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
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
    const data = formToObject(formData);
    data.primary_service = mode;
    data.additional_services = extras;
    data.estimated_total_cfa = basePrice + extrasTotal;
    data.estimated_total_usd = formatUsd(basePrice + extrasTotal);

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
      const followup = result.missing_questions && result.missing_questions.length
        ? `\nQuestions utiles: ${result.missing_questions.join(" | ")}`
        : "";
      const emailInfo = result.email_status ? `\nEmail: ${result.email_status}` : "";
      setNotice(`Demande recue. Reference: ${result.id}.${followup}${emailInfo}`);
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
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId || "", message }),
      });
      const data = await res.json();
      const reply = data.reply || "Bonjour ! Comment puis-je vous aider ?";
      setAssistantReply(reply);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      formEl.reset();
    } catch (err) {
      const fallback = "Erreur. Merci de reessayer.";
      setAssistantReply(fallback);
      setMessages((prev) => [...prev, { role: "bot", text: fallback }]);
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
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>{priceLabel(m)}</div>
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
            <div style={{ fontWeight: 700, marginBottom: 12 }}>{baseLabel}</div>
            {(mode === MODE_A || mode === MODE_B) && (
              <>
                <div style={{ color: "var(--muted)", marginBottom: 8 }}>
                  Hebergement: {formatCfa(pricing.HOST_MONTH)} CFA (~${formatUsd(pricing.HOST_MONTH)}) / mois
                </div>
                <div style={{ color: "var(--muted)", marginBottom: 12 }}>
                  Hebergement annuel: {formatCfa(pricing.HOST_YEAR)} CFA (~${formatUsd(pricing.HOST_YEAR)})
                </div>
              </>
            )}
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
        <h2>Formulaire complet</h2>
        <p className="hero-sub">Formulaire detaille pour filtrer les demandes serieuses.</p>
        <form onSubmit={handleSubmit}>
          <div className="section" style={{ marginBottom: 12 }}>
            <h3>Services souhaites</h3>
            <p className="hero-sub">Service principal: <strong>{payload.label}</strong></p>
            <div className="chips">
              {serviceOptions.filter((item) => item.id !== mode).map((item) => (
                <label key={item.id} className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    name="extra_service"
                    value={item.id}
                    checked={extras.includes(item.id)}
                    onChange={() => toggleExtra(item.id)}
                  />
                  {item.label} ({formatCfa(item.price)} CFA)
                </label>
              ))}
            </div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{totalLabel}</div>
          </div>
          {mode === MODE_A && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" required />
              <input className="input" name="email" placeholder="Email" required />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
              <input className="input" name="country" placeholder="Pays" required />
              <input className="input" name="city" placeholder="Ville" required />
              <input className="input" name="target_role" placeholder="Poste / role vise" required />
              <input className="input" name="experience_level" placeholder="Niveau (junior, senior)" required />
              <textarea name="projects" placeholder="Projets (liens + details)" required />
              <textarea name="skills" placeholder="Competences principales" required />
              <textarea name="bio" placeholder="Mini bio" required />
              <textarea name="achievements" placeholder="Realisations / resultats" required />
              <textarea name="tools" placeholder="Outils utilises" required />
              <textarea name="education" placeholder="Formation" required />
              <textarea name="certifications" placeholder="Certifications (si applicable)" />
              <textarea name="assets_links" placeholder="Liens CV/Drive/LinkedIn" required />
              <select name="hosting_option" className="input" required>
                <option value="">Hebergement</option>
                <option value="none">Aucun</option>
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
              <input className="input" name="deadline" placeholder="Delai souhaite" required />
              <label style={{ fontSize: 13 }}>
                <input type="checkbox" name="consent" required /> J accepte d etre recontacte
              </label>
            </div>
          )}
          {mode === MODE_B && (
            <div className="form-grid">
              <input className="input" name="company_name" placeholder="Nom entreprise" required />
              <input className="input" name="sector" placeholder="Activite / secteur" required />
              <input className="input" name="country" placeholder="Pays" required />
              <input className="input" name="city" placeholder="Ville" required />
              <input className="input" name="email" placeholder="Email pro" required />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
              <textarea name="services" placeholder="Services / produits (3 a 7 items)" required />
              <textarea name="target_clients" placeholder="Clients cibles" required />
              <textarea name="goals" placeholder="Objectif principal du site" required />
              <textarea name="value_prop" placeholder="Proposition de valeur" required />
              <textarea name="pages" placeholder="Pages souhaitees" required />
              <input className="input" name="budget" placeholder="Budget estime" required />
              <input className="input" name="deadline" placeholder="Delai souhaite" required />
              <textarea name="references" placeholder="Sites que vous aimez (liens)" />
              <textarea name="proofs" placeholder="Realisations / references" />
              <textarea name="branding" placeholder="Logo/charte (lien)" required />
              <textarea name="assets_links" placeholder="Photos/visuels (liens)" required />
              <select name="hosting_option" className="input" required>
                <option value="">Hebergement</option>
                <option value="none">Aucun</option>
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
              <label style={{ fontSize: 13 }}>
                <input type="checkbox" name="consent" required /> J accepte d etre recontacte
              </label>
            </div>
          )}
          {mode === MODE_CV && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" required />
              <input className="input" name="email" placeholder="Email" required />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
              <input className="input" name="target_role" placeholder="Poste vise" required />
              <input className="input" name="country" placeholder="Pays" required />
              <textarea name="experience" placeholder="Experiences principales" required />
              <textarea name="education" placeholder="Formation" required />
              <textarea name="skills" placeholder="Competences" required />
              <textarea name="achievements" placeholder="Realisations" required />
              <textarea name="assets_links" placeholder="Liens docs/Drive" required />
              <input className="input" name="deadline" placeholder="Delai souhaite" required />
              <label style={{ fontSize: 13 }}>
                <input type="checkbox" name="consent" required /> J accepte d etre recontacte
              </label>
            </div>
          )}
          {mode === MODE_LM && (
            <div className="form-grid">
              <input className="input" name="full_name" placeholder="Nom complet" required />
              <input className="input" name="email" placeholder="Email" required />
              <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
              <input className="input" name="target_role" placeholder="Poste vise" required />
              <input className="input" name="company_name" placeholder="Entreprise cible" required />
              <textarea name="job_link" placeholder="Lien offre ou description" required />
              <textarea name="motivation" placeholder="Pourquoi ce poste ?" required />
              <textarea name="experience" placeholder="Experience pertinente" required />
              <textarea name="achievements" placeholder="Realisations" required />
              <input className="input" name="deadline" placeholder="Delai souhaite" required />
              <label style={{ fontSize: 13 }}>
                <input type="checkbox" name="consent" required /> J accepte d etre recontacte
              </label>
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

      {assistantOpen && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <span>Assistant</span>
            <button className="btn" type="button" onClick={() => setAssistantOpen(false)}>Fermer</button>
          </div>
          <div className="assistant-messages">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`assistant-bubble ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.text}
              </div>
            ))}
            {assistantReply && !messages.length && (
              <div className="assistant-bubble bot">{assistantReply}</div>
            )}
          </div>
          <form onSubmit={handleAssistant}>
            <input className="input" name="assistant_message" placeholder="Posez votre question" />
            <div className="actions">
              <button className="btn primary" type="submit" disabled={assistantLoading}>
                {assistantLoading ? "En cours..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <button className="assistant-button" type="button" onClick={() => setAssistantOpen((v) => !v)}>
        ?
      </button>

      <div className="footer">? 2026 Mon Portfolio ? Tous droits reserves.</div>
    </div>
  );
}
