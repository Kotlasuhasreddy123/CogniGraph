# Implementation Plan: CogniGraph Intent-Alignment Dashboard

## Overview

A 5-step sequential build of the static CogniGraph dashboard UI using Next.js 14 (App Router), Tailwind CSS, shadcn/ui, and Lucide icons. Each step builds on the previous one, progressing from project scaffolding through mock data creation to full three-panel layout with graph visualization and remediation rendering. No external backend dependencies are required at any step.

## Tasks

- [x] 1. Project scaffolding and setup
  - [x] 1.1 Initialize Next.js 14 project with App Router, Tailwind CSS, and TypeScript
    - Run `create-next-app` with TypeScript and Tailwind enabled (App Router mode)
    - Configure `tailwind.config.ts` to include the slate, emerald, rose, and amber color palettes
    - Set up `globals.css` with Tailwind directives and dark-mode CSS variables
    - _Requirements: 6.1, 6.2_
  - [x] 1.2 Install and configure shadcn/ui and Lucide icons
    - Initialize shadcn/ui with the dark theme preset
    - Install required shadcn/ui components: Card, Badge, Textarea
    - Install `lucide-react` for iconography
    - _Requirements: 6.3, 6.4_
  - [x] 1.3 Create root layout and empty dashboard page shell
    - Create `src/app/layout.tsx` with dark theme body classes (`bg-slate-950 text-slate-100`), font setup, and metadata
    - Create `src/app/page.tsx` as a client component with a full-viewport CSS Grid container (`h-screen w-screen grid grid-cols-[25%_50%_25%]`)
    - Render three placeholder `<section>` elements for each panel to verify layout
    - _Requirements: 1.1, 1.2, 1.3, 7.1_

- [x] 2. Mock data types and static data file creation
  - [x] 2.1 Define TypeScript interfaces in `src/lib/types.ts`
    - Create types: `NodeType`, `AlignmentStatus`, `GraphNode`, `Edge`, `ReasoningLog`, `RemediationEntry`, `MockData`
    - Ensure `GraphNode` has `id`, `label`, `type`, and `status` fields
    - Ensure `Edge` has `source` and `target` fields referencing node IDs
    - Ensure `RemediationEntry` has `nodeId`, `reasoningLog`, and `diff` fields
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 2.2 Create static mock data file at `src/lib/mock-data.ts`
    - Export a `mockData` constant conforming to the `MockData` interface
    - Include at least 3 requirement nodes and 3 code-file nodes
    - Include at least one node per alignment status (aligned, drift-detected, patch-ready)
    - Include at least 3 edges (one per requirement node linking to a code-file node)
    - Include at least 1 remediation entry referencing a patch-ready node with a reasoning log and unified diff string
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.6_
  - [x] 2.3 Write property test for mock data structural integrity
    - **Property 4: Mock data structural integrity**
    - Verify all edge sources/targets reference existing node IDs
    - Verify all remediation `nodeId` values reference patch-ready nodes
    - Verify at least one node exists per status state and minimum node counts
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 3. Three-panel layout with Intent Panel implementation
  - [x] 3.1 Create the `IntentPanel` component at `src/components/intent-panel.tsx`
    - Implement as a client component with `useState<string>("")` for textarea content
    - Render heading "Intent Specification Input" with appropriate typography classes
    - Render a shadcn/ui `Textarea` with `maxLength={5000}`, `bg-slate-900`, `text-slate-100`, and placeholder text describing expected input (e.g., "Enter product requirements, user stories, or feature descriptions...")
    - Update state on every `onChange` event; clearing the textarea sets state to empty string
    - Enable `overflow-y-auto` for panel-level scrolling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.2_
  - [x] 3.2 Wire IntentPanel into the dashboard page
    - Import and render `IntentPanel` in the first grid column of `src/app/page.tsx`
    - Apply panel border styling (`border-r border-slate-700`) and padding
    - _Requirements: 1.1, 1.6_
  - [x] 3.3 Write property test for textarea state synchronization
    - **Property 6: Textarea state synchronization**
    - Verify that for any sequence of character inputs, component state equals current textarea content
    - **Validates: Requirements 2.3, 2.4**

- [x] 4. Decision Graph panel with graph nodes and connecting edges
  - [x] 4.1 Create the `GraphNode` component at `src/components/graph-node.tsx`
    - Accept props: `id`, `label`, `type` (requirement | code-file), `status` (aligned | drift-detected | patch-ready)
    - Render a shadcn/ui `Card` with the node label text
    - Display Lucide icon by type: `ListChecks` for requirement, `FileCode` for code-file, `CircleDot` as fallback for unknown types
    - Render a shadcn/ui `Badge` with status-driven color: emerald-500 for aligned, rose-500 for drift-detected, amber-500 for patch-ready
    - Apply distinct visual styles per node type (e.g., different border accent colors)
    - _Requirements: 3.2, 3.3, 3.5, 3.6, 3.7, 3.10, 7.5, 7.6, 7.7_
  - [x] 4.2 Create the `DecisionGraph` component at `src/components/decision-graph.tsx`
    - Accept props: `nodes: GraphNode[]`, `edges: Edge[]`
    - Render heading "Live Decision Graph"
    - Layout requirement nodes in a left column and code-file nodes in a right column (bipartite arrangement)
    - Render an SVG overlay (`position: absolute; inset: 0; pointer-events: none`) for connecting edges
    - Use `useRef` for each node and `useEffect` + `ResizeObserver` to compute edge coordinates
    - Draw cubic bezier `<path>` elements between connected nodes with status-colored strokes (emerald-500, rose-500, amber-500)
    - Display empty-state message "No graph data available" when nodes array is empty
    - _Requirements: 3.1, 3.2, 3.4, 3.8, 3.9, 7.3_
  - [x] 4.3 Wire DecisionGraph into the dashboard page
    - Import mock data and pass `mockData.nodes` and `mockData.edges` to `DecisionGraph` in the center grid column
    - Apply panel border styling and padding
    - _Requirements: 1.1, 1.6_
  - [x] 4.4 Write property test for status-to-color mapping
    - **Property 1: Status-to-color mapping is total and correct**
    - Verify aligned → emerald-500, drift-detected → rose-500, patch-ready → amber-500 for all valid status values
    - **Validates: Requirements 3.5, 3.6, 3.7**
  - [x] 4.5 Write property test for node type visual representation
    - **Property 2: Node type produces distinct visual representation**
    - Verify different types always produce different icon/style combinations
    - **Validates: Requirements 3.3, 3.10, 7.6**
  - [x] 4.6 Write property test for edge rendering completeness
    - **Property 5: Edge rendering completeness**
    - Verify rendered connector count equals edge data count
    - **Validates: Requirements 3.4**

- [x] 5. Remediation Panel with JSON log and diff rendering
  - [x] 5.1 Create the `RemediationPanel` component at `src/components/remediation-panel.tsx`
    - Accept props: `remediations: RemediationEntry[]`
    - Render heading "Codex Remediation Engine"
    - For each remediation entry, render two visually distinct sections:
      - **Reasoning Log:** Format as JSON in a `<pre><code>` block with syntax-appropriate styling (keys, strings, numbers distinguishable)
      - **Unified Diff:** Render line-by-line with `bg-emerald-900/30` for additions (`+`), `bg-rose-900/30` for deletions (`-`), no highlight for context lines
    - Display placeholder message "No active remediations" when remediations array is empty
    - If JSON formatting fails for reasoning log, render raw text in unstyled `<pre>` block
    - Enable `overflow-y-auto` for panel-level scrolling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.4_
  - [x] 5.2 Wire RemediationPanel into the dashboard page
    - Import and pass `mockData.remediations` to `RemediationPanel` in the right grid column
    - Apply panel border styling and padding
    - Verify all three panels render simultaneously without page-level scrolling
    - _Requirements: 1.1, 1.6, 1.7_
  - [x] 5.3 Write property test for diff line classification
    - **Property 3: Diff line classification is consistent**
    - Verify addition/deletion/context classification is deterministic and maps to correct highlight colors
    - **Validates: Requirements 4.3**
  - [x] 5.4 Final checkpoint
    - Ensure all tests pass, ask the user if questions arise.
    - Verify the full dashboard renders with all three panels populated from mock data
    - Confirm dark-mode aesthetic, color system, and responsive panel scrolling

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- No external backend or API dependencies are required at any step — all data is static mock data
- The implementation language is TypeScript throughout (as specified in the design document)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["2.1"] },
    { "id": 4, "tasks": ["2.2"] },
    { "id": 5, "tasks": ["2.3", "3.1"] },
    { "id": 6, "tasks": ["3.2", "3.3"] },
    { "id": 7, "tasks": ["4.1"] },
    { "id": 8, "tasks": ["4.2"] },
    { "id": 9, "tasks": ["4.3", "4.4", "4.5"] },
    { "id": 10, "tasks": ["4.6", "5.1"] },
    { "id": 11, "tasks": ["5.2", "5.3"] },
    { "id": 12, "tasks": ["5.4"] }
  ]
}
```
