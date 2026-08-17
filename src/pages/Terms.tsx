import { Link } from 'react-router-dom';
import { PageSection } from '@/components/PageSection';
import { UliRule } from '@/components/UliRule';
import {
  CONTACT,
  IGBO_KICKERS,
  ROUTES,
  SUPPORT_EMAIL,
  TERMS_LAST_UPDATED,
  TRIAL_PRICE,
} from '@/lib/content';
import { usePageMeta } from '@/lib/usePageMeta';

const PAGE_TITLE = 'Terms of Service | Blissful Way Academy';

/** The academy's inbox, styled for the cream ground. */
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

export function Terms() {
  usePageMeta(PAGE_TITLE, ROUTES.terms);

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="section-kicker-light">
          <span lang="ig">{IGBO_KICKERS.terms}</span>
        </p>
        <h1 className="section-title-light">Terms of Service</h1>
        <UliRule tone="light" />
        <p className="mt-6 text-sm leading-7 text-ink-muted sm:text-base">
          What you can expect from us, and what we ask of you.
        </p>

        <div className="mt-16 space-y-14">
          <PageSection heading="Who we are">
            <p>
              Blissful Way Academy provides live online Igbo language lessons to children aged 4 to
              16, and early years mathematics lessons to children aged 4 to 9, taught by teachers
              registered with the Teachers Registration Council of Nigeria.
            </p>
            <p>
              We are operated by Igwe Chinagolum Arinzechukwu, trading as Blissful Way Academy, of
              Ukehe, Igbo-Etiti Local Government Area, Enugu State, Nigeria. Registration with the
              Corporate Affairs Commission is in progress.
            </p>
            <p>
              You can reach us at <EmailLink /> or on WhatsApp at {CONTACT.phoneLabel}.
            </p>
          </PageSection>

          <PageSection heading="Booking a trial lesson">
            <p>
              A trial lesson costs {TRIAL_PRICE} and lasts 30 minutes. It lets your child meet a
              tutor and lets you see how we teach before committing to anything.
            </p>
            <p>
              If you change your mind before the trial takes place, tell us and we will refund you
              in full. Once the trial has been taught, the fee is not refundable.
            </p>
          </PageSection>

          <PageSection heading="Lessons and plans">
            <p>
              Our plans are monthly and paid in advance. The hours included in a plan are for use
              within that month.
            </p>
            <p>
              We will always tell you which tutor is teaching your child, and you will meet them
              before lessons begin.
            </p>
          </PageSection>

          <PageSection heading="Scheduling and time zones">
            <p>Our tutors are in Nigeria (WAT, UTC+1). We teach:</p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                <strong className="font-semibold text-ink-text">United Kingdom and Ireland</strong>{' '}
                — weekday evenings, 4pm to 8pm your time
              </li>
              <li className="list-disc">
                <strong className="font-semibold text-ink-text">North America</strong> — Saturday
                and Sunday mornings, 9am to 1pm your time
              </li>
            </ul>
            <p>
              We schedule this way deliberately. It means your child is taught by someone who is
              alert and prepared, rather than someone teaching at two in the morning.
            </p>
            <p>
              If you need a slot outside these hours, ask us. We will tell you honestly whether we
              can cover it.
            </p>
          </PageSection>

          <PageSection heading="Rescheduling a lesson">
            <p>
              Life happens, and children have bad days. You may reschedule{' '}
              <strong className="font-semibold text-ink-text">
                two lessons per month free of charge
              </strong>
              , provided you give us at least 24 hours&apos; notice.
            </p>
            <p>Tell us by email or WhatsApp and we will find another slot in the same month.</p>
          </PageSection>

          <PageSection heading="Late cancellations">
            <p>
              If you cancel with{' '}
              <strong className="font-semibold text-ink-text">
                less than 24 hours&apos; notice
              </strong>
              , or your child does not attend, that lesson counts as taught and is not refunded or
              rescheduled.
            </p>
            <p>
              We are sorry to be firm about this. Your tutor has set aside that hour, prepared for
              it, and turned down other work. We pay them in full for late cancellations, and we
              would rather tell you that plainly than absorb it quietly and pay them less.
            </p>
          </PageSection>

          <PageSection heading="If we cancel">
            <p>
              Sometimes we will be the ones to cancel — a tutor falls ill, or the power or internet
              fails at their end. Nigeria&apos;s infrastructure is not always reliable and we will
              not pretend otherwise.
            </p>
            <p>
              When that happens, you choose: reschedule the lesson at a time that suits you, or take
              a refund for it. Whichever you prefer.
            </p>
          </PageSection>

          <PageSection heading="Your first month — our guarantee">
            <p>
              <strong className="font-semibold text-ink-text">
                If Blissful Way Academy is not right for your child, tell us within your first month
                and we will refund every hour you have not used, in full, to your original payment
                method.
              </strong>
            </p>
            <p>No forms, no explanation required.</p>
            <p>
              We ask you to trust an academy in Nigeria with your child&apos;s learning. This is how
              we carry some of that risk with you.
            </p>
          </PageSection>

          <PageSection heading="After your first month">
            <p>
              From your second month onwards, unused hours become{' '}
              <strong className="font-semibold text-ink-text">
                credit on your account, valid for 60 days
              </strong>
              . You can use credit on any tutor, either subject, and for any child in your family.
            </p>
            <p>
              We do not refund unused hours in cash after the first month, because payment
              processing fees make repeated refunds costly for a business of our size. Credit never
              expires unused without warning — we will remind you before it does.
            </p>
          </PageSection>

          <PageSection heading="Changing tutor">
            <p>
              If your child does not connect with their tutor, tell us. You may{' '}
              <strong className="font-semibold text-ink-text">
                switch tutor twice, free of charge
              </strong>
              , and we will not ask you to justify it.
            </p>
            <p>
              A child learns from someone they like. Finding the right match matters more to us than
              any individual tutor&apos;s schedule.
            </p>
          </PageSection>

          <PageSection heading="Recording and safeguarding">
            <p>
              Every lesson is recorded, and recordings are available to you on request. You are
              welcome to join any lesson, at any time, without telling us first.
            </p>
            <p>
              Our tutors never contact families outside Blissful Way Academy&apos;s own channels. If
              a tutor contacts you directly, please tell us.
            </p>
            <p>
              Full details are on our{' '}
              <Link
                to={ROUTES.safeguarding}
                className="font-semibold text-gold-deep underline underline-offset-4"
              >
                Safeguarding page
              </Link>
              .
            </p>
          </PageSection>

          <PageSection heading="Information we hold">
            <p>
              We hold only what you give us when you book: your name, email address, telephone
              number, your country and time zone, your child&apos;s age band, and the subject you
              are interested in.
            </p>
            <p>We do not collect your child&apos;s full name, school, address or photograph.</p>
            <p>
              Write to us at <EmailLink /> at any time and we will delete everything we hold about
              you.
            </p>
          </PageSection>

          <PageSection heading="If something goes wrong">
            <p>
              Email <EmailLink /> or message us on WhatsApp. We reply within 24 hours and usually
              sooner.
            </p>
            <p>
              Because of the time difference, our reply may arrive outside your working hours. You
              will never wait more than a day.
            </p>
          </PageSection>

          <PageSection heading="Changes to these terms">
            <p>
              If we change these terms, we will email you at least 14 days beforehand. Changes never
              apply to a month you have already paid for.
            </p>
          </PageSection>

          <PageSection heading="Governing law">
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Nothing here
              affects any statutory rights you have as a consumer in your own country.
            </p>
          </PageSection>
        </div>

        <p className="mt-14 border-t border-ink-text/10 pt-8 text-sm italic text-ink-muted">
          Last updated: {TERMS_LAST_UPDATED}
        </p>
      </div>
    </main>
  );
}
