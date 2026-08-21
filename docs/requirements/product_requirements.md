# Product Requirements

## Overview
**Lectory.dev** is an enterprise AI-avatar simulation and training platform designed for corporate HR, L&D, and People Operations teams. It replaces passive video/slide training with real-time, interactive AI avatar lectures and scenario-based role-play simulations.

---

## Target Audience & Personas

### 1. Buyer & Decision Maker (HR & L&D Leadership)
- **Titles:** VP/Head of HR, Chief Learning Officer (CLO), VP of Talent Management, Director of L&D.
- **Pain Points:** 
  - Low engagement, poor retention, and "check-the-box" behavior in traditional video/slide e-learning.
  - High financial and logistical cost of coordinating live in-person/virtual instructor workshops.
  - Difficulty proving training ROI and measurable behavioral change to executives.
- **Value Proposition:** 
  - Scalable, active simulation training with measurable competency scoring at a fraction of live workshop costs.

### 2. Administrator & Program Manager (Operational Champion)
- **Titles:** L&D Program Manager, Compliance Training Officer, People Operations Lead.
- **Pain Points:** 
  - Managing cohort scheduling across distributed/global teams.
  - Tracking compliance completion, audit readiness, and consistent grading.
- **Value Proposition:** 
  - Automated simulation assessments, audit-ready compliance reporting, and LMS integration (SCORM/xAPI/cmi5).

### 3. Internal Author & SME (Instructional Designer)
- **Titles:** Instructional Designer (ID), Enablement Lead, Department SME.
- **Pain Points:** 
  - High video production costs (actors, studios, editing).
  - Slow update cycles when company policies or products change.
- **Value Proposition:** 
  - AI Class Construction Wizard: Generate interactive, branching role-play scenarios and 3D avatar lectures in minutes without studio equipment.

### 4. Corporate Learner (Employee / Manager)
- **Titles:** People Managers, Sales Representatives, Frontline Employees, New Hires.
- **Pain Points:** 
  - Boring compliance modules; fear of failing in front of peers during live role-plays.
- **Value Proposition:** 
  - Safe, judgement-free sandbox to practice difficult conversations (conflict resolution, performance feedback, compliance scenarios) via real-time voice and chat.

---

## Core Enterprise Use Cases

1. **HR & Compliance Training**
   - Workplace harassment prevention, DE&I scenarios, ethics, whistleblowing, and code-of-conduct role-plays.
2. **Manager & Leadership Development**
   - Practicing difficult 1-on-1s, delivering constructive feedback, handling performance improvement plans (PIPs), and conflict resolution.
3. **Sales & Customer Success Enablement**
   - Objection handling, cold outreach pitch practice, customer de-escalation, and high-stakes negotiation simulations.
4. **New Hire Onboarding & Cultural Immersion**
   - Interactive company policy walk-throughs and simulated cross-functional interactions.

---

## Product Features & Capabilities

### 1. Real-Time Interactive AI Player
- **Zero Pre-Rendered Video:** Content is rendered live in the web browser.
- **Real-Time Conversational Avatars:** Learners interact with 3D avatars via speech (voice-to-voice) or text chat.
- **Multi-Avatar Role-Play:** Avatars simulate realistic office and business situations (e.g., manager and employee dialogue) with the user participating as a direct character.
- **Adaptive Branching:** Avatar reactions and scenario paths dynamically adapt based on learner tone, word choice, and decisions.

### 2. Enterprise Class Authoring & Construction Wizard
- **AI-Assisted Scenario Builder:** Prompts and templates to rapidly draft multi-turn dialogue trees, rubrics, and learning objectives.
- **3D Avatar & Voice Selection:** Curated enterprise avatars, attire, backdrops (office, conference room, retail), and natural voice synthesis.
- **Custom Knowledge Ingestion:** Upload company handbooks, compliance policies, or product specs to ground avatar knowledge.

### 3. Assessment & Feedback Engine
- **Automated Rubric Evaluation:** Scored assessment after each role-play session evaluating empathy, clarity, policy adherence, and tone.
- **Actionable Remediation:** Tailored feedback highlighting what the learner did well and specific areas for improvement.

### 4. Lightweight Cohort & Learner Management (Zero-Overhead)
- **Frictionless Dispatch:** One-click direct launch links via Slack, Microsoft Teams, or email (Magic Links or SSO); no clunky multi-step portal logins required.
- **Rapid Cohort Assignment:** Assign simulations to departments, roles, or custom CSV groups in under 60 seconds.
- **Automated Scorecards & Rubrics:** Zero manual grading overhead; AI automatically evaluates conversation performance against company rubrics.
- **Live Cloud Updates:** Edit scenarios in the browser with immediate deployment—no re-packaging or version conflicts.

### 5. Enterprise Administration & Integrations
- **Dual Deployment Options:**
  - *Standalone Mode:* Built-in lightweight cohort dashboard for fast, self-contained deployment.
  - *Integrated LMS/LXP Mode:* 1-click SCORM 1.2/2004, xAPI (Tin Can), and cmi5 package export to plug seamlessly into existing systems (Workday, Cornerstone, SAP SuccessFactors, Docebo).
- **Identity & Security:** Single Sign-On (SAML / Okta / Azure AD / Google Workspace) and Role-Based Access Control (RBAC).
- **Analytics & Reporting:** Cohort completion tracking, skill benchmark distribution, and audit-ready compliance export.

---

## Technical Architecture & Authoring Advantages

Lectory replaces the traditional, fragmented video production pipeline with a **real-time, client-side runtime engine**:

```
[Legacy LMS Pipeline - Hours/Days per Edit]
Articulate / Captivate ➔ Studio / HeyGen (Pre-Render MP4) ➔ Video Encoding ➔ SCORM Packaging (.zip) ➔ LMS Re-Upload

[Lectory Real-Time Architecture - Instant Live Update]
Browser Authoring Canvas ➔ Structured Scenario State (JSON) ➔ Real-Time WebGL/TTS Runtime on Learner's Browser
```

### Key Technical Differentiators:

1. **Zero-Render Pipeline (<10s Policy Edits)**
   - *Legacy:* Modifying a single line of compliance policy or dialogue requires re-rendering video, waiting in GPU queues, re-packaging SCORM files, and re-uploading to the LMS.
   - *Lectory:* Content is stored as dynamic scenario state (JSON graphs). Authoring changes update in the cloud in real time with zero video re-rendering or packaging delays.

2. **Dynamic Branching without Exponential Video Bloat**
   - *Legacy:* Creating a 5-step branching scenario with pre-rendered video requires filming or generating $2^5 = 32$ separate video clips, making deep simulations cost-prohibitive.
   - *Lectory:* 3D avatar meshes, procedural lip-sync, and facial animations are rendered on the fly in the browser via WebGL/WebGPU driven by real-time TTS and conversational AI. Branching paths are practically infinite at zero marginal cost.

3. **Unified Single-Canvas Authoring**
   - *Legacy:* Requires multiple disconnected licenses and tools (Articulate Storyline for layouts, Premiere/Camtasia for video editing, synthetic video tools, and separate SCORM packagers).
   - *Lectory:* Consolidates scenario prompting, script drafting, 3D avatar selection, voice casting, and grading rubric configuration into one browser-based studio.

4. **Bandwidth Efficiency & Zero Video Storage Bloat**
   - *Legacy:* Streams heavy 1080p MP4 files (hundreds of MBs per module), straining enterprise VPNs and mobile bandwidth.
   - *Lectory:* Transmits lightweight state payloads, audio streams, and cached 3D assets rendered locally by the client device.

5. **Runtime Personalization & Variable Injection**
   - *Legacy:* Pre-rendered videos are static and identical for every employee.
   - *Lectory:* Runtime TTS and dialogue generation allow dynamic injection of employee metadata (learner name, department, manager name, regional policies) directly into the spoken avatar dialogue.

---

## "Try a Class" Interactive Trial & Metering Architecture

To demonstrate the real-time AI avatar experience to prospects without unmetered compute exposure (LLM tokens, STT, and TTS audio synthesis), the **"Try a Class"** feature is designed as a **time-boxed, turn-capped micro-simulation sandbox**.

### 1. User Journey & Flow
```
[Phase 1: Scene Intro & Setup] ➔ Pre-rendered/Cached Audio & Visemes (0 Compute Cost)
                                 Avatar establishes scenario context.
                                      ▼
[Phase 2: Live Interaction]    ➔ Live STT ➔ LLM Branching ➔ Real-Time TTS (Capped at 3 Turns)
                                 Learner responds via microphone or chat.
                                      ▼
[Phase 3: AI Rubric Scorecard] ➔ Real-time automated evaluation generated on 3rd turn completion.
                                 Displays Empathy, Policy Adherence, and Coaching Feedback.
                                      ▼
[Phase 4: Forked Conversion]   ➔ Personal Learner: "Browse Public Catalog"
                                 Business Evaluator: "Build Custom Company Scenario" (Enter Work Email)
```

### 2. Tailored Experience: Business Evaluator vs. Personal Learner

| Feature / Step | Personal / Casual Learner | Business Evaluator (HR / L&D) |
| :--- | :--- | :--- |
| **Friction Level** | Zero friction: 1-click launch, no account required. | Low friction: Instant sandbox; unlock full authoring sandbox via work email. |
| **Scenario Selection** | 1 general communication sandbox. | Choice of 3 enterprise tracks: **HR Compliance**, **Manager 1-on-1**, or **Sales Objection**. |
| **Compute Quota** | Capped at 1 session (3 interactive turns). | 3 interactive turns in public sandbox; **60-min simulation quota** unlocked upon corporate email verification. |
| **Aha! Moment** | Immediate conversational voice interaction with 3D avatar. | **Automated Rubric Scorecard** demonstrating measurable behavioral evaluation. |
| **Conversion CTA** | Community catalog signup. | **AI Authoring Wizard trial** (generate and test a custom company scenario in 2 minutes). |

### 3. Technical Compute & Cost Guardrails

1. **Hybrid Cached/Live Pipeline:**
   - Scene setup and avatar introduction (Turn 0) use cached static audio and lip-sync visemes from the CDN.
   - Live real-time compute (STT, LLM inference, TTS synthesis) is active only during turns 1–3.
2. **Turn & Duration Hard Limits:**
   - Hard cap at **3 interactive dialogue turns** or **3 minutes total elapsed time** per trial.
   - Server-side response length restriction (max 150 characters per avatar response in trial mode).
3. **Session Rate Limiting & Bot Protection:**
   - Anonymous session fingerprinting and IP rate limiting (maximum 2 trial runs per 24 hours per unauthenticated user).
   - Bot protection (e.g., Cloudflare Turnstile) before microphone / audio stream initialization.
4. **Metered Enterprise Evaluation Workspace:**
   - Verified work emails (`@company.com`) receive a temporary API token loaded with a metered 60-minute simulation quota and LMS export preview.

