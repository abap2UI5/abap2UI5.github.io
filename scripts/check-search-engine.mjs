#!/usr/bin/env node
/*
 * check-search-engine - public/search-engine.js is abap2UI5/docs'
 * scripts/lib/search-engine.js, byte for byte.
 *
 * The matcher behind the search box of /search/ is maintained over there,
 * where its ranking rules are documented and pinned (test/search.test.mjs);
 * this file and abap2UI5/browser-playground's src/shell/search-engine.mjs are
 * copies. Kept "in step by hand" they drifted - this one by a comment, the
 * playground's by whole features - so the copy is compared with the source
 * on docs' main:
 *
 *   identical            ok
 *   different            exit 1, everywhere - copy the file again:
 *                        curl -fsSL <url> -o public/search-engine.js
 *   could not reach it   a warning and exit 0 on a laptop, exit 1 under CI
 *                        (`CI` set) - a check that verified nothing must not
 *                        turn a run green
 *
 *   node scripts/check-search-engine.mjs   (npm run check:engine, inside npm run check)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const COPY = "public/search-engine.js";
export const SOURCE_URL = "https://raw.githubusercontent.com/abap2UI5/docs/main/scripts/lib/search-engine.js";

/** "same", "different" or "unreachable" (with `why`). */
export async function compare({ fetchFn = globalThis.fetch, copy = fs.readFileSync(path.join(ROOT, COPY), "utf8") } = {}) {
  let source;
  try {
    const res = await fetchFn(SOURCE_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    source = await res.text();
  } catch (err) {
    return { verdict: "unreachable", why: err.message };
  }
  return { verdict: source === copy ? "same" : "different" };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { verdict, why } = await compare();
  if (verdict === "same") {
    console.log(`${COPY} is identical to ${SOURCE_URL} - OK`);
  } else if (verdict === "different") {
    console.error(`${COPY} differs from ${SOURCE_URL}.`);
    console.error("The matcher is maintained in abap2UI5/docs; change it there and copy it here unchanged:");
    console.error(`  curl -fsSL ${SOURCE_URL} -o ${COPY}`);
    process.exit(1);
  } else if (process.env.CI) {
    console.error(`could not reach ${SOURCE_URL} (${why}) - under CI that is a failure, not a pass: nothing was compared.`);
    process.exit(1);
  } else {
    console.warn(`WARNING: could not reach ${SOURCE_URL} (${why}) - ${COPY} was NOT compared with its source.`);
  }
}
