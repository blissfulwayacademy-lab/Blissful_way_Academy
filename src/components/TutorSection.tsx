import { TutorCard } from '@/components/TutorCard';
import { UliRule } from '@/components/UliRule';
import { IGBO_KICKERS, TRCN_EXPLAINER, tutors } from '@/lib/content';

export function TutorSection() {
  return (
    // Stays on plain cream rather than the alternate surface: the gold-deep
    // kicker and the "watch introduction" links here are small text, and they
    // hold 5.38:1 on cream against 4.97:1 on cream-alt.
    <section
      id="our-tutors"
      className="scroll-mt-[90px] border-y border-ink-text/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="section-kicker-light">
              <span lang="ig">{IGBO_KICKERS.tutors}</span>
            </p>
            <h2 className="section-title-light">
              Teachers who <span className="text-gold-deep">see</span> your child.
            </h2>
            <UliRule tone="light" />
            <p className="mt-6 text-xs leading-6 text-ink-muted">{TRCN_EXPLAINER}</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink-muted">
            Warm, expert educators who bring energy, patience, and a world of experience to every
            session.
          </p>
        </div>
        {/* A vertical stack rather than a fixed grid, so the section reads the same
            at six tutors as it would at sixteen.

            Stacked layouts get MORE separation than the lg one, not less. Below
            lg every card is a full-width column, so one card's badges land
            directly above the next card's photo; at 56px — only twice the 28px
            gap inside a card — the two read as one unit. 96px puts the seam
            well clear of any internal gap. At lg each card is a single
            horizontal row and is already self-evidently one unit, so 80px
            there is ample. */}
        <div className="mt-14 space-y-24 lg:space-y-20">
          {tutors.map((tutor, index) => (
            <TutorCard key={tutor.slug} tutor={tutor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
