import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {home} from '../content';
import {Arrow, Img} from './ui';

/**
 * Three tall panels slide in from the right one after another — the stay,
 * the breakfast, the beach — each a door to its own page.
 */
export function Panels() {
  const root = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      {threshold: 0.2},
    );
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} aria-labelledby="panels-title" className="relative bg-ink">
      <h2 id="panels-title" className="sr-only">
        At Pinnacle Point Estate
      </h2>
      <div className="grid h-svh min-h-[640px] grid-cols-3 gap-[3px] overflow-hidden max-md:h-auto max-md:grid-cols-1">
        {home.panels.map((b, i) => (
          <article
            key={b.id}
            className={`group relative overflow-hidden transition-transform duration-[1100ms] ease-wipe max-md:h-[78svh] max-md:min-h-[480px] ${
              shown ? 'translate-x-0' : 'translate-x-[calc(100%_+_100vw)]'
            }`}
            style={{transitionDelay: `${0.12 + i * 0.16}s`, background: b.tint} as CSSProperties}
          >
            <Img
              photo={b.img}
              sizes="(min-width: 768px) 34vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 opacity-45 mix-blend-multiply" style={{background: b.tint}} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_29_31/0.7),transparent_45%,rgb(15_29_31/0.55))]" />
            <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
              <div>
                <h3 className="display text-[clamp(38px,3.6vw,64px)] text-white">
                  <span className="block">{b.name[0]}</span>
                  <span className="it block">{b.name[1]}</span>
                </h3>
                <dl className={`mt-6 space-y-3 transition-opacity delay-[1400ms] duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`}>
                  {b.meta.map(([k, v]) => (
                    <div key={k}>
                      <dt className="caps text-white/70">{k}</dt>
                      <dd className="caps text-[13px] text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <a href={b.href} className="caps inline-flex min-h-11 items-center gap-3 self-start border-b border-white/60 pb-1 text-white after:absolute after:inset-0">
                Discover {b.name.join(' ').toLowerCase()}
                <Arrow className="transition-transform duration-300 ease-silk group-hover:translate-x-1" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
