/**
 * Tournament schedule.
 *
 * Rendered newest-first by the home page. When the array is empty the section
 * falls back to a "schedule to be announced" state, so the page never shows an
 * empty shell — adding a season is a matter of appending entries here.
 *
 * ⚠️ The single entry below is transcribed from the plaque on the client's own
 * championship-trophy visual ("GAG Golf Event / Toronto / October 05, 2026").
 * It has not been confirmed in writing. Confirm the date, venue and format
 * with the client before this site is published to a public domain.
 */

export type GolfEvent = {
  name: string;
  /** ISO date, used for the machine-readable datetime attribute. */
  date: string;
  /** How the date should read on the page. */
  displayDate: string;
  location: string;
};

export const events: GolfEvent[] = [
  {
    name: "GAG Golf Event",
    date: "2026-10-05",
    displayDate: "October 5, 2026",
    location: "Toronto, Ontario",
  },
];
