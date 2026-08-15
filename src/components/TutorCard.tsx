import { useState } from 'react';
import { GraduationCap, Play, ShieldCheck } from 'lucide-react';
import type { Tutor } from '@/types';

type TutorCardProps = {
  tutor: Tutor;
  /** Position in the roster. Drives the alternating layout and the tile treatment. */
  index: number;
};

/**
 * One treatment for every tile: moss ground, bone initials.
 *
 * The dark build used charcoal tiles with gold initials, which inverted badly —
 * on cream a charcoal square reads as a hole in the page. Moss was chosen over
 * a cream-alt tile because these tiles are the portrait *fallback*, and a
 * cream-alt tile would have to sit inside a section that is already cream:
 * six near-invisible squares. Moss gives the light half its only mass, echoes
 * the maths programme's card tint, and carries bone initials at 8.16:1.
 *
 * Only the gradient angle and a few points of opacity change between them —
 * enough that six stacked rows do not look stamped from one die, not enough to
 * introduce a second colour. The list cycles, so it holds at any roster size.
 */
const TILE_TREATMENTS = [
  { gradient: 'bg-gradient-to-br', initials: 'text-bone/90' },
  { gradient: 'bg-gradient-to-b', initials: 'text-bone/75' },
  { gradient: 'bg-gradient-to-bl', initials: 'text-bone/85' },
  { gradient: 'bg-gradient-to-r', initials: 'text-bone/75' },
  { gradient: 'bg-gradient-to-tr', initials: 'text-bone/90' },
  { gradient: 'bg-gradient-to-tl', initials: 'text-bone/85' },
];

/** Inverted for the light half: was a dark pill with gold text, now solid. */
function Badge({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-deep px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream">
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

  /**
   * The portrait column is a fixed 280px so the row reads as
   * portrait-and-details rather than photo-dominated. The template has to flip
   * with `reversed`, since column widths are positional — the order classes
   * alone would drop the portrait into the wide column.
   */
  return (
    <article
      className={`grid items-center gap-7 lg:gap-14 ${
        reversed ? 'lg:grid-cols-[1fr_280px]' : 'lg:grid-cols-[280px_1fr]'
      }`}
    >
      <div className={reversed ? 'lg:order-2' : undefined}>
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-3xl border border-ink-text/10 bg-moss ${treatment.gradient} from-ink/25 via-transparent to-transparent`}
        >
          {showPhoto ? (
            <img
              src={tutor.photoUrl}
              alt={`${tutor.name}, ${tutor.specialisation}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover object-[center_25%]"
            />
          ) : (
            <>
              {/* Was a warm amber bloom on charcoal; on moss the same lift has
                  to come from bone, since gold on green muddies both. */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(245,242,234,.12),transparent_55%)]" />
              <span
                className={`absolute inset-0 flex items-center justify-center font-serif text-[5rem] leading-none sm:text-[6rem] ${treatment.initials}`}
              >
                {tutor.initials}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={reversed ? 'lg:order-1' : undefined}>
        <h3 className="font-serif text-[1.6rem] leading-[1.2] text-ink-text sm:text-[2.05rem]">
          {tutor.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-gold-deep">{tutor.specialisation}</p>
        <dl className="mt-5 space-y-3 border-t border-ink-text/10 pt-5 text-sm">
          <div className="flex gap-3">
            <dt className="sr-only">Qualification</dt>
            <GraduationCap size={16} className="mt-0.5 shrink-0 text-gold-deep" strokeWidth={1.5} />
            <dd className="leading-6 text-ink-muted">{tutor.qualification}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">Classroom experience</dt>
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-deep" strokeWidth={1.5} />
            <dd className="leading-6 text-ink-muted">
              <span className="font-semibold text-ink-text">{tutor.yearsExperience} years</span> of
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
            // Hover shifts to an underline rather than a lighter gold, which on
            // cream would drop the link below the 4.5:1 floor exactly when it
            // is being pointed at.
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gold-deep underline-offset-4 hover:underline"
          >
            <Play size={12} fill="currentColor" /> Watch {tutor.name}&apos;s introduction
          </a>
        )}
      </div>
    </article>
  );
}
