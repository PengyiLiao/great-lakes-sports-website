/**
 * Structural site configuration.
 *
 * Anything language-dependent lives in src/i18n/ (interface strings) or
 * src/content/ (page copy). What remains here is the handful of facts that
 * are the same in every language: who the organization is, where it is, and
 * what routes the site has.
 */

import type { UIKey } from "../i18n/ui";

export const site = {
  /** Display name used in the header and footer wordmark. */
  name: "Great Lakes Sports",

  /** Full legal entity name, used in titles and the copyright notice. */
  legalName: "Great Lakes Sports Inc.",

  location: "Toronto, Ontario, Canada",

  /**
   * Canonical production origin, used to build absolute URLs for canonical
   * and social tags. Update once the domain is registered and pointed at
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

export type NavItem = {
  /** Interface-string key resolved per language. */
  key: UIKey;
  /** Canonical, unprefixed route. Locale prefixes are applied at render. */
  route: string;
};

/**
 * Primary navigation.
 *
 * Items are added here as their pages ship, so the navigation never advertises
 * a page that does not yet exist.
 */
export const nav: NavItem[] = [
  { key: "nav.home", route: "/" },
  { key: "nav.about", route: "/about" },
  { key: "nav.brand", route: "/brand" },
];
