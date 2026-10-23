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
