// The single source of truth for the project's factual state.
//
// Nothing here is typed by hand when the framework already records it: release, stage, baseline,
// evidence level and uplift come from the registry; the latest evidence artifact from the contract
// suite result; the runtime status from the frozen E2 environment. Home, Project, Evidence and
// Resources all import `currentState` — a route cannot say E2 while the registry says E1.
import registryJson from "../../compound-design/registry/resource-registry.json";
import contractEval from "../../compound-design/quality/releases/v0.3-contract-eval.json";
import environment from "../../compound-design/quality/e2/environment.json";
import type { Cel, CurrentState, RegistryResource } from "./types";

interface RegistryFile {
  release: string;
  releaseTheme: string;
  releaseStage: "candidate" | "stable";
  pluginVersion: string;
  updatedAt: string;
  evidencePolicy: {
    currentLevel: Cel;
    runtimeUplift: string;
    rule: string;
    stableEvidenceBaseline: string;
    versionRule: string;
  };
  resources: RegistryResource[];
}

export const registry = registryJson as unknown as RegistryFile;

const active = registry.resources.filter((r) => r.status === "active");

if (registry.evidencePolicy.runtimeUplift !== "not measured") {
  throw new Error("current-state: the registry no longer says runtime uplift is not measured; the site's content model must be revisited before it can claim anything.");
}
if (environment.runtime.executed !== false || environment.runtime.paid_model_calls !== 0) {
  throw new Error("current-state: the E2 environment records an executed or paid run; the site's runtime status must be re-derived, not assumed.");
}

export const currentState: CurrentState = {
  currentVersion: registry.release,
  releaseTheme: registry.releaseTheme,
  releaseStage: registry.releaseStage,
  stableBaseline: registry.evidencePolicy.stableEvidenceBaseline,
  currentCEL: registry.evidencePolicy.currentLevel,
  runtimeStatus: "not executed",
  runtimeUplift: "not measured",
  paidRuntimeCalls: 0,
  latestEvidence: {
    what: `${contractEval.checked} deterministic contract checks across ${contractEval.groups.length} groups, all passed — declared contracts hold; effectiveness untested`,
    date: contractEval.ran_at,
    source: { path: "compound-design/quality/releases/v0.3-contract-eval.json", note: contractEval.note },
  },
  nextEvidenceTarget: {
    what: "Controlled runtime: Interface Review against no resource and against direct upstream use; Quality Gate against the same policy documents; and the rewritten resource against the version it replaced. Pre-registered and frozen; it starts only with explicit paid-runtime authorisation.",
    source: { path: "compound-design/quality/e2/E2-PILOT-PLAN.md", note: "§1 research question, §13 promotion thresholds; candidate lane in quality/e2/candidate-v0.3/CANDIDATE-LANE.md" },
  },
  lastVerifiedAt: contractEval.ran_at,
  counts: {
    skills: active.filter((r) => r.kind === "skill").length,
    agents: active.filter((r) => r.kind === "agent" || r.kind === "orchestrator").length,
    activeResources: active.length,
    supersededResources: registry.resources.filter((r) => r.status === "superseded").length,
  },
  sources: [
    { path: "compound-design/registry/resource-registry.json", note: "release, stage, stable baseline, current level, uplift" },
    { path: "compound-design/quality/releases/v0.3-contract-eval.json", note: "latest evidence artifact and date" },
    { path: "compound-design/quality/e2/environment.json", note: "runtime executed: false; paid model calls: 0" },
  ],
};

/** Display form of a version string: `0.3.0-alpha.1` → `v0.3.0-alpha.1`. */
export const v = (version: string) => `v${version}`;

/** The registry's own rule, quoted rather than paraphrased. */
export const evidenceRule = registry.evidencePolicy.rule;
export const versionRule = registry.evidencePolicy.versionRule;
export const e2Status = environment.status;
