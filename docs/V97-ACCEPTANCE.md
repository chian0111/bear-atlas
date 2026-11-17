# V97 — cozy daily interactions

- Harbor wave now shows a server-backed completion state, welcome-quest progress and a receipt after the redirect. Repeat waves retain once-only quest event semantics.
- Map utility links are consolidated into six icon/name/purpose entrances; the existing map and destination travel remain intact.
- Backpack has an original SVG illustration. Same-page filters, purchases, item use/display and task reward claims update their content without page reload; preserve scroll, content height and expanded named sections. Native navigation and offline guards remain available.
- Six new goods: honey bread (4), herbal tea (3), berries (5), miniature table lamp (18), cedar planter (14), wooden mantel clock (20). Food consumes one serving through the existing atomic zero-coin inventory debit, recorded as Enjoyed food. Decor uses the existing four cottage display slots, with removal back to inventory. These are shelf furnishings; no floor furniture editor changes.
- Explicit dark text/pale backgrounds for adventure action links, including the cedar walk. Bilingual copy added.

Verification: build and ESM validation; collection suite against source and compiled Worker; adventure, pocket inline, task return, player experience, garden inline, garden, resort navigation, i18n suites passed. New integration coverage verifies six purchases, duplicate purchase/consumption replay, account isolation, no negative food stock, unchanged coin balance on consumption, decor placement and cottage readback, harbor receipt and entrance markup. No schema migrations, player reset or binding/access changes.

Browser QA: unavailable because the required Sites cua_repl.js tool is absent. Physical phone layout, scroll and touch acceptance remain unverified. User referenced image one but no image attachment was supplied; map changes follow the existing source layout and requested icon/name/purpose direction.

Publication details will be recorded after native deployment succeeds.
