/**
 * Copy for the Community page.
 *
 * The seven groups are taken from the client's Copy Deck. The order is
 * theirs and is meaningful — players first, sponsors and organizations last.
 */

import type { Lang } from "../i18n/config";

type CommunityContent = {
  intro: string;
  groups: { title: string; body: string }[];
};

export const community: Record<Lang, CommunityContent> = {
  en: {
    intro:
      "GAG is not only for players. It is a community built around the next generation of golf.",
    groups: [
      { title: "Players", body: "Young golfers pursuing their next level." },
      { title: "Coaches", body: "Professionals helping players develop their game." },
      {
        title: "Universities",
        body: "Institutions creating pathways for student-athletes.",
      },
      {
        title: "Golf Clubs",
        body: "Courses and facilities supporting great competition.",
      },
      { title: "Partners", body: "Organizations helping GAG grow." },
      { title: "Sponsors", body: "Companies investing in the future of golf." },
      {
        title: "Golf Organizations",
        body: "Organizations connecting GAG to the wider golf world.",
      },
    ],
  },

  fr: {
    intro:
      "GAG ne s'adresse pas qu'aux joueurs. C'est une communauté bâtie autour de la relève du golf.",
    groups: [
      { title: "Joueurs", body: "De jeunes golfeurs en route vers le niveau supérieur." },
      {
        title: "Entraîneurs",
        body: "Des professionnels qui aident les joueurs à développer leur jeu.",
      },
      {
        title: "Universités",
        body: "Des établissements qui ouvrent des voies aux étudiants-athlètes.",
      },
      {
        title: "Clubs de golf",
        body: "Des parcours et des installations au service d'une grande compétition.",
      },
      { title: "Partenaires", body: "Des organisations qui aident GAG à grandir." },
      {
        title: "Commanditaires",
        body: "Des entreprises qui investissent dans l'avenir du golf.",
      },
      {
        title: "Organisations de golf",
        body: "Des organisations qui relient GAG au monde du golf.",
      },
    ],
  },
};
