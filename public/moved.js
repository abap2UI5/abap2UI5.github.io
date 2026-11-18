// The addresses that moved when their repositories were renamed (2026-11-17).
// GitHub Pages does not redirect a project site whose repository was renamed:
// the old path is simply gone, and every request under it reaches the 404
// page of this site - the organisation's root site answers for every path no
// project site claims. That page loads this script, which sends the reader
// to the same page under the new address: the rest of the path, the query
// (the playground's ?src= links) and the fragment (shared code, essay
// sections) are kept. A path that matches nothing stays on the 404 page.
//
// A site that moves again, or a new rename, is one more line here.
export const MOVED = [
  ["/insights", "/docs-insights"],
  ["/why", "/docs-manager"],
  ["/test-docs", "/docs-manager"],
  ["/playground", "/browser-playground"],
  ["/layout-editor", "/browser-layout-editor"],
];

// The new address of a path, or null: "/why" and "/why/x" move, "/whyx" does not.
export function movedTo(pathname) {
  for (const [from, to] of MOVED) {
    if (pathname === from || pathname.startsWith(from + "/")) {
      return to + (pathname.slice(from.length) || "/");
    }
  }
  return null;
}

if (typeof location !== "undefined") {
  const target = movedTo(location.pathname);
  if (target) location.replace(target + location.search + location.hash);
}
