/**
 * A site path with the deploy base in front, so the same code works on the
 * real domain (base "/") and in the GitHub Pages demo (base
 * "/PINNACLE-POINT-ESTATE-ACCOMMODATION-website-demo/"). Always write
 * internal links as `to('/stay/')`, never a bare "/stay/".
 */
export const to = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
