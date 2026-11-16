# V89 — Farming & Nature

Baseline: deployed product V88 / Sites saved version 93, runtime source 0f0d38a6ef5997b20834f474c002324c49902ac4, publication records 0218ff63f74b57cfcab9527ec1c507705b7ed3ba. Same Site, audience, bindings and main branch. Public GitHub source synchronization is explicitly authorized without repeated confirmation.

## Playable scope

- Three garden beds and one rice paddy. A once-per-account starter pack grants two herb, carrot and tomato seed packs each plus one rice seed pack. Later seeds use the existing virtual shop and wallet. Each planting consumes one available seed. One watering starts server-owned growth; herbs take 5 minutes, carrots 15, tomatoes 30, rice 60 and sunflowers 45. Mature crops yield two items. Offline growth needs no running browser, background task or client timestamp. Ripe crops never wither, spoil or impose absence penalties. There is no repeated watering or paid acceleration.
- Rice grows only in plot four; ordinary crops use plots one through three. Plot revision guards reject stale tabs and competing requests. Harvesting herbs, carrots and tomatoes unlocks sunflower seeds in the shop. An unlocked seed may be gifted/traded with the shared inventory.
- The existing catalog now contains 21 entries: the nine V88 items, five seed types, five harvest types and two pond finds. Crops and fish can be displayed, sold for fixed island coins, gifted or exchanged. Seeds can be gifted/traded but are not display items. Original furniture, outfits, collection IDs, balances and story records are retained. Living-room shelf meshes also represent the new harvests and pond finds.
- Pond fishing starts with a native action. Reeling becomes available after 20 seconds of server time; no reflex window and no missed catch if the player returns later. At most six new casts per Taiwan day, with a two-minute pause after collecting a catch. Pending catches survive the day boundary. No bait charge or paid chance. Two virtual fish alternate deterministically. Aquaculture/breeding remains deferred because species and behavior have not been specified.
- Two-party item exchange uses one item each. Sender enters a resident ID and requested item, reviews the resolved nickname/ID and both items, then confirms escrow. The offered item leaves available inventory. Only the named recipient can accept, explicitly giving their requested item in exchange; their available quantity is checked at execution. Both inventory transfers and receipts commit together. Sender may cancel; recipient may decline; either returns the escrow item atomically. Offers expire after 24 hours; expired offers cannot be accepted and the sender can reclaim them. No unilateral change to an already confirmed offer, public auctions or external messages.
- A new optional adventure side quest connects harvest, the existing wildlife observation and pond catch. Existing forest residents/time windows and catch-up routes remain available. Entry points are added to the actual nature area, map/home navigation, backpack and shop. The welcome tour now includes gardening and fishing. All strings use the existing Traditional Chinese/English catalog.

Financial education, Bear Bank, Bear Central Bank, Bear Index and fundraising remain future vision, not part of this release.

## Data and atomicity

Migration 0020 adds four tables (plots, fishing sessions, trades, operations), two indexes and two triggers. No seed dataset, backfill, old-schema modification or legacy row reset. Four empty plots are initialized only when an account opens the new area. Starter seeds are minted only after explicit claim and have one pack receipt plus per-seed ledger entries.

Server-issued operations bind account, plot revision, crop/item, recipient, trade reference and durations. Browser execution submits only the operation token, never prices, quantities, readiness time or owner keys. Same-origin authenticated forms and duplicate-field rejection apply. Tokens expire after 30 minutes; new-cast tokens also stop at the Taiwan day boundary. A single conditional update with validation/effect triggers commits plot/fish/escrow changes, inventory deltas, shared V88 ledger receipts and adventure events in one SQLite statement transaction. Negative inventory and receiver overflow roll back the full statement. Applied tokens return their prior result without double consumption or minting.

Exchange inventories exclude displayed/reserved quantities. Offered escrow is removed at confirmation, preventing reuse in another sale, gift or offer. If a cancellation return would exceed inventory capacity, the operation fails without changing the pending offer; the item remains recoverable after the sender makes space. No player account, transaction or credential from production is read for tests or included in GitHub.

## Verification

- Source and built Worker garden suites pass: one-time starter, account isolation, forged fields/origin denial, seed debit, stale revisions, rice restriction, server maturity boundary, offline/non-withering behavior, repeat watering/harvest, injected post-credit failure and retry, fishing readiness/cooldown, sunflower unlock, recipient resolution, escrow, bilateral exchange, insufficient recipient items, third-party denial, accept/cancel race rejection, expiry/reclaim, decline/refund, injected failure on the sender receipt with full rollback, legacy identity preservation, bilingual coverage and missing-schema fallback.
- Existing V88 collection and V87 adventure suites pass against source and the combined built Worker. Full world regression, 178-route bilingual audit, i18n catalog/runtime, existing cabin activity/species/seating/navigation/sleep/wake and ESM artifact checks pass.
- Isolated Chrome: starter claim; planting; watering; navigating away and returning after actual five-minute herb growth; harvest; pond cast/wait/reel/cooldown; resident number/name and item review; offer escrow and cancellation return; Chinese/English UI. Screenshot artifacts are in docs/qa. No production test account or production inventory write.
- Final visual refinement corrects plant leaf positions within the SVG frame and shows server deadlines with seconds.

Responsive CSS provides single-column plots on narrow screens and 44px controls. Actual iPhone/Safari hardware and native touch/keyboard behavior remain unverified; desktop browser checks are not device acceptance.

## Publication and rollback

Native publication succeeded: product V89 / Sites saved version 94. Runtime source 3d29fae3a2e7cf40a6883862ade737b417493819. Deployment appgdep_6afa73c8938c819181f0f5b7d5da3a3a. URL https://atlas-sports-reply.kitty50228.chatgpt.site. Exact saved-version and archive hash are recorded in docs/release-history.json. Existing Site/public audience and DB binding are retained.

Rollback to V88 on the same Site:
appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_6cbe2031c29c8191b0c23d6da21b3564.
Keep all additive tables, new inventory entries and escrow records. Do not drop tables or restore over player records. V88 does not manage pending exchange escrow, so reclaiming/cancelling requires redeploying V89; recorded items must not be discarded. GitHub snapshots retain existing GitHub history, with connector SHAs distinct from original Sites source commits.
