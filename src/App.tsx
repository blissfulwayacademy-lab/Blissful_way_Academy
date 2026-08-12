import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Facebook,
  Globe2,
  Instagram,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  Plus,
  Ruler,
  Sparkles,
  Star,
  Target,
  Users,
  X,
  Zap,
  Music2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type {
  ChildAgeBand,
  LeadSubmission,
  PlanInterest,
  PreferredSlot,
  PricingTier,
  SubjectInterest,
  TimeZoneOption,
} from '@/types';

type BookingModalProps = { open: boolean; onClose: () => void; planInterest: PlanInterest };

/** Submission lifecycle for the booking form. `success` is tracked separately by `submitted`. */
type SubmitStatus = 'idle' | 'submitting' | 'error';

const AGE_BANDS: ChildAgeBand[] = ['4–6 years', '7–9 years', '10–12 years', '13–16 years'];

const SUBJECTS: SubjectInterest[] = ['Igbo', 'Math', 'Both'];

const TIMEZONES: TimeZoneOption[] = [
  'United Kingdom (GMT/BST)',
  'US Eastern',
  'US Central',
  'US Mountain',
  'US Pacific',
  'Canada Eastern',
  'Canada Pacific',
  'Other',
];

const SLOTS: PreferredSlot[] = [
  'UK weekday evening (4-8pm)',
  'Saturday morning (North America)',
  'Sunday morning (North America)',
  'Flexible',
];

const SUPPORT_EMAIL = 'blissfulwayacademy@gmail.com';

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

const programs = [
  {
    eyebrow: '01 / Heritage',
    title: 'Igbo Heritage & Language Immersion',
    description:
      'Give your child the confidence to speak, understand, and celebrate the language that connects them to home.',
    bullets: [
      'Native speech & everyday conversation',
      'Phonics, storytelling, and proverbs',
      'Cultural history taught through play',
    ],
    icon: BookOpen,
    accent: 'from-amber-400/20 via-transparent to-transparent',
  },
  {
    eyebrow: '02 / STEM',
    title: 'K–12 Mathematics & Quantitative Reasoning',
    description:
      'Build sharp, confident thinkers with a learning experience that makes complex ideas feel clear and rewarding.',
    bullets: [
      'Common Core & UK curriculum aligned',
      'Logic puzzles and quantitative reasoning',
      'Step-by-step digital whiteboard solving',
    ],
    icon: Ruler,
    accent: 'from-sky-400/15 via-transparent to-transparent',
  },
];

const tutors = [
  {
    name: 'Amaka Okoye',
    role: 'Lead Igbo Language & Cultural Tutor',
    initials: 'AO',
    color: 'from-amber-200 to-orange-600',
    quote: 'Language is a bridge to belonging.',
  },
  {
    name: 'David Mensah',
    role: 'K–12 Mathematics & Logic Tutor',
    initials: 'DM',
    color: 'from-cyan-200 to-blue-700',
    quote: 'Every child can learn to love the why.',
  },
  {
    name: 'Nneka Eze',
    role: 'Early Years Learning Specialist',
    initials: 'NE',
    color: 'from-rose-200 to-red-700',
    quote: 'Curiosity is the first classroom.',
  },
];

const pricing = [
  {
    name: 'Starter Bundle',
    price: '$100',
    detail: '$25 / hour',
    description: 'A focused first step for families beginning their learning journey.',
    features: ['4 hours per month', '1-on-1 Igbo or Math', 'Personalized learning plan'],
    featured: false,
    planInterest: 'starter',
  },
  {
    name: 'Heritage & STEM Dual Program',
    price: '$180',
    detail: '$22.50 / hour',
    description: 'The complete pathway for children ready to grow across culture and academics.',
    features: ['8 hours per month', '4 hrs Igbo + 4 hrs Math', 'Progress notes for parents'],
    featured: true,
    planInterest: 'dual',
  },
  {
    name: 'Group Cohort',
    price: '$60',
    detail: '$15 / hour',
    description: 'Make meaningful connections while learning Igbo in a small, joyful community.',
    features: [
      '4 group sessions per month',
      '3–5 children per cohort',
      'Conversation-led learning',
    ],
    featured: false,
    planInterest: 'cohort',
  },
] satisfies PricingTier[];

function BookingModal({ open, onClose, planInterest }: BookingModalProps) {
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
              Book a <span className="text-amber-400">$15 trial</span>
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
                  {SUBJECTS.map((subject) => (
                    <option key={subject}>{subject}</option>
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

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTutor, setActiveTutor] = useState<string | null>(null);
  const [planInterest, setPlanInterest] = useState<PlanInterest>('trial');

  // Records which call to action opened the modal. The pricing cards pass their
  // own tier; every other trigger is a plain trial request.
  const openBooking = (plan: PlanInterest = 'trial') => {
    setPlanInterest(plan);
    setModalOpen(true);
    setMenuOpen(false);
  };

  // Stable identity so the dialog's focus-management effect does not tear down
  // and re-run (stealing focus) on every render of App.
  const closeBooking = useCallback(() => setModalOpen(false), []);

  return (
    <div className="min-h-screen overflow-hidden bg-neutral-950 text-white selection:bg-amber-400 selection:text-black">
      <header className="sticky top-0 z-50 border-b border-amber-500/15 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#home" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/images/Blissful_way_Academy_Logo.jpg"
              alt="Blissful Way Academy crest"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-amber-400/50"
            />
            <span className="font-serif text-sm tracking-wide text-amber-100 sm:text-base">
              Blissful Way <span className="text-amber-400">Academy</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-[13px] text-neutral-300 lg:flex">
            {[
              ['Home', 'home'],
              ['Igbo Heritage', 'igbo-heritage'],
              ['Math & Logic', 'math-logic'],
              ['Our Tutors', 'our-tutors'],
              ['Pricing', 'pricing'],
            ].map(([label, href]) => (
              <a key={href} href={`#${href}`} className="transition hover:text-amber-300">
                {label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => openBooking()}
            className="hidden rounded-full bg-amber-400 px-5 py-3 text-xs font-bold text-black transition hover:bg-amber-300 sm:block"
          >
            Book $15 Trial
          </button>
          <button
            className="rounded-lg p-2 text-neutral-200 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-neutral-950 px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-5 text-sm text-neutral-300">
              {[
                ['Home', 'home'],
                ['Igbo Heritage', 'igbo-heritage'],
                ['Math & Logic', 'math-logic'],
                ['Our Tutors', 'our-tutors'],
                ['Pricing', 'pricing'],
              ].map(([label, href]) => (
                <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <button onClick={() => openBooking()} className="button-gold w-full">
                Book $15 Trial <ArrowRight size={16} />
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section
          id="home"
          className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28 lg:pt-28"
        >
          <div className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-amber-400/10 blur-[120px]" />
          <div className="relative grid items-center gap-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-12">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                <Sparkles size={13} /> The future of rooted learning
              </div>
              <h1 className="font-serif text-[2.7rem] leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4.35rem]">
                Where <span className="text-amber-400">culture</span> meets
                <br className="hidden sm:block" /> <span className="italic">curiosity.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg">
                Empowering diaspora children with native{' '}
                <span className="font-medium text-amber-300">Igbo mastery</span> and advanced{' '}
                <span className="font-medium text-amber-300">mathematical thinking</span> through
                joyful, live online learning.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => openBooking()} className="button-gold">
                  Book a $15 trial session <ArrowRight size={17} />
                </button>
                <a href="#igbo-heritage" className="button-outline">
                  Explore curriculum <ChevronDown size={16} />
                </a>
              </div>
              <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6 text-xs text-neutral-400">
                <div className="flex -space-x-2">
                  {['A', 'J', 'K', 'M'].map((letter, index) => (
                    <div
                      key={letter}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-950 bg-gradient-to-br ${['from-amber-200 to-orange-500', 'from-sky-200 to-blue-700', 'from-rose-200 to-red-700', 'from-emerald-200 to-green-700'][index]} text-[10px] font-bold text-black`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span>
                  <strong className="text-white">Loved by families</strong>
                  <br />
                  across 4 continents
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
              <div className="absolute -inset-8 rounded-full bg-amber-400/10 blur-3xl" />
              <div className="relative rounded-[28px] border border-amber-400/25 bg-gradient-to-br from-neutral-800 to-neutral-950 p-3 shadow-2xl shadow-black/50">
                <div className="rounded-[20px] border border-white/10 bg-[#171717] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                        Live classroom
                      </span>
                    </div>
                    <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] text-amber-300">
                      09:41 AM
                    </span>
                  </div>
                  <div className="relative aspect-[1.18] overflow-hidden rounded-xl bg-gradient-to-br from-[#251d0e] via-[#171717] to-[#0c1318] p-5">
                    <div className="absolute right-7 top-6 h-32 w-32 rounded-full bg-amber-400/15 blur-3xl" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
                          Today&apos;s lesson
                        </span>
                        <h3 className="mt-3 max-w-xs font-serif text-2xl text-white sm:text-3xl">
                          The beauty of <span className="text-amber-300">Ọ̀nà</span>
                        </h3>
                        <p className="mt-2 text-xs text-neutral-400">
                          Igbo language · Beginner level
                        </p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-black">
                            <BookOpen size={17} />
                          </div>
                          <div>
                            <div className="text-xs text-white">Word of the day</div>
                            <div className="text-[10px] text-neutral-500">Ọ̀nà means “path”</div>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="avatar bg-gradient-to-br from-amber-200 to-orange-600">
                            AO
                          </div>
                          <div className="avatar bg-gradient-to-br from-sky-200 to-blue-700">J</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                        <Users size={14} />
                      </span>{' '}
                      1-on-1 session
                    </div>
                    <span className="text-xs text-neutral-500">CDEP certified</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                    <Zap size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500">Learning progress</div>
                    <div className="text-sm font-semibold text-white">Growing every week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-neutral-900/60">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: 'Tech-certified educators',
                text: 'Trained in modern digital classrooms',
              },
              {
                icon: Globe2,
                title: 'Global standard',
                text: 'Built for diaspora families worldwide',
              },
              {
                icon: MessageCircle,
                title: 'Cultural immersion',
                text: 'Native speech, stories & heritage',
              },
              {
                icon: Target,
                title: 'STEM acceleration',
                text: 'Logic skills for lifelong confidence',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 px-2 py-6 sm:px-6 lg:py-8">
                <Icon className="shrink-0 text-amber-400" size={22} strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-semibold capitalize text-white">{title}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="igbo-heritage" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="section-kicker">The academy experience</p>
            <h2 className="section-title">
              A richer way to <span className="text-amber-400">grow.</span>
            </h2>
            <p className="section-copy">
              Our programs are designed around the whole child — building a confident sense of
              identity alongside the skills to thrive in school and beyond.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {programs.map(({ icon: Icon, ...program }, index) => (
              <article
                key={program.title}
                id={index === 1 ? 'math-logic' : undefined}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${program.accent} bg-neutral-900 p-7 transition hover:-translate-y-1 hover:border-amber-400/35 sm:p-9`}
              >
                <div className="mb-16 flex items-start justify-between">
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-300">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {program.eyebrow}
                  </span>
                </div>
                <h3 className="max-w-md font-serif text-2xl leading-tight text-white sm:text-3xl">
                  {program.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-400">
                  {program.description}
                </p>
                <ul className="mt-7 space-y-3">
                  {program.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-sm text-neutral-200">
                      <span className="rounded-full bg-amber-400/10 p-1 text-amber-300">
                        <Check size={12} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-7 right-8 text-8xl font-serif font-bold text-white/[0.025]">
                  {program.eyebrow.slice(0, 2)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="our-tutors" className="bg-neutral-900/55 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="section-kicker">Meet your guides</p>
                <h2 className="section-title">
                  Teachers who <span className="text-amber-400">see</span> your child.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-neutral-400">
                Warm, expert educators who bring energy, patience, and a world of experience to
                every session.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {tutors.map((tutor) => (
                <button
                  key={tutor.name}
                  onClick={() => setActiveTutor(activeTutor === tutor.name ? null : tutor.name)}
                  className="group text-left"
                >
                  <div
                    className={`relative aspect-[.9] overflow-hidden rounded-3xl bg-gradient-to-br ${tutor.color} p-5`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.5),transparent_28%)]" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="rounded-full bg-black/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200">
                          CDEP certified
                        </span>
                        <span className="rounded-full bg-black/20 p-2 text-black/70">
                          <Play size={15} fill="currentColor" />
                        </span>
                      </div>
                      <div className="flex items-end justify-center">
                        <span className="font-serif text-[8rem] leading-none text-black/50 transition duration-500 group-hover:scale-105">
                          {tutor.initials}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-black/60 p-3 backdrop-blur-md">
                      <p className="text-xs italic text-amber-100">“{tutor.quote}”</p>
                    </div>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">{tutor.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">{tutor.role}</p>
                  {activeTutor === tutor.name && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
                      <Play size={12} fill="currentColor" /> Playing 45-second introduction
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
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
              <div
                key={plan.name}
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
                <p className="mt-5 min-h-[48px] text-sm leading-6 text-neutral-400">
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-neutral-200">
                      <Check size={16} className="mt-0.5 shrink-0 text-amber-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openBooking(plan.planInterest)}
                  className={
                    plan.featured ? 'button-gold mt-8 w-full' : 'button-outline mt-8 w-full'
                  }
                >
                  Claim your spot <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-5 mb-20 overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/15 via-neutral-900 to-neutral-900 sm:mx-8 lg:mx-auto lg:mb-28 lg:max-w-7xl">
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="section-kicker">A meaningful first step</p>
              <h2 className="font-serif text-3xl leading-tight text-white sm:text-5xl">
                Give them the gift of <span className="text-amber-400">belonging.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-neutral-300">
                Start with a low-pressure trial and discover what becomes possible when a child
                feels seen, supported, and inspired.
              </p>
              <button onClick={() => openBooking()} className="button-gold mt-8">
                Book their $15 trial <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <img
                src="/assets/images/Blissful_way_Academy_Logo.jpg"
                alt="Blissful Way Academy crest"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-serif text-base text-amber-100">
                Blissful Way <span className="text-amber-400">Academy</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
              Bridging culture, logic, and academic excellence for the next generation.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="social">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="social">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="TikTok" className="social">
                <Music2 size={16} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Explore
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-500">
              <a href="#igbo-heritage" className="hover:text-amber-300">
                Igbo Heritage
              </a>
              <a href="#math-logic" className="hover:text-amber-300">
                Math & Logic
              </a>
              <a href="#our-tutors" className="hover:text-amber-300">
                Our Tutors
              </a>
              <a href="#pricing" className="hover:text-amber-300">
                Pricing
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Contact
            </h3>
            <div className="mt-5 space-y-4 text-sm text-neutral-500">
              <a
                href="mailto:blissfulwayacademy@gmail.com"
                className="flex gap-3 hover:text-amber-300"
              >
                <Mail size={16} className="shrink-0 text-amber-400" />
                blissfulwayacademy@gmail.com
              </a>
              <a href="tel:+2348104748877" className="flex gap-3 hover:text-amber-300">
                <MessageCircle size={16} className="shrink-0 text-amber-400" />
                +234 8104748877
              </a>
              <div className="flex gap-3">
                <MapPin size={16} className="shrink-0 text-amber-400" />
                Online · US, UK & Canada
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-neutral-600 sm:px-8">
          © {new Date().getFullYear()} Blissful Way Academy. All rights reserved.
        </div>
      </footer>
      <BookingModal open={modalOpen} onClose={closeBooking} planInterest={planInterest} />
    </div>
  );
}

export default App;
