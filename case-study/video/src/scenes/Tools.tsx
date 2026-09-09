// Beat 1 · Hook, MS-02 / MS-03 / VT-02: the constellation field enters (rendered by the persistent
// ToolConstellation); here: the parked headline, T.hook.2 → T.hook.3, and the tools caption
// L.tools.caption (candidates / verified) — its only appearance in each composition.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../data/storyboard";
import { toolsCaption } from "../data/tools";
import { Label, Statement } from "../components/Statement";
import { useLayout } from "../components/layout";
import { HookHeadline } from "./Hook";
import { ShotStatements, type ShotProps } from "./common";
import { phrase } from "../data/storyboard";

export const HookNodes: React.FC<ShotProps> = ({ shot }) => {
  const L = useLayout();
  const dur = shot.end - shot.start;
  return (
    <>
      <HookHeadline from={-60} parkAt={0} size={L.vertical ? 48 : 80} />
      <ShotStatements shot={shot} offsets={[Math.round(dur * 0.46)]} />
    </>
  );
};

export const HookSystem: React.FC<ShotProps> = ({ shot }) => {
  const L = useLayout();
  const frame = useCurrentFrame();
  const hasHook2 = shot.text_keys.includes("T.hook.3");
  const captionTop = L.vertical ? 150 + 48 * 0.6 * 1.3 + 10 : L.safe.y + 80 * 0.42 * 1.3 + 12;
  const xf = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <HookHeadline from={-120} parkAt={-60} size={L.vertical ? 48 : 80} />
      {hasHook2 && !L.vertical ? (
        <Statement text={phrase("T.hook.2")} from={-40} size={L.headline} style={{ left: L.safe.x, bottom: L.textBottom, opacity: 1 - xf }} />
      ) : null}
      <ShotStatements shot={shot} />
      <Label text={toolsCaption} from={6} size={L.mono} color={C.muted} style={{ left: L.safe.x, top: captionTop }} />
    </>
  );
};
