# V88 — Island Collection & Economy

Baseline: product V87.3 / Sites saved version 92, runtime source 8a1f8940cce7835b8bc159637ec3f7cd637568f9, source-with-publication-records 8f7e313fcb4e68a419ce4f25b6e033568ac89d58. Same existing Site and DB binding. Work continues on main; public GitHub source publication is explicitly authorized by the user.

## Playable scope

- Six account-owned shell pickups per Taiwan day on the existing public beach scene: three cream scallops, one peach spiral shell and two mist-blue clam shells. Three woodland finds: one naturally fallen pinecone and two fallen leaves. No live plant harvesting, shared-resource competition, late-night event or streak requirement. The same day/scene/slot persists across refreshes; a completed pickup becomes unavailable. At Taiwan midnight a new set appears and old pickup tokens expire.
- A shared server item catalog covers five materials and four display decorations. Catalog records source, type, rarity, sell value, coin price or crafting cost. Account inventory retains quantity and first acquisition time, including discovery after quantities reach zero. Existing adventure cards are read through a compatibility adapter; old story collections, furniture unlocks and wardrobes retain their original paths and data.
- Backpack, collection guide, account-private paginated transaction ledger, four persistent display slots and a wall-mounted shelf in the living-room renderer. A visible shelf management link doubles as a fallback preview when the 3D canvas is unavailable. Display reservations prevent selling, crafting with or gifting an item currently on the shelf until it is returned. The wall shelf has no floor footprint and does not alter saved furniture coordinates or movement rules.
- Sea Breeze Shop sells a cream vase (12 coins) and a woven tray (8 coins). Craft a shell mobile with three scallops, or a leaf frame with two fallen leaves. Spare materials exchange for 2–3 coins apiece. Each already-claimed adventure keepsake offers an optional one-time 10-coin bonus, preserving the original card. New balances begin at zero; nothing is backfilled into existing player rows.
- Gifts transfer one available item to the exact resident number. The app resolves and displays the recipient's nickname, resident number, item and quantity before final confirmation. Self/unknown recipient and forged owner/amount/price fields are rejected. Sender debit, receiver credit and both ledger entries succeed or roll back together. These are virtual in-game items, with no email or external messages.
- New text uses the existing Traditional Chinese/English catalog. V87 welcome content now explains the available shell collection, shop and optional coin bonus. Map, square and home retain visible backpack/shop links.

## Economy rules

Pure virtual game currency: no payment provider, purchasable coins, cash value, withdrawal, credit card, paid random rewards or new paywall around old outfits/furniture. Existing currencies/data were not reset. This version includes material-for-item exchanges and direct gifts, not player auctions or a two-sided trade marketplace. Fish and farm produce remain future systems; no fake collectible entries advertise them as playable.

## Atomicity and ownership

Migration 0019 adds six collection tables, two indexes and two SQLite triggers only. No seeds, legacy backfill, schema drops or user-row rewrites. Wallets are initialized on account access; daily pickups are generated as bounded runtime records.

All prices, item effects, recipient keys, material costs and pickup references are copied into server-created random operations. The browser posts only the operation token for execution. Same-origin authenticated forms and duplicate-field rejection apply. Tokens are account-bound and expire after 30 minutes; pickup tokens also expire at the Taiwan day boundary. A single conditional SQL update runs validation, debit/credit, inventory/slot/spawn changes and ledger insertion through triggers in the same statement transaction. Failed checks or downstream insert failure roll the entire statement back, leaving the operation retryable. Reposting an applied token returns the existing result without charging or granting again. Ledger uniqueness prevents multiple reward receipts or competing tokens for one pickup. Integer bounds prevent negative balances/quantities and inventory overflow. Displayed quantities are reserved at execution time, not merely hidden by the UI.

Receipts include crafted output and a separate material-debit entry, as well as sender/receiver gift entries. Ledger and balance views derive identity exclusively from the resident Cookie. No runtime credentials, production user data or production test accounts are uploaded or used in validation.

## Validation

- Source and built Worker collection suite: account isolation, hostile origin, forged price/identity/quantity rejection, competing/duplicate tokens, no refresh rerolls, Taiwan midnight, display reservation, crafting material/output, insufficient balance, nonnegative wallet, injected downstream failure/retry with full rollback, one-time legacy card bonus, gift recipient resolution/debit/credit/replay/capacity rollback, private views, unchanged passports/credentials and missing-schema fallback. Bilingual audit has no incomplete built-in strings.
- Existing adventure suite, world/178-route bilingual regression and i18n suite passed. Cabin activity regression preserves original species, seating, navigation and sleep/wake behavior.
- Isolated desktop Chrome: pickup changes to collected, backpack quantities persist, three scallops craft one mobile, shelf slot persists, cottage management displays the item, and gift confirmation resolves an actual QA resident before successful transfer. Final rendered shelf and final shop views are captured in docs/qa.
- Build/ESM artifact validation and source diff checks passed.

Responsive CSS includes 44px controls, single-column narrow cards and bounded scene pickup targets. Actual iPhone/Safari hardware and OS-level touch keyboard behavior remain unverified; desktop checks are not real-device acceptance.

## Deployment and rollback

Native publication succeeded: product V88 / Sites saved version 93. Runtime source 0f0d38a6ef5997b20834f474c002324c49902ac4. Deployment appgdep_6afa545e5b44819190fb03c21208a0f3. URL https://atlas-sports-reply.kitty50228.chatgpt.site. Exact saved-version and archive hash are recorded in docs/release-history.json. Sites applies pending migration 0019 before Worker upload. If collection tables are unavailable, collection routes return a bilingual 503 and older scenes stay usable.

Rollback to the same Site's V87.3 saved version:
appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_3dc3034f700881918dfed6abd4f2d646.
Leave additive collection tables and recorded balances/items intact; never restore over player records or drop tables. V87.3 ignores the new tables. GitHub connector snapshots preserve existing GitHub history; their commit IDs differ from original Sites source commit IDs.
