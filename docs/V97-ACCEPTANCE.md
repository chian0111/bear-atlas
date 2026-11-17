# V97 — cozy daily interactions

- Harbor wave now shows a server-backed completion state, welcome-quest progress and a receipt after the redirect. Repeat waves retain once-only quest event semantics.
- Map utility links are consolidated into six icon/name/purpose entrances; the existing map and destination travel remain intact.
- Backpack has an original SVG illustration. Same-page filters, purchases, item use/display and task reward claims update their content without page reload; preserve scroll, content height and expanded named sections. Native navigation and offline guards remain available.
- Six new goods: honey bread (4), herbal tea (3), berries (5), miniature table lamp (18), cedar planter (14), wooden mantel clock (20). Food consumes one serving through the existing atomic zero-coin inventory debit, recorded as Enjoyed food. Decor uses the existing four cottage display slots, with removal back to inventory. These are shelf furnishings; no floor furniture editor changes.
- Explicit dark text/pale backgrounds for adventure action links, including the cedar walk. Bilingual copy added.

Verification: build and ESM validation; collection suite against source and compiled Worker; adventure, pocket inline, task return, player experience, garden inline, garden, resort navigation, i18n suites passed. New integration coverage verifies six purchases, duplicate purchase/consumption replay, account isolation, no negative food stock, unchanged coin balance on consumption, decor placement and cottage readback, harbor receipt and entrance markup. No schema migrations, player reset or binding/access changes.

Browser QA: unavailable because the required Sites cua_repl.js tool is absent. Physical phone layout, scroll and touch acceptance remain unverified. User referenced image one but no image attachment was supplied; map changes follow the existing source layout and requested icon/name/purpose direction.

Publication verified: product V97 / platform 115; runtime cc2191ef66cc254f40ec01c8b41b56bfcd87f4bd; saved version appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_212a220d47bc819186183f1371708ff4; deployment appgdep_6afb9bf9dd388191aef84762eeca1bf2 succeeded at 2026-11-17 00:12 UTC. GitHub implementation commit 8a66fd497cd02840ad8631d5d63f548f7078d163 was pushed and matched remote main. The historical sync helper cannot tag commits stored only in the preserved Git bundle; ordinary non-force push mirrors this update while retaining that backup.
