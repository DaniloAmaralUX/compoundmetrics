// Beat 3 · Extraction — one real chain (transfer-graph.end_to_end_chains[0], fully verified):
// site-check failure → ledger entry → solution doc → rule → reused by the check → discoverable
// via the contract. The finding card grows across the three shots; the loop closes on the
// /resources page; a type ledger (L.node.type.count[type]) bridges into the next beat.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveTarget } from "../data/milestones";
import { C, FONT, SPRING_FLAT, SPRING_POP, decel, edgeColor } from "../data/storyboard";
import { chain, edgeById, nodeLabel, nodeTypeCounts } from "../data/transfer-graph";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { Label } from "../components/Statement";
import { ShotStatements, labelIds, type ShotProps } from "./common";

type Row = { kind: "node" | "edge"; text: string; color?: string };

/** Rows of the chain card up to a stage: 0 = failure only, 1 = + promoted rows, 2 = + the loop. */
const chainRows = (chainIndex: number, stage: number): Row[] => {
  const c = chain(chainIndex);
  const edges = c.edges.map((id) => edgeById(id));
  // edges[0] is the tool → check edge (created); the chain of interest starts at edges[1]
  const e1 = edges[1];
  const rows: Row[] = [{ kind: "node", text: nodeLabel(e1.from) }, { kind: "edge", text: e1.type, color: edgeColor(e1.type) }, { kind: "node", text: nodeLabel(e1.to) }];
  if (stage >= 1) {
    for (const e of edges.slice(2, 4)) {
      rows.push({ kind: "edge", text: e.type, color: edgeColor(e.type) }, { kind: "node", text: nodeLabel(e.to) });
    }
  }
  if (stage >= 2) {
    const loop = edges[4];
    const contract = edges[5];
    rows.push({ kind: "edge", text: `${loop.type} ↺ ${nodeLabel(loop.to)}`, color: edgeColor(loop.type) });
    rows.push({ kind: "edge", text: `${nodeLabel(contract.from)} — ${contract.type}`, color: edgeColor(contract.type) });
  }
  return rows;
};

const ChainCard: React.FC<{ stage: number; prevRows: number; from?: number; title?: string }> = ({ stage, prevRows, from = 0, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const rows = chainRows(0, stage);
  const slide = spring({ frame: frame - from, fps, config: SPRING_FLAT, durationInFrames: 20 });
  const width = L.vertical ? L.W - 2 * L.safe.x : 600;
  const top = L.vertical ? 240 : L.safe.y;
  return (
    <div style={{ position: "absolute", left: L.vertical ? L.safe.x : L.safe.x + (prevRows === 0 ? (1 - slide) * -60 : 0), top, width, padding: 20, borderRadius: 8, backgroundColor: "rgba(11,12,11,0.88)", border: "1px solid rgba(239,238,233,0.16)", fontFamily: FONT.mono, opacity: prevRows === 0 ? slide : 1 }}>
      {title ? <div style={{ fontSize: 16, color: C.muted, lineHeight: 1.4, marginBottom: 10, opacity: interpolate(frame - from, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{title}</div> : null}
      {rows.map((r, i) => {
        const isNew = i >= prevRows;
        const enter = isNew ? spring({ frame: frame - from - (i - prevRows) * 8, fps, config: SPRING_POP, durationInFrames: 18 }) : 1;
        return (
          <div key={i} style={{ opacity: Math.min(1, enter), translate: `${(1 - Math.min(1, enter)) * 16}px 0px`, padding: r.kind === "node" ? "8px 0" : "2px 0 2px 16px", fontSize: r.kind === "node" ? (L.vertical ? 17 : 19) : 14, color: r.kind === "node" ? C.ink : (r.color ?? C.muted), letterSpacing: r.kind === "edge" ? "0.12em" : undefined, textTransform: r.kind === "edge" ? "uppercase" : undefined, lineHeight: 1.35, borderLeft: r.kind === "edge" ? `2px solid ${r.color ?? C.muted}` : undefined }}>
            {r.text}
          </div>
        );
      })}
    </div>
  );
};

export const Finding: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  const push = interpolate(frame, [0, shot.end - shot.start], [1, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} push={push} opacity={0.55} />
      <ChainCard stage={0} prevRows={0} from={4} />
      <ShotStatements shot={shot} offsets={[18]} />
    </>
  );
};

export const Resource: React.FC<ShotProps> = ({ shot }) => {
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  return (
    <>
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={0.55} />
      <ChainCard stage={1} prevRows={3} from={0} />
      <ShotStatements shot={shot} offsets={[12]} />
    </>
  );
};

export const Loop: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  const pan = spring({ frame, fps, config: SPRING_FLAT, durationInFrames: 30 });
  const chainIndex = Number.parseInt(labelIds(shot, "L.chain")[0] ?? "0", 10) || 0;
  const title = chain(chainIndex).name;
  const prevRows = L.vertical ? 3 : 7;
  const counts = nodeTypeCounts().filter((c) => c.type !== "tool" && c.type !== "external");
  const hasLedger = shot.text_keys.some((k) => k.startsWith("L.node.type.count"));
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: `${src.section_key.slice(0, src.section_key.indexOf("/"))}/hero` }} to={{ milestone: src.milestone, sectionKey: src.section_key }} progress={pan} opacity={0.6} />
      <ChainCard stage={L.vertical ? 1 : 2} prevRows={prevRows} from={0} title={title} />
      <ShotStatements shot={shot} />
      {hasLedger && !L.vertical ? (
        <div style={{ position: "absolute", left: L.safe.x, right: L.safe.x, bottom: L.railInset + L.railH + 40, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {counts.map((c, i) => {
            const o = interpolate(frame - 40 - i * 4, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={c.type} style={{ fontFamily: FONT.mono, fontSize: 16, color: C.ink, border: "1px solid rgba(239,238,233,0.2)", borderRadius: 4, padding: "4px 10px", opacity: o, backgroundColor: "rgba(11,12,11,0.8)" }}>
                {c.type} <span style={{ color: C.accent }}>{c.count}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      {L.vertical ? <Label text={resolveTarget(src.milestone, src.section_key).route} size={16} style={{ left: L.safe.x, top: L.H - L.safe.y - 30 }} /> : null}
    </>
  );
};
