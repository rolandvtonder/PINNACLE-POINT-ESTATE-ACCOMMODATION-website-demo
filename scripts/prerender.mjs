// After `vite build` (the site) and `vite build --ssr` (the server entry),
// renders every page to static HTML and puts it inside each built page's
// #root, so crawlers and first paint get the real content without running
// any JavaScript. The browser then renders the page fresh on top.
import {readFileSync, rmSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const pages = ['home', 'stay', 'gallery', 'house-rules', 'explore', 'reviews', 'contact'];
const {render} = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);

for (const id of pages) {
  const file = id === 'home' ? 'dist/index.html' : `dist/${id}/index.html`;
  const html = readFileSync(file, 'utf8');
  const marker = '<div id="root"></div>';
  if (!html.includes(marker)) throw new Error(`${file}: no empty #root to fill`);
  writeFileSync(file, html.replace(marker, `<div id="root">${render(id)}</div>`));
  console.log('prerendered', file);
}

rmSync('dist-ssr', {recursive: true, force: true});
