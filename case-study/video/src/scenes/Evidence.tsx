// The closing evidence line (L.evidence): milestone count, verified edges of total, rubric hash
// prefix and the benchmark's generation timestamp — one row, every character from data.
// Also the tools caption when the shot carries it (the teaser's only appearance).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { designScores, rubricShaShort } from "../data/design-scores";
import { milestoneCount } from "../data/milestones";
import { C } from "../data/storyboard";
import { toolsCaption } from "../data/tools";
import { transferGraph } from "../data/transfer-graph";
import { useLayout } from "../components/layout";
import { Label } from "../components/Statement";
import { CenterGlow, ShotStatements, type ShotProps } from "./common";

export const evidenceLine = `milestones ${milestoneCount} · edges ${transferGraph.counts.verified_edges}/${transferGraph.counts.edges} verified · rubric ${rubricShaShort} · data ${designScores.generated_at}`;

export const EvidenceShot: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const hasCaption = shot.text_keys.includes("L.tools.caption");
  const o = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <CenterGlow />
      <ShotStatements shot={shot} position="center" size={L.vertical ? 40 : 48} stacked scrim={false} offsets={shot.text_keys.filter((k) => k.startsWith("T.")).map((_, i) => i * 24)} />
      {shot.text_keys.includes("L.evidence") ? (
        <Label text={evidenceLine} size={16} color={C.muted} align="center" style={{ left: L.safe.x, right: L.safe.x, bottom: L.vertical ? L.safe.y : L.textBottom - 40, opacity: o }} />
      ) : null}
      {hasCaption ? <Label text={toolsCaption} from={20} size={L.mono} color={C.muted} align="center" style={{ left: L.safe.x, right: L.safe.x, bottom: L.textBottom - 40 }} /> : null}
    </>
  );
};
