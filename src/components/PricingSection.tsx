import { PricingCard } from '@/components/PricingCard';
import { pricing } from '@/lib/content';
import type { PlanInterest } from '@/types';

type PricingSectionProps = {
  /** Receives the tier the parent clicked, recorded as `plan_interest`. */
  onSelectPlan: (plan: PlanInterest) => void;
};

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl scroll-mt-[90px] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="text-center">
        <p className="section-kicker">Simple, transparent tuition</p>
        <h2 className="section-title">
          Invest in their <span className="text-amber-400">becoming.</span>
        </h2>
        <p className="mx-auto section-copy">
          Choose the rhythm that fits your family. Every plan includes caring teachers and a
          learning path made for your child.
        </p>
      </div>
      <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
        {pricing.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            onSelect={() => onSelectPlan(plan.planInterest)}
          />
        ))}
      </div>
    </section>
  );
}
