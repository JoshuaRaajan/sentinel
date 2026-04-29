# Sentinel — PRD

## Original problem statement
Build a web app called Sentinel — a project management tool for freelancers and
agencies that detects scope creep automatically using AI. Premium editorial
design (Notion meets a financial terminal). Warm palette, sharp edges,
Instrument Serif + Inter + IBM Plex Mono, burnt orange (#FF4D00) reserved for
scope creep / out-of-scope alerts only. AI calls go to Claude Sonnet 4.5 via
the Emergent Universal LLM key. All integrations (LLM key, DB URL, auth, email)
must be env-driven so they can be swapped post-Vercel-deploy with zero code
changes.

## User choices (Feb 2026)
- Claude Sonnet 4.5 via Emergent Universal LLM key
- Auth: skipped (will be added later, magic-link)
- Persistence: localStorage only (Mongo to be added during polish)
- Seed: one Lumière Brand Website demo project on first load
- Deploy target: Vercel; keys to be swapped via env vars post-deploy

## Architecture
- **Backend** — FastAPI (`/app/backend/server.py`)
  - `POST /api/check-scope` → IN_SCOPE | OUT_OF_SCOPE | GREY_AREA + reason
  - `POST /api/structure-scope` → JSON: included_items, excluded_items, revision_count, timeline, total_hours
  - `POST /api/generate-change-order` → professional change order email body
  - `GET  /api/health` → diagnostics
  - LLM via `emergentintegrations.llm.chat.LlmChat` with provider=anthropic, model=claude-sonnet-4-5-20250929
  - Commented placeholders in `server.py` for `MONGO_URL`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `SLACK_WEBHOOK_URL`, `AUTH_PROVIDER`
- **Frontend** — React (CRA + Tailwind + shadcn) at `/app/frontend/src/`
  - Routes: `/`, `/new`, `/app/board`, `/app/scope`, `/app/billing`, `/app/client`
  - State: localStorage (`sentinel.projects`, `sentinel.activeProjectId`, `sentinel.viewMode`)
  - Custom Tailwind palette + global zero-radius
  - Google Fonts (Instrument Serif / Inter / IBM Plex Mono) loaded in `index.css`

## What's been implemented (2026-02-Feb)
- Editorial landing page: navbar, live counter, hero with live scope panel,
  "Here's what actually happened" story timeline, three-step "How it works",
  two-views split (provider vs client), pricing (Solo/Agency/War Room),
  field testimonials, footer.
- Three-step new-project wizard with shadcn Calendar+Popover for start date.
- App shell (top nav, project switcher, sticky scope bar with health colors).
- Board: TO DO / IN PROGRESS / DONE columns with scope badges, OOS tint,
  inline ADD TASK that calls Claude scope check.
- Scope tab: textarea lock/unlock + structured INCLUDED/EXCLUDED panels.
- Billing: 8-cell financial terminal grid + budget bar + editable hour table
  + Generate Invoice (mocked toast).
- Client view: clean white kanban with no orange / no scope flags.
- Change Order modal with typewriter render, Copy & Send buttons.
- Lumière demo project seeded automatically on first visit to `/app`.

## Landing redesign — 2026-02-Feb (iteration 2)
- Complete visual rebuild of `/` to a Notion-dark editorial product page,
  scoped to `.landing-dark` + `body.landing` so the warm in-product theme is
  untouched.
- New palette (#191919 / #202020 / #252525 / #c9a84c gold / #f2edd8 cream /
  #c0392b red / #7a9e6e sage), Fraunces serif headlines, Inter body, IBM Plex
  Mono labels.
- Scroll-triggered reveals via `useReveal.js` (IntersectionObserver), staggered
  via `data-d` attribute, smooth 0.9s cubic-bezier(0.16,1,0.3,1).
- Floating animated hero product card (scope bar fills 0→73%, OOS rows render
  with red badges, AT RISK pill).
- Marquee live-ticker with $284,737 figure (alternating gold / muted text).
- Card-lift hover, slide-in button hover, custom dark scrollbar (gold thumb on
  hover), trailing cursor dot (desktop only).
- All original copy preserved verbatim.

## Client Kanban panel — 2026-02-Feb (iteration 3)
- Replaced the right "WHAT THEY SEE" panel of the dual-view section with a
  premium Linear-meets-Trello kanban (`<ClientKanban />` in Landing.jsx).
- Project header: serif title, sage ON TRACK pill, gold DUE MAY 20 pill,
  stacked JR/AL/KP avatars, 68% gradient progress bar (sage→gold).
- 3 columns over #141414 background; cards over #1e1e1e with category tags
  (DESIGN sage / DEVELOPMENT gold / CONTENT orange / REVIEW blue), title,
  optional X/Y subtask progress bar, clock-icon due dates, priority dots
  (red/gold/green), assignee avatar circle.
- IN PROGRESS cards have a 2px gold left border. DONE cards rendered at
  opacity 0.7 with check-icon completion dates.
- Bottom status bar: red 2 BLOCKERS / gold 3 IN PROGRESS / green 4 COMPLETED
  + "Last updated — 2 hours ago".
- Card hover translateY(-2px), border brightens.

## P0 backlog (next up)
- Real auth (magic link via Resend; env-driven `AUTH_PROVIDER`).
- MongoDB persistence layer behind the same client API.
- Stripe subscription billing (Solo/Agency/War Room).
- Slack webhook on scope creep (env-driven).
- Real client portal share link + read-only routing.

## P1 backlog
- Drag-and-drop on board (currently advance/back buttons).
- Per-task time logging with start/stop timer.
- Multiple users + team task assignment (Agency/War Room tier).
- White-label client portal (War Room tier).
- API access + change order email delivery via Resend.

## P2 backlog
- Project archiving / search.
- CSV export of billing.
- Notifications panel + activity log.

## Test credentials
N/A — auth skipped.
