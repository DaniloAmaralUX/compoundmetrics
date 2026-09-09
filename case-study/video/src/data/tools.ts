// Re-exports of src/data/json/tools.json (copy of case-study/history/TOOLS-MANIFEST.json).
// No number in this file describes the data; everything is read from the JSON.
import raw from "./json/tools.json";

export type Tool = {
  id: string;
  name: string;
  confidence: string;
  privacy: string;
  captured: string;
  first_known_date: string | null;
};

export const tools = raw as unknown as {
  generated_at: string;
  stated_count_in_brief: number;
  tool_candidates: number;
  verified_by_repository: number;
  reconciliation: string;
  tools: Tool[];
};

export const statedCount = tools.stated_count_in_brief;
export const toolCandidates = tools.tool_candidates;
export const verifiedByRepository = tools.verified_by_repository;
/** L.tools.caption — every character comes from the manifest fields. */
export const toolsCaption = `candidates ${tools.tool_candidates} · verified ${tools.verified_by_repository}`;
export const toolList: Tool[] = tools.tools;
export const toolById = (id: string): Tool | undefined => toolList.find((t) => t.id === id);
