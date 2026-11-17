export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Builds a public media URL for a photo id at a given width. */
export const media = (id: string, w: 900 | 2000 = 2000) => `${import.meta.env.BASE_URL}media/${id}-${w}.webp`;

/** srcset for a photo id — every photo ships at 900px and 2000px wide. */
export const srcSet = (id: string) => `${media(id, 900)} 900w, ${media(id, 2000)} 2000w`;
