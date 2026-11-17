import {Hero} from '../components/Hero';
import {BookLink, Check, d, Kicker, MoreLink} from '../components/ui';
import {houseRules, photos} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

function HouseRules() {
  const ref = useReveals<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero photo={photos.fynbos} focus="50% 50%" {...houseRules.hero}>
        <nav aria-label="Sections on this page" className="mt-10 flex flex-wrap gap-3 md:ml-[clamp(0px,16vw,300px)]">
          {houseRules.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="caps inline-flex min-h-11 items-center border border-white/50 px-5 py-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              {s.title}
            </a>
          ))}
        </nav>
      </Hero>

      {/* The times, set large */}
      <section className="on-paper bg-paper text-ink" aria-labelledby="times-title">
        <div className="mx-auto max-w-[1680px] px-5 py-24 md:px-14 md:py-32">
          <Kicker className="text-sea">At a glance</Kicker>
          <h2 id="times-title" className="display mt-6 text-[clamp(44px,5vw,88px)]" data-reveal>
            Times <span className="it">& access</span>
          </h2>
          <dl className="mt-14 grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
            {houseRules.times.map(([k, v], i) => (
              <div key={k} className="border-b border-ink/15 py-8 pr-6" data-reveal style={d(i * 0.06)}>
                <dt className="caps text-ink/65">{k}</dt>
                <dd className="display mt-2 text-[clamp(28px,2.6vw,44px)] text-sea">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The rules, by moment of the stay */}
      <section className="bg-ink py-24 md:py-32" aria-labelledby="rules-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <h2 id="rules-title" className="display text-[clamp(44px,5vw,88px)]" data-reveal>
            House <span className="it">rules</span>
          </h2>
          <div className="mt-16 border-t border-white/20">
            {houseRules.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="grid scroll-mt-10 gap-6 border-b border-white/20 py-10 md:grid-cols-[80px_1fr_1.6fr] md:gap-8 md:py-14"
              >
                <span className="caps text-white/60">{String(i + 1).padStart(2, '0')}</span>
                <h3 id={`${s.id}-title`} className="display text-[clamp(34px,3.4vw,58px)]" data-reveal>
                  {s.title}
                </h3>
                <ul className="space-y-4">
                  {s.items.map((item, j) => (
                    <li key={item} className="flex gap-4 text-white/85" data-reveal style={d(j * 0.05)}>
                      <Check className="mt-1.5 shrink-0 text-mist" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* What to bring */}
      <section className="bg-sea py-24 md:py-32" aria-labelledby="bring-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <h2 id="bring-title" className="display text-[clamp(44px,5vw,84px)]" data-reveal>
            Worth <span className="it">packing</span>
          </h2>
          <ul className="mt-12 grid grid-cols-1 border-t border-white/25 sm:grid-cols-2 lg:grid-cols-4">
            {houseRules.bring.map((f, i) => (
              <li key={f} className="flex items-center gap-4 border-b border-white/25 py-6 pr-6 text-[18px]" data-reveal style={d(i * 0.05)}>
                <span className="caps text-white/60">0{i + 1}</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-8">
            <BookLink />
            <MoreLink href={to('/contact/')} className="text-white">Directions to the estate</MoreLink>
          </div>
        </div>
      </section>
    </div>
  );
}

mount('house-rules', <HouseRules />);
