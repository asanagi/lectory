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

## 3. Header Navigation

`
[ LOGO ]        Features    Solutions    About    Contact        [ Sign In ]   [ Go to App ]
`

- **Brand Logo:** Logo lockup linking to /index.html
- **Center Nav Links:**
  - Features → /#features (anchor link to Home features section)
  - Solutions → /#solutions (anchor link to Home corporate training use cases)
  - About → /#about (anchor link to company mission & approach)
  - Contact → /contact.html (dedicated inquiry & demo booking page)
- **Right Action CTAs:**
  - Sign In (text link) → https://app.lectory.dev/login
  - Go to App (primary button) → https://app.lectory.dev

> **Note on Pricing:** Public self-serve pricing tiers are excluded at launch during private beta / design partner phase. All commercial demand and demo requests are channeled directly through the **Contact** page.

---

## 4. Static Page Breakdown & Routing Contract

The entire marketing website is fulfilled with **3 content pages + 2 legal pages + 1 recovery page**:

### 4.1 Home (index.html)
- **Outcome-Led Hero:** Headline focused on replacing passive training videos with real-time conversational AI avatar simulations + primary CTA (Go to App / Try a Class).
- **Social Proof / Customer Validation:** Enterprise logos & trust metrics.
- **Legacy LMS vs. Lectory Comparison Section:** Side-by-side comparison table from product_requirements.md.
- **Key Features Section (id=features):**
  - Zero video rendering pipeline (<10s policy edits).
  - Real-time conversational AI avatar simulation (voice & chat).
  - Automated rubric scoring & audit-ready compliance reporting.
- **Solutions Section (id=solutions):**
  - Compliance & ethics training simulations.
  - Safe manager role-play sandbox (1-on-1s, feedback, difficult conversations).
  - Interactive onboarding immersion.
- **About Section (id=about):**
  - The Lectory mission: moving enterprise learning from passive video consumption to experiential practice.
- **Bottom CTA Banner:** Direct link to app player.

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
