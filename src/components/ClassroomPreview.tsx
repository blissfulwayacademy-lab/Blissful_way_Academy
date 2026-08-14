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
      <div className="absolute -inset-8 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative rounded-[28px] border border-amber-400/25 bg-gradient-to-br from-neutral-800 to-neutral-950 p-3 shadow-2xl shadow-black/50">
        <div className="rounded-[20px] border border-white/10 bg-[#171717] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Live classroom
              </span>
            </div>
            <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] text-amber-300">
              09:41 AM
            </span>
          </div>
          <div className="relative aspect-[1.18] overflow-hidden rounded-xl bg-gradient-to-br from-[#251d0e] via-[#171717] to-[#0c1318] p-5">
            <div className="absolute right-7 top-6 h-32 w-32 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
                  Today&apos;s lesson
                </span>
                <h3 className="mt-3 max-w-xs font-serif text-2xl text-white sm:text-3xl">
                  The beauty of <span className="text-amber-300">Ọ̀nà</span>
                </h3>
                <p className="mt-2 text-xs text-neutral-400">Igbo language · Beginner level</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-black">
                    <BookOpen size={17} />
                  </div>
                  <div>
                    <div className="text-xs text-white">Word of the day</div>
                    <div className="text-[10px] text-neutral-500">Ọ̀nà means “path”</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="avatar bg-gradient-to-br from-amber-200 to-orange-600">VO</div>
                  <div className="avatar bg-gradient-to-br from-sky-200 to-blue-700">R</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Users size={14} />
              </span>{' '}
              1-on-1 session
            </div>
            <span className="text-xs text-neutral-500">CDEP certified</span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-xl sm:block">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
            <Zap size={17} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500">Learning progress</div>
            <div className="text-sm font-semibold text-white">Growing every week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
