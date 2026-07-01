# Konstru — PRD

## Original problem statement
Build a landing page for an app called Konstru (Construction Calculator) — a single-page React construction-estimating calculator built for Philippine residential/light-commercial construction. Quantity takeoff + Bill of Quantities (BOQ) engine in PHP with 14 calculation modules across Earthworks, Structural Concrete, Masonry, Finishes, and Site/Other. The current task scope is the marketing landing page + login/signup pages only.

## User decisions (locked)
- Scope: **Landing + Login + Signup only** (option A — no dashboard, no calculator behind the auth yet).
- Auth: **Supabase placeholder** — user has not provisioned a Supabase project yet, so login/signup UI is fully built but the submit handler just surfaces a toast informing the user that the auth backend is not connected.
- Visual: **Bold/editorial typography** (archetype: Swiss & high-contrast, brutalist editorial). Fonts: Outfit (display), Manrope (body), IBM Plex Mono (labels/numbers).
- Sections: **All standard** — Hero, Stats, Features (14 modules across 5 categories), How it works, Sample BOQ, Pricing, Testimonials, FAQ, Footer.
- Pricing: **PHP placeholder tiers** — Free (₱0), Pro (₱499/mo, highlighted), Team (₱1,499/mo).

## Personas
- Filipino civil engineers preparing BOQs for residential/light-commercial builds.
- Independent contractors estimating jobs in PHP.
- Homeowners self-managing renovations or new builds.

## What's been implemented (Dec 2025)
- Routes: `/` (Landing), `/login`, `/signup` — react-router v7.
- Custom design system in `/app/frontend/src/index.css` (CSS variables, custom buttons, blueprint grid, marquee animation, IKB blue + Safety Orange).
- Landing sections (in `/app/frontend/src/pages/Landing.jsx`):
  - Sticky Navbar with mobile hamburger menu (`/app/frontend/src/components/Navbar.jsx`).
  - Hero with editorial typography, eyeline label, spec sheet card, primary + secondary CTAs.
  - Marquee ribbon (`Marquee.jsx`) cycling all 14 module names.
  - Stats strip (4 cells).
  - Features bento grid — 5 module category cards with module pills (Earthworks, Structural Concrete, Masonry, Finishes, Site & Other).
  - How it works — 3 steps (Input dimensions → BOM → BOQ in PHP).
  - Sample BOQ — dark themed example output with grand total ₱ 1.75M.
  - Pricing — 3 tiers (Free / Pro / Team) with Pro tier dark-highlighted.
  - Testimonials — 2 cards with Filipino engineer portraits.
  - FAQ — 6 accordion items.
  - Footer — massive editorial "Let's build." headline with link columns.
- Auth pages — split-screen layout. Forms (email/password, signup adds name + terms checkbox), validation, password visibility toggle, Google placeholder button, sonner toasts.
- Data model in `/app/frontend/src/lib/modules.js`: MODULE_CATEGORIES (14 modules across 5 cats), PRICING_TIERS, FAQS, TESTIMONIALS.
- Fixed CRA + webpack-dev-server v5 incompatibility by pinning resolution to `4.15.2`.
- All interactive elements ship with kebab-case `data-testid`.

## Testing
- iteration_1.json — 65/65 frontend assertions passed.

## Prioritized backlog
### P0 (next session, when user is ready)
- Wire Supabase auth (project URL + anon key) into Login/Signup; add `/dashboard` route guard.

### P1
- Integrate the actual Konstru calculator app (the 14 modules described in the problem statement) behind login.
- Persist projects per-user (Supabase Postgres or Mongo via FastAPI backend).
- PDF / Excel export of BOQ.

### P2
- Multi-language landing copy (English + Tagalog).
- Editable global price list per user.
- Team seats and project sharing for the Team tier.

## Next tasks
- Await user-provided Supabase credentials, then swap the placeholder submit handlers for `supabase.auth.signInWithPassword` / `signUp` / `signInWithOAuth({ provider: 'google' })`.
- Add `/dashboard` placeholder route and route guard.
