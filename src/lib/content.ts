import { Award, BookOpen, Globe2, MessageCircle, Ruler, Target } from 'lucide-react';
import type {
  BookingCopy,
  BookingVariant,
  ChildAgeBand,
  CountryOption,
  NavLink,
  PlanInterest,
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

export const SUPPORT_EMAIL = 'hello@blissfulwayacademy.online';

/**
 * The live origin, no trailing slash.
 *
 * index.html is static and cannot import from this module, so its canonical and
 * og: tags repeat this. Change both together.
 */
export const SITE_ORIGIN = 'https://blissfulwayacademy.online';

export const CONTACT = {
  email: SUPPORT_EMAIL,
  /** Digits only, for the tel: href. */
  phoneHref: '+2348104748877',
  /** Spaced for display. */
  phoneLabel: '+234 810 474 8877',
  /**
   * Same number as `phoneHref`, in wa.me's format: country code and digits only,
   * no '+' and no spaces. The prefilled `text` opens the chat with the parent's
   * first message already written, so nobody has to compose an opener cold.
   */
  whatsappHref:
    'https://wa.me/2348104748877?text=Hello%20Blissful%20Way%20Academy%2C%20I%27d%20like%20to%20ask%20about%20lessons%20for%20my%20child',
  location: 'Online · US, UK & Canada',
};

export const LOGO_SRC = '/assets/images/Blissful_way_Academy_Logo.jpg';
export const LOGO_ALT = 'Blissful Way Academy crest';

/**
 * Real, verified social profiles. Only list an account that actually exists —
 * these are mirrored into the JSON-LD `sameAs` array in index.html, and search
 * engines treat that array as a claim of ownership.
 *
 * There is deliberately no Facebook entry: the academy has no Facebook page.
 *
 * NOTE: index.html is static and cannot import from this module, so its
 * `sameAs` array repeats these URLs. Change both together.
 */
export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/blissfulacademy2026?utm_source=qr',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@blissfulwayacademy?_r=1&_t=ZS-98ua7NzMSdk',
  },
] as const;

/** The routes the app serves. Every in-site href is built from these. */
export const ROUTES = {
  home: '/',
  safeguarding: '/safeguarding',
  terms: '/terms',
} as const;

/**
 * The date shown at the foot of the Terms page.
 *
 * Deliberately a constant rather than a literal in the page: revising the terms
 * is then a one-line change here, and the date cannot be forgotten in the diff.
 * Written as a display string because it is only ever shown, never compared.
 */
export const TERMS_LAST_UPDATED = '17 August 2026';

/**
 * A homepage section anchor, absolute from the root.
 *
 * '/#pricing' rather than '#pricing': the header and footer render on
 * /safeguarding too, where a bare fragment would resolve against that path. On
 * the homepage this is still a same-document fragment, so the browser's native
 * (and `scroll-behavior: smooth`) jump is unchanged.
 */
export const sectionHref = (id: string) => `${ROUTES.home}#${id}`;

/**
 * The single source of truth for navigation.
 *
 * The desktop header and mobile drawer render this in full; the footer renders
 * everything except Home. Previously all three kept their own copy.
 */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: sectionHref('home') },
  { label: 'Igbo Heritage', href: sectionHref('igbo-heritage') },
  { label: 'Early Years Maths', href: sectionHref('early-years-maths') },
  { label: 'Our Tutors', href: sectionHref('our-tutors') },
  { label: 'Pricing', href: sectionHref('pricing') },
  { label: 'Safeguarding', href: ROUTES.safeguarding },
];

/**
 * Footer omits Home — the logo above it already links there — and adds Terms.
 *
 * Terms is footer-only by design. Safeguarding answers a question a parent is
 * actively asking and earns its place in the header; terms are read once, if at
 * all, and would dilute a nav bar that is already at six items.
 */
export const FOOTER_NAV_LINKS: NavLink[] = [
  ...NAV_LINKS.filter((link) => link.href !== sectionHref('home')),
  { label: 'Terms of Service', href: ROUTES.terms },
];

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
    text: 'Native speech and stories for ages 4–16',
  },
  {
    icon: Target,
    title: 'Early Years Maths & Number Confidence',
    text: 'Number fluency for ages 4–9',
  },
];

/**
 * The sentence both programmes' outcome lists complete.
 *
 * Shared so the two cards make a parent the same promise in the same words: a
 * term is twelve weeks, and this is what it buys.
 */
const OUTCOMES_LEAD = 'After twelve weeks your child will:';

/** The same promise to the parent of a fourteen-year-old, who is not a child. */
const OUTCOMES_LEAD_TEEN = 'After twelve weeks your teenager will:';

/**
 * The take-home sheet, stated once beneath the pair rather than on each card.
 *
 * It is true of every lesson on both programmes, and it is the detail parents
 * do not expect — repeating it card by card reads as a feature list item and
 * costs it that weight.
 */
export const PROGRAMME_FOOTNOTE =
  "Every lesson ends with a one-page sheet of the week's words, sent to you.";

export const programmes: Programme[] = [
  {
    slug: 'igbo-heritage',
    eyebrow: '01 / Heritage',
    title: 'Igbo Heritage & Language Immersion (ages 4-16)',
    description:
      'Give your child the confidence to speak, understand, and celebrate the language that connects them to home.',
    outcomes: {
      intro:
        'Twelve-week terms for ages 4 to 16, taught by age band, with a placement lesson first.',
      lead: OUTCOMES_LEAD,
      bands: [
        {
          label: '4-6',
          items: [
            'Greet you and answer in Igbo without prompting',
            'Name everyone in your family in Igbo',
            'Follow spoken instructions in Igbo without gestures',
            'Count to ten, name colours, foods and animals',
            'Hold a two-minute conversation with you',
          ],
        },
        {
          label: '7-9',
          items: [
            'Introduce themselves and say where your family is from',
            'Read and write the Igbo alphabet, including ị, ọ and ụ',
            'Hear and mark tone',
            'Explain three Igbo proverbs',
            'Read a short passage aloud and write five sentences about themselves',
          ],
        },
        {
          label: '10-12',
          items: [
            'Read and write Igbo, including tone marks',
            'Build sentences in past and present tense',
            'Use Igbo kinship terms correctly',
            'Explain six proverbs and use them in conversation',
            'Speak for three minutes about their family, unscripted',
          ],
        },
        {
          label: '13-16',
          lead: OUTCOMES_LEAD_TEEN,
          items: [
            'Read unfamiliar Igbo aloud with correct tone',
            'Hold a five-minute conversation without switching to English',
            'Follow Igbo music and Nollywood dialogue',
            'Write messages and short letters in Igbo',
            'Deliver a five-minute talk in Igbo on a topic they choose',
          ],
          note: 'Learners completing two terms receive a Certificate of Achievement.',
        },
      ],
    },
    icon: BookOpen,
    // Tints for the cream card ground. The dark build used amber/sky at low
    // alpha over charcoal; on cream the same idea needs the deeper pair, or the
    // wash disappears into the paper.
    accent: 'from-gold-deep/15 via-transparent to-transparent',
  },
  {
    slug: 'early-years-maths',
    eyebrow: '02 / Numeracy',
    title: 'Early Years Maths & Number Confidence (ages 4-9)',
    description:
      'Build sharp, confident thinkers with a learning experience that makes complex ideas feel clear and rewarding.',
    outcomes: {
      intro: 'Aligned to the England EYFS framework and US Common Core.',
      lead: OUTCOMES_LEAD,
      bands: [
        {
          label: '4-6',
          items: [
            'Count and write numbers to 20',
            'Number bonds within 10',
            'Add and subtract within 10',
            'Name 2D and 3D shapes, continue patterns',
            'Compare length and weight',
          ],
        },
        {
          label: '7-9',
          items: [
            'Place value to 100',
            'Add and subtract with regrouping',
            'Times tables 2, 5 and 10',
            'Halves, quarters and thirds',
            'Money, time and word problems',
          ],
        },
      ],
    },
    icon: Ruler,
    accent: 'from-moss/15 via-transparent to-transparent',
  },
];

const IGBO_SPECIALISATION = 'Igbo Language & Culture, Early Years';
const MATHS_SPECIALISATION = 'Early Years Maths & Number Confidence';

/**
 * The real teaching roster.
 *
 * Every teacher now has a genuine photograph at
 * public/assets/images/tutors/{slug}.jpg. If a future tutor joins before their
 * portrait exists, leave `photoUrl` off rather than pointing it at stock or a
 * generated image: the card falls back to the moss initials tile, which is
 * exactly what the onError fallback would show anyway. On a site whose central
 * claim is a real, TRCN-registered roster with named qualifications, a
 * synthetic portrait discredits the very thing it illustrates.
 */
export const tutors: Tutor[] = [
  {
    slug: 'virginia-ogbobe',
    name: 'Mrs Virginia Ogbobe',
    qualification: 'B.Ed Adult Education Administration',
    yearsExperience: 33,
    trcnRegistered: true,
    cdepCertified: true,
    subject: 'igbo',
    specialisation: IGBO_SPECIALISATION,
    photoUrl: '/assets/images/tutors/virginia-ogbobe.jpg',
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
  /** Safeguarding page — "protection / safety". */
  safeguarding: 'Nchekwa',
  /** Terms page — "agreement". */
  terms: 'Nkwekọrịta',
};

export const TRCN_EXPLAINER =
  'TRCN is the Teachers Registration Council of Nigeria, the statutory body that licenses and regulates teaching practice nationwide.';

/**
 * The money-back line carried by the two plans a parent can actually buy.
 *
 * Deliberately not on the Group Cohort tier: nothing has been paid for a
 * waitlist, so there is nothing to guarantee. The full terms behind this are on
 * the Terms page under "Your first month — our guarantee".
 */
const MONEY_BACK_GUARANTEE = 'First month money-back guarantee';

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
    guarantee: MONEY_BACK_GUARANTEE,
    featured: false,
    ctaLabel: 'Claim your spot',
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
    guarantee: MONEY_BACK_GUARANTEE,
    featured: true,
    ctaLabel: 'Claim your spot',
    planInterest: 'dual',
  },
  {
    /*
     * A waitlist, not a plan. `price` and `detail` are absent rather than empty
     * — that absence is what PricingCard reads to render the tier as not yet
     * purchasable, so it cannot show a buy affordance for something that cannot
     * be bought. The feature checklist is gone for the same reason: ticks next
     * to a price read as "what you get", and nothing is being got yet.
     */
    name: 'Group Cohort (Igbo)',
    status: 'Opening soon',
    description:
      'Small cohorts of 3–5 children, opening once enough families in the same age group and time zone have registered.',
    features: [],
    featured: false,
    ctaLabel: 'Join the waitlist',
    planInterest: 'cohort_waitlist',
  },
];

/**
 * The booking dialog's copy, one set per variant.
 *
 * The same form serves both — a waitlist needs exactly the fields a trial does,
 * and country and time zone matter more here than anywhere else on the site
 * since together they decide which cohort a child can join. Only the words
 * around the fields change.
 *
 * Nothing in the waitlist variant may mention the trial or its price: a parent
 * registering interest in a cohort has not booked a lesson and is not paying
 * for one.
 */
export const BOOKING_COPY: Record<BookingVariant, BookingCopy> = {
  trial: {
    kicker: 'Start your journey',
    heading: 'Book a',
    headingAccent: `${TRIAL_PRICE} trial`,
    subtitle:
      "Tell us a little about your family and we'll help you find the right first session.",
    submitLabel: 'Request my trial',
    consentLead: 'By booking',
    errorMailSubject: 'Trial booking request',
    errorTail: "and we'll arrange your trial by hand.",
    successHeading: "You're on your way.",
    successBody:
      "Thank you for reaching out. Our learning concierge will be in touch shortly to arrange your child's trial session.",
  },
  waitlist: {
    kicker: 'Join the waitlist',
    heading: 'Join the cohort waitlist',
    subtitle:
      "Tell us about your child and we'll let you know as soon as a cohort opens in their age group and time zone.",
    submitLabel: 'Join the waitlist',
    consentLead: 'By joining',
    errorMailSubject: 'Cohort waitlist request',
    errorTail: "and we'll add you to the list by hand.",
    successHeading: "You're on the list.",
    successBody:
      "We'll be in touch as soon as we have enough families in your child's age group and time zone to start a cohort.",
  },
};

/** Which copy the dialog wears for the call to action that opened it. */
export function bookingVariant(plan: PlanInterest): BookingVariant {
  return plan === 'cohort_waitlist' ? 'waitlist' : 'trial';
}

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

/**
 * Where the family is based, stored in `leads.country`.
 *
 * Deliberately short: these are the markets the academy serves, and 'Other'
 * catches everyone else rather than making a parent scroll a list of 195.
 */
export const COUNTRIES: CountryOption[] = [
  'United Kingdom',
  'United States',
  'Canada',
  'Ireland',
  'Other',
];

export const SLOTS: PreferredSlot[] = [
  'UK weekday evening (4-8pm)',
  'Saturday morning (North America)',
  'Sunday morning (North America)',
  'Flexible',
];
