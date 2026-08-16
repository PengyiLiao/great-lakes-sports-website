/**
 * Copy for the University page.
 */

import type { Lang } from "../i18n/config";

type UniversityContent = {
  body: string[];
  /** What GAG offers universities, shown as a short list. */
  offers: { title: string; body: string }[];
};

export const university: Record<Lang, UniversityContent> = {
  en: {
    body: [
      "University golf is an important bridge between junior golf and the next level of competition.",
      "GAG aims to connect universities, teams, coaches and student-athletes through competition, exchange and player development.",
      "Through university tournaments, team events, scholarships and international opportunities, we want to create a stronger network for young golf players.",
    ],
    offers: [
      {
        title: "Competition",
        body: "University-focused events that bring student golf players and university teams onto the same stage.",
      },
      {
        title: "Exchange",
        body: "Connections between universities, coaches and players across Canada and beyond.",
      },
      {
        title: "Development",
        body: "A pathway that carries players from university golf toward elite amateur and professional competition.",
      },
    ],
  },

  fr: {
    body: [
      "Le golf universitaire est un pont important entre le golf junior et la compétition de haut niveau.",
      "GAG veut relier les universités, les équipes, les entraîneurs et les étudiants-athlètes par la compétition, les échanges et le développement des joueurs.",
      "Par les tournois universitaires, les épreuves par équipes, les bourses et les occasions internationales, nous voulons bâtir un réseau plus solide pour les jeunes joueurs de golf.",
    ],
    offers: [
      {
        title: "Compétition",
        body: "Des épreuves universitaires qui réunissent joueurs de golf étudiants et équipes universitaires sur une même scène.",
      },
      {
        title: "Échanges",
        body: "Des liens entre universités, entraîneurs et joueurs, au Canada et ailleurs.",
      },
      {
        title: "Développement",
        body: "Un parcours qui mène les joueurs du golf universitaire vers la compétition amateur d'élite et professionnelle.",
      },
    ],
  },
};
