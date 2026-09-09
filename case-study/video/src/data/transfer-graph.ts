// Re-exports of src/data/json/transfer-graph.json (copy of case-study/knowledge/TRANSFER-GRAPH.json).
import raw from "./json/transfer-graph.json";

export type GraphNode = { id: string; type: string; label: string; tool_id?: string };
export type GraphEdge = { id: string; from: string; to: string; type: string; verified: boolean; note?: string };
export type Chain = { name: string; edges: string[]; fully_verified: boolean; note?: string };

export const transferGraph = raw as unknown as {
  generated_at: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  end_to_end_chains: Chain[];
  counts: { nodes: number; edges: number; verified_edges: number; unverified_edges: number };
};

export const nodes: GraphNode[] = transferGraph.nodes;
/** Hard filter (STORYBOARD §0 rule 4): unverified edges do not exist for the film. */
export const verifiedEdges: GraphEdge[] = transferGraph.edges.filter((e) => e.verified === true);
export const nodeById = (id: string): GraphNode => {
  const n = nodes.find((x) => x.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
};
export const edgeById = (id: string): GraphEdge => {
  const e = verifiedEdges.find((x) => x.id === id);
  if (!e) throw new Error(`unknown or unverified edge ${id}`);
  return e;
};
export const nodeLabel = (id: string): string => nodeById(id).label;
export const edgeType = (id: string): string => edgeById(id).type;
export const nodesOfType = (type: string): GraphNode[] => nodes.filter((n) => n.type === type);
/** L.node.type.count[type] for every type present, in first-seen order. */
export const nodeTypeCounts = (): { type: string; count: number }[] => {
  const order: string[] = [];
  const counts: Record<string, number> = {};
  for (const n of nodes) {
    if (!(n.type in counts)) {
      counts[n.type] = 0;
      order.push(n.type);
    }
    counts[n.type] += 1;
  }
  return order.map((type) => ({ type, count: counts[type] }));
};
export const chain = (i: number): Chain => transferGraph.end_to_end_chains[i];
/** L.graph.counts */
export const graphCountsLabel = `edges verified ${transferGraph.counts.verified_edges} of ${transferGraph.counts.edges}`;

/** Resolve storyboard selectors (edge id, "E80-*", "type:created", "*all-verified") to verified edges. */
export const resolveEdgeSelector = (sel: string): GraphEdge[] => {
  if (sel === "*all-verified" || sel.startsWith("*all-verified")) return verifiedEdges;
  if (sel.startsWith("type:")) return verifiedEdges.filter((e) => e.type === sel.slice("type:".length));
  if (sel.endsWith("*")) {
    const prefix = sel.slice(0, -1);
    return verifiedEdges.filter((e) => e.id.startsWith(prefix));
  }
  return verifiedEdges.filter((e) => e.id === sel);
};
