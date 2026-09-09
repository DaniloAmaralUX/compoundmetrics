// The film assembler shared by the three timed compositions. Scenes (beats) are arranged with
// TransitionSeries; the cut from Repetition into Extraction is a 12 f fade (STORYBOARD MS-08),
// every other beat boundary is a hard cut. The memory rail and the tool constellation are
// persistent layers over the whole timeline, driven by the absolute frame.
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MemoryRail } from "../components/MemoryRail";
import { ToolConstellation } from "../components/ToolConstellation";
import { C, FONT, accel, durationOf, scenesOf, shotsOf, type CompositionId, type Shot } from "../data/storyboard";
import { AtomicLayerShot, ComponentPushes, Created } from "../scenes/AtomicAI";
import { Deltas, Instrument, Scores, Trend } from "../scenes/Audit";
import { EvidenceShot } from "../scenes/Evidence";
import { Loop, Finding, Resource } from "../scenes/Extraction";
import { FinalStatement, Mosaic } from "../scenes/Finale";
import { HookStatement } from "../scenes/Hook";
import { ChainShot, YieldCounters, YieldLadder } from "../scenes/LearningYield";
import { Fan, Identical, Transfer } from "../scenes/Network";
import { Cuts, Grid } from "../scenes/Repetition";
import { HookNodes, HookSystem } from "../scenes/Tools";
import { Converge, RailMorph, Skills } from "../scenes/WorkSystem";

const BY_KIND: Record<string, React.FC<{ shot: Shot }>> = {
  "hook-statement": HookStatement,
  "hook-nodes": HookNodes,
  "hook-system": HookSystem,
  cuts: Cuts,
  grid: Grid,
  finding: Finding,
  resource: Resource,
  loop: Loop,
  "component-pushes": ComponentPushes,
  "atomic-layer": AtomicLayerShot,
  created: Created,
  transfer: Transfer,
  identical: Identical,
  fan: Fan,
  instrument: Instrument,
  scores: Scores,
  deltas: Deltas,
  trend: Trend,
  "yield-counters": YieldCounters,
  "yield-ladder": YieldLadder,
  chain: ChainShot,
  converge: Converge,
  skills: Skills,
  "rail-morph": RailMorph,
  mosaic: Mosaic,
  statement: FinalStatement,
  evidence: EvidenceShot,
};

/** Beats whose cut into the next beat is a cross-fade. */
const XFADE_AFTER: Record<string, number> = { Repetition: 12 };

const SceneShots: React.FC<{ shots: Shot[]; sceneStart: number; extra: number }> = ({ shots, sceneStart, extra }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {shots.map((shot, i) => {
        const Comp = BY_KIND[shot.kind];
        if (!Comp) throw new Error(`no renderer for shot kind ${shot.kind}`);
        const isLast = i === shots.length - 1;
        return (
          <Sequence key={shot.id} name={shot.id} from={shot.start - sceneStart} durationInFrames={shot.end - shot.start + (isLast ? extra : 0)} premountFor={fps}>
            <Comp shot={shot} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const FadeToBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 24, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: accel });
  return <div style={{ position: "absolute", inset: 0, backgroundColor: C.ground, opacity: o }} />;
};

/** Total frames of the TransitionSeries = sum(sequence durations) − sum(transition durations). */
export const filmDuration = (id: CompositionId, fps: number): number => {
  const scenes = scenesOf(id);
  let total = 0;
  scenes.forEach((s, i) => {
    const xf = i < scenes.length - 1 ? (XFADE_AFTER[s.scene] ?? 0) : 0;
    // the beat is extended by xf so that the fade overlaps it and the next beat keeps its frame
    total += s.end - s.start + xf;
    if (xf > 0) total -= linearTiming({ durationInFrames: xf }).getDurationInFrames({ fps });
  });
  if (total !== durationOf(id)) throw new Error(`${id}: assembled ${total} frames, storyboard says ${durationOf(id)}`);
  return total;
};

export const Film: React.FC<{ id: CompositionId }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const scenes = scenesOf(id);
  const shots = shotsOf(id);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, color: C.ink, fontFamily: FONT.sans }}>
      <ToolConstellation shots={shots} />
      <TransitionSeries>
        {scenes.flatMap((s, i) => {
          const xf = i < scenes.length - 1 ? (XFADE_AFTER[s.scene] ?? 0) : 0;
          const items: React.ReactNode[] = [
            <TransitionSeries.Sequence key={s.scene + s.start} name={s.scene} durationInFrames={s.end - s.start + xf} premountFor={fps}>
              <SceneShots shots={s.shots} sceneStart={s.start} extra={xf} />
            </TransitionSeries.Sequence>,
          ];
          if (xf > 0) {
            items.push(<TransitionSeries.Transition key={`xf-${s.scene}`} presentation={fade()} timing={linearTiming({ durationInFrames: xf })} />);
          }
          return items;
        })}
      </TransitionSeries>
      <MemoryRail shots={shots} />
      <FadeToBlack />
    </AbsoluteFill>
  );
};
