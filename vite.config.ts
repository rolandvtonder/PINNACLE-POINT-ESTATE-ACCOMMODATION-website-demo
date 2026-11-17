import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

// Every page of the site is its own HTML file (a real URL, works on any
// static host). Keep this list in step with src/content.ts → pages.
const pages = ['index', 'stay', 'gallery', 'house-rules', 'explore', 'reviews', 'contact'];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p, resolve(__dirname, p === 'index' ? 'index.html' : `${p}/index.html`)]),
      ),
    },
  },
});
