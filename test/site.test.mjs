// What the built page must keep, read off dist/ after `npm run build`.
// node:test, no browser: the page is static HTML, so the properties worth
// holding are in the file - the greeting and the four groups, the policy, no
// script, nothing that points at a file that is not there, and every tile
// leaving the page.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(import.meta.dirname, "..", "dist");
const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

test("the page is the greeting and the four groups", () => {
  assert.match(html, /<h1 class="welcome">[\s\S]*Welcome to abap2UI5/);
  for (const id of ["introduction", "try-it", "more", "community"]) {
    assert.match(html, new RegExp(`<section class="group" id="${id}"`), `#${id}`);
  }
  assert.doesNotMatch(html, /<header|class="hero"|<nav/, "no header, no hero, no navigation: this is the home the other sites lead back to");
});

test("the page runs no script, and its policy says so", () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 0, "no <script>");
  assert.doesNotMatch(html, /\son[a-z]+=/i, "an inline event handler");
  assert.doesNotMatch(html, /\sstyle="/i, "an inline style the policy would refuse");
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.ok(csp, "a Content-Security-Policy meta");
  assert.match(csp[1], /script-src 'self'(;|$)/);
  assert.match(csp[1], /default-src 'self'/);
});

test("everything the page loads is in dist/", () => {
  const refs = [...html.matchAll(/\s(?:src|href)="([^"#]+)"/g)].map((m) => m[1]).filter((u) => u.startsWith("/"));
  assert.ok(refs.length >= 4, "the stylesheet, the logo, the icons, the font");
  for (const ref of refs) {
    const file = path.join(DIST, ref.slice(1) || "index.html");
    const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, "index.html") : file;
    assert.ok(fs.existsSync(target), `${ref} is not in dist/`);
  }
  // the font the stylesheet declares
  const css = fs.readFileSync(path.join(DIST, refs.find((r) => r.endsWith(".css")).slice(1)), "utf8");
  for (const m of css.matchAll(/url\("(\/[^"]+)"\)/g)) assert.ok(fs.existsSync(path.join(DIST, m[1].slice(1))), `${m[1]} is not in dist/`);
  // nothing from a CDN: the policy would refuse it anyway
  for (const m of html.matchAll(/\s(?:src)="(https?:[^"]+)"/g)) assert.fail(`loads ${m[1]}`);
  assert.doesNotMatch(html, /rel="stylesheet" href="https?:/);
});

test("every tile leaves the page, to a site of the project or a channel of the community", () => {
  const tiles = [...html.matchAll(/<a class="tile[^"]*" href="([^"]+)"/g)].map((m) => m[1]);
  const opened = [...html.matchAll(/<a class="tile" href="[^"]+" target="_blank" rel="noopener"/g)].length;
  const inside = [...html.matchAll(/<a class="tile inside" href="(https:\/\/abap2ui5-addons\.github\.io\/)">/g)].length;
  assert.equal(inside, 1, "one tile leads to the sister site, in the same tab");
  assert.equal(opened + inside, tiles.length, "every other tile opens in a new tab");
  const row = html.match(/<ul class="links">([\s\S]*?)<\/ul>/);
  assert.ok(row, "the community is a row of links");
  const links = [...row[1].matchAll(/<a href="([^"]+)" target="_blank" rel="noopener"/g)].map((m) => m[1]);
  assert.equal(links.length, 5, "five community links, each in a new tab");
  tiles.push(...links);
  assert.ok(tiles.length >= 12, `${tiles.length} tiles and links`);
  for (const href of tiles) assert.match(href, /^https:\/\//, `${href} stays on the page`);
  const hosts = ["abap2ui5.github.io", "abap2ui5-addons.github.io", "github.com/abap2UI5", "abapgit.slack.com", "linkedin.com/company/abap2ui5", "community.sap.com", "bsky.app"];
  for (const href of tiles) assert.ok(hosts.some((h) => href.includes(h)), `${href} is not one of the project's places`);
});

test("the canonical address is the published one", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/abap2ui5\.github\.io\/">/);
});

test("the page is a signpost, not a manual", () => {
  // a reader scans it: the visible text outside the code sample stays short
  const open = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
  const words = open.trim().split(/\s+/).length;
  assert.ok(words <= 500, `${words} words on the page`);
});
