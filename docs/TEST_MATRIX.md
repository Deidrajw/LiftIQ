# LiftIQ — Test Matrix

**Scope:** V15.7 development branch, 2026-10-23. PASS does not imply authenticated browser/real Hevy API testing.

| Test | Result | Evidence |
|---|---|---|
| JavaScript syntax of full modified `public/index.html` | PASS | Compiler checked the updated inline script |
| Completed API workout ID + distinct exercise titles retained | PASS | Isolated source-derived test with two fictional same-day workouts |
| Two same-day completed workouts offered as separate candidates | PASS | Source-derived same-date fixture |
| No automatic linking before confirmation | PASS | Source-derived link-map assertion |
| Link created only through confirm path | PASS | Source-derived confirmation stub |
| Exercise title comparison uses selected workout's list | PASS | Source-derived confirmed workout fixture |
| Unlink removes only reconciliation record | PASS | Link removed, journal observations unchanged |
| Distant completed workouts rejected | PASS | Source-derived date-window fixture |
| Existing journal and Hevy localStorage keys remain | PASS | Source diff / inspection |
| Stale sync uses elapsed hours >72 | PASS | Source assertion |
| Authenticated Hevy sync after V15.7 change | NOT RUN | Requires actual authorized user session |
| Netlify production deployment | NOT RUN | Preview branch deliberately not merged |
| Google OAuth and Gemini requests | NOT RUN | Requires session |
| Mobile iOS Safari/VoiceOver | NOT RUN | Requires device testing |
| Browser cache saturation and quota errors | NOT RUN | Covered by catch/fallback in implementation but not browser QA |
| Preserved saved chats/cycles and older journal histories | NOT RUN | Requires comprehensive signed-in local-storage regression |

**Guardrails:** Never claim syntax tests are functional authentication tests. Do not merge without checking the remaining risk paths.
