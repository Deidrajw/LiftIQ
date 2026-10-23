# LiftIQ — Project State (Living Handoff)

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
