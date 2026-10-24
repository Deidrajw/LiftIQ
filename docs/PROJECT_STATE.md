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


## Pending P0 QA — Progress evidence and mobile clearance (2026-10-23)
- Development branch: `fix/progress-confidence-and-mobile-clearance`, draft PR #5. No production deployment requested.
- Code: `167c92fcacc0611225f4b9ef7d76bcccd99f8fcc` changes Progress `v10TrendAssessment` from endpoint-driven unconditional `Progressing` to cautious estimated-strength language. Requires >=4 qualifying training dates; first/last half median estimated 1RM change ±5% is classified `Est. strength up/down`, else `Stable / mixed`. Evidence explains daily best sets are limited, not validated strength gains.
- Page `body` bottom clearance increased to `calc(168px + env(safe-area-inset-bottom,0px))` for fixed navigation; actual iOS Safari scroll reachability needs browser/device testing.
- Added `tests/progress-confidence.test.cjs` and GitHub Actions workflow on branch. Full frontend inline JS syntax passed; five fictional-data trend cases were checked interactively in development, one revealed initial 3-date outlier risk and prompted 4-date revision. Do not claim GitHub CI passed before confirming workflow result.
- Remaining P0: real-browser iPhone viewport and end-of-document nav clearance test; real Hevy historical examples, cross-variation audit, signed-in production regressions; verify CI.
- Next priority after P0: consolidate redundant Next Workout evidence (collapsed by default) and Progress priority-lift sections, avoiding new cards/tabs.


### Latest draft Progress/Today UX QA (2026-10-23)
- Draft PR #5 branch `fix/progress-confidence-and-mobile-clearance`; latest frontend UX commit `ea14c29021dda57f8541f099352f37631632d1b6` with additional regression tests `e2f96d57f6b38d5e0f99294d00a4f121824de2ba`.
- Today recommendation shows a concise next planned day/manual reason; original evidence is preserved in a `details` disclosure collapsed by default. The journal is described as in progress rather than as a database warning.
- Progress renamed duplicate headings to one `Priority lift progress` section plus `Show remaining priority lifts`; retains all exercise history click actions.
- Existing proposed P0 confidence and bottom navigation fixes still on branch. Eight static/source-derived checks passed including script compilation. GitHub CI and actual iPhone Safari verification not confirmed; not published.
- NEXT: run repeatable Node/browser QA, test actual Today and Progress screens at 320/375/390 px including bottom-of-page reachability, then prepare an approval-ready PR. Do not deploy without request.
