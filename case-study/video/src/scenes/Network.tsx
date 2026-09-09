// Beat 5 · Network — resources transfer between tools. A tile travels along a verified edge,
// the same page is proven identical in two products (ahash Δ from milestones.merge_evaluation),
// and the external Lifeline node fans out to three products. Bottom-right: L.graph.counts.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mergePair, milestoneById, resolveTarget } from "../data/milestones";
import { C, FONT, SPRING_FLAT } from "../data/storyboard";
import { edgeById, edgeType, graphCountsLabel, nodeLabel } from "../data/transfer-graph";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { useLayout, type Box } from "../components/layout";
import { ResourceTransfer } from "../components/ResourceTransfer";
import { Label } from "../components/Statement";
import { CornerLabel, ShotStatements, labelIds, type ShotProps } from "./common";

export const Transfer: React.FC<ShotProps> = ({ shot }) => {
  const L = useLayout();
  const edges = labelIds(shot, "L.edge.type");
  const tile = labelIds(shot, "L.node.label")[0] ?? edgeById(edges[edges.length - 1]).from;
  return (
    <>
      <ResourceTransfer left={shot.sources[0]} right={shot.sources[1]} tileNode={tile} edgeIds={edges} W={L.W} H={L.H} vertical={L.vertical} />
      <ShotStatements shot={shot} position="top-left" />
    </>
  );
};

export const Identical: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const a = shot.sources[0];
  const b = shot.sources[1];
  const pair = mergePair(a.milestone, b.milestone);
  const edges = labelIds(shot, "L.edge.type");
  const last = edges[edges.length - 1];
  const tile = edgeById(last).from;
  const labelO = interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <ResourceTransfer left={a} right={b} tileNode={tile} edgeIds={[...edges]} W={L.W} H={L.H} vertical={L.vertical} slideOver showDates={false} />
      {pair ? (
        <Label text={`ahash Δ ${pair.ahash_hamming} bits · ${a.milestone} ${resolveTarget(a.milestone, a.section_key).route} = ${b.milestone} ${resolveTarget(b.milestone, b.section_key).route}`} size={L.mono} color={C.accent} align="center" style={{ left: L.safe.x, right: L.safe.x, top: L.vertical ? L.H * 0.585 + 60 : 186, opacity: labelO }} />
      ) : null}
      <ShotStatements shot={shot} position="top-left" />
    </>
  );
};

export const Fan: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const ext = labelIds(shot, "L.node.label")[0];
  const n = shot.sources.length;
  const boxes: Box[] = L.vertical
    ? shot.sources.map((_, i) => ({ x: 60 + i * 330, y: 320, w: 300, h: 560 }))
    : shot.sources.map((_, i) => {
        const w = L.W * 0.28;
        const gap = (L.W - 2 * L.safe.x - n * w) / (n - 1);
        return { x: L.safe.x + i * (w + gap), y: 330, w, h: L.H - 330 - L.railInset - L.railH - 70 };
      });
  const origin = { x: L.W / 2, y: L.vertical ? 230 : 200 };
  return (
    <>
      {shot.sources.map((s, i) => (
        <React.Fragment key={s.milestone}>
          <BrowserFrame box={boxes[i]} route={resolveTarget(s.milestone, s.section_key).route} caption={milestoneById(s.milestone).name} phone={L.vertical} />
          <CameraShot box={boxes[i]} target={{ milestone: s.milestone, sectionKey: s.section_key }} />
        </React.Fragment>
      ))}
      <svg width={L.W} height={L.H} style={{ position: "absolute", left: 0, top: 0 }}>
        {boxes.map((b, i) => {
          const p = spring({ frame: frame - 10 - i * 8, fps, config: SPRING_FLAT, durationInFrames: 24 });
          const tx = b.x + b.w / 2;
          const ty = b.y - 24;
          return <line key={i} x1={origin.x} y1={origin.y + 20} x2={origin.x + (tx - origin.x) * p} y2={origin.y + 20 + (ty - origin.y - 20) * p} stroke={C.warm} strokeWidth={1.2} strokeDasharray="3 5" opacity={0.8} />;
        })}
      </svg>
      {ext ? (
        <div style={{ position: "absolute", left: L.safe.x, right: L.safe.x, top: origin.y - 14, textAlign: "center", fontFamily: FONT.mono, fontSize: L.mono, color: C.warm, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {nodeLabel(ext)} · {edgeType(shot.constellation.edges[0])}
        </div>
      ) : null}
      <ShotStatements shot={shot} position="top-left" />
      {shot.text_keys.includes("L.graph.counts") ? <CornerLabel text={graphCountsLabel} from={40} /> : null}
    </>
  );
};
