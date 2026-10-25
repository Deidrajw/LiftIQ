# LiftIQ — Release & Deployment Log

Release history here is a change journal, **not** a list of fully regression-approved milestones. Never infer authentication/API success from a ready Netlify deploy.

## Latest verified code/deployment baseline — 2026-10-23

| Area | Verified value |
|---|---|
| Product source commit before continuity-doc commit | [`a7f60a19a7b6132219b64e5099c34aafb390fbf2`](https://github.com/Deidrajw/LiftIQ/commit/a7f60a19a7b6132219b64e5099c34aafb390fbf2) |
| GitHub action | PR #1 merged to `main` (V15.7 post-workout reconciliation preview) |
| Visible page title | `LiftIQ · V15.7 preview` |
| Netlify site | https://liftiqtrainingtracker.netlify.app/ |
| Verified published deployment | `6adb82be7e49448536a20e8e`, `ready`, matching `a7f60a1`, published 2026-10-23 15:52:44 UTC |
| Functions listed by Netlify | `ai-coach`, `auth-config`, `auth-lib`, `auth-session`, `hevy-sync` |
| Source structure | `public/index.html`, `netlify/functions/`, `netlify.toml`; Netlify `publish="public"` |
| Verification limits | Deploy state/source inspected, not authenticated API or mobile Safari end-to-end tests |

## Change history

### V15.7 — merged *preview*, October 23, 2026
- Commit [`42f0688c`](https://github.com/Deidrajw/LiftIQ/commit/42f0688c97bddf394186e168d13cd548f063dc37), merged via [`a7f60a1`](https://github.com/Deidrajw/LiftIQ/commit/a7f60a19a7b6132219b64e5099c34aafb390fbf2).
- Caches up to 250 recent workout-level completed Hevy sessions (ID, title, date, distinct exercise titles) on sync; proposes journal matches within a one-day window; requires user confirmation and supports unlink.
- Exercises are compared **by recognized name only**, not by volume or a predefined planned-session checklist. No automatic skip claims or plan edits.
- Adds browser-local `liftiq_hevy_session_evidence_v157` and `liftiq_journal_hevy_links_v157`. Does not intentionally rename existing storage keys.
- Adjusts stale-Hevy-sync warning when sync age exceeds 72 hours.
- **Limitations:** data local to device; date/title matching not foolproof; old history beyond cache range unavailable; authenticated regression and scenario QA still outstanding.

### V15.6.1 — schedule-aware Next Workout, October 23, 2026
- Commit [`fa0fb81`](https://github.com/Deidrajw/LiftIQ/commit/fa0fb81c8f399bc25b445af4be894d4fd3622da3).
- Optional weekday and focus choices stored in existing `liftiq_user_settings_v1` object (`trainingDays`, `dayFocus`); uses planned slots in recommendation scoring, skips current day if Hevy already records a workout, preserves manual override.
- Does not link to calendar or separate Hevy routine library.
- Earlier-chat reports: targeted syntax/scenario checks and standalone-fictional-demo browser checks passed; authenticated regression not established.

### V15.6 — Next Workout source explanations, October 23, 2026
- Commits [`62c394fc`](https://github.com/Deidrajw/LiftIQ/commit/62c394fc3a33fd971bf9f930366d5a7f94d84c2e) and [`dc1514ed`](https://github.com/Deidrajw/LiftIQ/commit/dc1514edd324943d5f7fc1edcf25adc9001772d0).
- Recommendation context, sync-age awareness, separation of cycle/journal observations from completed workouts.

### V15.5 — evidence-aware cycle decision check, October 23, 2026
- Commit [`80f1908f`](https://github.com/Deidrajw/LiftIQ/commit/80f1908f1330ea9a73cbc86d8080ec940a977066).
- Shows descriptive cycle dates, priorities, block timing, intended frequency; cycle changes remain user-approved.

### Prior V14–V15.x milestones — historical handoff summaries
The earlier project handoff reports: navigation and design restructuring (V14); exercise search (V14.1); Training Mode/journal (V14.2–14.3); saved Gemini conversations and journal separation (V14.4); header/mobile/Coach refinement (V14.5–14.10); Coach follow-up/consolidation/message styling (V15.0–15.2); response quality and evidence improvements (V15.3–15.4). These earlier descriptions are **handoff-derived**, not freshly validated release-by-release in this documentation task.

## Documentation-only change (this commit)

Created the five continuity files: `PROJECT_STATE.md`, `DECISION_LOG.md`, `BACKLOG.md`, `RELEASE_LOG.md`, `TEST_MATRIX.md`. No application or serverless source intentionally changed. Determine its actual commit SHA from GitHub history after publish and check whether Netlify auto-deployed docs-only changes.

## Every future entry must include

Date, commit/PR, affected files, what changed, reason/decision, user-facing outcome, storage/schema/migration impact, actual test results vs untested, deployment SHA/state, known bugs and next priority.


### V15.8 — development preview only (2026-10-23)
- Branch commit `b49832e4e90ebc694a5a7a897782b2757bfe91ac` (not on main).
- Adds small, collapsed contextual Training Memory disclosure to the existing Today Next Workout card only when relevant explicitly saved unresolved flags exist; provides user-confirmed resolution without deleting journal observations.
- Does not change source-of-truth Hevy completion, routine ranking, mesocycle, AI prompt, or existing localStorage keys. No migrations.
- Testing: frontend JS syntax and focused deterministic checks passed; real-app browser and authenticated regressions not run.


### Cloudflare Pages migration — PREVIEW, not a release (2026-10-23)
- Added four Cloudflare Pages Functions and shared Google identity verifier ported from Netlify with environment bindings; client API calls moved from `/.netlify/functions/` to `/api/`.
- Existing Netlify functions remain unchanged on `main` and in branch; no storage keys or user data intentionally modified.
- No production merge, Cloudflare runtime or authenticated functional verification yet. Local browser data portability must be resolved before switch.


### V15.9 Preview continuation (not published)
- Coach response display handles explicit newline exercise bullets as compact, escaped rows. Does not infer or invent loads from free-form text.
- Gemini system prompts on both Netlify and Cloudflare ask for concise labeled sections and exercise bullets, without altering the existing JSON contract or auto-approving any changes.
- Added repeatable Node regression suite + CI. No migrations or storage-key modifications. Browser and authenticated QA pending.


### V15.9 hierarchy pass — Today/Progress and responsive checks (2026-10-25)
- Preview PR #10 updated: Today Next Workout reason shortened (no longer dumps full analysis first); separate native `<details>` “Why this workout?” preserves prior Hevy/schedule/cycle/journal evidence, initially collapsed. Progress uses a single “Priority lift progress” heading and “Show remaining priority lifts” disclosure, keeping existing exercise drilldowns.
- Frontend JS compilation passed during source edit. Fictional-data Chromium test `tests/coach-responsive-v159.browser.cjs` added for 320, 375, 390, and 960px, scripted Coach rows, collapsed Evidence/Limits and Today details, horizontal overflow, demo and page errors; workflow updated to run it. GitHub run `40241886767` in progress when documentation recorded; confirm actual pass/fail before claiming responsive validation.
- Cloudflare preview route `feature-coach-readable-v159-preview.liftiq.pages.dev` could not be accessed from web verification environment; actual Cloudflare deployment SHA, iPhone Safari and authenticated behavior remain unverified. No production merge. Next verify CI/browser output, obtain Cloudflare preview deployment SHA and inspect on real iPhone, then user approval before release.
