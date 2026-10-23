# LiftIQ — Project State

**Updated:** 2026-10-23 (America/Toronto)  
**Production:** V15.6.1 (verified Netlify published deploy `6adb7d15a6f7c1148835ebb3`, commit `fd618137003f5de0bbf2129216a2ba656b0f3871`)  
**Live URL:** https://liftiqtrainingtracker.netlify.app/  
**Repository:** https://github.com/Deidrajw/LiftIQ (`main`)  
**Current development branch:** `feature/v15-7-post-workout-reconciliation`  
**V15.7 app implementation commit (branch only):** `42f0688c97bddf394186e168d13cd548f063dc37`  
**Release status:** **Preview, not published to production; user approval for publishing not yet requested or given.**

## Current feature
V15.7: *Post-Workout Reconciliation* links a finished browser-stored training journal to a particular completed Hevy workout only after user confirmation. Matching offers API-ID-based candidates within one calendar day of the journal start and shows the exact completed Hevy workout exercise names for comparison. Different sessions on the same day remain separate. Users can unlink without deleting source data. Old journal and `ti_state` storage formats remain unchanged; two new independently scoped storage keys are used.

## Completed in development branch
- Preserve individual Hevy API completed-workout IDs, dates, titles, and up to 80 distinct exercise titles per workout for the 250 most recent eligible sessions when a full sync succeeds.
- Present candidate matches for finished journals, identifying same-date/name evidence without automatic assignment; no candidates suggests syncing.
- Require explicit confirmation, prevent one completed workout being claimed by two different journal records, support unlink.
- Review recorded exercise names against user-reported journal event exercise references without declaring skipped exercises or diagnosing pain.
- Correct sync-staleness trigger from rounded-days to elapsed time over 72 hours.
- Preserve the existing Training Mode, local journals, Next Workout, OAuth, Hevy, Gemini, mesocycles, goals, settings and history.

## Tests
- JS syntax validated on updated full frontend source.
- Ten initial source-derived automated checks passed, followed by a second expanded 17/17 exact-source test run (ambiguous candidates, explicit confirmation, duplicate-match prevention, unlink, cache, XSS escaping, quota handling and 72h). See `docs/TEST_MATRIX.md`.
- Independent fictional HTML demo passed Chromium Playwright interaction tests and responsive widths 320/375/390/960px with zero browser JavaScript exceptions or horizontal overflow. **This does not test the GitHub-branch application UI.**
- Signed-in Google authentication, real Hevy API sync, Gemini, iOS Safari, accessibility and real-user storage migration NOT yet run against V15.7.
- Netlify preview / production deployment NOT performed.

## Known limitations and safety boundaries
- Older finished journals require a fresh authenticated Hevy sync to populate workout-level evidence. CSV/manual imports do not contain verified API workout IDs for matching.
- Candidate matches use journal start date, completed workout date, and routine-title similarity; session IDs are retained only when available from Hevy.
- Exercise-name absence does not prove that an exercise was planned or skipped; a related variation can appear under a different title.
- Local-only reconciliation does not sync across browsers/devices. Storage limits may prevent snapshot persistence; previous snapshot is retained if saving fails.
- No automatic program, mesocycle, goal, target, or Hevy write. No sharing journal notes with Gemini without explicit user action.

## Exact next step
QA the actual V15.7 GitHub-branch application UI (distinct from the standalone fictional demo), then verify authenticated Hevy sync and journal matching in a branch Deploy Preview (or approved safe test environment). Prepare complete versioned ZIP, release notes, demo and checklist. Seek explicit approval before merging/publishing to `main` / production.
