// The entry page of abap2UI5 - one static page at the root of
// https://abap2ui5.github.io/, published by GitHub Pages
// (.github/workflows/pages.yml). The sites it points at (/docs/, /why/,
// /playground/, /layout-editor/) are built in their own repositories.
//
// Static output only: no client component, no island, no script at all; the
// policy is `script-src 'self'` (src/layouts/Page.astro), and
// test/site.test.mjs fails a build with any script.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://abap2ui5.github.io",
  base: "/",
  trailingSlash: "ignore",
  build: {
    format: "directory",
    assets: "assets",
    // one stylesheet file, cached, rather than a <style> per page
    inlineStylesheets: "never",
  },
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
});
