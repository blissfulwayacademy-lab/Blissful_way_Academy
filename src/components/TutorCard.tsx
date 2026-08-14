import { useState } from 'react';
import { GraduationCap, Play, ShieldCheck } from 'lucide-react';
import type { Tutor } from '@/types';

type TutorCardProps = {
  tutor: Tutor;
  /** Position in the roster. Drives the alternating layout and the tile treatment. */
  index: number;
};

/**
 * One treatment for every tile: charcoal ground, gold initials.
 *
 * Only the gradient angle and a few points of opacity change between them —
 * enough that six stacked rows do not look stamped from one die, not enough to
 * introduce a second colour. The list cycles, so it holds at any roster size.
 */
const TILE_TREATMENTS = [
  { gradient: 'bg-gradient-to-br', initials: 'text-amber-400/40' },
  { gradient: 'bg-gradient-to-b', initials: 'text-amber-400/30' },
  { gradient: 'bg-gradient-to-bl', initials: 'text-amber-400/35' },
  { gradient: 'bg-gradient-to-r', initials: 'text-amber-400/30' },
  { gradient: 'bg-gradient-to-tr', initials: 'text-amber-400/40' },
  { gradient: 'bg-gradient-to-tl', initials: 'text-amber-400/35' },
];

function Badge({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">
      <Icon size={12} strokeWidth={2} />
      {label}
    </span>
  );
}

export function TutorCard({ tutor, index }: TutorCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(tutor.photoUrl) && !imageFailed;

  /** Flips the photo to the right on large screens, giving the list its rhythm. */
  const reversed = index % 2 === 1;
  const treatment = TILE_TREATMENTS[index % TILE_TREATMENTS.length];

  return (
    <article className="grid items-center gap-7 lg:grid-cols-2 lg:gap-14">
      <div className={reversed ? 'lg:order-2' : undefined}>
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/5 ${treatment.gradient} from-neutral-800 to-neutral-950`}
        >
          {showPhoto ? (
            <img
              src={tutor.photoUrl}
              alt={`${tutor.name}, ${tutor.specialisation}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,191,36,.10),transparent_55%)]" />
              <span
                className={`absolute inset-0 flex items-center justify-center font-serif text-[8rem] leading-none sm:text-[10rem] ${treatment.initials}`}
              >
                {tutor.initials}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={reversed ? 'lg:order-1' : undefined}>
        <h3 className="font-serif text-[1.6rem] leading-[1.2] text-white sm:text-[2.05rem]">
          {tutor.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-amber-300">{tutor.specialisation}</p>
        <dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
          <div className="flex gap-3">
            <dt className="sr-only">Qualification</dt>
            <GraduationCap size={16} className="mt-0.5 shrink-0 text-amber-400" strokeWidth={1.5} />
            <dd className="leading-6 text-neutral-300">{tutor.qualification}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">Classroom experience</dt>
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-amber-400" strokeWidth={1.5} />
            <dd className="leading-6 text-neutral-300">
              <span className="font-semibold text-white">{tutor.yearsExperience} years</span> of
              classroom experience
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {tutor.trcnRegistered && <Badge icon={ShieldCheck} label="TRCN Registered" />}
          {tutor.cdepCertified && <Badge icon={GraduationCap} label="CDEP Certified" />}
        </div>
        {tutor.videoUrl && (
          <a
            href={tutor.videoUrl}
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200"
          >
            <Play size={12} fill="currentColor" /> Watch {tutor.name}&apos;s introduction
          </a>
        )}
      </div>
    </article>
  );
}
