"use client";

import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface IntentPanelProps {
  specificationText: string;
  onSpecificationChange: (value: string) => void;
  codeSnippet: string;
  onCodeSnippetChange: (value: string) => void;
  onRunAudit: () => void;
  onGeneratePatch: () => void;
  auditLoading: boolean;
  patchLoading: boolean;
}

export function IntentPanel({
  specificationText,
  onSpecificationChange,
  codeSnippet,
  onCodeSnippetChange,
  onRunAudit,
  onGeneratePatch,
  auditLoading,
  patchLoading,
}: IntentPanelProps) {
  return (
    <section className="h-full overflow-y-auto p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Intent Specification Input
      </h2>

      {/* Specification / Requirements */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1 block">
          Specification / Requirements
        </label>
        <Textarea
          value={specificationText}
          onChange={(e) => onSpecificationChange(e.target.value)}
          maxLength={5000}
          placeholder="Enter product requirements, user stories, or feature descriptions..."
          className="bg-slate-900 text-slate-100 min-h-[140px] resize-y"
        />
      </div>

      {/* Code Snippet */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1 block">
          Code Snippet
        </label>
        <Textarea
          value={codeSnippet}
          onChange={(e) => onCodeSnippetChange(e.target.value)}
          maxLength={10000}
          placeholder="Paste the code to analyze for alignment..."
          className="bg-slate-900 text-slate-100 min-h-[140px] resize-y font-mono text-xs"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={onRunAudit}
          disabled={auditLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium transition-colors"
        >
          {auditLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run Audit"
          )}
        </button>

        <button
          onClick={onGeneratePatch}
          disabled={patchLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium transition-colors"
        >
          {patchLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Patch...
            </>
          ) : (
            "Trigger Auto-Remediation"
          )}
        </button>
      </div>
    </section>
  );
}
