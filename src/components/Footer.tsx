import {useLayoutEffect, useRef} from 'react';
import {brand, footer, pages} from '../content';
import {BookLink, Mark} from './ui';

/**
 * Sizes the single-line wordmark so it spans its parent's content box
 * exactly, at every width, re-fitting once the web font swaps in.
 */
function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const PROBE = 100;
    const fit = () => {
      el.style.fontSize = `${PROBE}px`;
      const styles = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const natural = el.offsetWidth;
      if (natural > 0) el.style.fontSize = `${(PROBE * available) / natural}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return ref;
}

export function Footer() {
  const word = useFitText<HTMLSpanElement>();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink pt-20 pb-28 text-white md:pb-10">
      <div className="mx-auto grid max-w-[1680px] gap-12 px-5 md:grid-cols-[1.3fr_1fr_1fr] md:px-14">
        <div>
          <Mark className="size-9 text-mist" />
          <p className="display mt-5 max-w-[16ch] text-[clamp(30px,3vw,44px)]">
            A private lodge, <span className="it">clifftop views</span>, and room to slow down.
          </p>
          <BookLink tone="mist" className="mt-8" />
        </div>
        <nav aria-label="Footer">
          <p className="caps text-white/55">Pages</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {pages.map((p) => (
              <li key={p.id}>
                <a href={p.href} className="inline-flex min-h-10 items-center text-white/85 transition-colors hover:text-mist">
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="caps text-white/55">Find us</p>
          <address className="mt-3 not-italic leading-relaxed text-white/85">
            {brand.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <ul className="mt-5 space-y-1 text-white/85">
            {brand.phone && (
              <li>
                <a className="hover:text-mist" href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
              </li>
            )}
            {brand.email && (
              <li>
                <a className="hover:text-mist" href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
            )}
            {brand.listingUrl && (
              <li>
                <a className="inline-flex min-h-10 items-center underline decoration-white/30 underline-offset-4 hover:text-mist" href={brand.listingUrl} target="_blank" rel="noopener">
                  See our listing<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1680px] overflow-hidden px-5 md:px-14" aria-hidden>
        <span ref={word} className="display inline-block whitespace-nowrap leading-[0.8] text-white/[0.07]">
          {brand.name}
        </span>
      </div>

      <p className="caps mx-auto mt-6 max-w-[1680px] px-5 text-white/55 md:px-14">
        © {year} {brand.name} · {footer.line}
      </p>
    </footer>
  );
}
