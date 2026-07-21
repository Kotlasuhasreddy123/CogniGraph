# Requirements Document

## Introduction

CogniGraph is an intent-alignment dashboard for AI developer teams. It provides a single-screen interface with three panels that allow teams to specify product intent, visualize the alignment state between requirements and code files via a live decision graph, and review remediation reasoning and diffs. The initial implementation is a static UI consuming mock data, built with Next.js 14 (App Router), Tailwind CSS, shadcn/ui components, and Lucide icons.

## Glossary

- **Dashboard**: The single-page application screen containing all three panels
- **Intent_Panel**: The left panel where users input product requirements as plain text
- **Decision_Graph**: The center panel displaying a node-based visual layout of requirement-to-code-file relationships
- **Remediation_Panel**: The right panel displaying JSON reasoning logs and unified git diffs
- **Graph_Node**: A visual card element in the Decision_Graph representing either a requirement or a code file
- **Alignment_Status**: A badge on a Graph_Node indicating one of three states: Aligned, Drift Detected, or Patch Ready
- **Mock_Data**: A static JSON structure representing the graph nodes, edges, and their statuses used in place of a backend
- **Connecting_Edge**: A visual line or indicator linking a requirement node to one or more code file nodes

## Requirements

### Requirement 1: Dashboard Layout

**User Story:** As an AI developer, I want a single dashboard screen divided into three panels, so that I can view intent specifications, decision graphs, and remediation details simultaneously.

#### Acceptance Criteria

1. THE Dashboard SHALL render three panels arranged horizontally: Intent_Panel on the left occupying 25% of the viewport width, Decision_Graph in the center occupying 50% of the viewport width, and Remediation_Panel on the right occupying 25% of the viewport width
2. THE Dashboard SHALL use a full-viewport height layout with no vertical scrolling of the overall page, supporting a minimum viewport width of 1024px and a minimum viewport height of 600px
3. THE Dashboard SHALL apply a dark-mode-first aesthetic using slate-950 as the primary background color
4. THE Dashboard SHALL use emerald-500 as the accent color for success and alignment indicators
5. THE Dashboard SHALL use rose-500 as the accent color for drift and error indicators
6. WHEN the Dashboard is rendered, THE Dashboard SHALL display all three panels without requiring navigation between views
7. IF the content within any panel exceeds the panel's visible height, THEN THE Dashboard SHALL enable vertical scrolling within that individual panel while the overall page layout remains fixed

### Requirement 2: Intent Specification Input Panel

**User Story:** As a product owner, I want to input product requirements as plain text, so that the system can track alignment between intent and implementation.

#### Acceptance Criteria

1. THE Intent_Panel SHALL display a heading labeled "Intent Specification Input"
2. THE Intent_Panel SHALL contain a textarea element for entering product requirements with a maximum input length of 5000 characters
3. THE Intent_Panel SHALL preserve the entered text in component state using React useState
4. WHEN a user types in the textarea, THE Intent_Panel SHALL update the stored text value on each keystroke such that the component state always reflects the current textarea content
5. THE Intent_Panel SHALL render with a dark-themed textarea using slate-900 background and slate-100 text color
6. THE Intent_Panel SHALL display placeholder text in the textarea that describes the type of content expected (e.g., product requirements, user stories, or feature descriptions)
7. IF the textarea content is cleared, THEN THE Intent_Panel SHALL update the stored text value to an empty string

### Requirement 3: Live Decision Graph Panel

**User Story:** As an AI developer, I want to see a visual graph of requirements linked to code files with status badges, so that I can quickly identify alignment drift.

#### Acceptance Criteria

1. THE Decision_Graph SHALL display a heading labeled "Live Decision Graph"
2. THE Decision_Graph SHALL render each Graph_Node as a Tailwind-styled card element displaying the node's name text
3. THE Decision_Graph SHALL differentiate requirement nodes from code file nodes by displaying a distinct label prefix or icon indicator for each type, such that a tester can identify the node type without referring to source data
4. THE Decision_Graph SHALL render a visible Connecting_Edge between each requirement node and its associated code file node, where the connection is represented by a CSS-based line or a spatial grouping that visually associates the pair
5. WHEN a Graph_Node has an Alignment_Status of "Aligned", THE Decision_Graph SHALL display an emerald-500 colored badge on that node
6. WHEN a Graph_Node has an Alignment_Status of "Drift Detected", THE Decision_Graph SHALL display a rose-500 colored badge on that node
7. WHEN a Graph_Node has an Alignment_Status of "Patch Ready", THE Decision_Graph SHALL display an amber-500 colored badge on that node
8. THE Decision_Graph SHALL consume its node and edge data from Mock_Data containing at least 2 requirement nodes and 2 code file nodes with at least one edge per requirement node
9. IF Mock_Data contains zero nodes, THEN THE Decision_Graph SHALL display an empty-state message indicating no data is available
10. WHEN a Graph_Node represents a requirement, THE Decision_Graph SHALL display the node with one visual style, and WHEN a Graph_Node represents a code file, THE Decision_Graph SHALL display the node with a different visual style, where the two styles differ in at least one observable property such as background color, border color, or shape

### Requirement 4: Codex Remediation Engine Panel

**User Story:** As an AI developer, I want to view reasoning logs and git diffs for detected drift, so that I can understand and approve remediation actions.

#### Acceptance Criteria

1. THE Remediation_Panel SHALL display a heading labeled "Codex Remediation Engine"
2. THE Remediation_Panel SHALL render JSON reasoning logs in a formatted code block with syntax-appropriate styling where keys, strings, numbers, and booleans are visually distinguishable
3. THE Remediation_Panel SHALL render unified git diffs with addition lines highlighted in emerald-900, deletion lines highlighted in rose-900, and unchanged context lines displayed without highlighting
4. THE Remediation_Panel SHALL consume its display data from Mock_Data
5. WHEN no remediation data is available, THE Remediation_Panel SHALL display a placeholder message indicating no active remediations
6. WHEN remediation data contains both reasoning logs and git diffs, THE Remediation_Panel SHALL display reasoning logs and git diffs as separate, visually distinct sections
7. IF reasoning log JSON is malformed, THEN THE Remediation_Panel SHALL display the raw text content within the code block without syntax styling

### Requirement 5: Mock Data Structure

**User Story:** As a developer, I want a well-defined mock JSON structure, so that I can build the UI without backend dependencies.

#### Acceptance Criteria

1. THE Mock_Data SHALL define an array of at least 3 Graph_Nodes, each with properties: id (unique non-empty string), label (non-empty string, maximum 255 characters), type (one of "requirement" or "code-file"), and status (one of "aligned", "drift-detected", or "patch-ready")
2. THE Mock_Data SHALL define an array of at least 1 edge, each with properties: source (a string matching an existing Graph_Node id) and target (a string matching an existing Graph_Node id)
3. THE Mock_Data SHALL define an array of at least 1 remediation entry, each with properties: nodeId (a string matching an existing Graph_Node id that has status "patch-ready"), reasoningLog (an object containing at least a summary string property and a steps array-of-strings property), and diff (a non-empty string in unified diff format)
4. THE Mock_Data SHALL contain at least one node in each of the three Alignment_Status states
5. THE Mock_Data SHALL be stored as a static TypeScript file within the project source

### Requirement 6: Technology Stack Compliance

**User Story:** As a developer, I want the project to use a consistent and modern tech stack, so that the codebase remains maintainable and aligned with team standards.

#### Acceptance Criteria

1. THE Dashboard SHALL be built using Next.js 14.x with the App Router as the sole routing mechanism
2. THE Dashboard SHALL use Tailwind CSS utility classes as the only styling mechanism, with no CSS modules, styled-components, or external CSS frameworks present in the source
3. THE Dashboard SHALL use shadcn/ui components for all reusable UI primitives including cards, badges, textareas, buttons, dialogs, and dropdowns, rather than introducing alternative component libraries
4. THE Dashboard SHALL use Lucide icons for iconography
5. THE Dashboard SHALL manage all client-side interactive state using React useState hooks, without relying on external state management libraries
6. THE Dashboard SHALL operate entirely with local or static data at build and runtime, with no network calls to external backend services or APIs required to render any view
7. IF a component requires dynamic inline styles for computed values such as positioning or dimensions, THEN THE Dashboard SHALL limit inline styles to those computed values while expressing all other visual styling through Tailwind CSS classes

### Requirement 7: Component Architecture

**User Story:** As a developer, I want a clear component structure, so that I can extend the dashboard incrementally.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented as a Next.js page component within the App Router directory structure
2. THE Intent_Panel SHALL be implemented as a separate React component exported from its own module file
3. THE Decision_Graph SHALL be implemented as a separate React component exported from its own module file
4. THE Remediation_Panel SHALL be implemented as a separate React component exported from its own module file
5. THE Graph_Node SHALL be implemented as a reusable React component that accepts at minimum a node type identifier and a display label as props
6. WHEN a Graph_Node is rendered, THE Graph_Node SHALL display a Lucide icon mapped to its node type, where each distinct node type defined in the system corresponds to exactly one Lucide icon (e.g., file icon for code-file, list icon for requirement)
7. IF a Graph_Node receives a node type that has no defined icon mapping, THEN THE Graph_Node SHALL display a default fallback Lucide icon
