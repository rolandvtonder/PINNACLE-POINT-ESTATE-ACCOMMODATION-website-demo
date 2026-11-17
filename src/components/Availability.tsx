import {useEffect, useMemo, useState} from 'react';
import {availability} from '../content';
import {Arrow} from './ui';

type Range = {start: string; end: string};
type Status = 'loading' | 'live' | 'offline';

const pad = (n: number) => String(n).padStart(2, '0');
/** Local calendar date as YYYY-MM-DD (no time zones involved). */
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const longDate = new Intl.DateTimeFormat('en-ZA', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
const monthName = new Intl.DateTimeFormat('en-ZA', {month: 'long', year: 'numeric'});

/** Nights already taken, from the Airbnb calendar (via public/availability.php). */
function useBooked() {
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let alive = true;
    fetch(availability.endpoint, {headers: {Accept: 'application/json'}})
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: {connected?: boolean; booked?: Range[]}) => {
        if (!alive) return;
        const nights = new Set<string>();
        for (const {start, end} of data.booked ?? []) {
          for (let d = start; d < end; d = addDays(d, 1)) nights.add(d);
        }
        setBooked(nights);
        setStatus(data.connected ? 'live' : 'offline');
      })
      // No PHP (local preview) or Airbnb not linked yet: every date shows as open.
      .catch(() => alive && setStatus('offline'));
    return () => {
      alive = false;
    };
  }, []);

  return {booked, status};
}

/**
 * The free-dates calendar. Booked nights are struck through; picking an
 * arrival and then a departure fills in the enquiry form. A stay can't run
 * across a booked night, but it may end on the morning someone else arrives.
 */
export function Availability({arrive, leave, onChange}: {arrive: string; leave: string; onChange: (arrive: string, leave: string) => void}) {
  const {booked, status} = useBooked();
  const [offset, setOffset] = useState(0);
  const today = iso(new Date());

  const free = (from: string, to: string) => {
    for (let d = from; d < to; d = addDays(d, 1)) if (booked.has(d)) return false;
    return true;
  };

  const pick = (d: string) => {
    if (!arrive || leave || d <= arrive) onChange(d, '');
    else if (free(arrive, d)) onChange(arrive, d);
    else onChange(d, '');
  };

  const months = useMemo(() => {
    const first = new Date();
    first.setDate(1);
    return Array.from({length: availability.months}, (_, k) => new Date(first.getFullYear(), first.getMonth() + offset + k, 1));
  }, [offset]);

  const choosingLeave = Boolean(arrive && !leave);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="caps text-ink/70" aria-live="polite">
          {status === 'loading' ? 'Checking the calendar…' : choosingLeave ? 'Now choose your departure day' : 'Choose your arrival day'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="grid size-11 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(16, o + 1))}
            aria-label="Next month"
            className="grid size-11 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-white"
          >
            <Arrow />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {months.map((m) => {
          const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
          const lead = (m.getDay() + 6) % 7; // Monday first
          return (
            <section key={iso(m)} aria-label={monthName.format(m)}>
              <h3 className="display text-[28px]">{monthName.format(m)}</h3>
              <div className="mt-3 grid grid-cols-7 text-center" aria-hidden>
                {WEEK.map((w) => (
                  <span key={w} className="caps py-1 text-[11px] text-ink/55">
                    {w}
                  </span>
                ))}
              </div>
              <ul className="grid grid-cols-7 gap-px">
                {Array.from({length: lead}, (_, i) => (
                  <li key={`x${i}`} aria-hidden />
                ))}
                {Array.from({length: days}, (_, i) => {
                  const date = new Date(m.getFullYear(), m.getMonth(), i + 1);
                  const d = iso(date);
                  const past = d < today;
                  const taken = booked.has(d);
                  // A booked night can still be someone's departure morning.
                  const canLeave = choosingLeave && d > arrive && free(arrive, d);
                  const disabled = past || (taken && !canLeave);
                  const isEnd = d === arrive || d === leave;
                  const inRange = arrive && leave && d > arrive && d < leave;
                  const label = `${longDate.format(date)}${taken ? ', booked' : past ? '' : ', free'}${d === arrive ? ', your arrival' : ''}${d === leave ? ', your departure' : ''}`;
                  return (
                    <li key={d}>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => pick(d)}
                        aria-label={label}
                        aria-pressed={isEnd}
                        className={`relative grid aspect-square w-full place-items-center text-[15px] tabular-nums transition-colors ${
                          isEnd
                            ? 'bg-sea text-white'
                            : inRange
                              ? 'bg-mist text-ink'
                              : taken
                                ? 'text-ink/35 line-through'
                                : past
                                  ? 'text-ink/25'
                                  : 'text-ink hover:bg-ink/10'
                        } ${disabled ? 'cursor-not-allowed' : ''}`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink/70">
        <span className="flex items-center gap-2">
          <span className="size-3 border border-ink/30" aria-hidden /> Free
        </span>
        <span className="flex items-center gap-2">
          <span className="text-ink/40 line-through" aria-hidden>
            12
          </span>
          Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 bg-sea" aria-hidden /> Your dates
        </span>
        <span className="basis-full text-[13px] text-ink/55">
          {status === 'live'
            ? 'Synced with our Airbnb calendar.'
            : 'Free dates update automatically from Airbnb once the calendar is connected.'}
        </span>
      </div>
    </div>
  );
}
