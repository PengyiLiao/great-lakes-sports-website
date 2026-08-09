// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://great-lakes-sports.pages.dev",

  // Serve /about rather than /about/.
  //
  // With the default directory output, every page is emitted as
  // about/index.html and the host 308-redirects /about to /about/. That put
  // the canonical tags, hreflang alternates and sitemap — all of which are
  // built from the unslashed route — at odds with the URL actually served,
  // and made every internal link cost a redirect hop. Emitting about.html
  // instead makes the served URL and the declared one the same string.
  trailingSlash: "never",
  build: { format: "file" },

  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: {
      // English is served without a prefix, so the organization's primary
      // address stays clean: /about rather than /en/about. Chinese lives
      // under /zh.
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Emits <xhtml:link rel="alternate"> entries so the sitemap states
      // outright that /about and /zh/about are the same page in two
      // languages, rather than leaving search engines to infer it.
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", zh: "zh-Hans" },
      },
    }),
  ],
});