/*
 * The search box under the greeting - the one script of this site.
 *
 * It searches what the search in the docs' playground searches: every page of
 * the documentation and every sample of the three catalogues, from the index
 * the docs publish at /docs/search-index.json (abap2UI5/docs,
 * scripts/generate-search.mjs). The matcher is search-engine.js beside this
 * file, a copy of scripts/lib/search-engine.js of abap2UI5/docs, as it is
 * there - take a new copy when that one changes, never edit this one.
 *
 * The index is fetched the first time the box is used, never at load: a
 * reader who does not search pays nothing for the box. Nothing is stored.
 *
 * Keys: Ctrl K / Cmd K or "/" go to the box; the arrows move through the
 * results, Enter opens one (the first, if none is chosen), Escape closes the
 * list and, pressed again, clears the field.
 */
import { search, grouped, highlight, loadIndex } from './search-engine.js';

const INDEX = '/docs/search-index.json';
const LIMIT = 60;
const PER_GROUP = 5;

const box = document.getElementById('search');
const input = document.getElementById('search-input');
const list = document.getElementById('search-results');

if (box && input && list) {
  box.hidden = false;
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const key = box.querySelector('.search-key');
  if (key && mac) key.textContent = '⌘ K';

  let entries = null;
  let failed = false;
  let options = [];
  let active = -1;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  /* The parts of `text` the query matched, in <mark> - built as nodes, so no
   * title in the index is ever read as markup. */
  const marked = (text, query) => {
    const f = document.createDocumentFragment();
    for (const [part, hit] of highlight(text, query)) f.append(hit ? el('mark', null, part) : document.createTextNode(part));
    return f;
  };

  const open = (yes) => {
    list.hidden = !yes;
    input.setAttribute('aria-expanded', String(yes));
    if (!yes) setActive(-1);
  };

  const setActive = (i) => {
    if (options[active]) options[active].removeAttribute('aria-selected');
    active = i;
    if (options[active]) {
      options[active].setAttribute('aria-selected', 'true');
      options[active].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', options[active].id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const note = (text, link) => {
    const p = el('p', 'search-note', text);
    if (link) {
      p.append(' ');
      const a = el('a', null, link.text);
      a.href = link.href;
      p.append(a);
    }
    return p;
  };

  const render = () => {
    const query = input.value.trim();
    options = [];
    active = -1;
    input.removeAttribute('aria-activedescendant');
    list.replaceChildren();
    if (!query) { open(false); return; }

    if (failed) {
      list.append(note('The search is not available right now.', { text: 'Search the documentation instead.', href: 'https://abap2ui5.github.io/docs/' }));
      open(true);
      return;
    }
    if (!entries) {
      list.append(note('Loading…'));
      open(true);
      return;
    }

    const hits = search(entries, query, { limit: LIMIT });
    if (!hits.length) {
      list.append(note(`Nothing found for “${query}”.`));
      open(true);
      return;
    }
    if (hits.relaxedTo) list.append(note(`Nothing for “${query}” - showing “${hits.relaxedTo}”.`));
    const shown = hits.relaxedTo || query;

    for (const group of grouped(hits, { perGroup: PER_GROUP })) {
      const head = el('div', 'search-group');
      head.setAttribute('role', 'presentation');
      head.append(el('span', null, group.label));
      if (group.total > group.hits.length) head.append(el('span', 'search-count', `${group.hits.length} of ${group.total}`));
      list.append(head);

      for (const { entry, heading } of group.hits) {
        const a = el('a', 'search-hit');
        a.id = `search-hit-${options.length}`;
        a.setAttribute('role', 'option');
        a.tabIndex = -1;
        a.href = heading && entry.area === 'docs' ? `${entry.url}#${heading.anchor}` : entry.url;
        const title = el('span', 'search-title');
        title.append(marked(entry.title, shown));
        a.append(title);
        const sub = heading && entry.area === 'docs' ? `${entry.group} › ${heading.text}` : entry.code || entry.group;
        if (sub) a.append(el('span', 'search-sub', sub));
        const i = options.length;
        a.addEventListener('mousemove', () => { if (active !== i) setActive(i); });
        options.push(a);
        list.append(a);
      }
    }
    open(true);
  };

  const ensureIndex = () => {
    if (entries || failed) return;
    loadIndex(INDEX).then(
      (index) => { entries = index.entries || []; render(); },
      () => { failed = true; render(); },
    );
  };

  input.addEventListener('focus', () => { ensureIndex(); if (input.value.trim()) render(); });
  input.addEventListener('input', () => { ensureIndex(); render(); });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!options.length) return;
      e.preventDefault();
      if (list.hidden) open(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((active + step + options.length) % options.length);
    } else if (e.key === 'Enter') {
      const target = options[active] || options[0];
      if (!target) return;
      e.preventDefault();
      target.click();
    } else if (e.key === 'Escape') {
      if (!list.hidden) { e.preventDefault(); open(false); } else if (input.value) { e.preventDefault(); input.value = ''; }
    }
  });

  document.addEventListener('keydown', (e) => {
    const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });

  /* A press on a result keeps the focus in the field: Safari does not focus a
   * link it is clicked on, so the list would close under the pointer before
   * the click arrived. */
  list.addEventListener('pointerdown', (e) => e.preventDefault());
  document.addEventListener('pointerdown', (e) => {
    if (!box.contains(e.target)) open(false);
  });
  box.addEventListener('focusout', (e) => {
    if (!box.contains(e.relatedTarget)) open(false);
  });
}
