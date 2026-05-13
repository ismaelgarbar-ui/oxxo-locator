---
name: OXXO Store Locator
description: Warm, motion-forward mobile PWA for finding and navigating to OXXO stores across Mexico.
colors:
  brand-red: "#EE1C25"
  brand-red-deep: "#C41019"
  brand-yellow: "#F5A800"
  off-white: "#F7F7F7"
  surface-white: "#FFFFFF"
  surface-secondary: "#F2F2F2"
  border-subtle: "#E2E2E2"
  text-primary: "#1A1A1A"
  text-muted: "#717171"
  text-subtle: "#ADADAD"
  dark-bg: "#0D0D0D"
  dark-surface: "#181818"
  dark-surface-secondary: "#242424"
  dark-border: "#2E2E2E"
  dark-text: "#F0F0F0"
  dark-text-muted: "#A0A0A0"
  status-open: "#059669"
  status-atm: "#2563EB"
  status-payments: "#D97706"
  status-transfer: "#059669"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Plus Jakarta Sans, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Plus Jakarta Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Plus Jakarta Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.brand-red-deep}"
    textColor: "{colors.surface-white}"
  button-ghost:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-icon:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    size: "36px"
  store-card:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  store-card-selected:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.brand-red}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  filter-chip:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  filter-chip-active:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  input-search:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Design System: OXXO Store Locator

## 1. Overview

**Creative North Star: "The Friendly Urban Guide"**

This system is built for the corner of a busy street, not a corporate lobby. The OXXO Store Locator answers one question faster than any other app: "Is there an OXXO nearby, and can it help me right now?" Every decision in this system flows from that moment: a person on a sidewalk, thumb on glass, 30 seconds to spare.

The personality is warm and direct. Brand confidence comes from speed and warmth, not from polish or grandeur. Plus Jakarta Sans brings a humanist quality that keeps the interface from feeling clinical — it has weight without aggression, personality without whimsy. Motion is purposeful and physical: things enter from where they come from, exit toward where they go, and respond to touch with immediate, satisfying feedback.

This system explicitly rejects the sterile aesthetic of corporate retail locators, the badge-clutter logic of delivery apps, and the productivity-tool density of SaaS dashboards. It is a consumer app for a neighborhood brand, and it should feel like one: familiar, warm, faster than expected.

**Key Characteristics:**
- Brand red used sparingly as a signal, not a wallpaper
- Mobile-first layout with thumb-zone awareness throughout
- Motion-forward interactions that feel physical and immediate
- Dual-mode color system (light and dark) with consistent warmth in both
- Typography hierarchy driven by weight contrast, not size alone

## 2. Colors: The Neighborhood Palette

A restrained palette anchored by OXXO's iconic red. The system earns warmth through off-white backgrounds and soft borders, not through color saturation.

### Primary
- **OXXO Signal Red** (#EE1C25): The brand's primary action color. Used on primary buttons, active filter chips, selected store cards, and focus rings. Its rarity is its impact — it should never appear as decoration.
- **Deep Confirmation Red** (#C41019): Hover and pressed state for red interactive elements. Signals commitment without alarming.

### Secondary
- **Amber Warmth** (#F5A800): Payment-related service badges and secondary brand emphasis. Warm without being loud. Used at low saturation (`bg-amber-50`, `bg-amber-900/20` dark) so it reads as a tint, not a shout.

### Neutral
- **Quiet Canvas** (#F7F7F7): App background in light mode. Warmer than pure white, reduces eye fatigue in outdoor and transit use.
- **Surface White** (#FFFFFF): Card surfaces and input backgrounds. Reserved for elevated content.
- **Soft Layer** (#F2F2F2): Secondary surface — input fields, filter chip resting state.
- **Whisper Border** (#E2E2E2): Dividers and container boundaries. Visible but not structural.
- **Ink** (#1A1A1A): Primary text. Almost-black with just enough depth to avoid harshness.
- **Annotation** (#717171): Secondary text, metadata, distance labels.
- **Ghost** (#ADADAD): Tertiary text, placeholders, disabled states.

### Status Colors
- **Open / Active / Transfer** (#059669, emerald): Positive status — open, active services, money transfer.
- **ATM** (#2563EB, blue): ATM availability badge.
- **Payments** (#D97706, amber): Payment services badge.

### Named Rules
**The One Voice Rule.** The brand red appears on ≤10% of any given screen. One primary button, one active filter, one selected card state — not all three at once. Its scarcity is the message.

**The Dark Mode Warmth Rule.** Dark mode neutrals are warm-dark, not cold-dark. `#0D0D0D` background and `#181818` surfaces are slightly warm. Never use pure `#000000`.

## 3. Typography

**Display / Body Font:** Plus Jakarta Sans (Google Fonts, variable)
**Fallback stack:** Arial, sans-serif

**Character:** Plus Jakarta Sans is a humanist geometric sans — it has the warmth of a rounded typeface without the childishness. At heavy weights (800, 700) it carries brand authority; at regular weight (400) it reads cleanly in small sizes on mobile screens. No serif companion is needed: the weight range provides sufficient hierarchy.

### Hierarchy
- **Display** (800, 1.5rem/24px, line-height 1.1): Store names in detail sheets, primary header moments. Rarely used — reserved for the one thing that matters most on screen.
- **Headline** (700, 1.25rem/20px, line-height 1.2): Section headers, panel titles.
- **Title** (600, 1rem/16px, line-height 1.3): Card store names, list item primaries, form labels.
- **Body** (400, 0.875rem/14px, line-height 1.5): Address details, status info, description text. The workhorse weight for most readable content. Max line length 65ch.
- **Label** (500, 0.75rem/12px, line-height 1.4, tracking +0.01em): Badge text, distance chips, metadata tags. Never all-caps; tracked slightly for legibility at small sizes.

### Named Rules
**The Weight-First Rule.** Hierarchy is established through weight contrast (400 → 600 → 700 → 800), not through size jumps. A Title at 1rem/600 reads as more important than Body at 0.875rem/400 without needing a size increase. Use size escalation sparingly — it disrupts rhythm on mobile.

## 4. Elevation

This system uses a **structured shadow vocabulary**, not flat tonal layering. Shadows are ambient and soft — they create depth without drama. In dark mode, shadows increase in opacity to maintain relative depth perception against dark backgrounds.

Cards at rest carry minimal shadow; hover and selected states trigger a promoted shadow. Bottom sheets use an upward shadow to anchor them above the map layer. Floating action buttons use a red-tinted shadow to tie the elevation to the brand.

### Shadow Vocabulary
- **Card resting** (`0 1px 3px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.10)`): Default card elevation. Barely visible; signals containment.
- **Card elevated** (`0 4px 8px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.18)`): Hover and selected card state. Promotes the card without lifting it aggressively.
- **Sheet** (`0 -8px 40px rgba(0,0,0,0.18)`): Bottom sheet shadow — upward direction only. Separates the sheet from the map behind it.
- **Floating action** (`shadow-lg + brand-red/20 tint`): FAB and locate button. The red tint ties the floating element to the brand action.

### Named Rules
**The State-Driven Elevation Rule.** Surfaces are flat or minimal at rest. Shadow promotion happens only in response to state: hover, selection, floating. Don't add shadows to surfaces that don't need to be perceived as elevated.

## 5. Components

### Buttons
Buttons are rounded-full — pill-shaped. This is a deliberate choice for a mobile consumer app; it feels approachable and thumb-friendly.
- **Shape:** Fully rounded (9999px / `rounded-full`)
- **Primary:** OXXO Signal Red background (#EE1C25), white text, 10px/20px padding, font-weight 600.
- **Hover / Focus:** Deep Confirmation Red (#C41019) background, `translateY(-2px)` lift, 200ms ease-out transition. Focus: 2px ring at `brand-red/20`.
- **Ghost / Secondary:** Soft Layer (#F2F2F2) background, Ink text, same shape. Used for secondary actions (Cancel, filter options at rest).
- **Icon button:** 36×36px, rounded-full, Surface White background, Annotation text. Used for header actions (dark mode toggle, close, back).
- **Pressed:** `scale(0.95)` via Framer Motion `whileTap`. Immediate, physical feedback.

### Filter Chips
- **Style:** Soft Layer background (#F2F2F2), Annotation text (#717171), rounded-full, 6px/14px padding, Label typography.
- **Active state:** OXXO Signal Red background, white text. One chip can be active per filter group; "All" returns to neutral.
- **Hover:** Subtle border transition + lift.

### Cards (Store Cards)
Store cards are the primary content unit in list view. They must communicate store identity, distance, status, and key services at a glance.
- **Corner Style:** Gently rounded (16px radius / `rounded-2xl`)
- **Background:** Surface White (#FFFFFF) in light mode, Dark Surface (#181818) in dark mode.
- **Shadow Strategy:** Card resting shadow at default; Card elevated shadow on hover and selected state.
- **Border:** None by default. Selected state: 1.5px solid OXXO Signal Red.
- **Internal Padding:** 16px (`p-4`)
- **Selected state:** Red border + elevated shadow + red text for store name. Never a left-stripe accent — full border only.

### Bottom Sheet (Store Detail)
The primary detail surface. Slides up from below the map on store selection.
- **Corner Style:** 24px top-left and top-right radius (`rounded-3xl`), square bottom edges.
- **Background:** Surface White / Dark Surface.
- **Shadow:** Sheet shadow (upward) to lift above the map.
- **Drag handle:** 4px×32px pill, centered, Whisper Border color.
- **Max height:** 87vh with internal scroll. Overscroll contained.
- **Entry animation:** `slide-up` (300ms, `cubic-bezier(0.22, 1, 0.36, 1)`).

### Inputs / Fields
- **Style:** Soft Layer background (#F2F2F2), Whisper Border border (1px), 12px radius.
- **Focus:** 2px ring at `brand-red/20`, border shifts to OXXO Signal Red.
- **Placeholder:** Ghost color (#ADADAD).
- **Icon:** Leading search icon in Annotation color (#717171); clears to red on focus.

### Navigation (App Header)
- **Style:** Surface White / Dark Surface background, glass effect on scroll (`backdrop-filter: blur(12px)`).
- **Logo:** OxxoLogo component, sm size (76×32px) in header.
- **Actions:** Icon buttons (36px pill) for locate, dark mode, admin link.
- **Tab switcher:** "Map" / "List" text tabs with animated red underline indicator. Font weight 600 active, 400 inactive.

### Service Badges
Compact, color-coded chips that communicate service availability at a glance.
- **ATM:** Blue tint (`bg-blue-50` / `bg-blue-900/20` dark), blue text. MapPin-variant icon.
- **Payments:** Amber tint (`bg-amber-50` / `bg-amber-900/20` dark), amber text.
- **Money Transfer:** Emerald tint (`bg-emerald-50` / `bg-emerald-900/20` dark), emerald text.
- **All badges:** rounded-full, Label typography, 4px/10px padding.

### Skeleton Loaders
Used during initial data fetch and map tile loading. Shimmer animation (1.4s linear infinite) from Soft Layer (#F2F2F2) through Whisper Border (#E2E2E2) and back.

## 6. Do's and Don'ts

### Do:
- **Do** use `prefers-reduced-motion` to disable or reduce Framer Motion animations for users who request it. Every `whileTap`, `whileHover`, and entry animation should have a no-op fallback.
- **Do** use the brand red exclusively for primary actions, active states, selected states, and focus rings. Never as a background fill for a section, header, or card.
- **Do** size all tap targets to a minimum of 44×44px. The locate button, icon buttons, and filter chips are used one-handed on a phone — make them generous.
- **Do** use full borders (all four sides, or a background tint) to indicate selection or focus on cards and list items. Selection is a full border in brand red.
- **Do** maintain the warmth rule in dark mode: use `#0D0D0D` background and `#181818` surfaces — never `#000000`.
- **Do** apply screen reader labels to every icon-only button: locate ("Find my location"), dark mode toggle ("Switch to dark mode"), navigation launchers ("Open in Google Maps").
- **Do** use staggered entry animations (`stagger` class, 50ms increments) when rendering a list of store cards. It communicates the list's structure and gives the user a moment to orient.

### Don't:
- **Don't** use a colored left-stripe border (`border-left` greater than 1px) on cards, list items, or callouts. Selection is communicated via full border + shadow, never a side accent. This pattern is prohibited.
- **Don't** use gradient text (`background-clip: text` with a gradient). Brand emphasis is achieved through weight and size, not decoration.
- **Don't** create a corporate retail locator aesthetic: no paginated results tables, no "Enter ZIP code" hero, no sterile form-based search as the primary entry point.
- **Don't** replicate delivery app UI patterns: no identical card grids with icon + heading + body text repeated endlessly, no bottom navigation with 5 tabs, no badge overload on store cards.
- **Don't** use glassmorphism as a default surface treatment. The `.glass` class exists for the header on scroll and modal backdrops only — purposeful blur, not decorative.
- **Don't** introduce sidebar navigation, data tables, or dense multi-column layouts on the customer-facing surface. This is a mobile consumer app, not a dashboard.
- **Don't** use `#000000` or `#ffffff` as literal values anywhere. Every neutral is tinted — Ink (#1A1A1A) for dark text, Off-White (#F7F7F7) for backgrounds.
- **Don't** add shadows to surfaces that are already elevated by color contrast or context. The Sheet shadow, Card elevated shadow, and FAB tinted shadow are the three named shadow moments. Don't invent new ones.
