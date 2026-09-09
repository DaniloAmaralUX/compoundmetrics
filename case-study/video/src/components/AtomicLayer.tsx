// Atomic AI Design: a stack of slabs, one per node type present in the transfer graph, ordered
// from the bottom: component · resource · rule · contract · eval · skill · agent · registry.
// Each slab shows the type name and L.node.type.count[type] (counted at render).
// `phase` = "enter" (slabs rise 6 f apart, spring-pop) or "compress" (collapse into one tile and
// fly to a point — the constellation).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SPRING_FLAT, SPRING_POP } from "../data/storyboard";
import { nodeTypeCounts } from "../data/transfer-graph";

const ORDER = ["component", "resource", "rule", "contract", "eval", "skill", "agent", "registry"];

export const orderedTypeCounts = () => {
  const counts = nodeTypeCounts().filter((c) => c.type !== "tool" && c.type !== "external");
  return [...counts].sort((a, b) => {
    const ia = ORDER.indexOf(a.type);
    const ib = ORDER.indexOf(b.type);
    return (ia < 0 ? ORDER.length : ia) - (ib < 0 ? ORDER.length : ib);
  });
};

type Props = { x: number; y: number; width: number; from?: number; phase: "enter" | "compress"; flyTo?: { x: number; y: number }; slabH?: number };

export const AtomicLayer: React.FC<Props> = ({ x, y, width, from = 0, phase, flyTo, slabH = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = orderedTypeCounts();
  const local = frame - from;
  const gap = 8;
  const totalH = rows.length * (slabH + gap);
  const compress = phase === "compress" ? spring({ frame: local, fps, config: SPRING_FLAT, durationInFrames: 20 }) : 0;
  const fly = phase === "compress" ? spring({ frame: local - 16, fps, config: SPRING_FLAT, durationInFrames: 24 }) : 0;
  const cx = x + width / 2;
  const cy = y + totalH / 2;
  const tx = flyTo ? (flyTo.x - cx) * fly : 0;
  const ty = flyTo ? (flyTo.y - cy) * fly : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: totalH, translate: `${tx}px ${ty}px`, scale: `${1 - fly * 0.85}`, opacity: 1 - Math.max(0, fly - 0.7) / 0.3 }}>
      {rows.map((r, i) => {
        const bottomIndex = rows.length - 1 - i; // component at the bottom enters first
        const enter = phase === "enter" ? spring({ frame: local - bottomIndex * 6, fps, config: SPRING_POP, durationInFrames: 22 }) : 1;
        const restTop = i * (slabH + gap);
        const top = restTop + (totalH / 2 - slabH / 2 - restTop) * compress;
        return (
          <div
            key={r.type}
            style={{
              position: "absolute",
              left: 0,
              top,
              width,
              height: slabH,
              borderRadius: 6,
              border: `1px solid rgba(239,238,233,${0.18 + 0.05 * bottomIndex})`,
              backgroundColor: `rgba(20,21,20,${0.9 - compress * 0.2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px",
              fontFamily: FONT.mono,
              color: C.ink,
              opacity: Math.min(1, enter) * (i === 0 ? 1 : 1 - compress * 0.9),
              translate: `0px ${(1 - Math.min(1, enter)) * 40}px`,
            }}
          >
            <span style={{ fontSize: 22, letterSpacing: "0.1em", textTransform: "uppercase", color: r.type === "component" ? C.accent : C.ink }}>{r.type}</span>
            <span style={{ fontSize: 26, fontWeight: 600, fontFamily: FONT.sans, color: C.muted }}>{r.count}</span>
          </div>
        );
      })}
    </div>
  );
};

/** The Atomic AI Design diagram (case-study/theory/atomic-ai-design.svg) with a fade-in. */
export const AtomicDiagramFade = (frame: number, from: number) =>
  interpolate(frame - from, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
