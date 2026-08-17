import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageSection } from '@/components/PageSection';
import { UliRule } from '@/components/UliRule';
import { WhatsAppLink } from '@/components/WhatsAppLink';
import { IGBO_KICKERS, ROUTES, SUPPORT_EMAIL, TRIAL_PRICE } from '@/lib/content';
import { usePageMeta } from '@/lib/usePageMeta';

const PAGE_TITLE = 'Safeguarding | Blissful Way Academy';

/** A link to the academy's inbox, styled for the cream ground. */
function EmailLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-semibold text-gold-deep underline underline-offset-4"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

type SafeguardingProps = { onBookTrial: () => void };

export function Safeguarding({ onBookTrial }: SafeguardingProps) {
  usePageMeta(PAGE_TITLE, ROUTES.safeguarding);

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="section-kicker-light">
          <span lang="ig">{IGBO_KICKERS.safeguarding}</span>
        </p>
        <h1 className="section-title-light">Safeguarding</h1>
        <UliRule tone="light" />
        <p className="mt-6 text-sm leading-7 text-ink-muted sm:text-base">
          How we protect the children we teach — and what we can and cannot yet promise you.
        </p>

        <div className="mt-16 space-y-14">
          <PageSection heading="Who teaches your child">
            <p>
              All six tutors are registered with the Teachers Registration Council of Nigeria, the
              statutory body that licenses teaching practice nationwide. Their qualifications are
              verified, they are bound by a professional code of conduct, and they can be removed
              from the register for misconduct.
            </p>
            <p>
              Every tutor also completed our CDEP digital teaching programme. They are known to us
              personally; they trained with us. They were not recruited from a marketplace.
            </p>
          </PageSection>

          <PageSection heading="What we do not yet have">
            <p>We do not currently hold criminal record checks for our tutors.</p>
            <p>
              No tutor teaches a paid lesson without a Nigeria Police Force Character Certificate.
              We are obtaining these as each tutor takes on their first student, and we pay for them
              ourselves.
            </p>
          </PageSection>

          <PageSection heading="Every lesson is recorded">
            <p>
              All sessions are recorded and available to parents on request. Tell us and we will
              send you the recording of any lesson.
            </p>
          </PageSection>

          <PageSection heading="You are welcome in any lesson">
            <p>
              Parents may join any session, at any time, without telling us first. No notice, no
              permission. It is your child&apos;s lesson.
            </p>
          </PageSection>

          <PageSection heading="One channel, always">
            <p>
              Tutors never contact families outside agency channels — no personal phone numbers, no
              private messaging, no social media contact. Everything runs through Blissful Way
              Academy.
            </p>
            <p>If a tutor ever contacts you directly, tell us.</p>
          </PageSection>

          <PageSection heading="What we hold about your child">
            <p>
              Only what you give us on the booking form: your name, email, phone, your country and
              time zone, your child&apos;s age band, and the subject you are interested in.
            </p>
            <p>
              We do not collect your child&apos;s full name, school, address, photograph, or any
              other personal data. Write to us at <EmailLink /> and we will delete everything we
              hold.
            </p>
          </PageSection>

          <PageSection heading="If something concerns you">
            <p>
              Email <EmailLink /> or message us on WhatsApp. We reply within 24 hours and usually
              sooner.
            </p>
            <p>
              Because of the time difference we may reply outside your working hours; you will never
              wait more than a day.
            </p>
            <WhatsAppLink tone="light" className="button-outline-light mt-2" />
          </PageSection>

          {/* A coda rather than another commitment, so it takes the page's
              border rhythm but no heading — nothing here is being promised. */}
          <section className="border-t border-ink-text/10 pt-10">
            <p className="text-sm leading-7 text-ink-muted sm:text-base">
              That is everything we can tell you. The best next step is a single lesson — and you
              are welcome to sit in on it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* gold-deep, not gold: this section is on cream, where solid gold
                  measures 2.24:1. See the note in tailwind.config.js. */}
              <button onClick={onBookTrial} className="button-gold-deep">
                Book a {TRIAL_PRICE} trial session <ArrowRight size={17} />
              </button>
              <Link
                to={ROUTES.home}
                className="text-sm text-ink-muted underline underline-offset-4 hover:text-gold-deep"
              >
                Back to the homepage
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
