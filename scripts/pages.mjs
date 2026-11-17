// Writes every page's HTML entry file from one template, plus robots.txt and
// sitemap.xml, so the <head> (SEO tags, structured data, fonts, favicon)
// stays consistent across the site. Runs as part of `npm run build`, or on
// its own with `npm run pages`.
//
// Keep the facts below in step with src/content.ts (brand).
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';

const SITE = 'https://pinnaclepointguests.com';
// Deploy base: '/' on the real domain; `--base=/repo-name/` for the GitHub Pages demo.
const BASE = process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? '/';
const NAME = 'Pinnacle Point Estate';
const INK = '#0f1d1f';

// TODO: when Nicole's details arrive, fill these in; empty values are left out.
const PHONE = '';
const EMAIL = '';
// The share picture: made by scripts/images.mjs from media/photos/share.jpg.
const OG_IMAGE = existsSync('public/media/share.jpg') ? '/media/share.jpg' : '';

const pages = [
  {slug: 'index', name: 'Home', hero: 'cliffs-sunset', title: 'Pinnacle Point Estate | Private Holiday Lodge in Mossel Bay', desc: 'A private self-catering holiday lodge on Pinnacle Point Golf Estate, Mossel Bay. Clifftop ocean views, a secure estate and the Garden Route on your doorstep.'},
  {slug: 'stay', name: 'The lodge', hero: 'dining', title: 'The Lodge | Self-Catering Holiday Home at Pinnacle Point, Mossel Bay', desc: 'A freshly renovated private holiday home on Pinnacle Point Golf Estate: the whole house to yourselves, with a full kitchen, braai, Wi-Fi and ocean views.'},
  {slug: 'gallery', name: 'Gallery', hero: 'dining', title: 'Gallery | Pinnacle Point Estate, Mossel Bay', desc: 'A look around Pinnacle Point Estate and the clifftop coast of Mossel Bay on the Garden Route.'},
  {slug: 'house-rules', name: 'House rules', hero: 'protea', title: 'House Rules & Check-in Times | Pinnacle Point Estate', desc: 'Check-in and check-out times, estate gate access and house rules for your stay at Pinnacle Point Estate, Mossel Bay.'},
  {slug: 'explore', name: 'Explore', hero: 'coast', title: 'Things to Do in Mossel Bay & Pinnacle Point | Pinnacle Point Estate', desc: 'Golf at Pinnacle Point, the Pinnacle Point caves, whale watching, the St Blaize Trail, Mossel Bay beaches and Garden Route day trips.'},
  {slug: 'reviews', name: 'Reviews', hero: 'living', title: 'Guest Reviews | Pinnacle Point Estate, Mossel Bay', desc: 'What guests say about their stay at Pinnacle Point Estate, a private holiday lodge in Mossel Bay.'},
  {slug: 'contact', name: 'Free dates', hero: 'cliffs-sunset', title: 'Free Dates & Enquiries | Pinnacle Point Estate, Mossel Bay', desc: 'Check which summer holiday dates are free at Pinnacle Point Estate and send an enquiry. Directions from George Airport and Cape Town.'},
];

const url = (slug) => (slug === 'index' ? `${SITE}/` : `${SITE}/${slug}/`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const clean = (o) => JSON.parse(JSON.stringify(o, (_, v) => (v === '' ? undefined : v)));

const lodging = clean({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': `${SITE}/#lodging`,
  name: NAME,
  description: pages[0].desc,
  url: `${SITE}/`,
  telephone: PHONE,
  email: EMAIL,
  image: OG_IMAGE && `${SITE}${OG_IMAGE}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pinnacle Point Golf Estate',
    addressLocality: 'Mossel Bay',
    addressRegion: 'Western Cape',
    postalCode: '6506',
    addressCountry: 'ZA',
  },
  geo: {'@type': 'GeoCoordinates', latitude: -34.1993, longitude: 22.0836},
  checkinTime: '14:00',
  checkoutTime: '10:00',
  petsAllowed: false,
  amenityFeature: ['Self-catering kitchen', 'Braai facilities', 'Free Wi-Fi', 'Secure parking', 'Ocean views', 'Gated security estate'].map((n) => ({
    '@type': 'LocationFeatureSpecification',
    name: n,
    value: true,
  })),
  containedInPlace: {'@type': 'Place', name: 'Pinnacle Point Golf Estate, Mossel Bay'},
});

const website = {'@context': 'https://schema.org', '@type': 'WebSite', name: NAME, url: `${SITE}/`, inLanguage: 'en-ZA'};

const crumbs = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {'@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/`},
    ...(p.slug === 'index' ? [] : [{'@type': 'ListItem', position: 2, name: p.name, item: url(p.slug)}]),
  ],
});

const favicon = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%230f1d1f'/><g fill='none' stroke='%23d3e0d6' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 21.5 11.5 8l3.5 7 2.6-3.9 8.4 10.4'/><circle cx='23.5' cy='8.5' r='2'/><path d='M5 25.5c2.8-1.8 5.6-1.8 8.4 0s5.6 1.8 8.4 0 4.2-1.4 5.2-1'/></g></svg>`;

const ld = (o) => `    <script type="application/ld+json">${JSON.stringify(o)}</script>`;

for (const p of pages) {
  const schema = p.slug === 'index' ? [website, lodging, crumbs(p)] : p.slug === 'contact' || p.slug === 'stay' ? [lodging, crumbs(p)] : [crumbs(p)];
  const html = `<!doctype html>
<html lang="en-ZA">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="${INK}" />
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.desc)}" />
    <link rel="canonical" href="${url(p.slug)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="geo.region" content="ZA-WC" />
    <meta name="geo.placename" content="Mossel Bay" />
    <meta name="geo.position" content="-34.1993;22.0836" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${NAME}" />
    <meta property="og:locale" content="en_ZA" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.desc)}" />
    <meta property="og:url" content="${url(p.slug)}" />
${OG_IMAGE ? `    <meta property="og:image" content="${SITE}${OG_IMAGE}" />\n` : ''}    <meta name="twitter:card" content="${OG_IMAGE ? 'summary_large_image' : 'summary'}" />
    <link rel="icon" href="${favicon}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Condensed:ital,wght@0,400..700;1,400..700&family=Karla:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="preload" as="image" imagesrcset="${BASE}media/${p.hero}-900.webp 900w, ${BASE}media/${p.hero}-2000.webp 2000w" imagesizes="100vw" fetchpriority="high" />
    <noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
${schema.map(ld).join('\n')}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/${p.slug === 'index' ? 'home' : p.slug}.tsx"></script>
  </body>
</html>
`;
  const file = p.slug === 'index' ? 'index.html' : `${p.slug}/index.html`;
  if (p.slug !== 'index') mkdirSync(p.slug, {recursive: true});
  writeFileSync(file, html);
  console.log('wrote', file);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${url(p.slug)}</loc><lastmod>${today}</lastmod><priority>${p.slug === 'index' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`,
);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('wrote public/sitemap.xml, public/robots.txt');
