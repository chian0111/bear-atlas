# V85 Sports Club — planned scope

Base: published V84 source e4573473b95c46dad939158a49033e13c97785c2. Development and GitHub synchronization now use main directly at the user's request. No V85 implementation or deployment is claimed by this plan.

## Current architecture

Five facility previews and dialogs are built by leisureArt/facilityHub in worker/resort-upgrade.js using fixed isometric SVG artwork. upgradeClient adds a short generic action. Golf has a separate tested putting state machine. The cottage already uses a projected Canvas mesh renderer; the resort map has WebGL with Canvas fallback. A new heavyweight engine is unnecessary.

## Delivery batches

1. Shared sports scene renderer: reuse projected mesh principles, add selectable viewing angles, floor/platform thickness, coherent light and contact shadows. Keep fixed SVG as a fallback. Do not remount the putting scene or reset its state.
2. Indoor gym: wooden floor, thick window frames, sea view, recognizable treadmill belt/handrails, dumbbell rack, bench, plants and mat. Character approaches equipment before an action. Table tennis: table thickness and legs, correctly placed net, paddles, readable ball flight and room lighting.
3. Outdoor pickleball and tennis: distinct court markings and colors, net posts, seating, fence depth, plants and sea breeze details. Infinity pool: coping thickness, water depth/tile cues, subtle reflections, ladder and lounge seating, with the selected species retained.
4. Integration: direct venue entry/return, preserved golf, bilingual labels, reduced motion, touch targets, scene cleanup when closed/hidden, isolated permissions/data regression and responsive visual review.

## Expected files

- worker/resort-upgrade.js: facility cards/dialogs and art fallback.
- A shared sports scene module integrated into worker/index.js and scripts/build.sh.
- worker/locales/core.json: semantic zh-TW/en controls and feedback.
- scripts/test-golf.mjs and the isolated world suite: retained behavior; add meaningful scene lifecycle/state preservation checks.
- CHANGELOG.md and docs/release-history.json: actual verified release metadata only when a version is saved/published.

Do not replace player IDs, avatar/body species, furniture data, visitor permissions or current routes. Retain V84 rollback. Main is the update destination; older branches remain archival, without further development pushes.
