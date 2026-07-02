# PROGRESS.md

給接續工作用的進度紀錄，開新對話時先讀這份，不用重新分析 PRD／掃程式碼。

## 2026-07-02

- 讀取 PRD 0.9.0（專案根目錄 `../CoTrace_MVP_PRD 0.9.0｜Notion (...).html`），
  比對 `my-project/src` 現有程式碼
- 更新 `CLAUDE.md`：
  - 「專案簡介」補上 PRD 版本號與 Sender/Talent/Exchange 核心術語
  - 新增「**PRD 對照與目前實作範圍**」章節（完整落差表，含每個模組✅/⚠️/❌狀態）
  - 「待辦事項」拆成「既有技術債」+「PRD 0.9.0 新功能」兩類
- 結論：現有網站只做了 PRD 一~四章（單向邀請/名片交換/聊天），PRD 新增的
  **雙向市場**（需求名片＋視角切換＋關注）與**信任機制**（面談評分）完全未開發

## 2026-07-02（續）

- **收藏 vs 保留區 命名釐清（已完成）**：從 PRD 原始 HTML 匯出文字比對，確認 PRD 3.1
  功能總覽表正式名稱為「收藏(Save)」，4.4.2 行為細節稱容器為「保留區」（PRD 原文
  本身用詞不一致，非程式碼命名錯誤）。行為邏輯（僅作用於人選名片、不觸發通知）
  已完全符合 PRD，唯一落差是 UI 文字。已將 `TalentDetailPanel.jsx` 按鈕/toast、
  `CardBoxPage.jsx` 頁籤統一改為「收藏」；內部 action/state（`ADD_KEEP`/`keepList`）
  維持不變。確認「收藏」（人選名片、不觸發通知）與 PRD 6.4「關注」（需求名片、
  觸發通知）是兩套獨立機制，未來不會共用元件。

## 2026-07-02（續 2）

- **通知系統重構（已完成）**：
  - `navItems.js`：icon `Inbox` → `Bell`、label「邀請」→「通知」（`BottomNav`／`Sidebar` 共用同一份設定，自動套用）
  - `InvitesPage.jsx` 改用 `Tabs` 拆成「邀請／已邀請／關注」三子頁籤（路徑仍是 `/invites`，未改路徑本身）
  - 過程中發現送出邀請（`InviteForm`／`CardBoxInviteDialog`）原本只跳 toast、沒有真的存資料，
    「已邀請」頁籤沒有東西可顯示 —— 已新增 `state.sentInvites` + `SEND_INVITE` action，
    兩個發送邀請的流程都會 dispatch，`SentInviteRow.jsx` 顯示「邀請中」狀態
    （固定 pending，因為是本機模擬、沒有對方帳號可真的回應）
  - 「關注」頁籤目前只有空狀態骨架，資料來源依賴下面第 2 項「關注機制」
  - 同步更新 `Design.md` 圖示對照表、`CLAUDE.md` 路由表／落差表／action 清單
  - `npm run lint` + `npm run build` 皆過

## 2026-07-02（續 3）

- **需求名片（Job Card）（已完成）**：
  - 新增 `data/jobCardOptions.js`：`JOB_WORK_MODE_OPTIONS`／`JOB_TIMELINE_OPTIONS`／
    `JOB_CAREER_LEVELS`／`MAX_JOB_CARDS`（=10），刻意跟人選名片既有的
    `workModeOptions.js`／`careerLevels.js` 分開，因為 PRD 6.2.1 跟 4.2.1 選項數值本來就不同
    （例如需求名片工作模式多了「合約／合夥」）
  - `state`：新增 `jobCards: []` + `blankJobCardData()`，reducer 加 `ADD_JOB_CARD`
    （超過上限忽略）/`UPDATE_JOB_CARD`/`DELETE_JOB_CARD`
  - UI：設定頁新增 `JobCardCard`（顯示張數、開管理入口）→ `JobCardManagerSheet`
    （清單/刪除/開新增編輯）→ `JobCardFormDialog`（8 欄位表單，草稿+送出才寫回的模式，
    跟 `BuildWizard`/`ContactEditDialog` 一致）
  - `npm run lint` + `npm run build` 皆過；同步更新 `CLAUDE.md` 落差表/action 清單/模擬資料清單

## 下一步待完成（建議優先順序，細節見 `CLAUDE.md` →「PRD 對照與目前實作範圍」）

1. **探索視角切換**：探索頁左上角切換【我是人才】/【我想求才】，需重新設計 `FilterDrawer`/`TalentCard` 資料模型；切到「我是人才」視角瀏覽的就是剛做好的需求名片（Job Card）
2. **關注機制**：作用於需求名片，觸發通知，依賴第 1 項先完成，UI 骨架（`/invites`「關注」頁籤）已就緒
3. **面談與評分機制**：風險徽章 + 面談邀請卡片 + 多維度評分問卷 —— 量體最大，PRD 第五章整章，建議排最後
4. 補規則類小項：邀請每日額度限制、名片夾 200 張上限、黑名單容量

## 尚未確認事項（需要跟 PM/使用者再對齊）

- PRD 5.5「評分結果處理」PRD 本身標註「待更新」，權重數字可能還會變
- 面談評分是否要在 MVP 就做，或先做需求名片+視角切換這個「雙向市場」半套再上線
