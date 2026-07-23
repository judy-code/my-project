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

## 2026-07-02（續 4）

- **探索視角切換（部分完成）**：
  - 新增 `state.explorePerspective`（`'hire'`／`'jobseek'`）+ `SET_EXPLORE_PERSPECTIVE` action
  - 新增 `data/jobCardPool.js`：4 筆「別人發布」的需求名片範例，對應 `talentPool.js` 的定位，
    跟自己在設定頁管理的 `jobCards` 分開
  - 新增 `PerspectiveSwitcher`（探索頁左上角，點擊左側滑出選單，符合 PRD 6.3.1 UI 規格）、
    `JobPostCard`/`JobPostGrid`（PRD 6.3.2 卡片顯示公司名稱/職稱/工作模式/預算）
  - `ExplorePage.jsx` 依視角切換渲染 `TalentGrid` 或 `JobPostGrid`
  - **刻意跳過本輪**（跟使用者確認過）：需求名片詳情頁 + PRD 6.4.1「關注」CTA
    （點需求名片目前沒有詳情頁可點進去，只做到列表瀏覽）；`FilterDrawer` 沒有依視角換欄位標籤，
    也沒有套用預算篩選（需求名片預算是自由格式文字如「140–160萬/年薪」「股權為主，可談」，
    不是人選名片 `salary` 那種數字，無法直接套用現有的 `sal` 數字篩選邏輯）
  - `npm run lint` + `npm run build` 皆過；同步更新 `CLAUDE.md`

## 2026-07-02（續 5）

- **關注機制（已完成）**：
  - 新增需求名片詳情頁 `/explore/job/:jobId`（`JobPostDetailPanel`/`JobPostDetailPage`），
    有「關注」/「已關注（取消）」切換按鈕；`JobPostCard` 從靜態 div 改成可點擊按鈕導頁進來
  - 新增 `state.followedJobCards` + `FOLLOW_JOB_CARD`（依 id 去重，符合 PRD 6.4.1「不可重複
    關注」）/`UNFOLLOW_JOB_CARD`；設定頁新增「關注中的需求」卡片 → `FollowedJobsManagerSheet`
    可取消關注
  - Sender 端通知：跟使用者確認過，這個 app 是單一使用者本機模擬、沒有其他帳號可以真的
    關注你，所以跟 `invites.js` 一樣新增 `data/receivedFollows.js` 預先 seed 2 筆模擬通知
    （`talentId` 對應 `talentPool.js` 既有人才），`/invites`「關注」頁籤改用
    `FollowNotificationRow` 顯示，點頭像/名稱可查看人選名片＋執行邀請/收藏/跳過
    （符合 PRD 6.4.3，重用 `CardBoxInviteDialog`）
  - PRD 6.4.2「優先顯示篩選相符的關注人才」：跟使用者確認過也一起做，`TalentGrid.jsx`
    把 `receivedFollows` 中的人才排到篩選結果最前面，並在 `TalentCard` 加一行「關注了你的
    需求名片」提示；「除非已跳過」不用額外處理，因為跳過本來就會把人才從 `talentPool`
    移除，自然不會出現在排序結果裡
  - `npm run lint` + `npm run build` 皆過；同步更新 `CLAUDE.md`（含新路由 `/explore/job/:jobId`）

## 2026-07-02（續 6）

- **品牌識別／設計系統改版（已完成）**：
  - 套用使用者提供的新版 CoTrace logo（拼圖圖標＋COTRACE 字樣，`logo.webp`）：用 sharp
    程式化取樣像素色值（非肉眼估色），裁切出 `public/logo-mark.png`（純圖標）／
    `public/logo-full.png`（堆疊版）／favicon 系列／apple-touch-icon，新增
    `components/common/Logo.jsx`（`LogoMark`/`Logo`/`LogoStacked`）取代原本用 CSS
    手刻的「Co ＋ 色彩化 Trace」純文字 logotype
  - 色彩系統改用直接取樣自 logo 的品牌色（赤陶橙 `#b64937`／米杏 `#f7eedd`／深棕
    `#47211e`），逐一驗算 WCAG AA 對比度後寫入 `src/index.css` 語意 token
  - 字體改用 Google Fonts（Inter + Noto Sans TC），對應中文為主、英數混排的需求
  - 依 Apple Human Interface Guidelines 精神（clarity/deference/depth）在 `Design.md`
    補上「設計原則」一節
  - 使用者反饋後二次調整：**主要背景改回純白**（品牌色只用在標籤／hover 等次要區塊，
    不佔滿整體版面）、**移除紫色系**（`brand-purple*` token 全刪，核心技能標籤改用赤陶橙
    `accent`、解鎖訊息氣泡新增 `brand-espresso-tint`）、**頭像色票**從藍／紫／綠混雜
    改成赤陶橙→橙棕→琥珀金→深棕→沙米五階暖色調、**已驗證徽章**綠色調降飽和度（保留
    「綠＝已驗證」語意但融入暖色調色盤），待回應橙色維持不變（本來就在品牌色相範圍內）
  - `npm run lint` + `npm run build` 皆過，並用 Playwright 對歡迎頁／探索頁／名片詳情／
    通知／聊天／設置頁截圖驗證
- **導覽列改版（已完成）**：
  - 使用者反饋「要一般網頁規範格式，navbar 在上方，手機版才到左側」——把桌面左側常駐
    `Sidebar` ＋ 手機底部 `BottomNav` 的 App 化版型，改成頂部固定導覽列 `Navbar.jsx`
    （桌面版水平排列導覽項目；手機版收合成漢堡選單，用 `Sheet side="left"` 從左側滑出，
    取代原本的底部分頁列）
  - 刪除 `Sidebar.jsx`／`TopBar.jsx`／`BottomNav.jsx` 三元件，合併成單一 `Navbar.jsx`；
    `AppShell.jsx` 簡化為 `Navbar` + `Outlet`
  - `npm run lint` + `npm run build` 皆過，Playwright 驗證桌面水平導覽與手機漢堡選單／
    左側抽屜的展開／導頁行為
  - 同步更新 `Design.md`（新增「品牌識別」「導覽列」章節、色票對應表、響應式中斷點）與
    `CLAUDE.md`（路由表說明、目錄結構）
- **已提交**：`git commit 91d8e8a`「品牌改版：套用新版 CoTrace logo、重製色彩與字體系統、
  導覽列改為頂部橫向排列」，尚未 push 到遠端

## 2026-07-03 — 登入系統重構 + 首頁改為完整 landing page + 開發輔助工具

大範圍改版，跨多輪使用者反饋迭代，以下整理成最終落地狀態（過程中的中間版本，例如首頁
插畫從「線稿人物」改到「拼圖吉祥物」的兩輪嘗試，已不再是現況，不重複列出取捨過程）。

### 登入重構：首頁併入 Navbar、右上角登入彈窗、訪客／會員頁面區分

- 使用者反饋「登入不應該是進站前的全螢幕關卡」——原本獨立於 `AppShell` 外、強制選擇
  登入或訪客模式的 `WelcomePage.jsx` 改寫成 `pages/HomePage.jsx`（一般行銷首頁，併入
  `AppShell` 底下，全站都看得到 `Navbar`）
- 新增全域登入彈窗：`state.authDialogOpen` + `OPEN_AUTH_DIALOG`/`CLOSE_AUTH_DIALOG`
  action，`components/common/AuthDialog.jsx`（合併原本 `WelcomePage` 的 Google 登入按鈕
  與獨立的 `EmailAuthDialog.jsx` 登入/註冊表單，兩者皆刪除／併入），只在 `AppShell.jsx`
  掛載一次，任何元件都能 dispatch 觸發。`Navbar.jsx` 右上角（桌面）／抽屜底部（手機）
  依 `isLoggedIn` 顯示登入按鈕或使用者頭像
- 訪客／會員頁面正式區分（**過去 `isLoggedIn` 只有顯示文字差異，沒有任何實際攔截**，
  這次補上）：
  - `components/layout/RequireAuth.jsx` layout route，包住 `/invites`／`/cardbox`／
    `/chat`／`/settings` 四條路由，未登入時 `<Outlet/>` 替換成 `LoginPromptCard`
    「請先登入」提示卡（不用 redirect，網址仍可分享/重新整理）
  - `hooks/useRequireAuth.js`，包住探索頁「收藏」「發送邀請」（`TalentDetailPanel.jsx`）
    與「關注」（`JobPostDetailPanel.jsx`）動作按鈕，未登入時開登入彈窗並中斷動作
  - `navItems.js` 加 `authRequired` 標記，`Navbar` 訪客狀態下在通知／名片夾／聊天旁
    顯示 `Lock` 小圖示（純視覺提示，導頁仍正常，由 `RequireAuth` 接手）
- 同步更新 `CLAUDE.md`「登入彈窗與訪客／會員頁面區分」一節、`Design.md` 導覽列／彈窗策略

### 首頁改為完整 landing page（含品牌吉祥物插畫）

- 使用者提供 `網站排版參考.pptx`（slide14~21 是首頁完整文案）與 `Desktop - 1.png`
  視覺稿，先用 brainstorming skill 釐清範圍（段落／插畫風格／動態程度），文案取自 pptx
  抽取出的原文（用 `perl` 解壓 `.pptx`（zip）讀 slide XML 的 `<a:t>` 節點取得，沒有用
  lorem ipsum）
- `src/pages/HomePage.jsx` 現況是 9 個區塊的完整長頁：Hero／介紹／人才方求才方雙方三卡／
  語錄／人才方好處／求才方好處／三特色卡／結尾／footer；三方卡片用 Tailwind arbitrary
  property `[clip-path:polygon(...)]` 做出參考稿的斜切邊緣質感，並疊一張 `MiniCardMock`
  假名片預覽（手機版隱藏）
- **插畫最終版是「拼圖吉祥物」**：使用者反饋「要有一個符合專案的吉祥物」後，`illustrations.jsx`
  改成拼圖吉祥物系統——圓角方形本體 + 臉畫在正面 + 手是一顆借用 logo 拼圖中心榫接圓點視覺
  語言的小圓球（「伸出榫接點＝伸手遞名片」的視覺雙關）。共用子元件 `MascotBody`／
  `MascotHand`，四張插圖 `MascotHandoffDuo`（Hero）／`MascotHandoff`（人才方）／
  `MascotSearch`（求才方）／`MascotExchange`（雙方），1:1 對應各區塊原本的呼叫位置
- 新增 `hooks/useInView.js` + `components/common/Reveal.jsx` 做捲動觸發進場動畫
  （IntersectionObserver，觸發一次不重播），沒有引入 Framer Motion
- 同步更新 `Design.md`「首頁 landing page」「吉祥物：拼圖角色」兩節
- **可重用的技巧**：比對使用者提供的長截圖（1440×7331）細節時，用 PowerShell
  `System.Drawing` 把圖裁成小塊逐段比對（`Read` 工具會把整張圖等比縮小，直接讀長圖會
  看不清局部），之後有類似「照著截圖排版/畫圖」的需求可以重用這個做法

### 開發輔助工具：快速登入按鈕 + 每頁假資料

- 使用者要「一個能登入看其他頁面的帳號」，釐清後發現這個 App 沒有 admin 角色概念
  （求才/人才其實是 `explorePerspective` 視角切換，任何帳號都能自由用），且本機沒有
  MySQL 可以跑真正的 Email 註冊（`C:\xampp` 不存在、`3306` port 探測不到）。在
  `AuthDialog.jsx` 底部加一顆「以測試帳號登入」按鈕，只在 `import.meta.env.DEV` 為真時
  渲染（`npm run build` 不會打包進去，已用 `grep` 確認），點下去直接 dispatch
  `ENTER_APP`（純前端假帳號 `{ name: '測試帳號', email: 'dev-test@local', source: 'dev' }`，
  不呼叫 API、不寫資料庫）
- 使用者接著要求「每一個頁面都要有假資料可操作瀏覽」，盤點後發現名片夾／已邀請／
  需求名片／關注中需求等清單原本都是空陣列，要走過實際操作才會有內容。新增 4 個資料檔
  （`sampleProfile.js`／`cardBoxSeed.js`／`sentInvitesSeed.js`／`jobCardsSeed.js`），
  `chatThreads.js` 從 1 筆擴充到 2 筆，`initialState.js` 的 `createInitialState()`
  全面接上；每筆假資料的欄位形狀都對照 `appReducer.js` 對應 action 實際產生的形狀去
  對齊。`blankCardData()`／`blankJobCardData()` 兩個「空白」函式維持原樣，只有
  `RESET_CARD_DATA` 與建立名片精靈的「新增」流程還會用到
- 同步更新 `CLAUDE.md`「登入彈窗與訪客／會員頁面區分」「模擬資料清單」兩節
- **環境備註**：這台機器 `npm run dev`（不加 `--host`）只 bind IPv6（`::1`），Playwright
  對 `localhost`/`[::1]` 連線會卡住逾時（但 `curl` 正常，容易誤判成程式碼問題）——一律改用
  `npx vite --host 127.0.0.1` 啟動、Playwright 也連 `http://127.0.0.1:5173` 才穩定；
  若之後 Playwright 連 dev server 又卡住但 curl 正常，先檢查是不是這個綁定問題

驗證方式全數統一：每個子項都跑過 `npm run lint` + `npm run build`，並用 Playwright
（`chromium.launch()` + 截圖）在桌面（1280×900）與手機（390×844）viewport 下實際操作
過一輪，確認功能正常、無 console error。

## 2026-07-03（續 2）— UI 改版八項＋篩選地點兩欄式選單

使用者一次列出 8 項想改的 UI/UX 項目，先用 brainstorming skill 釐清幾個模糊的設計決策
（登入/註冊切換樣式、手勢化收藏/跳過範圍、地點篩選分區範圍），排定由小到大的實作排程，
逐項完成：

- **通知未讀數字**：`Navbar.jsx` 的邀請數字 badge 加上 `isLoggedIn &&` 條件，訪客狀態不再
  誤顯示數字（舊版不管有沒有登入都會算 `pendingCount`）
- **登入按鈕**：桌面／手機都加上 `LogIn` icon，文字統一為「登入 / 註冊」
- **首頁 Hero**：登入解鎖的 `Button`（原本可點擊觸發登入，跟 Navbar 登入按鈕功能重複）改成
  不可互動的純說明文字（`Lock` icon＋灰階文字）
- **登入/註冊切換**：`AuthDialog.jsx` 的 Tabs 只在該檔案內用 className 覆寫成膠囊滑塊
  Segmented Control 外觀，沒有動共用的 `ui/tabs.jsx`（避免影響 `InvitesPage`／`CardBoxPage`
  既有的方形分頁）
- **首頁 Footer**：從兩欄＋孤立 logo 改成三欄（品牌/產品捷徑/聯絡我們）＋分隔線＋版權列
- **薪資篩選**：新增月薪/年薪切換（沿用同一顆 Segmented Control 樣式），維持單一「不低於」
  數字輸入，選月薪時篩選前 ×12 換算年薪比對（`state.filterState` 新增 `salUnit`）
- **工作地點篩選**：
  - 新增 `data/taiwanDistricts.js`，資料來源是內政部國土測繪中心官方 API
    （`api.nlsc.gov.tw/other/ListCounty`、`ListTown1/{縣市代碼}`），逐縣市查詢彙整 22 縣市、
    368 個行政區（總數與官方一致），縣市/行政區名稱統一用「台」跟 `talentPool.js` 既有資料一致
  - `filterState.loc`（單一字串）改成 `filterState.locs`（陣列），`TalentGrid` 用精確比對、
    `JobPostGrid` 因為 `location` 是自由格式文字（如「台北市（可遠端）」）改用包含比對
  - **UI 兩次迭代**：第一版用 22 個 `<details>` 手風琴清單，使用者反饋「排版可以參考其他網站」
    後改成左側縣市清單／右側行政區勾選的兩欄式選單（比照 104／1111 等人力銀行常見的地址選單
    做法），並依使用者要求把「國外」移到最下面、新增「台灣（全選）」一鍵全選
  - `talentPool.js` 4 筆範例資料的 `loc` 從縣市層級補到區級（如「台北市信義區」），才能展示
    分區篩選效果
  - `ExplorePage.jsx` 的 `activeFilterCount` 原本用 `Object.values(filterState).filter(Boolean).length`
    算，改成陣列後這樣算會出錯（空陣列 `[]` 在 JS 是 truthy、`salUnit` 恆為 truthy 字串），
    已改成明確列舉欄位的寫法
- **探索頁手機版滑動卡片堆疊**：
  - 新增 `hooks/useFilteredTalents.js`，把原本寫在 `TalentGrid.jsx` 裡的篩選＋排序邏輯抽出來，
    給新元件 `TalentSwipeStack.jsx` 共用，避免兩處篩選邏輯分岔
  - `TalentSwipeStack.jsx`：手機版（`useMediaQuery('(min-width: 768px)')` 判斷）取代
    `TalentGrid`，桌面不受影響；用原生 Pointer Events（不是額外套件）做左右拖曳，拖過閾值
    分別觸發跳過（`REMOVE_TALENT`）／收藏（`ADD_KEEP`）並飛出畫面，卡片下方保留 ✕／發送邀請／
    ♥ 三顆按鈕作為非手勢備援；「發送邀請」需要填表單無法用手勢表達，改成 `navigate` 帶
    `state: { autoInvite: true }` 到人選詳情頁自動展開 `InviteForm`（`TalentDetailPanel.jsx`
    讀 `useLocation().state?.autoInvite` 決定 `showInviteForm` 初始值；滑動堆疊的「發送邀請」
    按鈕本身仍包在 `requireAuth` 裡，避免訪客繞過登入門檻直接看到表單）
  - 已決定過的候選人只存在元件本地 `decidedIds`（`Set`），跟全域 `talentPool`/`keepList` 狀態
    分開，符合「這次瀏覽不再出現，但全域收藏/名片夾邏輯不變」的預期
- **驗證方式**：`npm run lint` + `npm run build` 全數過關；用 Playwright 對桌面（1280×900）與
  手機（390×844）viewport 實際操作（開啟篩選抽屜、切換縣市、勾選行政區、點「台灣（全選）」、
  滑動/點按收藏跳過卡片、確認空狀態）截圖驗證，皆正常無 console error
- **環境備註**：這台機器專案本身沒裝 Playwright（只有 `npx playwright` CLI 可查版本），
  在專案資料夾外的暫存路徑寫的測試腳本 `require('playwright')` 會找不到模組（Node 模組解析
  從腳本所在目錄往上找，不會找到專案的 `node_modules`）——要嘛把腳本複製進專案資料夾內執行，
  要嘛先 `npm install --no-save playwright`（不會動到 `package.json`／`package-lock.json`）
  再執行，兩者都測過可行

## 2026-07-23 — 全站頁面/按鈕巡查 ＋ 面談與評分機制（UI-only）

使用者要求「以資深前端和 UIUX 設計師」身分確認每一頁功能都能正常使用，按鈕若指向還沒做的頁面就
補上，一切依設計系統走。過程：

- **靜態＋動態雙重巡查**：先 `grep` 全專案 `navigate()` 呼叫、`TODO`/`即將推出` 等佔位字樣、
  空的 `onClick` handler，全部乾淨；再用背景 agent 開 `npx vite --host 127.0.0.1` + Playwright，
  在訪客／登入、桌面／手機四種狀態下把每個路由、分頁、彈窗、抽屜實際點過一輪。**結論**：
  除了 PRD 第五章「面談與評價機制」完全沒有任何 UI 入口（`CLAUDE.md` 本來就有記錄這點）以外，
  其餘功能都正常運作、無 console error、無空白頁。
- **PRD 第五章原文取得**：PRD 來源是 59MB 的 Notion 匯出 HTML（幾乎全是內嵌截圖 base64，一行
  超長字串），`grep`／一般文字工具處理不了，改用 PowerShell `[System.IO.File]::ReadAllText`
  配 `.IndexOf("五.面談與評價機制")` 抓區間、regex 去標籤取出純文字，才拿到 5.1–5.7 完整內容
  （風險等級定義、面談邀請欄位、單題導引式評分流程分支、Sender/Talent 雙向評分維度與正負選項、
  5.5 風險分數公式——這節 PRD 本身標註「待更新」）
- **實作範圍（依使用者「只要 UI 能呈現就好」的要求，刻意不做真正的計算邏輯）**：見
  `CLAUDE.md`「面談與評分機制（UI-only）」一節的完整說明，重點摘要：
  - `RiskBadge`（風險警示徽章）掛在探索頁桌面卡片／手機滑動卡片／名片詳情頁三處，
    `talentPool.js` 4 筆範例人才分別 seed 低/中/高風險與資料不足四種狀態
  - `ChatThreadView` 新增「邀約面談」按鈕 → 表單 → 對話中生成面談邀請卡片 → 「(示範)標記
    面談已結束」→「填寫面談評分」開單題導引式評分流程（`InterviewRatingDialog`，含
    PRD 5.4.3 的「未出席→是否提前告知」提早結束分支）
  - 全部是既有共用元件（`StepIndicator`／`TagSelectGroup`／`RadioOptionList`／
    `ResponsiveModal`）的組合，沒有新增互動元件種類
- **Playwright 驗證時連帶抓到兩個 bug，已修正**：
  1. `RiskBadge` 原本用 `<button>`，塞進本身就是 `<button>` 的 `TalentCard` 裡違反 HTML
     巢狀規則、console 噴 `validateDOMNesting` 錯誤 → 改成 `<span role="button" tabIndex={0}>`
  2. **既有 bug**（不是這次新功能造成的）：`MasterDetailLayout.jsx` 手機版 fixed 詳情面板
     `fixed inset-0` 從 y=0 開始，跟 `sticky top-0 z-20` 的 Navbar（56px 高）重疊，導致
     `/explore/:id`、`/chat/:threadId` 手機版最上面 56px 的內容點不到（這次新增的「邀約面談」
     按鈕剛好就在那個位置，才被發現）→ 改成 `fixed inset-x-0 top-14 bottom-0`
- `npm run lint` + `npm run build` 皆過；兩輪 Playwright 驗證（功能本身 + 兩個 bug 修正後回歸測試）
  皆確認正常，桌面 1280×900／手機 390×844

## 下一步待完成（建議優先順序，細節見 `CLAUDE.md` →「PRD 對照與目前實作範圍」）

1. **面談與評分機制的計算邏輯**：PRD 5.5 加權風險分數公式（PRD 本身標註「待更新」）、評分送出後
   動態更新名片風險等級（目前風險徽章顏色是 `talentPool.js` 寫死的 seed 值）、真正的面談日期
   觸發評分通知（目前用手動「(示範)標記面談已結束」按鈕代替）——UI 部分已於 2026-07-23 完成
2. 補規則類小項：邀請每日額度限制、名片夾 200 張上限、黑名單容量
3. 較小的收尾項：`FilterDrawer` 依探索視角切換欄位標籤／支援需求名片預算篩選

## 尚未確認事項（需要跟 PM/使用者再對齊）

- PRD 5.5「評分結果處理」PRD 本身標註「待更新」，權重數字可能還會變
- 面談評分是否要在 MVP 就做，或先做需求名片+視角切換這個「雙向市場」半套再上線
