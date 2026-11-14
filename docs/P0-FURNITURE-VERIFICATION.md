# P0 家具操作與儲存驗證

日期：2026-11-13（Asia/Taipei）。基準為正式 V73，commit 6791cc74cdae59c356e1e9810b8317fdb41b047c。原保存版本 appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_c430b6940fe8819194c07fac2626c29c 可重新部署回復程式。沒有資料遷移；回復不刪除這次新增的合法家具實例。

## 實際修改

- 私人臥室編輯工具列新增「複製家具」，沿用新增實例、位置檢查及最多 25 件限制。新 ID、新建立時間，保留類型、方向與圖層；先找鄰近有效空位，不覆寫原件。沒有空位時只提示，不修改配置。
- 複製可用既有 Undo 精確復原；刪除副本不影響原件。客廳維持原格式，沒有新增複製或實例化客廳。
- 私人臥室的選取浮動標籤不再攔截點擊；保留選取外框、底部名稱與工具列，家具本體仍可選取及拖曳。
- 儲存失敗顯示布置仍保留與重試提示。409 版本衝突另有提示，保留畫面，不自動覆寫另一分頁的新存檔。
- 修正儲存請求期間繼續編輯的 dirty 判定：只將送出的快照標成已儲存，後續改動仍提示再次儲存；不因此離開房間。

主要模組：worker/island-life.js、worker/index.js；測試：scripts/test-cabin-activities.mjs、scripts/test-bear-world.mjs、scripts/test-cabin-save.mjs。

## 測試

| 項目 | 結果 | 證據/範圍 |
| --- | --- | --- |
| 連續移動 5 件 | PASS | 真實瀏覽器選取 + 方向鍵微調；自動渲染測試核對各件座標 |
| 3 件各旋轉一次 | PASS | 瀏覽器工具列操作與自動測試，三件 r 均為 1 |
| 複製與 Undo | PASS | 瀏覽器 5→6→5 且 layout 完全相等；自動測試新 ID、原件不變、刪除副本/Undo、上限及客廳不變 |
| 五件移動及三件旋轉後保存 | PASS | 隔離整合測試核對位置/方向，包含一件副本 |
| 重新整理及客廳/臥室切換 | PASS | 瀏覽器實際保存、重新整理及點房門來回；五件位置/方向保留 |
| 重新登入後保存 | PASS | 整合測試用全新 cookie 及既有恢復碼恢復，核對家具資料；沒有輸出恢復碼 |
| 儲存失敗及重試 | PASS | 隔離 QA 伺服器一次性 503，瀏覽器畫面 layout 完全保留，第二次儲存成功；本地 handler 測試斷線/伺服器錯誤/409 |
| 儲存期間繼續編輯 | PASS | 真實 handler 的延遲回應測試，後續改動仍 dirty，保存快照不混入新改動 |
| 25 件、無效位置、訪客寫入與過期版本 | PASS | 原有與新增整合/編輯器測試；不超量、不覆蓋他人資料 |
| 床鋪、坐姿、燈光、Ari、地毯 | PASS | test-cabin-activities 全部回歸通過，包含 V73 客廳坐下及四方向 |
| 新玩家、恢復碼、邀請、收藏及房間隔離 | PASS | test-bear-world、test-recovery-reminder、test-beta-ui 回歸通過 |
| 390px 指標拖曳與防捲動 | PASS | 既有 pointer 模擬回歸；瀏覽器另測 390px 容器。不是 Safari 真機 |
| iPhone Safari 實機觸控、縮放與鍵盤 | NOT TESTED | 需要使用者真機驗收，不宣稱全平台通過 |

執行：node scripts/test-cabin-activities.mjs；node --experimental-sqlite scripts/test-bear-world.mjs；node scripts/test-cabin-save.mjs；node scripts/test-beta-ui.mjs；node scripts/test-recovery-reminder.mjs；node scripts/test-public-scenes.mjs；bash scripts/build.sh；node scripts/validate-artifact.mjs；git diff --check。全部必要檢查通過。

瀏覽器測試只使用隔離記憶體 DB、可拋棄 fixture；QA 路由不會打包進正式 Worker。沒有讀取正式玩家存檔或正式秘密。

## 限制與階段邊界

P0 核心操作及保存驗收通過；iPhone Safari 真機仍待確認。409 衝突不會強制覆蓋，須先處理另一分頁的新存檔。沒有新增外部服務、付費 API 或資料庫結構，沒有進行 P1/P2。原有臥室實例同樣由舊版程式讀取，客廳/臥室存檔機制不變。
