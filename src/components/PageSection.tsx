import type { ReactNode } from 'react';

type PageSectionProps = {
  heading: string;
  children: ReactNode;
};

/**
 * One section of a long-form page (Safeguarding, Terms).
 *
 * Both pages share this rather than each keeping their own copy, so the section
 * rhythm cannot drift apart as either is edited.
 *
 * Every section gets the same heading, measure and weight — including the ones
 * that carry bad news, like what the academy does not yet have or what happens
 * when a parent cancels late. A promise and an admission rendered identically is
 * the point: nothing is dressed up, and nothing is tucked away.
 */
export function PageSection({ heading, children }: PageSectionProps) {
  return (
    <section className="border-t border-ink-text/10 pt-10">
      <h2 className="font-serif text-[1.6rem] leading-[1.25] text-ink-text sm:text-[2.05rem]">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-ink-muted sm:text-base">{children}</div>
    </section>
  );
}
