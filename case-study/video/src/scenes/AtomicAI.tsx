// Beat 4 · Atomic AI Design — component-level push-ins, the AtomicLayer stack of node types
// beside the theory diagram (case-study/theory/atomic-ai-design.svg), and the moment every
// verified `created` edge draws out of its tool node while the slabs fly into the constellation.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { milestoneById, resolveTarget } from "../data/milestones";
import { C, FONT, SPRING_FLAT } from "../data/storyboard";
import { resolveEdgeSelector } from "../data/transfer-graph";
import { AtomicLayer } from "../components/AtomicLayer";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot, firstScreenRect } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { Label } from "../components/Statement";
import { ShotStatements, type ShotProps } from "./common";

export const ComponentPushes: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const n = shot.sources.length;
  const per = (shot.end - shot.start) / n;
  const k = Math.max(0, Math.min(n - 1, Math.floor(frame / per)));
  const src = shot.sources[k];
  const local = frame - k * per;
  const push = spring({ frame: local, fps, config: SPRING_FLAT, durationInFrames: 24 });
  const box = L.vertical ? L.fullBox() : { x: (L.W - 1500) / 2, y: 190, w: 1500, h: 640 };
  return (
    <>
      <BrowserFrame box={box} route={resolveTarget(src.milestone, src.section_key).route} caption={milestoneById(src.milestone).name} phone={L.vertical} />
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key, rect: firstScreenRect(src.milestone, src.section_key) }} to={{ milestone: src.milestone, sectionKey: src.section_key }} progress={push} />
      <ShotStatements shot={shot} position="top-center" size={L.vertical ? 44 : 56} />
    </>
  );
};

export const AtomicLayerShot: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const src = shot.sources[0];
  const box = L.vertical ? { x: 0, y: 0, w: L.W, h: L.H } : { x: 0, y: 0, w: L.W, h: L.H };
  const diagramO = interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={0.4} filter="blur(12px)" />
      {L.vertical ? (
        <>
          <Img src={staticFile("theory/atomic-ai-design-vertical.svg")} style={{ position: "absolute", left: (L.W - 640) / 2, top: 190, width: 640, opacity: diagramO, borderRadius: 6 }} />
          <AtomicLayer x={L.safe.x} y={L.H * 0.585 + 90} width={L.W - 2 * L.safe.x} from={0} phase="enter" slabH={36} />
        </>
      ) : (
        <>
          <Img src={staticFile("theory/atomic-ai-design.svg")} style={{ position: "absolute", left: L.safe.x, top: 200, width: 1040, opacity: diagramO, borderRadius: 6, border: "1px solid rgba(239,238,233,0.12)" }} />
          <AtomicLayer x={L.W - L.safe.x - 560} y={220} width={560} from={0} phase="enter" />
        </>
      )}
      <ShotStatements shot={shot} position="top-center" size={L.vertical ? 44 : 56} offsets={[48]} />
    </>
  );
};

export const Created: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const dur = shot.end - shot.start;
  const mid = Math.round(dur / 2);
  const a = shot.sources[0];
  const b = shot.sources[1] ?? a;
  const box = { x: 0, y: 0, w: L.W, h: L.H };
  const xf = interpolate(frame, [mid - 6, mid + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const createdType = resolveEdgeSelector("type:created")[0]?.type ?? "";
  const flyTo = L.vertical ? { x: L.W / 2, y: L.H * 0.83 } : { x: L.W * 0.64, y: L.H * 0.48 };
  return (
    <>
      <CameraShot box={box} target={{ milestone: a.milestone, sectionKey: a.section_key }} opacity={0.35 * (1 - xf)} />
      <CameraShot box={box} target={{ milestone: b.milestone, sectionKey: b.section_key }} opacity={0.35 * xf} />
      {L.vertical ? (
        <AtomicLayer x={L.safe.x} y={L.H * 0.585 + 90} width={L.W - 2 * L.safe.x} from={0} phase="compress" flyTo={flyTo} slabH={36} />
      ) : (
        <AtomicLayer x={L.W - L.safe.x - 560} y={220} width={560} from={0} phase="compress" flyTo={flyTo} />
      )}
      <div style={{ position: "absolute", right: L.safe.x, bottom: L.textBottom, display: "flex", alignItems: "center", gap: 12, opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ width: 40, height: 1, backgroundColor: C.ink }} />
        <Label text={createdType} size={L.mono} color={C.ink} style={{ position: "relative", letterSpacing: "0.12em", textTransform: "uppercase" }} />
      </div>
      <ShotStatements shot={shot} />
    </>
  );
};

export const AtomicDiagramNote: React.FC = () => <div style={{ fontFamily: FONT.mono }} />;
