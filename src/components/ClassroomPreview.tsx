import { BookOpen, Users, Zap } from 'lucide-react';

/**
 * The mock "live classroom" panel beside the hero copy.
 *
 * Entirely decorative and built from CSS gradients — there is no real video or
 * screenshot behind it.
 */
export function ClassroomPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      <div className="absolute -inset-8 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative rounded-[28px] border border-gold/25 bg-gradient-to-br from-ink-raised to-ink p-3 shadow-2xl shadow-black/50">
        <div className="rounded-[20px] border border-white/10 bg-ink-raised p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-live" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-bone-muted">
                Live classroom
              </span>
            </div>
            <span className="rounded-full bg-gold/10 px-2 py-1 text-[10px] text-gold">
              09:41 AM
            </span>
          </div>
          <div className="relative aspect-[1.18] overflow-hidden rounded-xl bg-gradient-to-br from-[#251d0e] via-ink-raised to-[#0c1318] p-5">
            <div className="absolute right-7 top-6 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                  Today&apos;s lesson
                </span>
                <h3
                  lang="ig"
                  className="mt-3 max-w-xs font-serif text-[1.6rem] text-bone sm:text-[2.05rem]"
                >
                  Ịdị mma nke <span className="text-gold">ụmụnne</span>
                </h3>
                <p className="mt-2 text-xs text-bone-muted">Igbo language · Beginner level</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-ink">
                    <BookOpen size={17} />
                  </div>
                  <div>
                    <div className="text-xs text-bone">Word of the day</div>
                    <div className="text-[10px] text-bone-muted">
                      <span lang="ig">Ụmụnne</span> means Brethren
                    </div>
                  </div>
                </div>
                {/* The two participants are the tutor tile at chip scale: same
                    charcoal ground, same gold initials, and the same pair of
                    gradient angles the first two tiles in the roster use. */}
                <div className="flex -space-x-2">
                  <div className="avatar bg-gradient-to-br from-ink-raised to-ink text-gold">
                    VO
                  </div>
                  <div className="avatar bg-gradient-to-b from-ink-raised to-ink text-gold/80">
                    R
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-bone">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-live/15 text-live">
                <Users size={14} />
              </span>{' '}
              1-on-1 session
            </div>
            <span className="text-xs text-bone-muted">CDEP certified</span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-ink-raised p-3 shadow-xl sm:block">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-live/10 p-2 text-live">
            <Zap size={17} />
          </div>
          <div>
            <div className="text-[10px] text-bone-muted">Learning progress</div>
            <div className="text-sm font-semibold text-bone">Growing every week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
