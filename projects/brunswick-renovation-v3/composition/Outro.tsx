import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BEATS, BRAND, GOLD, OUTRO_MOVE } from './theme';
import { SANS } from './fonts';
import { KenBurnsPhoto } from './KenBurnsPhoto';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The replacement for v2's white contact slate.
 *
 * v2 cut from a warm, dark montage to a flat white card — a hard flash that
 * reads as "the video is over" and drops retention. Here the last room stays on
 * screen and keeps moving while a scrim closes over it, so the CTA arrives on
 * top of the work rather than instead of it. Contact details sit in a pinned bar
 * so they stay put while the centre stack settles.
 */
export const Outro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const last = BEATS[BEATS.length - 1];

  const rise = (delay: number, span = 22) =>
    ease(interpolate(frame, [delay, delay + span], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));

  const scrim = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logo = rise(6);
  const rule = rise(20, 18);
  const head = rise(26);
  const sub = rise(34);
  const creds = rise(42);
  const bar = rise(30, 26);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0E0F' }}>
      <KenBurnsPhoto
        src={last.src}
        move={OUTRO_MOVE}
        localFrame={frame}
        durationInFrames={durationInFrames}
      />

      {/* The room dims rather than disappears. Kept deliberately light: the
          stills are already graded with a vignette, so a heavy scrim here
          compounds with it and the room goes to mud behind the type. */}
      <AbsoluteFill
        style={{
          opacity: scrim,
          background:
            'linear-gradient(180deg, rgba(8,8,9,0.44) 0%, rgba(8,8,9,0.52) 40%, rgba(8,8,9,0.80) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: scrim,
          background:
            'radial-gradient(ellipse 1250px 780px at 50% 50%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.34) 100%)',
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 118,
          textAlign: 'center',
          fontFamily: SANS,
        }}
      >
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 520,
            marginBottom: 62,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 18}px)`,
            filter: 'drop-shadow(0 2px 18px rgba(0,0,0,0.6))',
          }}
        />

        <div
          style={{
            width: 110,
            height: 1,
            backgroundColor: GOLD,
            marginBottom: 40,
            transform: `scaleX(${rule})`,
          }}
        />

        <div
          style={{
            fontWeight: 900,
            fontSize: 70,
            letterSpacing: '0.05em',
            color: '#FFFFFF',
            lineHeight: 1,
            textShadow: '0 2px 26px rgba(0,0,0,0.55)',
            opacity: head,
            transform: `translateY(${(1 - head) * 20}px)`,
          }}
        >
          {BRAND.project}
        </div>

        <div
          style={{
            marginTop: 22,
            fontWeight: 400,
            fontSize: 23,
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
            marginTop: 60,
            fontWeight: 400,
            fontSize: 20,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.62)',
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
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 118,
          backgroundColor: 'rgba(9,9,10,0.93)',
          borderTop: `1px solid ${GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          fontFamily: SANS,
          transform: `translateY(${(1 - bar) * 118}px)`,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          {BRAND.cta}
        </div>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: GOLD }} />
        <div style={{ fontWeight: 400, fontSize: 26, letterSpacing: '0.14em', color: GOLD }}>
          {BRAND.url}
          <span style={{ margin: '0 14px', opacity: 0.6 }}>·</span>
          {BRAND.phone}
        </div>
      </div>
    </AbsoluteFill>
  );
};
