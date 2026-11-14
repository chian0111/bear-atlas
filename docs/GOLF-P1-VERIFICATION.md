# Bear Atlas 渡假村 P1：海景果嶺

2026-11-14（台北）。本輪只開發、隔離測試、保存原始碼，未發布。

## 來源與盤點

- 已確認 V75 `3d52fcf06b6a628f523a9d48523b56c9f3b2bdcd` 為真實 Git commit。
- 自該 commit 建立獨立分支 `dev/v75-golf-p1`；沒有從 V74 重做園區。
- 舊推球位於 `worker/public-scenes.js`：固定 CSS 位移與計時通知，沒有方向、力道或進洞計算。
- 沿用 `/dock/sports`、既有 SVG 果嶺、場景 helper、目前玩家外觀、Liv 巡邏與運動邀約；沒有新角色引擎、資料表或獎勵來源。

## 修改

- `worker/golf.js`：頁面內的推球路徑模型與狀態，方向 -60°～60°、力道 10%～100%、瞄準線、減速滾球、低速近洞捕捉、過洞／偏球結果、重玩／重設／離開。
- 玩家使用同一個既有角色走到球邊，姿態轉動及球桿表現揮桿；沒有第二個玩家角色。
- 果嶺擴充為有層次的草地邊界；沿用海景、旗桿、長椅並補球袋。球限制在草地有效區域，邊緣可繼續推球或重設。
- 不設定每日打卡、排名、真實玩家對戰、獎勵或新的持久資料。
- 低動態偏好直接呈現結果；頁面離開取消 RAF，返回快取頁安全重設。原生 range 與至少 44px 操作尺寸，不依賴 hover 或鍵盤。
- `worker/public-scenes.js`：替換舊固定推球；旅人車站明信片與既有 NPC 巡邏保持獨立。
- `worker/index.js`、`scripts/build.sh`：接入既有共享場景 script 與 Worker 打包。
- `scripts/test-golf.mjs`：推球模型與客戶端行為測試；既有場景測試改由專用 golf suite 驗證新推球，保留車站與 NPC 測試。

## 自動測試 PASS

- 高爾夫：方向／力道改變結果、標準進洞、短推、偏球、過洞、500 次連續邊界測試、連續幀、走近／揮桿／滾球、阻擋忙碌重複提交、未進洞重推。
- 重設：走近與滾球期間取消，不殘留計時；進洞後重玩恢復操作；pagehide／BFCache／低動態切換；不呼叫網路或瀏覽器儲存。
- 伺服器與資料：完整 `test-bear-world.mjs` 使用 in-memory SQLite，含 V75 五區、小屋往返、私人臥室拒絕、訪客寫入拒絕、恢復登入、存檔快照一致；新增果嶺控制及單一玩家輸出檢查。
- 回歸：`test-public-scenes.mjs`、`test-cabin-activities.mjs`、`test-cabin-save.mjs`、`test-beta-ui.mjs`、`test-recovery-reminder.mjs`、`test-sad-island.mjs`。
- Build、Worker ESM default.fetch、git diff whitespace 驗證。

## 瀏覽器 PASS

使用本機隔離 Worker，沒有連線正式 D1。

- 桌面 Chrome：進洞與結果顯示。
- 390px 窄內容容器：10% 短推後恢復操作、50% 進洞、出手途中重設、離開到 V75 園區、上一頁回到可再次操作的果嶺。
- 同一個玩家節點；方向／力道可操作，進洞後球隱藏、洞口亮起。

## NOT TESTED／限制

- iPhone Safari 實機、多點觸控與低效能手機幀率尚未測試。窄容器測試不是 Safari 實機測試。
- 簡化的等角平面減速推球；沒有風力、草坡、真實球場物理或完整骨骼動畫。
- 遊戲回合只在頁面保留；重新整理回到起球點，不存入玩家進度。
- V75 發布故障仍獨立追蹤於 `docs/issues/V75-PUBLISH.md`。
- 沒有改動 `.openai/hosting.json`、migration、帳號、家具、收藏、任務、訪客權限及正式部署來源；main 不推進。
