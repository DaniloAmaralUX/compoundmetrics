// Beat 9 · Finale — a dim drifting mosaic of every ENTRY hero under the closing statements.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CameraShot } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { CenterGlow, Scrim, ShotStatements, type ShotProps } from "./common";

export const Mosaic: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const cols = L.vertical ? 3 : 4;
  const rows = Math.ceil(shot.sources.length / cols);
  const tw = L.W / cols + 40;
  const th = (L.H / rows) + 40;
  const drift = interpolate(frame, [0, shot.end - shot.start], [0, -40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {shot.sources.map((s, i) => (
        <CameraShot key={s.milestone} box={{ x: (i % cols) * (tw - 40) + drift * ((i % 3) - 1) * 0.5, y: Math.floor(i / cols) * (th - 40) + drift, w: tw, h: th }} target={{ milestone: s.milestone, sectionKey: s.section_key }} opacity={0.25} />
      ))}
      <Scrim opacity={0.6} />
      <ShotStatements shot={shot} position="center" stacked />
    </>
  );
};

export const FinalStatement: React.FC<ShotProps> = ({ shot }) => {
  return (
    <>
      <CenterGlow />
      <ShotStatements shot={shot} position="center" stacked scrim={false} />
    </>
  );
};
