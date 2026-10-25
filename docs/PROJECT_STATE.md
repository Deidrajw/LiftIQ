# LiftIQ — Project State (Living Handoff)

## Current deployed fix — 2026-10-23

- PR #4 merged into `main` at `94c9f77f69441934acada54d93d841ceb5e65c53` and Netlify deploy `6adbd6d6278f88401625e4fa` verified **ready** with matching commit. Five functions present: `ai-coach`, `auth-config`, `auth-lib`, `auth-session`, `hevy-sync`.
- Next Workout manual selection now lists all distinct titles from the **currently imported completed Hevy history**, including multiple routines sharing a training category, titles outside the latest 28 recognized strength sessions, and unrecognized titles. The category-based automatic recommendation remains intact. This is **not** the saved Hevy routine library; titles absent from the current sync range cannot be listed.
- Seven isolated source-derived scenario checks and full frontend JavaScript syntax passed before merge. **Not run:** authenticated production selection, iOS Safari manual QA, real Hevy sync after merge. No existing storage keys changed.
- Next exact step: with signed-in Hevy history, verify previously missing workout titles appear after an all-history sync and that manual selection works on iOS Safari; then address any remaining Hevy routine-library expectations and UI clarity.


## Latest release — V15.8 (2026-10-23)

- User explicitly approved deployment. V15.7.1 QA hardening merged via PR #2 commit `5314226780b6b9b8e70b9ac4843a71eb9dec62f2`; V15.8 Training Memory merged via PR #3 commit `36062c1e11c6cbcb0c468ec66c01d600fb05cd12`.
- Published page title corrected with source commit `5cde58e87f609827d416060e634d30b6b13d9b3b`.
- V15.8 adds relevant, explicitly saved unresolved training-memory flags in a collapsed section inside Today / Next Workout, with user-confirmed resolution. No automatic Hevy writes, Gemini sharing, cycle or target changes; no storage-key migrations.
- V15.7.1 GitHub Actions Node and actual-HTML Chromium test jobs passed, using fictional records. V15.8 source syntax and focused memory-matching/privacy checks passed. Signed-in Hevy/Gemini and iOS Safari regression are **not verified**.
- Netlify deployment commit and ready state must be verified separately after this documentation update; avoid assuming a queued build is published.
- Next exact step: verify this docs commit is published with matching SHA and five backend functions; run signed-in and iOS Safari regression, then prioritize V15.8 usability and training-memory contextual relevance.


> **Read this first in every new LiftIQ chat.** This is a verified checkpoint, not a substitute for checking GitHub `main` and the currently published Netlify commit. Code/deployment status outranks outdated notes. Do not rebuild completed features.

**Last source inspection:** 2026-10-23 (Toronto).  
**Repository:** https://github.com/Deidrajw/LiftIQ · default branch `main`  
**Production:** https://liftiqtrainingtracker.netlify.app/  
**Primary frontend:** `public/index.html` · **Functions:** `netlify/functions/` · **Config:** `netlify.toml` (`publish = "public"`).

## Verified baseline (before this documentation-only commit)

- **Latest product commit on main:** [`a7f60a19a7b6132219b64e5099c34aafb390fbf2`](https://github.com/Deidrajw/LiftIQ/commit/a7f60a19a7b6132219b64e5099c34aafb390fbf2), merge of PR #1 (`feature/v15-7-post-workout-reconciliation`).
- **Displayed frontend title:** `LiftIQ · V15.7 preview` (a preview-labelled feature now merged and deployed, **not** a signed-off V15.7 release).
- **Production deploy verified ready:** Netlify deploy `6adb82be7e49448536a20e8e`, published 2026-10-23 15:52:44 UTC; `commit_ref` matched `a7f60a1`.
- **Serverless functions visible in deploy:** `ai-coach`, `auth-config`, `auth-lib`, `auth-session`, `hevy-sync`. Function presence is **not** an authenticated functional test.
- This documentation commit changes only the `docs/` files; after it lands, check `main` and Netlify again for the latest SHA. The product baseline above remains the last inspected application change.

## Current milestone: V15.7 post-workout reconciliation — merged PREVIEW, QA outstanding

**Implemented in the current source:**
- On successful Hevy sync, cache up to **250** recent workout-level records (Hevy workout ID, title, date, distinct exercise titles) in `liftiq_hevy_session_evidence_v157`.
- Finished journals offer **Match to completed Hevy workout**, showing up to **8** candidates within ±1 calendar day, ranked by date and exact normalized routine title.
- **No automatic linking.** The user must confirm the workout; duplicate links for the same Hevy workout are blocked. Confirmed links can be removed without changing journal or Hevy records.
- Links live in `liftiq_journal_hevy_links_v157`; deleting a finished journal also removes its linked match.
- Matched review compares journal-mentioned *exercise names* with that session's cached names, without declaring unmentioned movements skipped. A missing cache prompts resync, preserving the link.
- Notes stay local unless the user explicitly chooses **Ask Gemini with notes**, which prepares a reviewable prompt. A journal is **never** proof of Hevy workout completion.
- V15.7 also changed the old stale-sync warning threshold to an elapsed-time check above 72 hours.

**Important limitations:**
- This is *name-level reconciliation*, not validated planned-versus-performed set/rep/load comparison; unmentioned or differently named exercises cannot safely be labeled skipped.
- Candidate matching can be ambiguous around time zones, midnight, different titles and multiple sessions in one day. Require explicit review.
- The saved evidence cache is limited to 250 Hevy sessions/80 distinct exercise titles per session; browser-local data does not sync across devices.
- No separately implemented Hevy routine-library or external calendar connection should be implied.
- Frontend source remains large and contains historical rendering/CSS layers; refactor only with regression coverage.

## Prior verified milestones (selected)

- **V15.5:** evidence-aware mesocycle decision check and user-approved cycle extension; source commit `80f1908f`.
- **V15.6:** Next Workout explanation/source indicators; commits `62c394fc` and `dc1514ed`.
- **V15.6.1:** optional weekday/focus schedule settings influence Next Workout ranking; no-history state and manual override; source commit `fa0fb81c`.
- Earlier V14–V15.x Coach/UI/journal history is summarized in `RELEASE_LOG.md`; confirm behavior from current source before relying on it.

## Tests actually established

- **This documentation task:** inspected `main` source/commits, Netlify deploy metadata and configuration; verified the current deployment commit and the absence of the five continuity files.
- **Earlier V15.6.1 work:** isolated scenario and syntax checks were reported as passed in the preceding chat; the fictional standalone demo was browser-smoke-tested at 320/375/390/960 px. This does **not** prove production auth/API behavior.
- **V15.7:** implementation is source-inspected and deployed, but **authenticated production use, browser interaction tests, and an end-to-end regression suite were not run during this documentation pass.** Do not mark V15.7 fully QA-approved.

## Exactly what to do next

1. Recheck `main` and the current Netlify production SHA, and inspect the V15.7 implementation before editing anything.
2. **QA V15.7 post-workout matching** using fictional unit/browser scenarios (same day, adjacent day, multiple workouts, timezone edge cases, no Hevy history, stale/corrupt cache, duplicate links, delete/unlink, missing exercise names, storage failures).
3. Then test **signed-in production** Google login, Hevy sync and matching, and Gemini opt-in conversation only where credentials/user access are actually available. Preserve all existing user data.
4. Fix verified bugs; prioritize missing-cache, multi-session/date ambiguity and privacy/consent. Keep matching user-confirmed.
5. Provide fictional-data in-chat preview, standalone HTML, complete versioned deployment ZIP, release notes and actual regression results for substantial updates. Publish only when requested.
6. Once the V15.7 acceptance checklist genuinely passes, consider V15.8 **training-memory intelligence**. Update all continuity docs alongside that release.

## Handoff checklist (CONTINUE LIFTIQ)

Record the **last verified application and docs commits**, Netlify deployed SHA/state, changed paths, confirmed behavior, incomplete work, test environments and outcomes, known bugs, approved/rejected decisions, and one exact next action. Never state that unperformed tests passed or unsaved work was saved.


## V15.8 Training Memory preview — 2026-10-23 (branch only)
- Branch: `feature/v15-8-training-memory-preview`, code commit `b49832e4e90ebc694a5a7a897782b2757bfe91ac`.
- Based on unmerged V15.7.1 QA branch; **neither V15.7.1 nor V15.8 is deployed** as of creation.
- Today contains a collapsed, contextual list of explicitly saved, unresolved Training Mode flags for the current recognized recommended workout group. A flag can be marked resolved after confirmation; notes are not shown verbatim, rankings and user data sources remain unchanged.
- Source script syntax and 10 targeted source-derived logic/privacy checks passed after correcting one overbroad test assertion against the generic phrase 'reported notes'. No signed-in Hevy, iOS Safari or production regression performed for V15.8.
- Exact next step: verify existing app Today render and journal memory on mobile Chromium and iOS Safari, then produce release preview and prepare approval. Do not merge pending branch into main without user approval.


## Cloudflare Pages migration in progress (2026-10-23)
- User confirmed desired Cloudflare Pages address: `https://liftiq.pages.dev` (reported successful initial deployment, not independently accessible from this environment).
- Active branch: `feature/cloudflare-pages-backend-migration`. Adds Cloudflare Pages Functions for auth-config, auth-session, hevy-sync, ai-coach and a shared secure auth helper; switches client API URLs to `/api/`; preserves original Netlify functions as fallback.
- Added dedicated smoke tests and workflow; CI/runtime and signed-in Hevy/Gemini remain unverified. **Do not merge or deploy to production until user approval**.
- User must configure Google OAuth authorized JavaScript origin and Cloudflare Pages Variables and Secrets, preserve old origin, then verify signed-in behavior. LocalStorage is origin-specific; export/import plan required before replacing original Netlify URL.
- Separate prior draft PR #5 for Progress confidence/mobile clearance remains open and is not part of this migration.
- Detailed migration checklist: `docs/CLOUDFLARE_MIGRATION.md`.


## Cloudflare API migration merged — October 23/24, 2026
- PR #6 merged to `main` at GitHub commit `13b3cb6192c22e9adf1aa917f0282161aacaf510`, triggering expected GitHub-connected Cloudflare Pages deployment; **Cloudflare deployment and runtime cannot be independently verified from available tooling**. User previously reported `https://liftiq.pages.dev` successfully initialized and has configured API keys and Google OAuth origin.
- Cloudflare Pages Functions in `functions/api/` implement `auth-config`, `auth-session`, `hevy-sync`, `ai-coach`; shared auth `cloudflare/auth.js`, API function routing `public/_routes.json`. Frontend chooses `/api/` on Cloudflare, old `/.netlify/functions/` on original Netlify hostname. Original Netlify backend preserved.
- Nine targeted source checks passed: syntax of 5 backend modules + frontend scripts, routes JSON, old-host routing, Google allowlist source guard. **Not run:** Pages build logs, actual endpoint HTTP status, signed-in Hevy and Gemini, full iOS Safari, stored data export/import, Cloudflare matching production commit. The accessible public host couldn't be reached from this tool session. Do not call migration fully operational yet.
- **Next exact step:** check Cloudflare project deployment shows latest GitHub commit `13b3cb6` and visit `https://liftiq.pages.dev/api/auth-config` for configured client ID (public identifier). Validate Google sign-in, Hevy sync and Gemini in browser, without sharing tokens/keys; perform data export/import before treating Cloudflare as permanent source of saved journals/cycles/chats. Progress UX draft PR #5 remains separate.


## Data portability preview — Oct 2026
- Active branch `feature/local-data-transfer-v1582`; portable `public/data-transfer.html` and Settings link provide a local-only JSON backup/import utility for browser-local `ti_*` and `liftiq_*` keys. Known credential-like names are excluded; import validates the format/keys/strings, previews collisions, downloads a current backup, replaces only selected keys, rolls back successful writes on failure. No changes to Hevy backend or data model.
- Migration between `liftiqtrainingtracker.netlify.app` and `liftiq.pages.dev` is **cross-origin**. The new Cloudflare transfer page cannot read Netlify localStorage; user must perform a same-origin export on old Netlify host. If Netlify is suspended and cannot deploy the new transfer page, a browser developer-console one-time exporter is required on the old domain, or Netlify service must be restored to publish this UI there.
- Static test: HTML/JS compiles; 8 targeted source checks passed, no network fetch. **Not run**: real old Netlify-origin export, large user data, mobile Safari import, quota/rollback browser failure simulation.
- Migration branch not deployed; do not merge/publish without approval. Next exact step: test import on Cloudflare preview with fictional data, then provide old-domain export and verify real user history safely.


## Google automatic re-sign-in preview (Oct 2026)
- Branch `feature/google-silent-signin-v1583`, frontend source commit `9f90c9b2116e42204fb3878a65c5b598b90cc3e3`; not deployed. Google Identity Services initialized with `auto_select:true` and one `prompt()` call at app startup to attempt restoring a Google session. Existing server-side Google token validation and single-email allowlist remain authoritative.
- No Google ID tokens, API keys, or credentials are stored persistently; sign-out still invokes `disableAutoSelect()`. This is a best-effort convenience, **not a persistent backend session**. iOS Home Screen Safari may decline automatic sign-in if Google's cookies or FedCM permissions are unavailable; a real browser test is necessary.
- Full frontend inline JS syntax passed; authenticated iPhone/Google, Gemini, Hevy, logout, and no-session tests not run. Do not merge without user approval or test sign-in states first.


## Automatic Google sign-in rollout — October 25, 2026
- User explicitly approved production publishing. PR #9 merged into `main` at commit `510ba8896bec60986fee9edfdac3976d998efe73`.
- Google Identity Services initializes `auto_select:true` and prompts once on startup; server still verifies Google ID tokens and the permitted account, sign-out disables auto-select, and no credentials are persisted in localStorage.
- Verification: source assertions and full frontend inline JS syntax passed. **Unverified:** deployed Cloudflare matching commit; Cloudflare URL could not be accessed with available web tool. Netlify latest visible deployment remains `9b7bb0fe...` (ready, older than release), not matching GitHub main. Actual iPhone PWA restoration, sign-out and Hevy/Gemini regressions not performed.
- Next exact action: confirm Cloudflare Pages deployment includes GitHub `510ba889`, test reopen after Home Screen close, test explicit logout remains logged out and check Hevy/Gemini authorization; investigate browser/GIS restrictions if prompt cannot silently restore.


## Coach readability v15.9 preview (Oct 2026)
- Branch `feature/coach-readable-v159-preview`; current response and saved conversation messages use display-only `li159CoachHTML` for recognized Takeaway / Evidence / Recommendation / Limits prose. Evidence and Limits are collapsed native details; fallback for unstructured old messages preserves escaped text. No Gemini payload, credentials, Hevy history or browser storage keys changed.
- Separate `public/demo-coach-v159.html` is a standalone, mock-signed-in, fictional-data preview with no network/Google/Hevy/Gemini calls and no localStorage. Cloudflare branch preview availability needs confirmation.
- Source checks 6/6 passed including inline JS syntax; not run actual iOS Safari/DOM screen or authenticated Gemini response. Proposed next: move toward structured Gemini response schema for reliably formatted per-exercise rows, then review Today/Progress/Goals/Plan hierarchy. No production merge without approval.


### Preview workflow adopted (2026-10-25)
- User confirmed Cloudflare Pages preview deployments exist and approved them as LiftIQ's default testing environment. `main` → production `https://liftiq.pages.dev`, feature branches → isolated previews. This decision is recorded in DECISION_LOG D-014.
- V15.9 draft PR #10 remains open and unmerged on `feature/coach-readable-v159-preview`. Fictional-data demo path: `/demo-coach-v159.html` on the actual Cloudflare branch preview host. The exact preview URL and running deployment SHA have not been read from Cloudflare in this tool session.
- Next: open Cloudflare deployment dashboard for this branch, confirm commit and preview URL, test mobile Coach typography and collapsed evidence there, then continue structured response schema work without production merge.


### V15.9 structured readability continuation — 2026-10-25
- Draft PR #10 updated on `feature/coach-readable-v159-preview`. Frontend displays explicit exercise bullets as separate compact rows in Coach Takeaway/Recommendation, not inferred from arbitrary weights. Evidence and Limits stay collapsed, past unstructured chat messages retain safe fallback, HTML is escaped; preserved storage keys and conversation content.
- Both Cloudflare and Netlify Gemini prompt contracts now request concise Takeaway/Recommendation/Evidence/Limits and explicit grounded exercise bullet lines when applicable; existing JSON response envelope and Hevy/Gemini behavior unchanged.
- Automated `tests/coach-readability-v159.test.cjs` with GitHub Actions `.github/workflows/coach-readability-v159.yml` added. CI queued at workflow run 40241513739; confirm result before claiming pass. Tests cover HTML escaping, historical messages, collapsed evidence, optional rows, no network in renderer and matching backend instructions.
- No main merge/deployment. Cloudflare preview URL/SHA not independently verified; iPhone Safari and authenticated functional tests still pending. Next: confirm CI and real branch preview, inspect 320/375/390 layouts then request approval to publish.


### V15.9 hierarchy pass — Today/Progress and responsive checks (2026-10-25)
- Preview PR #10 updated: Today Next Workout reason shortened (no longer dumps full analysis first); separate native `<details>` “Why this workout?” preserves prior Hevy/schedule/cycle/journal evidence, initially collapsed. Progress uses a single “Priority lift progress” heading and “Show remaining priority lifts” disclosure, keeping existing exercise drilldowns.
- Frontend JS compilation passed during source edit. Fictional-data Chromium test `tests/coach-responsive-v159.browser.cjs` added for 320, 375, 390, and 960px, scripted Coach rows, collapsed Evidence/Limits and Today details, horizontal overflow, demo and page errors; workflow updated to run it. GitHub run `40241886767` in progress when documentation recorded; confirm actual pass/fail before claiming responsive validation.
- Cloudflare preview route `feature-coach-readable-v159-preview.liftiq.pages.dev` could not be accessed from web verification environment; actual Cloudflare deployment SHA, iPhone Safari and authenticated behavior remain unverified. No production merge. Next verify CI/browser output, obtain Cloudflare preview deployment SHA and inspect on real iPhone, then user approval before release.


### V15.9 verified automated preview QA — 2026-10-25
- Final preview code at branch (prior to this docs update) commit `b976ee3d7496d3d7e806b01f65ea75683d69a400`.
- GitHub Actions passed: Coach V15.9 Readability QA run `40242025808` (includes fictional-data Chromium at 320, 375, 390, and 960px), reconciliation regression run `40242025810` (after fixing stale title-only assertion), Cloudflare migration smoke checks run `40242025814`.
- These are headless Chromium simulated tests, NOT actual iPhone Safari or live Cloudflare preview verification. Cloudflare preview exact address / deployment SHA inaccessible in available tooling. Keep PR #10 draft; production `main` untouched.
- Remaining sign-off: view Cloudflare Pages branch preview on real iPhone at 320/375/390 equivalents, review Coach collapsed evidence and recommendations, Today recommendation detail, Progress expanded priority history; verify authenticated Gemini/Hevy behavior only if intended, then obtain user approval before merge.
