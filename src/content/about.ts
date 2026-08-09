/**
 * Copy for the About page.
 *
 * The English text was supplied by the client and is reproduced verbatim.
 *
 * ⚠️ The French is a working translation using Canadian conventions. Have it
 * reviewed by a francophone before the site is promoted in French — this is
 * the organization's own voice, not neutral prose.
 */

import type { Lang } from "../i18n/config";

type AboutContent = {
  intro: string[];
  vision: string;
  mission: string;
  coreValues: string[];
  closing: string;
  chairman: {
    name: string;
    organization: string;
    paragraphs: string[];
  };
};

export const about: Record<Lang, AboutContent> = {
  en: {
    intro: [
      "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario.",
      "Founded with a long-term vision, the company is committed to developing world-class sporting events, building international partnerships, and creating sustainable platforms that connect athletes, organizations, businesses, and communities through sport.",
      "Inspired by North America's Great Lakes, our name represents openness, diversity, and connection. Our mission extends beyond organizing competitions—we aim to create opportunities for international collaboration and promote excellence in amateur sports.",
    ],

    vision: "Connecting the Great Lakes to the World.",

    mission:
      "To build internationally recognized amateur sporting events and foster meaningful global partnerships through professionalism, integrity, and innovation.",

    /**
     * Supplied as names only. Presented as a set of five statements rather
     * than padded out with invented explanations; if one-line definitions are
     * provided later, they slot in here.
     */
    coreValues: [
      "Excellence",
      "Integrity",
      "Collaboration",
      "Innovation",
      "Long-term Commitment",
    ],

    closing:
      "Great Lakes Sports believes that sport has the power to inspire people, connect cultures, and create lasting value for society.",

    chairman: {
      name: "Wu Zeming",
      organization: "Great Lakes Sports Inc.",
      paragraphs: [
        "Welcome to Great Lakes Sports Inc.",
        "Sport is more than competition—it is a universal language that brings people together.",
        "Great Lakes Sports was founded with a simple but ambitious vision: to build meaningful international platforms where sport creates opportunities for excellence, friendship, and long-term collaboration.",
        "We believe that outstanding sporting events should not only showcase athletic performance but also connect talented individuals, respected organizations, forward-thinking businesses, and communities from around the world.",
        "As we continue to grow, we remain committed to professionalism, integrity, and long-term development.",
        "Thank you for visiting our website. We look forward to building the future of sport together.",
      ],
    },
  },

  fr: {
    intro: [
      "Great Lakes Sports Inc. est une organisation sportive canadienne dont le siège social est situé à Toronto, en Ontario.",
      "Fondée avec une vision à long terme, l'entreprise s'engage à développer des événements sportifs de calibre mondial, à établir des partenariats internationaux et à créer des plateformes durables qui unissent athlètes, organisations, entreprises et communautés par le sport.",
      "Inspiré des Grands Lacs de l'Amérique du Nord, notre nom évoque l'ouverture, la diversité et le lien. Notre mission va au-delà de l'organisation de compétitions : nous voulons créer des occasions de collaboration internationale et promouvoir l'excellence dans le sport amateur.",
    ],

    vision: "Relier les Grands Lacs au monde.",

    mission:
      "Créer des événements sportifs amateurs de renommée internationale et favoriser des partenariats mondiaux significatifs, dans un esprit de professionnalisme, d'intégrité et d'innovation.",

    coreValues: [
      "Excellence",
      "Intégrité",
      "Collaboration",
      "Innovation",
      "Engagement à long terme",
    ],

    closing:
      "Great Lakes Sports croit que le sport a le pouvoir d'inspirer les gens, de rapprocher les cultures et de créer une valeur durable pour la société.",

    chairman: {
      name: "Wu Zeming",
      organization: "Great Lakes Sports Inc.",
      paragraphs: [
        "Bienvenue chez Great Lakes Sports Inc.",
        "Le sport est plus qu'une compétition : c'est un langage universel qui rassemble les gens.",
        "Great Lakes Sports a été fondée sur une vision simple mais ambitieuse : bâtir des plateformes internationales significatives où le sport crée des occasions d'excellence, d'amitié et de collaboration à long terme.",
        "Nous croyons qu'un événement sportif remarquable ne doit pas seulement mettre en valeur la performance athlétique, mais aussi rassembler des personnes de talent, des organisations respectées, des entreprises visionnaires et des communautés du monde entier.",
        "À mesure que nous grandissons, nous demeurons attachés au professionnalisme, à l'intégrité et au développement à long terme.",
        "Merci de visiter notre site. Nous avons hâte de bâtir avec vous l'avenir du sport.",
      ],
    },
  },
};
