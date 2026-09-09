import type { EvidenceLevel, Source } from "./types";

const SRC: Source = { path: "compound-design/quality/CD-EVIDENCE-LEVELS.md" };

// The claim classes are quoted from CD-EVIDENCE-LEVELS.md; the plain-language columns are the
// site's, written to teach the distinction before naming it.
export const evidenceLevels: EvidenceLevel[] = [
  {
    id: "E0",
    name: "Inspected",
    meaning: "Someone read it carefully. Nothing has been run.",
    canSay: "well-constructed / validation pending",
    cannotSay: "that it works, in any sense that involves running it",
    movesForward: "An executable check with a recorded pass/fail result.",
    evidence: ["prose and static review", "source and provenance inspection", "no executed evaluation artifact required"],
    source: SRC,
  },
  {
    id: "E1",
    name: "Deterministic contracts",
    meaning: "Machines checked that the resource declares and satisfies its own contract — every time, the same way.",
    canSay: "contract-tested",
    cannotSay: "proven to improve outcomes",
    movesForward: "A controlled comparison against a relevant baseline on the same tasks, repeated.",
    evidence: ["executable or reproducible contract checks", "static invariants", "deterministic regression assertions", "an artifact with pass/fail results"],
    source: SRC,
  },
  {
    id: "E2",
    name: "Controlled runtime",
    meaning: "The resource was run against a baseline on representative tasks, more than once, and the difference was recorded.",
    canSay: "demonstrated uplift in tested scope", // the allowed claim at E2, quoted from CD-EVIDENCE-LEVELS.md — not a claim made here
    cannotSay: "that it works outside the tested tasks and model, or that anyone independent agrees",
    movesForward: "An independent grader, evaluator or blinded human comparison, with evaluator and rubric identified.",
    evidence: ["a relevant baseline", "the same representative tasks", "candidate versus baseline or previous version", "repeated nondeterministic runs", "outcome and routing deltas", "cost and latency where relevant"],
    source: SRC,
  },
  {
    id: "E3",
    name: "Independent",
    meaning: "Someone or something outside the original setup — a different model family, a separate evaluator, a blinded human — reached the same conclusion.",
    canSay: "independently corroborated in tested scope",
    cannotSay: "field-proven, or certified by any vendor whose model happened to be used",
    movesForward: "Real use over time, with regressions tracked across versions.",
    evidence: ["E2 plus an independent or cross-model grader", "or a separate evaluator framework or provider", "or a blinded human comparison", "or a representative external benchmark", "the artifact identifies evaluator, version and rubric"],
    source: SRC,
  },
  {
    id: "E4",
    name: "Field evidence",
    meaning: "It has been used for real, across versions and runtime changes, and its failures are on record.",
    canSay: "field-proven in defined scope",
    cannotSay: "anything beyond the defined scope",
    movesForward: "Nothing above E4. The scope can widen; the level cannot.",
    evidence: ["real-use evidence over time", "regression history across multiple versions", "a meaningful failure corpus", "stable behaviour across runtime and model changes", "rollback and version history"],
    source: SRC,
  },
];

export const cdqi = {
  name: "CDQI",
  longName: "Compound Design Quality Index",
  range: "0–10",
  question: "Is this resource well constructed?",
  meaning: "A construction score: how bounded, grounded, actionable, testable and maintainable the resource is. Judged and written down by a person; never computed from runtime results.",
  dimensions: [
    ["Scope & contract", 15, "Is the primary job explicit, bounded and internally coherent?"],
    ["Routing & boundaries", 15, "Is it clear when to use, not use, and defer to a sibling resource?"],
    ["Domain grounding", 15, "Are relevant sources correctly specialised rather than copied decoratively?"],
    ["Instruction design", 15, "Are instructions ordered, decision-oriented and free of avoidable conflict?"],
    ["Output & actionability", 15, "Does the output contract drive concrete action rather than commentary?"],
    ["Evalability", 15, "Can important claims, routing and failures be tested?"],
    ["Maintainability & provenance", 10, "Can the resource evolve safely with clear source and licence boundaries?"],
  ] as const,
  interpretation: [
    ["0.0–3.9", "weak or unsafe construction"],
    ["4.0–5.9", "experimental"],
    ["6.0–6.9", "promising"],
    ["7.0–7.9", "good internal resource"],
    ["8.0–8.9", "strong construction"],
    ["9.0–9.6", "mature construction with unusually strong boundaries and evalability"],
    ["9.7–10.0", "reserved; almost no material construction weakness"],
  ] as const,
  source: { path: "compound-design/quality/CD-QUALITY-INDEX.md" } as Source,
};

export const cel = {
  name: "CEL",
  longName: "Compound Evidence Level",
  range: "E0–E4",
  question: "How much evidence do we have that it actually works?",
  meaning: "An evidence maturity ladder. It moves only when new evidence is produced — never because construction improved, and never because a model praised the output.",
  source: SRC,
};

/** What repays no evidence debt — quoted from EVIDENCE-DEBT.md so the site cannot soften it. */
export const notEvidence = [
  "a higher self-assigned score",
  "a new prompt revision with no reproduced failure",
  "model praise",
  "screenshots of good outputs",
  "vendor tooling used as if it were vendor certification",
  "passing the same examples used to write the resource",
];

export const invariants: Array<[string, string]> = [
  ["popular", "proven"],
  ["company-made", "certified"],
  ["official pattern", "endorsement"],
  ["passing deterministic tests", "runtime uplift"],
  ["high CDQI", "effectiveness"],
  ["same vendor, different model", "independent validation"],
  ["candidate release", "validated release"],
];
