import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  classifyDiffLine,
  getDiffLineClass,
} from "@/components/remediation-panel";

/**
 * Property 3: Diff line classification is consistent
 * Validates: Requirements 4.3
 *
 * For any line of text in a unified diff:
 * - Lines starting with "+" (but not "+++") SHALL be classified as "addition"
 * - Lines starting with "-" (but not "---") SHALL be classified as "deletion"
 * - All other lines SHALL be classified as "context"
 *
 * Each classification SHALL deterministically map to the correct highlight color:
 * - addition → bg-emerald-900/30
 * - deletion → bg-rose-900/30
 * - context → "" (no highlight)
 */
describe("Feature: cognigraph-dashboard, Property 3: Diff line classification is consistent", () => {
  // Arbitrary for lines that start with "+" (additions)
  const arbAdditionLine = fc
    .string({ minLength: 0, maxLength: 200 })
    .map((rest) => `+${rest}`)
    .filter((line) => !line.startsWith("+++"));

  // Arbitrary for lines that start with "-" (deletions)
  const arbDeletionLine = fc
    .string({ minLength: 0, maxLength: 200 })
    .map((rest) => `-${rest}`)
    .filter((line) => !line.startsWith("---"));

  // Arbitrary for context lines (not starting with + or -)
  const arbContextLine = fc
    .string({ minLength: 0, maxLength: 200 })
    .filter((line) => !line.startsWith("+") && !line.startsWith("-"));

  // Arbitrary for the special header lines (+++ and ---)
  const arbPlusPlusPlus = fc
    .string({ minLength: 0, maxLength: 100 })
    .map((rest) => `+++${rest}`);

  const arbMinusMinusMinus = fc
    .string({ minLength: 0, maxLength: 100 })
    .map((rest) => `---${rest}`);

  it("lines starting with + (not +++) are classified as addition", () => {
    fc.assert(
      fc.property(arbAdditionLine, (line) => {
        expect(classifyDiffLine(line)).toBe("addition");
      }),
      { numRuns: 100 }
    );
  });

  it("lines starting with - (not ---) are classified as deletion", () => {
    fc.assert(
      fc.property(arbDeletionLine, (line) => {
        expect(classifyDiffLine(line)).toBe("deletion");
      }),
      { numRuns: 100 }
    );
  });

  it("lines not starting with + or - are classified as context", () => {
    fc.assert(
      fc.property(arbContextLine, (line) => {
        expect(classifyDiffLine(line)).toBe("context");
      }),
      { numRuns: 100 }
    );
  });

  it("+++ header lines are classified as context (not addition)", () => {
    fc.assert(
      fc.property(arbPlusPlusPlus, (line) => {
        expect(classifyDiffLine(line)).toBe("context");
      }),
      { numRuns: 100 }
    );
  });

  it("--- header lines are classified as context (not deletion)", () => {
    fc.assert(
      fc.property(arbMinusMinusMinus, (line) => {
        expect(classifyDiffLine(line)).toBe("context");
      }),
      { numRuns: 100 }
    );
  });

  it("addition classification maps to bg-emerald-900/30", () => {
    expect(getDiffLineClass("addition")).toBe("bg-emerald-900/30");
  });

  it("deletion classification maps to bg-rose-900/30", () => {
    expect(getDiffLineClass("deletion")).toBe("bg-rose-900/30");
  });

  it("context classification maps to empty string (no highlight)", () => {
    expect(getDiffLineClass("context")).toBe("");
  });

  it("classification is deterministic - same input always produces same output", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 200 }), (line) => {
        const result1 = classifyDiffLine(line);
        const result2 = classifyDiffLine(line);
        expect(result1).toBe(result2);

        const color1 = getDiffLineClass(result1);
        const color2 = getDiffLineClass(result2);
        expect(color1).toBe(color2);
      }),
      { numRuns: 100 }
    );
  });

  it("classification result is always one of the three valid values", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 500 }), (line) => {
        const result = classifyDiffLine(line);
        expect(["addition", "deletion", "context"]).toContain(result);
      }),
      { numRuns: 100 }
    );
  });
});
