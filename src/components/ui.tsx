import type {CSSProperties, ReactNode} from 'react';
import type {Line, Photo} from '../content';
import {media, srcSet} from '../lib/math';
import {to} from '../lib/paths';

/**
 * A responsive image. Photos ship at 900px and 2000px wide; illustrations
 * (`.svg`, the stand-ins until the renovation photos arrive) are one file.
 * Lazy unless `eager`.
 */
export function Img({
  photo,
  sizes = '100vw',
  eager,
  className = '',
  style,
}: {
  photo: Photo;
  sizes?: string;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const isArt = photo.src.endsWith('.svg');
  return (
    <img
      src={isArt ? `${import.meta.env.BASE_URL}media/art/${photo.src}` : media(photo.src, 2000)}
      srcSet={isArt ? undefined : srcSet(photo.src)}
      sizes={isArt ? undefined : sizes}
      alt={photo.alt}
      width={isArt ? 1600 : undefined}
      height={isArt ? 1000 : undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      className={className}
      style={style}
    />
  );
}

/** Headline lines from content; italic lines are data, not markup. */
export function Lines({lines, indentFirst}: {lines: Line[]; indentFirst?: boolean}) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={l.t + i} className={`block ${l.i ? 'it' : ''} ${indentFirst && i === 0 ? 'pl-[1.2em]' : ''}`}>
          {l.t}
        </span>
      ))}
    </>
  );
}

export function Arrow({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Star({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
    </svg>
  );
}

/**
 * The Pinnacle Point mark: the pinnacle rock on the cliffs, a low sun and
 * the sea line beneath. Drawn in one stroke weight so it reads at favicon size.
 */
export function Mark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 22.5 11.5 6.5l4 8 3-4.5 9.5 12.5" />
      <circle cx="24" cy="7.5" r="2.4" />
      <path d="M4 27c3-2 6-2 9 0s6 2 9 0 4.5-1.6 6-1.2" />
    </svg>
  );
}

/**
 * The owner chooses who stays, so the primary action is always the free-dates
 * calendar and enquiry form, not instant booking. Airbnb is offered beside it.
 */
export const bookHref = to('/contact/#enquire');

/** The one primary action on every page. */
export function BookLink({
  children = 'Check free dates',
  tone = 'light',
  className = '',
}: {
  children?: ReactNode;
  tone?: 'light' | 'dark' | 'mist';
  className?: string;
}) {
  const tones = {
    light: 'bg-white text-ink hover:bg-mist',
    dark: 'bg-ink text-white hover:bg-sea',
    mist: 'bg-mist text-ink hover:bg-white',
  };
  return (
    <a
      href={bookHref}
      className={`caps group inline-flex min-h-12 items-center gap-3 px-7 py-3.5 transition-colors duration-300 ${tones[tone]} ${className}`}
    >
      {children}
      <Arrow className="transition-transform duration-300 ease-silk group-hover:translate-x-1" />
    </a>
  );
}

/** A text link with an arrow, for moving to another page. */
export function MoreLink({href, children, className = ''}: {href: string; children: ReactNode; className?: string}) {
  return (
    <a href={href} className={`caps group inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 ${className}`}>
      {children}
      <Arrow className="transition-transform duration-300 ease-silk group-hover:translate-x-1" />
    </a>
  );
}

export function Kicker({children, className = ''}: {children: ReactNode; className?: string}) {
  return (
    <p className={`caps flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

/** Stagger delay for a `[data-reveal]` element. */
export const d = (seconds: number) => ({'--d': `${seconds}s`}) as CSSProperties;
