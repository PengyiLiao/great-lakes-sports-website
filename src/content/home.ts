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

  zh: {
    tagline: "连接五大湖，通向全世界",
    intro:
      "Great Lakes Sports Inc. 是一家总部位于加拿大安大略省多伦多的体育机构。公司秉持长远愿景创立，致力于打造世界一流的体育赛事，建立国际合作伙伴关系，并搭建可持续的平台，通过体育将运动员、机构、企业与社区连接在一起。",
    partnership:
      "Great Lakes Sports Inc. 欢迎与认同业余体育卓越理念的伙伴携手。赛季期间提供赞助合作与企业赛事等多种合作机会。",
  },
};
