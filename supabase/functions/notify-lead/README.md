# notify-lead

Sends two emails through Resend whenever a row lands in `public.leads`:

1. **Internal alert** to `hello@blissfulwayacademy.online` — every column, labelled.
2. **Parent receipt** to the address on the row — confirms subject, age band and
   preferred slot, and promises a reply within 24 hours.

## Setup

The Resend key is read from the environment and is never committed:

```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
```

Then store the trigger's two Vault secrets (see the header of
`supabase/migrations/20260815120000_notify_lead_webhook.sql`) and apply the
migration.

## Deploy

```bash
npx supabase functions deploy notify-lead
```

## The honeypot branch is currently unreachable

The spec calls for skipping the parent email when the booking form's honeypot was
filled in, while still sending the internal alert. This function implements that:
it reads `record.honeypot` and, when set, sends only the internal email.

That branch never runs today, for two reasons:

- `BookingModal.tsx` returns early when the honeypot is filled and **inserts
  nothing**, so no row exists and no trigger fires.
- `public.leads` has no `honeypot` column, so there is nowhere to record it.

To make it live, both have to change: add a `honeypot boolean not null default
false` column, and change the modal to insert the row with `honeypot: true`
instead of bailing out. That is a deliberate product decision — it means
knowingly writing bot submissions into the leads table — so it has been left
alone rather than assumed.
