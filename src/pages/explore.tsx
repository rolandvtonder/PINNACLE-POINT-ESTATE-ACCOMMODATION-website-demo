import {Hero} from '../components/Hero';
import {BookLink, d, Img, Kicker, MoreLink} from '../components/ui';
import {explore, photos} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

type Place = {name: string; note: string; where: string};

/** An editorial list: numbered, big condensed names, a note and how far. */
function PlaceList({items, start = 1, dark}: {items: Place[]; start?: number; dark?: boolean}) {
  const rule = dark ? 'border-white/20' : 'border-ink/15';
  const muted = dark ? 'text-white/70' : 'text-ink/65';
  return (
    <ol className={`border-t ${rule}`}>
      {items.map((p, i) => (
        <li
          key={p.name}
          className={`grid gap-3 border-b py-8 md:grid-cols-[80px_1.2fr_1fr_180px] md:items-baseline md:gap-8 md:py-10 ${rule}`}
          data-reveal
          style={d(i * 0.05)}
        >
          <span className={`caps ${muted}`}>{String(start + i).padStart(2, '0')}</span>
          <h3 className="display text-[clamp(34px,3.4vw,58px)]">{p.name}</h3>
          <p className={`max-w-[44ch] ${dark ? 'text-white/80' : 'text-ink/80'}`}>{p.note}</p>
          <p className={`caps md:text-right ${dark ? 'text-mist' : 'text-sea'}`}>{p.where}</p>
        </li>
      ))}
    </ol>
  );
}

function Explore() {
  const ref = useReveals<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero photo={photos.cave} focus="50% 50%" {...explore.hero} />

      <section className="on-paper bg-paper py-24 text-ink md:py-36" aria-labelledby="near-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <Kicker className="text-sea">On the estate</Kicker>
              <h2 id="near-title" className="display mt-6 text-[clamp(48px,5.6vw,100px)]" data-reveal>
                On <span className="it">the cliffs</span>
              </h2>
            </div>
            <p className="prose-body text-ink/75" data-reveal style={d(0.1)}>
              Pinnacle Point Golf Estate stretches along the cliffs west of Mossel Bay. Some of the best things to do here are a short walk from your door.
            </p>
          </div>
          <div className="mt-16">
            <PlaceList items={explore.near} />
          </div>
        </div>
      </section>

      {/* A breath between the lists */}
      <section className="relative h-[70svh] min-h-[420px] overflow-hidden" aria-label="Whale season">
        <Img photo={photos.whale} sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_29_31/0.75),transparent_55%)]" />
        <p className="display absolute bottom-10 left-5 max-w-[18ch] text-[clamp(36px,4.4vw,76px)] md:left-14" data-reveal>
          Whales <span className="it">pass close to shore</span> from June to November.
        </p>
      </section>

      <section className="bg-ink py-24 md:py-36" aria-labelledby="far-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <Kicker className="text-mist">Further afield</Kicker>
          <h2 id="far-title" className="display mt-6 text-[clamp(48px,5.6vw,100px)]" data-reveal>
            Mossel Bay <span className="it">& beyond</span>
          </h2>
          <div className="mt-16">
            <PlaceList items={explore.far} start={explore.near.length + 1} dark />
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-8">
            <BookLink />
            <MoreLink href={to('/contact/')} className="text-mist">How to find us</MoreLink>
          </div>
        </div>
      </section>
    </div>
  );
}

mount('explore', <Explore />);
