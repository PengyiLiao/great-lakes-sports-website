/**
 * Event series and the tournament schedule.
 *
 * When `events` is empty the pages fall back to a "to be announced" state, so
 * a section never renders as an empty shell — publishing a season is a matter
 * of appending entries here.
 *
 * ⚠️ The inaugural tournament details come from the client's own
 * "2026 GAG Inaugural Tournament" deck: TPC Toronto at Osprey Valley, North
 * Course, Sunday 11 October 2026, a field of 72 with handicaps under 10.
 * This supersedes the 5 October date transcribed earlier from a trophy
 * mockup, which was wrong.
 *
 * Deliberately NOT published here, pending client confirmation:
 *   · the entry fee — it appears only in an internal budget sheet and may
 *     not be final
 *   · the 17–55 age range in the deck, which contradicts the 16–25 focus the
 *     Copy Deck states everywhere else
 */

import type { Lang } from "../i18n/config";

type Localized<T> = Record<Lang, T>;

/** A standing competition, as opposed to a dated event. */
export type EventSeries = {
  /** Series names are brand marks and are not translated. */
  name: string;
  description: Localized<string>;
};

export const eventSeries: EventSeries[] = [
  {
    name: "GAG Championships",
    description: {
      en: "Our flagship championship for high-level young amateur golfers. A competitive, professionally organized tournament designed to provide strong players with a serious stage on which to test their game.",
      fr: "Notre championnat phare pour les jeunes golfeurs amateurs de haut niveau. Un tournoi compétitif et professionnellement encadré, conçu pour offrir aux meilleurs joueurs une véritable scène où éprouver leur jeu.",
    },
  },
  {
    name: "GAG University Cup",
    description: {
      en: "A university-focused competition connecting student golfers and university teams. The University Cup aims to create stronger connections between universities and develop a broader university golf community.",
      fr: "Une compétition universitaire qui réunit golfeurs étudiants et équipes universitaires. La University Cup vise à resserrer les liens entre les universités et à faire grandir la communauté du golf universitaire.",
    },
  },
  {
    name: "GAG Invitational",
    description: {
      en: "A selective event bringing together outstanding players, university teams and invited partners.",
      fr: "Une épreuve sur sélection qui rassemble des joueurs d'exception, des équipes universitaires et des partenaires invités.",
    },
  },
];

/** Announced but not yet scheduled. Names are brand marks. */
export const futureSeries = [
  "GAG Junior",
  "GAG Women's",
  "GAG Team",
  "GAG International",
];

/** The sections every event detail page will carry once results go live. */
export const eventPageSections: Localized<string[]> = {
  en: [
    "Tournament Overview",
    "Eligibility",
    "Format",
    "Rules",
    "Schedule",
    "Players",
    "Results",
    "Registration",
    "Contact",
  ],
  fr: [
    "Présentation du tournoi",
    "Admissibilité",
    "Formule",
    "Règles",
    "Horaire",
    "Joueurs",
    "Résultats",
    "Inscription",
    "Contact",
  ],
};

export type GolfEvent = {
  /** ISO date for the machine-readable datetime attribute. */
  date: string;
  /** Venue name — a proper noun, so it is not translated. */
  venue: string;
  localized: Localized<{
    name: string;
    displayDate: string;
    location: string;
    /** Short factual notes shown as a definition list on the event card. */
    facts: { label: string; value: string }[];
  }>;
};

export const events: GolfEvent[] = [
  {
    date: "2026-10-11",
    venue: "TPC Toronto at Osprey Valley",
    localized: {
      en: {
        name: "2026 GAG Inaugural Tournament",
        displayDate: "Sunday, October 11, 2026",
        location: "Caledon, Ontario",
        facts: [
          { label: "Course", value: "North Course" },
          { label: "Field", value: "72 players" },
          { label: "Eligibility", value: "Handicap under 10" },
          { label: "First tee", value: "8:05 a.m." },
        ],
      },
      fr: {
        name: "Tournoi inaugural GAG 2026",
        displayDate: "Dimanche 11 octobre 2026",
        location: "Caledon (Ontario)",
        facts: [
          { label: "Parcours", value: "North Course" },
          { label: "Participants", value: "72 joueurs" },
          { label: "Admissibilité", value: "Handicap sous 10" },
          { label: "Premier départ", value: "8 h 05" },
        ],
      },
    },
  },
];
