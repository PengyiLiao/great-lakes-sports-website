/**
 * Copy for the Brand page, covering the parent brand and its flagship amateur
 * golf series.
 *
 * The GAG slogan, tagline and farewell are left in English in both locales.
 * They are the brand's own marks, listed as such in the client's material —
 * translating them would create a second, competing set of slogans.
 *
 * ⚠️ The Chinese rendering of "Great Lakes Amateur Golf" below is a working
 * translation. Confirm the official Chinese name of the series with the
 * client before publication.
 */

import type { Lang } from "../i18n/config";

type BrandContent = {
  story: string[];
  motto: string;
  gag: {
    fullName: string;
    slogan: string;
    tagline: string;
    farewell: string;
  };
};

export const brand: Record<Lang, BrandContent> = {
  en: {
    story: [
      "The name Great Lakes Sports was inspired by the Great Lakes of North America.",
      "As one of the world's largest freshwater systems, the Great Lakes symbolize openness, vitality, and connection. They have long served as gateways linking communities, economies, and cultures across Canada and the United States.",
      "Inspired by this spirit, Great Lakes Sports was established with a global vision—to connect people through sport and to build meaningful relationships that extend far beyond competition.",
      "Our long-term goal is to develop internationally respected sporting events and create platforms where athletes, organizations, partners, and communities can grow together.",
    ],

    motto: "From the Great Lakes to the Five Continents.",

    gag: {
      fullName: "Great Lakes Amateur Golf",
      slogan: "GAG³ — BE PRO!",
      tagline: "Let's Play GAG.",
      farewell: "See You at GAG.",
    },
  },

  zh: {
    story: [
      "Great Lakes Sports 这个名字，源自北美的五大湖。",
      "作为世界上最大的淡水湖群之一，五大湖象征着开放、活力与连接。长久以来，它们如同门户，连接着加拿大与美国的社区、经济与文化。",
      "受这一精神启发，Great Lakes Sports 以全球视野创立——通过体育连接人与人，建立超越竞技本身的深厚关系。",
      "我们的长期目标，是打造受国际尊重的体育赛事，并搭建让运动员、机构、伙伴与社区共同成长的平台。",
    ],

    motto: "从五大湖，走向五大洲。",

    gag: {
      fullName: "五大湖业余高尔夫",
      slogan: "GAG³ — BE PRO!",
      tagline: "Let's Play GAG.",
      farewell: "See You at GAG.",
    },
  },
};
