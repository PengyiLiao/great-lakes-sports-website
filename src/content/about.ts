/**
 * Copy for the About page.
 *
 * The English text was supplied by the client and is reproduced verbatim.
 * The Chinese is a working translation and should be reviewed by the client,
 * who is a native speaker and owns the brand's voice.
 *
 * The chairman's name appears as the Latin romanisation in English and in
 * Chinese characters on the Chinese site; both were confirmed by the client
 * rather than transliterated, since printing the wrong characters for a real
 * person on his own company's website is not a recoverable mistake.
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

  zh: {
    intro: [
      "Great Lakes Sports Inc. 是一家总部位于加拿大安大略省多伦多的体育机构。",
      "公司秉持长远愿景创立，致力于打造世界一流的体育赛事，建立国际合作伙伴关系，并搭建可持续的平台，通过体育将运动员、机构、企业与社区连接在一起。",
      "我们的名字取自北美五大湖，寓意开放、多元与连接。我们的使命不止于举办比赛——我们希望创造国际合作的机会，推动业余体育走向卓越。",
    ],

    vision: "连接五大湖，通向全世界。",

    mission:
      "以专业、诚信与创新，打造具有国际影响力的业余体育赛事，并建立有意义的全球合作关系。",

    coreValues: ["卓越", "诚信", "协作", "创新", "长期承诺"],

    closing:
      "Great Lakes Sports 相信，体育拥有激励人心、连接文化、为社会创造长远价值的力量。",

    chairman: {
      name: "吴泽明",
      organization: "Great Lakes Sports Inc.",
      paragraphs: [
        "欢迎来到 Great Lakes Sports Inc.。",
        "体育不只是竞技——它是一门让人们走到一起的通用语言。",
        "Great Lakes Sports 创立于一个朴素而远大的愿景：搭建有意义的国际平台，让体育创造追求卓越、结交挚友与长期合作的机会。",
        "我们相信，出色的体育赛事不仅应当展现竞技水平，更应当连接优秀的个人、受人尊敬的机构、富有远见的企业，以及来自世界各地的社区。",
        "在持续成长的过程中，我们始终坚守专业、诚信与长期发展。",
        "感谢您访问我们的网站。期待与您共同建设体育的未来。",
      ],
    },
  },
};
