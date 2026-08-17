import type { LucideIcon } from 'lucide-react';

/**
 * Content and data shapes for the site.
 *
 * `Tutor`, `Programme`, and `PricingTier` are derived field-for-field from the
 * `tutors`, `programmes`, and `pricing` arrays in src/lib/content.ts. Nothing is
 * added or renamed, so they can be applied to those arrays without edits.
 */

/** Which of the two programmes a tutor teaches. */
export type TutorSubject = 'igbo' | 'maths';

/** One entry in the `tutors` array (src/lib/content.ts). */
export interface Tutor {
  /** URL-safe identifier, also used to build `photoUrl`. */
  slug: string;
  /** Display name including title, e.g. 'Mrs Virginia Ogbobe'. */
  name: string;
  /** Highest teaching qualification, e.g. 'B.Ed Guidance and Counselling'. */
  qualification: string;
  /** Whole years of classroom experience. Summed for the hero's headline figure. */
  yearsExperience: number;
  /** Registered with the Teachers Registration Council of Nigeria. */
  trcnRegistered: boolean;
  cdepCertified: boolean;
  subject: TutorSubject;
  /** What they teach, e.g. 'Igbo Language & Culture, Early Years'. */
  specialisation: string;
  /**
   * Photograph under public/. The card falls back to the initials tile when this
   * is absent or the file fails to load, so a missing photo never shows as broken.
   */
  photoUrl?: string;
  /**
   * Introduction clip. No play affordance is rendered while this is undefined —
   * the section previously promised a video that did not exist.
   */
  videoUrl?: string;
  /** Two letters for the fallback tile, e.g. 'VO'. */
  initials: string;
}

/**
 * A single entry in the site's primary navigation.
 *
 * `href` is always absolute from the site root, because the navigation renders
 * on every route: a bare '#pricing' would resolve against /safeguarding and go
 * nowhere. Two forms occur — a homepage anchor ('/#pricing') and a route
 * ('/safeguarding') — and `NavItem` picks the right element for each.
 */
export interface NavLink {
  label: string;
  href: string;
}

/** One cell of the four-up trust bar under the hero. */
export interface TrustPoint {
  /** A lucide-react component reference, not a string. */
  icon: LucideIcon;
  title: string;
  text: string;
}

/** One entry in the `programmes` array (src/lib/content.ts). */
export interface Programme {
  /**
   * Anchor id for this programme, without the leading '#'. Nav links resolve
   * against these, so reordering the array can never break them.
   */
  slug: string;
  /** Small label above the title, e.g. '01 / Heritage'. */
  eyebrow: string;
  title: string;
  description: string;
  /** Checklist items rendered under the description. */
  bullets: string[];
  /** A lucide-react component reference, not a string — e.g. `BookOpen`. */
  icon: LucideIcon;
  /**
   * Tailwind gradient overlay for the card's cream ground, e.g.
   * 'from-gold-deep/15 via-transparent to-transparent'. Must use a light-ground
   * token — `gold` and `bone` wash out entirely on cream.
   */
  accent: string;
}

/** One entry in the `pricing` array (src/lib/content.ts). */
export interface PricingTier {
  name: string;
  /**
   * Pre-formatted display string including the currency symbol, e.g. '$100'.
   *
   * Absent on a tier that cannot be bought yet. `PricingCard` treats that
   * absence as the single switch between a purchasable plan and a waitlist, so
   * a tier can never show both a price and a waitlist button.
   */
  price?: string;
  /** Secondary rate line, e.g. '$25 / hour'. Absent alongside `price`. */
  detail?: string;
  /** Shown in place of the price on a waitlist tier, e.g. 'Opening soon'. */
  status?: string;
  description: string;
  /** Rendered as a ticked checklist. Empty on a waitlist tier. */
  features: string[];
  /** Reassurance under the button, e.g. the first-month refund. */
  guarantee?: string;
  /** Marks the highlighted 'MOST POPULAR' tier. */
  featured: boolean;
  /** The card's button label, e.g. 'Claim your spot' or 'Join the waitlist'. */
  ctaLabel: string;
  /** Recorded as `plan_interest` when this card opens the booking modal. */
  planInterest: PlanInterest;
}

/** Options offered by the `age` select in the booking modal. */
export type ChildAgeBand = '4–6 years' | '7–9 years' | '10–12 years' | '13–16 years';

/** Options offered by the `subject` select in the booking modal. */
export type SubjectInterest = 'Igbo' | 'Math' | 'Both';

/** Options offered by the `timezone` select in the booking modal. */
export type TimeZoneOption =
  | 'United Kingdom (GMT/BST)'
  | 'US Eastern'
  | 'US Central'
  | 'US Mountain'
  | 'US Pacific'
  | 'Canada Eastern'
  | 'Canada Pacific'
  | 'Other';

/** Options offered by the `country` select in the booking modal. */
export type CountryOption = 'United Kingdom' | 'United States' | 'Canada' | 'Ireland' | 'Other';

/** Options offered by the `slot` select in the booking modal. */
export type PreferredSlot =
  | 'UK weekday evening (4-8pm)'
  | 'Saturday morning (North America)'
  | 'Sunday morning (North America)'
  | 'Flexible';

/**
 * Which call to action opened the booking modal.
 *
 * The three pricing cards report the tier the parent clicked; the header, hero,
 * mobile drawer, and closing CTA all report a plain trial request.
 *
 * 'cohort' is retained but no longer reachable from the site: the Group Cohort
 * card became a waitlist and now reports 'cohort_waitlist'. Rows inserted while
 * cohorts were sold still carry the old value, so removing it here would
 * mistype existing data.
 */
export type PlanInterest = 'trial' | 'starter' | 'dual' | 'cohort' | 'cohort_waitlist';

/**
 * Which set of copy the booking dialog wears.
 *
 * Derived from `PlanInterest` rather than passed alongside it, so a new call to
 * action cannot open the dialog wearing the wrong words.
 */
export type BookingVariant = 'trial' | 'waitlist';

/**
 * Everything the booking dialog says, for one variant.
 *
 * The heading is split rather than held as markup because this file and
 * content.ts are plain `.ts` — `headingAccent` is rendered in gold after
 * `heading`, and is omitted where the whole heading is one weight.
 */
export interface BookingCopy {
  /** Small label above the heading. Rendered uppercase by its own class. */
  kicker: string;
  heading: string;
  /** Gold-accented tail of the heading, e.g. '$15 trial'. */
  headingAccent?: string;
  subtitle: string;
  submitLabel: string;
  /** Opens the terms sentence, e.g. 'By booking' — the rest is fixed. */
  consentLead: string;
  /** `subject=` on the mailto in the error fallback. */
  errorMailSubject: string;
  /** Closes the error fallback after the support address. */
  errorTail: string;
  successHeading: string;
  successBody: string;
}

/**
 * A row in `public.leads`.
 *
 * Mirrors the live column list, in schema order. Only `parent_name` and `email`
 * are NOT NULL; everything else is optional so a partial submission can still be
 * stored. `id`, `created_at`, `source`, and `status` all have database defaults
 * and are normally omitted on insert.
 */
export interface LeadSubmission {
  /** uuid, generated by the database on insert. */
  id?: string;
  /** From the `name` input — the parent's full name. NOT NULL. */
  parent_name: string;
  /** From the `email` input. NOT NULL. */
  email: string;
  /** From the `phone` input. */
  phone?: string;
  /** From the `country` select. */
  country?: CountryOption;
  /** From the `timezone` select. */
  timezone?: TimeZoneOption;
  /** From the `age` select. */
  child_age?: ChildAgeBand;
  /** From the `subject` select. */
  subject_interest?: SubjectInterest;
  /** From the `slot` select. */
  preferred_slot?: PreferredSlot;
  /** Which call to action opened the modal. */
  plan_interest?: PlanInterest;
  /** Not captured by the booking form yet — reserved for a future free-text field. */
  message?: string;
  /** Database default: 'website'. */
  source?: string;
  /** Database default: 'new'. */
  status?: string;
  /** timestamptz, generated by the database on insert. */
  created_at?: string;
}
