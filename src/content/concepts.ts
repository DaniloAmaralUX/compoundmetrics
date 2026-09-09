import { foundationsAndEvidence } from "./concepts-foundations";
import { learningAndBenchmark } from "./concepts-benchmark";
import { harnessMeasurementTooling } from "./concepts-harness";
import type { Concept, ConceptGroup } from "./types";

export const conceptGroups: Array<{ id: ConceptGroup; name: string; lede: string }> = [
  { id: "foundations", name: "Foundations", lede: "The words the rest depend on." },
  { id: "evidence", name: "Evidence", lede: "How the project tells built from proven." },
  { id: "learning", name: "Learning", lede: "How a lesson survives the project it was learned in." },
  { id: "benchmark", name: "The experiment", lede: "How the framework would find out whether it is wrong." },
  { id: "harness", name: "The harness", lede: "The machinery that runs the experiment honestly." },
  { id: "measurement", name: "Measurement", lede: "How results are read without being oversold." },
  { id: "tooling", name: "Tooling", lede: "The tools, pinned, and the locks around them." },
];

export const concepts: Concept[] = [...foundationsAndEvidence, ...learningAndBenchmark, ...harnessMeasurementTooling];

{
  const seen = new Set<string>();
  for (const c of concepts) {
    if (seen.has(c.id)) throw new Error(`concepts: duplicate id ${c.id}`);
    seen.add(c.id);
  }
  for (const c of concepts) for (const r of c.related) if (!seen.has(r)) throw new Error(`concepts: ${c.id} relates to unknown ${r}`);
}

export const conceptById = (id: string) => concepts.find((c) => c.id === id);

export const conceptsInGroup = (group: ConceptGroup) => concepts.filter((c) => c.group === group);

/** Curated starting points shown before any query is typed. */
export const startingPoints = ["cel", "cdqi", "holdout", "blinding", "durable-learning", "runtime-uplift"];

/**
 * A compact, deterministic search index shipped to the client. Fields are pre-normalised so the
 * browser does no work beyond tokenising the query. No network, no model.
 */
export interface SearchEntry {
  id: string;
  title: string;
  group: ConceptGroup;
  oneSentence: string;
  /** Normalised tokens from title, aliases and queries, weighted by field. */
  strong: string[];
  weak: string[];
}

export function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

const STOP = new Set([
  "the", "a", "an", "of", "to", "is", "it", "in", "on", "and", "or", "for", "how", "what", "do", "does", "you", "i", "we", "this", "that", "with", "by", "be", "can", "are", "was", "at", "as", "from", "my", "your", "me",
  "o", "a", "os", "as", "um", "uma", "de", "do", "da", "dos", "das", "que", "e", "ou", "para", "por", "com", "em", "no", "na", "nos", "nas", "se", "isso", "esse", "essa", "este", "esta", "como", "qual", "quais", "ao", "aos", "meu", "minha", "foi", "ser", "ter",
]);

export const searchIndex: SearchEntry[] = concepts.map((c) => ({
  id: c.id,
  title: c.title,
  group: c.group,
  oneSentence: c.oneSentence,
  strong: Array.from(new Set([...normalise(c.title), ...c.aliases.flatMap(normalise), ...c.queries.flatMap(normalise)])),
  weak: Array.from(new Set([...normalise(c.oneSentence), ...normalise(c.plain), ...c.related.flatMap(normalise)])),
}));

export function search(query: string, index: SearchEntry[] = searchIndex, limit = 8): Array<{ entry: SearchEntry; score: number }> {
  const tokens = normalise(query);
  if (tokens.length === 0) return [];
  const scored = index
    .map((entry) => {
      let score = 0;
      for (const t of tokens) {
        if (entry.strong.includes(t)) score += 3;
        else if (entry.strong.some((s) => s.startsWith(t) && t.length >= 3)) score += 2;
        else if (entry.weak.includes(t)) score += 1;
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return scored.slice(0, limit);
}
