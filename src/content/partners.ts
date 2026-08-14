/**
 * Copy for the Partners page.
 *
 * ⚠️ No sponsorship tiers, benefits or figures appear here. The client has
 * not supplied a rate card, and inventing one would commit them to numbers
 * they never agreed to. The page states what partnership is for and invites
 * a conversation.
 */

import type { Lang } from "../i18n/config";

type PartnersContent = {
  intro: string[];
  /** The kinds of organizations GAG works with. */
  welcomes: string[];
  /** Partnership categories named in the Copy Deck. */
  categories: string[];
  closing: string;
};

export const partners: Record<Lang, PartnersContent> = {
  en: {
    intro: [
      "GAG welcomes partnerships with universities, golf organizations, golf clubs, companies and brands, coaches, media organizations and international sports organizations.",
      "Our partners are not simply supporting a tournament. They are helping create opportunities for the next generation of golfers.",
    ],
    welcomes: [
      "Universities",
      "Golf organizations",
      "Golf clubs",
      "Companies and brands",
      "Coaches",
      "Media organizations",
      "International sports organizations",
    ],
    categories: [
      "Corporate Partners",
      "Title Sponsors",
      "University Partners",
      "Golf Partners",
      "International Partners",
    ],
    closing:
      "Partner logos, collaboration details and profiles will be published here as partnerships are confirmed.",
  },

  fr: {
    intro: [
      "GAG accueille les partenariats avec les universités, les organisations de golf, les clubs de golf, les entreprises et les marques, les entraîneurs, les médias et les organisations sportives internationales.",
      "Nos partenaires ne se contentent pas de soutenir un tournoi. Ils contribuent à créer des occasions pour la prochaine génération de golfeurs.",
    ],
    welcomes: [
      "Universités",
      "Organisations de golf",
      "Clubs de golf",
      "Entreprises et marques",
      "Entraîneurs",
      "Médias",
      "Organisations sportives internationales",
    ],
    categories: [
      "Partenaires corporatifs",
      "Commanditaires principaux",
      "Partenaires universitaires",
      "Partenaires golf",
      "Partenaires internationaux",
    ],
    closing:
      "Les logos, les ententes et les profils des partenaires seront publiés ici à mesure que les partenariats se confirmeront.",
  },
};
