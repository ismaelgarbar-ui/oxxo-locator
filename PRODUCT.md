# Product

## Register

product

## Users

Two distinct audiences:

**End customers (primary):** People on their phones in or near a neighborhood, needing quick answers: Is there an OXXO nearby? Is it open right now? Does it have an ATM? They are in motion, often impatient, likely unfamiliar with the area. The app must answer in two taps or less and hand off to navigation instantly.

**Store ops / admin staff (secondary):** OXXO staff or franchise managers who maintain store data — hours, services, active status. They use the admin panel on desktop or tablet, in a quieter context, with time to read and verify before saving changes.

## Product Purpose

A mobile-first PWA that helps customers locate the nearest OXXO store, check its status and services, and navigate to it. A secondary admin panel lets staff manage store records. Success means a customer finds and reaches their store in under 30 seconds from opening the app.

## Brand Personality

Warm, local, approachable. OXXO is a neighborhood institution across Mexico — familiar, reliable, always nearby. The app should feel like a knowledgeable local friend who knows every store on the block, not a corporate directory. Brand confidence comes from warmth and speed, not from formality or polish for its own sake.

Reference: Starbucks app — brand-forward consumer experience where the brand personality reinforces every interaction, not just the hero screen.

## Anti-references

- Corporate retail locators (Walmart, Costco, Sam's Club): sterile table layouts, dense forms, search boxes that feel like a 2008 enterprise tool. No paginated results tables. No "Enter ZIP code" hero patterns.
- Generic food-delivery apps (Rappi, Uber Eats): badge overload, bottom-nav clutter, carousel grids of identical cards. No hero-metric templates or "explore nearby" category grids.
- SaaS dashboards (Airtable, Notion, Linear): productivity-tool aesthetic is wrong register for a consumer store finder. No sidebar navigation, no data-dense table views in the customer-facing side.

## Design Principles

1. **Answer before the question is asked.** Use geolocation proactively. The closest stores should be visible on open, not after a search.
2. **The brand red earns its place.** OXXO's red is a powerful signal. Use it on actions and state indicators only — never as decoration. Its rarity is its impact.
3. **Warm utility.** Every screen should feel like it was designed for a specific person in a specific moment: someone standing on a corner checking if this store has an ATM. Utility and warmth are not opposites.
4. **Mobile first, always.** The customer-facing surface is a phone app. Desktop considerations are secondary. Interactions are designed for thumbs, not cursors.
5. **Brand carries through both surfaces.** The admin panel is not a different product. It shares the same typography, color language, and motion principles — just at a lower density and more deliberate pace.

## Accessibility & Inclusion

WCAG 2.1 AA compliance. Key considerations:
- Sufficient color contrast for all text on both light and dark backgrounds, including the brand red on white surfaces.
- Touch targets minimum 44×44px for all interactive elements.
- Focus states visible and unambiguous (not just color-coded).
- Reduced-motion support via `prefers-reduced-motion` for the Framer Motion animations.
- Screen reader labels for icon-only buttons (locate, dark mode toggle, navigation launchers).
