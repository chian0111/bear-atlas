# V95 — Backpack, Shop & Tasks usability

User priority: “背包／商店／任務：切來切去、找不到功能”. Baseline verified product V94 / Sites saved version 108, runtime d707b3668b2c5c6a555a26ab12bf3d0f7724296a, deployment appgdep_6afae049a430819199c67710eda75d74 succeeded. Development uses the latest authoritative Site checkout, not the older V87 workspace.

## Visible changes

- Consistent Backpack / Shop / Tasks tabs across inventory, shop, guide, trade, adventure, resident quests and farm orders. Mobile tabs stay below the existing measured header; secondary text collapses to avoid stacked toolbars. Existing global map/home navigation remains available. Task return links retain the relevant orders/resident section.
- Backpack title now says My backpack. Owned items appear before the display shelf. Four native category links (All, Materials, Seeds and harvest, Decor) make items easier to find. Item cards show owned/available stock and one expandable Uses and actions section; existing sale/gift/display forms remain intact. Relevant accepted orders and seed planting use existing routes. Display, guide, trade and ledger are secondary tools, with the display shelf collapsed until requested.
- Shop cards show owned stock, available/required materials and coin shortfall. Missing material links lead to its existing beach/forest source. Successful purchase/craft redirects carry the applied operation reference. The server reads this receipt only for its authenticated owner and only when applied; links lead to that exact backpack item with its actions/display choices expanded. Display saves reopen the display shelf. No query parameter creates a reward or changes an item.
- Tasks overview links to adventure tasks, original resident stories/furniture and accepted crop orders in one page. Ready-to-claim tasks appear first; completed tasks and the welcome-tour replay move into native details. Accepted crop-order summaries show actual required/available stock, excluding display reservations, and link to the original delivery confirmation. No new order engine, reward engine or inventory state is created.
- New copy uses the existing bilingual catalog. Links retain pale green/dark text styling; controls are at least 44px and keyboard focus remains visible. Native forms, category links and details work without client JavaScript. No new motion effects.

## Preservation and safety

No schema or migration changes. No changes to economic formulas, prices, order quotes, transactional triggers, operation eligibility, account identity, collections, permissions or existing saved assets. All new account data queries bind the authenticated key. Order overview is read-only and does not generate/accept offers. Foreign, unapplied or invalid receipt references do not render a personalized receipt. Missing order data degrades to a clear message while core views remain usable. Existing idempotent transaction handlers, V94 offline/double-submit controls and BFCache handling are retained.

## Verification

- All 22 existing test scripts passed in isolated fixtures; commands/status/timings: docs/V95-TEST-REPORT.json. Full world bilingual audit: 184 HTML routes, zero incomplete built-in strings (docs/V95-I18N-REPORT.json).
- Extended collection tests cover verified purchase return, foreign/unapplied receipt rejection, exact item/display expansion, item-before-shelf ordering, three-tab navigation and category isolation. Existing atomic buy/craft/gift/sale/display, replay and failure rollback assertions still pass.
- Extended farm-order tests cover accepted order/available stock projection in the task hub and backpack, plus cross-account order isolation. Existing integrated seed→grow→harvest→deliver→reward→buy→display→home loop remains passing.
- Adventure, collection and farm-order suites pass both source and compiled Worker builds. Build, ESM validation and diff checks pass.
- Optional local preview serves only the isolated in-memory collection fixtures; it is not part of the deployed Worker. Local HTTP readback verified the rendered navigation and a preview panel was requested. Signed-in local browser automation was unavailable. After publication, an independent read-only browser inspected all three production pages as a guest at approximately 1000×1000: tabs were visible, active states correct, text readable, no blank viewport or horizontal clipping observed. No account was created or signed in. This does not verify signed-in inventory/order views or narrow/mobile behavior. Screenshots remained in-session only, with no export URL. Safari/iPhone and actual-player usability acceptance remain unverified; responsive styles and HTML checks do not replace those observations.

## Rollback

Redeploy V94 saved version appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_47c9d640acbc8191b66e9ba16b29af6e to the same Site. No database restore or schema reversal is required. Keep all player data, bindings and history intact.

## Publication

Engineering publication succeeded at 2026-11-16 22:39:35 Asia/Taipei.

- Product V95 / Sites saved version 109 (distinct sequences).
- Runtime commit: 8d1af6bb00d907094fa6cff5f53c5de39420f968.
- Saved version: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_2543f5743c84819198eb22fa23691141.
- Deployment: appgdep_6afb15980d988191bb58ed9bceadfc02, succeeded.
- Archive SHA-256: 3184584c646f108a4c57deaf8ee423943c85fadc6ae18b5d51f22e774c5b0a90.
- URL: https://atlas-sports-reply.kitty50228.chatgpt.site. Existing audience and DB binding retained.
- GitHub synchronization and real-player usability acceptance remain separate from this verified engineering publication.
