# The abap2UI5 family of sites

Every abap2UI5 site - this home page, the documentation, the samples, the
playground with the AI App Builder, the addons, the why-site, the layout editor -
is built and deployed from **its own repository, with nothing shared at build
time and nothing shared in the browser's storage**. Between the sites there
are links, and nothing else.

What makes them read as one family is this convention. **Copy it into a
site; never import it from another repository.** When the convention changes,
it changes here first, and each site follows in its own pull request.

## 1. The top line

Top left, the logo (22px, `alt=""`) and the word **abap2UI5**, linking to the home page - always both, on every site. That
is the way between the sites: every site leads home, and the home page is
the one place that lists them all - the two role tiles, Try it online, More,
Community. **No site carries a row of the other sites.** A reader who wants
another site goes home and picks it, or follows a link in the text.

Beside the brand a site shows where the reader is as a breadcrumb: the home
page says **Home**; its two sister sites say **Home / Samples** and
**Home / Addons & Tools**, and a page deeper in continues the trail
(**Home / Samples / Learn / Basics**, **Home / Addons & Tools / sapgui**).
The ancestors are muted links, the separator `/` is in the line colour, and
only the last entry - the current page, not a link - is marked: the ink
colour, weight 600 and a 2px underline in the accent. The underline takes
no height (`margin-bottom: -3px` against its 2px line and 1px gap): the
marked word stays level with the rest of the trail. The home page reaches
the sister sites by a tile that opens in the same tab (→), not by a tab.

```html
<div class="topline">
  <nav class="sites" aria-label="Breadcrumb">
    <a class="brand" href="https://abap2ui5.github.io/"><img src="logo.png" alt="" width="22" height="22"> abap2UI5</a>
    <a href="https://abap2ui5.github.io/" aria-current="page">Home</a>
  </nav>
</div>

<!-- a sister site, one page deep -->
<div class="topline">
  <nav class="sites" aria-label="Breadcrumb">
    <a class="brand" href="https://abap2ui5.github.io/"><img src="logo.png" alt="" width="22" height="22"> abap2UI5</a>
    <a href="https://abap2ui5.github.io/">Home</a><span class="sep" aria-hidden="true">/</span>
    <a href="/">Addons &amp; Tools</a><span class="sep" aria-hidden="true">/</span>
    <span aria-current="page">sapgui</span>
  </nav>
</div>
```

- A link to another abap2UI5 site is an absolute URL. A site that is a
  single-page application (VitePress) gives such a link `target="_self"`, or
  its router draws its own 404 at the other site's URL.
- A site's own pages (a FAQ, the chapters of the manual, the sections of a
  tool) are the site's own row or sidebar.
- A tool that needs the full height of the window (the playground, the AI
  Studio, the layout editor, the report converter) keeps its own toolbar, as
  long as the logo, the word and the way home stay top left. Its menu may
  list the other sites.
- The four tools - the Playground, the AI App Builder, the AI Agent
  (abap2UI5/playground) and the Layout Editor (abap2UI5/layout-editor) -
  wear one look, the AI App Builder's: one bar of logo, **abap2UI5** and the
  tool's name in the accent, which is a menu of all four tools with the one
  on screen marked; the work on cards on a sunken page; pills for what is
  pressed; a light/dark switch at the right of the bar. The list of tools is
  kept in both repositories; change the two together.

## 2. Colour

One accent, the red of the logo. Everything that says "this is what to do
next" or "you are here" takes it: links, the current section, the primary
button, the hover of a tile. Nothing else is coloured.

| Token | Light | Dark | Used for |
|---|---|---|---|
| accent | `#d03c4a` | `#f0606d` | links, current section, primary button, hover |
| accent strong | `#b02e3b` | `#ff7a86` | the accent on hover |
| accent soft | `#fdecee` | `#3a1d22` | a tinted background, the focus glow |
| ink | `#0f172a` | `#f1f4f9` | headings, the brand word, the current section |
| text | `#1e293b` | `#d8dee8` | running text |
| muted | `#5b6474` | `#9aa4b5` | secondary text, inactive sections |
| line | `#e2e6ec` | `#273042` | borders and rules |
| background | `#ffffff` | `#0f1522` | the page |

**Binding: the accent, in both themes.** The red fails AA in dark as it is
(3.62:1), so dark takes the lifted value; every pairing in the table clears
AA. **Reference: the greys.** A site with greys of its own, tuned to its
layout, may keep them as long as they stay neutral and close to these.

Light and dark follow the reader's system. A site with a switch of its own
keeps the choice under its own storage key.

## 3. Type

Inter, self-hosted (the Latin subset, `inter-roman-latin.woff2`, with its
`NOTICE`), and the system stack behind it:

```css
font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Code: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

## 4. The tile

A tile is a link to a place, and looks it: a 1px border in *line*, a 12px
radius, no shadow at rest, a quiet arrow top right (↗ for another site in a
new tab, → for a place in the same tab). On hover it lifts 2px, the border
and the arrow turn to the accent. Keyboard focus lies on the tile itself:
the accent border and a 3px glow in *accent soft*.

## 5. The foot

Every site carries one muted line at the bottom of the window however
short the page, with no rule above it - as there is none under the top
line, and it is the same line on every site: the licence and About, as
the home page carries it. A sister site (Samples, Addons & Tools) adds
nothing to it - the name leading home is the wordmark in the top line,
and the mail is on About.
