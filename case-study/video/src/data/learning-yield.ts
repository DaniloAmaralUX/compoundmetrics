// Re-exports of src/data/json/learning-yield.json
// (copy of case-study/design-benchmark/reports/learning-yield.json). No defaults: if a field is
// missing the composition throws at render rather than showing the PRD §31 example numbers.
import raw from "./json/learning-yield.json";

type Yield = {
  generated_at: string;
  label: string;
  meaning: string;
  evidence_boundary: { candidate: string; stable_evidence_baseline: string; cel_max: string; e2: string; runtime_uplift: string };
  states: Record<string, number>;
  per_tool: { tool_id: string; tool_name: string; findings_total: number }[];
  totals: {
    findings_total: number;
    meaningful_findings: number;
    durable_learnings: number;
    distinct_durable_learnings: number;
    resource_candidates: number;
    resources_promoted: number;
    resources_later_reused: number;
  };
  transfer_graph_check: { verified_edges: number; edges_originating_from_rubric_findings: number; note: string };
  claim_discipline: string;
};

export const learningYield = raw as unknown as Yield;

const need = (v: unknown, name: string): number => {
  if (typeof v !== "number") throw new Error(`learning-yield.json: missing ${name}`);
  return v;
};

/** The yield ladder (STORYBOARD MS-22), every numeral read from the report. */
export const yieldLadder: { key: string; label: string; value: number }[] = [
  { key: "products", label: "products", value: need(learningYield.per_tool?.length, "per_tool") },
  { key: "findings", label: "findings", value: need(learningYield.totals?.findings_total, "totals.findings_total") },
  { key: "meaningful_failures", label: "meaningful failures", value: need(learningYield.totals?.meaningful_findings, "totals.meaningful_findings") },
  { key: "durable_learnings", label: "durable learnings", value: need(learningYield.totals?.distinct_durable_learnings, "totals.distinct_durable_learnings") },
  { key: "resource_candidates", label: "resource candidates", value: need(learningYield.totals?.resource_candidates, "totals.resource_candidates") },
  { key: "evals", label: "eval candidates", value: need(learningYield.states?.["eval-candidate"], "states.eval-candidate") },
  { key: "skills_improved", label: "resources promoted", value: need(learningYield.totals?.resources_promoted, "totals.resources_promoted") },
];
export const yieldValue = (key: string): number => {
  const row = yieldLadder.find((r) => r.key === key);
  if (!row) throw new Error(`no yield row ${key}`);
  return row.value;
};
export const findings = yieldValue("findings");
export const meaningfulFailures = yieldValue("meaningful_failures");
export const evidenceBoundaryLine = (() => {
  const b = learningYield.evidence_boundary;
  return `${b.candidate} · baseline ${b.stable_evidence_baseline} · CEL ${b.cel_max} · E2 ${b.e2} · runtime uplift ${b.runtime_uplift}`;
})();
export const provenanceLine = `${learningYield.label} · ${learningYield.generated_at}`;
