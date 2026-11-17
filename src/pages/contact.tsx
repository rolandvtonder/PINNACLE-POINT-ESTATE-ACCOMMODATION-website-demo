import {useState, type FormEvent} from 'react';
import {Availability, iso} from '../components/Availability';
import {Hero} from '../components/Hero';
import {Arrow, d, Kicker} from '../components/ui';
import {brand, contact, photos} from '../content';
import {useReveals} from '../hooks/useReveals';
import {mount} from '../mount';
import {to} from '../lib/paths';

const {lat, lng} = brand.coords;
const bbox = [lng - 0.02, lat - 0.011, lng + 0.02, lat + 0.011].map((n) => n.toFixed(5)).join('%2C');
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const field = 'mt-2 block min-h-12 w-full border border-ink/25 bg-white px-4 py-3 text-[17px] normal-case tracking-normal text-ink outline-none transition-colors focus:border-sea';
const short = new Intl.DateTimeFormat('en-ZA', {day: 'numeric', month: 'short', year: 'numeric'});
const nights = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

/**
 * Enquiries go out through the guest's own WhatsApp or mail app, so the site
 * needs no server and takes no payments: the owner replies and confirms.
 */
function Enquiry({arrive, leave, setDates}: {arrive: string; leave: string; setDates: (a: string, l: string) => void}) {
  const [error, setError] = useState('');
  const today = iso(new Date());

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    if (leave <= arrive) {
      setError('Your departure date needs to be after your arrival date.');
      return;
    }
    setError('');
    const text = [
      `Hi, I'd like to enquire about staying at ${brand.name}.`,
      `Name: ${get('name')}`,
      `Dates: ${short.format(new Date(arrive))} to ${short.format(new Date(leave))} (${nights(arrive, leave)} nights)`,
      `Guests: ${get('guests')}`,
      get('message') && `Message: ${get('message')}`,
    ]
      .filter(Boolean)
      .join('\n');
    if (brand.whatsapp) {
      window.open(`https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    } else if (brand.email) {
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(`Enquiry: ${arrive} to ${leave}`)}&body=${encodeURIComponent(text)}`;
    } else {
      setError('Our contact details are being updated. Please try again soon.');
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2" aria-describedby="enquiry-note">
      <label className="caps text-ink/75">
        Arriving <span aria-hidden>*</span>
        <input name="arrive" type="date" required min={today} value={arrive} onChange={(e) => setDates(e.target.value, leave)} className={field} />
      </label>
      <label className="caps text-ink/75">
        Leaving <span aria-hidden>*</span>
        <input name="leave" type="date" required min={arrive || today} value={leave} onChange={(e) => setDates(arrive, e.target.value)} className={field} />
      </label>
      {arrive && leave && leave > arrive && (
        <p className="caps -mt-2 text-sea sm:col-span-2" aria-live="polite">
          {nights(arrive, leave)} nights
        </p>
      )}
      <label className="caps text-ink/75 sm:col-span-2">
        Your name <span aria-hidden>*</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="caps text-ink/75 sm:col-span-2">
        Guests <span aria-hidden>*</span>
        <input name="guests" type="number" inputMode="numeric" min={1} max={12} required defaultValue={2} className={field} />
      </label>
      <label className="caps text-ink/75 sm:col-span-2">
        Tell us a little about your group
        <textarea name="message" rows={4} className={field} />
      </label>
      {error && (
        <p role="alert" className="text-[16px] text-cliff sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-col items-start gap-4 sm:col-span-2">
        <button type="submit" className="caps group inline-flex min-h-12 items-center gap-3 bg-ink px-7 py-3.5 text-white transition-colors hover:bg-sea">
          Send enquiry
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <p id="enquiry-note" className="text-[14px] text-ink/65">
          Opens {brand.whatsapp ? 'WhatsApp' : 'your email'} with your message ready to send. Nothing is paid online: we reply and confirm with you personally.
        </p>
      </div>
    </form>
  );
}

function Contact() {
  const ref = useReveals<HTMLDivElement>();
  const [arrive, setArrive] = useState('');
  const [leave, setLeave] = useState('');
  const setDates = (a: string, l: string) => {
    setArrive(a);
    setLeave(l);
  };

  return (
    <div ref={ref}>
      <Hero photo={photos.cliffs} focus="50% 60%" {...contact.hero} />

      {/* Free dates + enquiry */}
      <section id="enquire" className="on-paper scroll-mt-10 bg-paper text-ink" aria-labelledby="enquire-title">
        <div className="mx-auto max-w-[1680px] px-5 py-24 md:px-14 md:py-32">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <Kicker className="text-sea">Free dates</Kicker>
              <h2 id="enquire-title" className="display mt-6 text-[clamp(44px,4.6vw,80px)]" data-reveal>
                When would <span className="it">you like to come?</span>
              </h2>
            </div>
            <p className="prose-body text-ink/75" data-reveal style={d(0.08)}>
              Pick your arrival and departure on the calendar, add a few details and send. We let the lodge over the summer holidays and reply to every enquiry personally.
            </p>
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div data-reveal>
              <Availability arrive={arrive} leave={leave} onChange={setDates} />
            </div>
            <div data-reveal style={d(0.1)}>
              <Enquiry arrive={arrive} leave={leave} setDates={setDates} />
              {(brand.phone || brand.email) && (
                <ul className="mt-10 space-y-2 border-t border-ink/15 pt-8">
                  {brand.phone && (
                    <li>
                      <a className="text-[20px] hover:text-sea" href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
                    </li>
                  )}
                  {brand.email && (
                    <li>
                      <a className="text-[20px] hover:text-sea" href={`mailto:${brand.email}`}>{brand.email}</a>
                    </li>
                  )}
                </ul>
              )}
              {brand.bookUrl && (
                <a href={brand.bookUrl} target="_blank" rel="noopener" className="caps mt-8 inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 text-sea">
                  Or book on Airbnb<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Address + map */}
      <section className="bg-ink" aria-labelledby="where-title">
        <div className="mx-auto grid max-w-[1680px] gap-12 px-5 py-24 md:px-14 md:py-32 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div>
            <Kicker className="text-mist">Where we are</Kicker>
            <h2 id="where-title" className="display mt-6 text-[clamp(44px,4.6vw,80px)]" data-reveal>
              Pinnacle Point, <span className="it">Mossel Bay</span>
            </h2>
            <address className="mt-8 not-italic leading-relaxed text-white/80" data-reveal style={d(0.08)}>
              {brand.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <dl className="mt-10 border-t border-white/20">
              {contact.getting.map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-white/20 py-5">
                  <dt className="text-white/75">{k}</dt>
                  <dd className="text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={directions} target="_blank" rel="noopener" className="caps group mt-10 inline-flex min-h-11 items-center gap-3 border-b border-current pb-1 text-mist">
              Get directions
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </div>
          <div className="relative min-h-[380px] overflow-hidden bg-fynbos lg:min-h-[520px]" data-reveal>
            <iframe title="Map showing Pinnacle Point Golf Estate, Mossel Bay" src={mapSrc} loading="lazy" className="absolute inset-0 h-full w-full border-0 grayscale-[35%]" />
          </div>
        </div>
      </section>

      <section className="bg-sea py-24 md:py-32" aria-labelledby="contact-cta">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-end justify-between gap-10 px-5 md:px-14">
          <h2 id="contact-cta" className="display max-w-[14ch] text-[clamp(44px,5vw,88px)]" data-reveal>
            Before <span className="it">you arrive</span>
          </h2>
          <a href={to('/house-rules/')} className="caps group inline-flex min-h-12 items-center gap-3 bg-white px-7 py-3.5 text-ink transition-colors hover:bg-mist">
            Check-in & house rules
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </div>
  );
}

mount('contact', <Contact />);
