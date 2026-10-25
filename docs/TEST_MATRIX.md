# LiftIQ — Test Matrix & Verification Record

**Snapshot:** 2026-10-23. Separate inspections, isolated JS/scenario tests, fictional browser tests and **signed-in production tests**. A deployed page or readable function file is not proof of successful authentication, sync or AI completion.

**Legend:** `PASS` = actually verified in the stated environment; `NOT RUN` = still needs execution; `PRIOR REPORT` = tests described in previous release conversation and not re-run here; `FAIL` = observed failure with reproducible evidence.

## Verified in this documentation task

| Test | Result | Method / evidence |
|---|---|---|
| GitHub repository access and `main` commits | PASS | Connected GitHub; head product commit `a7f60a1` inspected, including V15.7 code changes |
| Netlify publish configuration | PASS | `netlify.toml` inspected: `public`, `netlify/functions` |
| Published production SHA/state at inspection | PASS | Deploy `6adb82be7e49448536a20e8e` ready, matching code commit `a7f60a1` |
| Netlify function inventory | PASS (presence only) | Five named functions reported in production deploy metadata |
| V15.7 reconciliation behavior exists in source | PASS (static inspection only) | Confirm/unlink, date-window candidate search, name comparison, local evidence cache and storage keys identified |
| Authenticated integration regression | NOT RUN | Requires actual signed-in session and protected API behavior |
| Full V15.7 user-interaction / mobile regression | NOT RUN | Needs browser testing and scenario test harness |

## V15.7 acceptance cases — run next

| ID | Scenario / acceptance | Environment | Status |
|---|---|---|---|
| REC-01 | Exact same-day Hevy ID/title journal match lists correct session and requires explicit confirmation | Fictional scenario/browser | NOT RUN |
| REC-02 | Journal and workout one calendar day apart: candidate visible, labelled adjacent day | Fictional scenario/browser | NOT RUN |
| REC-03 | Two workouts on same day: display both without auto-selection; one-to-one linkage | Fictional scenario/browser | NOT RUN |
| REC-04 | Timezone/midnight offset: local journal date and Hevy date are not misleading | Fictional scenario/browser | NOT RUN |
| REC-05 | No Hevy evidence or no candidates: explain uncertainty; keep journal unchanged | Fictional scenario/browser | NOT RUN |
| REC-06 | Already-linked workout cannot be assigned to another journal | Fictional scenario/browser | NOT RUN |
| REC-07 | Confirm, reload, unlink, re-link: persistence and reversibility without corrupting notes | Browser + localStorage | NOT RUN |
| REC-08 | Delete journal removes its association but leaves Hevy and other journals intact | Browser + localStorage | NOT RUN |
| REC-09 | Cached workout no longer available after resync: retain link and prompt resync, no invented sets | Fictional scenario/browser | NOT RUN |
| REC-10 | Journal exercise not in recorded names: flag uncertainty; do NOT claim skipped set/exercise | Fictional scenario/browser | NOT RUN |
| REC-11 | Similar exercise variations: respect aliases without false matched loads | Fictional scenario/browser | NOT RUN |
| REC-12 | Storage full/corrupted cache: safe recovery and visible persistence failure; no silent deletion | Browser test | NOT RUN |
| REC-13 | Declining match/unlink confirmation changes nothing | Browser test | NOT RUN |
| REC-14 | Private notes never sent to Gemini except with explicit user action and review | Source + authenticated request test | NOT RUN |
| REC-15 | 320/375/390 px and desktop: no overflow, touch target and keyboard focus accessible | Browser + iOS Safari | NOT RUN |
| REC-16 | Signed-in Google auth, Hevy sync, finished journal match and Gemini follow-up | Production authenticated | NOT RUN |

## Existing functionality regression

| Group | Critical cases | State |
|---|---|---|
| Today / Next Workout | empty/stale Hevy, planned days and focus, actual completion, manual override, pause/cycle context | NOT RUN in V15.7 |
| Progress / Goals | filters, comparable exercise variations, dated trends, pinned priority goals | NOT RUN |
| Plan | macro/meso/microcycle editing, pause, extension, **approval** and persistence | NOT RUN |
| Coach | user-vs-Coach bubbles, one page scroll, follow-ups, failures/503, history/search/export/drafts/delete | NOT RUN |
| Journal | notes/edit/delete, finishing journal vs Hevy completion, flags, AI opt-in | NOT RUN end-to-end |
| Settings | persistence, frequency, weekday/focus, theme, coaching relevance | NOT RUN |
| Data integrity | legacy localStorage preserved after deploy, corrupt/stale sync behavior | NOT RUN |
| Auth / APIs | OAuth login/logout, Hevy failures, Gemini rate/error handling, keys server-side | NOT RUN authenticated |

## Prior release validation — not rerun

- `V15.6.1`: prior-chat record reports isolated logic/syntax tests for scheduled focus, completed-day advancement, empty history and no-schedule fallback, plus fictional-demo Chromium checks at **320, 375, 390 and 960px**. **PRIOR REPORT**, not a signed-in production test and not evidence that V15.7 is validated.
- `V15.5`: code/deploy metadata inspected historically; no full authenticated test record established here.

## How to update

Record for each run: UTC timestamp, environment/build SHA, scenario dataset (fictional vs real, no private data copied to docs), steps, expected vs actual, **PASS/FAIL/NOT RUN**, screenshot/log reference if available, and follow-up issue. Do not convert NOT RUN to PASS based on source inspection alone.


## V15.8 preview (2026-10-23)
| Scope | Status | Details |
|---|---|---|
| Frontend JavaScript syntax | PASS (isolated compilation) | Tested full `public/index.html` after V15.8 source edit |
| Matching active saved flags by suggested group | PASS | Fictional Glutes/Hamstrings vs Upper Body scenarios |
| Resolved/unscoped/unknown flags suppressed | PASS | Source-derived scenarios |
| Memory panel collapsed and hidden when empty | PASS | HTML helper assertions, **not rendered mobile QA** |
| Verbatim private observation not copied to panel | PASS | Exact sentinel test |
| No network/Gemini send or recommendation mutation in memory helper | PASS (static source check) | No network routine or ranking changes introduced |
| Actual app rendered Today + Journal regression | NOT RUN | Needs Chromium browser UI acceptance |
| Mobile Safari / VoiceOver | NOT RUN | Device-specific testing |
| Real authenticated Hevy & Gemini regression | NOT RUN | Requires signed-in environment |


## Cloudflare Pages migration preview
| Test | Status |
|---|---|
| Frontend inline JS syntax | PASS (source-derived during API-path change) |
| Functions ES module syntax | PASS (source-derived syntax inspection during migration) |
| API key source never in static frontend | NOT VERIFIED with runtime |
| New API route runtime / Cloudflare Pages compilation | NOT VERIFIED |
| GitHub Actions smoke test | NOT VERIFIED |
| Signed-in Google allowlist session | NOT RUN |
| Hevy end-to-end all-history sync | NOT RUN |
| Gemini real coached response | NOT RUN |
| Browser localStorage export/import to new origin | NOT IMPLEMENTED |
| Data keys, Hevy/mesocycle mutations | No intentional changes |


## Data portability preview — Oct 2026
- Active branch `feature/local-data-transfer-v1582`; portable `public/data-transfer.html` and Settings link provide a local-only JSON backup/import utility for browser-local `ti_*` and `liftiq_*` keys. Known credential-like names are excluded; import validates the format/keys/strings, previews collisions, downloads a current backup, replaces only selected keys, rolls back successful writes on failure. No changes to Hevy backend or data model.
- Migration between `liftiqtrainingtracker.netlify.app` and `liftiq.pages.dev` is **cross-origin**. The new Cloudflare transfer page cannot read Netlify localStorage; user must perform a same-origin export on old Netlify host. If Netlify is suspended and cannot deploy the new transfer page, a browser developer-console one-time exporter is required on the old domain, or Netlify service must be restored to publish this UI there.
- Static test: HTML/JS compiles; 8 targeted source checks passed, no network fetch. **Not run**: real old Netlify-origin export, large user data, mobile Safari import, quota/rollback browser failure simulation.
- Migration branch not deployed; do not merge/publish without approval. Next exact step: test import on Cloudflare preview with fictional data, then provide old-domain export and verify real user history safely.


## Google automatic re-sign-in preview (Oct 2026)
- Branch `feature/google-silent-signin-v1583`, frontend source commit `9f90c9b2116e42204fb3878a65c5b598b90cc3e3`; not deployed. Google Identity Services initialized with `auto_select:true` and one `prompt()` call at app startup to attempt restoring a Google session. Existing server-side Google token validation and single-email allowlist remain authoritative.
- No Google ID tokens, API keys, or credentials are stored persistently; sign-out still invokes `disableAutoSelect()`. This is a best-effort convenience, **not a persistent backend session**. iOS Home Screen Safari may decline automatic sign-in if Google's cookies or FedCM permissions are unavailable; a real browser test is necessary.
- Full frontend inline JS syntax passed; authenticated iPhone/Google, Gemini, Hevy, logout, and no-session tests not run. Do not merge without user approval or test sign-in states first.


## Coach readability v15.9 preview (Oct 2026)
- Branch `feature/coach-readable-v159-preview`; current response and saved conversation messages use display-only `li159CoachHTML` for recognized Takeaway / Evidence / Recommendation / Limits prose. Evidence and Limits are collapsed native details; fallback for unstructured old messages preserves escaped text. No Gemini payload, credentials, Hevy history or browser storage keys changed.
- Separate `public/demo-coach-v159.html` is a standalone, mock-signed-in, fictional-data preview with no network/Google/Hevy/Gemini calls and no localStorage. Cloudflare branch preview availability needs confirmation.
- Source checks 6/6 passed including inline JS syntax; not run actual iOS Safari/DOM screen or authenticated Gemini response. Proposed next: move toward structured Gemini response schema for reliably formatted per-exercise rows, then review Today/Progress/Goals/Plan hierarchy. No production merge without approval.


### V15.9 Coach content hierarchy executable regressions
- Automated tests committed on feature branch; **CI queued, not yet passed** when written. Assertions: all frontend scripts parse; Takeaway/Recommendation rows; collapsed Evidence/Limits; HTML-escaped exercise text; plain-text fallback; no localStorage/network in renderer; both hosts follow same Gemini response instructions.
- Browser viewport mobile, Gemini live outputs, PWA, auth and saved old real chat export: NOT RUN. Fictional standalone `public/demo-coach-v159.html` exists; its actual Pages preview URL remains unverified.


### V15.9 hierarchy pass — Today/Progress and responsive checks (2026-10-25)
- Preview PR #10 updated: Today Next Workout reason shortened (no longer dumps full analysis first); separate native `<details>` “Why this workout?” preserves prior Hevy/schedule/cycle/journal evidence, initially collapsed. Progress uses a single “Priority lift progress” heading and “Show remaining priority lifts” disclosure, keeping existing exercise drilldowns.
- Frontend JS compilation passed during source edit. Fictional-data Chromium test `tests/coach-responsive-v159.browser.cjs` added for 320, 375, 390, and 960px, scripted Coach rows, collapsed Evidence/Limits and Today details, horizontal overflow, demo and page errors; workflow updated to run it. GitHub run `40241886767` in progress when documentation recorded; confirm actual pass/fail before claiming responsive validation.
- Cloudflare preview route `feature-coach-readable-v159-preview.liftiq.pages.dev` could not be accessed from web verification environment; actual Cloudflare deployment SHA, iPhone Safari and authenticated behavior remain unverified. No production merge. Next verify CI/browser output, obtain Cloudflare preview deployment SHA and inspect on real iPhone, then user approval before release.


### V15.9 verified automated preview QA — 2026-10-25
- Final preview code at branch (prior to this docs update) commit `b976ee3d7496d3d7e806b01f65ea75683d69a400`.
- GitHub Actions passed: Coach V15.9 Readability QA run `40242025808` (includes fictional-data Chromium at 320, 375, 390, and 960px), reconciliation regression run `40242025810` (after fixing stale title-only assertion), Cloudflare migration smoke checks run `40242025814`.
- These are headless Chromium simulated tests, NOT actual iPhone Safari or live Cloudflare preview verification. Cloudflare preview exact address / deployment SHA inaccessible in available tooling. Keep PR #10 draft; production `main` untouched.
- Remaining sign-off: view Cloudflare Pages branch preview on real iPhone at 320/375/390 equivalents, review Coach collapsed evidence and recommendations, Today recommendation detail, Progress expanded priority history; verify authenticated Gemini/Hevy behavior only if intended, then obtain user approval before merge.
