// A resource tile travels along an edge between two products (split-screen, source left /
// destination right; stacked in 9:16), leaving the edge lit behind it. Labels come from
// transfer-graph.json (node label, edge types) and milestones.json (date_range).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { milestoneById, resolveTarget } from "../data/milestones";
import { C, FONT, decel, type Source } from "../data/storyboard";
import { edgeType, nodeLabel } from "../data/transfer-graph";
import { BrowserFrame } from "./BrowserFrame";
import { CameraShot } from "./CameraShot";
import type { Box } from "./layout";

type Props = {
  left: Source;
  right: Source;
  tileNode: string;
  edgeIds: string[];
  from?: number;
  W: number;
  H: number;
  vertical: boolean;
  showDates?: boolean;
  slideOver?: boolean;
};

export const ResourceTransfer: React.FC<Props> = ({ left, right, tileNode, edgeIds, from = 0, W, H, vertical, showDates = true, slideOver = false }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const travel = interpolate(local, [12, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const slide = slideOver ? interpolate(local, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel }) : 0;

  const half = vertical ? 0.5 : 0.46;
  const boxL: Box = vertical
    ? { x: 150, y: 180, w: 780, h: 400 }
    : { x: 96, y: 230, w: W * half - 96, h: H - 230 - 96 - 90 };
  const boxR: Box = vertical
    ? { x: 150, y: 670, w: 780, h: 400 }
    : { x: W - 96 - (W * half - 96), y: boxL.y, w: W * half - 96, h: boxL.h };
  const gapStart = vertical ? { x: W / 2, y: boxL.y + boxL.h } : { x: boxL.x + boxL.w, y: boxL.y + boxL.h / 2 };
  const gapEnd = vertical ? { x: W / 2, y: boxR.y } : { x: boxR.x, y: boxR.y + boxR.h / 2 };
  const tile = { x: gapStart.x + (gapEnd.x - gapStart.x) * travel, y: gapStart.y + (gapEnd.y - gapStart.y) * travel };
  const routeL = resolveTarget(left.milestone, left.section_key).route;
  const routeR = resolveTarget(right.milestone, right.section_key).route;

  const leftBox: Box = slideOver ? { ...boxL, x: boxL.x + (boxR.x - boxL.x) * slide, y: boxL.y + (boxR.y - boxL.y) * slide } : boxL;

  return (
    <>
      <BrowserFrame box={boxR} route={routeR} caption={showDates ? `${milestoneById(right.milestone).name} · ${milestoneById(right.milestone).date_range}` : undefined} phone={vertical} />
      <CameraShot box={boxR} target={{ milestone: right.milestone, sectionKey: right.section_key }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={gapStart.x} y1={gapStart.y} x2={tile.x} y2={tile.y} stroke={C.accent} strokeWidth={2} opacity={0.9} />
        <line x1={tile.x} y1={tile.y} x2={gapEnd.x} y2={gapEnd.y} stroke={C.accent} strokeWidth={1} strokeDasharray="4 6" opacity={0.35} />
      </svg>
      <BrowserFrame box={leftBox} route={routeL} caption={showDates ? `${milestoneById(left.milestone).name} · ${milestoneById(left.milestone).date_range}` : undefined} phone={vertical} />
      <CameraShot box={leftBox} target={{ milestone: left.milestone, sectionKey: left.section_key }} />
      <div
        style={{
          position: "absolute",
          left: tile.x - 150,
          top: tile.y - 22,
          width: 300,
          padding: "10px 14px",
          borderRadius: 6,
          backgroundColor: C.ground,
          border: `1px solid ${C.accent}`,
          color: C.ink,
          fontFamily: FONT.mono,
          fontSize: 15,
          lineHeight: 1.3,
          textAlign: "center",
          opacity: interpolate(local, [6, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          boxShadow: `0 0 30px rgba(215,255,87,0.25)`,
        }}
      >
        {nodeLabel(tileNode)}
        <div style={{ color: C.accent, fontSize: 13, marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {edgeIds.map((id) => edgeType(id)).join(" → ")}
        </div>
      </div>
    </>
  );
};
