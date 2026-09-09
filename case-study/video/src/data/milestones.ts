// Re-exports of src/data/json/milestones.json (copy of case-study/history/DESIGN-MILESTONES.json).
import raw from "./json/milestones.json";
import sectionsRaw from "./json/sections.json";

export type Milestone = {
  id: string;
  build: string;
  tool_ids: string[];
  name: string;
  date_range: string;
  entry_title?: string;
  surfaces: Record<string, string | null>;
};

export type Rect = { x: number; y: number; width: number; height: number };
export type SurfaceSections = Record<string, Rect & { route?: string }> & {
  route?: string;
  _page?: { width: number; height: number };
};

type MergePair = { a: string; b: string; ahash_hamming: number; dom_identical: boolean; merged: boolean };

export const milestonesData = raw as unknown as {
  generated_at: string;
  milestone_count: number;
  milestones: Milestone[];
  merge_evaluation: { rule: string; pairs: MergePair[] };
};

export const milestones: Milestone[] = milestonesData.milestones;
export const milestoneCount = milestonesData.milestone_count;
/** The latest milestone (chronological order of the archive) — its entry_title is the system's name as recorded. */
export const latestMilestone: Milestone = milestones[milestones.length - 1];
export const milestoneById = (id: string): Milestone => {
  const m = milestones.find((x) => x.id === id);
  if (!m) throw new Error(`unknown milestone ${id}`);
  return m;
};
export const entryTitle = (id: string): string => {
  const m = milestoneById(id);
  return m.entry_title ?? m.name;
};
export const mergePair = (a: string, b: string): MergePair | undefined =>
  milestonesData.merge_evaluation.pairs.find(
    (p) => (p.a === a && p.b === b) || (p.a === b && p.b === a),
  );

/** Camera targets: sections.json of every archived milestone, keyed by id. */
export const sections = sectionsRaw as unknown as Record<string, Record<string, SurfaceSections>>;

/** Resolve "ENTRY:desktop/hero" for a milestone into a page-space rect plus page size. */
export const resolveTarget = (milestone: string, sectionKey: string) => {
  const slash = sectionKey.indexOf("/");
  const surface = sectionKey.slice(0, slash);
  const key = sectionKey.slice(slash + 1);
  const s = sections[milestone]?.[surface];
  if (!s) throw new Error(`no surface ${surface} for ${milestone}`);
  const rect = (s as Record<string, unknown>)[key] as Rect | undefined;
  if (!rect || typeof rect.width !== "number") throw new Error(`no target ${sectionKey} for ${milestone}`);
  const page = s._page as { width: number; height: number };
  return { rect, page, route: (s as { route?: string }).route ?? "" };
};
/** Screenshot path inside public/ for a surface, e.g. archive/V01/surfaces/ENTRY-desktop.png */
export const surfaceSrc = (milestone: string, sectionKey: string): string => {
  const [surface, device] = sectionKey.slice(0, sectionKey.indexOf("/")).split(":");
  return `archive/${milestone}/surfaces/${surface}-${device}.png`;
};
