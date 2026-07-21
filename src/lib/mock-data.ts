import { MockData } from "./types";

export const mockData: MockData = {
  nodes: [
    { id: "req-1", label: "User authentication flow", type: "requirement", status: "aligned" },
    { id: "req-2", label: "Payment processing logic", type: "requirement", status: "drift-detected" },
    { id: "req-3", label: "Data export pipeline", type: "requirement", status: "patch-ready" },
    { id: "code-1", label: "auth/middleware.ts", type: "code-file", status: "aligned" },
    { id: "code-2", label: "payments/stripe.ts", type: "code-file", status: "drift-detected" },
    { id: "code-3", label: "export/csv-builder.ts", type: "code-file", status: "patch-ready" },
  ],
  edges: [
    { source: "req-1", target: "code-1" },
    { source: "req-2", target: "code-2" },
    { source: "req-3", target: "code-3" },
  ],
  remediations: [
    {
      nodeId: "code-3",
      reasoningLog: {
        summary: "Export function missing header row generation",
        steps: [
          "Detected missing CSV header generation in csv-builder.ts",
          "Requirement specifies column headers must match schema fields",
          "Generated patch to add header row before data rows",
        ],
      },
      diff: `--- a/export/csv-builder.ts\n+++ b/export/csv-builder.ts\n@@ -12,6 +12,8 @@\n export function buildCSV(data: Record<string, unknown>[]) {\n   const rows: string[] = [];\n+  const headers = Object.keys(data[0] ?? {});\n+  rows.push(headers.join(","));\n   for (const record of data) {\n     rows.push(Object.values(record).join(","));\n   }`,
    },
  ],
};
