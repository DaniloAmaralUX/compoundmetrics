// Timeline, text registry (§26 phrases verbatim), rail words (PRD §29) and easing constants.
// This file holds no numeral that describes the data.
import { Easing } from "remotion";
import raw from "./json/storyboard.json";

export type Source = { milestone: string; src: string; section_key: string };
export type Constellation = {
  place: "hidden" | "field" | "parked" | "docked" | "grow" | "behind" | "dim" | "full" | "lower";
  edges: string[];
  ghost?: boolean;
  pulse?: string;
  converge?: boolean;
  centroidLabel?: boolean;
};
export type Shot = {
  id: string;
  composition: "master" | "vertical" | "teaser";
  scene: string;
  kind: string;
  start: number;
  end: number;
  sources: Source[];
  text_keys: string[];
  data_keys: string[];
  memory_rail: string[];
  constellation_edges: string[];
  constellation: Constellation;
};

export const storyboard = raw as unknown as {
  fps: number;
  compositions: Record<"master" | "vertical" | "teaser", { fps: number; durationInFrames: number }>;
  shots: Shot[];
};

export const FPS = storyboard.fps;
export type CompositionId = keyof typeof storyboard.compositions;
export const shotsOf = (composition: CompositionId): Shot[] =>
  storyboard.shots.filter((s) => s.composition === composition);
export const durationOf = (composition: CompositionId): number =>
  storyboard.compositions[composition].durationInFrames;

/** Scenes in order, with their frame span, for a composition. */
export const scenesOf = (composition: CompositionId): { scene: string; start: number; end: number; shots: Shot[] }[] => {
  const out: { scene: string; start: number; end: number; shots: Shot[] }[] = [];
  for (const s of shotsOf(composition)) {
    const last = out[out.length - 1];
    if (last && last.scene === s.scene) {
      last.end = s.end;
      last.shots.push(s);
    } else {
      out.push({ scene: s.scene, start: s.start, end: s.end, shots: [s] });
    }
  }
  return out;
};

/** §26 key phrases, verbatim. {N} is substituted at render from tools.stated_count_in_brief. */
export const T: Record<string, string> = {
  "T.hook.1": "I built {N} tools with AI this year.",
  "T.hook.2": "They did not become a portfolio.",
  "T.hook.3": "They became a system.",
  "T.problem.1": "The output was compounding.",
  "T.problem.2": "The knowledge wasn't.",
  "T.pattern.1": "Different products.",
  "T.pattern.2": "Same mistakes.",
  "T.pattern.3": "Different products.",
  "T.pattern.4": "Same decisions.",
  "T.pattern.5": "Different products.",
  "T.pattern.6": "Same knowledge.",
  "T.turn.1": "I stopped keeping good decisions in my head.",
  "T.turn.2": "I started encoding them.",
  "T.atomic.1": "What if the atomic unit was not only UI?",
  "T.atomic.2": "What if knowledge itself was composable?",
  "T.compound.1": "Products generate knowledge.",
  "T.compound.2": "Knowledge becomes capability.",
  "T.compound.3": "Capability improves the next product.",
  "T.audit.1": "The system does not only build interfaces.",
  "T.audit.2": "It inspects what it built.",
  "T.audit.3": "It does not only fix failures.",
  "T.audit.4": "It decides which failures deserve to become knowledge.",
  "T.finale.1": "I thought I was building products with AI.",
  "T.finale.2": "I was actually building a way to build.",
  "T.finale.3": "Build the application.",
  "T.finale.4": "Improve the system that builds the next one.",
};
export const phrase = (key: string, n?: number): string => {
  const p = T[key];
  if (!p) throw new Error(`unknown text key ${key}`);
  return n === undefined ? p : p.replace("{N}", String(n));
};
/** The T.* keys of a shot, in order (L.* labels have their own placement). */
export const textKeysOf = (shot: Shot): string[] => shot.text_keys.filter((k) => k.startsWith("T."));

/** PRD §29 verbatim. */
export const RAIL = ["Interface", "Pattern", "Component", "Audit", "Eval", "Skill", "Agent", "Work System"];
export const RAIL_FINAL = ["Frame", "Model", "Build", "Verify", "Polish", "Compound"];

/** Easing vocabulary (STORYBOARD §0). */
export const decel = Easing.bezier(0.2, 0, 0, 1);
export const accel = Easing.bezier(0.4, 0, 1, 1);
export const SPRING_FLAT = { damping: 200, stiffness: 120, mass: 1 };
export const SPRING_POP = { damping: 14, stiffness: 180 };

/** Visual identity. */
export const C = {
  ground: "#0b0c0b",
  ink: "#efeee9",
  muted: "#8f918b",
  accent: "#d7ff57",
  warm: "#e8a04a",
};
export const FONT = {
  sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace",
};
/** Edge colour by type (STORYBOARD §6). */
export const edgeColor = (type: string): string => {
  switch (type) {
    case "reused":
    case "migrated":
      return C.accent;
    case "failure":
      return C.warm;
    case "promoted":
    case "eval-created":
      return C.accent;
    case "informed":
      return C.muted;
    case "superseded":
      return C.muted;
    default:
      return C.ink;
  }
};
