import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { ClassroomPreview } from '@/components/ClassroomPreview';
import { COMBINED_YEARS_EXPERIENCE, TRIAL_PRICE, programmes } from '@/lib/content';

type HeroProps = { onBookTrial: () => void };

export function Hero({ onBookTrial }: HeroProps) {
  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl scroll-mt-[90px] px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28 lg:pt-28"
    >
      <div className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="relative grid items-center gap-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-12">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
            <Sparkles size={13} /> The future of rooted learning
          </div>
          <h1 className="font-serif text-[2.9rem] leading-[1.12] tracking-[-0.012em] text-white sm:text-[3.4rem] lg:text-[4.2rem]">
            Where <span className="text-amber-400">culture</span> meets
            <br className="hidden sm:block" /> <span className="italic">curiosity.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg">
            Empowering diaspora children with native{' '}
            <span className="font-medium text-amber-300">Igbo mastery</span> and advanced{' '}
            <span className="font-medium text-amber-300">mathematical thinking</span> through
            joyful, live online learning.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={onBookTrial} className="button-gold">
              Book a {TRIAL_PRICE} trial session <ArrowRight size={17} />
            </button>
            <a href={`#${programmes[0].slug}`} className="button-outline">
              Explore curriculum <ChevronDown size={16} />
            </a>
          </div>
          {/* Replaced four invented parent avatars with a figure summed from the
              real tutor roster, so the social proof here is verifiable. */}
          <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-neutral-300">
            <Sparkles size={15} className="shrink-0 text-amber-400" />
            <span>
              <strong className="font-semibold text-white">
                {COMBINED_YEARS_EXPERIENCE} years
              </strong>{' '}
              of combined classroom experience
            </span>
          </div>
        </div>
        <ClassroomPreview />
      </div>
    </section>
  );
}
