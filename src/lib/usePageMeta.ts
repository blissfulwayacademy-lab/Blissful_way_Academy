import { useEffect } from 'react';
import { SITE_ORIGIN } from '@/lib/content';

/**
 * Points the document title and canonical at the route currently mounted.
 *
 * index.html is a single static document shared by every route, so both still
 * describe the homepage otherwise. Left alone, the canonical would tell search
 * engines this page is a duplicate of / and drop it from the index. Both are
 * restored on unmount, so returning to the homepage returns its own metadata.
 */
export function usePageMeta(title: string, canonicalPath: string) {
  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousTitle = document.title;
    const previousCanonical = canonical?.href;

    document.title = title;
    if (canonical) canonical.href = `${SITE_ORIGIN}${canonicalPath}`;

    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, [title, canonicalPath]);
}
