import {useEffect, useState, type CSSProperties} from 'react';
import {brand} from '../content';
import {arrivedByWipe, onCover} from '../lib/navigate';
import {Mark} from './ui';

type State = 'idle' | 'in' | 'out';

/**
 * Three slabs (ink, mist, paper) that cover the screen between pages:
 * they wipe in from the right when you leave a page and wipe off to the left
 * when the next one arrives, so moving through the site reads as one film.
 */
export function Curtain({reduced}: {reduced: boolean}) {
  const [arrived] = useState(() => !reduced && arrivedByWipe());
  const [state, setState] = useState<State>(arrived ? 'in' : 'idle');

  // Arriving under the curtain: let the first frame paint, then wipe it away.
  useEffect(() => {
    if (!arrived) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setState('out'));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [arrived]);

  useEffect(() => {
    if (state !== 'out') return;
    const t = window.setTimeout(() => setState('idle'), 1100);
    return () => window.clearTimeout(t);
  }, [state]);

  useEffect(() => onCover(() => setState('in')), []);

  // Coming back with the browser's back button restores a frozen page; clear the curtain.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setState('idle');
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const pos = {idle: 'translate-x-[104%] transition-none', in: 'translate-x-0', out: '-translate-x-[104%]'}[state];
  const delay = (k: number): CSSProperties => ({transitionDelay: `${state === 'out' ? (2 - k) * 0.08 : k * 0.09}s`});
  const slab = `absolute inset-0 transition-transform duration-[720ms] ease-wipe ${pos}`;

  return (
    <div aria-hidden className={`fixed inset-0 z-[70] overflow-hidden ${state === 'idle' ? 'pointer-events-none invisible' : ''}`}>
      <div className={`${slab} bg-ink`} style={delay(0)} />
      <div className={`${slab} bg-mist`} style={delay(1)} />
      <div className={`${slab} grid place-items-center bg-paper text-ink`} style={delay(2)}>
        <div className="flex flex-col items-center gap-3">
          <Mark className="size-10 text-sea" />
          <span className="display px-6 text-center text-[28px] tracking-[0.18em]">{brand.name}</span>
        </div>
      </div>
    </div>
  );
}
