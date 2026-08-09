/**
 * Copy for the home page.
 *
 * ⚠️ The partnership paragraph is draft copy written to give the section
 * something coherent to say. It deliberately avoids naming sponsorship tiers
 * or figures. Have the client replace or approve it before publication.
 */

import type { Lang } from "../i18n/config";

type HomeContent = {
  /** Vision statement, set as the page's h1. */
  tagline: string;
  intro: string;
  partnership: string;
};

export const home: Record<Lang, HomeContent> = {
  en: {
    tagline: "Connecting the Great Lakes to the World",
    intro:
      "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario. Founded with a long-term vision, the company is committed to developing world-class sporting events, building international partnerships, and creating sustainable platforms that connect athletes, organizations, businesses, and communities through sport.",
    partnership:
      "Great Lakes Sports Inc. works with partners who share a commitment to excellence in amateur sport. Sponsorship and corporate event opportunities are available throughout the tournament season.",
  },

  fr: {
    tagline: "Relier les Grands Lacs au monde",
    intro:
      "Great Lakes Sports Inc. est une organisation sportive canadienne dont le siège social est situé à Toronto, en Ontario. Fondée avec une vision à long terme, l'entreprise s'engage à développer des événements sportifs de calibre mondial, à établir des partenariats internationaux et à créer des plateformes durables qui unissent athlètes, organisations, entreprises et communautés par le sport.",
    partnership:
      "Great Lakes Sports Inc. collabore avec des partenaires qui partagent son engagement envers l'excellence dans le sport amateur. Des occasions de commandite et d'événements corporatifs sont offertes tout au long de la saison.",
  },
};
