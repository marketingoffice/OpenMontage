import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BEATS, BRAND, GOLD, OUTRO_MOVE, WIDTH } from './theme';
import { SANS } from './fonts';
import { KenBurnsPhoto } from './KenBurnsPhoto';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const PANEL = 0.44;

/**
 * Split lockup: the last room holds the left of the frame, a brand panel takes
 * the right.
 *
 * Third direction for this end card. v2's white slate flashed; a full dark card
 * still meant the work disappeared at the CTA. Here the room never leaves — the
 * frame simply narrows to 56% as the panel slides in from the right, so the
 * photography and the ask share the screen instead of taking turns.
 *
 * The left plate is whatever the final beat was, continuing its push, so the
 * outro opens out of the montage rather than replacing it.
 */
export const Outro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const last = BEATS[BEATS.length - 1];

  const rise = (delay: number, span = 20) =>
    ease(interpolate(frame, [delay, delay + span], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));

  // The frame narrows; the photo inside keeps its cover crop, so the room is
  // re-framed rather than squashed.
  const split = ease(interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const photoWidth = WIDTH * (1 - PANEL * split);

  const panel = rise(4, 28);
  const logo = rise(20);
  const rule = rise(32, 16);
  const head = rise(38);
  const creds = rise(50);
  const cta = rise(64);
  const contact = rise(70);
  const caption = rise(44);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0E0F' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: photoWidth,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: WIDTH, height: '100%' }}>
          <KenBurnsPhoto
            src={last.src}
            move={OUTRO_MOVE}
            localFrame={frame}
            durationInFrames={durationInFrames}
          />
        </div>

        {/* Feathers the photo into the panel so the seam is not a hard edge. */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(90deg, rgba(14,14,15,0) 52%, rgba(14,14,15,0.55) 82%, rgba(14,14,15,0.96) 100%)',
            opacity: split,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,9,0.30) 0%, rgba(8,8,9,0) 34%, rgba(8,8,9,0.62) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 76,
            bottom: 74,
            fontFamily: SANS,
            opacity: caption,
            transform: `translateY(${(1 - caption) * 14}px)`,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            }}
          >
            {BRAND.project}
          </div>
          <div style={{ width: 70, height: 1, backgroundColor: GOLD, margin: '20px 0 16px' }} />
          <div
            style={{
              fontWeight: 300,
              fontSize: 21,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            {BRAND.locale}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: WIDTH * PANEL,
          backgroundColor: '#0E0E0F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px 0 78px',
          fontFamily: SANS,
          transform: `translateX(${(1 - panel) * 100}%)`,
        }}
      >
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 430,
            marginBottom: 64,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 14}px)`,
          }}
        />

        <div
          style={{
            width: 96,
            height: 1,
            backgroundColor: GOLD,
            marginBottom: 40,
            transform: `scaleX(${rule})`,
            transformOrigin: 'left center',
          }}
        />

        <div
          style={{
            fontWeight: 900,
            fontSize: 52,
            letterSpacing: '0.045em',
            color: '#FFFFFF',
            lineHeight: 1.14,
            opacity: head,
            transform: `translateY(${(1 - head) * 16}px)`,
          }}
        >
          {BRAND.statement.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>

        <div
          style={{
            marginTop: 44,
            display: 'flex',
            flexDirection: 'column',
            gap: 13,
            opacity: creds,
            transform: `translateY(${(1 - creds) * 10}px)`,
          }}
        >
          {BRAND.credentials.map((c) => (
            <div
              key={c}
              style={{
                fontWeight: 400,
                fontSize: 20,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span style={{ color: GOLD, fontWeight: 700, marginRight: 14 }}>—</span>
              {c}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 62,
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: '0.28em',
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
            marginTop: 18,
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: '0.11em',
            color: GOLD,
            lineHeight: 1.5,
            opacity: contact,
            transform: `translateY(${(1 - contact) * 10}px)`,
          }}
        >
          <div>{BRAND.url}</div>
          <div>{BRAND.phone}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
