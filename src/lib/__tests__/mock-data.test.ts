import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { mockData } from "@/lib/mock-data";
import type {
  GraphNode,
  Edge,
  RemediationEntry,
  MockData,
  AlignmentStatus,
  NodeType,
} from "@/lib/types";

/**
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 *
 * Property 4: Mock data structural integrity
 *
 * For any valid MockData object, all of the following SHALL hold simultaneously:
 * (a) every edge's source and target reference existing node IDs,
 * (b) every remediation entry's nodeId references a node with status "patch-ready",
 * (c) at least one node exists in each of the three alignment status states, and
 * (d) at least 2 requirement nodes and 2 code-file nodes exist.
 */

// --- Arbitraries (generators) for MockData ---

const arbNodeType: fc.Arbitrary<NodeType> = fc.constantFrom(
  "requirement",
  "code-file"
);

const arbAlignmentStatus: fc.Arbitrary<AlignmentStatus> = fc.constantFrom(
  "aligned",
  "drift-detected",
  "patch-ready"
);

const arbGraphNode = (
  id: string,
  type: NodeType,
  status: AlignmentStatus
): fc.Arbitrary<GraphNode> =>
  fc.record({
    id: fc.constant(id),
    label: fc.string({ minLength: 1, maxLength: 255 }),
    type: fc.constant(type),
    status: fc.constant(status),
  });

/**
 * Generate a valid MockData object that satisfies minimum structural constraints:
 * - At least one node per status (aligned, drift-detected, patch-ready)
 * - At least 2 requirement nodes and 2 code-file nodes
 * - All edges reference existing node IDs
 * - All remediations reference patch-ready nodes
 */
const arbMockData: fc.Arbitrary<MockData> = fc
  .tuple(
    // Extra requirement nodes (0-3 additional beyond the 2 mandatory)
    fc.integer({ min: 0, max: 3 }),
    // Extra code-file nodes (0-3 additional beyond the 2 mandatory)
    fc.integer({ min: 0, max: 3 }),
    // Labels for mandatory nodes
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 }),
    fc.string({ minLength: 1, maxLength: 50 })
  )
  .map(
    ([
      extraReqs,
      extraCodes,
      label1,
      label2,
      label3,
      label4,
      label5,
      label6,
    ]) => {
      const nodes: GraphNode[] = [];

      // Mandatory: at least 2 requirement nodes
      // Ensure at least one node per status state
      nodes.push({
        id: "req-1",
        label: label1,
        type: "requirement",
        status: "aligned",
      });
      nodes.push({
        id: "req-2",
        label: label2,
        type: "requirement",
        status: "drift-detected",
      });

      // Mandatory: at least 2 code-file nodes
      // One must be patch-ready for remediation
      nodes.push({
        id: "code-1",
        label: label3,
        type: "code-file",
        status: "aligned",
      });
      nodes.push({
        id: "code-2",
        label: label4,
        type: "code-file",
        status: "patch-ready",
      });

      // Ensure "patch-ready" also appears on requirement side or add extra
      nodes.push({
        id: "req-3",
        label: label5,
        type: "requirement",
        status: "patch-ready",
      });
      nodes.push({
        id: "code-3",
        label: label6,
        type: "code-file",
        status: "drift-detected",
      });

      // Add extra random nodes
      for (let i = 0; i < extraReqs; i++) {
        const statuses: AlignmentStatus[] = [
          "aligned",
          "drift-detected",
          "patch-ready",
        ];
        nodes.push({
          id: `req-extra-${i}`,
          label: `extra-req-${i}`,
          type: "requirement",
          status: statuses[i % 3],
        });
      }
      for (let i = 0; i < extraCodes; i++) {
        const statuses: AlignmentStatus[] = [
          "aligned",
          "drift-detected",
          "patch-ready",
        ];
        nodes.push({
          id: `code-extra-${i}`,
          label: `extra-code-${i}`,
          type: "code-file",
          status: statuses[i % 3],
        });
      }

      // Edges: connect first requirement to first code-file, etc.
      const edges: Edge[] = [
        { source: "req-1", target: "code-1" },
        { source: "req-2", target: "code-2" },
        { source: "req-3", target: "code-3" },
      ];

      // Remediations: reference a patch-ready node
      const patchReadyNodes = nodes.filter((n) => n.status === "patch-ready");
      const remediations: RemediationEntry[] = [
        {
          nodeId: patchReadyNodes[0].id,
          reasoningLog: {
            summary: "Test remediation",
            steps: ["Step 1", "Step 2"],
          },
          diff: "--- a/file.ts\n+++ b/file.ts\n@@ -1,2 +1,3 @@\n line1\n+added\n line2",
        },
      ];

      return { nodes, edges, remediations };
    }
  );

describe("Feature: cognigraph-dashboard, Property 4: Mock data structural integrity", () => {
  describe("Property tests with generated MockData", () => {
    it("all edge sources/targets reference existing node IDs", () => {
      fc.assert(
        fc.property(arbMockData, (data: MockData) => {
          const nodeIds = new Set(data.nodes.map((n) => n.id));
          for (const edge of data.edges) {
            expect(nodeIds.has(edge.source)).toBe(true);
            expect(nodeIds.has(edge.target)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("all remediation nodeId values reference patch-ready nodes", () => {
      fc.assert(
        fc.property(arbMockData, (data: MockData) => {
          const patchReadyIds = new Set(
            data.nodes
              .filter((n) => n.status === "patch-ready")
              .map((n) => n.id)
          );
          for (const remediation of data.remediations) {
            expect(patchReadyIds.has(remediation.nodeId)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("at least one node exists per status state (aligned, drift-detected, patch-ready)", () => {
      fc.assert(
        fc.property(arbMockData, (data: MockData) => {
          const statuses = new Set(data.nodes.map((n) => n.status));
          expect(statuses.has("aligned")).toBe(true);
          expect(statuses.has("drift-detected")).toBe(true);
          expect(statuses.has("patch-ready")).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it("minimum node counts: at least 2 requirement and 2 code-file nodes", () => {
      fc.assert(
        fc.property(arbMockData, (data: MockData) => {
          const reqNodes = data.nodes.filter((n) => n.type === "requirement");
          const codeNodes = data.nodes.filter((n) => n.type === "code-file");
          expect(reqNodes.length).toBeGreaterThanOrEqual(2);
          expect(codeNodes.length).toBeGreaterThanOrEqual(2);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Direct assertions on actual mockData", () => {
    it("all edge sources reference existing node IDs", () => {
      const nodeIds = new Set(mockData.nodes.map((n) => n.id));
      for (const edge of mockData.edges) {
        expect(nodeIds.has(edge.source)).toBe(true);
      }
    });

    it("all edge targets reference existing node IDs", () => {
      const nodeIds = new Set(mockData.nodes.map((n) => n.id));
      for (const edge of mockData.edges) {
        expect(nodeIds.has(edge.target)).toBe(true);
      }
    });

    it("all remediation nodeId values reference nodes with status patch-ready", () => {
      const patchReadyIds = new Set(
        mockData.nodes
          .filter((n) => n.status === "patch-ready")
          .map((n) => n.id)
      );
      for (const remediation of mockData.remediations) {
        expect(patchReadyIds.has(remediation.nodeId)).toBe(true);
      }
    });

    it("at least one node exists per alignment status state", () => {
      const statuses = new Set(mockData.nodes.map((n) => n.status));
      expect(statuses.has("aligned")).toBe(true);
      expect(statuses.has("drift-detected")).toBe(true);
      expect(statuses.has("patch-ready")).toBe(true);
    });

    it("contains at least 2 requirement nodes", () => {
      const reqNodes = mockData.nodes.filter((n) => n.type === "requirement");
      expect(reqNodes.length).toBeGreaterThanOrEqual(2);
    });

    it("contains at least 2 code-file nodes", () => {
      const codeNodes = mockData.nodes.filter((n) => n.type === "code-file");
      expect(codeNodes.length).toBeGreaterThanOrEqual(2);
    });

    it("contains at least 3 nodes total", () => {
      expect(mockData.nodes.length).toBeGreaterThanOrEqual(3);
    });

    it("contains at least 1 edge", () => {
      expect(mockData.edges.length).toBeGreaterThanOrEqual(1);
    });

    it("contains at least 1 remediation entry", () => {
      expect(mockData.remediations.length).toBeGreaterThanOrEqual(1);
    });
  });
});
