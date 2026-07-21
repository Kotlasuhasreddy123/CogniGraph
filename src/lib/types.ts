export type NodeType = "requirement" | "code-file";

export type AlignmentStatus = "aligned" | "drift-detected" | "patch-ready";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  status: AlignmentStatus;
}

export interface Edge {
  source: string; // GraphNode.id of a requirement node
  target: string; // GraphNode.id of a code-file node
}

export interface ReasoningLog {
  summary: string;
  steps: string[];
}

export interface RemediationEntry {
  nodeId: string; // Must reference a GraphNode with status "patch-ready"
  reasoningLog: ReasoningLog;
  diff: string; // Unified diff format
}

export interface MockData {
  nodes: GraphNode[];
  edges: Edge[];
  remediations: RemediationEntry[];
}
