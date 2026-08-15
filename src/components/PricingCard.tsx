import { ArrowRight, Check } from 'lucide-react';
import type { PricingTier } from '@/types';

type PricingCardProps = {
  plan: PricingTier;
  onSelect: () => void;
};

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    /*
     * The featured card used a gold glow — a translucent gradient plus a wide
     * amber shadow — to lift itself off the charcoal. Neither reads on cream: a
     * glow needs darkness to bloom into. Emphasis is now carried structurally,
     * by a solid 2px gold-deep edge and a raised cream-alt surface against the
     * section's plain cream, so the other two cards sit flat by comparison.
     */
    <div
      className={`relative rounded-3xl p-7 ${plan.featured ? 'border-2 border-gold-deep bg-cream-alt shadow-xl shadow-ink/10 lg:-mt-4 lg:p-8' : 'border border-ink-text/15 bg-cream'}`}
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
      <div className="mt-6 flex items-end gap-2">
        <span className="font-serif text-[3.4rem] leading-none text-ink-text">{plan.price}</span>
        <span className="mb-1 text-xs text-ink-muted">/ month</span>
      </div>
      <p className="mt-1 text-xs font-medium text-ink-muted">{plan.detail}</p>
      <p className="mt-5 min-h-[48px] text-sm leading-6 text-ink-muted">{plan.description}</p>
      <ul className="mt-6 space-y-3 border-t border-ink-text/15 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-ink-text">
            <Check size={16} className="mt-0.5 shrink-0 text-gold-deep" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={
          plan.featured ? 'button-gold-deep mt-8 w-full' : 'button-outline-light mt-8 w-full'
        }
      >
        Claim your spot <ArrowRight size={16} />
      </button>
    </div>
  );
}
