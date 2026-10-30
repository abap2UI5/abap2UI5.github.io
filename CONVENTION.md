# The abap2UI5 family of sites

Every abap2UI5 site - this home page, the documentation, the samples, the
playground with the AI Studio, the addons, the why-site, the layout editor -
is built and deployed from **its own repository, with nothing shared at build
time and nothing shared in the browser's storage**. Between the sites there
are links, and nothing else.

What makes them read as one family is this convention. **Copy it into a
site; never import it from another repository.** When the convention changes,
it changes here first, and each site follows in its own pull request.

## 1. The top line

Top left, the logo and the word **abap2UI5**. To the right of them the
sections the site leads to, as plain links, with the current one marked: the
ink colour, weight 600 and a 2px underline in the accent.

```html
<div class="topline">
  <nav class="sites" aria-label="Sites">
    <a class="brand" href="https://abap2ui5.github.io/">abap2UI5</a>
    <a href="https://abap2ui5.github.io/" aria-current="page">Home</a>
    <a href="https://abap2ui5-addons.github.io/">Addons &amp; Tools</a>
  </nav>
</div>
```

- A link to another abap2UI5 site is an absolute URL. A site that is a
  single-page application (VitePress) gives such a link `target="_self"`, or
  its router draws its own 404 at the other site's URL.
- Which sections a site lists is its own choice. A site lists at least the
  way home.
- A tool that needs the full height of the window (the playground, the AI
  Studio, the layout editor) may keep its own toolbar, as long as the logo,
  the word and the way home stay top left.

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

One line, muted, at the bottom of the window however short the page:
the name, the licence, the contact address and a link to edit the page.
