// Beat 8 · Compound Design / Work System — the v0.3.0-alpha.1 production page (its title typeset
// from milestones[].entry_title) while the constellation converges behind it; the real cd-* skill
// nodes listed over the /resources loop; the rail morph (handled by MemoryRail) under a camera
// pulling back from the hero to the footer.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { entryTitle, milestoneById } from "../data/milestones";
import { C, FONT, SPRING_FLAT, decel } from "../data/storyboard";
import { graphCountsLabel, nodesOfType } from "../data/transfer-graph";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { Label } from "../components/Statement";
import { CornerLabel, LeftPanel, ShotStatements, labelIds, type ShotProps } from "./common";

export const Converge: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const src = shot.sources[0];
  const dur = shot.end - shot.start;
  const push = interpolate(frame, [0, dur], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const titleId = labelIds(shot, "L.entry_title")[0] ?? src.milestone;
  const box = L.vertical ? L.fullBox() : { x: (L.W - 1500) / 2, y: 150, w: 1500, h: 640 };
  return (
    <>
      <BrowserFrame box={box} caption={milestoneById(src.milestone).date_range} phone={L.vertical} />
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} push={push} opacity={0.9} />
      <Label text={entryTitle(titleId)} from={8} size={L.vertical ? 22 : 28} color={C.ink} align="center" style={{ left: L.safe.x, right: L.safe.x, top: L.vertical ? L.H * 0.585 + 20 : box.y + box.h + 48 }} />
      <ShotStatements shot={shot} position="band" size={L.vertical ? 40 : 48} />
      {shot.text_keys.includes("L.graph.counts") ? <CornerLabel text={graphCountsLabel} /> : null}
    </>
  );
};

export const Skills: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const a = shot.sources[0];
  const b = shot.sources[1] ?? a;
  const dur = shot.end - shot.start;
  const xfAt = Math.round(dur * 0.7);
  const xf = interpolate(frame, [xfAt, xfAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pan = spring({ frame, fps, config: SPRING_FLAT, durationInFrames: 90 });
  const box = L.fullBox();
  const skills = nodesOfType("skill");
  return (
    <>
      <CameraShot box={box} target={{ milestone: a.milestone, sectionKey: a.section_key }} to={{ milestone: b.milestone, sectionKey: b.section_key }} progress={0} push={1 + pan * 0.08} opacity={0.6 * (1 - xf)} style={{ translate: `${-pan * 260}px 0px` }} />
      <CameraShot box={box} target={{ milestone: b.milestone, sectionKey: b.section_key }} opacity={0.6 * xf} />
      <LeftPanel width={L.W * 0.42} />
      <div style={{ position: "absolute", left: L.safe.x, top: L.safe.y, fontFamily: FONT.mono, fontSize: 20, color: C.ink, lineHeight: 1.6 }}>
        {skills.map((s, i) => (
          <div key={s.id} style={{ opacity: interpolate(frame - 10 - i * 4, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{s.label}</div>
        ))}
      </div>
      <Label text={`${milestoneById(b.milestone).name} · ${milestoneById(b.milestone).date_range}`} from={xfAt} size={L.small} style={{ left: L.safe.x, bottom: L.textBottom }} />
    </>
  );
};

export const RailMorph: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const a = shot.sources[0];
  const b = shot.sources[1] ?? a;
  const dur = shot.end - shot.start;
  const pull = spring({ frame: frame - 20, fps, config: SPRING_FLAT, durationInFrames: dur - 30 });
  const box = L.fullBox();
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: a.milestone, sectionKey: a.section_key }} to={{ milestone: b.milestone, sectionKey: b.section_key }} progress={pull} opacity={0.5} />
      <ShotStatements shot={shot} />
    </>
  );
};
