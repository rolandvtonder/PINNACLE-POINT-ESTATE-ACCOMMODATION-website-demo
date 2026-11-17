import {Hero} from '../components/Hero';
import {Panels} from '../components/Panels';
import {BookLink, Check, d, Img, Kicker, Lines, MoreLink} from '../components/ui';
import {brand, explore, home, lodge, photos} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

function Home() {
  const ref = useReveals<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero full photo={photos.cliffs} focus="45% 60%" {...home.hero} />
      <Panels />

      {/* Welcome */}
      <section className="on-paper bg-paper text-ink" aria-labelledby="welcome-title">
        <div className="mx-auto grid max-w-[1680px] gap-14 px-5 py-28 md:grid-cols-[1.25fr_1fr] md:px-14 md:py-40">
          <div>
            <Kicker className="text-sea">{home.intro.kicker}</Kicker>
            <h2 id="welcome-title" className="display mt-6 text-[clamp(44px,5.4vw,96px)]" data-reveal>
              <Lines lines={home.intro.lines} />
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-8">
            <p className="prose-body text-ink/80" data-reveal style={d(0.1)}>
              {home.intro.body}
            </p>
            <MoreLink href={to('/stay/')} className="self-start text-sea">See the lodge</MoreLink>
          </div>
        </div>
        <dl className="mx-auto grid max-w-[1680px] grid-cols-2 border-t border-ink/15 md:grid-cols-4">
          {home.facts.map(([k, v], i) => (
            <div
              key={k}
              className="flex flex-col border-ink/15 px-5 py-10 max-md:odd:border-r max-md:[&:nth-child(-n+2)]:border-b md:border-r md:px-14 md:last:border-r-0"
              data-reveal
              style={d(i * 0.08)}
            >
              <dt className="caps order-2 mt-2 text-ink/65">{v}</dt>
              <dd className="display -order-1 text-[clamp(34px,3.4vw,56px)] text-sea">{k}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The lodge */}
      <section className="bg-ink py-28 md:py-36" aria-labelledby="lodge-title">
        <div className="mx-auto grid max-w-[1680px] items-center gap-12 px-5 md:px-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <a href={to('/stay/')} className="group block overflow-hidden" data-reveal aria-label="See the lodge">
            <div className="aspect-[4/3] overflow-hidden bg-fynbos">
              <Img photo={lodge.photos[0]} sizes="(min-width: 1024px) 56vw, 100vw" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.04]" />
            </div>
          </a>
          <div>
            <Kicker className="text-mist">The lodge</Kicker>
            <h2 id="lodge-title" className="display mt-6 text-[clamp(44px,5vw,88px)]" data-reveal>
              The whole house, <span className="it">all yours.</span>
            </h2>
            <p className="prose-body mt-8 text-white/75" data-reveal style={d(0.08)}>
              {lodge.summary}
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {lodge.amenities.slice(0, 6).map((a) => (
                <li key={a} className="flex items-center gap-3 text-[16px] text-white/85">
                  <Check className="shrink-0 text-mist" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <BookLink tone="mist" />
              <MoreLink href={to('/stay/')} className="text-mist">Inside the lodge</MoreLink>
            </div>
          </div>
        </div>
      </section>

      {/* On the doorstep */}
      <section className="relative overflow-hidden bg-fynbos py-28 md:py-36" aria-labelledby="near-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <Kicker className="text-mist">On your doorstep</Kicker>
          <h2 id="near-title" className="display mt-6 max-w-[16ch] text-[clamp(44px,5vw,88px)]" data-reveal>
            Golf, caves <span className="it">and whales</span> from the deck.
          </h2>
          <ul className="mt-14 grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {explore.near.map((p, i) => (
              <li key={p.name} className="flex flex-col gap-4 bg-fynbos py-8 pr-6 sm:p-8" data-reveal style={d(i * 0.06)}>
                <span className="caps text-mist">{p.where}</span>
                <h3 className="display text-[clamp(28px,2.2vw,38px)]">{p.name}</h3>
                <p className="text-[16px] text-white/80">{p.note}</p>
              </li>
            ))}
          </ul>
          <MoreLink href={to('/explore/')} className="mt-12 text-white">Explore Mossel Bay</MoreLink>
        </div>
      </section>

      {/* Reopening note */}
      <section className="bg-cliff py-20 md:py-24" aria-labelledby="reopen-title">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-8 px-5 md:px-14">
          <div data-reveal>
            <h2 id="reopen-title" className="caps text-white/85">{brand.season}</h2>
            <p className="display mt-4 max-w-[22ch] text-[clamp(32px,3.4vw,58px)]">
              Freshly renovated, <span className="it">same view.</span>
            </p>
          </div>
          <MoreLink href={to('/house-rules/')} className="text-white">Check-in & house rules</MoreLink>
        </div>
      </section>

      {/* Closing call to book */}
      <section className="relative isolate overflow-hidden bg-ink py-32 md:py-44" aria-labelledby="book-title">
        <Img photo={photos.fynbos} sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(15_29_31/0.85),rgb(15_29_31/0.3))]" />
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <h2 id="book-title" className="display text-[clamp(52px,7vw,128px)]" data-reveal>
            <Lines lines={home.cta.lines} indentFirst />
          </h2>
          <p className="mt-8 max-w-[40ch] text-[18px] text-white/85" data-reveal>{home.cta.body}</p>
          <div className="mt-10 flex flex-wrap gap-4" data-reveal>
            <BookLink />
            {brand.bookUrl && (
              <a href={brand.bookUrl} target="_blank" rel="noopener" className="caps inline-flex min-h-12 items-center border border-white/50 px-7 py-3.5 transition-colors hover:bg-white/10">
                {brand.bookLabel}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

mount('home', <Home />);
