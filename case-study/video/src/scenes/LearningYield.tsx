// Beat 7 · Learning Yield — findings vs meaningful failures (the gap is the decision), the yield
// ladder (seven rows, every numeral from learning-yield.json; no defaults), and the verified chain
// Finding → Correction → Durable Learning → Resource Candidate → Future Capability rendered with
// the actual node labels of transfer-graph.end_to_end_chains[0], keeping its caveat on screen.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evidenceBoundaryLine, findings, meaningfulFailures, provenanceLine, yieldLadder } from "../data/learning-yield";
import { C, FONT, SPRING_POP, decel, edgeColor } from "../data/storyboard";
import { chain, edgeById, nodeLabel, nodesOfType, resolveEdgeSelector } from "../data/transfer-graph";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { CountUp } from "../components/ScoreReveal";
import { Label } from "../components/Statement";
import { LeftPanel, Scrim, ShotStatements, labelIds, type ShotProps } from "./common";

export const YieldCounters: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  const o = interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const big = L.vertical ? 84 : 120;
  const rows = [
    { label: "findings", value: findings, color: C.ink },
    { label: "meaningful failures", value: meaningfulFailures, color: C.accent },
  ];
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={0.45} />
      <div style={{ position: "absolute", left: 0, top: 0, width: L.vertical ? L.W : L.W * 0.55, height: L.H, background: "linear-gradient(90deg, rgba(11,12,11,0.92) 60%, rgba(11,12,11,0) 100%)" }} />
      <div style={{ position: "absolute", left: L.safe.x, top: L.vertical ? L.H * 0.585 + 110 : L.safe.y + 20, display: "flex", gap: L.vertical ? 60 : 120, opacity: o }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ fontFamily: FONT.sans }}>
            <div style={{ fontSize: big, fontWeight: 600, lineHeight: 1, color: r.color, fontVariantNumeric: "tabular-nums" }}>
              <CountUp value={r.value} from={12 + i * 10} />
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: L.mono, color: C.muted, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{r.label}</div>
          </div>
        ))}
      </div>
      <Label text={provenanceLine} from={30} size={16} style={{ left: L.safe.x, top: L.vertical ? L.H * 0.585 + 110 + big + 60 : L.safe.y + 20 + big + 60 }} />
      <ShotStatements shot={shot} />
    </>
  );
};

export const YieldLadder: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  const rowH = L.vertical ? 46 : 62;
  const width = L.vertical ? L.W - 2 * L.safe.x : 720;
  const top = L.vertical ? 230 : L.safe.y + 10;
  const keys = labelIds(shot, "L.yield");
  const rows = yieldLadder.filter((r) => keys.length === 0 || keys.includes(r.key));
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={0.3} />
      <LeftPanel width={L.vertical ? L.W : width + L.safe.x + 160} />
      <div style={{ position: "absolute", left: L.safe.x, top, width }}>
        {rows.map((r, i) => {
          const p = spring({ frame: frame - i * 18, fps, config: SPRING_POP, durationInFrames: 20 });
          return (
            <div key={r.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: rowH, borderBottom: "1px solid rgba(239,238,233,0.12)", opacity: Math.min(1, p), translate: `0px ${(1 - Math.min(1, p)) * 14}px` }}>
              <span style={{ fontFamily: FONT.mono, fontSize: L.vertical ? 20 : 24, color: i === rows.length - 1 ? C.accent : C.ink, letterSpacing: "0.04em" }}>{r.label}</span>
              <span style={{ fontFamily: FONT.sans, fontSize: L.vertical ? 34 : 44, fontWeight: 600, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
                <CountUp value={r.value} from={i * 18 + 2} />
              </span>
            </div>
          );
        })}
      </div>
      <Label text={evidenceBoundaryLine} from={rows.length * 18} size={16} color={C.muted} style={{ left: L.safe.x, width, top: top + rows.length * rowH + 16 }} />
      <ShotStatements shot={shot} />
    </>
  );
};

export const ChainShot: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.fullBox();
  const ci = Number.parseInt(labelIds(shot, "L.chain")[0] ?? "0", 10) || 0;
  const c = chain(ci);
  const edges = c.edges.map((id) => edgeById(id));
  // the ordered stations of the chain: from the first failure edge onwards
  const stations = [edges[1].from, edges[1].to, edges[2].to, edges[3].to, edges[4].to];
  const stationEdges = [edges[1], edges[2], edges[3], edges[4]];
  const caveat = (c.note ?? "").split(". ").slice(-1)[0];
  const agents = nodesOfType("agent");
  const superseded = new Set(resolveEdgeSelector("type:superseded").map((e) => e.from));
  const colW = (L.W - 2 * L.safe.x) / stations.length;
  return (
    <>
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={0.3} />
      <Scrim opacity={0.55} />
      <Label text={c.name} from={0} size={L.mono} color={C.muted} style={{ left: L.safe.x, right: L.safe.x, top: L.safe.y, lineHeight: 1.4 }} />
      <div style={{ position: "absolute", left: L.safe.x, top: L.safe.y + 110, width: L.W - 2 * L.safe.x, display: "flex" }}>
        {stations.map((id, i) => {
          const p = spring({ frame: frame - 20 - i * 14, fps, config: SPRING_POP, durationInFrames: 20 });
          const e = i > 0 ? stationEdges[i - 1] : null;
          return (
            <div key={i} style={{ width: colW, paddingRight: 24, opacity: Math.min(1, p), translate: `0px ${(1 - Math.min(1, p)) * 12}px` }}>
              {e ? <div style={{ fontFamily: FONT.mono, fontSize: 13, color: edgeColor(e.type), letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>→ {e.type}</div> : <div style={{ height: 24 }} />}
              <div style={{ fontFamily: FONT.mono, fontSize: 17, color: C.ink, lineHeight: 1.35, borderTop: `2px solid ${e ? edgeColor(e.type) : C.ink}`, paddingTop: 10 }}>{nodeLabel(id)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: L.safe.x, bottom: L.textBottom + 60, display: "flex", flexWrap: "wrap", gap: 10, maxWidth: L.W - 2 * L.safe.x }}>
        {agents.map((a, i) => {
          const gone = superseded.has(a.id);
          const p = interpolate(frame - 110 - i * 5, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={a.id} style={{ fontFamily: FONT.mono, fontSize: 14, color: gone ? C.muted : C.accent, border: `1px solid ${gone ? "rgba(143,145,139,0.4)" : "rgba(215,255,87,0.5)"}`, borderRadius: 4, padding: "4px 10px", opacity: p * (gone ? 0.45 : 1), textDecoration: gone ? "line-through" : undefined }}>
              {a.label}
            </div>
          );
        })}
      </div>
      <Label text={caveat} from={60} size={16} style={{ left: L.safe.x, right: L.safe.x, bottom: L.railInset + L.railH + 16 }} />
    </>
  );
};
