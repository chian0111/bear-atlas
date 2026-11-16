# V94 Player Experience & Private Beta

## Engineering candidate, 2026-11-16

V93 prerequisite verified: platform107, runtime9781252a924dff468f78cad7487b186afa86d8a7, deployment appgdep_6afaddf69a8c819184c296d965a7506f succeeded. GitHub main was e3e421fced050b34840c09b514defcffd52684ae (pre-V93 source snapshot); synchronization is a separate operation.

Changes: shared navigation measures its actual height (including language/font changes); viewport-fit and safe-area spacing; mobile inputs use 16px to avoid focus zoom; bounded scrollable dialogs; native POST duplicate guard without disabling submitter values; offline submissions blocked before existing handlers; bilingual offline notice; pageshow resets pending native forms; hidden-page CSS animations pause. No new database tables, migrations, account storage, analytics, economic rules, or player-data changes. Existing fetch-based saves remain independent and keep their error/retry handling. No offline saving or queued replay is promised.

Passed: ESM build/validation; world regression on isolated SQLite migrations0000–0023 including legacy compatibility; all existing test-*.mjs suites plus new lifecycle tests (22 scripts total). Tests cover cabin persistence, recovery, ownership/visitor permissions, harvest/order duplicate and concurrent settlement, rollback, economy, collection, tour, sports and bilingual content. New tests cover duplicate native POST, offline capture, BFCache reset, invalid/GET/already-handled form exclusion, measured header and visibility state.

Browser observations: local isolated preview, desktop Chromium; Chinese three-direction homepage renders, economic details closed, EN switch updates navigation/story, Explore scrolls to map. No production account or player data used. Not a physical iPhone Safari or installed Web App result. No measured FPS, memory or load-time improvement claimed. Production schema was not directly queried; preserved DB binding and migration files audited only.

## Private Beta release gate — 5–10 participants

Use existing island passports and invitation permissions. Do not send invitations automatically. Recruit 5–10 consenting testers, including at least two iPhones (Safari and Add to Home Screen), one small screen and one English user. No new tracking service. Record observations manually using anonymous P01–P10 IDs; do not record recovery codes, cookies, personal messages or private account data.

Session: allow five minutes without explanation. Ask tester to (1) find/return to their home; (2) explore and obtain an item; (3) identify an eligible resident order and deliver; (4) identify received reward; (5) buy an existing item and display an eligible collectible; (6) return home. Existing item eligibility and currency apply; do not imply all items qualify. If waiting for growth, observe free exploration rather than changing timers.

Device checks: portrait/landscape, keyboard open/close, dialogs and safe areas, pinch/page scroll vs scene drag, interrupted cabin save with retry, two taps on harvest/delivery, reload, back/forward, background 30 seconds and resume, offline attempt then reconnect; repeat in installed Web App. Confirm successful save by reload and a second page using the same identity. Never clear storage or rotate identity during recovery tests.

Return check: invite optional D1 and D7 visits. Ask what they remember, choose to repeat, cannot find, and want to do next. Avoid rewards or reminders that imply attendance is compulsory.

| Tester | Device/mode/lang | 5-min loop steps completed / 6 | Help count | Save/reload | D1 return | D7 return | Issue IDs |
|---|---|---|---|---|---|---|---|
| P01–P10 | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

Define D1/D7 as returns on the next/seventh Taipei calendar day after first visit. Report numerator and eligible denominator; do not call nonresponders retained. Also report voluntary return intent, favourite action, exit point and observed confusion. This is a small qualitative sample, not statistical proof of retention.

Issue template: ID; priority; anonymous tester; device/OS/browser/mode/language; route; steps; expected/actual; reproducibility; safe screenshot; owner; fix commit; retest result. P0 = data loss, unauthorized access, currency/item duplication, cannot enter/save; stop release and fix first. P1 = main loop blocked or mobile keyboard/dialog hides required control; fix before expanding Beta. P2 = copy/polish/minor friction; order by recurrence and impact. Do not expand features to resolve feedback prematurely.

Completion gate: zero open P0, P1 paths retested, iPhone Safari and installed Web App actually observed, 5–10 first sessions recorded, D1/D7 denominators mature before retention conclusions. Engineering implementation and internal/browser checks can ship before these observations; V94 player acceptance remains pending until evidence exists.

Publication: platform108 deployed successfully, runtime d707b3668b2c5c6a555a26ab12bf3d0f7724296a, deployment appgdep_6afae049a430819199c67710eda75d74. Full bilingual audit: 184 HTML routes, zero incomplete source strings.
