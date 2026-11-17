import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {brand, pages, type PageId} from '../content';

/**
 * The menu: three slabs wipe in from the right one after another
 * (ink, sea-mist, paper); the paper one stays and holds the pages. Hovering
 * an item makes it shimmer like light on water — an SVG turbulence +
 * displacement filter whose strength and phase are animated per frame.
 */
export function Menu({open, current, onClose}: {open: boolean; current: PageId; onClose: () => void}) {
  const [hover, setHover] = useState(-1);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const first = useRef<HTMLAnchorElement>(null);

  // Animate the shimmer only while something is hovered.
  useEffect(() => {
    if (hover < 0) return;
    let raf = 0;
    let t = 0;
    let amp = 0;
    const loop = () => {
      t += 0.016;
      amp = Math.min(1, amp + 0.08);
      turb.current?.setAttribute('baseFrequency', `${(0.012 + Math.sin(t * 2.1) * 0.004).toFixed(4)} ${(0.06 + Math.cos(t * 1.7) * 0.02).toFixed(4)}`);
      turb.current?.setAttribute('seed', String(Math.floor(t * 12) % 50));
      disp.current?.setAttribute('scale', (amp * 9).toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hover]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Move focus into the menu once the paper slab has arrived.
    const t = window.setTimeout(() => first.current?.focus({preventScroll: true}), 420);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      setHover(-1);
    };
  }, [open, onClose]);

  const slab = (extra: string) =>
    `absolute inset-y-0 right-0 w-[min(36vw,500px)] max-md:w-full transition-transform duration-[800ms] ease-wipe ${extra} ${
      open ? 'translate-x-0' : 'translate-x-[104%]'
    }`;
  // Open: ink → mist → paper, staggered. Close: the reverse, faster.
  const delay = (k: number): CSSProperties => ({transitionDelay: `${open ? k * 0.09 : (2 - k) * 0.06}s`});

  return (
    <div id="site-menu" inert={!open} className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <svg className="absolute size-0" aria-hidden>
        <filter id="shimmer" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Click-away: dims the page behind the menu */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-ink/40 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className={slab('bg-ink')} style={delay(0)} />
      <div className={slab('bg-mist')} style={delay(1)} />
      <nav
        className={slab('on-paper flex flex-col justify-between overflow-y-auto bg-paper px-8 pt-24 pb-28 text-ink md:px-10')}
        style={delay(2)}
        aria-label="Main menu"
      >
        <ul onMouseLeave={() => setHover(-1)}>
          {pages.map((p, i) => {
            const here = p.id === current;
            return (
              <li
                key={p.id}
                className={`transition-[opacity,transform] duration-700 ease-silk ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{transitionDelay: open ? `${0.42 + i * 0.06}s` : '0s'} as CSSProperties}
              >
                <a
                  ref={i === 0 ? first : undefined}
                  href={p.href}
                  aria-current={here ? 'page' : undefined}
                  onMouseEnter={() => setHover(i)}
                  onFocus={(e) => {
                    // Shimmer for keyboard focus only, not the focus we set on open.
                    if (e.currentTarget.matches(':focus-visible')) setHover(i);
                  }}
                  onClick={
                    here
                      ? (e) => {
                          e.preventDefault();
                          onClose();
                        }
                      : undefined
                  }
                  className={`display relative inline-flex min-h-11 items-center py-0.5 text-[clamp(34px,3.1vw,48px)] transition-opacity duration-300 ${
                    hover >= 0 && hover !== i ? 'opacity-35' : 'opacity-100'
                  } ${here ? 'it text-sea' : ''}`}
                  style={{filter: hover === i ? 'url(#shimmer)' : 'none'}}
                >
                  {p.label}
                  <sup className="caps absolute -right-7 top-2 text-[10px] tracking-normal text-ink/55 not-italic">0{i + 1}</sup>
                </a>
              </li>
            );
          })}
        </ul>
        <div className={`mt-10 transition-opacity delay-700 duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}>
          <p className="caps text-ink/55">Find us</p>
          <address className="caps mt-1 not-italic text-ink/80">{brand.address.slice(0, 2).join(' · ')}</address>
        </div>
      </nav>
    </div>
  );
}
