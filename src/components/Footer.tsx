import { Instagram, Mail, MapPin, MessageCircle, Music2 } from 'lucide-react';
import { CONTACT, FOOTER_NAV_LINKS, LOGO_ALT, LOGO_SRC, SOCIAL_LINKS } from '@/lib/content';

/** Keyed by the label in SOCIAL_LINKS, so adding a network is a two-line change. */
const SOCIAL_ICONS = { Instagram, TikTok: Music2 } as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt={LOGO_ALT} className="h-10 w-auto object-contain" />
            <span className="font-serif text-lg tracking-wide text-bone">
              Blissful Way <span className="text-gold">Academy</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-6 text-bone-muted">
            Bridging culture, logic, and academic excellence for the next generation.
          </p>
          {/* rel="noopener noreferrer" is required alongside target="_blank":
              without noopener the opened tab gets a handle on this window via
              window.opener and can navigate it elsewhere. */}
          <div className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={`${label} (opens in a new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Explore</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-bone-muted">
            {FOOTER_NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="hover:text-gold">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Contact</h3>
          <div className="mt-5 space-y-4 text-sm text-bone-muted">
            <a href={`mailto:${CONTACT.email}`} className="flex gap-3 hover:text-gold">
              <Mail size={16} className="shrink-0 text-gold" />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phoneHref}`} className="flex gap-3 hover:text-gold">
              <MessageCircle size={16} className="shrink-0 text-gold" />
              {CONTACT.phoneLabel}
            </a>
            <div className="flex gap-3">
              <MapPin size={16} className="shrink-0 text-gold" />
              {CONTACT.location}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-bone-muted sm:px-8">
        © {new Date().getFullYear()} Blissful Way Academy. All rights reserved.
      </div>
    </footer>
  );
}
