import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BEATS, DISSOLVE, OUTRO_FRAMES, TOTAL_FRAMES } from './theme';
import { KenBurnsPhoto } from './KenBurnsPhoto';
import { LowerThird } from './LowerThird';
import { Outro } from './Outro';
import { loadFonts } from './fonts';

loadFonts();

/**
 * One photo beat. Mounted `DISSOLVE` frames early and faded up over the beat
 * before it — later layers paint on top, so a plain fade-in reads as a
 * cross-dissolve without a transition library.
 */
const Beat: React.FC<{
  index: number;
  src: string;
  headline: string;
  durationInFrames: number;
  move: React.ComponentProps<typeof KenBurnsPhoto>['move'];
}> = ({ index, src, headline, durationInFrames, move }) => {
  const frame = useCurrentFrame();
  const lead = index === 0 ? 0 : DISSOLVE;

  const opacity = lead
    ? interpolate(frame, [0, lead], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AbsoluteFill style={{ opacity }}>
      <KenBurnsPhoto
        src={src}
        move={move}
        localFrame={frame - lead}
        durationInFrames={durationInFrames}
      />
      <Sequence from={lead} durationInFrames={durationInFrames}>
        <LowerThird headline={headline} durationInFrames={durationInFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Brunswick: React.FC = () => {
  const frame = useCurrentFrame();

  // Open from black — the montage should arrive, not start mid-thought.
  const openUp = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let cursor = 0;
  const layers = BEATS.map((beat, i) => {
    const start = cursor;
    cursor += beat.durationInFrames;
    const lead = i === 0 ? 0 : DISSOLVE;
    return (
      <Sequence
        key={beat.id}
        from={start - lead}
        durationInFrames={beat.durationInFrames + lead}
      >
        <Beat
          index={i}
          src={beat.src}
          headline={beat.headline}
          durationInFrames={beat.durationInFrames}
          move={beat.move}
        />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0E0F' }}>
      <AbsoluteFill style={{ opacity: openUp }}>
        {layers}

        <Sequence from={cursor - DISSOLVE} durationInFrames={OUTRO_FRAMES + DISSOLVE}>
          <OutroLayer durationInFrames={OUTRO_FRAMES} />
        </Sequence>
      </AbsoluteFill>

      <Audio src={staticFile('bed.mp3')} />
    </AbsoluteFill>
  );
};

/** Wrapper so the outro cross-dissolves in like every other beat. */
const OutroLayer: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, DISSOLVE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity }}>
      <Sequence from={DISSOLVE} durationInFrames={durationInFrames}>
        <Outro durationInFrames={durationInFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BRUNSWICK_DURATION = TOTAL_FRAMES;
