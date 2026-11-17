import {useEffect, useRef, type ReactNode} from 'react';
import type {Line, Photo} from '../content';
import {clamp} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {Img, Kicker, Lines} from './ui';

/**
 * A page's opening scene: one photo drifting slowly (in place of the
 * reference's film) under a big condensed headline that mixes upright and
 * italic lines. As you scroll on, the scene blurs, dims and shrinks back —
 * a camera pulling away — which is the hand-off to the page below.
 */
export function Hero({
  photo,
  eyebrow,
  lines,
  body,
  full,
  focus = 'center',
  children,
}: {
  photo: Photo;
  eyebrow: string;
  lines: Line[];
  body: string;
  /** Full-screen (home) or a shorter page opener. */
  full?: boolean;
  /** CSS object-position for the photo. */
  focus?: string;
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      onFrame(() => {
        const el = root.current;
        const s = stage.current;
        if (!el || !s) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < -50) return;
        const p = clamp(-r.top / r.height);
        s.style.transform = `translate3d(0, ${(p * r.height * 0.45).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(4)})`;
        s.style.filter = p > 0.01 ? `blur(${(p * 16).toFixed(1)}px) brightness(${(1 - p * 0.5).toFixed(3)})` : 'none';
      }),
    [],
  );

  return (
    <section
      ref={root}
      className={`relative overflow-hidden bg-ink ${full ? 'h-svh min-h-[640px]' : 'h-[88svh] min-h-[600px]'}`}
      aria-labelledby="page-title"
    >
      <div ref={stage} className="absolute inset-0 origin-center will-change-transform">
        <div className="drift absolute inset-0">
          <Img photo={photo} eager className="h-full w-full object-cover" style={{objectPosition: focus}} />
        </div>
        {/* Two scrims so white type stays readable over bright sky and sea */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(15_29_31/0.72),rgb(15_29_31/0.25)_55%,transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_29_31/0.6),transparent_45%)]" />

        <div className="absolute inset-0 mx-auto flex max-w-[1680px] flex-col px-5 pt-[clamp(104px,15vh,150px)] pb-24 md:px-14">
          <Kicker className="text-white/85">{eyebrow}</Kicker>
          <h1
            id="page-title"
            className={`display mt-6 text-white drop-shadow-[0_4px_30px_rgb(0_0_0/0.35)] ${
              full ? 'text-[clamp(54px,7.8vw,142px)]' : 'text-[clamp(50px,6.6vw,120px)]'
            }`}
          >
            <Lines lines={lines} indentFirst />
          </h1>
          <p className="mt-8 max-w-[34ch] text-[17px] leading-relaxed text-white/90 md:ml-[clamp(0px,16vw,300px)] md:text-[18px]">{body}</p>
          {children}
        </div>
      </div>

      <div className="caps pointer-events-none absolute bottom-7 left-5 flex items-center gap-3 text-white/70 md:left-14" aria-hidden>
        <span className="block h-8 w-px animate-pulse bg-white/60" />
        Scroll
      </div>
    </section>
  );
}
