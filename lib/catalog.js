export const RATE = 600;

export const HOSTING = {
  monthly: 2000,
  yearly: 24000,
};

export const WHATSAPP_NUMBER = "+22892092572";
export const WHATSAPP_LINK = "https://wa.me/22892092572";
export const CONTACT_EMAIL = "senirolamadokou@gmail.com";

export const SERVICE_CATEGORIES = [
  { id: "candidature", label: "Candidature" },
  { id: "web", label: "Web" },
  { id: "data", label: "Data" },
];

export const SERVICES = [
  {
    id: "portfolio",
    modeAliases: ["A"],
    category: "candidature",
    title: "Portfolio candidat",
    short: "Portfolio (A)",
    cardDescription:
      "Portfolio pro pour convaincre en 2 minutes : projets, preuves, contacts, WhatsApp.",
    heroTitle: "Portfolio candidat clair et credible",
    heroSubtitle:
      "Projets, preuves et positionnement pour accelerer votre candidature.",
    priceCfa: 29900,
    hasHosting: false,
  },
  {
    id: "vitrine",
    modeAliases: ["B"],
    category: "web",
    title: "Vitrine entreprise",
    short: "Vitrine (B)",
    cardDescription:
      "Site business oriente conversion : pages, preuves, CTA, contact.",
    heroTitle: "Vitrine entreprise a partir de 59 900 CFA",
    heroSubtitle:
      "Site vitrine structure pour obtenir des demandes qualifiees.",
    priceCfa: 59900,
    pricePrefix: "A partir de ",
    hasHosting: true,
  },
  {
    id: "cv",
    modeAliases: ["CV"],
    category: "candidature",
    title: "CV professionnel",
    short: "CV",
    cardDescription:
      "CV clair, cible et optimise : structure, mots-cles, version finale.",
    heroTitle: "CV professionnel",
    heroSubtitle:
      "CV optimise pour emploi, stage, alternance et mobilite internationale.",
    priceCfa: 9900,
    hasHosting: false,
  },
  {
    id: "lettre",
    modeAliases: ["LM"],
    category: "candidature",
    title: "Lettre de motivation",
    short: "Lettre",
    cardDescription:
      "Lettre adaptee au poste/programme : argumentaire, coherence, impact.",
    heroTitle: "Lettre de motivation",
    heroSubtitle:
      "Pour emploi, universite et bourse, avec un message solide et adapte.",
    priceCfa: 4900,
    hasHosting: false,
  },
  {
    id: "linkedin",
    modeAliases: [],
    category: "candidature",
    title: "Optimisation LinkedIn",
    short: "LinkedIn",
    cardDescription:
      "Profil LinkedIn optimise : titre, resume, experience + positionnement pro.",
    heroTitle: "Optimisation LinkedIn",
    heroSubtitle:
      "Profil optimise pour recruteurs, clients et opportunites business.",
    priceCfa: null,
    hasHosting: false,
  },
  {
    id: "audit",
    modeAliases: [],
    category: "candidature",
    title: "Audit CV / Lettre",
    short: "Audit",
    cardDescription:
      "Analyse complete + corrections : points faibles, reformulation, version amelioree.",
    heroTitle: "Audit CV / Lettre",
    heroSubtitle:
      "Diagnostic rapide avec corrections actionnables et priorisees.",
    priceCfa: null,
    hasHosting: false,
  },
  {
    id: "landing-page",
    modeAliases: [],
    category: "web",
    title: "Landing page 1 page",
    short: "Landing",
    cardDescription:
      "Page unique rapide : offre, preuves, CTA WhatsApp, formulaire, conversion.",
    heroTitle: "Landing page 1 page",
    heroSubtitle: "Offre claire + CTA pour transformer le trafic en prospects.",
    priceCfa: null,
    hasHosting: true,
  },
  {
    id: "google-business",
    modeAliases: [],
    category: "web",
    title: "Google Business Profile",
    short: "Google Business",
    cardDescription:
      "Creation/optimisation fiche Google Maps : infos, categories, visibilite locale.",
    heroTitle: "Google Business Profile",
    heroSubtitle:
      "Visibilite locale renforcee avec une fiche claire et bien optimisee.",
    priceCfa: null,
    hasHosting: false,
  },
  {
    id: "dashboard",
    modeAliases: [],
    category: "data",
    title: "Dashboard simple (ONG/PME)",
    short: "Dashboard",
    cardDescription:
      "Tableau de bord pour piloter : indicateurs, suivi, reporting clair.",
    heroTitle: "Dashboard simple ONG/PME",
    heroSubtitle:
      "Indicateurs utiles pour decider plus vite avec des donnees propres.",
    priceCfa: null,
    hasHosting: false,
  },
  {
    id: "formulaire-base",
    modeAliases: [],
    category: "data",
    title: "Formulaire + Base de donnees structuree",
    short: "Formulaire + Base",
    cardDescription:
      "Collecte + base propre : champs utiles, anti-doublons, organisation.",
    heroTitle: "Formulaire + Base de donnees structuree",
    heroSubtitle:
      "Collecte fiable et base exploitable pour vos operations quotidiennes.",
    priceCfa: null,
    hasHosting: false,
  },
];

export function formatCfa(value) {
  if (typeof value !== "number") {
    return "Sur devis";
  }
  return value.toLocaleString("fr-FR");
}

export function formatUsd(value) {
  if (typeof value !== "number") {
    return "-";
  }
  return (value / RATE).toFixed(2);
}

export function servicePriceLabel(service) {
  if (typeof service.priceCfa !== "number") {
    return "Sur devis";
  }
  const prefix = service.pricePrefix || "";
  return `${prefix}${formatCfa(service.priceCfa)} CFA (~$${formatUsd(service.priceCfa)})`;
}

export function getServiceById(serviceId) {
  return SERVICES.find((service) => service.id === serviceId);
}

export function getServiceByMode(mode) {
  const normalized = String(mode || "").toUpperCase();
  return SERVICES.find((service) => service.modeAliases.includes(normalized));
}
