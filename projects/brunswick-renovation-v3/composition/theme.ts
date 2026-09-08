/**
 * Brunswick Renovation v3 — art direction.
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

/** Frames of cross-dissolve between consecutive photo beats. */
export const DISSOLVE = 10;

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
 * Eight photo beats. Room mix is deliberate: 3 primary bath, 2 powder room,
 * 1 bedroom, 2 living room. v2 ran 5 of 7 beats in the primary bath, which read
 * as a bathroom remodel rather than a whole-home renovation.
 *
 * No two consecutive beats move the same way — the eye needs the change.
 */
export const BEATS: Beat[] = [
  {
    id: 'b1',
    src: 's1_bath_vanity.jpg',
    headline: 'BRUNSWICK RENOVATION',
    durationInFrames: 81,
    move: { fromScale: 1.02, toScale: 1.1, fromX: 0, toX: -1.2 },
  },
  {
    id: 'b2',
    src: 's2_bath_detail.jpg',
    headline: 'DESIGNED AROUND DETAIL',
    durationInFrames: 69,
    move: { fromScale: 1.12, toScale: 1.03 },
  },
  {
    id: 'b3',
    src: 's4_powder_wide.jpg',
    headline: 'EVERY ROOM CONSIDERED',
    durationInFrames: 72,
    move: { fromScale: 1.08, toScale: 1.08, fromX: 1.0, toX: -1.0 },
  },
  {
    id: 'b4',
    src: 's3_bath_tub.jpg',
    headline: 'PRECISION IN THE FINISH',
    durationInFrames: 78,
    move: { fromScale: 1.03, toScale: 1.11, fromY: 0, toY: -1.0 },
  },
  {
    id: 'b5',
    src: 's5_powder_vanity.jpg',
    headline: 'MATERIALS WITH INTENTION',
    durationInFrames: 69,
    move: { fromScale: 1.04, toScale: 1.12 },
  },
  {
    id: 'b6',
    src: 's6_bedroom.jpg',
    headline: 'A HOME TAKING SHAPE',
    durationInFrames: 87,
    move: { fromScale: 1.11, toScale: 1.03, fromX: -1.0, toX: 0.6 },
  },
  {
    id: 'b7',
    src: 's7_lr_doors.jpg',
    headline: 'LIGHT THROUGH THE HOUSE',
    durationInFrames: 75,
    move: { fromScale: 1.07, toScale: 1.07, fromX: -1.2, toX: 1.0 },
  },
  {
    id: 'b8',
    src: 's8_lr_media.jpg',
    headline: 'CRAFTED FOR DAILY LIVING',
    durationInFrames: 84,
    move: { fromScale: 1.03, toScale: 1.1 },
  },
];

export const OUTRO_FRAMES = 159;

/**
 * The outro grows out of the last beat rather than cutting to a card: it keeps
 * s8 on screen and keeps pushing in from where b8 left off, so the scrim reads
 * as the room dimming rather than as a slide change.
 */
export const OUTRO_MOVE: KenBurns = { fromScale: 1.1, toScale: 1.16 };

export const TOTAL_FRAMES =
  BEATS.reduce((n, b) => n + b.durationInFrames, 0) + OUTRO_FRAMES;

/** Verified brand facts. Nothing here is approximated — see brand-guard. */
export const BRAND = {
  project: 'BRUNSWICK RENOVATION',
  locale: 'New Jersey',
  kicker: 'WA CONSTRUCT',
  credentials: ['23+ Years', '2026 SAM Awards', '4× Best of Houzz'],
  cta: 'Book a Consultation',
  url: 'WACONSTRUCT.COM',
  phone: '201-485-8887',
};
