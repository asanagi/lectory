# Lectory — AI Coding Agent Steering Handbook

> This document establishes the non-negotiable architectural invariants, coding standards, and verification gates for all autonomous AI coding agents operating in this repository.

---

## 1. Product Identity & Architecture Vision
- **Product:** Lectory — AI-Native Interactive Learning Platform.
- **Target Audience:** Solo developers & teams needing rapid course authoring without heavy video production overhead.
- **Core Architecture Principle:** Render at playback, not at authoring. Deliver dynamic browser slides and AI streaming narration in real time rather than compiling multi-gigabyte video files.
- **Business Model & Scale:** Solo developer-operated SaaS with a zero-idle-cost operational footprint.

---

## 2. Lean Tech Stack Invariants

### Approved Production Stack
| Layer | Technology | Rationale / Constraint |
|---|---|---|
| **Edge & Marketing** | Cloudflare Workers + Vanilla HTML/CSS | Sub-100ms global TTFB, zero hydration tax, design tokens |
| **Web App (PWA)** | Lit 3.0 Web Components + Vite + TypeScript | Native W3C standard, ~5 KB runtime, Shadow DOM style isolation |
| **Backend Service** | Go 1.22+ on Google Cloud Run | Single static binary, microsecond startup, scales to 0 idle instances |
| **API Contract** | Connect-RPC over Protobuf (`proto/`) | Single contract source of truth; generate via `buf generate` |
| **Database & Auth** | Google Cloud Firestore + Firebase Auth | Serverless NoSQL document model, zero idle database cost |

### Strictly Forbidden (Hallucination Blacklist)
- ❌ **NO React, Next.js, Vue, or Angular:** Do not suggest or install heavy virtual-DOM frameworks. All frontend UI uses Lit Web Components.
- ❌ **NO TailwindCSS or CSS-in-JS:** Do not add Tailwind dependencies or utility class dumps. Use Vanilla CSS custom properties in `styles/tokens.css` and Lit `css` tagged templates.
- ❌ **NO Heavy ORMs or Relational Drivers:** Do not install GORM or Prisma. Use the official Google Cloud Firestore SDK with idiomatic Go structs.
- ❌ **NO Monolithic State Libraries:** Do not install Redux, MobX, or Zustand. Use Lit reactive properties and lightweight native DOM CustomEvents.
- ❌ **NO Arbitrary npm Dependencies:** Do not add third-party packages without explicit developer authorization.

---

## 3. Solo Dev Engineering Standards

### Surgical, Atomic Diffs
- Limit changes to under **150 lines per edit**.
- Never perform unprompted mass refactorings across unrelated files.
- Keep file sizes under 300 lines; break complex UI into subcomponents and backend logic into internal packages.

### Zero Unhandled Errors
- In Go, **every error must be explicitly checked and handled**.
- Discarding errors with blank identifiers (`_ = err`) is strictly forbidden.
- In TypeScript, strict null checks are enforced (`strict: true`). Zero `any` types permitted.

### Shadow DOM Encapsulation
- Never write inline styles (`style="..."`) in HTML or component templates.
- All styles must be scoped inside the Lit component's `static styles = css`...`` block using CSS custom property tokens.

### Non-Interactive Terminal Execution
- All shell commands executed by agents must run in non-interactive mode (e.g., `npm install -y`, `npx -y`). Never execute commands that block on interactive terminal input.

---

## 4. Verification & Quality Gate Protocol
Before reporting any implementation or bug-fix task complete, you MUST run and verify the following gates:

1. **API Schema Linting (if proto edited):**
   ```bash
   buf lint
   ```
2. **Frontend Type Check & Linter:**
   ```bash
   cd app && npm run check
   ```
3. **Backend Vet & Unit Tests:**
   ```bash
   cd services/user && go vet ./... && go test -v ./...
   ```
4. **Git Workspace Hygiene:**
   ```bash
   git status
   ```
   Verify zero untracked scratchpad files, debug logs, or unwanted temporary files.
