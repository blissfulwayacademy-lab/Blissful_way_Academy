import { TRUST_POINTS } from '@/lib/content';

export function TrustBar() {
  return (
    // First band of the light half, so it takes the alternate surface: it reads
    // as a seam against both the hero above and the cream sections below.
    <section className="border-b border-ink-text/10 bg-cream-alt">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-ink-text/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 px-2 py-6 sm:px-6 lg:py-8">
            <Icon className="shrink-0 text-gold-deep" size={22} strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-semibold capitalize text-ink-text">{title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
