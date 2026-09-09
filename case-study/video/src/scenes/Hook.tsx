// Beat 1 · Hook. MS-01: the hook phrase with a counting numeral bound to tools.stated_count_in_brief.
// MS-02/MS-03 (rendered by Tools.tsx): the phrase parks top-left while the constellation enters.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SPRING_FLAT, SPRING_POP, decel, phrase } from "../data/storyboard";
import { statedCount } from "../data/tools";
import { useLayout } from "../components/layout";
import type { ShotProps } from "./common";

/** The headline with a counter that resolves 0 → N over 12 f (spring-pop). */
export const HookHeadline: React.FC<{ from?: number; parkAt?: number; size: number }> = ({ from = 0, parkAt, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const enter = interpolate(frame - from, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const count = spring({ frame: frame - from - 6, fps, config: SPRING_POP, durationInFrames: 12 });
  const n = Math.round(statedCount * Math.min(1, count));
  const park = parkAt === undefined ? 0 : spring({ frame: frame - parkAt, fps, config: SPRING_FLAT, durationInFrames: 20 });
  const [before, after] = phrase("T.hook.1").split("{N}");
  const parkScale = L.vertical ? 0.6 : 0.42;
  const scale = 1 - park * (1 - parkScale);
  // centred → top-left (scale 0.42; 0.6 in 9:16 where the rail sits at the top)
  const cx = L.W / 2;
  const cy = L.vertical ? L.H * 0.4 : L.H / 2;
  const parkTop = L.vertical ? 150 : L.safe.y;
  const tx = L.safe.x + L.W * 0.8 * parkScale * 0.5 - cx;
  const ty = parkTop + size * parkScale * 0.6 - cy;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - L.W * 0.4,
        top: cy - size * 0.6,
        width: L.W * 0.8,
        textAlign: "center",
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.15,
        color: C.ink,
        opacity: enter,
        letterSpacing: `${(1 - enter) * 0.04}em`,
        translate: `${tx * park}px ${ty * park}px`,
        scale: `${scale}`,
      }}
    >
      {before}
      <span style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{n}</span>
      {after}
    </div>
  );
};

export const HookStatement: React.FC<ShotProps> = () => {
  const L = useLayout();
  return <HookHeadline from={6} size={L.vertical ? 48 : 80} />;
};
