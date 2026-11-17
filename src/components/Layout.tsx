import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {brand, type PageId} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {go, isWipeLink} from '../lib/navigate';
import {lockScroll, scrollToHash, startScroll} from '../lib/scroll';
import {Curtain} from './Curtain';
import {Footer} from './Footer';
import {Menu} from './Menu';
import {BookLink, Mark} from './ui';
import {to} from '../lib/paths';

/**
 * The frame every page shares: wordmark, menu button, the fixed booking
 * button, the menu itself, the page-to-page curtain, the footer and grain.
 */
export function Layout({page, children}: {page: PageId; children: ReactNode}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => startScroll(reduced), [reduced]);

  useEffect(() => {
    lockScroll(open);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    toggle.current?.focus({preventScroll: true});
  }, []);

  // Same-site page links leave through the curtain; in-page hashes glide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        scrollToHash(href);
        return;
      }
      // A link to a section of this same page (e.g. /contact/#enquire on Contact) glides too.
      const url = new URL(a.href, window.location.href);
      if (url.hash && url.origin === window.location.origin && url.pathname === window.location.pathname) {
        e.preventDefault();
        setOpen(false);
        scrollToHash(url.hash);
        return;
      }
      if (!isWipeLink(a, e)) return;
      e.preventDefault();
      setOpen(false);
      go(a.href, reduced);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reduced]);

  return (
    <>
      <a href="#main" className="caps sr-only z-[80] bg-white px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>

      <a
        href={to('/')}
        aria-label={`${brand.name} — home`}
        className="fixed top-5 left-5 z-[55] flex items-center gap-3 text-white mix-blend-difference md:top-7 md:left-14"
      >
        <Mark className="size-7 shrink-0 md:size-8" />
        {/* The full name doesn't fit beside the menu button on phones. */}
        <span className="display text-[15px] tracking-[0.12em] max-[340px]:hidden sm:hidden">{brand.short}</span>
        <span className="display hidden text-[18px] tracking-[0.16em] sm:inline md:text-[21px]">{brand.name}</span>
      </a>

      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        className={`caps fixed top-4 right-5 z-[55] flex min-h-12 items-center gap-3 px-5 py-3 backdrop-blur-md md:gap-4 md:px-6 transition-colors duration-500 md:top-6 md:right-8 ${
          open ? 'bg-ink text-white' : 'bg-ink/55 text-white hover:bg-ink/80'
        }`}
      >
        {open ? 'Close' : 'Menu'}
        <span className={`text-[18px] leading-none transition-transform duration-500 ease-silk ${open ? 'rotate-45' : ''}`} aria-hidden>
          +
        </span>
      </button>

      <BookLink tone={open ? 'mist' : 'light'} className="fixed right-5 bottom-5 z-[55] shadow-[0_10px_40px_rgb(15_29_31/0.25)] md:right-8 md:bottom-7" />

      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />

      <Menu open={open} current={page} onClose={close} />
      <Curtain reduced={reduced} />
      <div className="grain" aria-hidden />
    </>
  );
}
