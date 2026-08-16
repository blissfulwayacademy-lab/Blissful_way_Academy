import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { BookingModal } from '@/components/BookingModal';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { Safeguarding } from '@/pages/Safeguarding';
import { ROUTES } from '@/lib/content';
import type { PlanInterest } from '@/types';

/**
 * Puts a new page at the top, which a client-side route change does not do on
 * its own — following Safeguarding from halfway down the homepage would
 * otherwise open it halfway down.
 *
 * Two cases are left alone: a back or forward navigation, where the reader
 * expects to return to where they were, and any location carrying a fragment,
 * which names its own scroll target.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}

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

  // The header, footer, and booking dialog are the shell: they sit outside the
  // routes so both pages share one header and one modal instance.
  return (
    <div className="min-h-screen overflow-hidden bg-ink text-bone selection:bg-gold selection:text-ink">
      <ScrollToTop />
      <Header onBookTrial={openTrial} />

      <Routes>
        <Route
          path={ROUTES.home}
          element={<Home onBookTrial={openTrial} onSelectPlan={openBooking} />}
        />
        <Route path={ROUTES.safeguarding} element={<Safeguarding />} />
        {/* An unknown path lands on the homepage rather than an empty shell. */}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>

      <Footer />
      <BookingModal open={modalOpen} onClose={closeBooking} planInterest={planInterest} />
    </div>
  );
}

export default App;
