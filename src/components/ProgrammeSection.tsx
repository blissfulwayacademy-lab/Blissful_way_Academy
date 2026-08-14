import { ProgrammeCard } from '@/components/ProgrammeCard';
import { UliRule } from '@/components/UliRule';
import { IGBO_KICKERS, programmes } from '@/lib/content';

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
        <p className="section-kicker">
          <span lang="ig">{IGBO_KICKERS.programmes}</span>
        </p>
        <h2 className="section-title">
          A richer way to <span className="text-amber-400">grow.</span>
        </h2>
        <UliRule />
        <p className="section-copy">
          Our programmes are designed around the whole child — building a confident sense of identity
          alongside the skills to thrive in school and beyond.
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
    </section>
  );
}
