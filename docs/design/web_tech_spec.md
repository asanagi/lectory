# Lectory Web Technical Specification (`web_tech_spec.md`)

Technical architecture, build scripts contract, static entry points, brand asset specifications, and deployment target for `lectory.dev`.

---

## 1. Architecture & Tooling

- **Stack:** Multi-Page Static Site (MPA) built with [Vite](https://vitejs.dev/) in the `web/` package folder.
- **Rationale:** Zero runtime server framework overhead, instant edge delivery, direct SEO crawlability, and sub-second asset hydration.
- **Output Target:** `dist/` containing compiled HTML, CSS, optimized SVGs, and hashed static assets.

---

## 2. Scripts Contract (`package.json`)

```json
{
  "name": "lectory-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

- `npm run dev` — Local development server with Hot Module Replacement (HMR) at `http://localhost:8080`.
- `npm run build` — Compiles static multi-page bundle to `dist/`.
- `npm run preview` — Serves the production build locally at `http://localhost:8080` for pre-flight verification.

### Local Port Allocation Convention

| Service / Layer | Local Port / Origin | Configuration | Purpose |
| :--- | :--- | :--- | :--- |
| **`web` (Marketing Site)** | `http://localhost:8080` | `server: { port: 8080, strictPort: true }` | Public marketing site, landing pages, and docs |
| **`app` (Web Application)** | `http://localhost:8081` | `server: { port: 8081, strictPort: true }` | Core interactive app & learner simulation studio |
| **`services` (Backend / APIs)** | `http://localhost:8082+` | Configured per service | Core API endpoints (`8082`), AI worker services (`8083`), etc. |

---

## 3. Static Entry Points & Routing Contract

| Route / File | Purpose | Key Elements & Section Anchors |
| :--- | :--- | :--- |
| `index.html` | Homepage & Core Pitch | Hero, LMS Comparison, `#features` (AI Avatar Skits), `#solutions` (Compliance & Roleplay), `#about`, CTA |
| `contact.html` | Sales & Demo Inquiries | Inquiry form (pre-configured to route to `contact@lectory.dev`) |
| `terms.html` / `tos.html` | Terms of Service | Commercial terms, AI content ownership, SLA, governing jurisdiction |
| `privacy.html` | Privacy Policy & Trust | Zero-retention model training disclosures, sub-processors, `#security` |
| `404.html` | Error Recovery | Branded recovery page with "Return to Home" button |

### App CTA Boundary
- The static marketing site has **zero auth state and zero runtime database logic**.
- All application action CTAs link directly to the web app:
  - `Sign In` → `https://app.lectory.dev/login`
  - `Go to App` / `Try a Class` → `https://app.lectory.dev`

---

## 4. Brand Assets & Favicon Suite

All vector and favicon assets live under `public/` and are copied directly into `dist/` at build time.

### Vector Brand Assets (`public/brand/`)
- `brandmark.svg` — Standalone geometric avatar symbol.
- `wordmark.svg` — Clean typographic logotype.
- `logo.svg` — Combined horizontal lockup (`brandmark.svg` + `wordmark.svg`).

### Complete Favicon Suite (`public/`)
- `favicon.svg` — Modern scalable vector favicon with dark/light mode support.
- `favicon.ico` — Legacy 32×32 fallback favicon.
- `apple-touch-icon.png` — 180×180 PNG for iOS home screen bookmarks.
- `site.webmanifest` — PWA manifest specifying `name`, `short_name`, `theme_color`, and icon sizes.

### Raster & Artwork Assets (`public/images/`)
- `hero_illustration.png` — High-resolution hero section graphical artwork.
- `pillar_1.png`, `pillar_2.png`, `pillar_3.png` — Feature card visual artwork references.

---

## 5. Deployment Target & Edge Configuration

- **Host:** Cloudflare Workers Static Assets (`web` worker).
- **Configuration:** `wrangler.toml` targeting `dist/`.
- **CI/CD:** Automated deployment via `.github/workflows/deploy-web.yml` on push to `main`.
- **Edge Security & Compliance:**
  - Cloudflare Custom WAF Rule: Geofence non-launch jurisdictions at the edge.
  - Cloudflare Email Routing: `contact@lectory.dev` forwarding to administrative inbox.
