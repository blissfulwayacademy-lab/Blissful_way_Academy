import { ArrowRight, Check } from 'lucide-react';
import type { PricingTier } from '@/types';

type PricingCardProps = {
  plan: PricingTier;
  onSelect: () => void;
};

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  /**
   * A tier with no price cannot be bought yet, so it renders as a waitlist.
   *
   * Everything that separates the two states is structural — a dashed rather
   * than solid edge, a quiet status label in place of the 3.4rem price, no
   * ticked checklist. Nothing is greyed out: the obvious way to say "not yet"
   * is to lighten the text, and on cream that lands under 4.5:1. A parent who
   * cannot read the card cannot join the waitlist either.
   */
  const available = Boolean(plan.price);

  return (
    /*
     * The featured card used a gold glow — a translucent gradient plus a wide
     * amber shadow — to lift itself off the charcoal. Neither reads on cream: a
     * glow needs darkness to bloom into. Emphasis is now carried structurally,
     * by a solid 2px gold-deep edge and a raised cream-alt surface against the
     * section's plain cream, so the other two cards sit flat by comparison.
     */
    <div
      className={`relative rounded-3xl p-7 ${
        plan.featured
          ? 'border-2 border-gold-deep bg-cream-alt shadow-xl shadow-ink/10 lg:-mt-4 lg:p-8'
          : available
            ? 'border border-ink-text/15 bg-cream'
            : 'border border-dashed border-ink-text/30 bg-cream'
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-deep px-4 py-1 text-[9px] font-black tracking-[0.18em] text-cream">
          MOST POPULAR
        </div>
      )}
      {/* The featured card's cream-alt ground puts gold-deep at 4.97:1 — over
          the line, but the plan name is the one label worth reading at a
          glance, so it takes ink-text there and gold-deep on the flat cards. */}
      <p className={`text-sm font-semibold ${plan.featured ? 'text-ink-text' : 'text-gold-deep'}`}>
        {plan.name}
      </p>

      {available ? (
        <>
          <div className="mt-6 flex items-end gap-2">
            <span className="font-serif text-[3.4rem] leading-none text-ink-text">
              {plan.price}
            </span>
            <span className="mb-1 text-xs text-ink-muted">/ month</span>
          </div>
          <p className="mt-1 text-xs font-medium text-ink-muted">{plan.detail}</p>
        </>
      ) : (
        /* Holds the vertical space the price block occupies on the live cards,
           so the three tops stay on one line in the grid. */
        <div className="mt-6 flex min-h-[4.75rem] items-start">
          <span className="rounded-full border border-ink-muted/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {plan.status}
          </span>
        </div>
      )}

      <p className="mt-5 min-h-[48px] text-sm leading-6 text-ink-muted">{plan.description}</p>

      {plan.features.length > 0 && (
        <ul className="mt-6 space-y-3 border-t border-ink-text/15 pt-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm text-ink-text">
              <Check size={16} className="mt-0.5 shrink-0 text-gold-deep" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onSelect}
        className={
          plan.featured ? 'button-gold-deep mt-8 w-full' : 'button-outline-light mt-8 w-full'
        }
      >
        {plan.ctaLabel}
        {available && <ArrowRight size={16} />}
      </button>

      {plan.guarantee && (
        <p className="mt-3 text-center text-xs leading-5 text-ink-muted">{plan.guarantee}</p>
      )}
    </div>
  );
}
