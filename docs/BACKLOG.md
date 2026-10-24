# LiftIQ — Product & Engineering Backlog

**Snapshot:** 2026-10-23, following V15.7 preview merge `a7f60a1`. Re-verify against current GitHub and Netlify before starting work.

Priority definitions: **P0** correctness/data-integrity or release blocker; **P1** significant user value or regression risk; **P2** quality/maintainability. "Merged preview" is **not** the same as "fully tested and accepted."

## Active / highest-priority

| Priority | Work item | Current state | Acceptance / next action |
|---|---|---|---|
| P0 | **V15.7 reconciliation QA & hardening** | Merged preview; production deploy ready; authenticated regression unverified | Test same-day and adjacent-day matches, multiple workouts, time-zone differences, duplicates, no candidates, stale cache, unlink/delete, storage errors and accessibility before calling it complete. |
| P0 | **Hevy source-of-truth regression** | Architecture present; signed-in regression unverified | Verify sync retains records on network/API failures and that journals/suggestions cannot create false Hevy completions. |
| P1 | **Privacy / matching semantics** | User confirmation and opt-in Gemini prompt implemented in source | Confirm journal notes never silently enter AI requests; display exact exercise-name comparison limitations; clarify ambiguous dates. |
| P1 | **V15.7 signed-in production acceptance** | Not performed in this documentation pass | After scenario tests, verify Google login, live Hevy sync, match persistence/reopen and Gemini follow-up; record who tested/what data was used without sharing secrets. |
| P1 | **Training-memory intelligence (candidate V15.8)** | Pending | Use explicitly approved journal flags to warn about recurring substitutions/discomfort in appropriate context; no diagnoses or automatic program changes. |
| P1 | **Next Workout recommendation quality** | V15.6.1 weekday/focus rules deployed | Test schedule gaps, different split titles, stale workouts, paused cycles, overrides and preferences saved in browser; refine evidence disclosure where needed. |
| P2 | **Frontend technical-debt audit** | Legacy CSS/JS wrappers remain | Map render paths, deduplicate with targeted regression tests; avoid "rewrite all" approach. |
| P2 | **Exercise-family matching** | Mixed aliases and variations possible | Improve search and analytics while preserving valid comparable-load rules. |
| P2 | **Mobile/accessibility audit** | Partial prior demo checks, no complete signed-in Safari audit | Run 320/375/390 px, keyboard/touch/VoiceOver, contrast, safe areas, dialogs and Coach scroll. |

## Recently completed / merged (not a substitute for regression)

- **V15.5** — evidence-aware mesocycle review, requiring approval for changes.
- **V15.6** — improved Next Workout explanation and cycle/journal distinctions.
- **V15.6.1** — saved weekdays and optional day focus influence Next Workout ranking; manual override retained.
- **V15.7 preview** — user-confirmed finished-journal matching to cached workout-level Hevy sessions, name-only exercise comparison, explicit unlink and stale-sync notice adjustment. **Still requires acceptance QA.**

## Scope boundaries

- Do not introduce workout logging in LiftIQ: Hevy remains the logger.
- Do not represent existing workout-title grouping as a Hevy routine-library API.
- Do not auto-send journal content to Gemini, auto-modify cycles, or erase existing storage.
- Do not relabel a released *preview* as a verified complete feature without testing.

## Next exact action

Read `docs/PROJECT_STATE.md` and source `public/index.html`, verify Netlify; then create/execute a **V15.7 regression suite with fictional Hevy workout IDs and journal timestamps**, recording passed/failed/not-run in `TEST_MATRIX.md`. Fix defects before proposing V15.8.


### V15.8 development update — 2026-10-23
- **In development only** on `feature/v15-8-training-memory-preview`: collapsed saved-flag context on Today. Uses previously approved active flags, never scans unsolicited private journal notes. Matching is exercise-focus heuristic, not verified medical or workout evidence. Resolution retains original journal notes.
- **Blocking**: signed-in V15.7.1 acceptance and iOS Safari checks; then V15.8 browser acceptance; user approval to deploy.


### Active infrastructure priority: Cloudflare Pages migration
- Implement preview Pages Functions and `/api` routing on isolated branch; tests and continuity docs.
- Validate Cloudflare build, auth, Gemini and Hevy sync with secure server-side secrets. Verify Google OAuth new origin.
- Migrate browser-origin local data safely and establish rollback before switching.
- Keep draft Progress/Today QA PR #5 isolated until ready.
