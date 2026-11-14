# V84 Full Bilingual Experience — release candidate

Status: implemented and tested in isolation; production publication is blocked on the requested Safari acceptance. Production remains V83. This is not a record of a successful V84 deployment.

## Baseline and scope

- V83 production source: `aa923ddd783726033d1635bef9c989014ddb1832`.
- V83 deployment: `appgdep_6af85251d6848191a4662f15e5880d04` (succeeded).
- V84 branch: `feature/v84-bilingual`, based on V83 documentation checkpoint `4df6e1acacbf2f99612886442db0069b79245851`.
- Foundation commit: `7ee35ef88aaeee3b049a032149de8d90b7818ebc`.
- Single existing Site retained. No migrations, database bindings, identity IDs, furniture IDs, character IDs or application routes changed.

## Implementation

`worker/locales/messages.json` holds the reviewed first-pass legacy source inventory and translations. `worker/locales/core.json` holds semantic keys and parameterized templates. The generated catalog currently has 2,160 entries. `scripts/compile-i18n.mjs` checks locale parity, missing values and interpolation parity and generates `worker/i18n-catalog.js` deterministically.

`worker/i18n.js` supplies keyed translation, Traditional Chinese fallback, parameter diagnostics, locale selection and the same-origin client runtime. New UI uses semantic keys. The existing Worker HTML/native-DOM architecture is retained through a compatibility adapter for legacy system text, attributes and dynamic status updates. It changes text nodes and accessibility labels, never scene roots, canvases, input values, IDs, routes or saved game data. It observes added/changed DOM text rather than translating animation frames. The cabin activity status uses the current locale directly to avoid an animation-frame translation loop.

The adapter covers the shared chrome, map/facilities, cottage/furniture/environment, 49 resident profiles and canned dialogues, café, golf, other leisure scenes, visitor dock/permissions, passport/stamps/memories, settings, forms, errors and success feedback. Existing event/story/legacy pages use the same adapter. There was no separate in-product version-announcement page; release notes remain in CHANGELOG.md and this document.

Manual selection persists to a dedicated localStorage key and locale cookie. Browser language is used only when no manual preference exists. Legacy `?lang=en` links are supported; a subsequent manual choice removes that legacy query parameter without navigation so refresh cannot override the new choice. The shared `繁中 / EN` switch is available throughout HTML pages, including form responses. It dispatches a locale-change event without reloading or replacing scene state.

Player names, custom island names/descriptions, proposals/options, gatherings, journal answers, postcards and free-text chat are explicitly protected. Even text identical to a system label remains unchanged. Escaping is retained, protection markers are removed before delivery, form values are not translated and protected attributes retain player text. Preset system greetings and fictional resident backgrounds are translated.

The philosophy page now uses the same resources instead of a separate manually maintained English page. Passport PNG canvas labels re-render on locale change; player names and member numbers stay unchanged. English passport tabs wrap at narrow widths. English dates and parameterized counters avoid Chinese units and duplicate “Page” labels.

## Automated acceptance

All used fresh in-memory SQLite fixtures, not production players.

| Check | Result |
| --- | --- |
| 2,160 translation entries: both locales, named parameters | Passed |
| Missing key/parameter diagnostics, locale priority, storage denial, no-reload switch | Passed |
| Protected player text/attributes, unchanged input values, reversible dynamic labels | Passed |
| 176 distinct HTML request paths including GET/POST responses and all 49 residents | Zero incomplete built-in strings in `V84-I18N-REPORT.json` |
| Existing identity, recovery, furniture, collections, visiting permissions and environment regression suite | Passed |
| Golf direction/power, roll, hole, replay, reduced motion and navigation regression | Passed |
| Cabin bear/cat/rabbit sitting/sleep/wake/window/desk/walking, furniture instances and edits | Passed |
| Public scenes, resort navigation, save failures, beta submit, recovery and quiet-island tests | Passed |
| Build, bundled Worker syntax and artifact manifest | Passed |

The HTML audit checks system text and visible attributes after excluding protected player content. It is a coverage report for exercised routes, not a proof of every possible future dynamic state. Unrecognized runtime strings remain visible and are exposed through `BearI18n.getMissing()` rather than silently hidden or replaced with generic copy.

## Chrome browser acceptance

Observed in the managed isolated preview:

- English map and cottage; protected Chinese fixture nickname; no remaining unprotected Chinese text in those inspected pages.
- Cottage atmosphere controls in English; Morning preset followed by a switch to Chinese retained light/curtain selections and the current activity.
- Golf: approach, putt and hole feedback in English.
- Café: herbal tea, sip feedback, then switching to Chinese retained the completed drink state.
- Resident profile and canned answer in English; the free-text message `儲存 取消 我想休息一下` remained verbatim.
- Passport PNG rendered English system labels with the Chinese player name; 390px-wide content review confirmed wrapped tabs and readable pagination.
- Philosophy switched both ways. A manual Chinese choice after `?lang=en` survived refresh with the stale query removed.

## Remaining release gates

- iPhone Safari and desktop Safari are not available in this environment. Actual Safari touch/layout, persistence and PNG/download behavior remain unverified. Narrow content review in desktop Chrome is not a mobile Safari test.
- Full real-device mobile navigation and overflow acceptance remains required.
- No V84 production deployment is authorized by this record of passing Chrome/automated checks alone: the user's request requires isolation/browser acceptance before publication.

## Rollback

Production is still the saved V83 version `appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_f5ff952182d881918e89ed38c5e2e520`. Retain that exact version and source for a later rollback. V84 adds no data schema changes; older V83 ignores the dedicated language preference key/cookie. Original commits and saved-version tags are retained in the GitHub history bundle; connector mirror commits have separate SHAs.

## Saved candidate

- Saved V84: `appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_53600924088481919067c7fb59733981`.
- Source: `e4573473b95c46dad939158a49033e13c97785c2`.
- Archive: `sha256:ba77dba794b596e889037354a2c0344baa18f0db2695767da7b6cb5158454d54`.
- Deployment: none. Reuse this saved version for publication after acceptance; do not rebuild or recreate the Site merely to retry publication.
