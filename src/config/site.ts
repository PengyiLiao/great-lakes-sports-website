/**
 * Site-wide configuration.
 *
 * Every piece of copy that appears in more than one place lives here rather
 * than inside a component. Changing the tagline, adding a navigation item, or
 * correcting the company address is a one-line edit in this file — no need to
 * hunt through templates. This separation is also what will let a visual CMS
 * be layered on later without restructuring the site.
 */

export const site = {
  /** Display name used in the header wordmark. */
  name: "Great Lakes Sports",

  /** Full legal entity name, used in the footer and copyright notice. */
  legalName: "Great Lakes Sports Inc.",

  /** Vision statement — appears under the wordmark on the home page. */
  tagline: "Connecting the Great Lakes to the World",

  /** Company motto — appears in the footer. */
  motto: "From the Great Lakes to the Five Continents",

  /** Default meta description, used when a page does not supply its own. */
  description:
    "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario, developing world-class amateur sporting events and international partnerships.",

  location: "Toronto, Ontario, Canada",

  /**
   * Canonical production origin, used to build absolute URLs for social
   * sharing tags. Update once the domain is registered and pointed at
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
 * the gap is visible to the client rather than silently papered over.
 */
export const contactEmail: string | null = null;

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Primary navigation.
 *
 * Kept deliberately short. Items are added here as their pages ship, so the
 * navigation never advertises a page that does not yet exist.
 */
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Brand", href: "/brand" },
];
