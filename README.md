# Pinnacle Point Estate website

Free preview site for Pinnacle Point Estate (Nicole): one private holiday lodge on Pinnacle Point Golf Estate, Mossel Bay, let over the summer holidays. No online payments: guests see the free dates and send an enquiry, and she chooses who stays. The live domain will be **pinnaclepointguests.com** (her domains are at Afrihost).

The design follows the Updraft reference: a slow-zoom hero under a big condensed serif headline, three panels that slide in, a three-slab menu, and wipe transitions between pages. It has the same setup as The Breeze Inn: Vite, React, Tailwind 4 and Lenis, with every page as its own HTML file.

## Commands

```bash
npm run dev       # local dev server
npm run build     # images → page heads → site → prerendered HTML in dist/
npm run preview   # serve dist/ at http://localhost:4173
npm run lint      # type-check
```

Upload the contents of `dist/` to her Afrihost hosting (any host with PHP; the calendar uses `availability.php`).

## Where things live

| What | Where |
| --- | --- |
| All copy, units, rules and contact details | `src/content.ts` |
| Page titles, descriptions, structured data, sitemap | `scripts/pages.mjs` |
| Colours and fonts | `src/index.css` (`@theme`) |
| Logo mark | `Mark` in `src/components/ui.tsx` (same drawing as the favicon in `scripts/pages.mjs`) |
| Stand-in illustrations | `public/media/art/*.svg` |
| Her photos (originals) | `media/photos/`, turned into web sizes by `npm run images` |

## SEO

- Every page is prerendered: the full text is in the HTML, not only in JavaScript.
- Each page has its own title, meta description, canonical URL, Open Graph tags and breadcrumb data.
- The home, stay and contact pages carry `LodgingBusiness` structured data (address, geo, check-in/out, amenities).
- `robots.txt` and `sitemap.xml` are regenerated on every build.
- After launch, submit `https://pinnaclepointguests.com/sitemap.xml` in Google Search Console, and link the site from her Google Business Profile.

## To fill in when Nicole replies

Everything below is marked `TODO` in the code. Empty values are simply not shown.

- [ ] **Airbnb listing link**: `brand.bookUrl` and `brand.listingUrl` in `content.ts`. It shows as a secondary "Book on Airbnb" link; the main button is always "Check free dates".
- [ ] **Airbnb calendar export link** (Airbnb → Listing → Availability → Connect calendars → Export calendar): paste it into `ICAL_URL` in `public/availability.php`. The calendar on the Free dates page then shows her booked nights. This needs the PHP hosting at Afrihost; on `npm run preview` the PHP doesn't run, so every date shows as free.
- [ ] **Phone, WhatsApp, email**: `brand` in `content.ts`, plus `PHONE` and `EMAIL` in `scripts/pages.mjs`. The enquiry form needs WhatsApp or email to send.
- [ ] **The lodge**: sleeps, bedrooms, bathrooms, rate and amenities in `lodge` (`content.ts`).
- [ ] **Check-in/out times and house rules**: `houseRules` in `content.ts`, and `checkinTime` / `checkoutTime` in `scripts/pages.mjs`.
- [ ] **Exact location** of the unit: `brand.coords`, plus `geo` in `scripts/pages.mjs`.
- [ ] **Reviews**: score, count and real reviews from her listing (`reviews` in `content.ts`). Never invent these.
- [ ] **Replace the demo photos.** The photos in `media/photos/` are free Unsplash stock photos (unsplash.com/license) used only to show the design. None of them show the real lodge, so swap every one before launch.
- [ ] **Photos** (after the renovation, March 2027): put them in `media/photos/`, run `npm run images`, then change each `src` in `photos` (`content.ts`) from the `.svg` illustration to the photo's web name. Name one `share.jpg` for the WhatsApp/Facebook preview.
- [ ] **Her own words** for the welcome text (`home.intro.body`).
- [ ] **Season wording**: `brand.season`, once she confirms which months she lets.
