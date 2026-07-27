import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface ScatterAssemblyProps {
  mode: "scatter" | "assemble";
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  chips?: string[];
  totalLabel?: string;
}

// Deterministic pseudo-random (mulberry32) so fragment layout is stable across renders.
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULT_CHIPS = [
  "Drywall — 320 sf",
  "$4,200",
  "Sub: J. Reyes",
  "12:47 AM",
  "Framing — 18 ln ft",
  "$1,850",
  "Permit fee",
  "Electrical rough-in",
  "$980",
  "Sub: M. Ortiz",
  "Flooring — 640 sf",
  "$6,100",
];

export const ScatterAssembly: React.FC<ScatterAssemblyProps> = ({
  mode,
  accentColor = "#F59E0B",
  backgroundColor = "transparent",
  textColor = "#1F2937",
  chips = DEFAULT_CHIPS,
  totalLabel = "$13,130?",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // "chaos" runs 0 -> 1 for scatter, 1 -> 0 for assemble
  const chaos = mode === "scatter" ? progress : 1 - progress;

  const cols = 4;
  const rows = Math.ceil(chips.length / cols);
  const cellW = 82 / cols;
  const cellH = 60 / rows;

  const totalOpacity =
    mode === "assemble"
      ? interpolate(frame, [durationInFrames - 20, durationInFrames - 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: backgroundColor, overflow: "hidden" }}>
      {/* Faint grid to suggest the underlying spreadsheet/UI structure */}
      <AbsoluteFill
        style={{
          opacity: interpolate(chaos, [0, 1], [0.25, 0.03]),
          backgroundImage: `linear-gradient(${accentColor}22 1px, transparent 1px), linear-gradient(90deg, ${accentColor}22 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {chips.map((label, i) => {
        const rand = seededRandom(i * 97 + 13);
        const angle = (rand() - 0.5) * 70;
        const driftX = (rand() - 0.5) * 640;
        const driftY = (rand() - 0.5) * 420;
        const delay = i * 2;

        // Per-fragment progress, staggered slightly for a organic feel
        const localFrame = mode === "scatter" ? frame - delay : frame - delay;
        const localProgress = interpolate(
          localFrame,
          [0, durationInFrames * 0.7],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const localChaos = mode === "scatter" ? localProgress : 1 - localProgress;

        const col = i % cols;
        const row = Math.floor(i / cols);
        const gridX = 9 + col * cellW;
        const gridY = 20 + row * cellH;

        const x = gridX + driftX * localChaos * 0.15;
        const y = gridY + driftY * localChaos * 0.15;
        const rot = angle * localChaos;
        const scale = interpolate(localChaos, [0, 1], [1, 0.82]);
        const opacity = interpolate(localChaos, [0, 0.85, 1], [1, 0.85, mode === "scatter" ? 0.55 : 0.55]);

        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
              opacity,
              background: "#FFFFFFEE",
              border: `1px solid ${accentColor}55`,
              borderRadius: 10,
              padding: "10px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              color: textColor,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        );
      })}

      {/* The unreliable / resolved total */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: totalOpacity,
          fontFamily: "Space Grotesk, Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 56,
          color: mode === "assemble" ? accentColor : textColor,
          background: mode === "assemble" ? "#FFFFFFF2" : "transparent",
          padding: mode === "assemble" ? "18px 36px" : 0,
          borderRadius: 16,
          boxShadow: mode === "assemble" ? "0 12px 40px rgba(0,0,0,0.18)" : "none",
        }}
      >
        {totalLabel}
      </div>
    </AbsoluteFill>
  );
};
