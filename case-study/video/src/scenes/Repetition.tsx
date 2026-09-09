// Beat 2 · Repetition — interface match cuts on the same sections.json key (nav → nav, hero →
// hero, primary_action → primary_action) and the contact grid of every ENTRY hero with a FAIL bar.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { maxFail, persistentLabel, scoreOf } from "../data/design-scores";
import { milestoneById, resolveTarget } from "../data/milestones";
import { C, FONT } from "../data/storyboard";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { cutIndex, useLayout } from "../components/layout";
import { CornerLabel, Scrim, ShotStatements, labelIds, type ShotProps } from "./common";

export const Cuts: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const n = shot.sources.length;
  const per = (shot.end - shot.start) / n;
  const k = cutIndex(shot, shot.start + frame);
  const src = shot.sources[k];
  const box = L.boxForKey(src.section_key);
  const local = frame - k * per;
  const push = interpolate(local, [0, 15], [1, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const persistent = labelIds(shot, "L.persistent").map((i) => Number.parseInt(i, 10)).filter((i) => Number.isFinite(i));
  return (
    <>
      <BrowserFrame box={box} route={resolveTarget(src.milestone, src.section_key).route} caption={milestoneById(src.milestone).name} phone={L.vertical} />
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} push={push} />
      <ShotStatements shot={shot} />
      {persistent.map((i) => (
        <CornerLabel key={i} text={persistentLabel(i)} />
      ))}
    </>
  );
};

export const Grid: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const cols = L.vertical ? 3 : 4;
  const rows = Math.ceil(shot.sources.length / cols);
  const gap = 16;
  const areaW = L.W - 2 * L.safe.x;
  const areaH = L.vertical ? L.H * 0.5 : L.H - L.textBottom - L.safe.y;
  const tw = (areaW - (cols - 1) * gap) / cols;
  const th = Math.min((areaH - (rows - 1) * gap) / rows, tw * 0.6);
  const top = L.vertical ? 200 : L.safe.y + (areaH - rows * th - (rows - 1) * gap) / 2;
  return (
    <>
      {shot.sources.map((s, i) => {
        const x = L.safe.x + (i % cols) * (tw + gap);
        const y = top + Math.floor(i / cols) * (th + gap);
        const fail = scoreOf(s.milestone).counts.FAIL / maxFail;
        const bar = interpolate(frame, [6 + i * 2, 30 + i * 2], [0, fail], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <React.Fragment key={s.milestone}>
            <CameraShot box={{ x, y, w: tw, h: th - 8 }} target={{ milestone: s.milestone, sectionKey: s.section_key }} filter="saturate(0.4)" radius={4} />
            <div style={{ position: "absolute", left: x, top: y + th - 6, height: 4, width: (tw - 0) * bar, backgroundColor: C.warm }} />
            <div style={{ position: "absolute", left: x, top: y + th - 6, height: 4, width: tw, backgroundColor: "rgba(239,238,233,0.08)", zIndex: -1 }} />
            <div style={{ position: "absolute", left: x + 8, top: y + 6, fontFamily: FONT.mono, fontSize: 14, color: C.muted, backgroundColor: "rgba(11,12,11,0.7)", padding: "2px 6px", borderRadius: 3 }}>{s.milestone}</div>
          </React.Fragment>
        );
      })}
      <Scrim opacity={0.4} />
      <ShotStatements shot={shot} position="center" stacked />
    </>
  );
};
