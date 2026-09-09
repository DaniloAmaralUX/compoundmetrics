// Re-exports of src/data/json/design-scores.json (copy of case-study/design-benchmark/SUMMARY.json).
import raw from "./json/design-scores.json";

export type MilestoneScore = {
  milestone: string;
  name: string;
  tool_ids: string[];
  date_range: string;
  score: number;
  coverage: number;
  counts: { PASS: number; FAIL: number; "N/A": number; NOT_VERIFIED: number };
  categories: Record<string, { score: number; coverage: number }>;
};
export type Delta = {
  from: string;
  to: string;
  score_delta: number;
  coverage_delta: number;
  category_delta: Record<string, number | null>;
  same_tool: boolean;
};

export const designScores = raw as unknown as {
  generated_at: string;
  label: string;
  meaning: string;
  formula: { score: string; coverage: string; na: string };
  rubric_sha256: string;
  milestones: MilestoneScore[];
  average_score_all_milestones: number;
  average_score_independent_designs: number;
  average_note: string;
  delta: {
    biggest_improvement: Delta;
    biggest_regression: Delta;
    most_persistent_failures: { id: string; fails: number; of: number }[];
    first_vs_last: { from: string; to: string; score_delta: number };
  };
  chronological_trend: { milestone: string; score: number; coverage: number }[];
};

export const scoreLabel = designScores.label;
export const scoreMeaning = designScores.meaning;
export const rubricShaShort = designScores.rubric_sha256.slice(0, 8);
export const scoreOf = (id: string): MilestoneScore => {
  const m = designScores.milestones.find((x) => x.milestone === id);
  if (!m) throw new Error(`no score for ${id}`);
  return m;
};
export const persistentFailure = (i: number) => designScores.delta.most_persistent_failures[i];
/** L.persistent[i] */
export const persistentLabel = (i: number): string => {
  const p = persistentFailure(i);
  return `${p.id} · fails ${p.fails} of ${p.of}`;
};
export const maxFail = Math.max(...designScores.milestones.map((m) => m.counts.FAIL));
export const signed = (n: number): string => (n > 0 ? `+${n}` : `${n}`);
/** The three category deltas with the largest magnitude (nulls excluded). */
export const topCategoryDeltas = (d: Delta, n: number) =>
  Object.entries(d.category_delta)
    .filter((e): e is [string, number] => typeof e[1] === "number" && e[1] !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, n);
