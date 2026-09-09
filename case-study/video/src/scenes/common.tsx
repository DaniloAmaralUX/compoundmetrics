// Helpers shared by the scenes: statement placement, label-key parsing, shot-local frame maths.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { statedCount } from "../data/tools";
import { phrase, textKeysOf, type Shot } from "../data/storyboard";
import { Label, Statement } from "../components/Statement";
import { textStart, useLayout } from "../components/layout";

export type ShotProps = { shot: Shot };

/** Ids inside L.* keys, e.g. labelIds(shot, "L.edge.type") → ["E51", "E52"]. */
export const labelIds = (shot: Shot, prefix: string): string[] =>
  shot.text_keys
    .filter((k) => k.startsWith(prefix + "["))
    .map((k) => k.slice(prefix.length + 1, -1));

/** The T.* phrases of a shot, evenly distributed over its duration, at the statement position. */
export const ShotStatements: React.FC<{ shot: Shot; position?: "lower-left" | "top-left" | "center" | "top-center" | "band"; size?: number; stacked?: boolean; offsets?: number[]; scrim?: boolean }> = ({ shot, position = "lower-left", size, stacked = false, offsets, scrim = true }) => {
  const L = useLayout();
  const keys = textKeysOf(shot);
  const n = keys.length;
  const fontSize = size ?? L.headline;
  const pos = L.vertical ? "band" : position;
  if (n === 0) return null;
  return (
    <>
      {scrim && (pos === "lower-left" || pos === "band") ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: pos === "band" ? L.H * 0.585 - 60 : L.H - L.textBottom - fontSize * (stacked ? n : 1) * 1.3 - 120, height: pos === "band" ? fontSize * 1.3 * (stacked ? n : 1) + 120 : L.textBottom + fontSize * (stacked ? n : 1) * 1.3 + 120, background: pos === "band" ? "linear-gradient(180deg, rgba(11,12,11,0) 0%, rgba(11,12,11,0.85) 30%, rgba(11,12,11,0.85) 70%, rgba(11,12,11,0) 100%)" : "linear-gradient(180deg, rgba(11,12,11,0) 0%, rgba(11,12,11,0.88) 45%, rgba(11,12,11,0.95) 100%)" }} />
      ) : null}
      {keys.map((k, i) => {
        const from = offsets?.[i] ?? textStart(shot, i, n);
        const exitAt = stacked || i === n - 1 ? undefined : (offsets?.[i + 1] ?? textStart(shot, i + 1, n));
        const style: React.CSSProperties =
          pos === "band"
            ? { left: L.safe.x, right: L.safe.x, top: L.H * 0.585 + (stacked ? i * fontSize * 1.3 : 0), textAlign: "center" }
            : pos === "center"
              ? { left: L.safe.x, right: L.safe.x, top: L.H / 2 - fontSize * 0.7 + (stacked ? i * fontSize * 1.3 : 0), textAlign: "center" }
              : pos === "top-center"
                ? { left: L.safe.x, right: L.safe.x, top: L.safe.y, textAlign: "center" }
                : pos === "top-left"
                  ? { left: L.safe.x, top: L.safe.y - 8, maxWidth: L.W * 0.7 }
                : { left: L.safe.x, bottom: L.textBottom + (stacked ? (n - 1 - i) * fontSize * 1.3 : 0), maxWidth: L.W * 0.62 };
        return <Statement key={k + i} text={phrase(k, statedCount)} from={from} exitAt={exitAt} size={fontSize} align={pos === "lower-left" || pos === "top-left" ? "left" : "center"} style={{ textShadow: "0 2px 24px rgba(11,12,11,0.9), 0 0 8px rgba(11,12,11,0.8)", ...style }} />;
      })}
    </>
  );
};

/** Lower-right mono data label. */
export const CornerLabel: React.FC<{ text: string; from?: number; color?: string }> = ({ text, from = 0, color }) => {
  const L = useLayout();
  return <Label text={text} from={from} size={L.mono} color={color} align="right" style={L.vertical ? { right: L.safe.x, left: L.safe.x, top: L.H - L.safe.y - 40 } : { right: L.safe.x, bottom: L.textBottom }} />;
};

/** Scrim over the frame. */
export const Scrim: React.FC<{ opacity: number }> = ({ opacity }) => <div style={{ position: "absolute", inset: 0, backgroundColor: "#0b0c0b", opacity }} />;

/** Left-side backing panel for columns of text over a screenshot. */
export const LeftPanel: React.FC<{ width: number }> = ({ width }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width, height: "100%", background: "linear-gradient(90deg, rgba(11,12,11,0.94) 70%, rgba(11,12,11,0) 100%)" }} />
);

/** Soft radial backing behind centred statements over the constellation. */
export const CenterGlow: React.FC = () => {
  const L = useLayout();
  const cy = L.vertical ? "62%" : "50%";
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 40% at 50% ${cy}, rgba(11,12,11,0.92) 0%, rgba(11,12,11,0.7) 60%, rgba(11,12,11,0) 100%)` }} />;
};

/** Cross-fade weight for element k of n in a shot (cuts with an `xf`-frame overlap). */
export const useCutOpacity = (shot: Shot, k: number, n: number, xf: number) => {
  const frame = useCurrentFrame();
  const per = (shot.end - shot.start) / n;
  const a = k * per;
  const b = (k + 1) * per;
  if (k === 0 && k === n - 1) return 1;
  return interpolate(frame, [a - xf, a, b, b + xf], [k === 0 ? 1 : 0, 1, 1, k === n - 1 ? 1 : 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
