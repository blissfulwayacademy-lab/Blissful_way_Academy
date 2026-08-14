import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2 } from 'lucide-react';
import { CONTACT, FOOTER_NAV_LINKS, LOGO_ALT, LOGO_SRC } from '@/lib/content';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt={LOGO_ALT} className="h-10 w-10 rounded-full object-cover" />
            <span className="font-serif text-lg tracking-wide text-amber-100">
              Blissful Way <span className="text-amber-400">Academy</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
            Bridging culture, logic, and academic excellence for the next generation.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Facebook" className="social">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="social">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="TikTok" className="social">
              <Music2 size={16} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Explore</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-500">
            {FOOTER_NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="hover:text-amber-300">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Contact</h3>
          <div className="mt-5 space-y-4 text-sm text-neutral-500">
            <a href={`mailto:${CONTACT.email}`} className="flex gap-3 hover:text-amber-300">
              <Mail size={16} className="shrink-0 text-amber-400" />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phoneHref}`} className="flex gap-3 hover:text-amber-300">
              <MessageCircle size={16} className="shrink-0 text-amber-400" />
              {CONTACT.phoneLabel}
            </a>
            <div className="flex gap-3">
              <MapPin size={16} className="shrink-0 text-amber-400" />
              {CONTACT.location}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-neutral-600 sm:px-8">
        © {new Date().getFullYear()} Blissful Way Academy. All rights reserved.
      </div>
    </footer>
  );
}
