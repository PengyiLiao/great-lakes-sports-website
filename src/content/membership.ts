/**
 * Copy for the Membership page.
 *
 * ⚠️ Membership is currently free and carries no benefits — the client was
 * explicit about both. So this page promises none. It says what joining does
 * mean today (a place on the register, and being first to hear things) and
 * says plainly that benefits and tiers come later.
 *
 * Resist the pull to dress this up. A free membership that over-promises is
 * how an organization loses the goodwill of its first hundred members, who
 * are precisely the people who joined before there was any reason to.
 */

import type { Lang } from "../i18n/config";

type MembershipContent = {
  lede: string;
  intro: string[];
  /** What joining means today. Deliberately modest. */
  todayTitle: string;
  today: { title: string; body: string }[];
  /** What is coming, stated as intent rather than promise. */
  laterTitle: string;
  later: string[];
  laterNote: string;
  /** The distinction the client asked to make explicit. */
  distinctionTitle: string;
  distinction: string;
  /** Shown in place of the button while the form does not exist. */
  pending: string;
};

export const membership: Record<Lang, MembershipContent> = {
  en: {
    lede: "Join GAG.",

    intro: [
      "GAG membership is free, and it is open now.",
      "We are building a platform for the next generation of golf players, and membership is how that community starts. Joining puts you on the register, tells us who you are, and means you hear about tournaments, university events and opportunities before anyone else.",
    ],

    todayTitle: "What membership means today",
    today: [
      {
        title: "Free to join",
        body: "There is no fee. There is no renewal to remember. Membership is open to players, coaches, university staff and anyone who wants to be part of building GAG.",
      },
      {
        title: "A member number",
        body: "Every member is issued a GAG member number. It stays with you as the platform grows, and it is how your record connects to tournaments and results later on.",
      },
      {
        title: "First to know",
        body: "Tournament dates, entry openings, university events and news reach members first.",
      },
    ],

    laterTitle: "What is coming",
    later: [
      "Member profiles and playing records",
      "Tournament entry linked to your member number",
      "Membership tiers with their own benefits",
      "Rankings and order of merit",
    ],
    laterNote:
      "These are what we are building toward, not what exists today. Membership is free and carries no benefits at this stage — we would rather say so than imply otherwise.",

    distinctionTitle: "Membership is not tournament entry",
    distinction:
      "They are separate, and each works without the other. Membership is a standing place in the GAG community. Tournament entry is for one competition, has its own eligibility, and is open to players whether or not they are members.",

    pending:
      "Membership registration opens shortly. Details will be posted here as soon as it does.",
  },

  fr: {
    lede: "Devenez membre de GAG.",

    intro: [
      "L'adhésion à GAG est gratuite, et elle est ouverte dès maintenant.",
      "Nous bâtissons une plateforme pour la prochaine génération de joueurs de golf, et l'adhésion est le point de départ de cette communauté. Devenir membre vous inscrit au registre, nous dit qui vous êtes, et vous permet d'être informé en premier des tournois, des épreuves universitaires et des occasions à venir.",
    ],

    todayTitle: "Ce que l'adhésion signifie aujourd'hui",
    today: [
      {
        title: "Gratuite",
        body: "Aucuns frais. Aucun renouvellement à retenir. L'adhésion est ouverte aux joueurs, aux entraîneurs, au personnel universitaire et à quiconque souhaite contribuer à bâtir GAG.",
      },
      {
        title: "Un numéro de membre",
        body: "Chaque membre reçoit un numéro de membre GAG. Il vous suit à mesure que la plateforme se développe et servira à relier votre dossier aux tournois et aux résultats.",
      },
      {
        title: "Informé en premier",
        body: "Dates des tournois, ouverture des inscriptions, épreuves universitaires et nouvelles parviennent d'abord aux membres.",
      },
    ],

    laterTitle: "Ce qui s'en vient",
    later: [
      "Profils de membres et dossiers de jeu",
      "Inscription aux tournois liée à votre numéro de membre",
      "Catégories d'adhésion avec leurs avantages",
      "Classements et ordre du mérite",
    ],
    laterNote:
      "Voilà ce que nous bâtissons, et non ce qui existe aujourd'hui. L'adhésion est gratuite et ne comporte aucun avantage à ce stade — nous préférons le dire clairement plutôt que de laisser croire le contraire.",

    distinctionTitle: "L'adhésion n'est pas l'inscription à un tournoi",
    distinction:
      "Ce sont deux choses distinctes, et chacune fonctionne sans l'autre. L'adhésion est une place permanente dans la communauté GAG. L'inscription vise une seule compétition, possède ses propres conditions d'admissibilité et est ouverte aux joueurs, membres ou non.",

    pending:
      "L'adhésion ouvrira sous peu. Les détails seront publiés ici dès son ouverture.",
  },
};
