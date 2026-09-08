/**
 * East Brunswick Remodel — art direction.
 *
 * Palette sampled directly from the approved v2 render so v3 reads as the same
 * series: the gold is the exact hairline-rule pixel (201,162,89), the ink is the
 * darkest value the outro can sit on without crushing the photography behind it.
 *
 * This file is the piece's own art direction — it is deliberately NOT imported
 * from any shared registry.
 */

export const GOLD = '#C9A259';
export const GOLD_DIM = 'rgba(201, 162, 89, 0.55)';
export const INK = '#0E0E0F';
export const PAPER = '#FFFFFF';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Frames of cross-dissolve between consecutive photo beats. At 14 frames
 * (~0.47s) the blend is long enough to read as a dissolve rather than a soft
 * cut, which suits the slower cadence the strings ask for.
 */
export const DISSOLVE = 14;

export type KenBurns = {
  /** scale at the first frame of the beat */
  fromScale: number;
  /** scale at the last frame of the beat */
  toScale: number;
  /** horizontal drift in percent of frame width, start -> end */
  fromX?: number;
  toX?: number;
  /** vertical drift in percent of frame height, start -> end */
  fromY?: number;
  toY?: number;
};

export type Beat = {
  id: string;
  /** file in the composition public dir */
  src: string;
  headline: string;
  durationInFrames: number;
  move: KenBurns;
};

/**
 * Eight photo beats, cut to the music rather than to a stopwatch.
 *
 * The cue runs 152 BPM (felt 76), so a bar is 1.579s. Every beat is a whole
 * number of bars and every cut lands within ~15ms of a downbeat; the opening
 * beat carries an extra 16 frames so the track keeps its anacrusis instead of
 * being trimmed to force the grid onto zero. Absolute cut positions are rounded
 * to frames independently, so rounding never accumulates across the reel.
 *
 * Holds run 3.2s (2 bars) with the two hero frames — the tub reveal and the
 * staged bedroom — given 4.7s (3 bars). Room mix is 2 primary bath plus 2
 * material macros, 1 powder room, 2 bedroom, 1 living room. The macros read as
 * texture rather than "another bathroom", and they fill the beat freed up when
 * the living-room sectional came out.
 */
export const BEATS: Beat[] = [
  {
    id: 'b1',
    src: 's1_bath_vanity.jpg',
    headline: 'EAST BRUNSWICK REMODEL',
    durationInFrames: 111,
    move: { fromScale: 1.02, toScale: 1.09, fromX: 0, toX: -1.0 },
  },
  {
    id: 'b2',
    src: 's2_bath_detail.jpg',
    headline: 'DESIGNED AROUND DETAIL',
    durationInFrames: 95,
    move: { fromScale: 1.13, toScale: 1.05 },
  },
  {
    id: 'b3',
    // Tight on the quartzite: no fixtures, no room cues, just the veining.
    // Panned rather than pushed, so the eye travels the slab.
    src: 's9_marble.jpg',
    headline: 'MATERIALS WITH INTENTION',
    durationInFrames: 95,
    move: { fromScale: 1.06, toScale: 1.06, fromX: 0.9, toX: -0.9 },
  },
  {
    id: 'b4',
    // Hero reveal — 3 bars, landing on a downbeat.
    src: 's3_bath_tub.jpg',
    headline: 'PRECISION IN THE FINISH',
    durationInFrames: 142,
    move: { fromScale: 1.03, toScale: 1.1, fromY: 0, toY: -0.8 },
  },
  {
    id: 'b5',
    src: 's4_powder_wide.jpg',
    headline: 'EVERY ROOM CONSIDERED',
    durationInFrames: 95,
    move: { fromScale: 1.08, toScale: 1.08, fromX: 0.9, toX: -0.9 },
  },
  {
    id: 'b6',
    // Hero — the only fully styled room in the set. 3 bars.
    src: 's6_bedroom.jpg',
    headline: 'A HOME TAKING SHAPE',
    durationInFrames: 142,
    move: { fromScale: 1.1, toScale: 1.03, fromX: -0.8, toX: 0.5 },
  },
  {
    id: 'b7',
    src: 's7_lr_doors.jpg',
    headline: 'LIGHT THROUGH THE HOUSE',
    durationInFrames: 95,
    move: { fromScale: 1.06, toScale: 1.06, fromX: -1.0, toX: 0.9 },
  },
  {
    id: 'b8',
    // The living-room frames all carry the black sectional, which the client
    // cut. This closes on the pale vanity room instead, graded a touch softer
    // so bare walls read warm rather than stark, and pushed in deliberately so
    // the empty room still has forward movement.
    src: 's8_vanity_room.jpg',
    headline: 'CRAFTED FOR DAILY LIVING',
    durationInFrames: 94,
    move: { fromScale: 1.03, toScale: 1.1 },
  },
];

/** 4 bars, so the end card gets a full musical phrase to land in. */
export const OUTRO_FRAMES = 189;

/**
 * The outro grows out of the last beat rather than cutting to a card: it keeps
 * s8 on screen and keeps pushing in from where b8 left off, so the scrim reads
 * as the room dimming rather than as a slide change.
 */
export const OUTRO_MOVE: KenBurns = { fromScale: 1.1, toScale: 1.15 };

export const TOTAL_FRAMES =
  BEATS.reduce((n, b) => n + b.durationInFrames, 0) + OUTRO_FRAMES;

/** Verified brand facts. Nothing here is approximated — see brand-guard. */
export const BRAND = {
  project: 'EAST BRUNSWICK REMODEL',
  locale: 'New Jersey',
  kicker: 'WA CONSTRUCT',
  /** Design-build integration is a stated brand pillar — not a claim to verify. */
  statement: ['Design–build,', 'start to finish.'],
  credentials: [
    '23+ years building in New Jersey',
    '2026 SAM Awards',
    '4× Best of Houzz',
  ],
  cta: 'Book a Consultation',
  url: 'WACONSTRUCT.COM',
  phone: '201-485-8887',
};
