import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/content';
import type { NavLink } from '@/types';

type NavItemProps = {
  link: NavLink;
  className?: string;
  /** Closes the mobile drawer after a link is followed. */
  onClick?: () => void;
};

/**
 * One navigation entry, rendered as the right kind of element for its target.
 *
 * Homepage anchors stay a plain `<a>` on purpose. Router `<Link>` does not scroll
 * to a fragment, so routing '/#pricing' through it would land the reader at the
 * top of the homepage instead of at the pricing table; a plain anchor keeps the
 * browser's own fragment handling — and `scroll-behavior: smooth` — working
 * exactly as it did before the router existed. From another route the same
 * anchor is a normal cross-document navigation, which also scrolls correctly.
 *
 * Route entries go through `<Link>` for a client-side transition.
 */
export function NavItem({ link, className, onClick }: NavItemProps) {
  const isHomeAnchor = link.href.startsWith(`${ROUTES.home}#`);

  if (isHomeAnchor) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}
