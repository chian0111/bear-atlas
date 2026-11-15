# V87 Welcome & Adventure — isolated acceptance

Date: 2026-11-16 Asia/Taipei. Source baseline is deployed product V86.3 / Sites saved version 88, commit d30147b1a65181b2e537c5bb2c4bf017c3232d31. Work continues on main; both original Sites and GitHub histories are retained through merge 5ca165e.

## Implemented scope

- Ari, the existing resident 7-4, introduces five actual destinations: harbor, Banyan Square, the player's own cottage, public Cedar Woods and Shell Beach. Tour state is stored per account; skip, previous/next, revisit and replay do not erase completion. Free exploration has no main-quest gate. Forest/beach reuse existing inline scene art without opening founder/private-island routes.
- Shared server event/quest module supports main, side, hidden, daily and weekly quests. Six definitions grant non-tradable souvenir cards. Original three resident quest records, furniture unlocks, passport stamps and memory albums remain untouched and linked from the journal. Daily and weekly periods use UTC+8 server time, with no streak or absence penalty. Older daily/weekly keepsakes remain available in a paginated account-private collection.
- Scene-bound random action tokens expire after 30 minutes. Body identity, item, amount and permission fields are not accepted. Event names and periods are selected by server allowlists, not supplied by the player. Token consumption and event insertion use a D1 batch transaction; failed insertion rolls back token consumption. Reward condition checks and insertion occur in one SQL statement, with account/quest/period uniqueness. These validate defined web interactions; this does not claim human-input attestation or a multiplayer movement anti-cheat system.
- Forest squirrels, blue magpies and owls rotate by Taiwan server time. Muntjacs appear from 14:00–21:00, with an always-available catch-up trail outside the window. Observation has an explicit server action, persisted event and collectible; the weekly woodland side quest renews each Monday. No late-night-only collection or manipulative countdown.
- Free-text greetings coexist with the existing four presets. The server applies NFKC normalization, 120-code-point limit, control/HTML/link/contact and basic abusive-phrase filtering; rendering escapes and protects player text. Account cooldown is 30 seconds and survives withdrawal/preset switching through a hidden retained row. No greeting parser can change privileges. This is bounded basic filtering, not a claim of comprehensive multilingual moderation.
- Six visitors reference existing IDs: Hugo 0-3, Liv 5-4, Ari 7-4, Emi 0-4, Felix 0-5, Clara 0-0. One new invitation per Taiwan day, no popup, accept/later/decline, one-hour quiet defer, and an account-level off switch. Conversation occurs in the player's existing cottage and creates a server event. New visitor appearances resolve the original roster palette/outfit; NPCs no longer inherit the owner's detailed outfit when fur matches. Existing optional stories and earned memories remain available.
- Bear/rabbit/cat room geometry, table height, chair contact, approach, sitting, sleep and stand behavior were inspected and regression-tested. Existing supported furniture dimensions and saved coordinates were retained; no claim of a new character rig or blanket furniture rescaling. The renderer change isolates visitor appearance from the owner's.
- New strings are in the existing bilingual catalog; no replacement translation or identity system. New scene actions work with native forms, without JavaScript. Wildlife art is static; existing reduced-motion controls remain in place.

## Database rollout and preservation

Migration 0017 adds six tables only: preferences, action tokens, validated events, reward receipts, bounded visits and custom greetings. No UPDATE/backfill/drop of legacy data, new currency or inventory. Ownership derives from the authenticated passport Cookie on every route. The new journal migration entry is appended; prior entries and SQL are unchanged.

Read-only Sites database overview confirmed `island_cabin_environment` already exists in production despite 0016 being absent from the older local journal. This release does not reintroduce or replay 0016; it appends 0017. The package helper includes migrations in dist/.openai/drizzle, and Sites applies pending migrations before the Worker upload. No production player rows were downloaded or modified for tests.

If the V87 schema is absent or unavailable, new routes return a bilingual 503 and existing scenes remain available. No migration-owned DDL runs in a request handler.

## Automated verification

Passed in isolated SQLite memory fixtures and renderer stubs:

- `node --experimental-sqlite scripts/test-adventure.mjs`: pre-existing identities unchanged; account isolation; hostile-origin, duplicate-field and forged reward/owner/event rejection; expired and consumed token rejection; atomic failure/retry; five real route interactions; replay/skip without completion loss; midnight/day and weekly renewal; reward replay and old keepsake readback; greeting validation, escaped text, cooldown and withdrawal bypass rejection; NPC off/defer/accept/in-cottage talk; missing-schema graceful fallback; bilingual HTML checks.
- `I18N_AUDIT_REPORT=/tmp/v87-final-i18n.json node --experimental-sqlite scripts/test-bear-world.mjs`: all existing account/recovery, old quest/story/collection, wardrobe, private island/grants, expiry/revocation, home/bedroom, furniture saves/conflicts/visitor denial, environment, 49 residents and Nomad House checks passed. 178 existing HTML routes, zero incomplete built-in strings. The separate adventure suite covers new routes and states.
- `node scripts/test-cabin-activities.mjs`: room geometry, three species, approaches, table activities, three seat types × four rotations, targeted sleep/wake, single owner, legacy furniture and 390px simulated touch/drag/frame checks passed after visitor isolation change.
- `node scripts/test-nomad-living.mjs`, `node scripts/test-nomad-house.mjs`, `node scripts/test-golf.mjs`, `node scripts/test-sports-venues.mjs`, `node scripts/test-i18n.mjs`: passed.
- Build and artifact validation passed. Source whitespace/diff checks passed.

## Browser observations and limits

Before browser tooling was removed mid-task, the isolated localhost Worker was exercised in the in-app browser: English journal and new quest progress, forest observation save/redirect, muntjac catch-up, 390×844 layout, accepting Liv, visiting the real cottage, completing conversation and observing progress 1/1, and switching to Traditional Chinese without losing state. No real accounts or production writes were used.

That pass found a mixed-language home link, now fixed with a full catalog entry. Later refinements (avatar overlay, replay navigation, persistent keepsake list and roster-specific visitor outfit) have automated checks but did not receive another browser visual pass after tooling removal. No final screenshot was saved. Actual mobile hardware, Safari, touch performance and OS reduced-motion behavior are not independently verified. Simulated 390px tests and browser viewport observations are not device acceptance.

## Rollback

Redeploy the same Site's V86.3 saved version:
`appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_4e53d29204948191b2d6fc0ac1c3cc2c`.

Leave all six additive V87 tables intact. Do not drop tables, reset bindings, restore over player records or force-push history. Old V86.3 routes do not depend on these tables. V88–V91 have not been implemented.

## Publication

Succeeded at 2026-11-16 00:41:13 Asia/Taipei.

- Product release: V87; Sites saved version number: 89 (these are distinct sequences).
- Source commit: 7233800366af5cc4ca517ec54dd4a4fb1aaf788e.
- Saved version: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_e250ab5b0a388191bf50d0a6f0efee30.
- Deployment: appgdep_6af9e09d79948191b97518d3ee928872, status succeeded.
- Archive SHA-256: 73a186c60a56efa767e7997ecf07626d8c03cb42085011762651ed1557cc3bb3.
- URL: https://atlas-sports-reply.kitty50228.chatgpt.site. Existing public audience and DB binding retained.
- Initial source push returned HTTP 400. Remote history was reconciled without overwriting, and project-local HTTP post buffering was increased before successful push, packaging and native publication.
- GitHub native sync script was attempted after saving source but gh is not logged in. Connector source/history-bundle mirroring is handled separately below; no native mirror is claimed.
