import { Award, BookOpen, Globe2, MessageCircle, Ruler, Target } from 'lucide-react';
import type {
  ChildAgeBand,
  NavLink,
  PreferredSlot,
  PricingTier,
  Programme,
  SubjectInterest,
  TimeZoneOption,
  TrustPoint,
  Tutor,
} from '@/types';

/**
 * Every piece of editable copy and data on the site.
 *
 * Components import from here rather than holding literals inline, so swapping
 * any of this for a database query is a change to this file alone.
 */

/** Price of the introductory session. Referenced by all five trial CTAs. */
export const TRIAL_PRICE = '$15';

export const SUPPORT_EMAIL = 'blissfulwayacademy@gmail.com';

export const CONTACT = {
  email: SUPPORT_EMAIL,
  /** Digits only, for the tel: href. */
  phoneHref: '+2348104748877',
  /** Spaced for display. */
  phoneLabel: '+234 8104748877',
  location: 'Online · US, UK & Canada',
};

export const LOGO_SRC = '/assets/images/Blissful_way_Academy_Logo.jpg';
export const LOGO_ALT = 'Blissful Way Academy crest';

/**
 * The single source of truth for navigation.
 *
 * The desktop header and mobile drawer render this in full; the footer renders
 * everything except Home. Previously all three kept their own copy.
 */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', id: 'home' },
  { label: 'Igbo Heritage', id: 'igbo-heritage' },
  { label: 'Early Years Maths', id: 'early-years-maths' },
  { label: 'Our Tutors', id: 'our-tutors' },
  { label: 'Pricing', id: 'pricing' },
];

/** Footer omits Home — the logo above it already links there. */
export const FOOTER_NAV_LINKS: NavLink[] = NAV_LINKS.filter((link) => link.id !== 'home');

export const TRUST_POINTS: TrustPoint[] = [
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
    title: 'Early Years Maths & Number Confidence',
    text: 'Number fluency for ages 4–9',
  },
];

export const programmes: Programme[] = [
  {
    slug: 'igbo-heritage',
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
    slug: 'early-years-maths',
    eyebrow: '02 / STEM',
    title: 'Early Years Maths & Number Confidence (ages 4-9)',
    description:
      'Build sharp, confident thinkers with a learning experience that makes complex ideas feel clear and rewarding.',
    bullets: [
      'Counting and early number sense',
      'First addition and subtraction',
      'Shape and pattern recognition',
      'Confidence before formal schooling pressure',
    ],
    icon: Ruler,
    accent: 'from-sky-400/15 via-transparent to-transparent',
  },
];

const IGBO_SPECIALISATION = 'Igbo Language & Culture, Early Years';
const MATHS_SPECIALISATION = 'Early Years Maths & Number Confidence';

/**
 * The real teaching roster.
 *
 * A `photoUrl` stays commented out until the photograph exists at
 * public/assets/images/tutors/{slug}.jpg — uncomment each line as its file is
 * added. Without it the card renders the charcoal initials tile, which is
 * exactly what the onError fallback would show anyway, minus a failed request
 * per tutor on every page load.
 */
export const tutors: Tutor[] = [
  {
    slug: 'virginia-ogbebe',
    name: 'Mrs Virginia Ogbebe',
    qualification: 'B.Ed Adult Education Administration',
    yearsExperience: 33,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'igbo',
    specialisation: IGBO_SPECIALISATION,
    photoUrl: '/assets/images/tutors/virginia-ogbebe.jpg',
    initials: 'VO',
  },
  {
    slug: 'ewelum-chikaodili',
    name: 'Mrs Ewelum Chikaodili',
    qualification: 'B.Ed Adult Education / Political Science',
    yearsExperience: 30,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'igbo',
    specialisation: IGBO_SPECIALISATION,
    photoUrl: '/assets/images/tutors/ewelum-chikaodili.jpg',
    initials: 'EC',
  },
  {
    slug: 'rita-okwor',
    name: 'Mrs Rita Okwor',
    qualification: 'B.Ed Educational Administration & Supervision',
    yearsExperience: 17,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'igbo',
    specialisation: IGBO_SPECIALISATION,
    photoUrl: '/assets/images/tutors/rita-okwor.jpg',
    initials: 'RO',
  },
  {
    slug: 'agatha-chinweokwu',
    name: 'Mrs Agatha Chinweokwu',
    qualification: 'B.Ed Guidance and Counselling',
    yearsExperience: 12,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'igbo',
    specialisation: IGBO_SPECIALISATION,
    photoUrl: '/assets/images/tutors/agatha-chinweokwu.jpg',
    initials: 'AC',
  },
  {
    slug: 'uchenna-osagu',
    name: 'Mr Uchenna Osagu',
    qualification: 'NCE Agricultural Science',
    yearsExperience: 9,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'maths',
    specialisation: MATHS_SPECIALISATION,
    photoUrl: '/assets/images/tutors/uchenna-osagu.jpg',
    initials: 'UO',
  },
  {
    slug: 'chinwendu-nwoga',
    name: 'Miss Chinwendu Nwoga',
    qualification: 'HND Environmental Sciences',
    yearsExperience: 3,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'maths',
    specialisation: MATHS_SPECIALISATION,
    photoUrl: '/assets/images/tutors/chinwendu-nwoga.jpg',
    initials: 'CN',
  },
];

/**
 * Summed from the tutor list rather than hardcoded, so the hero's headline
 * figure cannot drift out of step with the roster.
 */
export const COMBINED_YEARS_EXPERIENCE = tutors.reduce(
  (total, tutor) => total + tutor.yearsExperience,
  0,
);

/**
 * Igbo section kickers, sitting above the English headings.
 *
 * Rendered uppercase by `.section-kicker`; every use must be wrapped in
 * `<span lang="ig">` so assistive tech and crawlers switch language correctly.
 */
export const IGBO_KICKERS = {
  /** Hero — a greeting, "hello / welcome". */
  greeting: 'Ndeewo',
  /** Programmes — "what we teach". */
  programmes: 'Ihe anyị na-akụzi',
  /** Tutors — "our teachers". */
  tutors: 'Ndị nkụzi anyị',
  /** Pricing — "price". */
  pricing: 'Ọnụahịa',
  /** Closing call to action — "a beginning". */
  cta: 'Mmalite',
};

export const TRCN_EXPLAINER =
  'TRCN is the Teachers Registration Council of Nigeria, the statutory body that licenses and regulates teaching practice nationwide.';

export const pricing: PricingTier[] = [
  {
    name: 'Starter Bundle',
    price: '$100',
    detail: '$25 / hour',
    description: 'A focused first step for families beginning their learning journey.',
    features: [
      '4 hours per month',
      '1-on-1 Igbo or Early Years Maths',
      'Personalised learning plan',
    ],
    featured: false,
    planInterest: 'starter',
  },
  {
    name: 'Heritage & STEM Dual Programme',
    price: '$180',
    detail: '$22.50 / hour',
    description: 'The complete pathway for children ready to grow across culture and academics.',
    features: [
      '8 hours per month',
      '4 hrs Igbo + 4 hrs Early Years Maths',
      'Progress notes for parents',
    ],
    featured: true,
    planInterest: 'dual',
  },
  {
    name: 'Group Cohort',
    price: '$60',
    // Not the trial price — this is the Group Cohort hourly rate, which happens
    // to be the same figure. Deliberately not TRIAL_PRICE.
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
];

export const AGE_BANDS: ChildAgeBand[] = ['4–6 years', '7–9 years', '10–12 years', '13–16 years'];

/**
 * The subject select's visible labels and their stored values.
 *
 * `value` is what lands in `leads.subject_interest` in Postgres and must not be
 * renamed without a data migration — only `label` is safe to reword.
 */
export const SUBJECT_OPTIONS: { value: SubjectInterest; label: string }[] = [
  { value: 'Igbo', label: 'Igbo Language' },
  { value: 'Math', label: 'Early Years Maths' },
  { value: 'Both', label: 'Both' },
];

/** Stored values only, used to validate what comes back from the form. */
export const SUBJECTS: SubjectInterest[] = SUBJECT_OPTIONS.map((option) => option.value);

export const TIMEZONES: TimeZoneOption[] = [
  'United Kingdom (GMT/BST)',
  'US Eastern',
  'US Central',
  'US Mountain',
  'US Pacific',
  'Canada Eastern',
  'Canada Pacific',
  'Other',
];

export const SLOTS: PreferredSlot[] = [
  'UK weekday evening (4-8pm)',
  'Saturday morning (North America)',
  'Sunday morning (North America)',
  'Flexible',
];
