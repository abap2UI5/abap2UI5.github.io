# AGENTS.md

The entry page of abap2UI5: one static page at the root of
https://abap2ui5.github.io/ that points at everything the project publishes -
the documentation, the why-site, the browser tools, the development tools, the
addons and the community channels. A signpost, not a manual: it explains
nothing that another site explains, every tile leaves the page. Built the way
abap2UI5/why is built (Astro, no script, nothing from another origin), and
nothing in it depends on another repository at build time.

## Layout

| Path | Purpose |
| --- | --- |
| `src/pages/index.astro` | The page: the four groups and their tiles as data at the top, the markup below |
| `src/layouts/Page.astro` | The document: head, the Content-Security-Policy, the top line (the wordmark, Home and Addons & Tools as tabs, CONVENTION.md section 1), the one-line foot |
| `src/styles/global.css` | The one stylesheet; light and dark follow the system |
| `public/` | Font (Inter, self-hosted), logo, icons |
| `test/site.test.mjs` | `node:test` over the built `dist/index.html` |
| `.github/workflows/pages.yml` | Build + test on every PR; deploy on main |

The sites under `/docs/`, `/why/`, `/playground/` and `/layout-editor/` are
project sites of their own repositories; GitHub Pages serves them next to this
page, nothing here builds or copies them.

## Commands

```bash
npm ci
npm run dev      # dev server, http://localhost:4321/
npm run build    # dist/
npm test         # the tests, against dist/ - build first
npm run check    # build + test, what CI runs
```

## The family

This page is one of a family of abap2UI5 sites, each built from its own
repository. What they share is `CONVENTION.md`: the top line, the colours,
the type, the tile and the foot. It is copied into each site, never
imported; a change to it starts here.

## Rules

- **A greeting and four groups.** The `<h1>` says "Welcome to abap2UI5" and
  nothing else introduces the page. The ids `introduction`, `try-it`, `more`, `community`
  are what the test names and
  what other sites may link; reword a heading freely, keep the `id`.
- **A tile is one line of data.** Add, reorder or drop a tool in the `groups`
  array of `src/pages/index.astro`; the markup below renders whatever is
  there. A tile is a title and one short line, nothing more - no badge, no
  address line. The addons and the developer tools are not on this page: they
  live on their own site, reached by the one tile under "More" and the
  "Addons & Tools" tab of the top line. Only the community carries marks
  (`src/components/marks.ts`), and it is a row of small tiles with a mark and a name, no text. A tile
  at rest is a border and a quiet ↗, no shadow, no icon. The line under a title is two lines at most:
  write it short (about 70 characters); the stylesheet cuts anything longer. "Try it online" is for what runs in the browser without an
  installation; the addons have a site of their own.
  Developer tooling (linter, VS Code extension, MCP server) is reached
  through the documentation, not from here.
- **Every tile leaves the page, in a new tab.** The test holds every tile to
  `https://`, to the project's own places, and to `target="_blank"` with
  `rel="noopener"`; the arrow in the corner says so (↗). The one exception
  is the tile to the sister site (`inside`): same tab, straight arrow (→). SAP Community and Bluesky have no abap2UI5
  channel yet; their tiles lead to the platform until there is one. Never
  point a tile into nothing.
- **No script.** The policy is `script-src 'self'` and the page ships none:
  no inline script, no `on…=` handler, no inline `style=""`.
- **Nothing from another origin.** No CDN, no web font service, no analytics;
  the font and the images are in `public/`.
- **Short.** The page is scanned, not read: one sentence per tile, the visible
  text stays under 500 words (the test holds it). What needs a paragraph is a
  link into the docs or the why-site.
- **Toolchain:** Node 22 (`.nvmrc`, `engines`), every dependency pinned
  exactly (astro 7.3.8), actions pinned to commits. Deployment needs
  Settings → Pages → Source: "GitHub Actions" once.
