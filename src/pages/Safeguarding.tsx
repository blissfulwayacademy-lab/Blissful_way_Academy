import { useEffect, type ReactNode } from 'react';
import { UliRule } from '@/components/UliRule';
import { WhatsAppLink } from '@/components/WhatsAppLink';
import { IGBO_KICKERS, ROUTES, SITE_ORIGIN, SUPPORT_EMAIL } from '@/lib/content';

const PAGE_TITLE = 'Safeguarding | Blissful Way Academy';

/**
 * index.html is a single static document shared by every route, so its <title>
 * and canonical still describe the homepage when this page is mounted. Left
 * alone, the canonical would tell search engines /safeguarding is a duplicate of
 * / and drop it from the index. Both are restored on unmount, so returning to
 * the homepage returns its own metadata.
 */
function usePageMeta(title: string, canonicalPath: string) {
  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousTitle = document.title;
    const previousCanonical = canonical?.href;

    document.title = title;
    if (canonical) canonical.href = `${SITE_ORIGIN}${canonicalPath}`;

    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, [title, canonicalPath]);
}

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

/**
 * One safeguarding commitment.
 *
 * Every section gets the same heading, the same measure, and the same weight —
 * including the one about what the academy does not yet have. A promise and an
 * admission rendered identically is the point: nothing here is dressed up or
 * tucked away.
 */
function Commitment({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink-text/10 pt-10">
      <h2 className="font-serif text-[1.6rem] leading-[1.25] text-ink-text sm:text-[2.05rem]">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-ink-muted sm:text-base">{children}</div>
    </section>
  );
}

export function Safeguarding() {
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
          <Commitment heading="Who teaches your child">
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
          </Commitment>

          <Commitment heading="What we do not yet have">
            <p>We do not currently hold criminal record checks for our tutors.</p>
            <p>
              We are working towards Nigeria Police Force character certificates for every tutor,
              and we will publish that here when it is complete. We would rather tell you this
              plainly than let you assume otherwise.
            </p>
          </Commitment>

          <Commitment heading="Every lesson is recorded">
            <p>
              All sessions are recorded and available to parents on request. Tell us and we will
              send you the recording of any lesson.
            </p>
          </Commitment>

          <Commitment heading="You are welcome in any lesson">
            <p>
              Parents may join any session, at any time, without telling us first. No notice, no
              permission. It is your child&apos;s lesson.
            </p>
          </Commitment>

          <Commitment heading="One channel, always">
            <p>
              Tutors never contact families outside agency channels — no personal phone numbers, no
              private messaging, no social media contact. Everything runs through Blissful Way
              Academy.
            </p>
            <p>If a tutor ever contacts you directly, tell us.</p>
          </Commitment>

          <Commitment heading="What we hold about your child">
            <p>
              Only what you give us on the booking form: your name, email, phone, your country and
              time zone, your child&apos;s age band, and the subject you are interested in.
            </p>
            <p>
              We do not collect your child&apos;s full name, school, address, photograph, or any
              other personal data. Write to us at <EmailLink /> and we will delete everything we
              hold.
            </p>
          </Commitment>

          <Commitment heading="If something concerns you">
            <p>
              Email <EmailLink /> or message us on WhatsApp. We reply within 24 hours and usually
              sooner.
            </p>
            <p>
              Because of the time difference we may reply outside your working hours; you will never
              wait more than a day.
            </p>
            <WhatsAppLink tone="light" className="button-outline-light mt-2" />
          </Commitment>
        </div>
      </div>
    </main>
  );
}
