/**
 * The site's single decorative motif.
 *
 * Uli is the Igbo curvilinear tradition of body and wall painting: thin, flowing,
 * deliberately asymmetric strokes punctuated by dots. The path below is drawn as
 * one uneven line — it rises, dips, and lifts again, ending higher and thinner
 * than it began — rather than an arc a plotter would produce. The dot at the left
 * terminal is uli's dot-and-line vocabulary.
 *
 * Purely decorative, so it is hidden from assistive technology. Alignment is
 * the caller's business, and the only variant is the ground it is drawn on:
 * `gold` reads at 8:1 on ink but collapses to 2.2:1 on cream, so the light
 * sections pass `tone="light"` and get `gold-deep`. Everything else is fixed so
 * the motif reads identically everywhere it appears.
 */
type UliRuleProps = {
  /** Which half of the page this instance sits on. Defaults to the dark ground. */
  tone?: 'dark' | 'light';
};

export function UliRule({ tone = 'dark' }: UliRuleProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="120"
      height="18"
      viewBox="0 0 120 18"
      fill="none"
      className={`mt-6 block ${tone === 'light' ? 'text-gold-deep' : 'text-gold/80'}`}
    >
      <circle cx="3.4" cy="12.2" r="2.5" fill="currentColor" />
      <path
        d="M9.2 11.9c10.8-6.1 21.3-7.7 32.6-5 11.6 2.8 18.4 8.3 30.1 7.7 12.7-.7 22.2-7.2 31.7-10 5.6-1.7 10.8-2 14.8-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
