import { ArrowRight } from 'lucide-react';
import { NAV_LINKS, TRIAL_PRICE } from '@/lib/content';

type MobileNavProps = {
  /** Closes the drawer after a link is followed. */
  onNavigate: () => void;
  onBookTrial: () => void;
};

export function MobileNav({ onNavigate, onBookTrial }: MobileNavProps) {
  return (
    <nav className="border-t border-white/10 bg-neutral-950 px-5 py-5 lg:hidden">
      <div className="flex flex-col gap-5 text-sm text-neutral-300">
        {NAV_LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} onClick={onNavigate}>
            {link.label}
          </a>
        ))}
        <button onClick={onBookTrial} className="button-gold w-full">
          Book {TRIAL_PRICE} Trial <ArrowRight size={16} />
        </button>
      </div>
    </nav>
  );
}
