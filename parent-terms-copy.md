# Terms of Service — page copy

Igbo kicker: **Nkwekọrịta** / Terms of Service

Subtitle: *What you can expect from us, and what we ask of you.*

---

## Who we are

Blissful Way Academy provides live online Igbo language lessons to children aged 4 to 16, and early years mathematics lessons to children aged 4 to 9, taught by teachers registered with the Teachers Registration Council of Nigeria.

We are operated by Igwe Chinagolum Arinzechukwu, trading as Blissful Way Academy, of Ukehe, Igbo-Etiti Local Government Area, Enugu State, Nigeria. Registration with the Corporate Affairs Commission is in progress.

You can reach us at hello@blissfulwayacademy.online or on WhatsApp at +234 810 474 8877.

---

## Booking a trial lesson

A trial lesson costs $15 and lasts 30 minutes. It lets your child meet a tutor and lets you see how we teach before committing to anything.

If you change your mind before the trial takes place, tell us and we will refund you in full. Once the trial has been taught, the fee is not refundable.

---

## Lessons and plans

Our plans are monthly and paid in advance. The hours included in a plan are for use within that month.

We will always tell you which tutor is teaching your child, and you will meet them before lessons begin.

---

## Scheduling and time zones

Our tutors are in Nigeria (WAT, UTC+1). We teach:

- **United Kingdom and Ireland** — weekday evenings, 4pm to 8pm your time
- **North America** — Saturday and Sunday mornings, 9am to 1pm your time

We schedule this way deliberately. It means your child is taught by someone who is alert and prepared, rather than someone teaching at two in the morning.

If you need a slot outside these hours, ask us. We will tell you honestly whether we can cover it.

---

## Rescheduling a lesson

Life happens, and children have bad days. You may reschedule **two lessons per month free of charge**, provided you give us at least 24 hours' notice.

Tell us by email or WhatsApp and we will find another slot in the same month.

---

## Late cancellations

If you cancel with **less than 24 hours' notice**, or your child does not attend, that lesson counts as taught and is not refunded or rescheduled.

We are sorry to be firm about this. Your tutor has set aside that hour, prepared for it, and turned down other work. We pay them in full for late cancellations, and we would rather tell you that plainly than absorb it quietly and pay them less.

---

## If we cancel

Sometimes we will be the ones to cancel — a tutor falls ill, or the power or internet fails at their end. Nigeria's infrastructure is not always reliable and we will not pretend otherwise.

When that happens, you choose: reschedule the lesson at a time that suits you, or take a refund for it. Whichever you prefer.

---

## Your first month — our guarantee

**If Blissful Way Academy is not right for your child, tell us within your first month and we will refund every hour you have not used, in full, to your original payment method.**

No forms, no explanation required.

We ask you to trust an academy in Nigeria with your child's learning. This is how we carry some of that risk with you.

---

## After your first month

From your second month onwards, unused hours become **credit on your account, valid for 60 days**. You can use credit on any tutor, either subject, and for any child in your family.

We do not refund unused hours in cash after the first month, because payment processing fees make repeated refunds costly for a business of our size. Credit never expires unused without warning — we will remind you before it does.

---

## Changing tutor

If your child does not connect with their tutor, tell us. You may **switch tutor twice, free of charge**, and we will not ask you to justify it.

A child learns from someone they like. Finding the right match matters more to us than any individual tutor's schedule.

---

## Recording and safeguarding

Every lesson is recorded, and recordings are available to you on request. You are welcome to join any lesson, at any time, without telling us first.

Our tutors never contact families outside Blissful Way Academy's own channels. If a tutor contacts you directly, please tell us.

Full details are on our Safeguarding page.

---

## Information we hold

We hold only what you give us when you book: your name, email address, telephone number, your country and time zone, your child's age band, and the subject you are interested in.

We do not collect your child's full name, school, address or photograph.

Write to us at hello@blissfulwayacademy.online at any time and we will delete everything we hold about you.

---

## If something goes wrong

Email hello@blissfulwayacademy.online or message us on WhatsApp. We reply within 24 hours and usually sooner.

Because of the time difference, our reply may arrive outside your working hours. You will never wait more than a day.

---

## Changes to these terms

If we change these terms, we will email you at least 14 days beforehand. Changes never apply to a month you have already paid for.

---

## Governing law

These terms are governed by the laws of the Federal Republic of Nigeria. Nothing here affects any statutory rights you have as a consumer in your own country.

*Last updated: [date]*

---

# Build notes for Claude Code

- New route `/terms`, same treatment as `/safeguarding` — light cream, same typography, bilingual kicker, UliRule beneath the title
- Link from the footer, not the main nav (safeguarding earns nav placement; terms does not)
- Add to `public/sitemap.xml`
- Add a short line to the booking modal above the submit button: "By booking you agree to our Terms of Service" with `/terms` linked
- On the pricing section, add one line under the Starter and Dual cards: **"First month money-back guarantee"**
- **Change the Group Cohort card** to "Cohorts opening soon — join the waitlist", with the price removed and the button changed to register interest. Route that to the same booking modal with `plan_interest: 'cohort_waitlist'`
