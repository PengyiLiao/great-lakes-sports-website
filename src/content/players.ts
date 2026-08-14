/**
 * Copy for the Players page.
 *
 * The age-group ladder is shared with the home page, so it is defined once
 * here and imported rather than restated.
 *
 * The privacy section is reproduced closely from the client's Copy Deck. It
 * is a commitment to players and their families, several of whom are minors,
 * so it is the one part of the site that should not be loosely paraphrased.
 */

import type { Lang } from "../i18n/config";

type Localized<T> = Record<Lang, T>;

export type AgeGroup = {
  /** Age band, identical in both languages. */
  range: string;
  label: Localized<string>;
};

export const ageGroups: AgeGroup[] = [
  {
    range: "16–18",
    label: { en: "Junior Golfers", fr: "Golfeurs juniors" },
  },
  {
    range: "18–22",
    label: { en: "University Golfers", fr: "Golfeurs universitaires" },
  },
  {
    range: "22–25",
    label: { en: "Elite Amateurs", fr: "Amateurs d'élite" },
  },
];

/**
 * Fields a public player profile will carry once the player database ships.
 * Shown on the page as a preview of what is coming, so universities and
 * players can see what will be published about them before it exists.
 */
export const profileFields: Localized<string[]> = {
  en: [
    "Player name",
    "University / School",
    "Country",
    "Age group",
    "Handicap",
    "WAGR",
    "GAG events",
    "Best finish",
    "GAG results",
    "About",
  ],
  fr: [
    "Nom du joueur",
    "Université / École",
    "Pays",
    "Catégorie d'âge",
    "Handicap",
    "WAGR",
    "Épreuves GAG",
    "Meilleur résultat",
    "Résultats GAG",
    "À propos",
  ],
};

type PlayersContent = {
  intro: string[];
  privacy: {
    body: string[];
    /** Explicitly listed as never published. */
    neverPublic: string[];
    minors: string;
  };
};

export const players: Record<Lang, PlayersContent> = {
  en: {
    intro: [
      "Young golfers are at the heart of GAG.",
      "Our platform is built for golfers aged 16–25 — junior golfers, university golfers and elite amateurs — and for the step each of them is trying to take next.",
    ],
    privacy: {
      body: [
        "GAG respects the privacy of every player.",
        "Public player profiles are designed to showcase athletic information, competition history and achievements.",
      ],
      neverPublic: [
        "Personal phone numbers",
        "Private email addresses",
        "Home addresses",
        "Identification documents",
        "Passport information",
        "Full dates of birth",
        "Family contact information",
      ],
      minors:
        "For players under 18, GAG applies appropriate privacy and consent requirements, including parental or guardian authorization where required.",
    },
  },

  fr: {
    intro: [
      "Les jeunes golfeurs sont au cœur de GAG.",
      "Notre plateforme s'adresse aux golfeurs de 16 à 25 ans — juniors, universitaires et amateurs d'élite — et à l'étape que chacun cherche à franchir.",
    ],
    privacy: {
      body: [
        "GAG respecte la vie privée de chaque joueur.",
        "Les profils publics servent à mettre en valeur les renseignements sportifs, l'historique de compétition et les réalisations.",
      ],
      neverPublic: [
        "Numéros de téléphone personnels",
        "Adresses courriel privées",
        "Adresses résidentielles",
        "Pièces d'identité",
        "Renseignements de passeport",
        "Date de naissance complète",
        "Coordonnées des proches",
      ],
      minors:
        "Pour les joueurs de moins de 18 ans, GAG applique des exigences adaptées en matière de vie privée et de consentement, y compris l'autorisation d'un parent ou tuteur lorsqu'elle est requise.",
    },
  },
};
