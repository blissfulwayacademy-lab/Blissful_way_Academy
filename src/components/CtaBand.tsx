import { ArrowRight } from 'lucide-react';
import { UliRule } from '@/components/UliRule';
import { IGBO_KICKERS, TRIAL_PRICE } from '@/lib/content';

type CtaBandProps = { onBookTrial: () => void };

export function CtaBand({ onBookTrial }: CtaBandProps) {
  return (
    /*
     * Sits on cream, so the amber blur orb behind the heading is gone — a
     * blurred highlight on a light ground just greys the paper. The band is
     * held by a solid gold-deep edge and the alternate surface instead.
     *
     * The edge is full strength, matching the featured pricing card: cream-alt
     * on cream is only a 1.08:1 step, so the border does all the separating,
     * and at /40 it measured 1.77:1 — effectively invisible.
     */
    <section className="mx-5 mb-20 overflow-hidden rounded-3xl border-2 border-gold-deep bg-cream-alt sm:mx-8 lg:mx-auto lg:mb-28 lg:max-w-7xl">
      <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
        <div className="relative max-w-2xl">
          <p className="section-kicker-light">
            <span lang="ig">{IGBO_KICKERS.cta}</span>
          </p>
          <h2 className="font-serif text-[2.1rem] leading-[1.15] text-ink-text sm:text-[3.4rem]">
            Give them the gift of <span className="text-gold-deep">belonging.</span>
          </h2>
          <UliRule tone="light" />
          <p className="mt-6 max-w-lg text-sm leading-6 text-ink-muted">
            Start with a low-pressure trial and discover what becomes possible when a child feels
            seen, supported, and inspired.
          </p>
          <button onClick={onBookTrial} className="button-gold-deep mt-8">
            Book their {TRIAL_PRICE} trial <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
