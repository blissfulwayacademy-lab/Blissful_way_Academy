import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  AGE_BANDS,
  SLOTS,
  SUBJECTS,
  SUBJECT_OPTIONS,
  SUPPORT_EMAIL,
  TIMEZONES,
  TRIAL_PRICE,
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
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
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-amber-500/30 bg-neutral-900 p-6 shadow-2xl shadow-amber-950/30 outline-none sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close booking form"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-neutral-400 transition hover:border-amber-400/40 hover:text-amber-300"
        >
          <X size={18} />
        </button>
        {!submitted ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
              Start your journey
            </span>
            <h2 id={headingId} className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              Book a <span className="text-amber-400">{TRIAL_PRICE} trial</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-400">
              Tell us a little about your family and we&apos;ll help you find the right first
              session.
            </p>
            <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
              {/* Honeypot: hidden from sighted users, screen readers, and the tab
                  order, so only an automated form filler will ever populate it. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company (leave this field empty)</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="text-sm text-neutral-300 sm:col-span-2">
                Parent full name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="form-input"
                />
              </label>
              <label className="text-sm text-neutral-300">
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
              <label className="text-sm text-neutral-300">
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
              <label className="text-sm text-neutral-300">
                Child&apos;s age
                <select required name="age" className="form-input">
                  <option value="">Select age</option>
                  {AGE_BANDS.map((band) => (
                    <option key={band}>{band}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-neutral-300">
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
              <label className="text-sm text-neutral-300">
                Your time zone
                <select required name="timezone" className="form-input">
                  <option value="">Choose your time zone</option>
                  {TIMEZONES.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-neutral-300">
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
                  className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm leading-6 text-red-200 sm:col-span-2"
                >
                  <p className="font-semibold text-red-100">We couldn&apos;t save your request.</p>
                  {errorMessage && <p className="mt-1 text-xs text-red-200/80">{errorMessage}</p>}
                  <p className="mt-2 text-xs">
                    Please try again, or email us directly at{' '}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=Trial%20booking%20request`}
                      className="font-semibold text-amber-300 underline underline-offset-2"
                    >
                      {SUPPORT_EMAIL}
                    </a>{' '}
                    and we&apos;ll arrange your trial by hand.
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="button-gold mt-2 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              >
                {submitting ? 'Sending your request…' : 'Request my trial'}
                {!submitting && <ArrowRight size={17} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full border border-amber-400/30 bg-amber-400/10 p-4 text-amber-300">
              <Check size={28} />
            </div>
            <h2 id={headingId} className="font-serif text-3xl text-white">
              You&apos;re on your way.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
              Thank you for reaching out. Our learning concierge will be in touch shortly to arrange
              your child&apos;s trial session.
            </p>
            <button type="button" onClick={onClose} className="button-outline mt-7">
              Return to the academy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
