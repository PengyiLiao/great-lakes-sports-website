// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://great-lakes-sports.pages.dev",

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
});
