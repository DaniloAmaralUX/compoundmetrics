import generated from "./generated/resources.json";
import { registry } from "./current-state";
import type { GeneratedResource, RegistryResource, Resource, ResourceGroup } from "./types";

export const resourceGroups: Array<{ id: ResourceGroup; name: string; lede: string }> = [
  { id: "work-system", name: "Work system", lede: "The six stages of the loop. Each is a procedure with a declared scope, write authority and output contract." },
  { id: "around-the-loop", name: "Around the loop", lede: "What the loop reads before it starts and what keeps its memory honest afterwards." },
  { id: "operations", name: "Operations", lede: "Getting a project ready, and leaving a session so the next one can resume." },
  { id: "specialists", name: "Specialists", lede: "Judgment the loop dispatches when the work has a question that needs it — and only then." },
  { id: "quality-learning", name: "Quality & learning", lede: "The parts of the system that are allowed to say no, and the procedure that improves a resource without a bigger prompt." },
  { id: "agents", name: "Agents", lede: "Specialists dispatched into their own context. Thin by contract: each points at the skill that owns its procedure." },
];

interface PublicCopy {
  group: ResourceGroup;
  question?: string;
  oneSentence: string;
  example: string;
  related: string[];
  concepts: string[];
  runs?: string;
}

// Authored public copy, keyed by registry id. Everything factual — level, score, version, job,
// triggers, non-goals, evidence debt, provenance — comes from the registry and the canonical file.
const copy: Record<string, PublicCopy> = {
  "cd-frame": {
    group: "work-system",
    oneSentence: "Decides what the work is solving, for whom, and what would count as done — before anything is designed.",
    example: "A request arrives as “add a filter panel”. Frame restates it as the problem underneath, runs discovery for prior learning, asks the one question the repository cannot answer, and writes success conditions Verify can check later.",
    related: ["cd-model", "cd-strategy", "cd-compound"],
    concepts: ["framework", "durable-learning", "discoverability", "skill"],
  },
  "cd-model": {
    group: "work-system",
    oneSentence: "Decides how the product must behave — entities, routes, states, transitions, edge cases — as the contract Build implements.",
    example: "For a signup flow, Model names every state the form can be in, including the ones nobody designed: submitting, failed, retried, already registered, offline.",
    related: ["cd-frame", "cd-build", "cd-verify"],
    concepts: ["skill", "discoverability"],
  },
  "cd-build": {
    group: "work-system",
    oneSentence: "Implements the decided contract inside the existing architecture, runs the project's own checks, and reports exactly what changed.",
    example: "Build reads the model, prefers the form primitives the codebase already has, implements the smallest change, runs typecheck, lint and tests, and lists every file it touched — including any the contract did not ask for, and why.",
    related: ["cd-model", "cd-verify"],
    concepts: ["skill"],
  },
  "cd-verify": {
    group: "work-system",
    oneSentence: "Checks the built result against what was decided. Report-only by default: reviewing is not permission to change.",
    example: "Verify runs the deterministic checks first, walks the model's states one by one, checks keyboard reachability and focus, and reports findings in the shared shape. It does not fix them.",
    related: ["cd-build", "cd-polish", "cd-interface-review", "cd-ai-interaction-review"],
    concepts: ["finding-contract", "fixture", "axe-core"],
  },
  "cd-polish": {
    group: "work-system",
    oneSentence: "Makes a working interface deliberate — hierarchy, spacing, colour, copy, feel — only after it works.",
    example: "Polish compares the new form with its sibling surfaces, deletes the one-off spacing value instead of adding another, rewrites the error to name the recovery, and stops.",
    related: ["cd-verify", "cd-interface-review", "cd-motion-review", "cd-compound"],
    concepts: ["skill"],
  },
  "cd-compound": {
    group: "work-system",
    oneSentence: "Keeps the one learning a future run would otherwise rediscover, and makes it discoverable. Most runs keep nothing.",
    example: "After the signup work, Compound asks whether a future engineer would repeat the investigation if the note vanished. If yes, it writes one solution with the literal signals that will recur; if no, it writes nothing.",
    related: ["cd-frame", "cd-compound-refresh"],
    concepts: ["durable-learning", "discoverability", "learning-ledger"],
  },
  "cd-strategy": {
    group: "around-the-loop",
    oneSentence: "Holds the project anchor that Frame and Model read — purpose, users, how success is judged — and keeps it short on purpose.",
    example: "Strategy records that success is “the framework can discover it is wrong”, so Frame can tell an on-strategy request from a distraction without asking.",
    related: ["cd-frame", "cd-model"],
    concepts: ["framework"],
  },
  "cd-compound-refresh": {
    group: "around-the-loop",
    oneSentence: "Audits the store of durable learning and gives every document exactly one outcome: keep, update, consolidate, replace or delete.",
    example: "A solution whose signals no longer appear anywhere in the codebase is updated or deleted — never archived in place, because version history is the archive.",
    related: ["cd-compound"],
    concepts: ["durable-learning", "discoverability"],
  },
  "cd-setup": {
    group: "operations",
    oneSentence: "Diagnoses a project for Compound Design, offers each fix, and changes nothing you own without asking.",
    example: "Setup reports the plugin version, resolves the artifact root, and offers to create the tracked configuration. It never creates the local override and never bulk-installs optional tools.",
    related: ["cd-handoff"],
    concepts: ["framework"],
  },
  "cd-handoff": {
    group: "operations",
    oneSentence: "Writes one immutable, pointer-first handoff so the next session — or the next host — resumes without re-reading everything.",
    example: "The handoff names what specifically matters at each reference instead of reproducing it, redacts secrets, and ends with a copyable resume command.",
    related: ["cd-setup"],
    concepts: ["framework"],
  },
  "cd-interface-review": {
    group: "specialists",
    oneSentence: "Finds what materially costs a user — reachability, hierarchy, states, contrast, reflow, copy — and reports it with evidence, impact and a verification state.",
    example: "Reviewing a signup form, Interface Review reports a placeholder-only field as a blocker: the line it saw, what it costs a screen-reader user, and the concrete change.",
    related: ["cd-verify", "cd-polish", "interface-reviewer"],
    concepts: ["finding-contract", "upstream", "provenance"],
  },
  "cd-motion-review": {
    group: "specialists",
    oneSentence: "Asks whether motion should exist at all before asking how it should move, then checks interruption, exit and reduced-motion behaviour.",
    example: "A slide-in that cannot be interrupted is a defect, not a detail. Motion Review says remove it or make it interruptible, and checks that reduced motion still lands the element.",
    related: ["cd-polish", "motion-reviewer"],
    concepts: ["finding-contract", "upstream", "provenance"],
  },
  "cd-ai-interaction-review": {
    group: "specialists",
    question: "Is this AI behaviour appropriate for the person relying on it?",
    oneSentence: "Reviews only user-facing AI — for fit, reliance, legibility, human control, proportional autonomy and resilience to model change.",
    example: "An assistant that deletes records on its own initiative fails the autonomy gate: action power must scale with consequence and reversibility.",
    related: ["cd-verify", "ai-interaction-reviewer"],
    concepts: ["finding-contract"],
  },
  "cd-quality-gate": {
    group: "quality-learning",
    question: "Has this resource earned the claim being made for it?",
    oneSentence: "Separates construction quality from evidence and evaluates the evaluator itself before allowing any promotion claim.",
    example: "A skill with a strong contract and no runtime evidence gets a good construction score and stays at E1. The gate refuses to let one number borrow from the other.",
    related: ["cd-resource-lab", "evidence-reviewer"],
    concepts: ["cdqi", "cel", "quality-gate", "evidence-debt"],
  },
  "cd-resource-lab": {
    group: "quality-learning",
    question: "How does a resource get better without getting a bigger prompt?",
    oneSentence: "Improves resources through reproduced failures, hypotheses, eval-first changes, holdouts and falsification attempts.",
    example: "A reproduced failure becomes a regression eval. The change is the smallest that addresses the hypothesis. A separate holdout stays unseen while the fix is made.",
    related: ["cd-quality-gate", "learning-curator"],
    concepts: ["holdout", "learning-ledger", "resource-value-audit"],
  },
  "compound-design": {
    group: "agents",
    question: "Which stages does this work actually need?",
    oneSentence: "Routes work through the smallest sufficient set of stages and dispatches specialists deliberately. It owns no procedure of its own.",
    example: "A copy fix goes straight to Build. A new flow gets Frame and Model first. An interface question dispatches the Interface Reviewer rather than guessing.",
    related: ["cd-frame", "cd-model", "cd-build", "cd-verify", "cd-polish", "cd-compound"],
    concepts: ["agent", "routing"],
  },
  "interface-reviewer": {
    group: "agents",
    question: "Is this interface's craft in question?",
    oneSentence: "The Interface Review specialist, dispatched into its own context, read-only, returning findings in the shared shape.",
    example: "Verify needs an interface judgment it should not make itself. The reviewer is dispatched, reads, and returns findings — it never edits.",
    related: ["cd-interface-review"],
    concepts: ["agent", "finding-contract"],
    runs: "cd-interface-review",
  },
  "motion-reviewer": {
    group: "agents",
    question: "Is motion or interaction feel in question?",
    oneSentence: "The Motion Review specialist, dispatched into its own context, read-only, returning findings in the shared shape.",
    example: "Polish asks whether a transition should exist. The reviewer answers with a finding, not a redesign.",
    related: ["cd-motion-review"],
    concepts: ["agent", "finding-contract"],
    runs: "cd-motion-review",
  },
  "ai-interaction-reviewer": {
    group: "agents",
    question: "Does user-facing AI materially affect the person or an action?",
    oneSentence: "The AI Interaction Review specialist, dispatched only when AI behaviour materially affects a user or an action.",
    example: "A feature adds an AI summary. The reviewer checks fit, reliance and human control, and stays out of ordinary UI critique.",
    related: ["cd-ai-interaction-review"],
    concepts: ["agent", "finding-contract"],
    runs: "cd-ai-interaction-review",
  },
  "evidence-reviewer": {
    group: "agents",
    question: "Is a claim about a resource about to exceed its evidence?",
    oneSentence: "The evidence specialist: construction versus evidence, claim discipline, evidence debt, promotion decisions.",
    example: "A release note wants to say a resource “works”. The reviewer asks what artifact supports that and answers with the level the artifact actually earns.",
    related: ["cd-quality-gate"],
    concepts: ["agent", "cel", "cdqi", "evidence-debt"],
    runs: "cd-quality-gate",
  },
  "learning-curator": {
    group: "agents",
    question: "What deserves to survive this project?",
    oneSentence: "The learning specialist: what survives a project, and whether the store of surviving knowledge stays true, distinct and findable.",
    example: "At the end of a run the curator applies the durability test, writes one learning or none, and on a refresh pass gives every existing document one outcome.",
    related: ["cd-compound", "cd-compound-refresh"],
    concepts: ["agent", "durable-learning", "discoverability"],
    runs: "cd-compound",
  },
};

const gen = generated as unknown as { items: Record<string, GeneratedResource> };

function toResource(r: RegistryResource): Resource {
  const c = copy[r.id];
  const g = gen.items[r.id];
  if (!c) throw new Error(`resources: no public copy for active resource ${r.id}`);
  if (!g) throw new Error(`resources: generated content missing for ${r.id}; run npm run content`);
  const superseded = registry.resources.find((s) => s.status === "superseded" && s.supersededBy === r.id) ?? (r.supersedes ? registry.resources.find((s) => s.id === r.supersedes) : undefined);
  return {
    id: r.id,
    publicName: r.publicName,
    kind: r.kind,
    group: c.group,
    version: r.version,
    cel: r.cel,
    cdqi: r.cdqi,
    question: c.question ?? g.question ?? r.job,
    oneSentence: c.oneSentence,
    example: c.example,
    job: r.job,
    triggers: r.triggers ?? [],
    nonGoals: r.nonGoals ?? [],
    evidenceDebt: r.evidenceDebt ?? [],
    provenance: r.provenance ?? "",
    upstream: r.upstream ?? [],
    supersedes: superseded ? { id: superseded.id, publicName: superseded.publicName, version: superseded.version, cel: superseded.cel, cdqi: superseded.cdqi } : undefined,
    related: c.related,
    concepts: c.concepts,
    sections: g.sections,
    path: r.path,
    lines: g.lines,
    runs: c.runs,
  };
}

export const resources: Resource[] = registry.resources.filter((r) => r.status === "active").map(toResource);

export const resourceById = (id: string) => resources.find((r) => r.id === id);

export const resourcesInGroup = (group: ResourceGroup) => resources.filter((r) => r.group === group);

/** Superseded resources, for provenance only — they get no page. */
export const supersededResources = registry.resources.filter((r) => r.status === "superseded");

export const kindLabel: Record<Resource["kind"], string> = { skill: "Skill", agent: "Agent", orchestrator: "Orchestrator" };

/** The order the loop runs in, for the Home and Resources index. */
export const loopOrder = ["cd-frame", "cd-model", "cd-build", "cd-verify", "cd-polish", "cd-compound"];
