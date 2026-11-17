import {useState} from 'react';
import {Hero} from '../components/Hero';
import {BookLink, Check, d, Img, Kicker, Lines, MoreLink} from '../components/ui';
import {brand, lodge, photos, stayPage} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

/** The lodge at a glance: a photo viewer, the key facts, amenities and rate. */
function Overview() {
  const [shown, setShown] = useState(0);
  return (
    <section id="lodge" className="on-paper scroll-mt-10 bg-paper text-ink" aria-labelledby="lodge-title">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-12 px-5 py-24 md:px-14 md:py-36 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="min-w-0" data-reveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-fynbos">
            {lodge.photos.map((p, i) => (
              <Img
                key={p.src}
                photo={p}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-silk ${i === shown ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="group" aria-label="Lodge photos">
            {lodge.photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setShown(i)}
                aria-pressed={i === shown}
                aria-label={`Show photo ${i + 1} of ${lodge.photos.length}: ${p.caption}`}
                className={`relative h-16 w-24 shrink-0 overflow-hidden transition-opacity md:h-20 md:w-28 ${i === shown ? 'opacity-100 ring-2 ring-sea ring-offset-2 ring-offset-paper' : 'opacity-60 hover:opacity-100'}`}
              >
                <Img photo={{...p, alt: ''}} sizes="120px" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <Kicker className="text-sea">The whole house</Kicker>
          <h2 id="lodge-title" className="display mt-6 text-[clamp(48px,5.4vw,96px)]" data-reveal>
            <span className="block">{lodge.name[0]}</span>
            <span className="it block">{lodge.name[1]}</span>
          </h2>
          <p className="prose-body mt-6 text-ink/70" data-reveal style={d(0.08)}>
            {lodge.summary}
          </p>

          <dl className="mt-10 grid grid-cols-3 border-y border-ink/15" data-reveal style={d(0.12)}>
            {lodge.specs.map(([k, v]) => (
              <div key={k} className="border-r border-ink/15 py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="caps text-ink/70">{k}</dt>
                <dd className="mt-1 text-[15px] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="caps mt-10 text-ink/70">In the lodge</h3>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {lodge.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3 text-[16px]">
                <Check className="shrink-0 text-sea" />
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-ink/15 pt-8">
            <div>
              {lodge.rate ? (
                <>
                  <p className="caps text-ink/70">From</p>
                  <p className="display text-[56px] leading-none">{lodge.rate}</p>
                </>
              ) : (
                <p className="caps text-ink/70">Rates</p>
              )}
              <p className="mt-2 max-w-[32ch] text-[14px] text-ink/70">{lodge.rateNote}</p>
            </div>
            <BookLink tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stay() {
  const ref = useReveals<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero photo={photos.living} focus="50% 55%" {...stayPage.hero}>
        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-3 md:ml-[clamp(0px,16vw,300px)]">
          {[['#lodge', 'At a glance'], ...lodge.spaces.map((s) => [`#${s.id}`, s.kicker.split('· ')[1]])].map(([href, label]) => (
            <a key={href} href={href} className="caps inline-flex min-h-11 items-center border border-white/50 px-5 py-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
              {label}
            </a>
          ))}
        </nav>
      </Hero>

      <Overview />

      {lodge.spaces.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} className={`scroll-mt-10 ${i % 2 === 0 ? 'bg-ink' : 'bg-fynbos'}`} aria-labelledby={`${s.id}-title`}>
            <div className={`mx-auto grid max-w-[1680px] items-center gap-12 px-5 py-24 md:px-14 md:py-32 lg:grid-cols-2 lg:gap-24 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden" data-reveal>
                <Img photo={s.img} sizes="(min-width: 1024px) 48vw, 100vw" className="h-full w-full object-cover" />
              </div>
              <div>
                <Kicker className="text-mist">{s.kicker}</Kicker>
                <h2 id={`${s.id}-title`} className="display mt-6 text-[clamp(44px,4.8vw,84px)]" data-reveal>
                  <Lines lines={s.title} />
                </h2>
                <p className="prose-body mt-8 text-white/80" data-reveal style={d(0.1)}>
                  {s.body}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-sea py-24 md:py-32" aria-labelledby="every-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <h2 id="every-title" className="display text-[clamp(44px,5vw,84px)]" data-reveal>
            Your stay <span className="it">comes with</span>
          </h2>
          <ul className="mt-12 grid grid-cols-1 border-t border-white/25 sm:grid-cols-2 lg:grid-cols-4">
            {stayPage.everything.map((f, i) => (
              <li key={f} className="flex items-center gap-4 border-b border-white/25 py-6 pr-6 text-[18px]" data-reveal style={d(i * 0.05)}>
                <span className="caps text-white/60">0{i + 1}</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-8">
            <BookLink />
            {brand.bookUrl && (
              <a href={brand.bookUrl} target="_blank" rel="noopener" className="caps inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 text-white">
                {brand.bookLabel}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <MoreLink href={to('/house-rules/')} className="text-white">Check-in times & house rules</MoreLink>
          </div>
        </div>
      </section>
    </div>
  );
}

mount('stay', <Stay />);
