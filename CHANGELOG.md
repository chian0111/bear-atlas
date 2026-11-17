# V99 — 清楚的島嶼入口與看得見的互動（已正式部署）

移除首頁探索／今日生活重複捷徑；修正小食動畫未加入頁面的疏漏並更新快取版本；全站熊熊幣共用圖案；生活街整合咖啡館、書屋、市集與廣場，潮汐攤位改為次要入口；書屋閱讀空間及三篇故事；修正運動俱樂部棕熊重複翻面與步行姿勢；自然區大圖示按鈕；更新創作理念。既有資料、路線與交易規則保留。驗證及限制見 docs/V99-ACCEPTANCE.md。

# V98 — 收成販售與安靜的島嶼日常（已正式部署）

置頂市集取代廣場，收割後直達販售；可選數量批次賣出並保留畫面高度；商店與任務新增插圖；享用小食顯示目前角色動畫；移除首頁重複回家與港口問候區，招呼編輯收合。既有資料與交易保護保留，無資料庫遷移。詳見 docs/V98-ACCEPTANCE.md。

# V97 — 療癒日常互動更新（已正式部署）

港口揮手成功回饋與探索進度；地圖六個圖示入口；背包插圖與分類原地更新；新增三款食物及三款小屋展示擺設，接通購買、持有、享用及擺放；修正雪松探索按鈕對比。沿用既有交易與玩家存檔。驗證及限制見 docs/V97-ACCEPTANCE.md。

# V96.4 — 修正花園播種連線錯誤（已正式部署）

Fix form.action being shadowed by the hidden action input, which sent garden POSTs to an invalid [object HTMLInputElement] URL. Read the action attribute and validate the same-origin garden endpoint. Original state, tokens and Bear coin header preserved. Targeted regression and compiled garden checks pass; see docs/V96.4-ACCEPTANCE.md.

# V96.3 — 花園原地操作與頂部熊熊幣（已正式部署）

Garden plant/water/harvest POSTs update the garden fragment while preserving plot position, with duplicate and network retry safeguards. A bear-face gold coin and server-owned balance sit immediately before language controls. No data reset, migration or settlement changes. See docs/V96.3-ACCEPTANCE.md.

# V96.2 — 菜圃優先、減少花園重複入口（已正式部署）

Removed repeated Garden navigation and generic next-step footer. Added plot status summary, local seed disclosure, conditional seed/order cues, verified local harvest receipt and same-plot return. Original crop timing, tokens, balances, inventory, trades and permissions preserved. See docs/V96.2-ACCEPTANCE.md.

# V96.1 — 廣場與花園直達、居民故事按鈕對比（已正式部署）

Fixed header links directly to Square and Garden; removed unrelated bottom shortcuts from Square. Resident story actions now keep readable dark text and pale backgrounds across link states. Existing data, routes and permissions retained. See docs/V96.1-ACCEPTANCE.md.

# V96 — 任務聚焦、花園捷徑與熊熊幣（已正式部署）

Four primary tabs, one next action per task, folded secondary groups, task POST position retention, resident-card padding, and Carrot Mystery confined to the observatory. Currency labels and practical uses clarified in both languages. Existing data and server settlement preserved. Isolated validation: 23 suites passed; see docs/V96-ACCEPTANCE.md.

# V95 — Backpack, Shop & Tasks navigation（已正式部署）

Consistent three-tab navigation; backpack-first item groups and contextual uses; verified purchase-to-item/display return links; owned/material/shortfall shop cues; unified task overview with private active-order stock. Mobile tabs stay below the measured site header. No schema, settlement, inventory, reward, price or permission changes. Product V95 / platform109 deployed successfully; evidence in docs/V95-ACCEPTANCE.md.

V94 engineering publication verified: platform108, runtime d707b3668b2c5c6a555a26ab12bf3d0f7724296a, deployment appgdep_6afae049a430819199c67710eda75d74 succeeded. Physical-device and player acceptance pending.

# V94 Player Experience — engineering candidate

Mobile safe-area and measured navigation, native POST duplicate/offline guard, BFCache reset and background CSS pause. Existing storage and settlement unchanged. Internal suites pass; desktop browser homepage/EN/explore checked. Physical iPhone/Web App and 5–10-player Beta remain pending; see docs/V94-ACCEPTANCE.md. V93 platform107 deployment verified succeeded.

## V92 — Bear Market

Connected market entrance, produce price comparisons, existing NPC orders and personal settled receipts. No migration or new financial system.

## V91.4

Bounded orders verified; expired orders in paginated history; safer retry navigation. Physical Safari/PWA acceptance remains unverified.

# V91.3 — Atomic delivery and rewards

Accepted NPC orders can be delivered using shared available inventory; one transaction debits produce, credits coins and records receipts. Resident thanks and order history included.

# V91.2 — Bounded scenario quotes

New NPC offers link to official simulated events with capped prices/quantities; all earlier issued terms remain fixed. No original shop or official-index change.

# V91.1 — Resident farm orders

Garden-linked NPC offers, transparent fixed terms, accept/decline/cancel, account/week caps and shared inventory rules. Delivery remains visibly pending V91.3. Additive0023; no acceptance asset debit.

# V90.4 — QA and mobile interaction polish

Verified regression suite, native-form saving state and BFCache reset. Physical iPhone Safari/installed Web App remain explicitly unverified. No schema/player-asset change.

# V90.3 — Economic Storytelling

Five-stop pinned-case Carrot Mystery, once-only Little Economist badge in existing collections, immutable snapshot-driven weekly bulletin and homepage entry. Additive0022; no player asset consumption.

# V90.2.1 — Homepage economic indices

Compact BBI/BCPI cards appear above the island map for guests and residents, with weekly changes, current period, simulated-data label and event explanation. Uses the exact authoritative Observatory snapshot. No migration or financial changes.

# V90.2 — Economic Engine

Shared deterministic weekly simulated market, fixed-basket BCPI and weighted volume BBI, immutable raw snapshots, traceable three-event cycle, lightweight history charts and resettable independent supply-demand experiments. Additive0021 only; no changes to player assets or shop prices. Deployed platform96, runtime82d6113; native deployment appgdep_6afa920225448191a57d0b704474344b succeeded.

# V90.1 — Bear Economic Observatory

Physical seventh resort building, cozy indoor study and optional bilingual Professor Maple dialogue. Phase 0 verified V86.3/V87.3/V88/V89 deployments. No migration or player-asset changes. BBI/BCPI and playable simulation remain V90.2. Deployed as platform95, runtime c7fd6c4, native deployment appgdep_6afa8d65a41881918de918d070bb5975 succeeded.

# Bear Atlas 更新紀錄

## V89（已正式部署｜田園與自然）
- 三格菜圃與一格稻田：種子包、種植、澆水、伺服器離線成長、收成與向日葵品種解鎖。
- 池邊下竿二十秒可收竿，不設快反應窗口；每日六次新下竿，收竿後休息兩分鐘。
- 共用背包擴充至二十一種物品，收成與魚類可展示、出售、贈禮及交換。
- 雙方確認的一件換一件：物品暫存、接受、撤回、婉拒、過期取回及原子交易收據。
- 新增田園自然支線任務，沿用森林時段事件與既有角色。
- 詳見 docs/V89-ACCEPTANCE.md；養殖、金融教育及央行系統仍為後續願景。

## V88（已正式部署｜島嶼收藏與商店）
- 公共海灘每日六枚貝殼、森林三份落葉松果，伺服器保存採集與防重複拾取。
- 共用背包、九種物品圖鑑、四格小屋展示架與立體場景收藏。
- 海風小舖：虛擬島幣購買、素材交換製作、紀念卡一次性島幣獎勵。
- 核對島民編號後贈送一件物品，雙方背包與帳本一起更新。
- 採集、扣款、製作、贈禮、展示採原子交易及冪等收據；不更動舊家具、服裝與收藏資料。
- 詳見 docs/V88-ACCEPTANCE.md；iPhone/Safari 實機尚未驗證。

## V87.3（已正式部署｜懸浮新手導覽）
- 註冊完成後自動開啟 Ari 懸浮導覽；遮罩、五步介紹、中英切換、稍後繼續與終點選擇。
- 補充生活街、運動俱樂部及 Nomad House 的實際玩法與入口。
- 港口與廣場自訂招呼提供預覽、已發佈內容及撤下；任務顯示逐項進度與下一步入口。
- NPC 來訪補上原居民肖像及聊天、領獎流程；保留既有帳號與遊戲資料。
- 詳見 docs/V87.3-ACCEPTANCE.md；手機/Safari 實機尚未驗證。

## V87.2（已正式部署｜地圖新手導覽）
- 新玩家完成註冊、保存恢復碼後，預設進入地圖並自動看到 Ari 五站導覽。
- 導覽放在地圖上方，逐步標示港口、廣場、小屋與自然區；前後步驟、跳過與重看都在地圖操作。
- 進度跟帳號保存；舊玩家不強制彈出，地圖可重新觀看。保留原居民聊天、權限、任務與收藏。
- 只新增兩個導覽偏好欄位，無舊資料回填；導覽完成不發放探索任務獎勵。

## V87.1（已正式部署｜入口對比修正）
- 冒險手帳、雪松森林、貝殼海灘及冒險區連結改為柔和淺綠底、深綠字。
- 明確指定一般、已造訪、滑過與鍵盤焦點樣式，修正全站連結規則覆蓋文字顏色。
- 保留 44px 操作高度、原功能、玩家資料與權限；無資料庫遷移。

## V87（已正式部署｜Welcome & Adventure）
- 沿用 V86.3、49 位居民與原有資料；公共五站導覽、跳過／重看與帳號進度。
- 新增可信任互動事件、主線／支線／隱藏／每日／每週任務與一次性紀念卡，保留舊任務與收藏。
- 森林三種時段動物與山羌補遇；海灘聽海；六位既有居民受控來訪，可接受、稍後、拒絕與關閉。
- 自訂招呼限制、內容過濾、文字跳脫、更新頻率與撤下；保留快捷招呼。
- 校正新訪客使用既有居民毛色與服裝，避免繼承房主造型。三物種家具互動回歸保留。
- 正式發布狀態以 docs/V87-ACCEPTANCE.md 及 release-history.json 為準；不含 V88–V91。

## V86.3（已正式部署｜Nomad House 正式開幕）
- 原地塊移除施工阻擋，開放共享工作區、咖啡角落、放空露台與專注角落。
- 五個座位支援坐下、工作、閱讀、休息、伸展、放空及離席散步；咖啡沿用既有流程。
- 六位居民引用既有 49 人名單，切換打字、閱讀、畫圖、喝咖啡、思考與伸展；無新角色資料庫或即時 AI 呼叫。
- 加入可選安靜模式、預設靜音環境音、完整雙語；V86.4 計時器尚未加入。
- 隔離回歸及 Chrome 互動驗證通過；Safari／手機實機未驗證。詳見 docs/V86.3-ACCEPTANCE.md。

## V86.2（已正式部署｜屋架施工進展）
- 沿用 V86.1 原地塊，加入竹屋架、部分茅草屋頂、木平台、連接步道、藤椅、熱帶植栽與施工架。
- 保留圍籬及施工告示；新增雙語實際進度圖，未開放座位、咖啡或專注模式。
- 隔離資料與既有功能回歸通過；Safari／手機實機限制仍保留。
- 驗收與回滾見 docs/V86.2-ACCEPTANCE.md。

## V86.1（已正式部署｜Nomad House 施工預告）
- 以 V85 為基準，在北側綠地加入固定施工地塊、挖土機、木圍籬、建材、安全帽工程熊熊與建築預覽。
- 沿用固定步道與 WebGL／Canvas 場景，新增第六個入口；支援繁中與英文。
- 無資料庫遷移；四個生活區域尚未開放。Safari／手機實機驗收待完成；使用者於限制揭露後明確要求發布。
- 依本次要求使用 feature/v86-nomad-house 分支；驗證見 docs/V86.1-ACCEPTANCE.md。

## V85（運動場館立體精修）
- 五個場館加入可切換視角的立體場景、器材厚度、材質與接地陰影。
- 保留角色物種、雙語、高爾夫、收藏與玩家資料；球場仍為短暫動作體驗。
- 直接於 main 開發，驗證與限制見 docs/V85-ACCEPTANCE.md。

## V84（已正式部署）
- 全站 zh-TW / en 共用語言切換、偏好保存與動態文字更新，不重載場景。
- 地圖、小屋、家具環境、49 位居民、咖啡館、高爾夫、訪客、收藏及操作提示接入統一翻譯資源。
- 保護玩家自訂文字；護照 PNG 跟隨語言重繪，改善英文窄版分頁排版。
- 176 個隔離 HTML 路徑文字檢查零缺漏，既有功能回歸測試及 Chrome 主要互動驗證通過。
- 使用者確認驗收通過並要求部署，V84 已成功發布。自動化環境未獨立執行 Safari 實機驗證；詳見 docs/V84-ACCEPTANCE.md。

## V83（已正式部署）
- 獨立環境存檔、燈光、窗簾與生活情境。
- 窗邊／桌前／展示櫃停留、起床伸展與生活小物。
- 雨景、暖光、自製音訊與低動態支援。
- 沿用園區渲染器增加材質、接地陰影與輕微風動。
- 完整驗收狀態與 V82 回滾方法見 docs/V83-ACCEPTANCE.md；Safari 驗收待完成。

## V82
- 移除床鋪／座位按鈕漏掉的「熊熊限定」文字。
- 小屋狀態列、起身按鈕與儲存通知分列，避免窄螢幕重疊。
- 創作理念取消提早斷段與段落窄欄，新增完整英文頁與語言切換。
- 設定私人 GitHub 儲存庫 chian0111/bear-atlas 作為程式與歷史備份目的地。

## V81
- 小屋增加回園區按鈕，操作集中在右上選單，移除常駐 Ari 敲門提示。
- 貓咪與兔兔支援既有床鋪睡覺、椅子坐下與起身。
- 校正咖啡杯大小與喝飲料位置，統一榕樹廣場名稱與地圖標籤對比。
- 自然休憩區改為 05，校正休息姿勢，移除自然區與首頁漂流瓶入口。
- 擴充創作理念文字與場景插圖。

## V80
- 使用實際路程選擇園區路線，設施之間不繞回碼頭。
- 地圖目的地單次點選後，自動走到入口並進入；回園區時保留設施位置。
- 自家入口直接進屋，室內出門直接回小屋區。
- 貓、兔、熊改用各自毛色與比例的身體、手腳及尾巴。
- 推桿前的走近動作放慢並校正角色落點。
- 簡化咖啡街、運動俱樂部、廣場與其他生活場所的多餘聊天入口。
- 自然區休息切換坐下／起身，修正返回連結與按鈕文字對比。
- 歷史版本索引與 GitHub 同步流程。

## V79
立體首頁與備援、49 位全身居民、飲品圖樣、伸展動畫、運動設施雛形、獨立海岸花園與理念插圖。

## V78
固定頂部導覽、精簡舊工具入口、居民短程散步與創作理念頁。

## V77
渡假村名稱與設施導覽統一、回家入口及點按範圍調整。

## V76
發布渡假村 P0 與高爾夫 P1。

## V75
渡假村整合、小屋往返與訪客權限。原始碼已保存，該版發布失敗。

## V1–V74
完整保存版本號、原始碼 commit、部署識別碼及封裝雜湊於 docs/release-history.json。
此索引記錄「已保存版本」，不將保存狀態冒充部署成功。
