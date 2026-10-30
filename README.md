# abap2UI5.github.io

The entry page of abap2UI5 at <https://abap2ui5.github.io/>: one page that
points at everything - the documentation and the why-site, the browser tools,
the development tools, the add-ons and the community channels.

The sites it points at are built in their own repositories:

- `/docs/` – [abap2UI5/docs](https://github.com/abap2UI5/docs)
- `/why/` – [abap2UI5/why](https://github.com/abap2UI5/why)
- `/playground/` – [abap2UI5/playground](https://github.com/abap2UI5/playground)
- `/layout-editor/` – [abap2UI5/layout-editor](https://github.com/abap2UI5/layout-editor)

```bash
npm ci
npm run dev      # http://localhost:4321/
npm run check    # build + test, what CI runs
```

Adding a tool, an add-on or a channel is one line in the `groups` array of
`src/pages/index.astro`. See `AGENTS.md` for the rules.
