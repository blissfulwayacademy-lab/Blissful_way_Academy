import { ArrowRight } from 'lucide-react';
import { TRIAL_PRICE } from '@/lib/content';

type CtaBandProps = { onBookTrial: () => void };

export function CtaBand({ onBookTrial }: CtaBandProps) {
  return (
    <section className="mx-5 mb-20 overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/15 via-neutral-900 to-neutral-900 sm:mx-8 lg:mx-auto lg:mb-28 lg:max-w-7xl">
      <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="section-kicker">A meaningful first step</p>
          <h2 className="font-serif text-3xl leading-tight text-white sm:text-5xl">
            Give them the gift of <span className="text-amber-400">belonging.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-neutral-300">
            Start with a low-pressure trial and discover what becomes possible when a child feels
            seen, supported, and inspired.
          </p>
          <button onClick={onBookTrial} className="button-gold mt-8">
            Book their {TRIAL_PRICE} trial <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
