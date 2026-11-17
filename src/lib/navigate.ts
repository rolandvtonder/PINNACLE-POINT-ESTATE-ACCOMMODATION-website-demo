/**
 * Page-to-page transitions. Each page is its own HTML file, so moving between
 * them is a real navigation. To keep it feeling like one site, the leaving
 * page wipes three slabs in (ink → mist → paper, like the menu), and the
 * arriving page starts covered and wipes them away.
 *
 * A sessionStorage flag tells the next page it was reached through a wipe;
 * storage can be unavailable, so every access is guarded and the page always
 * works without it.
 */

const KEY = 'bz-wipe';
type Listener = (covered: boolean) => void;
const listeners = new Set<Listener>();

export const WIPE_MS = 820;

// Read once, at load — not inside React, whose dev mode runs initialisers
// twice (the second read would find the flag already cleared).
const arrived = (() => {
  try {
    const v = sessionStorage.getItem(KEY) === '1';
    sessionStorage.removeItem(KEY);
    return v;
  } catch {
    return false;
  }
})();

export const arrivedByWipe = () => arrived;

export function onCover(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function go(href: string, reduced: boolean) {
  if (reduced) {
    window.location.href = href;
    return;
  }
  listeners.forEach((fn) => fn(true));
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage blocked: the next page simply doesn't wipe in */
  }
  window.setTimeout(() => {
    window.location.href = href;
  }, WIPE_MS);
}

/** Same-site page link that should get the wipe (not a hash, new tab, or download). */
export function isWipeLink(a: HTMLAnchorElement, e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname) return false;
  return true;
}
