import {to} from './lib/paths';

/**
 * All copy and facts live here.
 *
 * PREVIEW CONTENT: Pinnacle Point Estate is one private holiday lodge, let
 * during the summer holidays. Guests see the free dates (synced from Airbnb
 * by /public/availability.php) and send an enquiry; there are no online
 * payments, so the owner chooses who stays. Everything marked TODO is a
 * placeholder to confirm with her. Empty values are simply not shown. The
 * illustrations in /public/media/art stand in for photos until the
 * renovation is finished.
 */

export const site = {
  /** The live domain: canonical URLs, sitemap and structured data use it. */
  url: 'https://pinnaclepointguests.com',
};

export const brand = {
  name: 'Pinnacle Point Estate',
  short: 'Pinnacle Point',
  tagline: 'A private holiday lodge · Mossel Bay',
  // TODO: her Airbnb listing link. When set, "Book" buttons offer Airbnb;
  // until then they go to the enquiry form on the contact page.
  bookUrl: '',
  bookLabel: 'Book on Airbnb',
  listingUrl: '',
  address: ['Pinnacle Point Golf Estate', 'Mossel Bay, 6506', 'Western Cape, South Africa'],
  // TODO: confirm the exact lodge location; this is the estate, not the house.
  coords: {lat: -34.1993, lng: 22.0836},
  // TODO: her phone, WhatsApp and email.
  phone: '',
  whatsapp: '',
  email: '',
  socials: [] as {label: string; href: string}[],
  season: 'Newly renovated · Let over the summer holidays',
};

/** Site pages, in menu order. `href` is the page's real URL. */
export const pages = [
  {id: 'home', label: 'Home', href: to('/')},
  {id: 'stay', label: 'The lodge', href: to('/stay/')},
  {id: 'gallery', label: 'Gallery', href: to('/gallery/')},
  {id: 'house-rules', label: 'House rules', href: to('/house-rules/')},
  {id: 'explore', label: 'Explore', href: to('/explore/')},
  {id: 'reviews', label: 'Reviews', href: to('/reviews/')},
  {id: 'contact', label: 'Free dates', href: to('/contact/')},
] as const;
export type PageId = (typeof pages)[number]['id'];

/** A headline line; `i` lines are set in italic. */
export type Line = {t: string; i?: boolean};

/**
 * `src` is either a photo id (ships as `<id>-900.webp` and `<id>-2000.webp`
 * in /public/media) or an illustration file ending in `.svg` from
 * /public/media/art. Swap the illustrations for photos by changing `src`.
 */
export type Photo = {src: string; alt: string; caption?: string};

// DEMO PHOTOS: free stock photos from Unsplash (unsplash.com/license), used
// only to show the design. Swap every one for Nicole's own photos before the
// site goes live: guests must see the real lodge.
const photo = (src: string, alt: string, caption?: string): Photo => ({src, alt, caption});

export const photos = {
  cliffs: photo('cliffs-sunset', 'The sun setting over the sea, seen past sandstone cliffs on the Mossel Bay coast', 'Sunset on the Mossel Bay cliffs'),
  fairway: photo('golf', 'A clifftop golf course with green fairways running down to the ocean', 'Golf by the sea'),
  whale: photo('whale', 'A whale’s tail lifting out of the deep blue ocean', 'Whale season, June to November'),
  cave: photo('coast', 'Waves breaking over the rocks and tidal pools of the Mossel Bay coastline', 'The coastline at Mossel Bay'),
  bedroom: photo('bedroom', 'A bedroom with floor-to-ceiling glass doors looking straight out to sea', 'Bedroom with a sea view'),
  living: photo('dining', 'A bright open-plan living and dining room with glass walls overlooking the beach and ocean', 'Living & dining'),
  lounge: photo('living', 'A lounge at sunset with the balcony doors open to the sea', 'The lounge at sunset'),
  braai: photo('braai', 'Steaks sizzling over the coals on a braai grid', 'Braai time'),
  fynbos: photo('protea', 'King proteas in bloom against the sky', 'Proteas in the fynbos'),
};

export const home = {
  hero: {
    eyebrow: brand.season,
    lines: [{t: 'Sleep on the'}, {t: 'Cliffs.', i: true}, {t: 'Wake to the'}, {t: 'Ocean', i: true}] as Line[],
    body: 'A private holiday lodge on Pinnacle Point Golf Estate, where the fairways run to the cliff edge above the Indian Ocean.',
  },
  panels: [
    {id: 'stay', name: ['The', 'Lodge'] as [string, string], meta: [['Self-catering', 'The whole house'], ['Views', 'Ocean & golf course']], href: to('/stay/'), img: photos.living, tint: '#1f5d66'},
    {id: 'golf', name: ['Clifftop', 'Golf'] as [string, string], meta: [['On the estate', 'Pinnacle Point'], ['Holes', '18 on the cliffs']], href: to('/explore/'), img: photos.fairway, tint: '#4c6a43'},
    {id: 'bay', name: ['Mossel', 'Bay'] as [string, string], meta: [['Beaches', 'Minutes away'], ['Summer', 'Long, warm days']], href: to('/explore/'), img: photos.cave, tint: '#b0623a'},
  ],
  intro: {
    kicker: 'Welcome',
    lines: [{t: 'Your own'}, {t: 'lodge', i: true}, {t: 'above the'}, {t: 'open sea.', i: true}] as Line[],
    // TODO: replace with Nicole's own words about the place.
    body: 'Pinnacle Point Estate is our own home on the cliffs west of Mossel Bay, and over the summer holidays it can be yours. Take your coffee out to the sea air, walk the cliff paths through the fynbos, play a round on one of the most dramatic golf courses in the country, then braai as the sun goes down over the water.',
  },
  facts: [
    ['Private', 'The whole lodge to yourselves'],
    ['Secure', 'A gated golf estate'],
    ['Self-catering', 'Fully equipped kitchen'],
    ['10 min', 'To Mossel Bay town'],
  ] as [string, string][],
  cta: {
    lines: [{t: 'Your summer'}, {t: 'on the cliffs', i: true}, {t: 'starts here.'}] as Line[],
    body: 'See which dates are free and send us an enquiry. We reply personally to every one.',
  },
};

/** The lodge itself. TODO: sleeps, bedrooms, bathrooms, rate and amenities from Nicole. */
export const lodge = {
  name: ['The', 'Lodge'] as [string, string],
  summary: 'A light, quiet family home with an open-plan living room that opens onto a deck facing the sea, a fully equipped kitchen and a braai for long summer evenings.',
  specs: [
    ['Sleeps', 'To be confirmed'],
    ['Bedrooms', 'To be confirmed'],
    ['Bathrooms', 'To be confirmed'],
  ] as [string, string][],
  rate: '',
  rateNote: 'Summer holiday rates on enquiry',
  photos: [photos.living, photos.bedroom, photos.lounge, photos.braai],
  amenities: ['Ocean views', 'Sea-facing deck', 'Fully equipped kitchen', 'Braai area', 'Free Wi-Fi', 'Smart TV', 'Linen & towels', 'Secure parking'],
  spaces: [
    {
      id: 'living',
      kicker: '01 · Living & dining',
      title: [{t: 'Walls of glass,'}, {t: 'the sea inside.', i: true}] as Line[],
      body: 'The open-plan living and dining room looks straight out over the water, so the view comes inside with you. Long breakfasts, lazy afternoons and whale-spotting with a cup of coffee.',
      img: photos.living,
    },
    {
      id: 'sleep',
      kicker: '02 · Bedrooms',
      title: [{t: 'Quiet nights,'}, {t: 'sea-air sleep.', i: true}] as Line[],
      body: 'Calm, uncluttered bedrooms with fresh linen and the sound of the ocean. Freshly renovated for the new season.',
      img: photos.bedroom,
    },
    {
      id: 'braai',
      kicker: '03 · Kitchen & braai',
      title: [{t: 'Make yourselves'}, {t: 'at home.', i: true}] as Line[],
      body: 'A full kitchen for proper holiday cooking, and a braai on the deck for the evenings when the sun sets over the bay.',
      img: photos.braai,
    },
  ],
};

export const stayPage = {
  hero: {
    eyebrow: 'Private · Self-catering · Pinnacle Point',
    lines: [{t: 'A whole house'}, {t: 'on the cliffs,', i: true}, {t: 'just for you.'}] as Line[],
    body: 'No shared walls, no other guests. A freshly renovated home inside a secure golf estate, with a kitchen, a braai and a view worth getting up for.',
  },
  everything: ['Fully equipped kitchen', 'Braai facilities', 'Free Wi-Fi', 'Linen & towels', 'Secure, gated estate', 'Off-street parking', 'Smart TV', 'Golf on the doorstep'],
};

/** The free-dates calendar and enquiry form (contact page). */
export const availability = {
  /** Same-site endpoint that reads the Airbnb calendar. See public/availability.php. */
  endpoint: to('/availability.php'),
  months: 2,
};

export const houseRules = {
  hero: {
    eyebrow: 'Good to know',
    lines: [{t: 'Everything'}, {t: 'you need', i: true}, {t: 'before you arrive.'}] as Line[],
    body: 'Check-in times, estate access and the few rules that keep Pinnacle Point peaceful for everyone.',
  },
  // TODO: confirm every time and rule with Nicole.
  times: [
    ['Check-in', 'From 14:00'],
    ['Check-out', 'By 10:00'],
    ['Quiet hours', '22:00 – 07:00'],
    ['Estate gate', 'Register on arrival'],
  ] as [string, string][],
  sections: [
    {
      id: 'arriving',
      title: 'Arriving',
      items: [
        'Pinnacle Point is a secure estate. We send your name and vehicle registration to the gate before you arrive, so have your ID ready at security.',
        'You’ll get directions and access instructions by message a few days before your stay.',
        'Let us know your expected arrival time, especially if it’s after 18:00.',
      ],
    },
    {
      id: 'during',
      title: 'During your stay',
      items: [
        'No smoking indoors. You’re welcome to smoke outside on the deck.',
        'Please keep noise down after 22:00, out of respect for the neighbours.',
        'No parties or events, and only registered guests may stay overnight.',
        'Pets are not allowed, under estate rules.',
        'Use the braai only in the braai area, and make sure the fire is out before you go in.',
      ],
    },
    {
      id: 'estate',
      title: 'On the estate',
      items: [
        'Keep to the estate speed limit. Walkers, golfers and wildlife share the roads.',
        'Golf carts have right of way at crossings.',
        'Please don’t feed the wildlife, and stay on the marked paths along the cliffs.',
      ],
    },
    {
      id: 'leaving',
      title: 'Leaving',
      items: [
        'Wash up and leave the dishes in the cupboards, and take out your rubbish.',
        'Lock up, close the windows and leave the keys where you found them.',
      ],
    },
  ],
  bring: ['Your ID for the estate gate', 'Golf clubs, if you’re playing', 'A warm top for the evening sea breeze', 'Binoculars in whale season'],
};

export const explore = {
  hero: {
    eyebrow: 'Mossel Bay & the Garden Route',
    lines: [{t: 'Caves, whales'}, {t: '& fairways', i: true}, {t: 'on the cliffs.'}] as Line[],
    body: 'Pinnacle Point is one of the Garden Route’s most dramatic stretches of coast, and Mossel Bay’s beaches, harbour and history are ten minutes away.',
  },
  near: [
    {name: 'Pinnacle Point Golf Club', note: 'Eighteen holes along the cliff edge, with carries over ravines and the ocean on almost every hole.', where: 'On the estate'},
    {name: 'The Pinnacle Point caves', note: 'Some of the world’s most important archaeological sites for early modern humans. Book a guided tour with Point of Human Origins.', where: 'Below the estate'},
    {name: 'Cliff paths & fynbos', note: 'Walk the estate paths through coastal fynbos, with views over the sea and the bay.', where: 'Walking distance'},
    {name: 'Whale watching', note: 'Southern right and humpback whales pass close to shore in season. Keep an eye on the water from the deck.', where: 'June – November'},
  ],
  far: [
    {name: 'St Blaize Trail', note: 'A spectacular coastal hiking trail from the Cape St Blaize lighthouse and cave along the cliffs towards Pinnacle Point.', where: 'Starts in town'},
    {name: 'Dias Museum Complex', note: 'A life-size replica of Bartolomeu Dias’s caravel, a shell museum and the Post Office Tree.', where: 'Mossel Bay'},
    {name: 'Santos & Diaz beaches', note: 'Calm, swimmable north-facing beaches, and the long stretch of Diaz Beach for walking.', where: '10 – 15 min'},
    {name: 'Seal Island boat trips', note: 'Boat trips from the harbour out to the seal colony, often with dolphins along the way.', where: 'Mossel Bay harbour'},
    {name: 'Botlierskop & Gondwana', note: 'Private game reserves for game drives, close enough for a day out.', where: 'Day trip'},
    {name: 'George & the Garden Route', note: 'George Airport, Wilderness, Knysna and the rest of the Garden Route lie just up the N2.', where: 'From 40 min'},
  ],
};

export const galleryPage = {
  hero: {
    eyebrow: 'Gallery',
    lines: [{t: 'A look'}, {t: 'around', i: true}, {t: 'Pinnacle Point.'}] as Line[],
    body: 'New photos of the renovated lodge arrive after the building work. Until then, here’s the coast you’ll wake up to.',
  },
  photos: [photos.cliffs, photos.living, photos.fairway, photos.bedroom, photos.whale, photos.lounge, photos.cave, photos.braai, photos.fynbos],
};

export type Review = {who: string; when: string; rating: number; text: string};

export const reviews = {
  hero: {
    eyebrow: 'Guest reviews',
    lines: [{t: 'What our'}, {t: 'guests', i: true}, {t: 'say.'}] as Line[],
    body: 'Real reviews from guests who stayed with us.',
  },
  // TODO: the overall score, count and reviews from her listing. Never invent these.
  score: 0,
  count: 0,
  items: [] as Review[],
};

export const contact = {
  hero: {
    eyebrow: 'Free dates & enquiries',
    lines: [{t: 'Pick your'}, {t: 'dates,', i: true}, {t: 'we’ll do the rest.'}] as Line[],
    body: 'See which summer dates are free, then send us your dates. We reply personally, and confirm every booking ourselves.',
  },
  getting: [
    ['From George Airport', 'About 40 min on the N2'],
    ['From Mossel Bay town', 'About 10 min'],
    ['From Cape Town', 'About 4 hours on the N2'],
  ] as [string, string][],
};

export const footer = {
  line: 'Clifftop accommodation on the Garden Route.',
};
