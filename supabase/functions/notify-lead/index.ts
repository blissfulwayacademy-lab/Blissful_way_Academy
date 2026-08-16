/**
 * notify-lead — fires on every insert into public.leads.
 *
 * Sends two emails through Resend: an internal alert holding the whole row, and
 * a short receipt to the parent confirming what they asked for.
 *
 * Invoked by the `notify_lead_after_insert` trigger (see the migration that
 * accompanies this function). The trigger runs AFTER INSERT via pg_net, so the
 * row is already committed before this function is reached — nothing that
 * happens in here can prevent a lead being stored. Failures are logged and
 * swallowed for the same reason.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Verified sender in Resend. The domain blissfulwayacademy.online is verified. */
const FROM = 'Blissful Way Academy <hello@blissfulwayacademy.online>';

/** Where the internal alert lands, and the reply-to on the parent's receipt. */
const INTERNAL_INBOX = 'hello@blissfulwayacademy.online';

/** A row of public.leads, as delivered in the webhook payload. */
interface LeadRecord {
  id?: string;
  parent_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  child_age?: string;
  subject_interest?: string;
  preferred_slot?: string;
  plan_interest?: string;
  message?: string;
  source?: string;
  status?: string;
  created_at?: string;
  /**
   * Set when the booking form's hidden honeypot was filled in, which only an
   * automated form filler does. See the note in the README: the current client
   * drops these submissions before they reach the database, so in practice this
   * arrives undefined.
   */
  honeypot?: boolean | string | null;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: LeadRecord;
}

/**
 * Friendly labels for the values stored in Postgres.
 *
 * `subject_interest` in particular stores 'Math', which must not be shown to a
 * parent on a site that says "Early Years Maths" everywhere else.
 */
const SUBJECT_LABELS: Record<string, string> = {
  Igbo: 'Igbo Language',
  Math: 'Early Years Maths',
  Both: 'Igbo Language and Early Years Maths',
};

const PLAN_LABELS: Record<string, string> = {
  trial: 'Trial session',
  starter: 'Starter Bundle',
  dual: 'Heritage & STEM Dual Programme',
  cohort: 'Group Cohort',
};

/** Escapes text before it goes into an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Renders a possibly-absent column for display. */
function show(value: string | undefined | null): string {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed === '' ? '—' : trimmed;
}

function label(value: string | undefined, lookup: Record<string, string>): string {
  if (!value) return '—';
  return lookup[value] ?? value;
}

/** Formats the insert timestamp in UK time, which is where the academy operates. */
function formatTimestamp(iso: string | undefined): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/London',
  }).format(parsed);
}

/** True when the hidden honeypot field was populated, in any of its stored forms. */
function isHoneypotTriggered(record: LeadRecord): boolean {
  const flag = record.honeypot;
  if (typeof flag === 'boolean') return flag;
  if (typeof flag === 'string') return flag.trim() !== '' && flag.trim().toLowerCase() !== 'false';
  return false;
}

interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

function buildInternalEmail(record: LeadRecord): Email {
  const rows: [string, string][] = [
    ['Parent name', show(record.parent_name)],
    ['Email', show(record.email)],
    ['Phone', show(record.phone)],
    // Country sits with the phone number and time zone rather than down with the
    // bookkeeping columns: together they are what decides when someone can
    // actually be called back, which is the first thing read off this alert.
    ['Country', show(record.country)],
    ['Time zone', show(record.timezone)],
    ["Child's age", show(record.child_age)],
    ['Subject interest', label(record.subject_interest, SUBJECT_LABELS)],
    ['Preferred slot', show(record.preferred_slot)],
    ['Plan interest', label(record.plan_interest, PLAN_LABELS)],
    ['Message', show(record.message)],
    ['Source', show(record.source)],
    ['Status', show(record.status)],
    ['Submitted', formatTimestamp(record.created_at)],
    ['Lead ID', show(record.id)],
  ];

  const text = rows.map(([key, value]) => `${key}: ${value}`).join('\n');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;color:#111;">
      <h2 style="margin:0 0 4px;font-size:18px;">New trial booking</h2>
      <p style="margin:0 0 16px;color:#555;">${escapeHtml(show(record.parent_name))} submitted the booking form.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${rows
          .map(
            ([key, value]) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap;">${escapeHtml(key)}</td>
          <td style="padding:6px 0;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
          )
          .join('')}
      </table>
    </div>
  `.trim();

  return {
    to: INTERNAL_INBOX,
    subject: `New trial booking — ${show(record.parent_name)}`,
    html,
    text,
    // Replying to the alert writes straight back to the parent.
    replyTo: record.email?.trim() || undefined,
  };
}

function buildParentEmail(record: LeadRecord): Email | null {
  const to = record.email?.trim();
  if (!to) return null;

  const firstName = show(record.parent_name).split(/\s+/)[0];
  const subject = label(record.subject_interest, SUBJECT_LABELS);
  const age = show(record.child_age);
  const slot = show(record.preferred_slot);

  const confirmations: string[] = [];
  if (subject !== '—') confirmations.push(`Subject: ${subject}`);
  if (age !== '—') confirmations.push(`Child's age: ${age}`);
  if (slot !== '—') confirmations.push(`Preferred time: ${slot}`);

  const text = [
    `Dear ${firstName},`,
    '',
    'Thank you for requesting a trial lesson with Blissful Way Academy.',
    '',
    ...(confirmations.length > 0
      ? ['Here is what you told us:', ...confirmations.map((line) => `  • ${line}`), '']
      : []),
    'We will reply within 24 hours to agree a time that suits your family.',
    '',
    `If you need to add anything in the meantime, just reply to this email or write to ${INTERNAL_INBOX} — it reaches us directly.`,
    '',
    'Warm regards,',
    'Blissful Way Academy',
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;">
      <p style="margin:0 0 14px;">Dear ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 14px;">Thank you for requesting a trial lesson with Blissful Way Academy.</p>
      ${
        confirmations.length > 0
          ? `<p style="margin:0 0 8px;">Here is what you told us:</p>
      <ul style="margin:0 0 14px;padding-left:20px;">
        ${confirmations.map((line) => `<li style="margin:0 0 4px;">${escapeHtml(line)}</li>`).join('')}
      </ul>`
          : ''
      }
      <p style="margin:0 0 14px;">We will reply within 24 hours to agree a time that suits your family.</p>
      <p style="margin:0 0 14px;">If you need to add anything in the meantime, just reply to this email or write to <a href="mailto:${INTERNAL_INBOX}" style="color:#b45309;">${INTERNAL_INBOX}</a> — it reaches us directly.</p>
      <p style="margin:0;">Warm regards,<br /><strong>Blissful Way Academy</strong></p>
    </div>
  `.trim();

  return {
    to,
    subject: 'Your trial lesson request — Blissful Way Academy',
    html,
    text,
    replyTo: INTERNAL_INBOX,
  };
}

/** Posts one email to Resend. Never throws — the caller only needs to know if it worked. */
async function send(apiKey: string, email: Email, kind: string): Promise<boolean> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      // Read as text: Resend returns JSON on error, but a gateway failure may not.
      const detail = await response.text();
      console.error(`notify-lead: ${kind} email rejected (${response.status}): ${detail}`);
      return false;
    }

    console.log(`notify-lead: ${kind} email accepted by Resend`);
    return true;
  } catch (error) {
    console.error(`notify-lead: ${kind} email threw:`, error);
    return false;
  }
}

Deno.serve(async (request: Request) => {
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    // Nothing to retry against — surface it loudly in the function logs instead.
    console.error('notify-lead: RESEND_API_KEY is not set; no email sent');
    return json({ error: 'RESEND_API_KEY is not configured' }, 500);
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('notify-lead: body was not valid JSON:', error);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const record = payload.record;
  if (!record || typeof record !== 'object') {
    console.error('notify-lead: payload had no `record`:', JSON.stringify(payload));
    return json({ error: 'Payload is missing `record`' }, 400);
  }

  const honeypot = isHoneypotTriggered(record);
  if (honeypot) {
    console.warn(`notify-lead: honeypot set on lead ${show(record.id)}; skipping parent email`);
  }

  const internalSent = await send(apiKey, buildInternalEmail(record), 'internal');

  let parentSent = false;
  let parentSkipped: string | null = null;

  if (honeypot) {
    parentSkipped = 'honeypot';
  } else {
    const parentEmail = buildParentEmail(record);
    if (!parentEmail) {
      parentSkipped = 'no email address on the row';
      console.warn(`notify-lead: lead ${show(record.id)} has no email; skipping parent email`);
    } else {
      parentSent = await send(apiKey, parentEmail, 'parent');
    }
  }

  // Always 200 once the payload parsed. pg_net does not retry, and a retry would
  // duplicate whichever email did go out, so failures are reported in the body
  // and in the logs rather than as a status code.
  return json({
    lead_id: record.id ?? null,
    internal_email: internalSent ? 'sent' : 'failed',
    parent_email: parentSkipped ? `skipped: ${parentSkipped}` : parentSent ? 'sent' : 'failed',
  });
});
