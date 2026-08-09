/**
 * Copy for the Brand page, covering the parent brand and its flagship amateur
 * golf series.
 *
 * The series name, slogan, tagline and farewell stay in English in both
 * locales. They are the brand's own marks, listed as such in the client's
 * material — translating them would create a second, competing set of names.
 *
 * ⚠️ The French prose is a working translation using Canadian conventions.
 * Have it reviewed by a francophone before the site is promoted in French.
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

  fr: {
    story: [
      "Le nom Great Lakes Sports s'inspire des Grands Lacs de l'Amérique du Nord.",
      "Parmi les plus vastes réseaux d'eau douce au monde, les Grands Lacs symbolisent l'ouverture, la vitalité et le lien. Ils servent depuis longtemps de portes d'entrée reliant les communautés, les économies et les cultures du Canada et des États-Unis.",
      "Inspirée par cet esprit, Great Lakes Sports a été créée avec une vision mondiale : rapprocher les gens par le sport et bâtir des relations durables qui dépassent largement la compétition.",
      "Notre objectif à long terme est de développer des événements sportifs respectés à l'échelle internationale et de créer des plateformes où athlètes, organisations, partenaires et communautés peuvent grandir ensemble.",
    ],

    motto: "Des Grands Lacs aux cinq continents.",

    gag: {
      fullName: "Great Lakes Amateur Golf",
      slogan: "GAG³ — BE PRO!",
      tagline: "Let's Play GAG.",
      farewell: "See You at GAG.",
    },
  },
};
