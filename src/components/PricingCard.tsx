import { ArrowRight, Check } from 'lucide-react';
import type { PricingTier } from '@/types';

type PricingCardProps = {
  plan: PricingTier;
  onSelect: () => void;
};

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-3xl border p-7 ${plan.featured ? 'border-amber-400/70 bg-gradient-to-b from-amber-400/10 to-neutral-900 shadow-2xl shadow-amber-950/20 lg:-mt-4 lg:p-8' : 'border-white/10 bg-neutral-900'}`}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-[9px] font-black tracking-[0.18em] text-black">
          MOST POPULAR
        </div>
      )}
      <p className="text-sm font-semibold text-amber-300">{plan.name}</p>
      <div className="mt-6 flex items-end gap-2">
        <span className="font-serif text-5xl text-white">{plan.price}</span>
        <span className="mb-1 text-xs text-neutral-500">/ month</span>
      </div>
      <p className="mt-1 text-xs font-medium text-neutral-400">{plan.detail}</p>
      <p className="mt-5 min-h-[48px] text-sm leading-6 text-neutral-400">{plan.description}</p>
      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-neutral-200">
            <Check size={16} className="mt-0.5 shrink-0 text-amber-400" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={plan.featured ? 'button-gold mt-8 w-full' : 'button-outline mt-8 w-full'}
      >
        Claim your spot <ArrowRight size={16} />
      </button>
    </div>
  );
}
