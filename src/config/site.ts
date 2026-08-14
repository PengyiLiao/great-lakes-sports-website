/**
 * Structural site configuration.
 *
 * Anything language-dependent lives in src/i18n/ (interface strings) or
 * src/content/ (page copy). What remains here is the handful of facts that
 * are the same in every language: who the organization is, and what routes
 * the site has.
 */

import type { UIKey } from "../i18n/ui";

export const site = {
  /** The brand. The site is GAG's; Great Lakes Sports Inc. is the operator. */
  name: "GAG",

  /** What the initials stand for, used in titles and the accessible logo name. */
  fullName: "Great Lakes Amateur Golf",

  /** Operating company — the copyright holder and legal entity. */
  legalName: "Great Lakes Sports Inc.",

  location: "Toronto, Ontario, Canada",

  /**
   * Canonical production origin, used to build absolute URLs for canonical
   * and social tags. Update once gag.ca is registered and pointed at
   * Cloudflare Pages.
   */
  origin: "https://great-lakes-sports.pages.dev",
} as const;

/**
 * Public enquiry address.
 *
 * Deliberately null until the client supplies a real one. An invented address
 * would be worse than none: visitors would write to a mailbox nobody reads and
 * conclude the organization ignores them. Components check for it and fall
 * back to a "details to follow" line, so the page is coherent either way, and
 * the gap stays visible to the client rather than being silently papered over.
 */
export const contactEmail: string | null = null;

/**
 * Public link to the tournament entry form.
 *
 * Entries are taken through a hosted form rather than anything built here.
 * This site is static and has no backend, which is most of why it has almost
 * nothing to attack — and entries for this event will include the personal
 * details of players as young as sixteen. Handing that data to a provider
 * whose job is storing it, instead of standing up our own endpoint and
 * database for 72 rows, is both faster and materially safer.
 *
 * Set to null while no form exists: the registration page then shows what
 * entrants need to have ready and says entries are not yet open, rather than
 * pointing a button at a form that is not there.
 *
 * The form's editor access is restricted to the organizers while the
 * responder view is open to anyone with the link, so entrants do not need a
 * Google account to enter. Verified reachable without signing in.
 *
 * See docs/REGISTRATION.md for the field list and privacy rules, and
 * docs/google-form-setup.gs for the script that built it.
 */
export const registrationUrl: string | null =
  "https://forms.gle/Yji5tuRmYa3npbJU9";

export type NavItem = {
  /** Interface-string key resolved per language. */
  key: UIKey;
  /** Canonical, unprefixed route. Locale prefixes are applied at render. */
  route: string;
};

/**
 * Primary navigation.
 *
 * Mirrors the section list in the client's copy deck. News and Shop are named
 * there as later phases and are deliberately absent until they have content —
 * navigation should never advertise a page that does not exist yet.
 */
export const nav: NavItem[] = [
  { key: "nav.events", route: "/events" },
  { key: "nav.players", route: "/players" },
  { key: "nav.university", route: "/university" },
  { key: "nav.community", route: "/community" },
  { key: "nav.about", route: "/about" },
  { key: "nav.partners", route: "/partners" },
  { key: "nav.contact", route: "/contact" },
];
