import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export interface LogoWatermarkProps {
  logoSrc: string;
  opacity?: number;
  widthPx?: number;
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

export const LogoWatermark: React.FC<LogoWatermarkProps> = ({
  logoSrc,
  opacity = 0.85,
  widthPx = 130,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, opacity], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 36, bottom: 32, width: widthPx, opacity: fadeIn }}>
        <Img
          src={resolveAsset(logoSrc)}
          style={{
            width: "100%",
            height: "auto",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
