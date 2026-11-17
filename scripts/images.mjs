/**
 * Turns every photo in media/photos/ into the web sizes the site uses:
 * public/media/<name>-900.webp and <name>-2000.webp. A photo's web name is its
 * file name, lower-cased with dashes, so media/photos/Ocean Suite 1.jpg
 * becomes "ocean-suite-1". Use that name as `src` in src/content.ts.
 *
 * A photo called share.jpg (or share.png / share.webp) also becomes
 * public/media/share.jpg at 1200 × 630: the picture WhatsApp and Facebook show
 * when the site is shared. scripts/pages.mjs picks it up automatically.
 *
 * Runs before every build. Unchanged photos are skipped, and an empty folder
 * is fine.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'media/photos';
const OUT = 'public/media';
const TYPES = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;

const webName = (file) =>
  path.basename(file).replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fresh = (out, src) => fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

fs.mkdirSync(SRC, {recursive: true});
fs.mkdirSync(OUT, {recursive: true});

const files = fs.readdirSync(SRC).filter((f) => TYPES.test(f)).sort();
const seen = new Set();
let made = 0;

for (const file of files) {
  const name = webName(file);
  const src = path.join(SRC, file);
  if (seen.has(name)) {
    console.warn(`Skipped ${file}: another photo is already called "${name}".`);
    continue;
  }
  seen.add(name);
  try {
    if (name === 'share') {
      const out = path.join(OUT, 'share.jpg');
      if (!fresh(out, src)) {
        await sharp(src).rotate().resize(1200, 630, {fit: 'cover', position: 'attention'}).jpeg({quality: 82, mozjpeg: true}).toFile(out);
        made++;
      }
      continue;
    }
    for (const w of [900, 2000]) {
      const out = path.join(OUT, `${name}-${w}.webp`);
      if (fresh(out, src)) continue;
      await sharp(src).rotate().resize({width: w, withoutEnlargement: true}).webp({quality: w === 900 ? 74 : 80}).toFile(out);
      made++;
    }
  } catch (e) {
    // One unreadable file shouldn't stop the site from building.
    console.warn(`Skipped ${file}: ${e.message}`);
  }
}

console.log(`${seen.size} photos in ${SRC} → ${OUT} (${made} files new or changed)`);
