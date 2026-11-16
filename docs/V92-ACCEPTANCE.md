# V92 — Bear Market

Scope follows the newer roadmap: physical market, goods and NPC order/receipt hub. Earlier bank-roadmap naming is superseded. No bank, new wallet, auction or player-price engine.

Features: an eighth connected facility at existing Seaside Living Street market artwork, entrance node15(375,300) connected to1 and0; original nodes/coordinates remain. Produce stalls compare existing shop sell price, period-pinned NPC quotes and explicitly non-executable simulation prices. Existing accepted orders remain fixed. Hugo/Mika order entry uses V91 settlement. Personal completed-order receipts join existing farm_income ledger; read-only and account-scoped. Guest stalls retain login and garden access.

Files: worker/market.js; worker/resort.js; worker/index.js; worker/farm-orders.js; locales; build and tests. No migration. Existing0022/0023 and all player assets retained. Market reads can lazily create the same bounded V91 weekly offers but never move inventory/coins.

Passed: source/built farm tests, market account isolation/read-only wallet, invalid pagination, GET-only route, bilingual audit; economy/story/navigation and full-world regression. New map adds a destination without moving old stops. Artifact validation passed.

Not verified: browser visual/mobile interaction due preview browser policy rejection; physical iPhone Safari/PWA and background transitions. Do not equate automated markup checks with real-device acceptance.

Rollback: V91.4 platform103; runtime4e47a8cde53fb777f7f48907eb5e7c31cdf35001; GitHub b2a0e6d7d5898be25de12a6ffe0973c0aea63733. Additive UI only; no data deletion or financial migration. Existing ledger and orders continue through rollback.

Verified publication: {"release": "V92", "version": 104, "version_id": "appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_30188b6063408191b0047eff9cf265df", "commit": "d4198f51f8764ff95419d5cb93d6cbe25b70b74d", "deployment_id": "appgdep_6afacf95378081918cd7da1744f4e6fd"}
