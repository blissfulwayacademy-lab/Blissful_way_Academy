import { CtaBand } from '@/components/CtaBand';
import { Hero } from '@/components/Hero';
import { PricingSection } from '@/components/PricingSection';
import { ProgrammeSection } from '@/components/ProgrammeSection';
import { TrustBar } from '@/components/TrustBar';
import { TutorSection } from '@/components/TutorSection';
import type { PlanInterest } from '@/types';

type HomeProps = {
  onBookTrial: () => void;
  onSelectPlan: (plan: PlanInterest) => void;
};

export function Home({ onBookTrial, onSelectPlan }: HomeProps) {
  return (
    <main>
      <Hero onBookTrial={onBookTrial} />

      {/*
        The light band. Everything between the hero and the footer sits on
        cream, and the boundary at each end is a plain background swap on this
        wrapper — no gradient, no fade, so the edge lands on one pixel row.
        Sections inside must not set their own dark ground.
      */}
      <div className="bg-cream">
        <TrustBar />
        <ProgrammeSection />
        <TutorSection />
        <PricingSection onSelectPlan={onSelectPlan} />
        <CtaBand onBookTrial={onBookTrial} />
      </div>
    </main>
  );
}
