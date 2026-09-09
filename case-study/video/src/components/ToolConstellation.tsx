// The tool constellation (PRD §28). Nodes = tools.tools[] (24: the ones verified by a readable
// repository render solid with a hero thumbnail, the rest as unlabeled hollow rings) plus the
// resource / eval / skill / agent / contract / registry / external nodes of the transfer graph.
// Edges appear over time from the storyboard's per-shot selectors; only verified edges exist.
// Layout is a seeded force layout (random(id) from remotion) frozen at module load and only
// interpolated afterwards. Every motion is a pure function of the absolute frame.
import React from "react";
import { Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { entryTitle, latestMilestone, milestoneById, milestones, surfaceSrc } from "../data/milestones";
import { C, FONT, RAIL_FINAL, SPRING_FLAT, SPRING_POP, accel, edgeColor, type Shot } from "../data/storyboard";
import { statedCount, toolList } from "../data/tools";
import { nodes as graphNodes, resolveEdgeSelector, verifiedEdges, type GraphEdge } from "../data/transfer-graph";
import { cutIndex } from "./layout";
import { finalWordPositions, railSchedule } from "./MemoryRail";

// ---------- layout (unit space 1200 × 700, centred at 0,0) ----------
type LNode = { id: string; kind: "tool" | "graph"; type: string; label: string; x: number; y: number; verified: boolean; milestone?: string };

const buildLayout = (): LNode[] => {
  const graphToolIds = new Set(graphNodes.filter((n) => n.type === "tool").map((n) => n.id));
  const list: LNode[] = [];
  // tools: verified (present in the graph) first, then the rest, each in id order
  const sortedTools = [...toolList].sort((a, b) => {
    const va = graphToolIds.has(a.id) ? 0 : 1;
    const vb = graphToolIds.has(b.id) ? 0 : 1;
    return va - vb || a.id.localeCompare(b.id);
  });
  for (const t of sortedTools) {
    const m = milestones.find((mm) => mm.tool_ids[0] === t.id && mm.surfaces.ENTRY);
    list.push({ id: t.id, kind: "tool", type: "tool", label: t.name, x: 0, y: 0, verified: graphToolIds.has(t.id), milestone: m?.id });
  }
  for (const n of graphNodes) {
    if (n.type === "tool") continue;
    list.push({ id: n.id, kind: "graph", type: n.type, label: n.label, x: 0, y: 0, verified: true });
  }
  // seeded initial positions
  for (const n of list) {
    n.x = (random(n.id + ":x") - 0.5) * 800;
    n.y = (random(n.id + ":y") - 0.5) * 450;
    if (n.type === "external") n.y = -300;
  }
  const idx = new Map(list.map((n, i) => [n.id, i]));
  const springs = verifiedEdges
    .map((e) => [idx.get(e.from), idx.get(e.to)] as const)
    .filter((p): p is readonly [number, number] => p[0] !== undefined && p[1] !== undefined);
  const ITER = 300;
  for (let it = 0; it < ITER; it++) {
    const temp = 1 - it / ITER;
    const fx = new Array(list.length).fill(0);
    const fy = new Array(list.length).fill(0);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        let dx = list[i].x - list[j].x;
        let dy = list[i].y - list[j].y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = random(`${i}-${j}`) - 0.5;
          dy = random(`${j}-${i}`) - 0.5;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        const f = 7000 / Math.max(d2, 400);
        fx[i] += (dx / d) * f;
        fy[i] += (dy / d) * f;
        fx[j] -= (dx / d) * f;
        fy[j] -= (dy / d) * f;
      }
    }
    for (const [a, b] of springs) {
      const dx = list[b].x - list[a].x;
      const dy = list[b].y - list[a].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 130) * 0.03;
      fx[a] += (dx / d) * f;
      fy[a] += (dy / d) * f;
      fx[b] -= (dx / d) * f;
      fy[b] -= (dy / d) * f;
    }
    for (let i = 0; i < list.length; i++) {
      const n = list[i];
      // gravity to the centre; external nodes to the top; unverified tools to the outer rim
      fx[i] -= n.x * 0.01;
      fy[i] -= n.y * 0.018;
      if (n.type === "external") fy[i] += (-300 - n.y) * 0.1;
      if (n.kind === "tool" && !n.verified) {
        const r = Math.sqrt(n.x * n.x + n.y * n.y) || 1;
        fx[i] += (n.x / r) * 2.5;
        fy[i] += (n.y / r) * 1.5;
      }
      const step = 6 * temp + 0.3;
      const len = Math.sqrt(fx[i] * fx[i] + fy[i] * fy[i]) || 1;
      const k = Math.min(len, step) / len;
      n.x += fx[i] * k;
      n.y += fy[i] * k;
    }
  }
  return list;
};

export const LAYOUT: LNode[] = buildLayout();
const NODE_INDEX = new Map(LAYOUT.map((n, i) => [n.id, i]));
export const centroid = (() => {
  const vis = LAYOUT.filter((n) => n.kind === "graph" || n.verified);
  return { x: vis.reduce((s, n) => s + n.x, 0) / vis.length, y: vis.reduce((s, n) => s + n.y, 0) / vis.length };
})();

// ---------- schedule derived from the shots ----------
type EdgeAppearance = { edge: GraphEdge; frame: number };
export const edgeSchedule = (shots: Shot[]): EdgeAppearance[] => {
  const seen = new Set<string>();
  const out: EdgeAppearance[] = [];
  for (const s of shots) {
    const fresh: GraphEdge[] = [];
    for (const sel of s.constellation.edges) {
      for (const e of resolveEdgeSelector(sel)) {
        if (seen.has(e.id)) continue;
        seen.add(e.id);
        fresh.push(e);
      }
    }
    const dur = s.end - s.start;
    const spacing = fresh.length === 0 ? 0 : Math.max(1, Math.min(3, Math.floor((dur * 0.6) / fresh.length)));
    fresh.forEach((e, k) => out.push({ edge: e, frame: s.start + k * spacing }));
  }
  return out;
};

type Placement = { cx: number; cy: number; scale: number; opacity: number };
const placementFor = (place: Shot["constellation"]["place"], W: number, H: number, vertical: boolean): Placement => {
  if (vertical) {
    switch (place) {
      case "hidden":
        return { cx: W / 2, cy: H * 0.8, scale: 0.6, opacity: 0 };
      case "lower":
        return { cx: W / 2, cy: H * 0.83, scale: 0.5, opacity: 1 };
      case "behind":
        return { cx: W / 2, cy: H * 0.8, scale: 0.5, opacity: 0.6 };
      case "dim":
        return { cx: W / 2, cy: H * 0.42, scale: 0.85, opacity: 0.15 };
      default:
        return { cx: W / 2, cy: H * 0.42, scale: 0.85, opacity: 1 };
    }
  }
  switch (place) {
    case "hidden":
      return { cx: W / 2, cy: H * 0.44, scale: 0.8, opacity: 0 };
    case "field":
      return { cx: W / 2, cy: H * 0.44, scale: 0.8, opacity: 1 };
    case "parked":
      return { cx: W - 96 - 132, cy: 96 + 80, scale: 0.22, opacity: 1 };
    case "docked":
      return { cx: W - 96 - 180, cy: H * 0.4, scale: 0.3, opacity: 1 };
    case "grow":
      return { cx: W * 0.64, cy: H * 0.48, scale: 0.6, opacity: 1 };
    case "lower":
      return { cx: W / 2, cy: H * 0.5, scale: 0.85, opacity: 1 };
    case "behind":
      return { cx: W / 2, cy: H / 2 - 40, scale: 1.3, opacity: 0.3 };
    case "dim":
      return { cx: W / 2, cy: H / 2 - 40, scale: 1.3, opacity: 0.15 };
    case "full":
      return { cx: W / 2, cy: H / 2 - 40, scale: 1.3, opacity: 1 };
  }
};

const shotAt = (shots: Shot[], frame: number): number => {
  let i = 0;
  for (let k = 0; k < shots.length; k++) if (frame >= shots[k].start) i = k;
  return i;
};

type Props = {
  shots: Shot[];
  /** Still mode: final state (all verified edges, converged), no timeline. */
  still?: boolean;
  stillOpacity?: number;
  stillScale?: number;
  showLabels?: boolean;
  /** Still mode: how far nodes converge toward the centroid (0..1 of the 40 % film convergence). */
  stillConverge?: number;
  stillCentroidLabel?: boolean;
};

export const ToolConstellation: React.FC<Props> = ({ shots, still = false, stillOpacity = 1, stillScale, showLabels = false, stillConverge = 1, stillCentroidLabel = true }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const vertical = H > W;

  const sched = React.useMemo(() => edgeSchedule(shots), [shots]);
  const i = shotAt(shots, frame);
  const cur = shots[i];
  const prev = i > 0 ? shots[i - 1] : cur;

  // placement, interpolated spring-flat over ~24 f at each shot start
  let placement: Placement;
  if (still) {
    placement = { cx: W / 2, cy: H / 2, scale: stillScale ?? Math.min(W / 1400, H / 820), opacity: stillOpacity };
  } else {
    const pa = placementFor(prev.constellation.place, W, H, vertical);
    const pb = placementFor(cur.constellation.place, W, H, vertical);
    const t = spring({ frame: frame - cur.start, fps, config: SPRING_FLAT, durationInFrames: 24 });
    placement = {
      cx: pa.cx + (pb.cx - pa.cx) * t,
      cy: pa.cy + (pb.cy - pa.cy) * t,
      scale: pa.scale + (pb.scale - pa.scale) * t,
      opacity: pa.opacity + (pb.opacity - pa.opacity) * t,
    };
  }
  if (placement.opacity <= 0.001) return null;

  // node entrance schedule
  const firstVisible = shots.find((s) => s.constellation.place !== "hidden");
  const hookStart = still ? -1000 : (firstVisible?.start ?? 0);
  const growShot = shots.find((s) => s.constellation.place === "grow") ?? shots.find((s) => s.constellation.converge);
  const growStart = still ? -1000 : (growShot?.start ?? Number.POSITIVE_INFINITY);
  const convergeShot = shots.find((s) => s.constellation.converge);
  const convergeStart = still ? -1000 : (convergeShot?.start ?? Number.POSITIVE_INFINITY);
  const conv = still ? stillConverge : spring({ frame: frame - convergeStart, fps, config: SPRING_FLAT, durationInFrames: 90 });
  const converge = frame >= convergeStart || still ? conv * 0.4 : 0;

  const edgeAppear = new Map<string, number>();
  if (still) for (const e of verifiedEdges) edgeAppear.set(e.id, -1000);
  else for (const a of sched) edgeAppear.set(a.edge.id, a.frame);

  const nodeAppear = (n: LNode): number => {
    if (n.kind === "tool") {
      const k = LAYOUT.indexOf(n);
      if (k < statedCount) return hookStart + 12 + k * 3;
      return growStart;
    }
    let first = Number.POSITIVE_INFINITY;
    for (const e of verifiedEdges) {
      if (e.from === n.id || e.to === n.id) {
        const f = edgeAppear.get(e.id);
        if (f !== undefined && f < first) first = f;
      }
    }
    return first - 6;
  };

  // superseded sources fade once their superseded edge is visible
  const supersededDim = new Set<string>();
  for (const e of verifiedEdges) {
    if (e.type === "superseded") {
      const f = edgeAppear.get(e.id);
      if (f !== undefined && frame >= f + 20) supersededDim.add(e.from);
    }
  }

  // lit node: the milestone on screen during cut shots (1-frame lag)
  let litTool: string | null = null;
  if (!still && cur.kind === "cuts" && cur.sources.length > 0) {
    const ci = cutIndex(cur, frame - 1);
    litTool = milestoneById(cur.sources[ci].milestone).tool_ids[0];
  }

  const pos = (n: LNode) => ({
    x: n.x + (centroid.x - n.x) * converge,
    y: n.y + (centroid.y - n.y) * converge,
  });
  const toScreen = (p: { x: number; y: number }) => ({
    x: placement.cx + p.x * placement.scale,
    y: placement.cy + p.y * placement.scale,
  });

  const ghostO = !still && cur.constellation.ghost
    ? interpolate(frame - cur.start, [18, 21, 24], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: accel })
    : 0;
  const pulseSel = !still ? cur.constellation.pulse : undefined;
  const pulseEdges = pulseSel ? new Set(resolveEdgeSelector(pulseSel).map((e) => e.id)) : new Set<string>();
  const pulse = pulseSel ? Math.max(0, Math.sin(((frame - cur.start) / 12) * Math.PI)) * (frame - cur.start < 24 ? 1 : 0) : 0;

  const rail = railSchedule(shots);
  const finalWords = rail.final !== null && frame >= rail.final + 30 && !vertical ? finalWordPositions(W, H, false) : [];

  const nodeR = (n: LNode) => (n.kind === "tool" ? (n.verified ? 30 : 16) : n.type === "external" ? 10 : 6) * placement.scale;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: placement.opacity, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {verifiedEdges.map((e) => {
          const a = NODE_INDEX.get(e.from);
          const b = NODE_INDEX.get(e.to);
          if (a === undefined || b === undefined) return null;
          const A = toScreen(pos(LAYOUT[a]));
          const B = toScreen(pos(LAYOUT[b]));
          const at = edgeAppear.get(e.id);
          const drawn = at === undefined ? 0 : interpolate(frame - at, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const o = Math.max(drawn > 0 ? (e.type === "informed" ? 0.35 : 0.7) * drawn : 0, ghostO);
          if (o <= 0) return null;
          const isPulse = pulseEdges.has(e.id);
          const color = e.type === "created" ? C.ink : edgeColor(e.type);
          return (
            <line
              key={e.id}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={color}
              strokeWidth={(isPulse ? 1.2 + pulse * 2 : e.type === "informed" ? 0.8 : 1.2) * Math.max(0.6, placement.scale)}
              strokeDasharray={e.type === "informed" ? "3 5" : undefined}
              pathLength={1}
              style={drawn > 0 && drawn < 1 && ghostO <= 0 ? { strokeDasharray: 1, strokeDashoffset: 1 - drawn } : undefined}
              opacity={Math.min(1, o + (isPulse ? pulse * 0.3 : 0))}
            />
          );
        })}
        {finalWords.map((w) => {
          const id = `res-cd-${w.word.toLowerCase()}`;
          const k = NODE_INDEX.get(id);
          if (k === undefined) return null; // Polish has no node in the graph — no hairline
          const P = toScreen(pos(LAYOUT[k]));
          const o = interpolate(frame - (rail.final as number) - 30 - RAIL_FINAL.indexOf(w.word) * 5, [0, 10], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <line key={w.word} x1={P.x} y1={P.y} x2={w.x} y2={w.y} stroke={C.accent} strokeWidth={0.8} opacity={o} />;
        })}
      </svg>
      {LAYOUT.map((n) => {
        const at = nodeAppear(n);
        if (!Number.isFinite(at) || frame < at) return null;
        const pop = still ? 1 : spring({ frame: frame - at, fps, config: n.kind === "tool" ? SPRING_POP : SPRING_FLAT, durationInFrames: 24, from: 0.4, to: 1 });
        const P = toScreen(pos(n));
        const r = nodeR(n);
        const lit = litTool === n.id;
        const dim = supersededDim.has(n.id) ? 0.3 : n.kind === "tool" && !n.verified ? (LAYOUT.indexOf(n) < statedCount ? 0.8 : 0.4) : 1;
        const color = n.type === "external" ? C.warm : n.type === "skill" || n.type === "agent" || n.type === "eval" ? C.accent : C.ink;
        return (
          <div key={n.id} style={{ position: "absolute", left: P.x - r, top: P.y - r, width: 2 * r, height: 2 * r, scale: `${pop}`, opacity: dim }}>
            {n.kind === "tool" && n.verified && n.milestone ? (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: `${Math.max(1, 2 * placement.scale)}px solid ${lit ? C.accent : "rgba(239,238,233,0.55)"}`, boxShadow: lit ? `0 0 ${24 * placement.scale}px ${C.accent}` : undefined, backgroundColor: "#1a1b1a" }}>
                <Img src={staticFile(surfaceSrc(n.milestone, "ENTRY:desktop/hero"))} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "auto" }} />
              </div>
            ) : n.kind === "tool" ? (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `${Math.max(1, 1.5 * placement.scale)}px solid ${lit ? C.accent : "rgba(239,238,233,0.45)"}` }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: color, opacity: n.type === "resource" ? 0.75 : 1 }} />
            )}
            {showLabels && (n.kind === "graph" || n.verified) ? (
              <div style={{ position: "absolute", left: 2 * r + 6, top: r - 9, fontFamily: FONT.mono, fontSize: 13, color: n.kind === "tool" ? C.ink : C.muted, whiteSpace: "nowrap", backgroundColor: "rgba(11,12,11,0.75)", padding: "1px 4px", borderRadius: 3 }}>{n.label}</div>
            ) : null}
          </div>
        );
      })}
      {((still && stillCentroidLabel) || (!still && cur.constellation.centroidLabel && frame >= convergeStart + 72)) ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: W,
            top: toScreen(centroid).y - 30,
            textAlign: "center",
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: vertical ? 56 : 72,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: C.accent,
            opacity: still ? 1 : interpolate(frame - convergeStart - 72, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            textShadow: "0 0 40px rgba(11,12,11,0.9)",
          }}
        >
          {entryTitle(latestMilestone.id)}
        </div>
      ) : null}
    </div>
  );
};
