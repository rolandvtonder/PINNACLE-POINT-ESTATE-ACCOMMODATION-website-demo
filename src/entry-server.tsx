import {renderToString} from 'react-dom/server';
import type {PageId} from './content';
import {page, registry} from './mount';
import './pages/home';
import './pages/stay';
import './pages/gallery';
import './pages/house-rules';
import './pages/explore';
import './pages/reviews';
import './pages/contact';

/** Static HTML for one page, used by scripts/prerender.mjs after the build. */
export function render(id: PageId): string {
  const content = registry.get(id);
  if (!content) throw new Error(`No page registered for "${id}"`);
  return renderToString(page(id, content));
}
