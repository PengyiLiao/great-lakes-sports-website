# Great Lakes Sports — Official Website

The official website for **Great Lakes Sports Inc.**, a Canadian sports organization
headquartered in Toronto, Ontario, and its flagship amateur golf series
**GAG (Great Lakes Amateur Golf)**.

> 🚧 **Status:** In active development. Built and maintained on a volunteer basis.

**Live site:** **[great-lakes-sports.pages.dev](https://great-lakes-sports.pages.dev)**
&nbsp;·&nbsp; [English](https://great-lakes-sports.pages.dev)
&nbsp;·&nbsp; [Français](https://great-lakes-sports.pages.dev/fr)

---

## About the project

Great Lakes Sports Inc. organizes amateur golf tournaments across the Greater Toronto
Area. This repository contains the source for their public-facing website: company
information, brand story, tournament series, and event details.

The site is being built incrementally — the client delivers content in batches, and each
batch ships as its own set of commits. Content and presentation are deliberately kept
separate so that non-technical staff can eventually edit copy through a visual CMS
without touching code.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | [Astro](https://astro.build) | Ships zero JavaScript by default — a content site should be fast and indexable, not a bundle. |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 | Design tokens for the brand palette live in one place; no cascade surprises. |
| Language | TypeScript (`strict`) | Catches content-schema mistakes at build time rather than in production. |
| Hosting | Cloudflare Pages | Free global CDN, automatic deploys on push, DDoS protection included. |
| Architecture | Fully static | No server, no database, no login — a minimal attack surface by construction. |

### Why static?

The site's job is to present information and drive tournament sign-ups. Nothing about
that requires a server at request time. Pre-rendering every page means the site is fast
everywhere, cheap to host, and has essentially nothing to exploit. When sign-ups and
payments are added, they will be delegated to dedicated providers rather than handled
in-house, so no personal or payment data is ever stored on infrastructure we operate.

## Project structure

```
src/
  pages/            route-per-file; English at the root, French under /fr.
                    Each file is a two-line wrapper that passes a locale
                    into the matching page component.
  components/pages/ the actual page bodies, rendered once per language
  components/       reusable UI pieces
  layouts/          the document shell: head, fonts, header, footer
  content/          page copy, per language, kept out of the templates
  i18n/             locale definitions, URL helpers, interface strings
  config/           structural configuration (navigation, organization)
  assets/           images processed at build time
  styles/           brand design tokens and base styles
public/             served as-is (favicon, touch icon)
```

### Bilingual structure

The site is published in Canada's two official languages. English is served
without a URL prefix (`/about`) and French under `/fr` (`/fr/about`), so the
organization's primary address stays clean.

Both locales render from the same page components, which means a section added
to the site cannot appear in one language and silently go missing in the other.
Interface strings are typed against the English table, so a missing translation
is a build error rather than a blank space on the page. `hreflang` alternates
and the sitemap declare the pages as translations of one another, using `fr-CA`
rather than `fr` since the audience and the copy conventions are Canadian.

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:4321
npm run build   # produce the production build in dist/
npm run preview # serve the production build locally
```

## Deployment

Cloudflare Pages builds from `main` on every push and publishes in about
half a minute, so the client always has one link that reflects the current
state of the work.

URLs are emitted without a trailing slash (`/about`, not `/about/`) so that
the canonical tags, hreflang alternates and sitemap entries — all derived from
the unslashed route — name the URL that is actually served, and internal links
resolve without a redirect hop.

## Roadmap

- [x] Project scaffolding, brand design tokens, tooling
- [x] Shared layout: header, navigation, footer
- [x] Vector logo, favicons
- [x] Home page: hero, flagship series, schedule, partnership
- [x] About page
- [x] Brand page
- [x] Bilingual support (English / Français)
- [x] Deploy to Cloudflare Pages
- [ ] Contact details and enquiry routing
- [ ] GAGC, organizational structure, and remaining sections
- [ ] Visual CMS so staff can edit copy without touching code

## Notes on this repository

The source code is public; the organization's internal documents are not. Incorporation
paperwork, financial planning, contracts, and any other confidential material are
excluded by [`.gitignore`](.gitignore) and never enter the commit history. All copy in
this repository is text that is intended to be published on the public website.

## Credits

Designed and developed by [Pengyi Liao](https://github.com/PengyiLiao) for
Great Lakes Sports Inc.
