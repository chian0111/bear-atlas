# V93 baseline and player-flow audit

Date: 2026-11-16 (Taipei). Production platform106, runtime9d5f8d3310f4586d79ecebb72d9d7286cd6f40a5; GitHub main e3e421fced050b34840c09b514defcffd52684ae. GitHub uses source snapshot commits; runtime and GitHub histories differ. Existing project appgprj_6af26b560248819190b1dc4fdcf765b2. Source main clean before edits. Rollback tag rollback/pre-v93-106, development feature/v93-simple-living. DB bindingDB; migrations0000–0023 present. Latest economic additions0021/0022/0023 are additive. Direct production schema/row inspection is unavailable; no destructive or real-player test claimed. No V93 schema change.

| System | Code/evidence | Flow finding | Disposition |
|---|---|---|---|
| Cottage/furniture/light/curtains | bedroom, cozy-living,0012/14–16; world/cabin suites | Keep existing edit/save/ownership | C retain |
| Map/navigation | resortGeometry, publicHarbor | Three competing account/map navigation surfaces plus economy before map | A simplify primary presentation |
| NPC/quests/visits/rewards | adventure,0010/11/17 | Actual actions differ by resident; food-order capabilities not obvious from café | B contextual handoff |
| Five-minute registration guide | welcome-tour,0018; adventure auto/skip/replay tests | Existing floating tour must remain; no second tour | C retain |
| Forest/beach | collection routes | Found item next steps spread across pages | B contextual hints |
| Inventory/displays/gifts | collection,0019 | Garden/trade links each appear twice in collection navbar | A remove duplicates |
| Growing/harvest/fishing | garden,0020 | Existing timed/offline growing and atomic harvest; handoff to orders unclear | B next steps |
| Orders/shop/barter | farm-orders/collection/garden,0023 | Reuse fixed quotes, receipts, guarded settlement; explain post-delivery options | B next steps |
| Bear Market | market | Distinguishes executable NPC vs simulated prices, links existing settlement | C retain |
| Observatory/BBI/BCPI/news | economy-engine/view/story | Default homepage numeric density; source reliable/reproducible | A story first, closed details |
| Nomad House | nomad-house/living | Four areas, existing seat/drink activities | C retain |
| Sports/golf/invitations | sports-venues/golf/rsvp | Existing routes and RSVP ownership preserved | C retain |
| Private island/friends/guests | world/home, voyage, invite tables | Existing expiry/revocation/visitor-only controls | C retain |
| Chinese/English | locales and i18n audit | New labels need bilingual keys; About mixed text max-widths | A consistent prose measure |
| Safari/home-screen app | mobile CSS, existing tests | Physical device and background state not directly verified | A documented validation gap for V94 |

A must fix: presentation duplication, consistent About reading widths, source-labelled economic summary. No new P0 data-loss incident observed in available engineering evidence; this does not prove absence in production.
B consolidate: explore/grow → backpack/order → delivery/reward → shop → display/cottage, with existing links and honest item-specific guidance. Do not claim any item can satisfy an order or any purchase is furniture.
C retain: all existing routes/data, scene geometry, NPC IDs, settlements, collection shelves, floating tour, free exploration. Existing motion-pause/reduced-motion controls remain. No global visual/renderer rebuild.
D future: bank/central bank/rates/advanced finance, real-time groups, property development, extra economic goods/regions. Not implemented in V93.

V94 is not started. Physical Safari/PWA, frame timing, memory profiles, 5–10 real players and seven-day retention still require actual observations. No analytics/tracking added and no retention improvement claimed.
