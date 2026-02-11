import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  CONTACT_EMAIL,
  WHATSAPP_LINK,
  getServiceById,
  servicePriceLabel,
} from "../../lib/catalog";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-api-wov6.onrender.com";

const COMMON_SECTIONS = [
  {
    title: "Coordonnees",
    hint: "Ces informations nous permettent de vous recontacter rapidement.",
    fields: [
      { name: "full_name", label: "Nom et prenom", type: "text", required: true },
      { name: "phone", label: "WhatsApp / Telephone", type: "tel", required: true },
      { name: "email", label: "Email (optionnel)", type: "email", required: false },
      { name: "country", label: "Pays", type: "text", required: true },
      { name: "city", label: "Ville", type: "text", required: true },
    ],
  },
  {
    title: "Delai & budget",
    hint: "Si vous avez une urgence ou un budget cible, indiquez-le ici.",
    fields: [
      {
        name: "deadline",
        label: "Delai souhaite",
        type: "select",
        required: true,
        options: [
          { value: "24-72h", label: "24-72h" },
          { value: "3-7j", label: "3-7j" },
          { value: "autre", label: "Autre" },
        ],
      },
      { name: "budget_range", label: "Budget (plage) (optionnel)", type: "text", required: false },
    ],
  },
  {
    title: "Message & fichiers",
    hint: "Ajoutez tout detail utile. Vous pouvez aussi partager un lien Drive.",
    fields: [
      { name: "message", label: "Message complementaire", type: "textarea", required: false },
      { name: "files_common", label: "Fichiers (optionnel)", type: "file", required: false, multiple: true },
    ],
  },
];

const SERVICE_FORMS = {
  portfolio: [
    {
      title: "Cible et positionnement",
      hint: "Ces informations servent a construire le message central du portfolio.",
      fields: [
        {
          name: "objectif",
          label: "Objectif",
          type: "select",
          required: true,
          options: [
            { value: "emploi", label: "Emploi" },
            { value: "stage", label: "Stage" },
            { value: "alternance", label: "Alternance" },
            { value: "freelance", label: "Freelance" },
          ],
        },
        { name: "metier_vise", label: "Metier vise", type: "text", required: true },
        { name: "liens", label: "Liens a integrer (LinkedIn, GitHub, Behance, etc.)", type: "textarea", required: true },
        { name: "projets", label: "Projets (3 a 6) : titre + description + lien/preuve", type: "textarea", required: true },
        { name: "about", label: "Section a propos (5 a 10 lignes)", type: "textarea", required: true },
        { name: "contacts", label: "Contacts a afficher (email, WhatsApp)", type: "textarea", required: true },
        {
          name: "style",
          label: "Style souhaite",
          type: "select",
          required: true,
          options: [
            { value: "sobre", label: "Sobre" },
            { value: "moderne", label: "Moderne" },
            { value: "creatif", label: "Creatif" },
          ],
        },
        { name: "photo", label: "Photo (optionnel)", type: "file", required: false, multiple: false },
      ],
    },
  ],
  vitrine: [
    {
      title: "Entreprise",
      hint: "Base legale et commerciale du projet.",
      fields: [
        { name: "company_name", label: "Nom entreprise", type: "text", required: true },
        { name: "sector", label: "Activite / secteur", type: "text", required: true },
        { name: "offre_principale", label: "Offre principale (ce que vous vendez)", type: "textarea", required: true },
        {
          name: "objectif",
          label: "Objectif",
          type: "select",
          required: true,
          options: [
            { value: "whatsapp", label: "Leads WhatsApp" },
            { value: "appels", label: "Appels" },
            { value: "email", label: "Email" },
            { value: "vente", label: "Vente" },
          ],
        },
        { name: "pages_souhaitees", label: "Pages souhaitees", type: "textarea", required: true },
        { name: "preuves", label: "Preuves (temoignages, realisations, clients)", type: "textarea", required: false },
        { name: "logo_couleurs", label: "Logo + couleurs (optionnel)", type: "textarea", required: false },
        { name: "domaine", label: "Domaine (si deja)", type: "text", required: false },
        {
          name: "hebergement",
          label: "Hebergement",
          type: "select",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
      ],
    },
  ],
  cv: [
    {
      title: "CV professionnel",
      hint: "Informations necessaires pour livrer un CV cible et efficace.",
      fields: [
        { name: "poste_vise", label: "Poste vise", type: "text", required: true },
        {
          name: "niveau",
          label: "Niveau",
          type: "select",
          required: true,
          options: [
            { value: "debutant", label: "Debutant" },
            { value: "intermediaire", label: "Intermediaire" },
            { value: "senior", label: "Senior" },
          ],
        },
        { name: "pays_secteur", label: "Pays/secteur cible", type: "text", required: true },
        { name: "cv_actuel", label: "CV actuel (upload)", type: "file", required: true, multiple: false },
        { name: "points_corriger", label: "Points a corriger (optionnel)", type: "textarea", required: false },
        {
          name: "langue",
          label: "Langue",
          type: "select",
          required: true,
          options: [
            { value: "FR", label: "FR" },
            { value: "EN", label: "EN" },
            { value: "FR+EN", label: "FR + EN" },
          ],
        },
      ],
    },
  ],
  lettre: [
    {
      title: "Lettre de motivation",
      hint: "Informations necessaires pour une lettre ciblee.",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { value: "emploi", label: "Emploi" },
            { value: "universite", label: "Universite" },
            { value: "bourse", label: "Bourse" },
          ],
        },
        { name: "poste_formation", label: "Poste/formation cible", type: "text", required: true },
        { name: "organisation", label: "Organisation/ecole", type: "text", required: true },
        { name: "cv_actuel", label: "CV actuel (upload)", type: "file", required: true, multiple: false },
        {
          name: "points_cles",
          label: "Points cles a mettre en avant (3 a 6 bullets)",
          type: "textarea",
          required: true,
        },
        {
          name: "langue",
          label: "Langue",
          type: "select",
          required: true,
          options: [
            { value: "FR", label: "FR" },
            { value: "EN", label: "EN" },
          ],
        },
      ],
    },
  ],
  linkedin: [
    {
      title: "Optimisation LinkedIn",
      hint: "Informations pour optimiser votre profil et votre positionnement.",
      fields: [
        { name: "profil_linkedin", label: "Lien du profil LinkedIn", type: "url", required: true },
        { name: "metier_positionnement", label: "Metier / positionnement vise", type: "text", required: true },
        { name: "cibles", label: "Cibles (recruteurs / clients / ONG / etc.)", type: "textarea", required: true },
        { name: "competences", label: "5 competences a mettre en avant", type: "textarea", required: true },
        { name: "experiences", label: "Experiences cles (resume)", type: "textarea", required: true },
        {
          name: "langue",
          label: "Langue",
          type: "select",
          required: true,
          options: [
            { value: "FR", label: "FR" },
            { value: "EN", label: "EN" },
          ],
        },
        {
          name: "post_linkedin",
          label: "1 post LinkedIn pret a publier",
          type: "select",
          required: false,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
      ],
    },
  ],
  audit: [
    {
      title: "Audit CV / Lettre",
      hint: "Nous analysons et corrigeons vos documents.",
      fields: [
        {
          name: "type_audit",
          label: "Type audit",
          type: "select",
          required: true,
          options: [
            { value: "cv", label: "CV" },
            { value: "lettre", label: "Lettre" },
            { value: "les-deux", label: "Les deux" },
          ],
        },
        { name: "fichiers", label: "Fichiers (upload)", type: "file", required: true, multiple: true },
        { name: "poste_cible", label: "Poste/formation cible", type: "text", required: true },
        {
          name: "attentes",
          label: "Attentes (clarte / impact / coherence / mots-cles)",
          type: "textarea",
          required: true,
        },
        {
          name: "langue",
          label: "Langue",
          type: "select",
          required: false,
          options: [
            { value: "FR", label: "FR" },
            { value: "EN", label: "EN" },
          ],
        },
      ],
    },
  ],
  "landing-page": [
    {
      title: "Landing page 1 page",
      hint: "Offre, preuves et CTA pour convertir.",
      fields: [
        { name: "nom_activite", label: "Nom activite", type: "text", required: true },
        { name: "offre_principale", label: "Offre principale", type: "textarea", required: true },
        { name: "public_cible", label: "Public cible", type: "text", required: true },
        {
          name: "cta_principal",
          label: "CTA principal",
          type: "select",
          required: true,
          options: [
            { value: "whatsapp", label: "WhatsApp" },
            { value: "formulaire", label: "Formulaire" },
            { value: "appel", label: "Appel" },
          ],
        },
        { name: "texte_existant", label: "Texte existant (optionnel)", type: "textarea", required: false },
        { name: "preuves", label: "References/preuves (optionnel)", type: "textarea", required: false },
        { name: "logo_couleurs", label: "Logo + couleurs (optionnel)", type: "textarea", required: false },
        {
          name: "domaine_hebergement",
          label: "Domaine/hebergement (oui/non)",
          type: "select",
          required: false,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
      ],
    },
  ],
  "google-business": [
    {
      title: "Google Business Profile",
      hint: "Ameliorez votre visibilite locale.",
      fields: [
        { name: "nom_etablissement", label: "Nom de l etablissement", type: "text", required: true },
        { name: "adresse_zone", label: "Adresse / zone", type: "text", required: true },
        { name: "telephone", label: "Telephone", type: "tel", required: true },
        { name: "categorie", label: "Categorie principale", type: "text", required: true },
        { name: "horaires", label: "Horaires", type: "textarea", required: true },
        { name: "description_courte", label: "Description courte", type: "textarea", required: true },
        { name: "lien_site", label: "Lien site (optionnel)", type: "url", required: false },
        { name: "photos", label: "Photos disponibles (upload) (optionnel)", type: "file", required: false, multiple: true },
        {
          name: "acces_fiche",
          label: "Acces a la fiche (deja existante ? oui/non)",
          type: "select",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
      ],
    },
  ],
  dashboard: [
    {
      title: "Dashboard simple ONG/PME",
      hint: "Un tableau de bord clair pour piloter vos activites.",
      fields: [
        {
          name: "type_organisation",
          label: "Type organisation",
          type: "select",
          required: true,
          options: [
            { value: "ong", label: "ONG" },
            { value: "pme", label: "PME" },
            { value: "projet", label: "Projet" },
          ],
        },
        { name: "objectif_dashboard", label: "Objectif du dashboard", type: "textarea", required: true },
        {
          name: "source_donnees",
          label: "Source des donnees",
          type: "select",
          required: true,
          options: [
            { value: "excel", label: "Excel" },
            { value: "google-sheet", label: "Google Sheet" },
            { value: "csv", label: "CSV" },
            { value: "autre", label: "Autre" },
          ],
        },
        { name: "fichier", label: "Fichier (upload) (optionnel)", type: "file", required: false, multiple: true },
        { name: "lien_fichier", label: "Lien (si pas upload)", type: "url", required: true },
        { name: "indicateurs", label: "Indicateurs souhaites (liste)", type: "textarea", required: true },
        {
          name: "frequence",
          label: "Frequence mise a jour",
          type: "select",
          required: true,
          options: [
            { value: "hebdo", label: "Hebdo" },
            { value: "mensuel", label: "Mensuel" },
            { value: "manuel", label: "Manuel" },
          ],
        },
      ],
    },
  ],
  "formulaire-base": [
    {
      title: "Formulaire + Base de donnees structuree",
      hint: "Collecte fiable et base propre pour vos operations.",
      fields: [
        {
          name: "type_base",
          label: "Type de base",
          type: "select",
          required: true,
          options: [
            { value: "membres", label: "Membres" },
            { value: "beneficiaires", label: "Beneficiaires" },
            { value: "clients", label: "Clients" },
            { value: "projets", label: "Projets" },
          ],
        },
        { name: "champs_indispensables", label: "Champs indispensables (liste)", type: "textarea", required: true },
        { name: "volume", label: "Volume estime (approx)", type: "text", required: true },
        {
          name: "canal_collecte",
          label: "Canal de collecte",
          type: "select",
          required: true,
          options: [
            { value: "google-form", label: "Google Form" },
            { value: "whatsapp", label: "WhatsApp" },
            { value: "appel", label: "Appel" },
            { value: "terrain", label: "Terrain" },
          ],
        },
        {
          name: "anti_doublons",
          label: "Besoin anti-doublons",
          type: "select",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
        {
          name: "export_excel",
          label: "Besoin export (Excel)",
          type: "select",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
        {
          name: "multi_users",
          label: "Besoin acces multi-utilisateurs",
          type: "select",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
      ],
    },
  ],
};

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

function renderField(field) {
  const id = `field_${field.name}`;
  if (field.type === "textarea") {
    return (
      <div key={field.name} className={field.full ? "span-full" : undefined}>
        <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div key={field.name} className={field.full ? "span-full" : undefined}>
        <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
        <select id={id} name={field.name} className="input" required={field.required}>
          <option value="">Selectionner</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div key={field.name} className={field.full ? "span-full" : undefined}>
        <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
        <input
          id={id}
          className="input"
          name={field.name}
          type="file"
          required={field.required}
          multiple={field.multiple}
        />
      </div>
    );
  }

  return (
    <div key={field.name} className={field.full ? "span-full" : undefined}>
      <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
      <input
        id={id}
        className="input"
        name={field.name}
        type={field.type || "text"}
        required={field.required}
        placeholder={field.placeholder}
      />
    </div>
  );
}

function formDataToPayload(form) {
  const data = {};
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!value.name) {
        continue;
      }
      const meta = { name: value.name, size: value.size, type: value.type };
      if (data[key]) {
        data[key] = Array.isArray(data[key]) ? [...data[key], meta] : [data[key], meta];
      } else {
        data[key] = meta;
      }
    } else {
      if (data[key]) {
        data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      } else {
        data[key] = value;
      }
    }
  }
  return data;
}

export default function OrderServicePage() {
  const router = useRouter();
  const serviceId = Array.isArray(router.query.service) ? router.query.service[0] : router.query.service;
  const service = useMemo(() => getServiceById(serviceId), [serviceId]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  if (!service && serviceId) {
    return (
      <main className="layout">
        <header className="site-header glass">
          <div className="brand">
            <span className="brand-dot" />
            <div>
              <strong>Service introuvable</strong>
              <small>Veuillez choisir un service valide</small>
            </div>
          </div>
          <a className="btn btn-light" href="/services">Voir les services</a>
        </header>

        <section className="panel section-spacing">
          <p>Ce service n existe pas. Revenez au catalogue pour choisir un service valide.</p>
          <a className="btn btn-primary" href="/services">Retour aux services</a>
        </section>
      </main>
    );
  }

  const serviceSections = service ? SERVICE_FORMS[service.id] || [] : [];

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!service) {
      return;
    }

    const form = event.currentTarget;
    const data = formDataToPayload(form);

    setSubmitting(true);
    setNotice({ type: "info", text: "Envoi en cours..." });

    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: service.id,
          data,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.detail || "Erreur serveur");
      }

      const reference = result.id || "n/a";
      setNotice({ type: "success", text: `Demande recue. Reference: ${reference}.` });
      form.reset();
    } catch (error) {
      setNotice({ type: "error", text: `Erreur d envoi: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = service
    ? `Bonjour, je viens de soumettre le formulaire ${service.title}.`
    : "Bonjour, je viens de soumettre un formulaire.";

  return (
    <main className="layout">
      <header className="site-header glass">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <strong>{service ? service.title : "Service"}</strong>
            <small>Formulaire dedie</small>
          </div>
        </div>
        <div className="header-actions">
          <a className="btn btn-light" href="/services">Tous les services</a>
          <a className="btn btn-light" href={`mailto:${CONTACT_EMAIL}`}>Email</a>
          <a className="btn btn-primary" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </header>

      {service && (
        <section className="service-hero panel-glow">
          <div className="service-visual">
            <div className="hero-badge">{service.short}</div>
          </div>
          <div className="service-copy">
            <span className="tag">Service</span>
            <h1>{service.title}</h1>
            <p>{service.cardDescription}</p>
            <div className="price-line strong">{servicePriceLabel(service)}</div>
            <div className="actions">
              <a className="btn btn-light" href="/services">Voir tous les services</a>
            </div>
          </div>
        </section>
      )}

      <section className="panel section-spacing">
        <div className="section-head compact">
          <h2>Formulaire</h2>
          <p>Merci de remplir les champs obligatoires pour accelerer la livraison.</p>
        </div>

        <form onSubmit={onSubmit}>
          {COMMON_SECTIONS.map((section) => (
            <FormSection key={section.title} title={section.title} hint={section.hint}>
              {section.fields.map((field) => renderField(field))}
            </FormSection>
          ))}

          {serviceSections.map((section) => (
            <FormSection key={section.title} title={section.title} hint={section.hint}>
              {section.fields.map((field) => renderField(field))}
            </FormSection>
          ))}

          <div className="consent-line">
            <label>
              <input type="checkbox" name="consent" required /> J accepte d etre recontacte pour cette demande
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Envoi..." : "Envoyer ma demande"}
            </button>
            <a
              className="btn btn-light"
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp direct
            </a>
          </div>

          {notice.text ? <div className={`notice ${notice.type || "info"}`}>{notice.text}</div> : null}
          {notice.type === "success" ? (
            <div className="actions">
              <a
                className="btn btn-primary"
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
              >
                Confirmer sur WhatsApp
              </a>
            </div>
          ) : null}
        </form>
      </section>

      <footer className="footer-note">2026 Mon Portfolio Studio. Contact: {CONTACT_EMAIL}</footer>
    </main>
  );
}
