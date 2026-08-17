import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  AGE_BANDS,
  BOOKING_COPY,
  COUNTRIES,
  ROUTES,
  SLOTS,
  SUBJECTS,
  SUBJECT_OPTIONS,
  SUPPORT_EMAIL,
  TIMEZONES,
  bookingVariant,
} from '@/lib/content';
import type { LeadSubmission, PlanInterest } from '@/types';

type BookingModalProps = { open: boolean; onClose: () => void; planInterest: PlanInterest };

/** Submission lifecycle for the booking form. `success` is tracked separately by `submitted`. */
type SubmitStatus = 'idle' | 'submitting' | 'error';

/**
 * Narrows a raw form string to one of the allowed options.
 *
 * Returns undefined for anything unrecognised, so a tampered or stale <option>
 * value is dropped rather than cast into a type it does not satisfy.
 */
function pickOption<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((option) => option === raw);
}

/** Elements that can hold focus inside the dialog, used for the Tab trap. */
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function BookingModal({ open, onClose, planInterest }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const headingId = useId();

  // Which words the dialog wears. The form itself is identical either way — a
  // waitlist needs every field a trial does, and country and time zone decide
  // which cohort a child can be placed in.
  const copy = BOOKING_COPY[bookingVariant(planInterest)];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // The modal stays mounted and only returns null when closed, so its state
  // survives a close. Without this reset, a parent who booked once would reopen
  // straight onto the success screen and could never book a second child.
  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setStatus('idle');
    setErrorMessage(null);
  }, [open]);

  // Focus management: move focus into the dialog on open, keep Tab inside it,
  // close on Escape, and hand focus back to the trigger on close.
  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (element) => !element.hasAttribute('disabled') && element.tabIndex >= 0,
      );

    // Focus the panel itself rather than the first control, so a screen reader
    // announces the dialog and its heading before reading out any field.
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      // -1 covers focus sitting on the panel itself or having escaped the dialog.
      const index = items.indexOf(document.activeElement as HTMLElement);

      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (index === -1 || index === items.length - 1)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const field = (key: string) => {
      const value = data.get(key);
      const trimmed = typeof value === 'string' ? value.trim() : '';
      return trimmed === '' ? undefined : trimmed;
    };

    // Honeypot. Real users never see this field, so anything in it is a bot.
    // Show the success screen so the bot cannot tell it was rejected, insert nothing.
    if (field('company')) {
      setSubmitted(true);
      return;
    }

    const parentName = field('name');
    const email = field('email');
    if (!parentName || !email) {
      setStatus('error');
      setErrorMessage('Please provide both your name and your email address.');
      return;
    }

    const lead: LeadSubmission = {
      parent_name: parentName,
      email,
      phone: field('phone'),
      timezone: pickOption(field('timezone'), TIMEZONES),
      country: pickOption(field('country'), COUNTRIES),
      child_age: pickOption(field('age'), AGE_BANDS),
      subject_interest: pickOption(field('subject'), SUBJECTS),
      preferred_slot: pickOption(field('slot'), SLOTS),
      plan_interest: planInterest,
    };

    setStatus('submitting');
    setErrorMessage(null);

    const { error } = await supabase.from('leads').insert(lead);

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('idle');
    setSubmitted(true);
  };

  // Every hook above runs on each render regardless of `open`; bailing out only
  // after them keeps the hook order stable, which React requires.
  if (!open) return null;

  const submitting = status === 'submitting';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Click, not mousedown: dragging a text selection out of the panel used to
          count as a backdrop click and wipe everything the parent had typed. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-gold/30 bg-ink-raised p-6 shadow-2xl shadow-ink outline-none sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close booking form"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-bone-muted transition hover:border-gold/40 hover:text-gold"
        >
          <X size={18} />
        </button>
        {!submitted ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              {copy.kicker}
            </span>
            <h2 id={headingId} className="mt-3 font-serif text-[2rem] text-bone sm:text-[2.4rem]">
              {copy.heading}
              {copy.headingAccent && <span className="text-gold"> {copy.headingAccent}</span>}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-bone-muted">{copy.subtitle}</p>
            <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
              {/* Honeypot: hidden from sighted users, screen readers, and the tab
                  order, so only an automated form filler will ever populate it. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company (leave this field empty)</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="text-sm text-bone sm:col-span-2">
                Parent full name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="form-input"
                />
              </label>
              <label className="text-sm text-bone">
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="form-input"
                />
              </label>
              <label className="text-sm text-bone">
                Phone number
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  className="form-input"
                />
              </label>
              <label className="text-sm text-bone">
                Child&apos;s age
                <select required name="age" className="form-input">
                  <option value="">Select age</option>
                  {AGE_BANDS.map((band) => (
                    <option key={band}>{band}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-bone">
                Subject interest
                <select required name="subject" className="form-input">
                  <option value="">Choose a subject</option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-bone">
                Your time zone
                <select required name="timezone" className="form-input">
                  <option value="">Choose your time zone</option>
                  {TIMEZONES.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-bone">
                Country
                <select required name="country" autoComplete="country-name" className="form-input">
                  <option value="">Choose your country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-bone">
                Preferred time slot
                <select required name="slot" className="form-input">
                  <option value="">Choose your preference</option>
                  {SLOTS.map((slot) => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>
              </label>
              {status === 'error' && (
                <div
                  role="alert"
                  // Border at /60 rather than the old /40: the alert's edge is
                  // what marks it off from the form around it, and /40 over
                  // ink-raised measured 2.53:1.
                  className="rounded-xl border border-danger/60 bg-danger/10 p-4 text-sm leading-6 text-danger sm:col-span-2"
                >
                  <p className="font-semibold text-danger-strong">
                    We couldn&apos;t save your request.
                  </p>
                  {errorMessage && <p className="mt-1 text-xs text-danger">{errorMessage}</p>}
                  <p className="mt-2 text-xs">
                    Please try again, or email us directly at{' '}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(copy.errorMailSubject)}`}
                      className="font-semibold text-gold underline underline-offset-2"
                    >
                      {SUPPORT_EMAIL}
                    </a>{' '}
                    {copy.errorTail}
                  </p>
                </div>
              )}
              {/* Deliberately a statement, not a checkbox. A tickbox is one more
                  thing to fail validation on between a parent and their trial;
                  bone-muted holds 7.27:1 on this ground, so "small and quiet"
                  costs no legibility.

                  A new tab rather than a router <Link>: navigating in place
                  would unmount the form and discard everything already typed,
                  which is exactly the friction this line is meant to avoid. */}
              <p className="mt-2 text-xs leading-5 text-bone-muted sm:col-span-2">
                {copy.consentLead} you agree to our{' '}
                <a
                  href={ROUTES.terms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold underline underline-offset-2"
                >
                  Terms of Service
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="button-gold disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              >
                {submitting ? 'Sending your request…' : copy.submitLabel}
                {!submitting && <ArrowRight size={17} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full border border-gold/30 bg-gold/10 p-4 text-gold">
              <Check size={28} />
            </div>
            <h2 id={headingId} className="font-serif text-[2rem] text-bone">
              {copy.successHeading}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-bone-muted">{copy.successBody}</p>
            <button type="button" onClick={onClose} className="button-outline mt-7">
              Return to the academy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
