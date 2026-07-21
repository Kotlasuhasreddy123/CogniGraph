"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { RemediationEntry } from "@/lib/types";

interface RemediationPanelProps {
  remediations: RemediationEntry[];
}

/**
 * Classifies a diff line as addition, deletion, or context.
 * Exported for testability.
 */
export function classifyDiffLine(
  line: string
): "addition" | "deletion" | "context" {
  if (line.startsWith("+") && !line.startsWith("+++")) {
    return "addition";
  }
  if (line.startsWith("-") && !line.startsWith("---")) {
    return "deletion";
  }
  return "context";
}

/**
 * Returns the background class for a diff line based on its classification.
 */
export function getDiffLineClass(
  classification: "addition" | "deletion" | "context"
): string {
  switch (classification) {
    case "addition":
      return "bg-emerald-900/30";
    case "deletion":
      return "bg-rose-900/30";
    case "context":
      return "";
  }
}

/**
 * Attempts to format the reasoning log as pretty-printed JSON.
 * Returns null if formatting fails.
 */
function formatReasoningLog(reasoningLog: unknown): string | null {
  try {
    return JSON.stringify(reasoningLog, null, 2);
  } catch {
    return null;
  }
}

export function RemediationPanel({ remediations }: RemediationPanelProps) {
  if (remediations.length === 0) {
    return (
      <section className="h-full overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Codex Remediation Engine
        </h2>
        <p className="text-slate-400 text-sm">No active remediations</p>
      </section>
    );
  }

  return (
    <section className="h-full overflow-y-auto p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Codex Remediation Engine
      </h2>
      <div className="space-y-6">
        {remediations.map((entry, index) => {
          const formattedLog = formatReasoningLog(entry.reasoningLog);
          const diffLines = entry.diff.split("\n");

          return (
            <Card
              key={`${entry.nodeId}-${index}`}
              className="bg-slate-900 border-slate-700 p-4 space-y-4"
            >
              {/* Reasoning Log */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Reasoning Log
                </h3>
                {formattedLog ? (
                  <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto">
                    <code className="text-slate-300">
                      {formattedLog.split("\n").map((line, i) => {
                        // Simple syntax highlighting for JSON
                        const highlighted = line
                          .replace(
                            /"([^"]+)":/g,
                            '<span class="text-blue-400">"$1"</span>:'
                          )
                          .replace(
                            /: "([^"]+)"/g,
                            ': <span class="text-emerald-400">"$1"</span>'
                          );
                        return (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: highlighted + "\n",
                            }}
                          />
                        );
                      })}
                    </code>
                  </pre>
                ) : (
                  <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto text-slate-300">
                    {String(entry.reasoningLog)}
                  </pre>
                )}
              </div>

              {/* Unified Diff */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Unified Diff
                </h3>
                <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto font-mono">
                  {diffLines.map((line, i) => {
                    const classification = classifyDiffLine(line);
                    const bgClass = getDiffLineClass(classification);
                    return (
                      <div
                        key={i}
                        className={`${bgClass} px-1`}
                        data-diff-type={classification}
                      >
                        <span className="text-slate-300">{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
