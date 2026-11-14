# GitHub 保存與同步

已連接並驗證私人儲存庫 `chian0111/bear-atlas`，具備寫入權限。

GitHub 連接器可將目前程式、更新紀錄與版本索引保存到 `bear-atlas` 分支。原始 Sites Git 的完整提交與版本標籤另以 `history/sites-history.bundle` 保存；這是可還原的 Git 歷史備份，並非 GitHub 原生提交歷史的逐筆鏡像。`history/manifest.json` 記錄來源 commit、版本數及 bundle SHA-256。

每次發布完成後更新 release-history.json，再執行：

    node scripts/sync-github.mjs --prepare-connector /absolute/output/directory

透過已授權的 GitHub 連接器上傳原始碼、bundle 與 manifest，再讀回來源檔案及 bundle blob SHA 驗證。不要只憑上傳嘗試宣稱同步成功。

還原原始歷史：

    git clone sites-history.bundle bear-atlas-restored

若執行環境日後有 GitHub Git 認證，可用下列指令轉成原生歷史鏡像：

    node scripts/sync-github.mjs chian0111/bear-atlas

不得強制覆寫預設分支、刪除遠端內容或寫入明文金鑰。來源與歷史不包含正式玩家資料庫。
