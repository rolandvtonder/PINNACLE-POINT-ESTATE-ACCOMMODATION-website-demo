import {StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {Layout} from './components/Layout';
import type {PageId} from './content';
import './index.css';

/**
 * Every page's entry calls this with its own content.
 *
 * In the browser it renders the page. During the build's prerender step
 * (scripts/prerender.mjs) there is no document, so it only records the page,
 * and the server entry turns it into static HTML. That way each page ships
 * with its real text in the HTML, for search engines and a fast first paint.
 */
export const registry = new Map<PageId, ReactNode>();

export const page = (id: PageId, content: ReactNode) => (
  <StrictMode>
    <Layout page={id}>{content}</Layout>
  </StrictMode>
);

export function mount(id: PageId, content: ReactNode) {
  if (typeof document === 'undefined') {
    registry.set(id, content);
    return;
  }
  // Scroll-driven scenes depend on position; start each page at the top.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // The prerendered markup is replaced by a fresh client render rather than
  // hydrated: the curtain and motion settings depend on the visitor's browser.
  createRoot(document.getElementById('root')!).render(page(id, content));
}
