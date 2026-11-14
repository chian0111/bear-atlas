# V83 Cozy Living & Immersive World — candidate

Base: production V82 source a379e60d9579b5ab2102fe0cae6ae700b71cc994. Branch v83-cozy-living starts from bf29c4261c21a3bbba6061851ed6caf46a294905, the same V82 code with verified release metadata. No V83 deployment is authorized until the requested browser acceptance gate passes.

## Batches
- 83.1: 5ba65b0 — isolated per-owner/per-room environment table, validated same-origin API, optimistic revisions, main light/bedside/nightlight/curtains/presets. Existing furniture formats untouched.
- 83.2–3: a536b94 — bear/rabbit/cat window/desk/appreciation navigation, wake stretch, retained sleep/breathing/Zzz, entry mat/slippers/blanket/basket/decorative clock. Existing catalog supplies plants, books, mugs, pictures, pillows and bedside tables. Added scenery does not add collision obstacles.
- 83.4: 12e89f9 — localized warm glow, cup steam, authored Web Audio tones/noise, independently saved audio preferences, no autoplay on entry, reduced sleeping volume, visibility/page lifecycle cleanup, scene target collision avoidance. Rain is a player-selected visual scene, not live weather.
- 83.5: 053a234 — existing WebGL/Canvas geometry retained; contact shadows, ground/plank marks, bounded leaf/flag wind, sea shimmer; reduced motion/manual pause/offscreen handling. No map collision or route geometry edits.

## Verified with isolated data
Worker integration suite: owner and room separation, saved-state readback, stale write 409, forged owner 400, anonymous 403, cross-origin 403, unchanged furniture. Existing identity/recovery/visitor/collection/golf/café routes retained.
Renderer suite: all species sleep/sit/stand/wake; new window/desk approaches and stretch; old furniture placement/rotation/duplicate/undo/save tests.
Chrome browser: scene light controls, manual change after preset, refresh persistence, curtain progress, independent music/ambience activation, seven scene controls without rectangle overlap at 390px cabin width. Canvas resort fallback observed around 12 ms per draw in this environment; no claim for other devices.

## Remaining acceptance gates
- iPhone Safari and desktop Safari are unavailable here. Touch gestures, Web Audio, room return/re-entry, reduced motion and visual layout require real Safari verification.
- Chrome WebGL hardware path was unavailable; Canvas fallback was exercised.
- No production player data was used. Production remains V82.
- GitHub visibility change requires a signed-in browser; connector lacks repository-settings mutation.

## Rollback
V82 saved version: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_6a94400893448191b4386ef35ab243d9. Deployment: appgdep_6af82317686c81919ad7903ab1406c38.
To roll back after a future V83 deployment, redeploy this exact V82 saved version, keeping DB bindings unchanged. Migration 0016 only adds island_cabin_environment; V82 ignores that table. Do not drop/reset existing data.

## Environment policy
Explicit presets alter a group once. Real time never overwrites manual settings. Sleep dimming/quietness are temporary presentation overrides, not writes. Living/bedroom state is separate. Conflicting tabs stop writes until refresh. Unsaved network failures are reported. Visitors to another cabin receive no environment editing controls.

Saved candidate: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_f5ff952182d881918e89ed38c5e2e520
Candidate source: aa923ddd783726033d1635bef9c989014ddb1832
No production deployment was requested for this candidate.
