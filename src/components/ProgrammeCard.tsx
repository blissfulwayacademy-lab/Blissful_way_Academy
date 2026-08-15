import { Check } from 'lucide-react';
import type { Programme } from '@/types';

type ProgrammeCardProps = {
  programme: Programme;
  /**
   * Anchor id to render on the card, or undefined when the enclosing section
   * already answers to this programme's slug.
   */
  anchorId?: string;
};

export function ProgrammeCard({ programme, anchorId }: ProgrammeCardProps) {
  const { icon: Icon } = programme;

  return (
    <article
      id={anchorId}
      className={`card-lift group relative overflow-hidden rounded-3xl border border-ink-text/10 bg-gradient-to-br ${programme.accent} scroll-mt-[90px] bg-cream-alt p-7 transition hover:-translate-y-1 hover:border-gold-deep/40 sm:p-9`}
    >
      <div className="mb-16 flex items-start justify-between">
        <div className="rounded-2xl border border-gold-deep/25 bg-gold-deep/10 p-3 text-gold-deep">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
          {programme.eyebrow}
        </span>
      </div>
      <h3 className="max-w-md font-serif text-[1.6rem] leading-[1.2] text-ink-text sm:text-[2.05rem]">
        {programme.title}
      </h3>
      <p className="mt-4 max-w-lg text-sm leading-6 text-ink-muted">{programme.description}</p>
      <ul className="mt-7 space-y-3">
        {programme.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3 text-sm text-ink-text">
            <span className="rounded-full bg-gold-deep/10 p-1 text-gold-deep">
              <Check size={12} />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
      {/* The watermark has to climb from 2.5% to 6% to stay equally faint:
          light-on-dark at low alpha carries further than dark-on-light. */}
      <div className="absolute bottom-7 right-8 text-8xl font-serif font-bold text-ink-text/[0.06]">
        {programme.eyebrow.slice(0, 2)}
      </div>
    </article>
  );
}
