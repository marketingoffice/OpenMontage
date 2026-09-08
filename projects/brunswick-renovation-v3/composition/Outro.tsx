import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BEATS, BRAND, GOLD, OUTRO_MOVE } from './theme';
import { SANS } from './fonts';
import { KenBurnsPhoto } from './KenBurnsPhoto';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The replacement for v2's white contact slate: a dark brand card.
 *
 * v2 cut from a warm, dark montage to a flat white field — a hard flash that
 * reads as "the video is over". This lands on near-black instead, which is
 * tonally continuous with the graded photography, and it carries the verified
 * credentials v2 had nowhere.
 *
 * The last room does not cut away; it keeps pushing in and dissolves down into
 * the dark field over the first ~20 frames, so the card resolves out of the
 * montage rather than interrupting it. The held frame is a clean card.
 */
export const Outro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const last = BEATS[BEATS.length - 1];

  const rise = (delay: number, span = 22) =>
    ease(interpolate(frame, [delay, delay + span], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));

  // The room recedes rather than being cut away.
  const photo = interpolate(frame, [0, 22], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glow = interpolate(frame, [4, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logo = rise(8);
  const rule = rise(22, 18);
  const head = rise(28);
  const sub = rise(36);
  const creds = rise(44);
  const cta = rise(52);
  const contact = rise(58);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0E0F' }}>
      <AbsoluteFill style={{ opacity: photo }}>
        <KenBurnsPhoto
          src={last.src}
          move={OUTRO_MOVE}
          localFrame={frame}
          durationInFrames={durationInFrames}
        />
        <AbsoluteFill style={{ backgroundColor: 'rgba(8,8,9,0.55)' }} />
      </AbsoluteFill>

      {/* A single warm pool behind the lockup, so the card is not a flat slab. */}
      <AbsoluteFill
        style={{
          opacity: glow,
          background:
            'radial-gradient(ellipse 1150px 720px at 50% 46%, rgba(201,162,89,0.11), rgba(201,162,89,0) 70%)',
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: SANS,
        }}
      >
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 560,
            marginBottom: 78,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 18}px)`,
          }}
        />

        <div
          style={{
            width: 120,
            height: 1,
            backgroundColor: GOLD,
            marginBottom: 46,
            transform: `scaleX(${rule})`,
          }}
        />

        <div
          style={{
            fontWeight: 900,
            fontSize: 74,
            letterSpacing: '0.05em',
            color: '#FFFFFF',
            lineHeight: 1,
            opacity: head,
            transform: `translateY(${(1 - head) * 20}px)`,
          }}
        >
          {BRAND.project}
        </div>

        <div
          style={{
            marginTop: 24,
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: GOLD,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 12}px)`,
          }}
        >
          {BRAND.locale}
        </div>

        <div
          style={{
            marginTop: 70,
            fontWeight: 400,
            fontSize: 21,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            opacity: creds,
            transform: `translateY(${(1 - creds) * 10}px)`,
          }}
        >
          {BRAND.credentials.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 ? <span style={{ color: GOLD, margin: '0 18px' }}>•</span> : null}
              {c}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            marginTop: 70,
            fontWeight: 700,
            fontSize: 27,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            opacity: cta,
            transform: `translateY(${(1 - cta) * 10}px)`,
          }}
        >
          {BRAND.cta}
        </div>

        <div
          style={{
            marginTop: 22,
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: '0.14em',
            color: GOLD,
            opacity: contact,
            transform: `translateY(${(1 - contact) * 10}px)`,
          }}
        >
          {BRAND.url}
          <span style={{ margin: '0 16px', opacity: 0.6 }}>·</span>
          {BRAND.phone}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
