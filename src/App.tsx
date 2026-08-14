import { useCallback, useState } from 'react';
import { BookingModal } from '@/components/BookingModal';
import { CtaBand } from '@/components/CtaBand';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PricingSection } from '@/components/PricingSection';
import { ProgrammeSection } from '@/components/ProgrammeSection';
import { TrustBar } from '@/components/TrustBar';
import { TutorSection } from '@/components/TutorSection';
import type { PlanInterest } from '@/types';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [planInterest, setPlanInterest] = useState<PlanInterest>('trial');

  // Records which call to action opened the modal. The pricing cards pass their
  // own tier; every other trigger is a plain trial request.
  const openBooking = useCallback((plan: PlanInterest = 'trial') => {
    setPlanInterest(plan);
    setModalOpen(true);
  }, []);

  // Stable identity so the dialog's focus-management effect does not tear down
  // and re-run (stealing focus) on every render of App.
  const closeBooking = useCallback(() => setModalOpen(false), []);

  const openTrial = useCallback(() => openBooking(), [openBooking]);

  return (
    <div className="min-h-screen overflow-hidden bg-neutral-950 text-white selection:bg-amber-400 selection:text-black">
      <Header onBookTrial={openTrial} />

      <main>
        <Hero onBookTrial={openTrial} />
        <TrustBar />
        <ProgrammeSection />
        <TutorSection />
        <PricingSection onSelectPlan={openBooking} />
        <CtaBand onBookTrial={openTrial} />
      </main>

      <Footer />
      <BookingModal open={modalOpen} onClose={closeBooking} planInterest={planInterest} />
    </div>
  );
}

export default App;
