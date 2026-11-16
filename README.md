# V90.1 熊熊經濟觀測站

New resort building and bilingual Professor Maple conversations. Indices and active market simulations are pending V90.2. [Phase 0](docs/V90-PHASE0.md) · [V90.1 acceptance](docs/V90.1-ACCEPTANCE.md).

# Bear Atlas

A small island world with resident passports, cottages, animal neighbors and quiet activities. Continue this existing Site and preserve player data.

## V89 — Farming & Nature

Grow herbs, carrots, tomatoes and rice, then discover sunflowers. Plants grow on server time while you are away and never wither. Fish by the pond and exchange one item for another with a named resident through reviewed escrow. All produce uses the existing backpack, virtual wallet, gift flow and cottage display shelf. No real-money payments.

- Play: https://atlas-sports-reply.kitty50228.chatgpt.site
- Garden: `/world/garden`; pond: `/world/pond`; exchange: `/dock/trades`.
- Backpack: `/dock/collection`; shop: `/dock/shop`; guide: `/dock/catalog`.
- Acceptance, checks and rollback: [docs/V89-ACCEPTANCE.md](docs/V89-ACCEPTANCE.md).
- Runtime is a dependency-free Cloudflare Worker ESM with the existing D1 binding. The build combines Worker modules and the generated bilingual catalog. Additive migrations live in `drizzle/`.

## Build and publish

Pass these argument arrays as `commands`:

```json
[
  ["bash", "scripts/build.sh"],
  ["node", "scripts/validate-artifact.mjs"]
]
```

The deterministic build produces:

```text
dist/
├── .openai/
│   └── hosting.json
└── server/
    └── index.js
```

`dist/server/index.js` is an ES module with a default export containing `fetch(request, env, ctx)`. Edit `worker/index.js`, not the generated file under `dist/`.

## Bear Islands V2

The existing Atlas owner workspace links to the signed-in islander experience at `/world` on this service. Registration and recovery still use the existing passport records, numbers, and 24-digit recovery codes. The workspace access policy and founder-only `/passport/island` route are independent of guest permissions.

- `/world` is the islander map, with a single-player moveable avatar; `/dock/square` keeps the existing greeting board and weekly activities.
- `/world/dock` lists usable routes. `/world/sail/<island>` provides a short voyage; the destination still enforces access.
- `/world/manage` creates and manages a member island. `/world/manage/emerald` is the BEAR-0000 visitor control panel; the founder must explicitly enable it and choose which guest areas to share. `/world/emerald` never includes the founder's original private resort content. A member must be signed in and authorized before a guest area is returned, even on a direct URL. Password mode is rate-limited per island and member/network and changing its settings invalidates password-derived grants. Explicit invitations keep their own expiry until revoked.
- `/world/wardrobe` stores four slots with independent clothes, shoes and bags. Equipped outfits follow the account on the map, square, visitor pages and passport. The old passport look selector remains usable.
- The island passport includes the first visit stamp after a successful visitor landing. Existing passport records, sports responses, travel proposals, wheel draws and pair missions remain in their original tables.
- Live multiplayer, a standalone island post office, guestbook, Dinner Club, and seasonal events are not implemented. Current public and guest island scenes are a first 2.5D release, not a full 3D world.

### Safe rollout and recovery

`0006_bear_world` and `0007_bear_world_looks` are additive migrations. They create new tables and indexes; they do not rewrite existing records or add a backfill. Keep the previous published worker and workspace revisions available. If the new worker needs to be rolled back, deploy that previous revision while leaving the new tables intact; existing routes do not depend on those tables. Do not remove migration files from deployment history or drop tables as part of rollback.

Run `node --experimental-sqlite scripts/test-bear-world.mjs` from this checkout. It applies the migrations to a test database containing a legacy passport and checks registration, recovery, navigation, authorization, direct URL isolation, expiry, revocation, rate limits, visits, and shared outfit persistence.

### V3 character prototypes

The legacy `island_passports.bear` column remains the stable **character ID** (`honey`, `mist`, `cocoa`, `rabbit`, `cat`). `harborBears` resolves each ID to a species and an appearance palette; islander identity stays in the existing passport/credential records. Outfits remain in `outfit`, and equipped shoes/bags remain in the existing `bear_world_looks` slots. No migration or backfill is required, and changing appearance does not recreate an islander.

Both prototypes reuse `avatar` / `coutureAvatar` / `memberAvatar` and the shared `cabin3DClient` movement and activity renderer. Rabbit/cat traits alter the shared geometry; clothing and accessory IDs are shared. The 49 scripted resident identities and their original three bear palettes remain fixed. Dog, monkey, penguin, giraffe and polar bear are reserved future catalog extensions, not enabled options in this release.

Validation: `node --experimental-sqlite scripts/test-bear-world.mjs` and `node scripts/test-cabin-activities.mjs`. `CABIN_QA_DIR` optionally exports isolated in-memory fixture pages for browser QA; it never creates production accounts. Real iPhone Safari touch/graphics and the owner's real account should still be checked manually.
