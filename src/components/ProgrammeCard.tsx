import { useRef, useState, type KeyboardEvent } from 'react';
import { Award, Check } from 'lucide-react';
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
  const { icon: Icon, outcomes } = programme;

  /*
   * One band at a time, never all of them.
   *
   * Twelve-week outcomes for the Igbo card's four age bands is twenty lines.
   * Shown together they bury the card, and a parent only ever has a child in
   * one band. Inactive panels are rendered and hidden rather than dropped, so
   * every tab's `aria-controls` points at an element that exists.
   */
  const [activeBand, setActiveBand] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (index: number) => `${programme.slug}-band-${index}`;
  const panelId = (index: number) => `${programme.slug}-band-${index}-panel`;

  /*
   * Only the selected tab is in the page's tab order, so role="tab" promises
   * the arrows will reach the other one. Wraps at both ends, per the pattern.
   */
  const moveBand = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (activeBand + step + outcomes.bands.length) % outcomes.bands.length;
    setActiveBand(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <article
      id={anchorId}
      className={`card-lift group relative overflow-hidden rounded-3xl border border-ink-text/10 bg-gradient-to-br ${programme.accent} scroll-mt-[90px] bg-cream-alt p-7 transition hover:-translate-y-1 hover:border-gold-deep/40 sm:p-9`}
    >
      <div className="mb-10 flex items-start justify-between">
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
      <p className="mt-5 max-w-lg text-sm font-semibold leading-6 text-ink-text">
        {outcomes.intro}
      </p>

      {/*
        Below `sm`, a native select. Four tabs reading '4-6' through '13-16'
        measure about 250px against the 224px a 320px phone leaves inside this
        card, and the card clips its overflow — the fourth tab would silently
        lose its right-hand end. A select cannot outgrow its container, and the
        OS renders the list full-screen at any width.

        Both controls are always in the DOM and swapped by media query alone.
        Whichever one is hidden is `display: none`, so it takes no tab stop and
        the parent only ever meets one control.
      */}
      <label className="mt-6 block sm:hidden">
        <span className="sr-only">Age band</span>
        <select
          value={activeBand}
          onChange={(event) => setActiveBand(Number(event.target.value))}
          /* Full-strength border for the same reason `.button-outline-light`
             carries one: this edge *is* the control's boundary, and gold-deep
             at any alpha lands under the 3:1 floor for one. */
          className="w-full rounded-2xl border border-gold-deep bg-cream px-4 py-3 text-sm font-semibold text-ink-text outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
        >
          {outcomes.bands.map((band, index) => (
            <option key={band.label} value={index}>
              Ages {band.label}
            </option>
          ))}
        </select>
      </label>

      <div
        role="tablist"
        aria-label={`Age band — ${programme.title}`}
        className="mt-6 hidden gap-1 rounded-full border border-ink-text/10 bg-cream p-1 sm:inline-flex"
      >
        {outcomes.bands.map((band, index) => {
          const selected = index === activeBand;
          return (
            <button
              key={band.label}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              /* Short enough to fit four across; named in full for a screen
                 reader, which WCAG allows because '13-16' is still in there. */
              aria-label={`Ages ${band.label}`}
              id={tabId(index)}
              aria-selected={selected}
              aria-controls={panelId(index)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveBand(index)}
              onKeyDown={moveBand}
              className={`rounded-full px-3.5 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep ${
                selected
                  ? 'bg-gold-deep text-cream'
                  : 'text-ink-muted hover:bg-gold-deep/10 hover:text-ink-text'
              }`}
            >
              {band.label}
            </button>
          );
        })}
      </div>

      {outcomes.bands.map((band, index) => (
        <div
          key={band.label}
          role="tabpanel"
          id={panelId(index)}
          aria-labelledby={tabId(index)}
          hidden={index !== activeBand}
          className="mt-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep">
            {band.lead ?? outcomes.lead}
          </p>
          {/* Held clear of the watermark in the bottom-right corner. */}
          <ul className="mt-4 max-w-md space-y-3">
            {band.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-text">
                <span className="mt-1 shrink-0 rounded-full bg-gold-deep/10 p-1 text-gold-deep">
                  <Check size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          {band.note && (
            <p className="relative mt-5 flex max-w-md items-center gap-2.5 rounded-xl border border-gold-deep/25 bg-gold-deep/10 px-4 py-3 text-sm leading-6 text-ink-text">
              <Award size={16} strokeWidth={1.75} className="shrink-0 text-gold-deep" />
              {band.note}
            </p>
          )}
        </div>
      ))}
      {/* The watermark has to climb from 2.5% to 6% to stay equally faint:
          light-on-dark at low alpha carries further than dark-on-light. */}
      <div className="absolute bottom-7 right-8 text-8xl font-serif font-bold text-ink-text/[0.06]">
        {programme.eyebrow.slice(0, 2)}
      </div>
    </article>
  );
}
