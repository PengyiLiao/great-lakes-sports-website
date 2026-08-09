# Great Lakes Sports — Official Website

The official website for **Great Lakes Sports Inc.**, a Canadian sports organization
headquartered in Toronto, Ontario, and its flagship amateur golf series
**GAG (Great Lakes Amateur Golf)**.

> 🚧 **Status:** In active development. Built and maintained on a volunteer basis.

**Live preview:** _coming soon_

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
  pages/      route-per-file — each .astro file becomes a URL
  layouts/    shared page shells (header, footer, meta tags)
  components/ reusable UI pieces
  content/    site copy, kept out of the components on purpose
  styles/     global styles and brand design tokens
public/       static assets served as-is (images, favicon, downloads)
```

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:4321
npm run build   # produce the production build in dist/
npm run preview # serve the production build locally
```

## Roadmap

- [x] Project scaffolding, brand design tokens, tooling
- [ ] Shared layout: header, navigation, footer
- [ ] Home page
- [ ] About page
- [ ] Brand page
- [ ] Bilingual support (English / 中文)
- [ ] GAGC, organizational structure, and remaining sections
- [ ] Deploy to Cloudflare Pages
- [ ] Visual CMS so staff can edit copy without touching code

## Notes on this repository

The source code is public; the organization's internal documents are not. Incorporation
paperwork, financial planning, contracts, and any other confidential material are
excluded by [`.gitignore`](.gitignore) and never enter the commit history. All copy in
this repository is text that is intended to be published on the public website.

## Credits

Designed and developed by [Pengyi Liao](https://github.com/PengyiLiao) for
Great Lakes Sports Inc.
