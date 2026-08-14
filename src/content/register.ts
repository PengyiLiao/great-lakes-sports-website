/**
 * Copy for the registration page.
 *
 * ⚠️ The eligibility line comes from the client's inaugural-tournament deck
 * (a field of 72, handicaps under 10). The checklist below is what any golf
 * tournament entry needs and is drafted, not supplied — have the organizing
 * committee confirm it before entries open.
 *
 * Deliberately absent: the entry fee, which appears only in an internal
 * budget sheet and may not be final.
 */

import type { Lang } from "../i18n/config";

type RegisterContent = {
  intro: string;
  /** What an entrant should have to hand before opening the form. */
  checklistTitle: string;
  checklist: string[];
  /** The under-18 requirement, given its own block. */
  minorsTitle: string;
  minors: string;
  /** What the site publishes about an entrant, and what it never does. */
  privacyTitle: string;
  privacyPublished: string;
  privacyWithheld: string;
  /** Shown in place of the button while the form does not exist. */
  pending: string;
};

export const register: Record<Lang, RegisterContent> = {
  en: {
    intro:
      "Entries for GAG competitions are taken through an online entry form. Fields are limited and places are confirmed by the organizing committee.",

    checklistTitle: "Before you start",
    checklist: [
      "Your current handicap index",
      "The club or association where your handicap is maintained",
      "Your Golf Canada or Golf Ontario membership number, if you have one",
      "Your club, university or team affiliation",
      "An emergency contact name and phone number",
      "Shirt size and any dietary requirements, for the player package and catering",
    ],

    minorsTitle: "Players under 18",
    minors:
      "Entrants under 18 must provide a parent or guardian's name and contact details, and that parent or guardian must authorize both the entry and the publication of the player's competitive information. Entries for players under 18 are not confirmed until that authorization is received.",

    privacyTitle: "What we publish",
    privacyPublished:
      "Draw sheets, results and player profiles show competitive information only: name, club or university, province, handicap and results.",
    privacyWithheld:
      "Contact details, home city and address, full dates of birth, identification documents and family contact information are collected solely to run the competition and are never published.",

    pending:
      "The entry form for the 2026 inaugural tournament is not open yet. Details will be posted here as soon as it is.",
  },

  fr: {
    intro:
      "Les inscriptions aux compétitions GAG se font au moyen d'un formulaire en ligne. Les places sont limitées et confirmées par le comité organisateur.",

    checklistTitle: "Avant de commencer",
    checklist: [
      "Votre facteur de handicap actuel",
      "Le club ou l'association où votre handicap est tenu à jour",
      "Votre numéro de membre Golf Canada ou Golf Ontario, le cas échéant",
      "Votre club, université ou équipe",
      "Le nom et le numéro de téléphone d'une personne à joindre en cas d'urgence",
      "Votre taille de chandail et vos restrictions alimentaires, pour la trousse du joueur et les repas",
    ],

    minorsTitle: "Joueurs de moins de 18 ans",
    minors:
      "Les participants de moins de 18 ans doivent fournir le nom et les coordonnées d'un parent ou tuteur, lequel doit autoriser l'inscription ainsi que la publication des renseignements sportifs du joueur. L'inscription d'un joueur mineur n'est confirmée qu'à la réception de cette autorisation.",

    privacyTitle: "Ce que nous publions",
    privacyPublished:
      "Les feuilles de départ, les résultats et les profils de joueurs ne présentent que des renseignements sportifs : nom, club ou université, province, handicap et résultats.",
    privacyWithheld:
      "Les coordonnées, la ville et l'adresse résidentielle, la date de naissance complète, les pièces d'identité et les coordonnées des proches servent uniquement à la tenue de la compétition et ne sont jamais publiées.",

    pending:
      "Le formulaire d'inscription au tournoi inaugural 2026 n'est pas encore ouvert. Les détails seront publiés ici dès son ouverture.",
  },
};
