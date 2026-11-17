import {Hero} from '../components/Hero';
import {BookLink, d, Kicker, MoreLink, Star} from '../components/ui';
import {brand, photos, reviews} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

function Stars({n, className = ''}: {n: number; className?: string}) {
  return (
    <span className={`flex ${className}`} aria-label={`${n} out of 5`} role="img">
      {Array.from({length: 5}, (_, i) => (
        <Star key={i} className={i < Math.round(n) ? '' : 'opacity-25'} />
      ))}
    </span>
  );
}

function Reviews() {
  const ref = useReveals<HTMLDivElement>();
  const has = reviews.items.length > 0;
  return (
    <div ref={ref}>
      <Hero photo={photos.lounge} focus="60% 50%" {...reviews.hero} />

      {reviews.score > 0 && (
        <section className="on-paper bg-paper text-ink" aria-labelledby="score-title">
          <div className="mx-auto px-5 py-24 md:px-14 md:py-36 max-w-[1680px]" data-reveal>
            <h2 id="score-title" className="caps text-sea">Overall rating</h2>
            <p className="display mt-4 text-[clamp(140px,16vw,280px)] leading-[0.8] text-ink">{reviews.score.toFixed(1)}</p>
            <div className="mt-6 flex items-center gap-3">
              <Stars n={reviews.score} className="text-cliff" />
              <span className="caps text-ink/70">From {reviews.count} reviews</span>
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink py-24 md:py-36" aria-labelledby="said-title">
        <div className="mx-auto max-w-[1680px] px-5 md:px-14">
          <Kicker className="text-mist">From the guest book</Kicker>
          <h2 id="said-title" className="display mt-6 text-[clamp(48px,5.4vw,96px)]" data-reveal>
            What guests <span className="it">tell us</span>
          </h2>

          {has ? (
            <ul className="mt-16 grid gap-px bg-white/15 md:grid-cols-2">
              {reviews.items.map((r, i) => (
                <li key={r.who + r.when} className="flex flex-col justify-between gap-10 bg-ink p-8 md:p-12" data-reveal style={d((i % 2) * 0.1)}>
                  <div>
                    <Stars n={r.rating} className="text-sand" />
                    <p className="display mt-6 text-[clamp(26px,2.3vw,38px)] leading-[1.05] normal-case">{r.text}</p>
                  </div>
                  <p className="caps text-white/70">
                    {r.who} · {r.when}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            // Empty state: no invented reviews, ever. This shows until real ones are added.
            <div className="mt-16 grid gap-10 border-t border-white/20 pt-12 md:grid-cols-[1.2fr_1fr] md:gap-20" data-reveal>
              <p className="display text-[clamp(30px,3vw,52px)] normal-case leading-[1.05]">
                We&rsquo;re renovating, and the <span className="it">first reviews</span> of the new-look lodge will appear here after the summer season.
              </p>
              <p className="prose-body self-end text-white/75">
                Stayed with us before on Airbnb? Thank you. Your reviews there help other guests find us.
              </p>
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center gap-8">
            <BookLink />
            {brand.listingUrl && (
              <a href={brand.listingUrl} target="_blank" rel="noopener" className="caps inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 text-mist">
                Read all reviews on our listing<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-sea py-20 md:py-28" aria-label="Next">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-8 px-5 md:px-14">
          <p className="display text-[clamp(36px,4vw,68px)]">
            Stayed with us? <span className="it">Thank you.</span>
          </p>
          <MoreLink href={to('/gallery/')} className="text-white">Look around Pinnacle Point</MoreLink>
        </div>
      </section>
    </div>
  );
}

mount('reviews', <Reviews />);
