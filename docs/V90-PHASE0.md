# V90 Phase 0 — verified existing project, 2026-11-16

Existing Site: https://atlas-sports-reply.kitty50228.chatgpt.site
Project: appgprj_6af26b560248819190b1dc4fdcf765b2. Existing public audience, DB binding retained.
Product version is V90; the requested feature/v89-bear-economic-observatory branch name is intentional.

## Actual release state

| Product | Platform version | Runtime commit | Verified native deployment |
|---|---:|---|---|
| V86.3 Nomad House | 88 | d30147b1a65181b2e537c5bb2c4bf017c3232d31 | appgdep_6af9203389d48191b59c31ae511bcfdc — succeeded |
| V87.3 welcome overlay correction | 92 | 8a1f8940cce7835b8bc159637ec3f7cd637568f9 | appgdep_6afa4b6373608191912f6523d8280376 — succeeded |
| V88 collection economy | 93 | 0f0d38a6ef5997b20834f474c002324c49902ac4 | appgdep_6afa545e5b44819190fb03c21208a0f3 — succeeded |
| V89 farming, fishing, barter | 94 | 3d29fae3a2e7cf40a6883862ade737b417493819 | appgdep_6afa73c8938c819181f0f5b7d5da3a3a — succeeded |

Current stable source + publication records: f8d8db62d004a439f82dddc38792457e8a26c209.
Verified GitHub main snapshot: 492b80650b5d5c0d0f480c238284f09fb099ddd6 (snapshot SHA differs from Sites source SHA).
Rollback: re-deploy saved platform 94, appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_5ea99626a52881919f560ebfbfb4eb00. Existing DB preserved; V90.1 has no migrations or writes.

## Existing modules and data

- Worker ESM, dependency-free build; WebGL scenery and projected Canvas/SVG fallback. Physical movement follows resortGeometry graph, not arbitrary free-roam physics. DOM pins provide touch/keyboard navigation.
- 49 fixed harbor resident IDs in harbor-neighbors.js. Mei 3-0 is a financial analyst; Leo 6-1 corporate finance; Jun 6-4 valuation. None is an economist. Preserve their identities and introduce a separate static economist-maple NPC; no new player identity or roster renumbering.
- 0017/0018: server-owned adventure events, quest receipts and optional welcome modal state. V87.3 is a real modal following registration with recovery-code confirmation, five chapters and replay/defer.
- 0019: wallet, inventory, spawns, operation receipts, displays and append-only collection ledger, guarded atomic triggers. Shop, selling, gifting, room display exist.
- 0020: garden plots, fishing, barter escrow and operation receipts. Growing output and exchanges have reliable per-player records, but no complete island-wide representative production/sales/consumption dataset. Shop prices are fixed server catalog prices.
- Semantic bilingual catalog plus legacy dictionary; generated i18n-catalog.js. Language switches client-side. User strings escaped/protected. No additional chart dependencies.
- No reliable economy-wide baseline, café sales ledger or NPC consumption series. BBI/BCPI must therefore use independent reproducible official simulation in V90.2, never logins or current wallet balances.

## Parcel and conflicts

Observatory grounded bounds x520–590, y258–292 in 940×608 map coordinates; approach (555,310), new stop 14 linked to existing stop 2 (520,337). Existing stop indices 0–13 stay unchanged. A short decorative continuation reaches the door at y298. All route segments sampled at 201 points stay outside the grounded bounds and Nomad parcel. Original six destinations and home/café route unchanged.

Sports footprint lies northeast (center635,229), Nomad parcel x414–530/y164–215; cottage center685,371; street shops west. Existing NPC walking paths remain outside new grounded bounds. Roof projection is decorative and must not be used as physical collision bounds. Browser review still required for labels/roof occlusion.

Potential conflicts handled: six-pin assumptions updated to seven; return-at whitelist extended with 14; SVG decorations retained over optional 3D; new module included once in concatenated bundle; no existing asset/permission/ledger changes. Old map stop3 and others remain legacy scenery.

Future bank/central-bank sites are not allocated or constructed yet: detailed parcel survey belongs to their future release, and no fake banking doors are added. Reserve planning capacity rather than assigning land already used by hidden routes.

## Minimum viable V90.1

Physical map building + connected entrance, indoor cozy study, optional fixed bilingual Maple conversation with all five choices, supply/demand story cards, clear pending index board, immediate return to stop14. Read-only guest/member access. No index numbers, snapshots, weekly news, quest rewards, simulated price changes or player finance in this batch.

## Boundaries for V90.2–V90.4

EconomyConfiguration/GoodsCatalog -> deterministic MarketSimulation/MarketEvents -> versioned PriceHistory/IndexSnapshots -> template EconomyNews. One authoritative island period; store raw component data, source/status/formula version, base quantities and deduplication IDs. Future player transaction ledger remains separate from simulation. BBI weights and BCPI fixed basket must be explicitly specified and tested before any published values. No YoY without twelve months.

EconomyQuestProgress should integrate adventure receipts and existing collection reward idempotency. Banking is a future independent module (rates, deposits, lending, NIM transmission), with no mutation API exposed in V90.1. No data migration is required now.

Formal iPhone Safari and installed Web App performance remain device acceptance work; passing Chromium QA does not prove Safari compatibility. No Phase 0 blockers to the scoped read-only V90.1.
