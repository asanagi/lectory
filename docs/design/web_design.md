# Lectory Web Design Specification

Tokens, typography, theme choices, and visual layout principles for `lectory.dev`.

## Selected Theme: Modern Dark Slate & Indigo Gradient
- **Background Main:** `#090d16` (Deep Midnight Dark)
- **Card Background:** `#131b2e` (Navy Slate)
- **Surface Elevation:** `#1e293b` (Elevated Slate)
- **Primary Accent:** `#4f46e5` (Indigo)
- **Secondary Accent:** `#06b6d4` (Cyan)
- **Gradient Rule:** `linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)`
- **Text Main:** `#f8fafc`
- **Text Muted:** `#94a3b8`
- **Text Dim:** `#64748b`

## Typography
- **Primary Font:** Inter, system-ui, -apple-system, sans-serif
- **Hero Title:** 3.5rem (56px), 800 Weight, -0.03em tracking
- **Section Headers:** 2.25rem (36px), 700 Weight, -0.02em tracking
- **Body Text:** 1rem / 1.6 line height

## Layout Architecture & Accessibility
- **Equal-Height Cards:** All grid cards (`.grid-3 .card`, `.pricing-card`) use flexbox column layout with `height: 100%` and `flex: 1` body containers.
- **Sticky Navigation:** Fixed 72px navbar with backdrop blur (`rgba(9, 13, 22, 0.85)` + `blur(12px)`).
- **Accessibility Floor (WCAG AA):** High-contrast text ratios (>4.5:1 for body, >3:1 for headers), visible focus rings for keyboard navigation, and explicit image `alt` attributes.
