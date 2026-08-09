## Start here

Read [`docs/HANDOFF.md`](docs/HANDOFF.md) before changing anything. It records
the current state of the project, which file owns which piece of the site, the
design decisions already settled (and why), and what is still waiting on the
client. It is written in Chinese, the working language of this project.

## House rules

- **Copy never goes in a template.** Page text lives in `src/content/`,
  interface strings in `src/i18n/ui.ts`. Both carry an `en` and a `zh` entry —
  update both, or one language silently falls behind.
- **Colours are referenced by token**, never as raw hex. The palette is defined
  once in the `@theme` block of `src/styles/global.css`.
- **Do not invent client information.** No placeholder email addresses, no
  invented descriptions for values the client supplied as bare names, no
  unconfirmed dates presented as fact. Where something is missing, the page
  says so plainly and the gap stays visible to the client.
- **Nothing confidential enters the repository.** It is public, and history is
  permanent. `.gitignore` blocks documents and secrets as a safety net, but
  check `git status` before committing.
- Commit messages in English, conventional-commit prefixes.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Run `npm run build` before committing — it type-checks first via `astro check`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
