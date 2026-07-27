import { ThreeCanvas } from "@remotion/three";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Easing,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface HomeEstimator3DProps {
  vo_src?: string;
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-random (seeded) — stable fragment layout across renders
// ---------------------------------------------------------------------------
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

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F9E076";
const INK = "#12100B";
const SLATE = "#2D2D44";

// ---------------------------------------------------------------------------
// Canvas-texture helper — draws line-item text onto a plane without any
// network font fetch (troika/drei <Text> pulls a default font over the
// network; this sidesteps that entirely).
// ---------------------------------------------------------------------------
function useCanvasTexture(lines: { label: string; value: string }[], title: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = INK;
    ctx.font = "700 46px Arial, sans-serif";
    ctx.fillText(title, 48, 84);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 116);
    ctx.lineTo(canvas.width - 48, 116);
    ctx.stroke();

    let y = 190;
    lines.forEach((row) => {
      ctx.fillStyle = "#374151";
      ctx.font = "600 38px Arial, sans-serif";
      ctx.fillText(row.label, 48, y);
      ctx.fillStyle = GOLD;
      ctx.font = "700 38px Arial, sans-serif";
      const w = ctx.measureText(row.value).width;
      ctx.fillText(row.value, canvas.width - 48 - w, y);
      y += 88;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [lines, title]);
}

// ---------------------------------------------------------------------------
// A single floating data chip — scattered in sc1/sc2, converges in sc4
// ---------------------------------------------------------------------------
const DataChip: React.FC<{
  index: number;
  frame: number;
  fps: number;
  scatterAmount: number; // 0 = converged/tidy, 1 = fully scattered
  opacity: number;
}> = ({ index, frame, fps, scatterAmount, opacity }) => {
  const rand = seededRandom(index * 131 + 7);
  const baseAngle = (index / 14) * Math.PI * 2;
  const radius = 3.2 + rand() * 1.6;

  const scatterX = Math.cos(baseAngle) * radius + (rand() - 0.5) * 3;
  const scatterY = Math.sin(baseAngle) * radius * 0.6 + (rand() - 0.5) * 2.4;
  const scatterZ = (rand() - 0.5) * 5 - 1;

  // Tidy grid target (converged formation) for sc4/sc5
  const cols = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const tidyX = (col - (cols - 1) / 2) * 1.35;
  const tidyY = (1.2 - row * 0.95);
  const tidyZ = 0.2;

  const x = interpolate(scatterAmount, [0, 1], [tidyX, scatterX]);
  const y = interpolate(scatterAmount, [0, 1], [tidyY, scatterY]);
  const z = interpolate(scatterAmount, [0, 1], [tidyZ, scatterZ]);

  const bob = Math.sin(frame / fps * (0.6 + rand() * 0.4) + index) * 0.08;
  const rot = interpolate(scatterAmount, [0, 1], [0, (rand() - 0.5) * 1.4]);
  const spin = frame / fps * 0.15 * (rand() > 0.5 ? 1 : -1) * scatterAmount;

  const hue = rand() > 0.5 ? GOLD : "#FFFFFF";

  if (opacity <= 0.01) return null;

  return (
    <group position={[x, y + bob, z]} rotation={[rot * 0.3, spin, rot]}>
      <RoundedBox args={[0.9, 0.55, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={hue} metalness={0.25} roughness={0.5} transparent opacity={opacity} />
      </RoundedBox>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Simplified 3D house-mark logo (matches the HomeEstimator.ai brand silhouette)
// ---------------------------------------------------------------------------
const HouseMark: React.FC<{ frame: number; fps: number; scale: number; opacity: number }> = ({
  frame,
  fps,
  scale,
  opacity,
}) => {
  const spin = Math.sin(frame / fps * 0.35) * 0.35;
  if (opacity <= 0.01) return null;
  return (
    <group scale={scale} rotation={[0.1, spin, 0]}>
      {/* Roof */}
      <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.05, 0.9, 4]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.35} transparent opacity={opacity} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 1.1, 1.3]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.3} roughness={0.45} transparent opacity={opacity} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.6, 1.3, 0.2]}>
        <boxGeometry args={[0.22, 0.6, 0.22]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.35} transparent opacity={opacity} />
      </mesh>
      {/* Door cutout suggestion */}
      <mesh position={[0, -0.15, 0.66]}>
        <boxGeometry args={[0.3, 0.55, 0.05]} />
        <meshStandardMaterial color={INK} metalness={0.1} roughness={0.8} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

const DashboardPanel: React.FC<{ opacity: number; position: [number, number, number] }> = ({
  opacity,
  position,
}) => {
  const texture = useCanvasTexture(
    [
      { label: "Framing", value: "$1,850" },
      { label: "Drywall", value: "$4,200" },
      { label: "Electrical", value: "$980" },
      { label: "Flooring", value: "$6,100" },
    ],
    "Estimate"
  );
  return (
    <mesh position={position}>
      <planeGeometry args={[2.6, 1.6]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------
// Scene — everything lives in one persistent Canvas; beats are time-windowed
// ---------------------------------------------------------------------------
const Scene: React.FC<{ seconds: number }> = ({ seconds }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Camera dolly across the whole timeline
  const camZ = interpolate(
    seconds,
    [0, 4.2, 8.7, 19.06, 24.93, 31.4, 34.0, 37.5],
    [11, 9.5, 9, 8.5, 7.5, 9, 8, 6.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );
  const camY = interpolate(seconds, [0, 8.7, 24.93, 37.5], [0.4, 0.2, 0.6, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camAngle = interpolate(seconds, [0, 24.93, 31.4, 37.5], [0, 0.5, -0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // scatterAmount: 0 = tidy/assembled, 1 = fully scattered
  const scatterAmount = interpolate(
    seconds,
    [0, 4.2, 8.7, 17.6, 19.06, 24.93],
    [0.35, 1, 1, 1, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // Chips: visible for sc1/sc2, gone for the sc3 text beat, reassemble for
  // sc4, then clear out once the house + estimate panel take over in sc5.
  const chipsOpacity = interpolate(
    seconds,
    [8.7, 11.0, 19.0, 19.8, 24.93, 26.3],
    [1, 0, 0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const houseOpacity = interpolate(seconds, [23.5, 24.93, 37.5], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const houseScale = interpolate(seconds, [23.5, 24.93, 31.4, 37.5], [0.4, 1, 1.05, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
  // House recenters once the estimate panel clears again ahead of sc6/sc7.
  const houseX = interpolate(seconds, [26.0, 27.5, 30.5, 31.4], [0, -1.1, -1.1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelOpacity = interpolate(seconds, [26.5, 28, 29.8, 30.8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camX = Math.sin(camAngle) * 1.2;
  const camPos: [number, number, number] = [camX, camY, camZ];

  return (
    <>
      <hemisphereLight args={["#fff7e0", INK, 1.3]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 6, 6]} intensity={230} color={GOLD_LIGHT} />
      <pointLight position={[-7, -3, 4]} intensity={150} color={GOLD} />
      <pointLight position={[0, -4, -6]} intensity={110} color="#ffffff" />

      <perspectiveCamera makeDefault position={camPos} fov={45} onUpdate={(c) => c.lookAt(0, 0.2, 0)} />

      <group>
        {Array.from({ length: 14 }).map((_, i) => (
          <DataChip
            key={i}
            index={i}
            frame={frame}
            fps={fps}
            scatterAmount={scatterAmount}
            opacity={chipsOpacity}
          />
        ))}
      </group>

      <group visible={houseOpacity > 0.01} position={[houseX, 0, 0]}>
        <HouseMark frame={frame} fps={fps} scale={houseScale} opacity={houseOpacity} />
      </group>

      {panelOpacity > 0.01 && <DashboardPanel opacity={panelOpacity} position={[1.6, 0, 0]} />}
    </>
  );
};

// ---------------------------------------------------------------------------
// HTML overlay text — kept off the WebGL canvas entirely (system fonts only,
// no troika/network font fetch risk)
// ---------------------------------------------------------------------------
const OverlayText: React.FC<{ seconds: number }> = ({ seconds }) => {
  const questionOpacity = interpolate(seconds, [17.6, 18.3, 19.5, 20.5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(seconds, [24.93, 25.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(seconds, [35.0, 35.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const watermarkOpacity = interpolate(
    seconds,
    [0, 1, 24.5, 25.5],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif" }}>
      {questionOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: questionOpacity,
          }}
        >
          <div style={{ fontSize: 74, fontWeight: 800, color: INK, letterSpacing: "0.02em" }}>
            WHAT WILL IT COST?
          </div>
        </div>
      )}

      {brandOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: brandOpacity,
            fontSize: 40,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: "0.08em",
          }}
        >
          HOME ESTIMATOR
        </div>
      )}

      {ctaOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            bottom: "16%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: ctaOpacity,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 800, color: "#F8FAFC", letterSpacing: "0.04em" }}>
            BOOK A DEMO
          </div>
          <div style={{ marginTop: 10, fontSize: 28, fontWeight: 500, color: GOLD }}>
            homeestimator.ai/book-demo
          </div>
        </div>
      )}

      {watermarkOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 32,
            opacity: watermarkOpacity,
            fontSize: 20,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: "0.05em",
          }}
        >
          HomeEstimator.ai
        </div>
      )}
    </AbsoluteFill>
  );
};

function resolveAudioSrc(src?: string): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return staticFile(src);
}

// White through sc1-sc4 (data/scatter beats), crossing over to a dark hero
// background for sc5-sc7 (brand reveal / CTA), matching the 2D montage's
// brand rule: dark backgrounds only for the brand-reveal beats.
function mixColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(interpolate(t, [0, 1], [a[0], b[0]]));
  const g = Math.round(interpolate(t, [0, 1], [a[1], b[1]]));
  const bl = Math.round(interpolate(t, [0, 1], [a[2], b[2]]));
  return `rgb(${r}, ${g}, ${bl})`;
}

export const HomeEstimator3D: React.FC<HomeEstimator3DProps> = ({ vo_src }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const seconds = frame / fps;

  const darkT = interpolate(seconds, [22.5, 24.93], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgColor = mixColor([255, 255, 255], [18, 16, 11], darkT);
  const vignetteColor = mixColor([45, 45, 68], [50, 40, 15], darkT);

  const audioSrc = resolveAudioSrc(vo_src);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${vignetteColor} 0%, ${bgColor} 65%)`,
      }}
    >
      <ThreeCanvas linear width={width} height={height}>
        <Scene seconds={seconds} />
      </ThreeCanvas>
      <OverlayText seconds={seconds} />
      {audioSrc && <Audio src={audioSrc} />}
    </AbsoluteFill>
  );
};
