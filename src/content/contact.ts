/**
 * Copy for the Contact page.
 *
 * The six audiences come from the client's Copy Deck. Naming them is the
 * point of the page: a visitor should recognise themselves in one line and
 * know the message will reach the right person.
 *
 * ⚠️ No address is published until the client supplies a real one — see
 * `contactEmail` in src/config/site.ts for why.
 */

import type { Lang } from "../i18n/config";

type ContactContent = {
  intro: string;
  audiences: { title: string; body: string }[];
  closing: string;
};

export const contact: Record<Lang, ContactContent> = {
  en: {
    intro:
      "Whether you play, coach, teach, sponsor or organize, there is a way into GAG.",
    audiences: [
      { title: "Player", body: "Looking for your next competition?" },
      { title: "University", body: "Interested in working with GAG?" },
      { title: "Coach", body: "Interested in player development?" },
      { title: "Sponsor", body: "Interested in supporting young golf?" },
      {
        title: "Golf Organization",
        body: "Interested in competition or international cooperation?",
      },
      { title: "Partner", body: "Interested in joining the GAG community?" },
    ],
    closing: "Let's talk.",
  },

  fr: {
    intro:
      "Que vous jouiez, entraîniez, enseigniez, commanditiez ou organisiez, il y a une porte d'entrée chez GAG.",
    audiences: [
      { title: "Joueur", body: "À la recherche de votre prochaine compétition ?" },
      { title: "Université", body: "Envie de collaborer avec GAG ?" },
      { title: "Entraîneur", body: "Intéressé par le développement des joueurs ?" },
      { title: "Commanditaire", body: "Envie de soutenir le golf de la relève ?" },
      {
        title: "Organisation de golf",
        body: "Intéressé par la compétition ou la coopération internationale ?",
      },
      { title: "Partenaire", body: "Envie de rejoindre la communauté GAG ?" },
    ],
    closing: "Parlons-nous.",
  },
};
