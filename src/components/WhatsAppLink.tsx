import { MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/content';

/**
 * The academy's WhatsApp chat link, opening with a message already written.
 *
 * rel="noopener noreferrer" is required alongside target="_blank": without
 * noopener the opened tab gets a handle on this window via window.opener and can
 * navigate it elsewhere.
 *
 * `tone` follows the same rule as `UliRule` — `gold` reads on the dark ground,
 * `gold-deep` on the cream sections, and the two are not interchangeable.
 */
type WhatsAppLinkProps = {
  className?: string;
  tone?: 'dark' | 'light';
};

export function WhatsAppLink({ className, tone = 'dark' }: WhatsAppLinkProps) {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp us (opens in a new tab)"
      className={className}
    >
      <MessageCircle
        size={16}
        aria-hidden="true"
        className={`shrink-0 ${tone === 'light' ? 'text-gold-deep' : 'text-gold'}`}
      />
      WhatsApp us
    </a>
  );
}
