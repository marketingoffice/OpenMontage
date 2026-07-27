import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BrandRevealProps {
  logoSrc: string;
  headline?: string;
  subline?: string;
  showUIBuild?: boolean;
  accentColor?: string;
  backgroundColor?: string;
}

function resolveAsset(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  const clean = src.replace(/^file:\/\/\/?/, "");
  if (clean.startsWith("/")) {
    return `file://${clean}`;
  }
  return staticFile(clean);
}

const UI_ROWS = [
  { label: "Framing", value: "$1,850" },
  { label: "Drywall", value: "$4,200" },
  { label: "Electrical", value: "$980" },
  { label: "Flooring", value: "$6,100" },
];

export const BrandReveal: React.FC<BrandRevealProps> = ({
  logoSrc,
  headline,
  subline,
  showUIBuild = false,
  accentColor = "#D4AF37",
  backgroundColor = "#0F172A",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.75, 1]);
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.25, 0.55]);

  const headlineDelay = fps * 1.0;
  const headlineOpacity = interpolate(
    frame,
    [headlineDelay, headlineDelay + fps * 0.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headlineY = interpolate(
    frame,
    [headlineDelay, headlineDelay + fps * 0.6],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const uiStart = fps * 1.4;

  return (
    <AbsoluteFill style={{ background: backgroundColor, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}${Math.round(glow * 40).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          transform: showUIBuild ? "translateY(-14%)" : "none",
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            width: 260,
          }}
        >
          <Img src={resolveAsset(logoSrc)} style={{ width: "100%", height: "auto" }} />
        </div>

        {headline && (
          <div
            style={{
              marginTop: 36,
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
              fontFamily: "Space Grotesk, Inter, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "0.04em",
              color: "#F8FAFC",
              textAlign: "center",
            }}
          >
            {headline}
          </div>
        )}

        {subline && (
          <div
            style={{
              marginTop: 14,
              opacity: headlineOpacity,
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 30,
              color: accentColor,
              textAlign: "center",
            }}
          >
            {subline}
          </div>
        )}
      </div>

      {showUIBuild && (
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 560,
            background: "#FFFFFFF5",
            borderRadius: 18,
            padding: "22px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          {UI_ROWS.map((row, i) => {
            const rowDelay = uiStart + i * (fps * 0.28);
            const rowOpacity = interpolate(
              frame,
              [rowDelay, rowDelay + fps * 0.35],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const rowX = interpolate(
              frame,
              [rowDelay, rowDelay + fps * 0.35],
              [-24, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  padding: "8px 0",
                  borderBottom: i < UI_ROWS.length - 1 ? "1px solid #E5E7EB" : "none",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#1F2937",
                }}
              >
                <span>{row.label}</span>
                <span style={{ color: accentColor }}>{row.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
