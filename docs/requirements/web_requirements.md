# Marketing Website Requirements

> Note: Product features, architectural specifications, and core value propositions are governed by [product_requirements.md](file:///c:/Users/asana/source/repos/lectory/docs/requirements/product_requirements.md). This document defines the information architecture, page layouts, navigation, and technical UX requirements for the corporate marketing website.

---

## 1. Target Audience & Buyer Intent

The marketing site must address distinct enterprise buyer and evaluator personas:
1. **Decision Makers (CLO, VP of HR, VP of Talent):** Focus on training ROI, behavioral change retention, compliance audit readiness, and replacing expensive live workshops.
2. **Operational Champions (L&D Managers, Compliance Officers):** Focus on frictionless cohort dispatch (Slack, Teams, Email magic links), automated rubric scoring, and LMS integration.
3. **Internal Authors & SMEs (Instructional Designers):** Focus on the single-canvas AI authoring studio, instant (<10s) zero-render policy updates, and zero video studio production overhead.
4. **Enterprise IT & Security Evaluators:** Focus on SSO/SAML, SOC2/GDPR compliance, RBAC, and client-side WebGL/WebGPU bandwidth efficiency over corporate VPNs.

---

### 2. Global Site Experience & Technical Standards

* **100% Static HTML Architecture:** The marketing site (`lectory.dev`) is strictly static HTML, CSS, and lightweight vanilla client JS. It contains **zero auth state, zero user session management, and zero trial compute/AI runtime logic**.
* **Direct Application Handoff:** All application actions (*Sign In*, *Sign Up*, *Get Started*, *Try a Class*) link directly out to the dedicated application domain (`https://app.lectory.dev`) with standardized UTM and intent query parameters.
* **Design Aesthetic:** High-end, modern enterprise SaaS look and feel. Curated dark/light theme, crisp typography, clean micro-interactions, and responsive layout across desktop and mobile.
* **Performance:** Sub-second initial page load, static asset CDN caching, and zero heavy client-side audio/video processing dependencies on marketing pages.
* **Conversion Hierarchy:**
  * **Primary CTAs:**
    * "Book a Demo" ➔ Direct link / modal to enterprise scheduling (`https://app.lectory.dev/demo` or calendar embed).
    * "Try a Class" / "Try Live Demo" ➔ Direct deep-link to application trial player (`https://app.lectory.dev/try?track=compliance&utm_source=marketing_home`).
  * **Secondary CTAs:**
    * "Get Started" / "Sign Up" ➔ `https://app.lectory.dev/signup`
    * "Sign In" ➔ `https://app.lectory.dev/login`
* **SEO & Compliance:** Semantic HTML5 structure, descriptive OpenGraph meta tags, unique page IDs, and WCAG AA accessibility compliance.

---

## 3. Navigation Architecture

### Header Navigation (Wedge-Driven)
The top navigation is organized strictly around product value, technical wedges, and enterprise evaluation. General corporate links (*About Us*, *Contact*, *Careers*) are demoted to the footer.

* **Brand:** Lectory Logo (links to `/`)
* **Navigation Links:**
  * **Platform (Dropdown):**
    * *Real-Time Simulation Engine:* Client-side WebGL/WebGPU runtime with live conversational avatars (Wedge 1 & 2).
    * *Single-Canvas AI Studio:* Zero-video scenario construction & instant policy updates (Wedge 1 & 4).
    * *Automated Rubrics & Analytics:* Objective scoring, behavioral evaluation, and audit dashboards (Wedge 3).
    * *Frictionless Cohort Dispatch:* One-click Slack, Teams, and magic link distribution (Wedge 5).
  * **Why Real-Time (Positioning Pillar):**
    * Architectural teardown: Live Browser Runtime vs. Legacy Pre-Rendered Video LMS Pipelines (Wedge 1 & 4).
  * **Solutions (Dropdown by Use Case):**
    * *HR & Compliance Training:* Audit-ready harassment and ethics simulations.
    * *Manager & Leadership Development:* Safe sandbox for difficult 1-on-1s, feedback, and PIPs.
    * *Sales & CS Enablement:* Dynamic objection handling and negotiation role-play.
    * *New Hire Onboarding:* Interactive culture immersion and policy navigation.
  * **Enterprise (Dropdown):**
    * *LMS & Tools Integration:* 1-click SCORM 1.2/2004, xAPI, cmi5, Workday, Cornerstone, Slack, Teams (Wedge 5).
    * *Security & Trust Center:* SOC2 alignment, SAML SSO, RBAC, zero customer data AI training retention.
  * **Pricing:** Transparent seat tiers (Standalone Cohort vs. LMS Integrated).
* **Right Actions (Direct App Links):**
  * **"Sign In"** ➔ `<a href="https://app.lectory.dev/login?utm_source=marketing&utm_medium=nav_signin">`
  * **"Book a Demo"** (Primary Button CTA) ➔ `<a href="https://app.lectory.dev/demo?utm_source=marketing&utm_medium=nav_demo">`

### Footer Navigation (Corporate & Trust Hub)
Demoted non-buyer links and global directory:
* **Product & Tech:** Real-Time Runtime, AI Studio, Automated Rubrics, Zero-Render Architecture, Release Notes.
* **Solutions:** HR Compliance, Leadership Development, Sales Enablement, New Hire Onboarding.
* **Integrations & Standards:** SCORM & xAPI Export, Workday, Cornerstone, Slack App, Teams Bot.
* **Security & Legal:** Security & Trust Center, Privacy Policy, Terms of Service, SOC2 Roadmap, Status Page.
* **Company & Contact:** About Lectory, Contact Sales, Support, Careers, Media Kit.
* **Application Access:** [Sign In](https://app.lectory.dev/login), [Sign Up](https://app.lectory.dev/signup), [Try a Class](https://app.lectory.dev/try).
* **Social Links:** LinkedIn, X (Twitter), YouTube.

---

## 4. Page Breakdown & Core Positioning Wedges

Every page is structured to explicitly land Lectory's **5 Core Positioning Wedges**:
* **Wedge 1:** *Zero-Render Pipeline* (<10s policy edits vs. days in video studio queues).
* **Wedge 2:** *Active Conversational Role-Play* (voice-to-voice simulation vs. passive video/slide "check-the-box").
* **Wedge 3:** *Automated Rubric Scorecards* (objective behavioral assessment & audit-ready compliance).
* **Wedge 4:** *Unified Single-Canvas Studio* (no actors, studio gear, or multi-tool editing bloat).
* **Wedge 5:** *Zero-Overhead Enterprise Deployment* (Slack/Teams direct dispatch + 1-click SCORM/xAPI LMS export).

---

### 4.1 Home Page (`/`)
* **Primary Wedge Focus:** Wedge 1, Wedge 2, Wedge 3.
1. **Hero Section (Wedge 2):**
   * *Headline:* "Turn Passive Training Videos into Live, Real-Time AI Avatar Simulations."
   * *Subhead:* Active voice-to-voice scenario training with instant behavioral scoring. Zero pre-rendered video.
   * *CTAs:*
     * Primary: *"Try a Class"* ➔ `https://app.lectory.dev/try?utm_source=marketing&utm_medium=home_hero`
     * Secondary: *"Book a Demo"* ➔ `https://app.lectory.dev/demo?utm_source=marketing&utm_medium=home_hero`
   * *Badge Bar:* "Zero Video Rendering • SCORM & xAPI Compliant • 10s Cloud Policy Edits".
2. **Social Proof & Trust Badges:** Enterprise logos, SOC2 roadmap badge, SAML SSO, xAPI/cmi5 certified.
3. **"Try a Class" Interactive Scenario Teaser (Wedge 2 & 3):**
   * Visual preview cards for 3 enterprise tracks (Compliance, Leadership, Sales) with 1-click launch buttons linking directly to `https://app.lectory.dev/try?track=[track]&utm_source=marketing&utm_medium=home_preview`.
4. **Architectural Teardown: Legacy Video vs. Lectory Real-Time Engine (Wedge 1 & 4):**
   * Interactive visual comparison showing legacy video cycle (hours/days per edit + heavy MP4s) vs. Lectory client-side WebGL/TTS runtime (<10s JSON update + zero bandwidth bloat).
5. **Positioning Wedge Grid (Wedges 1–5):**
   * 4-card interactive feature grid highlighting Real-Time Avatars, Single-Canvas Studio, Automated Scorecards, and Slack/Teams Dispatch.
6. **Enterprise Use Case Carousel (Wedge 2):**
   * Tabbed scenario previews with direct links to `/solutions/[track]`.
7. **Bottom Conversion Banner:**
   * Direct CTAs to *"Get Started"* (`https://app.lectory.dev/signup?utm_source=marketing&utm_medium=home_footer_banner`) and *"Book a Demo"*.

---

### 4.2 Why Real-Time / Architecture Page (`/why-real-time`)
* **Primary Wedge Focus:** Wedge 1 & Wedge 4 (The Technical & Economic Disruption).
1. **The Legacy Video Trap:** The hidden cost of corporate video training (actor fees, studio reshoots, SCORM re-packaging, and version drift).
2. **The Zero-Render Engine:** Technical breakdown of client-side WebGL/WebGPU procedural mesh & TTS animation driven by live JSON state graphs.
3. **The 10-Second Policy Edit:** Visual walkthrough of updating an enterprise policy or script line in the browser canvas with immediate global learner sync.
4. **Bandwidth & VPN Efficiency:** Zero video streaming bloat; lightweight state payloads and cached 3D meshes that run smoothly over enterprise VPNs.
5. **Dynamic Branching at Zero Marginal Cost:** Demonstrating how 5+ branching turns require 32+ pre-rendered videos vs. infinite real-time paths in Lectory.
6. **CTA Banner:** *"Experience the Real-Time Runtime"* ➔ `https://app.lectory.dev/try?utm_source=marketing&utm_medium=why_realtime`.

---

### 4.3 Platform Page (`/platform`)
* **Primary Wedge Focus:** Wedge 2, Wedge 3, Wedge 4, Wedge 5.
1. **Interactive Player Engine (Wedge 2):** Real-time conversational voice/chat, emotional expressiveness, and multi-avatar office role-play.
2. **Single-Canvas AI Authoring Studio (Wedge 4):** Document ingestion (SOPs/handbooks), rapid dialogue drafting, and voice/avatar casting without video skills.
3. **Automated Assessment & Remediation (Wedge 3):** Objective rubrics (Empathy, Policy Adherence, Tone, Clarity) and instant learner scorecards.
4. **Frictionless Cohort Management (Wedge 5):** Magic link dispatch via Slack, MS Teams, or CSV cohort assignment with zero learner onboarding friction.
5. **CTA Section:** *"Test the AI Authoring Studio"* ➔ `https://app.lectory.dev/signup?intent=studio_trial&utm_source=marketing&utm_medium=platform_page`.

---

### 4.4 Solutions Pages (`/solutions/[use-case]`)
* **Primary Wedge Focus:** Wedge 2 & Wedge 3 (Applied to Specific Business Outcomes).
* **/solutions/compliance:** Audit-ready harassment & ethics simulations; CTA: *"Try Compliance Scenario"* ➔ `https://app.lectory.dev/try?track=compliance&utm_source=marketing&utm_medium=sol_compliance`.
* **/solutions/leadership:** Safe sandbox for first-time and experienced managers; CTA: *"Try Manager 1-on-1"* ➔ `https://app.lectory.dev/try?track=leadership&utm_source=marketing&utm_medium=sol_leadership`.
* **/solutions/sales-enablement:** High-intensity objection handling; CTA: *"Try Sales Simulation"* ➔ `https://app.lectory.dev/try?track=sales&utm_source=marketing&utm_medium=sol_sales`.
* **/solutions/onboarding:** Interactive company values and policy immersion; CTA: *"Try Onboarding Simulation"* ➔ `https://app.lectory.dev/try?track=onboarding&utm_source=marketing&utm_medium=sol_onboarding`.

---

### 4.5 Integrations & Enterprise Hub (`/integrations`)
* **Primary Wedge Focus:** Wedge 5 (Seamless Fit into Existing Enterprise Ecosystems).
1. **Dual Deployment Architecture:**
   * *Standalone Mode:* Self-contained cohort management and analytics dashboard.
   * *LMS/LXP Mode:* 1-click export of SCORM 1.2, SCORM 2004, xAPI (Tin Can), and cmi5 packages.
2. **LMS Ecosystem Compatibility:** Certified integration cards for Workday, Cornerstone OnDemand, SAP SuccessFactors, Docebo, and Canvas.
3. **Enterprise Dispatch & Identity:** One-click Slack app & MS Teams bot notifications, Okta / Azure AD SAML 2.0 SSO, and SCIM directory sync.
4. **CTA Section:** *"Request LMS Integration Preview"* ➔ `https://app.lectory.dev/demo?interest=lms_integration&utm_source=marketing&utm_medium=integrations_page`.

---

### 4.6 Security & Trust Center (`/security`)
* **Primary Wedge Focus:** Enterprise Risk Mitigation & Data Privacy.
1. **Data Privacy Guarantee:** Zero customer training data retention; enterprise audio and text inputs are never used to train foundational AI models.
2. **Identity & Access Control:** SAML 2.0 Single Sign-On (SSO), MFA, and granular Role-Based Access Control (RBAC).
3. **Infrastructure & Compliance:** TLS 1.3 encryption in transit, AES-256 at rest, SOC2 Type II compliance roadmap, and GDPR data sovereignty.
4. **Security Consultation CTA:** *"Request Security & Compliance Whitepaper"* ➔ `https://app.lectory.dev/demo?interest=security_whitepaper&utm_source=marketing&utm_medium=security_page`.

---

### 4.7 Pricing Page (`/pricing`)
* **Primary Wedge Focus:** Transparent Procurement & ROI Validation.
1. **Dual-Mode Pricing Tiers:**
   * *Team (Standalone):* Direct CTA: *"Get Started"* ➔ `https://app.lectory.dev/signup?plan=team&utm_source=marketing&utm_medium=pricing_team`.
   * *Enterprise (LMS Integrated):* Direct CTA: *"Contact Sales"* ➔ `https://app.lectory.dev/demo?plan=enterprise&utm_source=marketing&utm_medium=pricing_enterprise`.
   * *Custom / Strategic:* Direct CTA: *"Talk to an Expert"* ➔ `https://app.lectory.dev/demo?plan=custom&utm_source=marketing&utm_medium=pricing_custom`.
2. **Interactive ROI Calculator:** Compare annual costs against live workshop facilitation and legacy video production agencies.

---

## 5. Application Deep-Linking & Query Parameter Specification

Because the marketing website is 100% static HTML, all dynamic trials, user registrations, logins, and compute workloads run exclusively on the `app.lectory.dev` web application.

### 5.1 Standard CTA Query Parameter Mapping

| Marketing CTA Action | Destination Target URL | Purpose & Pre-Loaded State |
| :--- | :--- | :--- |
| **Sign In** | `https://app.lectory.dev/login?utm_source=marketing&utm_medium=nav_signin` | Standard user authentication portal. |
| **Sign Up / Get Started** | `https://app.lectory.dev/signup?plan=[team\|enterprise]&utm_source=marketing` | Pre-selects pricing tier in the onboarding funnel. |
| **Try a Class (General)** | `https://app.lectory.dev/try?utm_source=marketing&utm_medium=[location]` | Launches the default trial scenario selector in the app player. |
| **Try a Class (Track Specific)** | `https://app.lectory.dev/try?track=[compliance\|leadership\|sales\|onboarding]&utm_source=marketing` | Automatically boots into the 3-turn interactive sandbox for that track. |
| **Book a Demo** | `https://app.lectory.dev/demo?interest=[general\|lms\|security]&utm_source=marketing` | Enterprise demo booking funnel with pre-populated interest flags. |
| **Studio Trial** | `https://app.lectory.dev/signup?intent=studio_trial&utm_source=marketing` | Routes enterprise authors directly to test the AI Authoring Wizard. |

### 5.2 Application-Side Hand-off Responsibilities
All dynamic features previously described are handled entirely within the application runtime (`https://app.lectory.dev`):
1. **Trial Rate Limiting & Bot Protection:** Cloudflare Turnstile verification and IP throttling occur on the `app.lectory.dev` domain.
2. **Compute Quota Enforcement:** The 3-turn limit, audio streaming, and STT/LLM/TTS orchestration execute inside the application player.
3. **Corporate Email Unlocking:** Capturing `@company.com` emails to unlock the 60-minute authoring studio trial is managed by the application backend.

---

## 6. Universal HTML `<head>` Metadata, SEO & Social Share Specifications

All pages on the Lectory marketing site must implement a uniform, production-ready `<head>` metadata contract to ensure consistent branding, high-conversion social shares on LinkedIn/Slack/X, and search indexing compliance.

### 6.1 Base Document & Technical Tags
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
<link rel="canonical" href="https://lectory.dev{{PAGE_PATH}}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```

### 6.2 Universal Favicon & App Icon Bundle
All assets reside in `/public/icons/`:
* **SVG Favicon (Modern/Vector):** `<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />`
* **Legacy Favicon (Fallback):** `<link rel="alternate icon" type="image/x-icon" href="/icons/favicon.ico" sizes="32x32" />`
* **Apple Touch Icon (iOS Home Screen):** `<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />`
* **Web App Manifest:** `<link rel="manifest" href="/site.webmanifest" />` (defines app name `Lectory`, theme colors, and 192x192 / 512x512 PWA icons).

### 6.3 Open Graph (OG) & Social Card Specification
Targeted for high-fidelity previews across LinkedIn, Slack, Microsoft Teams, and Facebook:
```html
<!-- Open Graph / Facebook / LinkedIn / Slack -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Lectory" />
<meta property="og:locale" content="en_US" />
<meta property="og:url" content="https://lectory.dev{{PAGE_PATH}}" />
<meta property="og:title" content="{{OG_TITLE}}" />
<meta property="og:description" content="{{OG_DESCRIPTION}}" />
<meta property="og:image" content="https://lectory.dev/images/og/{{OG_IMAGE_FILENAME}}.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Lectory — Enterprise AI Avatar Simulation Platform" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@lectorydev" />
<meta name="twitter:creator" content="@lectorydev" />
<meta name="twitter:title" content="{{TWITTER_TITLE}}" />
<meta name="twitter:description" content="{{TWITTER_DESCRIPTION}}" />
<meta name="twitter:image" content="https://lectory.dev/images/og/{{OG_IMAGE_FILENAME}}.png" />
<meta name="twitter:image:alt" content="Lectory — Enterprise AI Avatar Simulation Platform" />
```

### 6.4 Per-Page Metadata Matrix

| Page Route | `<title>` Formula | Meta / OG Description | Dedicated OG Image Asset |
| :--- | :--- | :--- | :--- |
| **Home (`/`)** | `Lectory — Enterprise AI Avatar Simulation & Training Platform` | Replace passive training videos with real-time, interactive 3D AI avatar role-plays and automated rubric scoring. Zero pre-rendered video. | `og-home-1200x630.png` |
| **Why Real-Time (`/why-real-time`)** | `Why Real-Time AI Simulation vs Legacy Video LMS | Lectory` | Discover why real-time WebGL avatar simulation replaces legacy video pipelines with <10s policy updates and zero bandwidth bloat. | `og-why-real-time-1200x630.png` |
| **Platform (`/platform`)** | `Platform Architecture & AI Studio | Lectory` | Explore Lectory's zero-render simulation runtime, single-canvas AI authoring studio, and automated behavioral scoring engine. | `og-platform-1200x630.png` |
| **Solutions: Compliance (`/solutions/compliance`)** | `AI Compliance & Ethics Training Simulations | Lectory` | Scalable, audit-ready compliance simulations. Replace check-the-box videos with interactive harassment and ethics role-plays. | `og-compliance-1200x630.png` |
| **Solutions: Leadership (`/solutions/leadership`)** | `Manager & Leadership Simulation Training | Lectory` | Safe sandbox for managers to practice difficult 1-on-1s, constructive feedback, and conflict resolution with conversational AI avatars. | `og-leadership-1200x630.png` |
| **Solutions: Sales (`/solutions/sales-enablement`)** | `Sales & CS Role-Play Simulation Engine | Lectory` | Master high-stakes objection handling and customer negotiations with dynamic, conversational AI avatars. | `og-sales-1200x630.png` |
| **Solutions: Onboarding (`/solutions/onboarding`)** | `Interactive New Hire Onboarding Simulations | Lectory` | Immerse new hires into company culture and compliance policies through live conversational avatar scenarios. | `og-onboarding-1200x630.png` |
| **Integrations (`/integrations`)** | `LMS & Enterprise Integrations (SCORM, xAPI, SSO) | Lectory` | Plug Lectory directly into Workday, Cornerstone, Slack, Teams, and standard LMS systems with 1-click SCORM 1.2/2004 and xAPI export. | `og-integrations-1200x630.png` |
| **Security (`/security`)** | `Security, Privacy & Trust Center | Lectory` | Enterprise-grade security: SOC2 alignment, GDPR compliance, SAML SSO, encryption, and zero customer data AI training retention. | `og-security-1200x630.png` |
| **Pricing (`/pricing`)** | `Transparent Pricing for Teams & Enterprises | Lectory` | Predictable seat-based pricing for standalone cohort dispatch or enterprise LMS-integrated deployment. | `og-pricing-1200x630.png` |

### 6.5 JSON-LD Structured Data Schema

Every page includes an `Organization` and `SoftwareApplication` JSON-LD graph in the `<head>`:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lectory.dev/#organization",
      "name": "Lectory",
      "url": "https://lectory.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lectory.dev/images/lectory-logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.linkedin.com/company/lectory",
        "https://twitter.com/lectorydev"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://lectory.dev/#software",
      "name": "Lectory Enterprise Simulation Platform",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser (WebGL / WebGPU)",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD"
      },
      "description": "Enterprise AI avatar simulation platform for interactive corporate training, leadership role-play, and compliance."
    }
  ]
}
```

