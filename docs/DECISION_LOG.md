# LiftIQ — Decision Log

## Accepted decisions

- **2026-10-23 — Hevy is the source of completed workouts.** LiftIQ adds interpretation; journal and plan data never count as completed sets or sessions.
- **2026-10-23 — Match journals only with user confirmation.** No automatic assignment even when date and title agree. If multiple workouts share a date, display them as separate candidates.
- **2026-10-23 — Hevy API session ID is needed for exact post-workout linking.** The existing daily aggregate `STATE.dailyLog` does not prove which exercises belong to which individual session. Do not reconcile from daily aggregates.
- **2026-10-23 — V15.7 uses additive local storage.** Keep `liftiq_training_context_v142`, `ti_state`, and existing saved targets unchanged. New keys: `liftiq_hevy_session_evidence_v157` and `liftiq_journal_hevy_links_v157`. No migration/reset required.
- **2026-10-23 — Explicit uncertainty in comparisons.** The presence/absence of a Hevy exercise title is only a comparison of the recorded exercise list, not a plan-versus-actual or medical conclusion. Do not equate variations with comparable loads.
- **2026-10-23 — User controls publishing.** A feature preview is developed on a dedicated GitHub branch; no production merge without request.
- **Prior established — Approved Coach UI retained.** Right-aligned charcoal user messages, left blue-tinted Coach messages, one natural scroll, distinct composer, collapsed evidence, compact history drawer.

## Rejected approaches
- Treating `STATE.dailyLog[date]` as an exact workout's exercise list.
- Automatically linking a journal based solely on date or title.
- Updating training targets or mesocycles based on a journal observation.
- Posting private journal notes to Gemini without explicit confirmation.
- Adding a new top-level navigation tab or creating a second workout logger.
