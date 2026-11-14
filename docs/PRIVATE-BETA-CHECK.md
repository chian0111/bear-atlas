# Private Beta Ready — 小範圍檢查與變更

日期：2026-11-13（Asia/Taipei）。從正式 V71 增量修改，沒有回退至需求標題中的 V68。回復來源：V71 / 0d53a568c5005456dffc4714d9ac0b8cffed0a33；已儲存版本 appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_9cda4f230a3081918c2f15c797129eb0。重新部署原已儲存版本可回復介面；本輪沒有資料遷移。

## 修改前

- 已實作且基線自動測試通過：護照/BEAR ID/恢復登入、49 位居民與動物造型、客廳/獨立私人臥室、家具實例、坐姿/睡眠、Ari、收藏、分享與私人房間權限。
- 既有但有 UX 問題：首次指南收合，指南儲存鍵在同一瀏覽器共用；選地點後下一步在側欄/下方，不夠直接；頁首長暱稱可擠壓排版；角色表單沒有送出中/防重複按鈕回饋。
- 已有生活化場景：運動公園、旅人車站，以及咖啡街/廣場/書屋/市集 SVG 場景、穩定入口與既有互動；未重新製作。
- 未驗證：iPhone Safari 實機、低效能手機效能、無指導新玩家成功率。

## 本輪實際修改

- worker/index.js：新玩家/返回入口文案；首次指南自動展開、可跳過、依公開 BEAR ID 隔離瀏覽器引導狀態；原 Clara 引導互動完成後收起。沒有新增任務/獎勵。
- worker/index.js：地圖下新增會隨選點更新的直接進入連結，重用既有目的地活動卡連結；地圖座標、路徑、帳號與權限不變。
- worker/index.js、worker/public-scenes.js：長暱稱省略顯示，title/aria-label 與私人護照保留完整名稱；名稱與 BEAR ID 分隔排版；地圖 caption 換行與直接入口；允許原生 pinch zoom，不增加自訂鏡頭引擎。
- worker/index.js：角色/護照表單送出中提示，抑制同頁重複送出；pageshow 復原按鈕以支援返回。原註冊/驗證/資料 SQL 未改。
- scripts/test-beta-ui.mjs：表單首次原生送出、重複點擊抑制、返回復原。
- scripts/test-bear-world.mjs：長名稱完整資訊、匿名/島民指南識別、重複同帳號儲存的身分/恢復憑證不變。
- 快取版本更新以取得新 client。未改 DB schema、API key、權限、家具/角色資料模型、部署來源或 GitHub 設定。

## 測試結果

| 項目 | 狀態 | 證據/限制 |
| --- | --- | --- |
| 新玩家選角 → 建證 → 保存恢復碼 → 世界 → 首次對話 | Pass | 隔離 DB 的實際桌機瀏覽器操作；未擷取/輸出恢復碼 |
| 首次引導可跳過、點步驟、完成互動收起 | Pass | 瀏覽器 Clara 話題完成回饋與指南隱藏 |
| 長英文名稱及完整名稱可查 | Pass | 23 字元測試名，截斷/完整 title、護照連結與 aria-label；390px 容器檢視 |
| 六個公共地點的選點與直接入口 | Pass | 瀏覽器逐一點擊 1–6 號地點，目的地連結正確，實際切入運動島/市集等 |
| 既有運動/旅行/咖啡互動 | Pass | 瀏覽器推球完成文案、明信片圖文顯示、喝茶完成；現有場景動畫單元測試 |
| NPC 路徑、停留/選取暫停、減少動態 | Pass | scripts/test-public-scenes.mjs 模擬時鐘與 DOM；不是低階手機效能量測 |
| 重新整理與另開分頁 | Pass | 隔離帳號名稱、BEAR ID 與完成後指南狀態保留 |
| 真正關閉整個瀏覽器後重開 | Not Tested | 沒有關閉使用者整個瀏覽器工作階段 |
| 既有玩家恢復登入、造型與資料保存 | Pass | test-bear-world 的全新 cookie 恢復登入與持久資料 readback；瀏覽器 QA fixture 重開既有島民 |
| 私人臥室拒絕其他玩家讀寫、邀請隔離 | Pass | server/DB 整合測試；未使用正式玩家帳號或正式 DB |
| 家具/收藏保存與重複獎勵保護 | Pass | 原有整合測試、原子轉換、重登入/讀回、房間互不覆寫 |
| 坐姿、指定床睡眠/起床、Ari、地毯 | Pass | test-cabin-activities 的渲染/互動模擬回歸；另在瀏覽器開啟 3D 臥室與互動選單 |
| 桌機視覺及 390px 窄容器 | Pass | 實際瀏覽器截圖與 DOM 尺寸；窄容器不等於手機 viewport 或觸控引擎 |
| iPhone Safari 觸控、軟鍵盤、縮放 | Not Tested | 需真機 |
| 低效能手機載入/FPS/耗電 | Not Tested | 沒有適用實機與性能數據；未增資產或動畫迴圈 |
| 無指導朋友可獨立完成 | Not Tested | 應由 Private Beta 觀察，開發者操作不能替代 |
| 建置/Worker artifact/diff | Pass | build.sh、validate-artifact.mjs、git diff --check |

執行命令：node scripts/test-beta-ui.mjs；node scripts/test-public-scenes.mjs；node scripts/test-cabin-activities.mjs；node scripts/test-recovery-reminder.mjs；node --experimental-sqlite scripts/test-bear-world.mjs；bash scripts/build.sh；node scripts/validate-artifact.mjs；git diff --check。測試不操作正式玩家資料。

## 延期與風險

P1 本輪沿用並檢查既有六個場景，沒有額外新增裝飾或動畫。未重做地圖、放大熱區或實作自訂地圖縮放；保留原有 44px 地點操作區、響應式標籤與路徑。沒有新增公開社交/付費服務。瀏覽器 localStorage 被禁用時指南進度可能無法跨頁保留，不影響帳號伺服器存檔。新版指南鍵隔離後，既有玩家可能再看見一次指南，可自由跳過。防重複送出是同頁 UX 保護，不是新增跨裝置身份去重服務；相同 cookie 的重複儲存由既有 upsert 維持單一身分。清除 cookie 前應保存原有恢復碼。

目前隔離測試未發現發布阻擋級權限/資料安全缺陷；不能由此保證正式資料沒有其他既有問題。

## Beta 建議

先由屋主在 iPhone Safari 做一次註冊/保存恢復碼、地圖進場/對話、返回小屋的 smoke test；通過後可邀請 5–8 位朋友小規模測試。若出現存檔遺失、跨玩家私人資料可讀寫、恢復登入失敗，立即暫停擴邀。

三個觀察指標（本輪不新增追蹤/分析服務，可人工記錄）：
1. 首次開啟到完成第一個互動的成功人數與耗時。
2. 玩家是否不經提示就能走進兩個地點；記錄卡在哪個按鈕。
3. 隔日/48 小時內再次返回人數，以及是否能找回原角色/BEAR ID。
