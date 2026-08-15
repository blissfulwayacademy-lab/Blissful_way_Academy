import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MobileNav } from '@/components/MobileNav';
import { LOGO_ALT, LOGO_SRC, NAV_LINKS, TRIAL_PRICE } from '@/lib/content';

type HeaderProps = { onBookTrial: () => void };

export function Header({ onBookTrial }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const bookAndCloseMenu = () => {
    closeMenu();
    onBookTrial();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="flex items-center gap-3" onClick={closeMenu}>
          <img src={LOGO_SRC} alt={LOGO_ALT} className="h-11 w-auto object-contain" />
          <span className="font-serif text-base tracking-wide text-bone sm:text-lg">
            Blissful Way <span className="text-gold">Academy</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-[13px] text-bone lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="transition hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={bookAndCloseMenu}
          className="hidden rounded-full bg-gold px-5 py-3 text-xs font-bold text-ink transition hover:bg-gold/90 sm:block"
        >
          Book {TRIAL_PRICE} Trial
        </button>
        <button
          className="rounded-lg p-2 text-bone lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && <MobileNav onNavigate={closeMenu} onBookTrial={bookAndCloseMenu} />}
    </header>
  );
}
