/**
 * Tournament schedule.
 *
 * When the list is empty the home page falls back to a "to be announced"
 * state, so the section never renders as an empty shell — publishing a season
 * is a matter of appending entries here.
 *
 * ⚠️ The single entry below is transcribed from the plaque on the client's own
 * championship-trophy visual ("GAG Golf Event / Toronto / October 05, 2026").
 * It has not been confirmed in writing. Confirm the date, venue and format
 * with the client before this site is published to a public domain.
 */

import type { Lang } from "../i18n/config";

export type GolfEvent = {
  /** ISO date for the machine-readable datetime attribute. */
  date: string;
  /** Per-locale presentation of the same event. */
  localized: Record<Lang, { name: string; displayDate: string; location: string }>;
};

export const events: GolfEvent[] = [
  {
    date: "2026-10-05",
    localized: {
      en: {
        name: "GAG Golf Event",
        displayDate: "October 5, 2026",
        location: "Toronto, Ontario",
      },
      zh: {
        name: "GAG 高尔夫赛事",
        displayDate: "2026年10月5日",
        location: "安大略省，多伦多",
      },
    },
  },
];
