# Marketing Website Requirements

> Note: Product features, architectural specifications, and core value propositions are governed by [product_requirements.md](./product_requirements.md). This document defines the information architecture, page layouts, navigation, and technical UX requirements for the corporate marketing website (lectory.dev).

---

## 1. Target Audience & Buyer Intent

The marketing site addresses enterprise buyer and evaluator personas:
1. **Decision Makers (CLO, VP of HR, VP of Talent):** Focus on training ROI, completion rates, audit readiness, and replacing passive video LMS courses with interactive simulations.
2. **Operational Champions (L&D Managers, Compliance Officers):** Focus on frictionless rollout, automated rubric scoring, and lean admin overhead.
3. **Internal Authors & SMEs (Instructional Designers):** Focus on zero video studio bottlenecks, instant (<10s) policy updates, and intuitive scenario drafting.
4. **Enterprise IT & Security Evaluators:** Focus on edge security, GDPR/compliance geofencing, and zero customer data AI training retention.

---

## 2. Design & Layout Principles (Function Over Flash)

- **Zero Scroll-Jacking:** Standard native document scrolling only. No hijacked mouse wheels, no infinite scroll loops, and no sluggish parallax animations.
- **Outcome-Led Visual Hierarchy:** Crisp contrast, clear typography, and direct B2B messaging over decorative clutter.
- **100% Static HTML Architecture:** The marketing site is strictly static HTML, CSS, and vanilla JS in the web/ package folder. It contains **zero auth state, zero user session management, and zero trial compute/AI runtime logic**.
- **Direct Application Handoff:** All application actions (*Sign In*, *Go to App*, *Try a Class*) link directly out to the dedicated application domain (https://app.lectory.dev) with standardized UTM and intent query parameters.

---

## 3. Header Navigation & Responsive Contract

### 3.1 Desktop Layout (`≥ 768px`)
```text
[ LOGO ]        Features    Solutions    About    Contact        [ Sign In ]   [ Go to App ]
```
- **Brand Logo:** Logo lockup linking to `/index.html`
- **Center Nav Links:**
  - `Features` → `/#features` (anchor link to Home features section)
  - `Solutions` → `/#solutions` (anchor link to Home corporate training use cases)
  - `About` → `/#about` (anchor link to company mission & approach)
  - `Contact` → `/contact.html` (dedicated inquiry & demo booking page)
- **Right Action CTAs:**
  - `Sign In` (text link) → `https://app.lectory.dev/login`
  - `Go to App` (primary button) → `https://app.lectory.dev`

### 3.2 Mobile Layout & Responsive Breakpoint (`< 768px`)
```text
[ LOGO ]                                                                 [ ☰ MENU ]
┌─────────────────────────────────────────────────────────────────────────────────┐
│ • Features (/#features)                                                         │
│ • Solutions (/#solutions)                                                       │
│ • About (/#about)                                                               │
│ • Contact (/contact.html)                                                       │
│ ─────────────────────────────────────────────────────────────────────────────── │
│ [ Sign In ]                                                                     │
│ [ Go to App ] (Primary CTA)                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Header Bar (Mobile):** Shows brand logo on the left and an accessible hamburger toggle button on the right. Inline navigation links and desktop action buttons are hidden from the top bar.
- **Hamburger Toggle Element:** `<button class="nav-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle navigation">` with animated 3-bar / close cross icon.
- **Mobile Drawer / Panel (`#mobile-nav`):** Full-width or right-anchored slide-down overlay container containing all 4 navigation links and stacked action CTAs (`Sign In` and `Go to App`).

### 3.3 Interactive & State Mechanics (Mobile Menu)
- **Zero Heavy Framework Invariant:** Mobile navigation toggle must use lightweight vanilla JS (<35 LOC) or native CSS toggle without adding third-party UI libraries.
- **Accessibility & ARIA Contract:**
  - Toggle button toggles `aria-expanded="true"` / `aria-expanded="false"` and `is-open` class on the navigation drawer.
  - Pressing the `Escape` key immediately closes the open drawer and returns focus to the toggle button.
  - Clicking any navigation link inside the drawer automatically dismisses the drawer.
  - Clicking outside the drawer (backdrop overlay) closes the menu.
- **Body Scroll Lock:** When the mobile menu drawer is open, scrolling on `document.body` should be locked (`overflow: hidden`) to prevent background scroll drift.

> **Note on Pricing:** Public self-serve pricing tiers are excluded at launch during private beta / design partner phase. All commercial demand and demo requests are channeled directly through the **Contact** page.

---

## 4. Static Page Breakdown & Routing Contract

The entire marketing website is fulfilled with **3 content pages + 2 legal pages + 1 recovery page**:

### 4.1 Home (index.html)
- **Outcome-Led Hero:**
  - *Layout:* Asymmetric 2-column split (60% content / 40% visual card).
  - *Left Column:* Category eyebrow badge (`AI-NATIVE COMPLIANCE & TRAINING`), outcome-led H1, sub-headline, proof metric badges (completion rates, cost per trained employee, rollout speed), and dual CTA button group (`Go to App` primary, `Try a Class` secondary deep-link).
  - *Right Column:* Elevated preview card container displaying a simulated AI classroom session with live avatar prompt exchange.
  - *Responsive Behavior:* Stacks into single column on mobile (< 768px), prioritizing headline and CTAs above the fold.
- **Social Proof & Comparison Matrix:**
  - *Layout:* Centered 2-column comparison table directly contrasting `Legacy LMS Platforms` against `Lectory Lean Admin`.
  - *Metrics Highlighted:* Time-to-publish (<10s vs weeks), compliance audit exports (1-click vs manual), and video rendering compute (zero vs studio re-encoding).
- **Key Features Section (`id="features"`):**
  - *Layout:* 3-column responsive card grid (1 column on mobile, 3 columns on desktop `≥ 1024px`).
  - *Card Structure:* Top icon badge, bold title, 2-line feature description, and outcome bullet:
    1. *Zero Video Pipeline:* Render at playback; instant policy updates without studio re-recording.
    2. *Conversational AI Avatars:* Real-time voice and chat simulations replacing passive video lectures.
    3. *Audit-Ready Compliance:* Automated rubric scoring and verifiable completion logs.
- **Solutions Section (`id="solutions"`):**
  - *Layout:* 3 persona-oriented horizontal use-case cards with badge chips and outcome summaries:
    1. *Compliance & Ethics Simulations:* Branching real-time scenario evaluations.
    2. *Managerial Role-Play Sandboxes:* Low-stakes 1-on-1 feedback and difficult conversation practice.
    3. *Interactive Onboarding Immersion:* First-week active culture and policy assimilation.
- **About Section (`id="about"`):**
  - *Layout:* Centered single-column editorial narrative block on Lectory's core mission: shifting corporate learning from passive video consumption to experiential practice.
- **Bottom CTA Banner:**
  - *Layout:* Full-width high-contrast container with centered bold headline, secondary trial explanation, and primary launch button (`Launch Lectory Now` → `https://app.lectory.dev`).

### 4.2 Contact & Inquiries (contact.html)
- Clean B2B sales and demo inquiry form.
- Pre-configured to route messages directly to contact@lectory.dev via **Cloudflare Email Routing**.
- Direct contact details and partnership inquiries.

### 4.3 Terms of Service (	os.html / 	erms.html)
- Commercial terms, customer AI content ownership, uptime SLA, and governing jurisdiction.

### 4.4 Privacy Policy & Trust (privacy.html)
- Zero-retention model training disclosures, sub-processor list, and dedicated **Security & Trust (id=security)** section.

### 4.5 404 Recovery (404.html)
- Branded recovery page with clear navigation back to Home.

---

## 5. Footer Structure

`
┌─────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] Lectory                                                              │
│ Real-time AI avatar simulations for enterprise training & compliance.       │
├──────────────────────┬─────────────────────────┬────────────────────────────┤
│ **Platform**         │ **Company**             │ **Trust & Legal**          │
│ • Features (/#feat)  │ • About Us (/#about)    │ • Terms of Service (tos)   │
│ • Solutions (/#sol)  │ • Contact (/contact.html│ • Privacy Policy (privacy) │
│ • Go to App (↗)      │                         │ • Security (privacy#sec)   │
├──────────────────────┴─────────────────────────┴────────────────────────────┤
│ © 2026 Lectory, Inc. All rights reserved.             [GitHub] [X] [LinkedIn]│
└─────────────────────────────────────────────────────────────────────────────┘
`

- **Brand Column:** Logo lockup + company mission tagline.
- **Column 1 (Platform):**
  - Features (/#features)
  - Solutions (/#solutions)
  - Go to App (https://app.lectory.dev)
- **Column 2 (Company):**
  - About Us (/#about)
  - Contact Sales / Inquiries (/contact.html)
  - System Status (#status)
- **Column 3 (Trust & Legal):**
  - Terms of Service (/tos.html)
  - Privacy Policy (/privacy.html)
  - Security & Trust (/privacy.html#security)
- **Bottom Bar:**
  - Copyright: © 2026 Lectory, Inc. All rights reserved.
  - Social Links: GitHub, X (Twitter), LinkedIn

---

## 6. Universal HTML <head> Metadata, SEO & Social Share

All static pages implement a uniform <head> contract:

### 6.1 Base Metadata & Favicons
`html
<meta charset=UTF-8 />
<meta name=viewport content=width=device-width, initial-scale=1.0 />
<link rel=icon type=image/svg+xml href=/favicon.svg />
<link rel=alternate icon type=image/x-icon href=/favicon.ico />
<link rel=apple-touch-icon href=/apple-touch-icon.png />
<link rel=manifest href=/site.webmanifest />
`

### 6.2 Open Graph & Twitter Cards
`html
<meta property=og:type content=website />
<meta property=og:site_name content=Lectory />
<meta property=og:title content=Lectory — Enterprise AI Avatar Simulation Platform />
<meta property=og:description content=Replace passive corporate training videos with real-time interactive AI avatar role-plays and automated rubric scoring. />
<meta property=og:image content=https://lectory.dev/brand/og-share.png />

<meta name=twitter:card content=summary_large_image />
<meta name=twitter:title content=Lectory — Enterprise AI Avatar Simulation Platform />
<meta name=twitter:description content=Replace passive corporate training videos with real-time interactive AI avatar role-plays and automated rubric scoring. />
<meta name=twitter:image content=https://lectory.dev/brand/og-share.png />
`

---

## 7. App Link & CTA Boundary Contract

| CTA Element | Destination URL | Behavioral Boundary |
| :--- | :--- | :--- |
| **Sign In** | https://app.lectory.dev/login | Direct link to web app login screen. |
| **Go to App** | https://app.lectory.dev | Launches main web application player. |
| **Try a Class** | https://app.lectory.dev?trial=compliance | Boots directly into interactive roleplay trial sandbox. |
| **Contact / Book Demo** | /contact.html | Opens static contact form (routed via Cloudflare Email Routing). |
