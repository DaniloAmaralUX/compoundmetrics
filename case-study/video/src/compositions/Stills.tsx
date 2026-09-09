// Stills: cover, contact sheet (all milestones' entry screenshots with id, name, date, score +
// coverage) and the evolution map (tool constellation + transfer graph with L.graph.counts).
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CameraShot } from "../components/CameraShot";
import { ToolConstellation } from "../components/ToolConstellation";
import { designScores, scoreLabel, scoreOf } from "../data/design-scores";
import { entryTitle, latestMilestone, milestones } from "../data/milestones";
import { C, FONT, edgeColor, phrase, shotsOf } from "../data/storyboard";
import { toolsCaption, statedCount } from "../data/tools";
import { graphCountsLabel, transferGraph, verifiedEdges } from "../data/transfer-graph";
import { evidenceLine } from "../scenes/Evidence";

export const CompoundCover: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, fontFamily: FONT.sans, color: C.ink }}>
      <ToolConstellation shots={shotsOf("master")} still stillOpacity={0.55} stillScale={1.05} stillConverge={0.6} />
      <div style={{ position: "absolute", left: 96, top: 96, fontFamily: FONT.mono, fontSize: 22, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{entryTitle(latestMilestone.id)} · {toolsCaption}</div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 190, fontSize: 84, fontWeight: 500, lineHeight: 1.1, textShadow: "0 0 60px rgba(11,12,11,1)" }}>
        {phrase("T.hook.1").split("{N}")[0]}
        <span style={{ color: C.accent }}>{statedCount}</span>
        {phrase("T.hook.1").split("{N}")[1]}
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 120, fontSize: 40, color: C.muted }}>{phrase("T.hook.3")}</div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 60, fontFamily: FONT.mono, fontSize: 16, color: C.muted }}>{evidenceLine}</div>
      <div style={{ position: "absolute", width: W, height: H, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const CompoundContactSheet: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  const cols = 4;
  const rows = Math.ceil(milestones.length / cols);
  const gap = 24;
  const safe = 72;
  const tw = (W - 2 * safe - (cols - 1) * gap) / cols;
  const th = (H - safe - 110 - (rows - 1) * gap - safe) / rows;
  const imgH = th - 92;
  const device = "ENTRY:desktop/hero";
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, fontFamily: FONT.mono, color: C.ink }}>
      <div style={{ position: "absolute", left: safe, top: 40, fontSize: 20, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {entryTitle(latestMilestone.id)} · {milestones.length} milestones · {scoreLabel} · rubric {designScores.rubric_sha256.slice(0, 8)}
      </div>
      {milestones.map((m, i) => {
        const x = safe + (i % cols) * (tw + gap);
        const y = 110 + Math.floor(i / cols) * (th + gap);
        const s = scoreOf(m.id);
        return (
          <React.Fragment key={m.id}>
            <CameraShot box={{ x, y, w: tw, h: imgH }} target={{ milestone: m.id, sectionKey: device }} radius={6} />
            <div style={{ position: "absolute", left: x, top: y + imgH + 10, width: tw, fontSize: 15, lineHeight: 1.4 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.accent }}>{m.id}</span>
                <span style={{ color: C.muted }}>{m.date_range}</span>
              </div>
              <div style={{ color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
              <div style={{ color: C.muted }}>
                score <span style={{ color: C.ink }}>{s.score}</span> · coverage <span style={{ color: C.ink }}>{s.coverage}%</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: safe, right: safe, bottom: 28, fontSize: 14, color: C.muted }}>{designScores.meaning}</div>
    </AbsoluteFill>
  );
};

export const CompoundEvolutionMap: React.FC = () => {
  const { width: W } = useVideoConfig();
  const types = Array.from(new Set(verifiedEdges.map((e) => e.type)));
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, fontFamily: FONT.mono, color: C.ink }}>
      <ToolConstellation shots={shotsOf("master")} still showLabels stillScale={Math.min(W / 1450, 1.75)} stillConverge={0} stillCentroidLabel={false} />
      <div style={{ position: "absolute", left: 96, top: 72, fontSize: 24, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{entryTitle(latestMilestone.id)} · {toolsCaption}</div>
      <div style={{ position: "absolute", right: 96, top: 72, fontSize: 24, color: C.ink }}>{graphCountsLabel}</div>
      <div style={{ position: "absolute", left: 96, bottom: 72, display: "flex", gap: 28, fontSize: 18 }}>
        {types.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted }}>
            <div style={{ width: 36, height: 0, borderTop: `2px ${t === "informed" ? "dotted" : "solid"} ${t === "created" ? C.ink : edgeColor(t)}` }} />
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 72, fontSize: 16, color: C.muted }}>{transferGraph.generated_at}</div>
    </AbsoluteFill>
  );
};
