// The Compound Design case study, read from the case-study/ records at build time.
//
// Every number on /case-study comes from here, and here it comes from a file: the tools manifest,
// the design milestones, the chronology, the benchmark summary and the findings report. Files that
// have not been produced yet (learning yield, transfer graph, theory, film) are checked for on
// disk; where one is absent the route says "not yet computed" rather than inventing a value.
// Server-only: this module reads the filesystem and must never be imported by a client component.
import fs from "node:fs";
import path from "node:path";
import manifestJson from "../../case-study/history/TOOLS-MANIFEST.json";
import milestonesJson from "../../case-study/history/DESIGN-MILESTONES.json";
import summaryJson from "../../case-study/design-benchmark/SUMMARY.json";
import findingsJson from "../../case-study/design-benchmark/reports/FINDINGS.json";
import rubricJson from "../../case-study/design-benchmark/rubric/compound-design-audit.json";
import { currentState } from "./current-state";
import type { Source } from "./types";

const ROOT = process.cwd();
const REPO = "https://github.com/DaniloAmaralUX/compoundmetrics";
const BRANCH = "claude/compound-design-case-study";

/* ------------------------------------------------------------------ tools */

export type ToolConfidence = "high" | "medium" | "low";

interface ManifestTool {
  id: string;
  name: string;
  purpose: string;
  context: string;
  repository: { owner: string; repo: string; access: string } | null;
  first_known_date: string | null;
  design_family: string;
  resources_created: string[];
  resources_reused: string[];
  confidence: ToolConfidence;
  captured: string;
  privacy: string;
  authorship: string;
  notes?: string;
}

interface ManifestFile {
  generated_at: string;
  sources: string[];
  stated_count_in_brief: number;
  tool_candidates: number;
  verified_by_repository: number;
  reconciliation: string;
  excluded: Array<{ project: string; created: string; why: string }>;
  tools: ManifestTool[];
}

const manifest = manifestJson as unknown as ManifestFile;

export interface CaseTool {
  id: string;
  name: string;
  purpose: string;
  context: string;
  repo: string | null;
  firstKnown: string;
  family: string;
  confidence: ToolConfidence;
  /** The milestone capture note as written in the manifest ("yes (M01)", "no", "n/a (no interface)"). */
  captured: string;
  resourcesCreated: number;
  resourcesReused: number;
  authorship: string;
}

const isClient = (t: ManifestTool) => t.privacy.startsWith("review-required");
const isVerified = (t: ManifestTool) => t.repository !== null && t.repository.access !== "not attached";

const toTool = (t: ManifestTool): CaseTool => ({
  id: t.id,
  name: scrub(t.name),
  purpose: scrub(t.purpose),
  context: scrub(t.context),
  repo: t.repository ? `${t.repository.owner}/${t.repository.repo}` : null,
  firstKnown: t.first_known_date ?? "date unknown",
  family: t.design_family,
  confidence: t.confidence,
  captured: t.captured,
  resourcesCreated: t.resources_created.length,
  resourcesReused: t.resources_reused.length,
  authorship: t.authorship,
});

/** Client work is present in the manifest only as counts: privacy review is required before a name can be shown. */
export interface AnonymisedGroup {
  count: number;
  byConfidence: Record<ToolConfidence, number>;
  firstKnown: string | null;
  lastKnown: string | null;
}

const clientTools = manifest.tools.filter(isClient);
const clientDates = clientTools.map((t) => t.first_known_date).filter((d): d is string => Boolean(d)).sort();
const clientIds = new Set(clientTools.map((t) => t.id));

// Every free-text field that reaches the page (chronology rows, graph evidence, tool notes) is
// passed through this scrub, so a client name recorded in a source document is withheld the same way
// the tool itself is. Tokens: the full name, each slash-separated alias, each proper word of the name
// that is not a generic term, and the repository slug. Case-insensitive.
const GENERIC = new Set(["portal", "estrutura", "handoff", "protótipos", "design", "client", "work"]);
const clientNameTokens = [
  ...new Set(
    clientTools.flatMap((t) => {
      const bare = t.name.replace(/\s*\([^)]*\)/g, "");
      const parts = bare.split(/\s*\/\s*/).map((x) => x.trim());
      const words = bare.split(/[^\p{L}\p{N}-]+/u).filter((w) => w.length >= 4 && /^\p{Lu}/u.test(w) && !GENERIC.has(w.toLowerCase()));
      return [bare, ...parts, ...words, t.repository?.repo ?? ""].map((x) => x.trim()).filter((x) => x.length >= 4);
    }),
  ),
].sort((a, b) => b.length - a.length);
const WITHHELD = "[client tool, name withheld]";
const scrub = (text: string) => clientNameTokens.reduce((acc, tok) => acc.replace(new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), WITHHELD), text);

export const tools = {
  generatedAt: manifest.generated_at,
  stated: manifest.stated_count_in_brief,
  candidates: manifest.tool_candidates,
  verifiedByRepository: manifest.verified_by_repository,
  reconciliation: manifest.reconciliation,
  sources: manifest.sources,
  excluded: manifest.excluded,
  verified: manifest.tools.filter((t) => !isClient(t) && isVerified(t)).map(toTool),
  inferred: manifest.tools.filter((t) => !isClient(t) && !isVerified(t)).map(toTool),
  client: {
    count: clientTools.length,
    byConfidence: {
      high: clientTools.filter((t) => t.confidence === "high").length,
      medium: clientTools.filter((t) => t.confidence === "medium").length,
      low: clientTools.filter((t) => t.confidence === "low").length,
    },
    firstKnown: clientDates[0] ?? null,
    lastKnown: clientDates[clientDates.length - 1] ?? null,
  } satisfies AnonymisedGroup,
  source: { path: "case-study/history/TOOLS-MANIFEST.json", note: "stated count, candidates, verification, privacy" } satisfies Source,
};

export const toolName = (id: string) => {
  const t = manifest.tools.find((x) => x.id === id);
  if (!t) return id;
  return isClient(t) ? "client tool (name withheld)" : t.name;
};

/* ------------------------------------------------------------------ milestones */

interface MilestoneRecord {
  id: string;
  build: string;
  tool_ids: string[];
  name: string;
  repo: string;
  source_sha: string;
  representative_url: string;
  equivalent_deployments: string[];
  date_range: string;
  why_distinct: string;
  confidence: string;
  entry_title: string;
  capture_method: string;
}

interface MilestonesFile {
  generated_at: string;
  principle: string;
  excluded: Array<{ what: string; why: string }>;
  milestone_count: number;
  merge_evaluation: {
    rule: string;
    evaluated_at: string;
    pairs: Array<{ a: string; b: string; ahash_hamming: number; dom_identical: boolean; css_identical: boolean; merged: boolean }>;
    notes: string[];
  };
  milestones: MilestoneRecord[];
}

const milestonesFile = milestonesJson as unknown as MilestonesFile;

export interface Screenshot {
  src: string;
  width: number;
  height: number;
}

/** Reads the IHDR chunk of a PNG for its intrinsic size; null when the file is not there. */
function pngSize(publicPath: string): Screenshot | null {
  const file = path.join(ROOT, "public", publicPath);
  if (!fs.existsSync(file)) return null;
  const fd = fs.openSync(file, "r");
  const head = Buffer.alloc(24);
  fs.readSync(fd, head, 0, 24, 0);
  fs.closeSync(fd);
  if (head.toString("ascii", 1, 4) !== "PNG") return null;
  return { src: `/${publicPath}`, width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

export interface Milestone {
  id: string;
  build: string;
  name: string;
  toolIds: string[];
  toolNames: string[];
  repo: string;
  sha: string;
  shaShort: string;
  dateRange: string;
  /** A real URL when the record has one, otherwise the record's own note about where it lived. */
  url: string | null;
  urlNote: string | null;
  equivalentDeployments: string[];
  whyDistinct: string;
  confidence: string;
  entryTitle: string;
  desktop: Screenshot | null;
  mobile: Screenshot | null;
}

function splitUrl(field: string): { url: string | null; note: string | null } {
  const m = field.match(/^(https?:\/\/\S+)\s*(.*)$/);
  if (!m) return { url: null, note: field.replace(/^\(|\)$/g, "") };
  const note = m[2].replace(/^\(|\)$/g, "").trim();
  return { url: m[1], note: note || null };
}

export const milestones: Milestone[] = milestonesFile.milestones.map((m) => {
  const { url, note } = splitUrl(m.representative_url);
  return {
    id: m.id,
    build: m.build,
    name: scrub(m.name),
    toolIds: m.tool_ids,
    toolNames: m.tool_ids.map(toolName),
    repo: m.repo,
    sha: m.source_sha,
    shaShort: m.source_sha.slice(0, 7),
    dateRange: m.date_range,
    url,
    urlNote: note,
    equivalentDeployments: m.equivalent_deployments,
    whyDistinct: scrub(m.why_distinct),
    confidence: m.confidence,
    entryTitle: m.entry_title,
    desktop: pngSize(`case-study/${m.id}-entry-desktop.png`),
    mobile: pngSize(`case-study/${m.id}-entry-mobile.png`),
  };
});

export const milestonesMeta = {
  count: milestonesFile.milestone_count,
  principle: milestonesFile.principle,
  excluded: milestonesFile.excluded,
  mergeRule: milestonesFile.merge_evaluation.rule,
  mergePairs: milestonesFile.merge_evaluation.pairs,
  mergeNotes: milestonesFile.merge_evaluation.notes.map(scrub),
  captureMethod: milestonesFile.milestones[0]?.capture_method ?? "",
  toolsCaptured: new Set(milestonesFile.milestones.flatMap((m) => m.tool_ids)).size,
  source: { path: "case-study/history/DESIGN-MILESTONES.json", note: "milestones, source commits, merge evaluation" } satisfies Source,
};

/* ------------------------------------------------------------------ chronology */

export interface ChronologyRow {
  date: string;
  event: string;
  evidence: string;
}

export interface ChronologyCount {
  what: string;
  count: string;
  basis: string;
}

function parseTable(section: string): string[][] {
  return section
    .split("\n")
    .filter((l) => l.startsWith("|"))
    .map((l) => l.split("|").slice(1, -1).map((c) => c.trim()))
    .filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)))
    .slice(1);
}

function sectionOf(md: string, heading: string): string {
  const chunks = md.split(/^## /m).slice(1);
  const chunk = chunks.find((c) => c.startsWith(heading));
  return chunk ? chunk.slice(chunk.indexOf("\n") + 1) : "";
}

const chronologyMd = scrub(fs.readFileSync(path.join(ROOT, "case-study/history/CHRONOLOGY.md"), "utf8"));
const chronologyIntro = chronologyMd.split("\n").find((l) => l.startsWith("Generated ")) ?? "";

export const chronology = {
  intro: chronologyIntro,
  counts: parseTable(sectionOf(chronologyMd, "What the brief says vs what the metadata supports")).map(([what, count, basis]) => ({ what, count, basis }) satisfies ChronologyCount),
  countsNote: sectionOf(chronologyMd, "What the brief says vs what the metadata supports")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("|"))
    .join(" ")
    .trim(),
  timeline: parseTable(sectionOf(chronologyMd, "Timeline (verified dates only)")).map(([date, event, evidence]) => ({ date, event, evidence }) satisfies ChronologyRow),
  relationships: sectionOf(chronologyMd, "Relationships that the sources support")
    .split("\n")
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, "").trim()),
  relationshipsIntro: (() => {
    const lines = sectionOf(chronologyMd, "Relationships that the sources support").split("\n");
    const first = lines.findIndex((l) => /^\s*-\s+/.test(l));
    return lines
      .slice(0, first < 0 ? lines.length : first)
      .filter((l) => l.trim())
      .join(" ")
      .trim();
  })(),
  relationshipsNote: (() => {
    const lines = sectionOf(chronologyMd, "Relationships that the sources support").split("\n");
    let last = -1;
    lines.forEach((l, i) => {
      if (/^\s*-\s+/.test(l)) last = i;
    });
    return lines
      .slice(last + 1)
      .filter((l) => l.trim())
      .join(" ")
      .trim();
  })(),
  uncertainties: sectionOf(chronologyMd, "Uncertainties, explicitly")
    .split("\n")
    .filter((l) => /^\s*\d+\.\s+/.test(l))
    .map((l) => l.replace(/^\s*\d+\.\s+/, "").trim()),
  source: { path: "case-study/history/CHRONOLOGY.md", note: "timeline, relationships, uncertainties" } satisfies Source,
};

/* ------------------------------------------------------------------ benchmark */

interface CategoryScore {
  score: number | null;
  coverage: number;
}

interface SummaryMilestone {
  milestone: string;
  name: string;
  tool_ids: string[];
  date_range: string;
  score: number;
  coverage: number;
  counts: Record<string, number>;
  deterministic_score: number | null;
  judgment_score: number | null;
  categories: Record<string, CategoryScore>;
}

interface DeltaPair {
  from: string;
  to: string;
  score_delta: number;
  coverage_delta: number;
  category_delta: Record<string, number | null>;
  improved: string[];
  regressed: string[];
  removed_failures: string[];
  new_failures: string[];
  same_tool: boolean;
}

interface SummaryFile {
  generated_at: string;
  label: string;
  meaning: string;
  formula: { score: string; coverage: string; na: string };
  rubric_sha256: string;
  average_score_all_milestones?: number;
  average_score_independent_designs?: number;
  average_note?: string;
  milestones: SummaryMilestone[];
  delta: {
    pairs: DeltaPair[];
    biggest_improvement: DeltaPair | null;
    biggest_regression: DeltaPair | null;
    most_persistent_failures: Array<{ id: string; fails: number; of: number }>;
    category_improved_most: { category: string; first: number | null; last: number | null; delta: number | null } | null;
    category_improved_least: { category: string; first: number | null; last: number | null; delta: number | null } | null;
    first_vs_last: { from: string; to: string; score_delta: number } | null;
  };
  chronological_trend: Array<{ milestone: string; score: number; coverage: number }>;
}

const summary = summaryJson as unknown as SummaryFile;

interface RubricFile {
  name: string;
  version: string;
  source_repository: string;
  source_sha: string;
  item_count: number;
  categories: Array<{ id: string; title: string; item_count: number }>;
}

const rubric = rubricJson as unknown as RubricFile;

export interface BenchmarkCategory {
  id: string;
  title: string;
  items: number;
}

export const benchmarkCategories: BenchmarkCategory[] = (() => {
  const seen = summary.milestones[0] ? Object.keys(summary.milestones[0].categories) : [];
  const ids = seen.length ? seen : rubric.categories.map((c) => c.id);
  return ids.map((id) => {
    const r = rubric.categories.find((c) => c.id === id);
    return { id, title: r?.title ?? id, items: r?.item_count ?? 0 };
  });
})();

export const categoryTitle = (id: string) => benchmarkCategories.find((c) => c.id === id)?.title ?? id;

export interface BenchmarkRow {
  id: string;
  name: string;
  dateRange: string;
  score: number;
  coverage: number;
  counts: Record<string, number>;
  deterministicScore: number | null;
  judgmentScore: number | null;
  categories: Record<string, CategoryScore>;
}

export const benchmark = {
  label: summary.label,
  meaning: summary.meaning,
  formula: summary.formula,
  generatedAt: summary.generated_at,
  rubricSha: summary.rubric_sha256,
  rubricName: rubric.name,
  rubricVersion: rubric.version,
  rubricItems: rubric.item_count,
  rubricRepo: rubric.source_repository,
  rubricSha7: rubric.source_sha.slice(0, 7),
  averageAll: summary.average_score_all_milestones ?? null,
  averageIndependent: summary.average_score_independent_designs ?? null,
  averageNote: summary.average_note ?? null,
  /** True once at least one milestone carries a merged judgment score; until then the score is deterministic-only. */
  judgmentMerged: summary.milestones.some((m) => m.judgment_score !== null),
  countKeys: summary.milestones[0] ? Object.keys(summary.milestones[0].counts) : [],
  rows: summary.milestones.map(
    (m): BenchmarkRow => ({
      id: m.milestone,
      name: m.name,
      dateRange: m.date_range,
      score: m.score,
      coverage: m.coverage,
      counts: m.counts,
      deterministicScore: m.deterministic_score,
      judgmentScore: m.judgment_score,
      categories: m.categories,
    }),
  ),
  trend: summary.chronological_trend,
  delta: summary.delta,
  sources: [
    { path: "case-study/design-benchmark/SUMMARY.json", note: "label, meaning, formula, per-milestone score and coverage, delta" },
    { path: "case-study/design-benchmark/rubric/compound-design-audit.json", note: "the frozen ruler: categories and item count" },
    { path: "case-study/design-benchmark/METHODOLOGY.md", note: "order of operations, bias controls, limitations" },
  ] satisfies Source[],
};

/* ------------------------------------------------------------------ findings */

interface FindingRecord {
  id: string;
  milestone: string;
  tool: string;
  surface: string;
  viewport: string;
  audit_item: string;
  category: string;
  state: string;
  evidence: string;
  impact?: string;
  confidence?: string;
}

interface FindingsFile {
  generated_at: string;
  count: number;
  findings: FindingRecord[];
}

const findingsFile = findingsJson as unknown as FindingsFile;

export interface Finding {
  id: string;
  milestone: string;
  surface: string;
  viewport: string;
  item: string;
  category: string;
  state: string;
  evidence: string;
  impact: string | null;
}

const EXAMPLE_LIMIT = 12;

export const findings = {
  count: findingsFile.count,
  generatedAt: findingsFile.generated_at,
  byCategory: benchmarkCategories
    .map((c) => ({ id: c.id, title: c.title, count: findingsFile.findings.filter((f) => f.category === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count),
  /** One example per milestone first, so the sample spans the chronology rather than the first file rows. */
  examples: (() => {
    const out: FindingRecord[] = [];
    const seenMilestone = new Set<string>();
    for (const f of findingsFile.findings) {
      if (seenMilestone.has(f.milestone)) continue;
      seenMilestone.add(f.milestone);
      out.push(f);
    }
    for (const f of findingsFile.findings) if (out.length < EXAMPLE_LIMIT && !out.includes(f)) out.push(f);
    return out.slice(0, EXAMPLE_LIMIT).map(
      (f): Finding => ({
        id: f.id,
        milestone: f.milestone,
        surface: f.surface,
        viewport: f.viewport,
        item: f.audit_item,
        category: f.category,
        state: f.state,
        evidence: scrub(f.evidence),
        impact: f.impact ?? null,
      }),
    );
  })(),
  exampleLimit: EXAMPLE_LIMIT,
  source: { path: "case-study/design-benchmark/reports/FINDINGS.json", note: "every FAIL with evidence (Findings Contract)" } satisfies Source,
};

/* ------------------------------------------------------------------ optional records */

function readJsonIfPresent<T>(rel: string): T | null {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export interface LearningYieldTool {
  tool_id: string;
  findings_total: number;
  meaningful_findings: number;
  durable_learnings: number;
  resource_candidates: number;
  resources_promoted: number;
  resources_later_reused: number;
}

interface LearningYieldFile {
  per_tool?: LearningYieldTool[];
  states?: Record<string, number>;
  items?: unknown[];
}

const learningYieldRaw = readJsonIfPresent<LearningYieldFile>("case-study/design-benchmark/reports/learning-yield.json");
const perTool = Array.isArray(learningYieldRaw?.per_tool) ? learningYieldRaw.per_tool.filter((t) => typeof t?.tool_id === "string") : [];

export const learningYield = {
  computed: perTool.length > 0,
  perTool: perTool.map((t) => ({ ...t, name: toolName(t.tool_id) })),
  states: learningYieldRaw?.states && typeof learningYieldRaw.states === "object" ? Object.entries(learningYieldRaw.states).filter(([, n]) => typeof n === "number") : [],
  items: Array.isArray(learningYieldRaw?.items) ? learningYieldRaw.items.length : 0,
  source: { path: "case-study/design-benchmark/reports/learning-yield.json", note: "findings → learning states → resource candidates" } satisfies Source,
};

export interface TransferNode {
  id: string;
  type: string;
  label: string;
  tool_id?: string;
}

export interface TransferEdge {
  id?: string;
  from: string;
  to: string;
  type: string;
  evidence: string;
  verified: boolean;
  note?: string;
}

interface TransferChain {
  name: string;
  edges: string[];
  fully_verified: boolean;
  note?: string;
}

interface NoneVerified {
  claim: string;
  why: string;
  tool_ids?: string[];
}

interface TransferGraphFile {
  generated_at?: string;
  nodes?: TransferNode[];
  edges?: TransferEdge[];
  end_to_end_chains?: TransferChain[];
  none_verified?: NoneVerified[];
  counts?: { nodes: number; edges: number; verified_edges: number; unverified_edges: number };
}

const transferRaw = readJsonIfPresent<TransferGraphFile>("case-study/knowledge/TRANSFER-GRAPH.json");
const transferNodes = (Array.isArray(transferRaw?.nodes) ? transferRaw.nodes.filter((n) => typeof n?.id === "string") : []).map((n) => ({
  ...n,
  label: clientIds.has(n.id) || (n.tool_id !== undefined && clientIds.has(n.tool_id)) ? "client tool (name withheld)" : scrub(String(n.label ?? n.id)),
}));
const transferEdges = Array.isArray(transferRaw?.edges) ? transferRaw.edges.filter((e) => typeof e?.from === "string" && typeof e?.to === "string") : [];
const nodeLabel = (id: string) => transferNodes.find((n) => n.id === id)?.label ?? toolName(id);
const nodeType = (id: string) => transferNodes.find((n) => n.id === id)?.type ?? "unknown";
const countBy = <T,>(items: T[], key: (t: T) => string) =>
  Object.entries(
    items.reduce<Record<string, number>>((acc, it) => {
      acc[key(it)] = (acc[key(it)] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

export const transferGraph = {
  computed: transferEdges.length > 0,
  generatedAt: transferRaw?.generated_at ?? null,
  nodes: transferNodes.length,
  nodeTypes: countBy(transferNodes, (n) => n.type),
  edgeTypes: countBy(transferEdges, (e) => e.type),
  edges: transferEdges.map((e) => ({
    id: e.id ?? `${e.from}→${e.to}`,
    from: e.from,
    to: e.to,
    type: e.type,
    evidence: scrub(String(e.evidence ?? "")),
    note: e.note ? scrub(e.note) : null,
    verified: e.verified === true,
    fromLabel: nodeLabel(e.from),
    toLabel: nodeLabel(e.to),
    fromType: nodeType(e.from),
    toType: nodeType(e.to),
  })),
  verifiedCount: transferEdges.filter((e) => e.verified === true).length,
  chains: (Array.isArray(transferRaw?.end_to_end_chains) ? transferRaw.end_to_end_chains : [])
    .filter((c) => typeof c?.name === "string")
    .map((c) => ({ name: scrub(c.name), edges: Array.isArray(c.edges) ? c.edges.length : 0, fullyVerified: c.fully_verified === true, note: c.note ? scrub(c.note) : null })),
  /** Claims the research checked and could not support. An entry that involves a client tool is reduced to counts. */
  noneVerified: (Array.isArray(transferRaw?.none_verified) ? transferRaw.none_verified : [])
    .filter((n) => typeof n?.claim === "string")
    .map((n) => {
      const ids = Array.isArray(n.tool_ids) ? n.tool_ids : [];
      const clients = ids.filter((id) => clientIds.has(id)).length;
      return clients > 0
        ? { claim: `A claim involving ${ids.length} tools, ${clients} of them client work (names withheld), that one taught a rule, pattern or resource a later tool reused.`, why: "No repository is readable for them; the manifest records no resource created or reused; no later file, commit or ledger entry references them.", withheld: true }
        : { claim: scrub(n.claim), why: scrub(String(n.why ?? "")), withheld: false };
    }),
  source: { path: "case-study/knowledge/TRANSFER-GRAPH.json", note: "nodes, edges, evidence, verified flag per edge; end-to-end chains; claims checked and not supported" } satisfies Source,
};

/* ------------------------------------------------------------------ theory */

const theoryPath = path.join(ROOT, "case-study/theory/ATOMIC-AI-DESIGN.md");
const theoryMd = fs.existsSync(theoryPath) ? fs.readFileSync(theoryPath, "utf8") : null;
const theoryLede = theoryMd
  ? (theoryMd
      .replace(/<!--[\s\S]*?-->/g, "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !p.startsWith("#") && !p.startsWith("|") && !p.startsWith("-")) ?? null)
  : null;

export const atomic = {
  /** The recommended formulation (PRD §20), quoted rather than paraphrased. */
  formulation:
    "Compound Design explores what happens when the compounding philosophy used in agentic engineering meets a design-system way of thinking about composable parts — and extends the “part” from UI components to reusable design knowledge.",
  /** The document's own opening, when the document exists; otherwise the page says so. */
  lede: theoryLede,
  documentPresent: theoryMd !== null,
  layers: [
    { id: "atomic", name: "Atomic", what: "a single rule, token or check — one thing the work learned and can state in a sentence" },
    { id: "molecular", name: "Molecular", what: "rules that only make sense together — a type scale with its spacing, a focus style with its contrast" },
    { id: "organism", name: "Organism", what: "a resource: a skill or agent that carries a bounded set of rules with a routing contract and an evaluation path" },
    { id: "system", name: "System", what: "resources that route to one another, a registry, a ledger and gates that decide what is kept" },
    { id: "product", name: "Product", what: "the interface a project ships, built with the system and judged against it" },
    { id: "feedback", name: "Feedback", what: "what the product's failures send back down — findings that become rules, and rules that become the next atom" },
  ],
  figure: fs.existsSync(path.join(ROOT, "public/case-study/atomic-ai-design.svg")) ? "/case-study/atomic-ai-design.svg" : null,
  source: { path: "case-study/theory/ATOMIC-AI-DESIGN.md", note: "thesis and six layers; the figure is case-study/theory/atomic-ai-design.svg" } satisfies Source,
};

/* ------------------------------------------------------------------ film */

const FILM = "case-study/compound-design-master.mp4";
const CAPTIONS = "case-study/compound-design-master.vtt";
const COVER = "case-study/compound-design-cover.png";
const filmPresent = fs.existsSync(path.join(ROOT, "public", FILM));
const cover = pngSize(COVER);
const lastMilestone = milestones[milestones.length - 1];
const poster = cover ?? lastMilestone?.desktop ?? null;

export const film = {
  src: `/${FILM}`,
  present: filmPresent,
  /** A captions track is rendered only when the file exists; a player without one fails the accessibility gate, on purpose. */
  captions: fs.existsSync(path.join(ROOT, "public", CAPTIONS)) ? `/${CAPTIONS}` : null,
  poster: poster?.src ?? null,
  posterWidth: poster?.width ?? null,
  posterHeight: poster?.height ?? null,
  posterAlt: cover ? "Cover still of the Compound Design film" : lastMilestone ? `Entry screen of ${lastMilestone.name}` : "",
  fallback: "The master render is delivered as a reviewable artifact; if the file is absent here it has not been published.",
  storyboard: {
    present: fs.existsSync(path.join(ROOT, "case-study/video/STORYBOARD.md")),
    href: `${REPO}/blob/${BRANCH}/case-study/video/STORYBOARD.md`,
    path: "case-study/video/STORYBOARD.md",
  },
  renderer: { path: "case-study/video/package.json", note: "Remotion composition, isolated from the site runtime; rendered locally, never at site build" } satisfies Source,
};

/* ------------------------------------------------------------------ boundary and unknowns */

/** The evidence boundary the case study leaves untouched, in the registry's own terms. */
export const boundary = {
  release: currentState.currentVersion,
  releaseStage: currentState.releaseStage,
  stableBaseline: currentState.stableBaseline,
  cel: currentState.currentCEL,
  runtimeStatus: currentState.runtimeStatus,
  runtimeUplift: currentState.runtimeUplift,
  paidCalls: currentState.paidRuntimeCalls,
  addedPaidCalls: 0,
  rule: "A design score against a frozen rubric is not runtime evidence and never becomes an evidence level.",
  counts: currentState.counts,
  sources: [{ path: "case-study/FREEZE.md", note: "evidence boundary, unchanged by this work; paid experimental runtime 0, and this work adds 0" }, ...currentState.sources] satisfies Source[],
};

export interface KnownUnknown {
  what: string;
  source: Source;
}

/** Limits that were declared before the work, not discovered after it. The chronology's own list is rendered alongside. */
export const knownUnknowns: KnownUnknown[] = [
  {
    what: "The judgment pass is single-rater: the judge is the same agent that built the last four milestones and captured all of them. Anonymisation and randomised order reduce recency bias; they do not make the judgment independent.",
    source: { path: "case-study/design-benchmark/METHODOLOGY.md", note: "§5 judgment checks; limitations" },
  },
  {
    what: "The capture sandbox cannot reach the deployed hosts, Google Fonts or external image hosts. Every screenshot is of the exact commit built locally; fonts served from Google fall back to system fonts, which affects typography fingerprints and any typography judgment where a milestone loaded them that way.",
    source: { path: "case-study/design-benchmark/METHODOLOGY.md", note: "limitations; archive/V01/metadata.json notes" },
  },
  {
    what: "Deterministic items are heuristics with declared thresholds, not proofs of the underlying quality. They are reproducible; that is the whole of their claim.",
    source: { path: "case-study/design-benchmark/rubric/ITEM-CLASSIFICATION.json", note: "principle; declared before scoring" },
  },
];
