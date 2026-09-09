// Score card (PRD §30): tool id / label / score / Coverage / coverage — score and coverage always
// together, the label is design-scores.label ("Compound Design Audit Score"), meaning performance
// against the frozen ruler. Digits count up over 14 f (spring-pop). Also the delta layout.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { scoreLabel, scoreOf, signed, topCategoryDeltas, type Delta } from "../data/design-scores";
import { C, FONT, SPRING_POP, decel } from "../data/storyboard";

const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
};

export const CountUp: React.FC<{ value: number; from?: number; suffix?: string; style?: React.CSSProperties }> = ({ value, from = 0, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING_POP, durationInFrames: 14 });
  const shown = (value * Math.min(1, p)).toFixed(decimalsOf(value));
  return <span style={style}>{shown}{suffix}</span>;
};

type CardProps = { milestone: string; from?: number; x: number; y: number; compact?: boolean };

export const ScoreReveal: React.FC<CardProps> = ({ milestone, from = 0, x, y, compact = false }) => {
  const frame = useCurrentFrame();
  const s = scoreOf(milestone);
  const o = interpolate(frame - from, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const size = compact ? 0.7 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360 * size,
        padding: 28 * size,
        borderRadius: 8,
        backgroundColor: "rgba(11,12,11,0.86)",
        border: "1px solid rgba(239,238,233,0.16)",
        fontFamily: FONT.mono,
        color: C.ink,
        opacity: o,
        translate: `0px ${(1 - o) * 10}px`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ fontSize: 20 * size, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.tool_ids.join(" + ")} · {s.milestone}</div>
      <div style={{ fontSize: 16 * size, color: C.muted, marginTop: 16 * size, letterSpacing: "0.06em", textTransform: "uppercase" }}>{scoreLabel}</div>
      <div style={{ fontSize: 96 * size, fontWeight: 600, lineHeight: 1, marginTop: 6 * size, fontFamily: FONT.sans, color: C.ink }}>
        <CountUp value={s.score} from={from + 4} />
      </div>
      <div style={{ fontSize: 16 * size, color: C.muted, marginTop: 18 * size, letterSpacing: "0.06em", textTransform: "uppercase" }}>Coverage</div>
      <div style={{ fontSize: 40 * size, fontWeight: 500, lineHeight: 1.1, fontFamily: FONT.sans }}>
        <CountUp value={s.coverage} from={from + 8} suffix="%" />
      </div>
    </div>
  );
};

/** PRD §30 second layout: +N / −N per category, three rows max; sign and colour from the data. */
export const DeltaCard: React.FC<{ delta: Delta; from?: number; x: number; y: number; width?: number; rows?: number; regression?: boolean }> = ({ delta, from = 0, x, y, width = 520, rows = 3, regression = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame - from, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const top = topCategoryDeltas(delta, rows);
  const headColor = delta.score_delta >= 0 ? C.accent : C.warm;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, padding: 24, borderRadius: 8, backgroundColor: "rgba(11,12,11,0.86)", border: "1px solid rgba(239,238,233,0.16)", fontFamily: FONT.mono, color: C.ink, opacity: o }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 20, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{delta.from} → {delta.to}</div>
        <div style={{ fontSize: 44, fontWeight: 600, fontFamily: FONT.sans, color: headColor }}>{signed(delta.score_delta)}</div>
      </div>
      <div style={{ fontSize: 14, color: C.muted, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{scoreLabel}</div>
      <div style={{ marginTop: 14, borderTop: "1px solid rgba(239,238,233,0.12)" }}>
        {top.map(([cat, v], k) => {
          const p = spring({ frame: frame - from - 8 - k * 6, fps, config: SPRING_POP, durationInFrames: 16 });
          return (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(239,238,233,0.08)", opacity: Math.min(1, p), translate: `${(1 - Math.min(1, p)) * 10}px 0px` }}>
              <span style={{ fontSize: 22, color: C.ink }}>{cat}</span>
              <span style={{ fontSize: 26, fontWeight: 600, fontFamily: FONT.sans, color: v >= 0 ? C.accent : C.warm }}>{signed(v)}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 14, color: regression ? C.warm : C.muted, marginTop: 12, letterSpacing: "0.04em" }}>same_tool {String(delta.same_tool)}</div>
    </div>
  );
};
