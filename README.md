# abap2UI5.github.io

The entry page of abap2UI5 at <https://abap2ui5.github.io/>: one page that
points at everything - the documentation and the why-site, the browser tools,
the development tools, the addons and the community channels.

The sites it points at are built in their own repositories:

- `/docs/` – [abap2UI5/docs](https://github.com/abap2UI5/docs)
- `/docs-manager/` – [abap2UI5/docs-manager](https://github.com/abap2UI5/docs-manager)
- `/docs-insights/` – [abap2UI5/docs-insights](https://github.com/abap2UI5/docs-insights)
- `/browser-playground/` – [abap2UI5/browser-playground](https://github.com/abap2UI5/browser-playground)
- `/browser-layout-editor/` – [abap2UI5/browser-layout-editor](https://github.com/abap2UI5/browser-layout-editor)

```bash
npm ci
npm run dev      # http://localhost:4321/
npm run check    # build + test, what CI runs
```

Sites that moved keep their old addresses: `/why/`, `/insights/`,
`/playground/` and `/layout-editor/` land on this site's 404 page, whose one
script (`public/moved.js`) forwards them to the new address with the rest of
the path, the query and the fragment.

Adding a tool, an addon or a channel is one line in the `groups` array of
`src/pages/index.astro`. See `AGENTS.md` for the rules.

The look every abap2UI5 site shares - the top line, the colours, the type,
the tile - is written down in [CONVENTION.md](CONVENTION.md).
