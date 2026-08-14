import { TutorCard } from '@/components/TutorCard';
import { TRCN_EXPLAINER, tutors } from '@/lib/content';

export function TutorSection() {
  return (
    <section id="our-tutors" className="scroll-mt-[90px] bg-neutral-900/55 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="section-kicker">Meet your guides</p>
            <h2 className="section-title">
              Teachers who <span className="text-amber-400">see</span> your child.
            </h2>
            <p className="mt-4 text-xs leading-6 text-neutral-500">{TRCN_EXPLAINER}</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-400">
            Warm, expert educators who bring energy, patience, and a world of experience to every
            session.
          </p>
        </div>
        {/* A vertical stack rather than a fixed grid, so the section reads the same
            at six tutors as it would at sixteen. */}
        <div className="mt-14 space-y-14 sm:space-y-16 lg:space-y-20">
          {tutors.map((tutor, index) => (
            <TutorCard key={tutor.slug} tutor={tutor} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
