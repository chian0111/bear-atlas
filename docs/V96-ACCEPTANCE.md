# V96 — Focused tasks, direct garden and Bear coins

## Scope

Continue the existing V95 Site (platform109, runtime 8d1af6bb00d907094fa6cff5f53c5de39420f968). No migrations, binding changes, player-data resets, prices, currency amounts, inventories, character IDs or permission changes.

- Four persistent primary tabs: Backpack, Shop, Garden, Tasks. Garden opens the existing planting area directly and has its own active state.
- Task rewards ready to claim sort first. Only the first current task is initially expanded; each unfinished task presents one next action, with all steps available in a disclosure. Resident stories, crop orders, NPC visits and completed tasks remain accessible in separate disclosures.
- Same-page task POSTs restore open groups and their reading position after the global header is measured. Intentional cross-scene navigation stays native; storage failure does not block submission. Hash navigation opens the relevant disclosure.
- Resident cards retain internal padding and wrapping inside the task section. Grid cells may shrink safely on narrow screens.
- Carrot Mystery no longer auto-injects into Banyan Square, coastal Garden or Career Café. The complete existing five-stage simulated case is read at the Economic Observatory, using the same sequential server tokens, progress, snapshot and one-time badge. Its task links point to the observatory rather than the forest.
- Player-facing 島幣 / Island coins becomes 熊熊幣 / Bear coins, with the actual existing uses explained next to the balance: seeds and cabin decorations; income through crop orders and eligible collectible sales. Data fields and financial settlement are unchanged.

## Isolated validation

23 test scripts pass: docs/V96-TEST-REPORT.json. World bilingual audit: 184 routes, no incomplete built-in strings, docs/V96-I18N-REPORT.json. Adventure, collection, farm orders and economy story also pass against the compiled Worker. Build, default.fetch validation and git diff checks pass.

Extended assertions verify four-tab order, garden active state, folded task groups, absence of Carrot panels from Square/Garden/Café, and continued story completion/replay/rollback/account isolation. Task-return DOM tests cover header-aware position, expanded ancestors, submission capture and blocked storage. Existing transaction, reward, furnishing, visitor and registration regression tests pass with in-memory SQLite fixtures and no production writes.

Physical mobile devices, signed-in browser geometry and real-player usability remain unverified. DOM/HTML checks are engineering evidence, not a claim that player acceptance is complete.

## Rollback

Redeploy saved V95 version appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_2543f5743c84819198eb22fa23691141. No database reversal is required.

## Publication

Product V96 / platform110 deployed successfully at 2026-11-16 23:25:45 Asia/Taipei.

- Runtime commit: 7a716a3f126350ccaab215664391032035363535.
- Saved version: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_3c9d0ced5ed48191b983c5f8586981f0.
- Deployment: appgdep_6afb2069a86481918667b0f01740960a, succeeded.
- Artifact SHA-256: 81ab486ac9acd49d1533d65a052ce47c1e5e61bfe758477eba721cfdf7275aa0.
- Public audience and existing DB binding retained.
- Native GitHub sync could not authenticate with gh; use the already-authorized connector for normal source files plus a separately verified restorable Sites-history bundle.
