// Persistent memory rail (PRD §29). Eight dim slots appear empty; each chapter adds a capability
// word (schedule derived from the shot manifest's memory_rail lists); at the Work System beat the
// eight words collapse into one bar and split into the six final words (storyboard.RAIL_FINAL).
// Driven entirely by the absolute frame; it never explains itself.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, RAIL, RAIL_FINAL, SPRING_POP, accel, type Shot } from "../data/storyboard";

export type RailSchedule = {
  appear: number;
  adds: { word: string; frame: number }[];
  final: number | null;
};

/** Derive the schedule from the shots: appear at the shot before the first addition; items added
 *  at the same shot start are staggered 4 f apart; the final rail starts at the first shot whose
 *  rail begins with RAIL_FINAL[0]. */
export const railSchedule = (shots: Shot[]): RailSchedule => {
  const adds: { word: string; frame: number }[] = [];
  let appear: number | null = null;
  let final: number | null = null;
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    if (s.memory_rail.length > 0 && s.memory_rail[0] === RAIL_FINAL[0]) {
      if (final === null) final = s.start;
      continue;
    }
    let k = 0;
    for (const w of s.memory_rail) {
      if (!RAIL.includes(w) || adds.some((a) => a.word === w)) continue;
      if (appear === null) appear = i > 0 ? shots[i - 1].start : 0;
      adds.push({ word: w, frame: s.start + k * 4 });
      k += 1;
    }
  }
  return { appear: appear ?? 0, adds, final };
};

const SLOT_W = 190;
const GAP = 12;

/** Screen positions of the six final words (used by the constellation's hairlines). */
export const finalWordPositions = (W: number, H: number, vertical: boolean) => {
  if (vertical) {
    const cols = 3;
    const w = 220;
    const left = (W - cols * w - (cols - 1) * GAP) / 2;
    return RAIL_FINAL.map((word, i) => ({ word, x: left + (i % cols) * (w + GAP) + w / 2, y: 120 + Math.floor(i / cols) * 44 }));
  }
  const total = RAIL_FINAL.length * SLOT_W + (RAIL_FINAL.length - 1) * GAP;
  const left = (W - total) / 2;
  return RAIL_FINAL.map((word, i) => ({ word, x: left + i * (SLOT_W + GAP) + SLOT_W / 2, y: H - 24 - 28 }));
};

export const MemoryRail: React.FC<{ shots: Shot[] }> = ({ shots }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const vertical = H > W;
  const sched = railSchedule(shots);
  if (frame < sched.appear) return null;
  const appearO = interpolate(frame - sched.appear, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalAt = sched.final;
  const inFinal = finalAt !== null && frame >= finalAt;
  const collapse = finalAt === null ? 0 : interpolate(frame - finalAt, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: accel });
  const lastAdded = sched.adds.filter((a) => a.frame <= frame).length;

  if (vertical) {
    // Top row of eight dots, current word only; final six words as two rows of three.
    const top = 96;
    return (
      <div style={{ position: "absolute", left: 0, top: 0, width: W, opacity: appearO }}>
        {!inFinal || collapse < 1 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - collapse }}>
            {RAIL.map((w, i) => {
              const add = sched.adds.find((a) => a.word === w);
              const lit = add !== undefined && frame >= add.frame;
              const pop = add ? spring({ frame: frame - add.frame, fps, config: SPRING_POP, from: 0.6, to: 1 }) : 1;
              return <div key={w} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: lit ? C.accent : "rgba(239,238,233,0.15)", scale: `${lit ? pop : 1}`, opacity: lit && i < lastAdded - 1 ? 0.7 : 1 }} />;
            })}
          </div>
        ) : null}
        {!inFinal && lastAdded > 0 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: top + 22, textAlign: "center", fontFamily: FONT.mono, fontSize: 20, color: C.ink, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {sched.adds[lastAdded - 1].word}
          </div>
        ) : null}
        {inFinal
          ? finalWordPositions(W, H, true).map((p, i) => {
              const s = spring({ frame: frame - (finalAt as number) - 30 - i * 5, fps, config: SPRING_POP, from: 0.6, to: 1 });
              const o = interpolate(frame - (finalAt as number) - 30 - i * 5, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={p.word} style={{ position: "absolute", left: p.x - 110, top: p.y - 14, width: 220, textAlign: "center", fontFamily: FONT.mono, fontSize: 22, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", scale: `${s}`, opacity: o }}>
                  {p.word}
                </div>
              );
            })
          : null}
      </div>
    );
  }

  const h = 56;
  const bottom = 24;
  const slotW = (W - 2 * 96 - (RAIL.length - 1) * GAP) / RAIL.length;
  const railTop = H - bottom - h;
  return (
    <div style={{ position: "absolute", left: 0, top: railTop, width: W, height: h, opacity: appearO }}>
      {RAIL.map((w, i) => {
        const add = sched.adds.find((a) => a.word === w);
        const lit = add !== undefined && frame >= add.frame;
        const pop = add ? spring({ frame: frame - add.frame, fps, config: SPRING_POP, from: 0.6, to: 1 }) : 1;
        const underline = add ? interpolate(frame - add.frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const x0 = 96 + i * (slotW + GAP);
        // Collapse leftward into a single bar during the morph.
        const x = x0 + (96 - x0) * collapse;
        const dim = lit && i < lastAdded - 1 ? 0.7 : 1;
        return (
          <div key={w} style={{ position: "absolute", left: x, top: 0, width: slotW, height: h, opacity: (1 - collapse) * dim }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, backgroundColor: lit ? C.accent : "rgba(239,238,233,0.12)", scale: lit ? `${underline} 1` : "1 1", transformOrigin: "0 50%" }} />
            <div style={{ position: "absolute", left: 0, top: 12, fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.08em", textTransform: "uppercase", color: lit ? C.ink : "rgba(239,238,233,0.18)", scale: `${lit ? pop : 1}`, transformOrigin: "0 50%" }}>
              {lit ? w : ""}
            </div>
          </div>
        );
      })}
      {inFinal ? (
        <>
          <div style={{ position: "absolute", left: 96, bottom: 0, height: 2, width: (W - 2 * 96) * interpolate(collapse, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), backgroundColor: C.accent, opacity: collapse < 1 ? 1 : interpolate(frame - (finalAt as number) - 30, [0, 20], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          {finalWordPositions(W, H, false).map((p, i) => {
            const s = spring({ frame: frame - (finalAt as number) - 30 - i * 5, fps, config: SPRING_POP, from: 0.6, to: 1 });
            const o = interpolate(frame - (finalAt as number) - 30 - i * 5, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={p.word} style={{ position: "absolute", left: p.x - SLOT_W / 2, top: 12, width: SLOT_W, textAlign: "center", fontFamily: FONT.mono, fontSize: 22, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", scale: `${s}`, opacity: o }}>
                {p.word}
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
