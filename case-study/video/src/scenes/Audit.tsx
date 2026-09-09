// Beat 6 · Audit — the instrument itself (V01 /audit page), three ScoreReveal cards over the design
// they score, the biggest improvement and the biggest regression at equal size (pairs read from
// design-scores.delta), and the trend strip. Every score is shown next to the screenshot it was
// measured on. The label reads design-scores.label; the footnote keeps "score" honest.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { designScores, persistentFailure, rubricShaShort, scoreLabel, scoreMeaning, signed } from "../data/design-scores";
import { milestoneById, resolveTarget } from "../data/milestones";
import { C, FONT, SPRING_FLAT, decel, type Shot, type Source } from "../data/storyboard";
import { graphCountsLabel } from "../data/transfer-graph";
import { BrowserFrame } from "../components/BrowserFrame";
import { CameraShot } from "../components/CameraShot";
import { useLayout } from "../components/layout";
import { DeltaCard, ScoreReveal } from "../components/ScoreReveal";
import { Label } from "../components/Statement";
import { CornerLabel, Scrim, ShotStatements, labelIds, useCutOpacity, type ShotProps } from "./common";

export const Instrument: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const a = shot.sources[0];
  const b = shot.sources[1] ?? a;
  const box = L.fullBox();
  const pan = spring({ frame: frame - 36, fps, config: SPRING_FLAT, durationInFrames: 36 });
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot box={box} target={{ milestone: a.milestone, sectionKey: a.section_key }} to={{ milestone: b.milestone, sectionKey: b.section_key }} progress={pan} opacity={0.85} />
      <Scrim opacity={0.35} />
      <div style={{ position: "absolute", left: L.safe.x, top: L.vertical ? L.H * 0.585 + 140 : L.safe.y, maxWidth: L.vertical ? L.W - 2 * L.safe.x : 760, padding: "16px 20px", borderRadius: 6, backgroundColor: "rgba(11,12,11,0.85)", border: "1px solid rgba(239,238,233,0.14)", opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel }) }}>
        <div style={{ fontFamily: FONT.mono, fontSize: L.mono, color: C.ink, letterSpacing: "0.1em", textTransform: "uppercase" }}>{scoreLabel}</div>
        {shot.text_keys.includes("L.rubric.sha") ? (
          <div style={{ fontFamily: FONT.mono, fontSize: L.small, color: C.muted, marginTop: 8, lineHeight: 1.4 }}>rubric {rubricShaShort} · {scoreMeaning}</div>
        ) : null}
      </div>
      <ShotStatements shot={shot} offsets={[9]} />
    </>
  );
};

const HeroCut: React.FC<{ shot: Shot; k: number; n: number; src: Source }> = ({ shot, k, n, src }) => {
  const L = useLayout();
  const o = useCutOpacity(shot, k, n, 6);
  const box = L.fullBox();
  if (o <= 0) return null;
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone opacity={o} /> : null}
      <CameraShot box={box} target={{ milestone: src.milestone, sectionKey: src.section_key }} opacity={o} />
    </>
  );
};

export const Scores: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const ids = labelIds(shot, "L.score");
  const n = ids.length;
  const per = (shot.end - shot.start) / n;
  const k = Math.max(0, Math.min(n - 1, Math.floor(frame / per)));
  const src = shot.sources.find((s) => s.milestone === ids[k]) ?? shot.sources[k];
  return (
    <>
      {shot.sources.map((s, i) => (
        <HeroCut key={s.milestone} shot={shot} k={i} n={n} src={s} />
      ))}
      <ScoreReveal key={ids[k]} milestone={src.milestone} from={Math.round(k * per)} x={L.safe.x} y={L.vertical ? L.H * 0.585 + 60 : 150} compact={L.vertical} />
      <ShotStatements shot={shot} offsets={[6]} />
    </>
  );
};

export const Deltas: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const dur = shot.end - shot.start;
  const imp = designScores.delta.biggest_improvement;
  const reg = designScores.delta.biggest_regression;
  const showReg = shot.text_keys.includes("L.delta.regression");
  const impDur = showReg ? Math.round(dur * 0.625) : dur;
  const phase = frame < impDur ? "imp" : "reg";
  const d = phase === "imp" ? imp : reg;
  const local = phase === "imp" ? frame : frame - impDur;
  const phaseDur = phase === "imp" ? impDur : dur - impDur;
  const half = Math.round(phaseDur * 0.5);
  // sources: the manifest's section for that milestone if listed, else its ENTRY hero
  const srcFor = (m: string, preferLast: boolean): Source => {
    const list = shot.sources.filter((s) => s.milestone === m);
    const s = preferLast ? list[list.length - 1] : list[0];
    return s ?? { milestone: m, src: "", section_key: L.vertical ? "ENTRY:mobile/hero" : "ENTRY:desktop/hero" };
  };
  const from = srcFor(d.from, false);
  const to = srcFor(d.to, phase === "reg");
  const cur = local < half ? from : to;
  const box = L.fullBox();
  const cardX = L.vertical ? L.safe.x : L.W - L.safe.x - 520;
  const cardY = L.vertical ? L.H * 0.585 + 40 : 140;
  return (
    <>
      {L.vertical ? <BrowserFrame box={box} phone /> : null}
      <CameraShot key={cur.milestone + cur.section_key} box={box} target={{ milestone: cur.milestone, sectionKey: cur.section_key }} opacity={0.85} />
      <Label text={`${milestoneById(cur.milestone).name}`} size={L.small} style={{ left: L.safe.x, top: L.vertical ? L.H - L.safe.y - 30 : box.h - 30 }} />
      <DeltaCard key={phase} delta={d} from={phase === "imp" ? 6 : 0} x={cardX} y={cardY} width={L.vertical ? L.W - 2 * L.safe.x : 520} regression={phase === "reg"} />
      {shot.text_keys.includes("L.first_vs_last") ? (
        <CornerLabel text={`${designScores.delta.first_vs_last.from} → ${designScores.delta.first_vs_last.to} ${signed(designScores.delta.first_vs_last.score_delta)}`} from={20} />
      ) : null}
      {!showReg ? (
        <Label text={`regression ${reg.from} → ${reg.to} ${signed(reg.score_delta)}`} size={14} color={C.warm} style={{ left: L.safe.x, right: L.safe.x, top: L.H - L.safe.y - 60, textAlign: "center" }} from={30} />
      ) : null}
    </>
  );
};

export const Trend: React.FC<ShotProps> = ({ shot }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const trend = designScores.chronological_trend;
  const n = trend.length;
  const tw = 150;
  const th = 84;
  const gap = (L.W - 2 * L.safe.x - n * tw) / (n - 1);
  const stripY = L.H - L.textBottom - th - 80;
  const chartTop = 200;
  const chartH = stripY - chartTop - 60;
  const x = (i: number) => L.safe.x + i * (tw + gap) + tw / 2;
  const y = (v: number) => chartTop + chartH * (1 - v / 100);
  const draw = interpolate(frame, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: decel });
  const path = (key: "score" | "coverage") => trend.map((t, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(t[key])}`).join(" ");
  const fvl = designScores.delta.first_vs_last;
  return (
    <>
      {trend.map((t, i) => {
        const src = shot.sources.find((s) => s.milestone === t.milestone) ?? shot.sources[i];
        return (
          <React.Fragment key={t.milestone}>
            <CameraShot box={{ x: x(i) - tw / 2, y: stripY, w: tw, h: th }} target={{ milestone: src.milestone, sectionKey: src.section_key }} radius={4} />
            <div style={{ position: "absolute", left: x(i) - tw / 2, top: stripY + th + 6, width: tw, textAlign: "center", fontFamily: FONT.mono, fontSize: 14, color: C.muted }}>{t.milestone}</div>
          </React.Fragment>
        );
      })}
      <svg width={L.W} height={L.H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={path("coverage")} fill="none" stroke={C.muted} strokeWidth={1.2} strokeDasharray="4 5" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} />
        <path d={path("score")} fill="none" stroke={C.accent} strokeWidth={2} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} />
        {trend.map((t, i) => (
          <circle key={t.milestone} cx={x(i)} cy={y(t.score)} r={4} fill={C.accent} opacity={draw * n > i + 1 ? 1 : 0} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: L.safe.x, top: L.safe.y, fontFamily: FONT.mono, fontSize: L.mono, color: C.ink }}>
        <span style={{ color: C.accent }}>{scoreLabel}</span> <span style={{ color: C.muted }}>· coverage</span>
      </div>
      <Label text={`${fvl.from} → ${fvl.to}  ${signed(fvl.score_delta)}`} from={60} size={40} color={C.ink} align="right" style={{ right: L.safe.x, top: L.safe.y - 8, fontWeight: 600 }} />
      <div style={{ position: "absolute", left: L.safe.x, top: L.safe.y + 44, display: "flex", gap: 10 }}>
        {labelIds(shot, "L.persistent").length > 0
          ? [0, 1, 2].map((i) => (
              <div key={i} style={{ fontFamily: FONT.mono, fontSize: 15, color: C.warm, border: `1px solid rgba(232,160,74,0.5)`, borderRadius: 4, padding: "3px 8px", opacity: interpolate(frame - 20 - i * 6, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                {persistentFailure(i).id}
              </div>
            ))
          : null}
      </div>
      <Label text={designScores.average_note} from={30} size={16} style={{ left: L.safe.x, right: L.safe.x + 360, bottom: L.railInset + L.railH + 16 }} />
      <Label text={graphCountsLabel} size={L.mono} align="right" style={{ right: L.safe.x, bottom: L.railInset + L.railH + 16 }} />
    </>
  );
};

export const AuditRoute = (src: Source) => resolveTarget(src.milestone, src.section_key).route;
