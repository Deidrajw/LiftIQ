# LiftIQ — Product & Engineering Decision Log

Purpose: preserve **why** a behavior was chosen, so future chats do not undo approved UX or architectural decisions. Amend rather than silently overwrite a decision. Verify current code when reconciling old records.

| ID | Decision | Rationale / constraints | Status |
|---|---|---|---|
| D-001 | **Hevy remains the completed-workout source of truth.** LiftIQ interprets results; it does not duplicate workout logging. | Avoid competing exercise logs, conflicting completion claims and Apple Watch duplication. Journals, drafts and plans are not completed workouts. | Standing |
| D-002 | Maintain **Today, Progress, Goals, Plan, Coach** as five primary destinations; Journal/Search/Sync/Settings are secondary. | Reduce crowded navigation and excessive dashboard cards. Introduce new tabs only with explicit UX rationale. | Approved |
| D-003 | Keep premium **Obsidian-inspired** graphite/charcoal UI, restrained steel-blue accents, light/dark mode and consistent icons/chevrons. | Distinct from generic AI/Windows dashboards; prioritize mobile clarity and accessibility. | Approved |
| D-004 | Coach displays **right-aligned neutral user messages** versus **left-aligned muted blue Coach messages** with distinct composer, compact history drawer and a *single natural conversation scroll*. | Previous nearly identical bubbles and double scrolling made conversation difficult. Do not reintroduce nested scroll or permanently expanded evidence. | Approved |
| D-005 | Show dated comparable Hevy evidence, limitations and uncertainty; never invent RPE, readiness or plateau diagnoses. | Prevent misleading analysis from sparse workouts, exercise variants or mixed periods. | Standing |
| D-006 | **Permanent cycle, schedule-plan and target changes require approval.** | Coaching can recommend, but should not silently alter saved mesocycles, targets or completed workout data. | Standing |
| D-007 | **Next Workout** must incorporate recognized history, rotation, saved weekdays/focus, priorities and cycle context, with manual override and an explanation. | The old Suggested Session was not sufficiently actionable. Do not claim access to Hevy routine library/calendar without implemented APIs. | V15.6.1 behavior |
| D-008 | A training journal records substitutions, limitations, pain/discomfort and user decisions separately from Hevy. **Gemini receives private observations only via user-initiated review.** | Preserve source boundaries and user control; avoid diagnoses. | Standing |
| D-009 | **V15.7 matching requires explicit confirmation** of a completed Hevy session; use workout-level IDs/date/title and retain unlink. | Multiple or adjacent workouts are ambiguous; never auto-equate journal and completion. Matching of exercise titles is evidence, not proof of skips. | Implemented preview; QA pending |
| D-010 | Preserve storage keys and existing user records. Add fields or keys compatibly; tested migrations are required for destructive changes. | Browser localStorage is device-specific and must not be silently reset or populated by demos. | Standing |
| D-011 | **Inspect → Diagnose → Design → Implement → Test → Preview → Deploy if requested → Verify → Document.** | Prevent regressions from patch layers, older source copies and unverified deployment claims. | Standing |
| D-012 | Source control and deployed SHA outrank chat summaries. Maintain `PROJECT_STATE`, `BACKLOG`, `DECISION_LOG`, `RELEASE_LOG`, `TEST_MATRIX` after substantive releases. | Chat-length limits and branching conversations otherwise lose current decisions. Version numbers belong in the living state, not permanent Project Instructions. | Standing |

## Rejected / discouraged approaches

- Rebuilding the app or redesigning established screens without permission.
- Creating parallel renderers, stacked CSS patches or another competing nav destination for a feature that fits an existing area.
- Double-scroll Coach, indistinguishable message bubbles, or a large permanently expanded evidence panel.
- Treating a journal entry, AI suggestion or draft routine as a completed Hevy session.
- Comparing load across unrelated exercise variations as if they were the same lift.
- Assigning a journal to a single workout by date alone without confirmation.
- Shipping fictional preview data to real Hevy history or production localStorage.

## How to update this log

For each meaningful decision record: date, affected screen/function, approved behavior, evidence/rationale, alternatives rejected, data implications, and any user approval required. If the source disagrees with a prior choice, mark the conflict and resolve it explicitly before changing behavior.


### D-013 — V15.8 context-sensitive training memory (2026-10-23, preview awaiting acceptance)
Only explicitly saved, unresolved user flags are eligible for compact Today guidance. Show flags relevant to the suggested workout group; keep details collapsed and hide when no relevant flags exist. Provide a reversible/explicit resolution operation; preserve original journal observations. Do not automatically change workout ranking, training plan, targets, completed history or Gemini context. Keep a clear user-reported versus Hevy-evidence distinction.


### D-014 — Cloudflare previews as standard LiftIQ development environment (approved 2026-10-25)
- **Approved:** every development feature branch receives a Cloudflare Pages Git-connected preview build when supported. `main` is the only production branch for `https://liftiq.pages.dev`; merge after user approval, regression checks, and preview review.
- **Rationale:** test UI and fictional Hevy profiles without publishing experiments or disturbing current signed-in data.
- **Isolation:** demo sign-in is simulated and clearly labeled; fictional records cannot enter production localStorage, real Hevy, Gemini, or signed-in user history. No mock auth bypass in deployed production. Keep sensitive credentials in backend secrets; preview access to real credentials should be restricted and independently justified.
- **Gate:** check actual preview URL and source SHA, perform mobile/iOS checks where available, and treat real Google/Gemini/Hevy verification separately. A successful preview build is not proof of authenticated function behavior. Production only on explicit approval.
- **Rejected:** using the production host as the default testing sandbox; inventing a persistent fake signed-in state for the actual production app.
