# CogniGraph - AI Intent-Alignment Dashboard

An AI-powered developer tool that detects architectural drift between product specifications and code implementations, then auto-generates remediation patches using OpenAI GPT models.

Built for the **OpenAI Build Week Hackathon (DevPost)**.

![TypeScript](https://img.shields.io/badge/TypeScript-89.6%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green)

---

## What It Does

CogniGraph provides a three-panel dashboard that:

1. **Intent Specification Input** - Accepts product requirements and code snippets
2. **Live Decision Graph** - Visualizes requirement-to-code alignment as a bipartite graph with status-colored edges
3. **Codex Remediation Engine** - Displays AI reasoning traces and auto-generated unified diffs

### Core Workflow

```
Specification + Code → GPT-4o Analysis → Drift Detection → Codex Patch Generation
```

- **Run Audit**: Sends specification and code to GPT-4o, which evaluates architectural alignment and returns a confidence-scored verdict
- **Trigger Auto-Remediation**: Generates a self-healing Git diff patch via OpenAI Codex that fixes the detected drift

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Lucide Icons |
| Backend | Express.js, Node.js |
| AI | OpenAI GPT-4o (analysis), GPT-4o-mini (patch generation) |
| Testing | Vitest, fast-check (property-based testing), Testing Library |

---

## Project Structure

```
src/
  app/
    page.tsx          # Main dashboard (three-panel grid layout)
    layout.tsx        # Root layout with dark theme
    globals.css       # Tailwind + dark-mode CSS variables
  components/
    intent-panel.tsx       # Left panel: spec + code input with action buttons
    decision-graph.tsx     # Center panel: bipartite graph with SVG edges
    graph-node.tsx         # Individual node cards with status badges
    remediation-panel.tsx  # Right panel: reasoning log + unified diff
    ui/                    # shadcn/ui primitives (Card, Badge, Textarea)
  lib/
    types.ts          # TypeScript interfaces
    mock-data.ts      # Static demo data
    utils.ts          # Utility functions (cn)
server.js             # Express backend with OpenAI integration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API Key

### Installation

```bash
git clone https://github.com/Kotlasuhasreddy123/CogniGraph.git
cd CogniGraph
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### Running the Application

**Start the backend server:**

```bash
node server.js
```

**Start the frontend (in a separate terminal):**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Use

1. Enter a product specification in the "Specification / Requirements" textarea
2. Paste the code snippet to analyze in the "Code Snippet" textarea
3. Click **Run Audit** - GPT-4o evaluates alignment and updates the decision graph
4. Click **Trigger Auto-Remediation** - Codex generates a patch to fix detected drift

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-intent` | POST | Analyzes spec vs. code alignment |
| `/api/generate-patch` | POST | Generates remediation diff patch |

### Request/Response Examples

**Analyze Intent:**
```json
POST /api/analyze-intent
{
  "specificationText": "All payments must use Stripe webhooks...",
  "codeSnippet": "const savedCard = await db.creditCards.create({...})"
}

Response:
{
  "status": "DRIFT_DETECTED",
  "driftReasoning": "Local database storage violates PCI-compliance rules...",
  "confidenceScore": 98
}
```

**Generate Patch:**
```json
POST /api/generate-patch
{
  "codeSnippet": "const savedCard = await db.creditCards.create({...})",
  "driftReasoning": "Local database storage violates PCI compliance rules."
}

Response:
{
  "patch": "--- a/src/lib/payment.ts\n+++ b/src/lib/payment.ts\n@@ -4,11 +4,7 @@...",
  "timestamp": "2026-07-21T..."
}
```

---

## Testing

```bash
npm test
```

Runs 47 property-based and unit tests across 13 test suites using Vitest + fast-check.

---

## Demo Video

See `Cognigraph, openai build week.mp4` in the repository root.

---

## Author

**Kotla Suhas Reddy**
- GitHub: [@Kotlasuhasreddy123](https://github.com/Kotlasuhasreddy123)
- LinkedIn: [in/kotla-suhas-reddy](https://linkedin.com/in/kotla-suhas-reddy)
- Lewis University | MS in Artificial Intelligence

---

## License

This project is licensed under the [MIT License](LICENSE).

Built for the OpenAI DevPost Hackathon (Build Week 2025).
