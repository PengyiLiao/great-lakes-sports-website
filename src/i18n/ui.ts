/**
 * Interface strings — navigation, section headings, buttons, and the standing
 * copy that frames the client's content.
 *
 * Long-form copy lives in src/content/. This file holds only the chrome, so
 * that adding a language means translating a short, bounded list rather than
 * hunting through templates.
 *
 * ⚠️ The French strings are a working translation, using Canadian conventions.
 * Have them reviewed by a francophone before the site is promoted in French.
 */

import type { Lang } from "./config";

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.brand": "Brand",

    "page.home": "Home",
    "page.about": "About Us",
    "page.brand": "Our Brand",

    "meta.description":
      "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario, developing world-class amateur sporting events and international partnerships.",

    "home.flagship": "Our Flagship Series",
    "home.upcoming": "Upcoming",
    "home.upcoming.empty":
      "The schedule for the coming season will be announced shortly.",
    "home.partnership": "Partnership",

    "about.vision": "Our Vision",
    "about.mission": "Our Mission",
    "about.values": "Our Core Values",
    "about.chairman": "Chairman's Message",
    "about.chairmanTitle": "Chairman",

    "brand.story": "Brand Story",
    "brand.motto": "Our Motto",
    "brand.applications": "Brand Applications",
    "brand.applicationsNote":
      "Concept visuals for tournament trophies, player gifts and event merchandise, developed alongside the identity.",

    "cta.about": "About Us",
    "cta.brand": "Explore the Brand",
    "cta.enquire": "Enquire",
    "cta.enquirePending": "Enquiry details to follow",

    "a11y.skip": "Skip to content",
    "a11y.mainNav": "Main navigation",
    "a11y.footerNav": "Footer navigation",
    "a11y.language": "Language",
  },

  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.brand": "Marque",

    "page.home": "Accueil",
    "page.about": "À propos",
    "page.brand": "Notre marque",

    "meta.description":
      "Great Lakes Sports Inc. est une organisation sportive canadienne établie à Toronto, en Ontario, qui développe des événements sportifs amateurs de calibre mondial et des partenariats internationaux.",

    "home.flagship": "Notre série phare",
    "home.upcoming": "À venir",
    "home.upcoming.empty":
      "Le calendrier de la prochaine saison sera annoncé sous peu.",
    "home.partnership": "Partenariats",

    "about.vision": "Notre vision",
    "about.mission": "Notre mission",
    "about.values": "Nos valeurs fondamentales",
    "about.chairman": "Message du président",
    "about.chairmanTitle": "Président",

    "brand.story": "Histoire de la marque",
    "brand.motto": "Notre devise",
    "brand.applications": "Applications de la marque",
    "brand.applicationsNote":
      "Visuels conceptuels des trophées, des cadeaux aux joueurs et des articles promotionnels, conçus parallèlement à l'identité visuelle.",

    "cta.about": "À propos de nous",
    "cta.brand": "Découvrir la marque",
    "cta.enquire": "Nous joindre",
    "cta.enquirePending": "Coordonnées à venir",

    "a11y.skip": "Aller au contenu",
    "a11y.mainNav": "Navigation principale",
    "a11y.footerNav": "Navigation du pied de page",
    "a11y.language": "Langue",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];

/**
 * Returns a lookup function bound to one language.
 *
 * Keys are typed against the English table, so a key that exists in one
 * language but not the other is a build error rather than a blank space on
 * the page.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key];
  };
}
