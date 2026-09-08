import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Brunswick, BRUNSWICK_DURATION } from './Brunswick';
import { FPS, HEIGHT, WIDTH } from './theme';

const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Brunswick"
        component={Brunswick}
        durationInFrames={BRUNSWICK_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

registerRoot(Root);
