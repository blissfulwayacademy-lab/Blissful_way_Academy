import { TRUST_POINTS } from '@/lib/content';

export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-neutral-900/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 px-2 py-6 sm:px-6 lg:py-8">
            <Icon className="shrink-0 text-amber-400" size={22} strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-semibold capitalize text-white">{title}</h3>
              <p className="mt-1 text-xs text-neutral-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
