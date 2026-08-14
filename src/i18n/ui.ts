/**
 * Interface strings — navigation, section headings, buttons, and the short
 * brand lines that frame the client's content.
 *
 * Long-form copy lives in src/content/. This file holds only the chrome, so
 * that adding a language means translating a bounded list rather than hunting
 * through templates.
 *
 * English is taken from the client's Copy Deck V1.0 and reproduced verbatim,
 * including its capitalisation, which is part of the brand's voice.
 *
 * ⚠️ The French is a working translation using Canadian conventions. Have it
 * reviewed by a francophone before the site is promoted in French.
 *
 * Brand marks are never translated: GAG, "LET'S PLAY GAG!", the event names,
 * and the three-part positioning line stay in English in both locales, since
 * translating them would create a second, competing set of names.
 */

import type { Lang } from "./config";

export const ui = {
  en: {
    // ── Navigation ──────────────────────────────────────────────────────
    "nav.events": "Events",
    "nav.players": "Players",
    "nav.university": "University",
    "nav.community": "Community",
    "nav.about": "About",
    "nav.partners": "Partners",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",

    // ── Page titles ─────────────────────────────────────────────────────
    "page.home": "Home",
    "page.events": "Events",
    "page.players": "Players",
    "page.university": "University",
    "page.community": "Community",
    "page.about": "About GAG",
    "page.partners": "Partners",
    "page.contact": "Contact",

    "meta.description":
      "GAG — Great Lakes Amateur Golf. A youth-focused amateur golf platform connecting young golfers, universities, tournaments and opportunities across Canada and around the world.",

    // ── Home ────────────────────────────────────────────────────────────
    "home.tagline": "Young Golf. Serious Competition.",
    "home.moreThan": "GAG is more than a golf tournament.",
    "home.purpose": "What GAG Is For",
    "home.nextLevel": "From amateur golf to the next level.",
    "home.upcoming": "Upcoming Events",
    "home.upcoming.empty":
      "The tournament schedule will be announced shortly.",
    "home.players": "GAG Players",
    "home.university": "GAG University",
    "home.community": "GAG Community",

    // ── Events ──────────────────────────────────────────────────────────
    "events.lede": "Compete. Connect. Grow.",
    "events.series": "Our Events",
    "events.future": "Future Events",
    "events.detailFields": "Every event page will carry",

    // ── Players ─────────────────────────────────────────────────────────
    "players.lede": "Meet the Next Generation.",
    "players.groups": "Age Groups",
    "players.aim": "To play better. To compete harder. To go further.",
    "players.profile": "Player Profile",
    "players.privacy": "Player Privacy",
    "players.privacyLede": "Your game is public. Your private life is private.",

    // ── University ──────────────────────────────────────────────────────
    "university.lede": "Connecting Universities Through Golf.",
    "university.together": "Play together. Compete together. Grow together.",

    // ── Community ───────────────────────────────────────────────────────
    "community.lede": "One Game. One Community. A World of Opportunities.",
    "community.who": "Who Makes Up GAG",

    // ── About ───────────────────────────────────────────────────────────
    "about.who": "Who We Are",
    "about.vision": "Our Vision",
    "about.mission": "Our Mission",
    "about.story": "Our Story",
    "about.values": "Our Values",
    "about.governance": "Our Governance",
    "about.fund": "GAG Youth Golf Fund",

    // ── Partners ────────────────────────────────────────────────────────
    "partners.lede": "Great young golf requires a strong community of partners.",
    "partners.categories": "Who We Work With",

    // ── Contact ─────────────────────────────────────────────────────────
    "contact.lede": "Let's connect.",
    "contact.audiences": "Who Are You?",

    // ── Calls to action ─────────────────────────────────────────────────
    "cta.play": "Let's Play GAG",
    "cta.joinEvent": "Join an Event",
    "cta.meetPlayers": "Meet Our Players",
    "cta.viewEvents": "View All Events",
    "cta.aboutGag": "About GAG",
    "cta.partner": "Become a GAG Partner",
    "cta.contact": "Contact Us",
    "cta.enquire": "Get in Touch",
    "cta.enquirePending": "Contact details to follow",

    // ── Accessibility ───────────────────────────────────────────────────
    "a11y.skip": "Skip to content",
    "a11y.mainNav": "Main navigation",
    "a11y.footerNav": "Footer navigation",
    "a11y.language": "Language",
  },

  fr: {
    "nav.events": "Épreuves",
    "nav.players": "Joueurs",
    "nav.university": "Universités",
    "nav.community": "Communauté",
    "nav.about": "À propos",
    "nav.partners": "Partenaires",
    "nav.contact": "Nous joindre",
    "nav.menu": "Menu",
    "nav.close": "Fermer",

    "page.home": "Accueil",
    "page.events": "Épreuves",
    "page.players": "Joueurs",
    "page.university": "Universités",
    "page.community": "Communauté",
    "page.about": "À propos de GAG",
    "page.partners": "Partenaires",
    "page.contact": "Nous joindre",

    "meta.description":
      "GAG — Great Lakes Amateur Golf. Une plateforme de golf amateur dédiée à la relève, qui relie jeunes golfeurs, universités, tournois et occasions de développement au Canada et dans le monde.",

    "home.tagline": "Young Golf. Serious Competition.",
    "home.moreThan": "GAG est bien plus qu'un tournoi de golf.",
    "home.purpose": "La raison d'être de GAG",
    "home.nextLevel": "Du golf amateur au niveau supérieur.",
    "home.upcoming": "Épreuves à venir",
    "home.upcoming.empty": "Le calendrier des épreuves sera annoncé sous peu.",
    "home.players": "Joueurs GAG",
    "home.university": "GAG Universités",
    "home.community": "Communauté GAG",

    "events.lede": "Compete. Connect. Grow.",
    "events.series": "Nos épreuves",
    "events.future": "Épreuves à venir",
    "events.detailFields": "Chaque page d'épreuve présentera",

    "players.lede": "Voici la relève.",
    "players.groups": "Catégories d'âge",
    "players.aim": "Mieux jouer. Rivaliser plus fort. Aller plus loin.",
    "players.profile": "Profil du joueur",
    "players.privacy": "Vie privée des joueurs",
    "players.privacyLede": "Votre jeu est public. Votre vie privée ne l'est pas.",

    "university.lede": "Relier les universités par le golf.",
    "university.together":
      "Jouer ensemble. Rivaliser ensemble. Grandir ensemble.",

    "community.lede": "One Game. One Community. A World of Opportunities.",
    "community.who": "Qui compose GAG",

    "about.who": "Qui nous sommes",
    "about.vision": "Notre vision",
    "about.mission": "Notre mission",
    "about.story": "Notre histoire",
    "about.values": "Nos valeurs",
    "about.governance": "Notre gouvernance",
    "about.fund": "Fonds GAG pour la relève",

    "partners.lede":
      "Un grand golf pour la relève exige une solide communauté de partenaires.",
    "partners.categories": "Avec qui nous collaborons",

    "contact.lede": "Parlons-nous.",
    "contact.audiences": "Vous êtes…",

    "cta.play": "Let's Play GAG",
    "cta.joinEvent": "Inscrivez-vous",
    "cta.meetPlayers": "Découvrir les joueurs",
    "cta.viewEvents": "Toutes les épreuves",
    "cta.aboutGag": "À propos de GAG",
    "cta.partner": "Devenir partenaire de GAG",
    "cta.contact": "Nous joindre",
    "cta.enquire": "Écrivez-nous",
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
