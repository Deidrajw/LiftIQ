# LiftIQ — Release Log

## V15.7 — Development preview, 2026-10-23
**Branch:** `feature/v15-7-post-workout-reconciliation`  
**App commit:** `42f0688c97bddf394186e168d13cd548f063dc37`  
**Production:** NOT DEPLOYED — production remains V15.6.1.

### User-visible changes
- Finished journals can be reviewed against a list of completed Hevy workout candidates from the current device's latest successful sync.
- Candidate cards show exact workout date/title, likely title match or mismatch, and nearby-date ambiguity.
- Explicitly confirm a link or unlink later; these operations never change Hevy, workout history, approved targets, or cycles.
- Confirmed links show the count of completed Hevy exercise names and whether journal-referenced exercise titles appear in the linked workout.
- Source separation and caveats clarify that a not-found exercise is not proof of a planned/omitted exercise.
- The stale-sync warning fires only when more than 72 elapsed hours have passed.

### Data impact
- New device-local cache: `liftiq_hevy_session_evidence_v157` (bounded to 250 sessions and 80 unique exercise titles/session; new evidence comes only from Hevy API records).
- New device-local user confirmation mapping: `liftiq_journal_hevy_links_v157`.
- No renamed/deleted pre-existing localStorage keys or data migrations. No new backend secrets/endpoints.

### Not implemented
- Automatic program changes, workout logging to Hevy, exercise substitutions as actual planned-vs-performed deltas, cross-device sync.
- No authenticated end-to-end or published branch preview verification yet.

## V15.6.1 — Published, 2026-10-23
Schedule-aware Next Workout, saved days and routine focus, manual override; verified published commit `fa0fb81c8f399bc25b445af4be894d4fd3622da3`, then demo-only asset commit `fd618137003f5de0bbf2129216a2ba656b0f3871`.
