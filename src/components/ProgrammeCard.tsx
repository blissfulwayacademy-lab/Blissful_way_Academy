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
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${programme.accent} scroll-mt-[90px] bg-neutral-900 p-7 transition hover:-translate-y-1 hover:border-amber-400/35 sm:p-9`}
    >
      <div className="mb-16 flex items-start justify-between">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-300">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {programme.eyebrow}
        </span>
      </div>
      <h3 className="max-w-md font-serif text-[1.6rem] leading-[1.2] text-white sm:text-[2.05rem]">
        {programme.title}
      </h3>
      <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-400">{programme.description}</p>
      <ul className="mt-7 space-y-3">
        {programme.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3 text-sm text-neutral-200">
            <span className="rounded-full bg-amber-400/10 p-1 text-amber-300">
              <Check size={12} />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-7 right-8 text-8xl font-serif font-bold text-white/[0.025]">
        {programme.eyebrow.slice(0, 2)}
      </div>
    </article>
  );
}
