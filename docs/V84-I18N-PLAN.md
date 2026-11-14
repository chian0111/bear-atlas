# V84 bilingual implementation — batch 1 checkpoint

Status: development only; not a V84 release and not approved for production.

## Verified baseline

- Production V83 source: `aa923ddd783726033d1635bef9c989014ddb1832`.
- Production deployment: `appgdep_6af85251d6848191a4662f15e5880d04` (succeeded).
- Documentation checkpoint used to branch: `4df6e1acacbf2f99612886442db0069b79245851`.
- Branch: `feature/v84-bilingual`.
- Rendering: Worker-generated HTML, native DOM scripts, SVG, Canvas 2D and a lightweight WebGL resort renderer. A framework/router rewrite is unnecessary.
- Existing English support was limited to the philosophy page, not global i18n.

## Inventory and terminology

`worker/locales/messages.json` contains 2,129 unique source fragments with locations and first-pass English. This lexical inventory includes comments and partial sentences; it is not a count of rendered strings or evidence of full translation coverage. `worker/locales/core.json` adds 19 semantic keys. Both locales have values for every catalog key. Source-derived hashes remain stable while their source phrase remains unchanged; newly integrated features should use semantic keys.

| 中文 | English |
| --- | --- |
| 熊熊度假村／熊熊渡假村 | Bear Atlas Retreat |
| 我的秘密小屋 | My Cozy Cottage |
| 翡翠灣 | Jade Cove |
| 傷心之島 | Quiet Island |
| 運動俱樂部 | Sports Club |
| 海邊咖啡館 | Seaside Café |

## Batch plan and files

| Batch | Files | Acceptance |
| --- | --- | --- |
| 1: foundation and persistent chrome | `worker/i18n.js`, `worker/i18n-catalog.js`, `worker/locales/*.json`, `worker/index.js`, `scripts/compile-i18n.mjs`, `scripts/inventory-i18n.py`, `scripts/test-i18n.mjs`, `scripts/build.sh` | catalog parity, interpolation and missing diagnostics, preference precedence, explicit DOM bindings, unchanged user text and scene state |
| 2: all page and activity bindings | `worker/index.js`, `worker/island-life.js`, `worker/cozy-living.js`, `worker/resort-upgrade.js`, `worker/golf.js`, `worker/public-scenes.js`, `worker/resort.js`, `worker/sad-island.js`, `worker/harbor-neighbors.js`, `worker/bedroom.js`, locale resources | map, cottage, furniture, resident biographies/dialogues, activities, visitors, collections, update notices, errors, SSR and client updates |
| 3: release acceptance | isolated QA fixtures, regression tests, missing report, responsive review, `CHANGELOG.md`, `docs/release-history.json`, GitHub backup | zero unexplained built-in Chinese in English, state/data compatibility, browser/mobile verification and rollback |

## Foundation behavior

- New UI uses stable keys and named parameter interpolation. Missing keys/translations/parameters have structured diagnostics, with Traditional Chinese fallback for missing locale values.
- Only explicitly marked DOM nodes translate. `[translate="no"]` and `[data-user-content]` block translation. Never infer that arbitrary Chinese text is system text.
- Translations use `textContent`, not HTML insertion; interpolated player names remain plain text.
- Manual query selection, stored preference, locale cookie, and browser language determine the initial client locale. Manual selection persists to localStorage and cookie. Storage-denied browsers can still switch in memory.
- Switches update bound text and dispatch `bear-locale-change`; they do not navigate, replace scenes, or touch player/game storage.
- A same-origin runtime script works with external-script CSP; no remote translation service or additional site is used.
- The runtime currently binds persistent navigation only. English scene text, philosophy consolidation, Canvas passport labels, dynamic prompts, POST responses and full-site integration are **not finished**.

## Tests executed

- `node scripts/compile-i18n.mjs`: all 2,148 entries validated, locale presence and parameter parity.
- `node scripts/test-i18n.mjs`: passed key/parameter diagnostics, interpolation preserving Chinese player names, locale priority, q=0 exclusion, live switching, blocked storage and protected user content.
- `node scripts/test-bear-world.mjs`: passed existing isolated integration regression suite, including identity, visiting permissions, furniture persistence, species and V83 environment checks.
- `node scripts/test-cabin-activities.mjs`: passed, including bear/cat/rabbit window and desk navigation, sleep/wake stretch and resumed walking.
- Build and bundled Worker syntax checks passed.

## Remaining risks / release gates

Catalog completeness is not rendered coverage. Fragment translations need contextual editing when bound to complete sentences, plurals and counters. No claim of full English mode, mobile layout acceptance, Safari acceptance or production readiness is made by this checkpoint. No production database or player data was used for testing; no migrations or deployment settings changed.

Rollback: production stays on V83. Discarding the isolated feature branch leaves V83 unchanged. Any future release must retain the V83 saved Site version and original source commit above.
