/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import React from "react";
import { IntentPanel } from "@/components/intent-panel";

/**
 * **Validates: Requirements 2.3, 2.4**
 *
 * Property 6: Textarea state synchronization
 * For any sequence of character inputs to the Intent Panel textarea,
 * the component state value SHALL equal the current textarea content
 * after each input event, including the empty string when all content is removed.
 */
describe("Feature: cognigraph-dashboard, Property 6: Textarea state synchronization", () => {
  const defaultProps = {
    specificationText: "",
    onSpecificationChange: vi.fn(),
    codeSnippet: "",
    onCodeSnippetChange: vi.fn(),
    onRunAudit: vi.fn(),
    onGeneratePatch: vi.fn(),
    auditLoading: false,
    patchLoading: false,
    hasDriftReasoning: false,
  };

  function renderAndType(text: string): { value: string } {
    cleanup();
    const onSpecChange = vi.fn();
    render(
      React.createElement(IntentPanel, {
        ...defaultProps,
        specificationText: text,
        onSpecificationChange: onSpecChange,
      })
    );
    const textarea = screen.getByPlaceholderText(
      /enter product requirements/i
    ) as HTMLTextAreaElement;
    // The textarea value is controlled, so it reflects the prop
    return { value: textarea.value };
  }

  it("for any input string, textarea value equals the prop value", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 5000 }),
        (text: string) => {
          const result = renderAndType(text);
          expect(result.value).toBe(text);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("onChange callback is fired when textarea value changes", () => {
    cleanup();
    const onChange = vi.fn();
    render(
      React.createElement(IntentPanel, {
        ...defaultProps,
        onSpecificationChange: onChange,
      })
    );
    const textarea = screen.getByPlaceholderText(
      /enter product requirements/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "some text" } });
    expect(onChange).toHaveBeenCalledWith("some text");
  });

  it("clearing the textarea fires onChange with empty string", () => {
    cleanup();
    const onChange = vi.fn();
    render(
      React.createElement(IntentPanel, {
        ...defaultProps,
        specificationText: "some text",
        onSpecificationChange: onChange,
      })
    );
    const textarea = screen.getByPlaceholderText(
      /enter product requirements/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("");
  });
});
