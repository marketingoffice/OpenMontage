import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { KenBurns } from './theme';

/**
 * One still under a slow, single-direction move.
 *
 * `localFrame` is passed in rather than read from useCurrentFrame() so the outro
 * can continue b8's move from where it stopped instead of restarting it — the
 * whole point of the outro growing out of the last beat.
 */
export const KenBurnsPhoto: React.FC<{
  src: string;
  move: KenBurns;
  localFrame: number;
  durationInFrames: number;
}> = ({ src, move, localFrame, durationInFrames }) => {
  const span: [number, number] = [0, Math.max(1, durationInFrames - 1)];
  const opts = {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
  };

  const scale = interpolate(localFrame, span, [move.fromScale, move.toScale], opts);
  const x = interpolate(localFrame, span, [move.fromX ?? 0, move.toX ?? 0], opts);
  const y = interpolate(localFrame, span, [move.fromY ?? 0, move.toY ?? 0], opts);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0E0E0F' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${x}%, ${y}%)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  );
};
