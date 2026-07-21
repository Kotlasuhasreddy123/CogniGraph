import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeBorderClass,
} from "@/components/graph-node";
import { getEdgeStrokeColor } from "@/components/decision-graph";
import type { AlignmentStatus, NodeType } from "@/lib/types";

/**
 * Property 1: Status-to-color mapping is total and correct
 * Validates: Requirements 3.5, 3.6, 3.7
 *
 * For every valid AlignmentStatus value, the mapping SHALL produce:
 * - aligned → emerald-500
 * - drift-detected → rose-500
 * - patch-ready → amber-500
 */
describe("Feature: cognigraph-dashboard, Property 1: Status-to-color mapping is total and correct", () => {
  const allStatuses: AlignmentStatus[] = ["aligned", "drift-detected", "patch-ready"];

  const arbStatus: fc.Arbitrary<AlignmentStatus> = fc.constantFrom(...allStatuses);

  it("getStatusColor always returns a non-empty string for any valid status", () => {
    fc.assert(
      fc.property(arbStatus, (status) => {
        const color = getStatusColor(status);
        expect(color).toBeTruthy();
        expect(typeof color).toBe("string");
        expect(color.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("aligned maps to emerald-500", () => {
    const color = getStatusColor("aligned");
    expect(color).toContain("emerald-500");
  });

  it("drift-detected maps to rose-500", () => {
    const color = getStatusColor("drift-detected");
    expect(color).toContain("rose-500");
  });

  it("patch-ready maps to amber-500", () => {
    const color = getStatusColor("patch-ready");
    expect(color).toContain("amber-500");
  });

  it("each status maps to a unique color class", () => {
    fc.assert(
      fc.property(
        arbStatus,
        arbStatus,
        (status1, status2) => {
          if (status1 !== status2) {
            expect(getStatusColor(status1)).not.toBe(getStatusColor(status2));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("getEdgeStrokeColor maps aligned → #10b981 (emerald-500)", () => {
    expect(getEdgeStrokeColor("aligned")).toBe("#10b981");
  });

  it("getEdgeStrokeColor maps drift-detected → #f43f5e (rose-500)", () => {
    expect(getEdgeStrokeColor("drift-detected")).toBe("#f43f5e");
  });

  it("getEdgeStrokeColor maps patch-ready → #f59e0b (amber-500)", () => {
    expect(getEdgeStrokeColor("patch-ready")).toBe("#f59e0b");
  });

  it("getEdgeStrokeColor always returns a valid hex color for any status", () => {
    fc.assert(
      fc.property(arbStatus, (status) => {
        const color = getEdgeStrokeColor(status);
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Node type produces distinct visual representation
 * Validates: Requirements 3.3, 3.10, 7.6
 *
 * Different node types SHALL always produce different icon/style combinations.
 */
describe("Feature: cognigraph-dashboard, Property 2: Node type produces distinct visual representation", () => {
  const allTypes: NodeType[] = ["requirement", "code-file"];

  const arbType: fc.Arbitrary<NodeType> = fc.constantFrom(...allTypes);

  it("different types produce different icon components", () => {
    fc.assert(
      fc.property(arbType, arbType, (type1, type2) => {
        if (type1 !== type2) {
          expect(getTypeIcon(type1)).not.toBe(getTypeIcon(type2));
        }
      }),
      { numRuns: 100 }
    );
  });

  it("different types produce different border classes", () => {
    fc.assert(
      fc.property(arbType, arbType, (type1, type2) => {
        if (type1 !== type2) {
          expect(getTypeBorderClass(type1)).not.toBe(getTypeBorderClass(type2));
        }
      }),
      { numRuns: 100 }
    );
  });

  it("requirement type uses ListChecks icon", () => {
    const Icon = getTypeIcon("requirement");
    expect(Icon.displayName || Icon.name).toContain("ListChecks");
  });

  it("code-file type uses FileCode icon", () => {
    const Icon = getTypeIcon("code-file");
    expect(Icon.displayName || Icon.name).toContain("FileCode");
  });

  it("requirement type has emerald border accent", () => {
    expect(getTypeBorderClass("requirement")).toContain("emerald");
  });

  it("code-file type has blue border accent", () => {
    expect(getTypeBorderClass("code-file")).toContain("blue");
  });

  it("getTypeIcon always returns a valid React component for any valid type", () => {
    fc.assert(
      fc.property(arbType, (type) => {
        const Icon = getTypeIcon(type);
        // Lucide icons are forwardRef objects, so check for render function or function type
        expect(typeof Icon === "function" || typeof Icon === "object").toBe(true);
        expect(Icon).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  it("getTypeBorderClass always returns a non-empty string containing border-l-4", () => {
    fc.assert(
      fc.property(arbType, (type) => {
        const cls = getTypeBorderClass(type);
        expect(cls).toContain("border-l-4");
      }),
      { numRuns: 100 }
    );
  });
});
