/**
 * Locale definitions and URL helpers.
 *
 * The site is published in Canada's two official languages. English is the
 * default and is served without a prefix, so the organization's primary
 * address stays clean: `/about`, not `/en/about`. French lives under `/fr`.
 *
 * Every internal link is built through `localizePath`, so a page never
 * accidentally sends a French reader back into the English site.
 */

export const languages = {
  en: {
    /** How this language names itself in the switcher. */
    label: "English",
    /** BCP 47 tag for the html lang attribute and hreflang. */
    htmlLang: "en",
  },
  fr: {
    label: "Français",
    // fr-CA rather than fr: the audience is Canadian, and the copy uses
    // Canadian conventions ("commandite", "Toronto (Ontario)").
    htmlLang: "fr-CA",
  },
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

export const langCodes = Object.keys(languages) as Lang[];

/** Strip a trailing slash so route comparisons do not depend on it. */
function normalize(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/**
 * Build the URL for `route` in `lang`.
 *
 * `route` is always the unprefixed, canonical path — "/", "/about", "/brand".
 */
export function localizePath(route: string, lang: Lang): string {
  const base = normalize(route);
  if (lang === defaultLang) return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
}

/**
 * Recover the canonical route from a localized pathname.
 *
 * `/fr/about` and `/about` both resolve to `/about`, which is what lets the
 * language switcher offer the same page in the other language rather than
 * dumping the reader on the home page.
 */
export function routeFromPath(pathname: string): string {
  const path = normalize(pathname);

  for (const lang of langCodes) {
    if (lang === defaultLang) continue;
    if (path === `/${lang}`) return "/";
    if (path.startsWith(`/${lang}/`)) return path.slice(lang.length + 1);
  }

  return path;
}
