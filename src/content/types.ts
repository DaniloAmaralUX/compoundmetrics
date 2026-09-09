// Content model for the public site.
//
// Rule: a factual value (version, level, status, count) lives in src/content exactly once and is
// derived from the framework's own artifacts wherever one exists. Routes import it; they never
// restate it. `npm run site:check` fails the build if src/app or src/components carry one.

export type Cel = "E0" | "E1" | "E2" | "E3" | "E4";

export interface Source {
  /** Repository-relative path of the document the fact comes from. */
  path: string;
  /** What in that document supports the fact. */
  note?: string;
}

export interface CurrentState {
  currentVersion: string;
  releaseTheme: string;
  releaseStage: "candidate" | "stable";
  stableBaseline: string;
  currentCEL: Cel;
  runtimeStatus: "not executed";
  runtimeUplift: "not measured";
  paidRuntimeCalls: 0;
  latestEvidence: { what: string; date: string; source: Source };
  nextEvidenceTarget: { what: string; source: Source };
  lastVerifiedAt: string;
  counts: { skills: number; agents: number; activeResources: number; supersededResources: number };
  sources: Source[];
}

export type ResourceKind = "skill" | "agent" | "orchestrator";

export type ResourceGroup = "work-system" | "around-the-loop" | "operations" | "specialists" | "quality-learning" | "agents";

export interface RegistryResource {
  id: string;
  publicName: string;
  kind: ResourceKind;
  status: "active" | "superseded";
  path: string;
  version: string;
  job: string;
  triggers?: string[];
  nonGoals?: string[];
  upstream?: string[];
  provenance?: string;
  cdqi: number | null;
  cel: Cel;
  runtimeUplift: string;
  evidenceDebt?: string[];
  supersedes?: string;
  supersededBy?: string;
}

export interface ResourceSection {
  id: string;
  heading: string;
  markdown: string;
}

export interface GeneratedResource {
  id: string;
  kind: ResourceKind;
  path: string;
  frontmatter: Record<string, string>;
  title: string;
  question: string | null;
  lede: string;
  sections: ResourceSection[];
  lines: number;
}

/** A public resource: registry facts + the canonical file's sections + authored public copy. */
export interface Resource {
  id: string;
  publicName: string;
  kind: ResourceKind;
  group: ResourceGroup;
  version: string;
  cel: Cel;
  cdqi: number | null;
  /** The one human question the resource answers. */
  question: string;
  /** One sentence, in the reader's words. */
  oneSentence: string;
  /** A concrete example of the resource in use. */
  example: string;
  job: string;
  triggers: string[];
  nonGoals: string[];
  evidenceDebt: string[];
  provenance: string;
  upstream: string[];
  supersedes?: { id: string; publicName: string; version: string; cel: Cel; cdqi: number | null };
  related: string[];
  concepts: string[];
  sections: ResourceSection[];
  path: string;
  lines: number;
  /** For agents: the skill it runs. */
  runs?: string;
}

export interface EvidenceLevel {
  id: Cel;
  name: string;
  /** What this level means, in plain words. */
  meaning: string;
  /** What we can claim at this level (the literal claim class from CD-EVIDENCE-LEVELS.md). */
  canSay: string;
  cannotSay: string;
  /** What produces the next level. */
  movesForward: string;
  evidence: string[];
  source: Source;
}

export interface ProjectStage {
  id: string;
  version: string;
  name: string;
  /** Position on the rail, in order. */
  order: number;
  status: "done" | "current" | "next";
  date?: string;
  question: string;
  changed: string;
  built: string[];
  learned: string;
  unknown: string;
  sources: Source[];
}

export type ConceptGroup =
  | "foundations"
  | "evidence"
  | "learning"
  | "benchmark"
  | "measurement"
  | "harness"
  | "tooling";

export interface Concept {
  id: string;
  title: string;
  group: ConceptGroup;
  oneSentence: string;
  plain: string;
  why: string;
  analogy: string;
  inPractice: string;
  inCompound: string;
  failsWithout: string;
  technical: string;
  related: string[];
  source: Source;
  status: string;
  /** Other names people use, including Portuguese. */
  aliases: string[];
  /** Whole questions people ask, in their words. */
  queries: string[];
}

export interface ExampleStep {
  id: string;
  label: string;
  title: string;
  body: string;
  /** The form the knowledge takes at this step. */
  form: string;
}

export interface Example {
  id: string;
  title: string;
  setting: string;
  steps: ExampleStep[];
}
