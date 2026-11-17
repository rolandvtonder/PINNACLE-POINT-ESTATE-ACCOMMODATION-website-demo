import {useCallback, useEffect, useRef, useState} from 'react';
import {Hero} from '../components/Hero';
import {Arrow, BookLink, d, Img} from '../components/ui';
import {galleryPage, photos} from '../content';
import {useReveals} from '../hooks/useReveals';
import {lockScroll} from '../lib/scroll';
import {mount} from '../mount';

const list = galleryPage.photos;

/** Full-screen viewer on a native <dialog>: focus stays inside, Esc closes. */
function Lightbox({index, onChange, onClose}: {index: number; onChange: (i: number) => void; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = index >= 0;
  const p = open ? list[index] : null;
  const step = useCallback((dir: number) => onChange((index + dir + list.length) % list.length), [index, onChange]);

  useEffect(() => {
    const el = dialog.current!;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    lockScroll(open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
    >
      {p && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
            <p className="caps text-white/75" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')} · {p.caption}
            </p>
            <button type="button" onClick={onClose} className="caps inline-flex min-h-12 items-center gap-3 bg-white px-6 text-ink hover:bg-mist">
              Close <span aria-hidden className="rotate-45 text-[18px]">+</span>
            </button>
          </div>
          <div className="relative min-h-0 flex-1 px-5 pb-6 md:px-24">
            <Img key={p.src} photo={p} sizes="100vw" eager className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center bg-white/15 backdrop-blur-md hover:bg-white/30 md:left-6"
            >
              <Arrow className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center bg-white/15 backdrop-blur-md hover:bg-white/30 md:right-6"
            >
              <Arrow />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Gallery() {
  const ref = useReveals<HTMLDivElement>();
  const [index, setIndex] = useState(-1);
  const close = useCallback(() => setIndex(-1), []);

  return (
    <div ref={ref}>
      <Hero photo={photos.living} focus="50% 50%" {...galleryPage.hero} />

      <section className="on-paper bg-paper px-3 py-16 text-ink md:px-6 md:py-24" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="sr-only">
          All photos
        </h2>
        {/* Masonry by CSS columns; each tile opens the viewer */}
        <ul className="columns-1 gap-3 sm:columns-2 lg:columns-3 md:gap-4">
          {list.map((p, i) => (
            <li key={p.src} className="mb-3 break-inside-avoid md:mb-4" data-reveal style={d((i % 3) * 0.08)}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden bg-sand text-left"
                aria-label={`Open photo: ${p.caption}`}
              >
                <Img
                  photo={p}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.04] ${i % 4 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                />
                <span className="caps absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgb(15_29_31/0.75),transparent)] px-5 pt-12 pb-4 text-white opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  {p.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-16 flex justify-center">
          <BookLink tone="dark" />
        </div>
      </section>

      <Lightbox index={index} onChange={setIndex} onClose={close} />
    </div>
  );
}

mount('gallery', <Gallery />);
