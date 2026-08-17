import { Mail } from 'lucide-react';
import { ProgrammeCard } from '@/components/ProgrammeCard';
import { UliRule } from '@/components/UliRule';
import { IGBO_KICKERS, PROGRAMME_FOOTNOTE, programmes } from '@/lib/content';

/**
 * The section as a whole answers to the first programme's slug, so that anchor
 * lands on the section intro rather than partway down the grid. Every other
 * programme carries its own id on its card.
 *
 * Deriving both from `slug` means adding or reordering programmes can never
 * leave a nav link pointing at nothing, which the old `index === 1` check did.
 */
const sectionId = programmes[0].slug;

export function ProgrammeSection() {
  return (
    <section
      id={sectionId}
      className="mx-auto max-w-7xl scroll-mt-[90px] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="max-w-2xl">
        <p className="section-kicker-light">
          <span lang="ig">{IGBO_KICKERS.programmes}</span>
        </p>
        <h2 className="section-title-light">
          A richer way to <span className="text-gold-deep">grow.</span>
        </h2>
        <UliRule tone="light" />
        <p className="section-copy-light">
          Our programmes are designed around the whole child — building a confident sense of
          identity alongside the skills to thrive in school and beyond.
        </p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {programmes.map((programme) => (
          <ProgrammeCard
            key={programme.slug}
            programme={programme}
            anchorId={programme.slug === sectionId ? undefined : programme.slug}
          />
        ))}
      </div>
      {/* Spans the pair because it is true of both programmes. Centred and
          ruled off so it reads as a closing note on the section rather than a
          stray bullet belonging to the card above it. */}
      <p className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-gold-deep/20 bg-gold-deep/5 px-6 py-4 text-center text-sm leading-6 text-ink-text">
        <Mail size={16} strokeWidth={1.75} className="hidden shrink-0 text-gold-deep sm:block" />
        {PROGRAMME_FOOTNOTE}
      </p>
    </section>
  );
}
