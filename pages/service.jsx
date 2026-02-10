import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

const RATE = 600;
const MODE_A = "A";
const MODE_B = "B";
const MODE_CV = "CV";
const MODE_LM = "LM";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api-wov6.onrender.com";

const PRICES = {
  A: 29900,
  B: 59900,
  CV: 9900,
  LM: 4900,
  HOST_MONTH: 2000,
  HOST_YEAR: 24000,
};

const SERVICE_OPTIONS = [
  { id: MODE_A, short: "Portfolio (A)", label: "Portfolio candidat", price: PRICES.A },
  { id: MODE_B, short: "Vitrine (B)", label: "Vitrine entreprise", price: PRICES.B, from: true },
  { id: MODE_CV, short: "CV", label: "CV professionnel", price: PRICES.CV },
  { id: MODE_LM, short: "Lettre", label: "Lettre de motivation", price: PRICES.LM },
];

const CONTENT = {
  A: {
    nav: "Portfolio candidat",
    title: "Portfolio candidat clair et credible",
    subtitle: "Positionnement, projets, preuves et contact direct pour des candidatures serieuses.",
    cta: "Demander mon portfolio",
    points: [
      "Positionnement metier clair",
      "Projets detailles avec preuves",
      "Competences et outils",
      "Contact rapide (WhatsApp + email)",
      "Mobile first",
    ],
    steps: [
      "Brief complet et priorites",
      "Structure + message",
      "Production et validations",
      "Livraison finale",
    ],
  },
  B: {
    nav: "Vitrine entreprise",
    title: "Vitrine entreprise a partir de 59 900 CFA",
    subtitle: "Parcours de conversion, offre claire et contact immediat.",
    cta: "Demander ma vitrine",
    points: [
      "Architecture sur mesure",
      "Pages offres + preuves",
      "CTA conversion",
      "Zone service + horaires",
      "Mobile first",
    ],
    steps: [
      "Brief business detaille",
      "Strategie offres + CTA",
      "Design + contenu",
      "Mise en ligne",
    ],
  },
  CV: {
    nav: "CV professionnel",
    title: "CV professionnel",
    subtitle: "Emploi, stage, alternance, mobilite internationale.",
    cta: "Demander mon CV",
    points: [
      "Structure ATS",
      "Mots cles metier",
      "Mise en page pro",
      "Version finale exploitable",
    ],
    steps: [
      "Collecte infos",
      "Reecriture",
      "Mise en page",
      "Validation finale",
    ],
  },
  LM: {
    nav: "Lettre de motivation",
    title: "Lettre de motivation",
    subtitle: "Emploi, universite, bourse.",
    cta: "Demander ma lettre",
    points: [
      "Angle cible",
      "Argumentaire coherent",
      "Ton professionnel",
      "Version finale",
    ],
    steps: [
      "Brief contexte",
      "Structure",
      "Redaction",
      "Finalisation",
    ],
  },
};

const QUICK_QUESTIONS = [
  "Quels sont les tarifs ?",
  "Comment ca marche ?",
  "Donnez-moi le WhatsApp",
  "Je veux un pack de services",
];

function formatCfa(value) {
  return value.toLocaleString("fr-FR");
}

function formatUsd(value) {
  return (value / RATE).toFixed(2);
}

function toObject(formData) {
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

function FormSection({ title, hint, children }) {
  return (
    <section className="form-block">
      <div className="section-head compact">
        <h3>{title}</h3>
        {hint ? <p>{hint}</p> : null}
      </div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

function getMode(queryMode) {
  const value = (queryMode || "").toString().toUpperCase();
  if ([MODE_A, MODE_B, MODE_CV, MODE_LM].includes(value)) {
    return value;
  }
  return MODE_A;
}

function getSessionId() {
  if (typeof window === "undefined") {
    return "session_server";
  }
  const existing = window.localStorage.getItem("assistant_session_id");
  if (existing) {
    return existing;
  }
  const generated = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem("assistant_session_id", generated);
  return generated;
}

export default function ServicePage() {
  const router = useRouter();
  const mode = useMemo(() => getMode(router.query.mode), [router.query.mode]);
  const content = CONTENT[mode];

  const examplesRef = useRef(null);
  const formRef = useRef(null);

  const [extraServices, setExtraServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantSession, setAssistantSession] = useState("session_server");
  const [assistantText, setAssistantText] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Bonjour. Posez une question sur nos services, tarifs ou procedure." },
  ]);

  useEffect(() => {
    setAssistantSession(getSessionId());
  }, []);

  useEffect(() => {
    setExtraServices([]);
    setNotice({ type: "", text: "" });
  }, [mode]);

  const primaryPrice = PRICES[mode];
  const extraTotal = extraServices.reduce((sum, id) => {
    const found = SERVICE_OPTIONS.find((service) => service.id === id);
    return sum + (found ? found.price : 0);
  }, 0);
  const total = primaryPrice + extraTotal;

  const totalLabel = mode === MODE_B
    ? `Total estime: a partir de ${formatCfa(total)} CFA (~$${formatUsd(total)})`
    : `Total estime: ${formatCfa(total)} CFA (~$${formatUsd(total)})`;

  const switchMode = (nextMode) => {
    router.push(`/service?mode=${nextMode}`);
  };

  const toggleExtra = (id) => {
    setExtraServices((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const sendMessage = async (text) => {
    const cleaned = text.trim();
    if (!cleaned) {
      return;
    }

    setAssistantLoading(true);
    setMessages((current) => [...current, { role: "user", text: cleaned }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: assistantSession,
          message: cleaned,
          mode,
        }),
      });

      const result = await response.json().catch(() => ({}));
      const reply = result.reply || "Reponse indisponible. WhatsApp: +22892092572";
      setMessages((current) => [...current, { role: "bot", text: reply }]);
    } catch (_error) {
      setMessages((current) => [...current, { role: "bot", text: "Erreur temporaire. WhatsApp: +22892092572" }]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const onAssistantSubmit = async (event) => {
    event.preventDefault();
    const text = assistantText;
    setAssistantText("");
    await sendMessage(text);
  };

  const onLeadSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = toObject(new FormData(form));
    data.primary_service = mode;
    data.additional_services = extraServices;
    data.total_cfa = total;
    data.total_usd = formatUsd(total);

    setSubmitting(true);
    setNotice({ type: "info", text: "Envoi en cours..." });

    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, data }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.detail || "Erreur serveur");
      }

      const reference = result.id || "n/a";
      const emailStatus = result.email_status ? ` Email: ${result.email_status}.` : "";
      const missing = Array.isArray(result.missing_questions) && result.missing_questions.length
        ? ` Infos utiles a completer: ${result.missing_questions.join(" | ")}`
        : "";

      setNotice({
        type: "success",
        text: `Demande recue. Reference: ${reference}.${emailStatus}${missing}`,
      });

      form.reset();
      setExtraServices([]);
    } catch (error) {
      setNotice({ type: "error", text: `Erreur d envoi: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="layout">
      <header className="site-header glass">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <strong>{content.nav}</strong>
            <small>Service professionnel</small>
          </div>
        </div>
        <a className="btn btn-light" href="/">Accueil</a>
      </header>

      <div className="mode-tabs">
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service.id}
            className={`mode-tab ${service.id === mode ? "active" : ""}`}
            type="button"
            onClick={() => switchMode(service.id)}
          >
            {service.short}
          </button>
        ))}
      </div>

      <section className="service-hero panel-glow">
        <div className="service-visual">
          {mode === MODE_B ? (
            <div className="mockup-hero-panel">
              <div className="mockup-banner" />
              <div className="mockup-cards">
                <div />
                <div />
                <div />
              </div>
              <div className="mockup-footer" />
            </div>
          ) : (
            <div className="hero-badge">{mode}</div>
          )}
        </div>

        <div className="service-copy">
          <span className="tag">Service portfolio</span>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
          <div className="price-line strong">
            {mode === MODE_B ? "A partir de " : ""}
            {formatCfa(PRICES[mode])} CFA (~${formatUsd(PRICES[mode])})
          </div>

          {(mode === MODE_A || mode === MODE_B) && (
            <div className="hosting-lines">
              <div>Hebergement: {formatCfa(PRICES.HOST_MONTH)} CFA (~$${formatUsd(PRICES.HOST_MONTH)}) / mois</div>
              <div>Hebergement annuel: {formatCfa(PRICES.HOST_YEAR)} CFA (~$${formatUsd(PRICES.HOST_YEAR)})</div>
            </div>
          )}

          {(mode === MODE_CV || mode === MODE_LM) && (
            <div className="hosting-lines muted">Sans hebergement.</div>
          )}

          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>
              {content.cta}
            </button>
            <button className="btn btn-light" type="button" onClick={() => examplesRef.current?.scrollIntoView({ behavior: "smooth" })}>
              Voir des exemples
            </button>
          </div>
        </div>
      </section>

      <section className="panel two-col section-spacing">
        <div>
          <h2>Ce que vous obtenez</h2>
          <ul className="list-clean">
            {content.points.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h2>Comment ca se passe</h2>
          <ul className="list-clean">
            {content.steps.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="panel section-spacing" ref={examplesRef}>
        <div className="section-head compact">
          <h2>Exemples de reference</h2>
          <p>Vous pouvez donner vos references dans le formulaire.</p>
        </div>
        <div className="example-row">
          <a className="pill-link" href="https://www.pieagency.fr/" target="_blank" rel="noreferrer">pieagency.fr</a>
          <a className="pill-link" href="https://innovaplus.africa/" target="_blank" rel="noreferrer">innovaplus.africa</a>
          <a className="pill-link" href="https://lamadokouyayra.vercel.app/" target="_blank" rel="noreferrer">lamadokouyayra.vercel.app</a>
        </div>
      </section>

      <section className="panel section-spacing" ref={formRef}>
        <div className="section-head compact">
          <h2>Formulaire complet</h2>
          <p>Le brief detaille permet une execution plus rapide et plus precise.</p>
        </div>

        <form onSubmit={onLeadSubmit}>
          <FormSection title="Panier services" hint="Ajoutez des services complementaires dans la meme demande.">
            <div className="span-full service-options">
              {SERVICE_OPTIONS.filter((service) => service.id !== mode).map((service) => (
                <label className="option-card" key={service.id}>
                  <input
                    type="checkbox"
                    checked={extraServices.includes(service.id)}
                    onChange={() => toggleExtra(service.id)}
                    value={service.id}
                  />
                  <div>
                    <strong>{service.label}</strong>
                    <span>{service.from ? "A partir de " : ""}{formatCfa(service.price)} CFA (~$${formatUsd(service.price)})</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="span-full total-line">{totalLabel}</div>
          </FormSection>

          {mode === MODE_A && (
            <>
              <FormSection title="Identite et cible" hint="Informations indispensables pour positionner votre profil.">
                <input className="input" name="full_name" placeholder="Nom complet" required />
                <input className="input" name="email" placeholder="Email" required />
                <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
                <input className="input" name="country" placeholder="Pays" required />
                <input className="input" name="city" placeholder="Ville" required />
                <input className="input" name="target_role" placeholder="Poste cible" required />
                <input className="input" name="target_country" placeholder="Pays cible" required />
                <input className="input" name="experience_level" placeholder="Niveau d experience" required />
                <input className="input" name="objective" placeholder="Objectif (emploi/stage/alternance)" required />
                <input className="input" name="availability" placeholder="Disponibilite" required />
              </FormSection>

              <FormSection title="Contenu professionnel" hint="Plus vous etes precis, plus la livraison est rapide.">
                <textarea name="bio" placeholder="Mini bio professionnelle" required />
                <textarea name="skills" placeholder="Competences cles" required />
                <textarea name="tools" placeholder="Outils / logiciels" required />
                <textarea name="projects" placeholder="2 a 5 projets avec liens et resultats" required />
                <textarea name="achievements" placeholder="Realisations quantifiees" required />
                <textarea name="education" placeholder="Formation" required />
                <textarea name="certifications" placeholder="Certifications" />
                <textarea name="assets_links" placeholder="Liens CV, LinkedIn, GitHub, Drive" required />
              </FormSection>

              <FormSection title="Livraison portfolio">
                <select className="input" name="hosting_option" required>
                  <option value="">Hebergement</option>
                  <option value="none">Aucun</option>
                  <option value="monthly">Mensuel</option>
                  <option value="yearly">Annuel</option>
                </select>
                <input className="input" name="deadline" placeholder="Delai souhaite" required />
                <input className="input" name="budget" placeholder="Budget disponible" />
              </FormSection>
            </>
          )}

          {mode === MODE_B && (
            <>
              <FormSection title="Entreprise" hint="Base legale et commerciale du projet.">
                <input className="input" name="company_name" placeholder="Nom entreprise" required />
                <input className="input" name="sector" placeholder="Activite / secteur" required />
                <input className="input" name="email" placeholder="Email pro" required />
                <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
                <input className="input" name="country" placeholder="Pays" required />
                <input className="input" name="city" placeholder="Ville" required />
                <input className="input" name="year_founded" placeholder="Annee de creation" required />
                <input className="input" name="team_size" placeholder="Taille equipe" required />
              </FormSection>

              <FormSection title="Offre et conversion" hint="Section critique pour la performance commerciale du site.">
                <textarea name="services" placeholder="Services / produits (3 a 7 items)" required />
                <textarea name="target_clients" placeholder="Clients cibles" required />
                <textarea name="goals" placeholder="Objectif principal du site" required />
                <textarea name="value_prop" placeholder="Proposition de valeur" required />
                <textarea name="pages" placeholder="Pages souhaitees" required />
                <textarea name="funnel_goal" placeholder="Action attendue (WhatsApp, appel, devis)" required />
                <textarea name="zone_service" placeholder="Zone de service" required />
                <textarea name="pricing_logic" placeholder="Prix / forfaits" required />
              </FormSection>

              <FormSection title="Preuves et branding" hint="Materiaux de credibilite et d identite.">
                <textarea name="proofs" placeholder="Realisations / references" required />
                <textarea name="references" placeholder="Sites de reference (liens)" required />
                <textarea name="branding" placeholder="Logo / charte / ton de marque" required />
                <textarea name="assets_links" placeholder="Liens medias, photos, dossiers" required />
                <textarea name="social_links" placeholder="Reseaux sociaux" required />
                <textarea name="competitors" placeholder="Concurrents de reference" required />
              </FormSection>

              <FormSection title="Livraison vitrine">
                <select className="input" name="hosting_option" required>
                  <option value="">Hebergement</option>
                  <option value="none">Aucun</option>
                  <option value="monthly">Mensuel</option>
                  <option value="yearly">Annuel</option>
                </select>
                <input className="input" name="budget" placeholder="Budget estime" required />
                <input className="input" name="deadline" placeholder="Delai souhaite" required />
                <input className="input" name="maintenance_option" placeholder="Maintenance apres livraison" required />
              </FormSection>
            </>
          )}

          {mode === MODE_CV && (
            <>
              <FormSection title="Identite" hint="Contexte de candidature pour un CV cible.">
                <input className="input" name="full_name" placeholder="Nom complet" required />
                <input className="input" name="email" placeholder="Email" required />
                <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
                <input className="input" name="country" placeholder="Pays" required />
                <input className="input" name="city" placeholder="Ville" required />
                <input className="input" name="target_role" placeholder="Poste cible" required />
                <input className="input" name="target_country" placeholder="Pays cible" required />
                <input className="input" name="experience_years" placeholder="Annees experience" required />
              </FormSection>

              <FormSection title="Contenu CV" hint="Infos suffisantes pour livrer un CV final.">
                <textarea name="experience" placeholder="Experiences detaillees" required />
                <textarea name="achievements" placeholder="Realisations et chiffres" required />
                <textarea name="skills" placeholder="Competences techniques et metier" required />
                <textarea name="tools" placeholder="Outils / logiciels" required />
                <textarea name="education" placeholder="Formation" required />
                <textarea name="certifications" placeholder="Certifications" />
                <textarea name="languages" placeholder="Langues et niveaux" required />
                <textarea name="assets_links" placeholder="Liens documents source" required />
              </FormSection>

              <FormSection title="Livraison CV">
                <input className="input" name="deadline" placeholder="Delai souhaite" required />
                <input className="input" name="cv_language" placeholder="Langue du CV" required />
                <input className="input" name="cv_format" placeholder="Format final (PDF, DOCX)" required />
              </FormSection>
            </>
          )}

          {mode === MODE_LM && (
            <>
              <FormSection title="Identite et cible" hint="Pour emploi, universite et bourse.">
                <input className="input" name="full_name" placeholder="Nom complet" required />
                <input className="input" name="email" placeholder="Email" required />
                <input className="input" name="phone" placeholder="WhatsApp / Telephone" required />
                <input className="input" name="country" placeholder="Pays" required />
                <input className="input" name="city" placeholder="Ville" required />
                <input className="input" name="target_role" placeholder="Poste / programme cible" required />
                <input className="input" name="company_name" placeholder="Entreprise / universite / organisme" required />
                <input className="input" name="application_type" placeholder="Type candidature" required />
              </FormSection>

              <FormSection title="Contenu lettre de motivation" hint="Elements necessaires pour une lettre solide.">
                <textarea name="job_link" placeholder="Lien offre / descriptif" required />
                <textarea name="motivation" placeholder="Motivation principale" required />
                <textarea name="experience" placeholder="Experience pertinente" required />
                <textarea name="achievements" placeholder="Realisations utiles" required />
                <textarea name="values" placeholder="Valeurs / points personnels" required />
                <textarea name="keywords" placeholder="Mots cles a integrer" required />
              </FormSection>

              <FormSection title="Livraison lettre de motivation">
                <input className="input" name="deadline" placeholder="Delai souhaite" required />
                <input className="input" name="letter_language" placeholder="Langue de la lettre" required />
                <input className="input" name="tone" placeholder="Ton souhaite" required />
              </FormSection>
            </>
          )}

          <div className="consent-line">
            <label>
              <input type="checkbox" name="consent" required /> J accepte d etre recontacte pour cette demande
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Envoi..." : "Envoyer ma demande"}
            </button>
            <a className="btn btn-light" href="https://wa.me/22892092572" target="_blank" rel="noreferrer">
              WhatsApp direct
            </a>
          </div>

          {notice.text ? <div className={`notice ${notice.type || "info"}`}>{notice.text}</div> : null}
        </form>
      </section>

      <button className="assistant-fab" type="button" onClick={() => setAssistantOpen((value) => !value)}>
        ?
      </button>

      {assistantOpen && (
        <aside className="assistant-panel">
          <div className="assistant-head">
            <strong>Assistant</strong>
            <button type="button" className="btn btn-light" onClick={() => setAssistantOpen(false)}>Fermer</button>
          </div>

          <div className="assistant-quick">
            {QUICK_QUESTIONS.map((question) => (
              <button key={question} type="button" className="pill-link" onClick={() => sendMessage(question)}>
                {question}
              </button>
            ))}
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`assistant-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="assistant-form" onSubmit={onAssistantSubmit}>
            <input
              className="input"
              value={assistantText}
              onChange={(event) => setAssistantText(event.target.value)}
              placeholder="Posez votre question"
            />
            <button className="btn btn-primary" type="submit" disabled={assistantLoading}>
              {assistantLoading ? "..." : "Envoyer"}
            </button>
          </form>
        </aside>
      )}

      <footer className="footer-note">2026 Mon Portfolio Studio. Contact: senirolamadokou@gmail.com</footer>
    </main>
  );
}
