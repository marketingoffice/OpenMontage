import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BRAND, GOLD } from './theme';
import { SANS } from './fonts';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The v2 lower third, redrawn.
 *
 * Geometry is measured off the approved v2 render rather than re-designed —
 * 68px side margins, rule at y=852, headline baseline ~918, kicker ~975 — so v3
 * still reads as the same series. What is new is that it moves: the rule wipes
 * in from the left and the type rises under it, instead of appearing whole.
 */
export const LowerThird: React.FC<{
  headline: string;
  durationInFrames: number;
}> = ({ headline, durationInFrames }) => {
  const frame = useCurrentFrame();

  const wipe = ease(interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  const rise = (delay: number) =>
    ease(interpolate(frame, [delay, delay + 18], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));

  // Hold, then release just before the dissolve so type never crosses a cut.
  const out = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const head = rise(5);
  const kick = rise(12);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Legibility scrim — the photography under the type varies a lot. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.68) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 852,
          width: 1784,
          height: 1,
          backgroundColor: GOLD,
          opacity: 0.85,
          transform: `scaleX(${wipe})`,
          transformOrigin: 'left center',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 874,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 46,
          letterSpacing: '0.045em',
          color: '#FFFFFF',
          textShadow: '0 2px 18px rgba(0,0,0,0.45)',
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
        }}
      >
        {headline}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 950,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '0.34em',
          color: GOLD,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          opacity: kick,
          transform: `translateY(${(1 - kick) * 10}px)`,
        }}
      >
        {BRAND.kicker}
      </div>
    </AbsoluteFill>
  );
};
