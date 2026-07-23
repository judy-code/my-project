# CLAUDE.md

給未來接手這個專案的 Claude（或任何開發者）看的說明文件。

## 專案簡介

CoTrace 是一個以「求才方」為主動、透過名片交換機制建立經營互動關係的媒合平台
（PRD 版本 0.9.0，見專案根目錄同名 Notion 匯出 HTML）。核心術語：

- **邀請方 (Sender)**：發送邀請的 User；**被邀請方 (Talent)**：接收邀請的 User
- **人選名片 (Talent Card)**：求職者建立的三層式名片（I'm / Have / Want）
- **交換名片 (Exchange)**：Talent 同意 Invite 後成立的關係，交換前深層（Want）資訊不可見
- 產品精神：以「人」為核心（而非企業名義發邀請）、透過雙向同意的名片交換機制保護隱私

企業方瀏覽人選名片、發出邀請，並在雙方同意（交換名片）後才能取得聯絡資訊。

本專案是從一份手機 App 原型改寫而來的正式 RWD 網頁版本：

- 原型檔案：`../cotrace_prototype (2).html`（單一 HTML 檔，內含所有 CSS/JS，1083 行）
- 目標：保留原型的所有功能，改用 React + shadcn/ui 重新實作為響應式網頁

設計系統的完整色票對應、元件對照表、行為異動日誌請見同目錄下的 [Design.md](Design.md)。

## PRD 對照與目前實作範圍

**重要**：目前程式碼只實作了 PRD 0.9.0 的一個子集（大致對應 PRD 一~四章：單向邀請、
名片交換、聊天），PRD 新增的「雙向市場」與「信任機制」兩大區塊**完全還沒開發**。
改動任何探索／邀請／通知相關功能前，先確認是否觸及下表「未實作」的項目，避免誤以為
這些功能已經存在。

| PRD 功能模組 | 現況 | 備註 |
|---|---|---|
| 帳號（Google／Email 登入） | ✅ 已實作 | 另有 PRD 未提及的 Email／密碼後端系統 |
| 人選名片 I'm / Have / Want | ✅ 已實作 | `BuildWizard` 三步驟精靈 |
| 探索（單一視角，瀏覽人選名片） | ✅ 已實作 | `ExplorePage` + `FilterDrawer` |
| 邀請（Invite） | ✅ 已實作 | ⚠️ 無「每日邀請額度限制」（PRD 3.1 有寫） |
| 收藏 / 保留區 | ✅ 已實作 | PRD 3.1 功能名稱為「收藏(Save)」、4.4.2 稱容器為「保留區」（PRD 原文本身用詞不一致）；UI 按鈕/toast/名片夾頁籤已統一改用「收藏」，內部 action/state（`ADD_KEEP`/`keepList`）維持不變 |
| 跳過（Skip，30 天內不再出現） | ✅ 已實作 | 邏輯建議再核對是否滿足 30 天規則 |
| 對話（Chat） | ✅ 已實作 | `UnlockRequestBubble` 對應 PRD 4.6「請求個資揭露」；⚠️ 無「邀約面談」按鈕 |
| 名片夾（Talent pool） | ✅ 已實作 | ⚠️ 無 200 張上限、無黑名單容量限制 |
| **需求名片（Job Card）** | ✅ 已實作 | PRD 6.2，設定頁「需求名片」卡片 → `JobCardManagerSheet`（清單／新增／編輯／刪除，上限 10 張）→ `JobCardFormDialog`（8 個欄位表單）；欄位選項見 `data/jobCardOptions.js`，與人選名片的對應欄位選項刻意分開維護，數值不同 |
| **探索視角切換**（我是人才／我想求才） | ✅ 已實作 | PRD 6.3，`PerspectiveSwitcher`（探索頁左上角，左側滑出選單）可切換 `state.explorePerspective`；切到「我是人才」時 `ExplorePage` 改渲染 `JobPostGrid` 瀏覽 `jobCardPool`，點卡片進 `/explore/job/:jobId` 詳情頁（含「關注」CTA，見下一列）。⚠️ 已知落差：`FilterDrawer` 未依視角切換欄位標籤／未套用預算篩選（需求名片預算是自由格式文字，非人選名片 salary 那種數字） |
| **關注（Follow）** | ✅ 已實作 | PRD 6.4：需求名片詳情頁（`/explore/job/:jobId`）有「關注」按鈕（`FOLLOW_JOB_CARD`/`UNFOLLOW_JOB_CARD`，`state.followedJobCards`，同一需求不可重複關注）；設定頁「關注中的需求」可取消關注；Sender 端「通知→關注」用 `data/receivedFollows.js` 模擬別人關注自己需求名片的通知（跟 `invites.js` 一樣是預先 seed 的模擬資料，見下方說明），點頭像/名稱可查看人選名片並執行邀請/收藏/跳過；探索頁「我想求才」視角的人才列表會把 `receivedFollows` 中的關注人才排到前面（`TalentGrid.jsx`），符合 PRD 6.4.2「優先顯示」 |
| **通知系統重構** | ✅ 已實作 | PRD 6.5，`/invites` 頁面已改標題【通知】、底部導覽/側邊欄改鈴鐺 icon，拆「邀請/已邀請/關注」三子頁籤；「已邀請」子頁籤用 `sentInvites` 狀態顯示真實資料；「關注」子頁籤用 `receivedFollows` 顯示模擬通知（見上一列說明） |
| **面談與評分機制**（風險警示徽章、面談邀請卡片、多維度評分流程） | ⚠️ UI 已實作，計算邏輯未實作 | PRD 第五章，見下方「面談與評分機制（UI-only）」一節 |
| 後臺管理模組 | ❌ 未實作 | MVP 前端優先，符合預期 |

### 面談與評分機制（UI-only，2026-07-23）

PRD 第五章原文（日期/時間/形式/地點欄位、5.4.4 評分維度與正負選項清單、5.5 風險分數公式等）
直接從 PRD Notion 匯出 HTML 用 PowerShell `[System.IO.File]::ReadAllText` + regex 去標籤取出
（該檔案 59MB 幾乎全是內嵌截圖的 base64，`grep`/一般文字工具處理不了整行超長字串，改用
`.NET` 字串 API 直接用 `IndexOf` 定位「五.面談與評價機制」到「六.」之間的區段再去標籤）。
依使用者「只要頁面可以呈現 UI 就好」的要求，這輪**只做 UI 與可操作的假流程，不做真正的
加權風險分數計算**（PRD 5.5 本身也標註「待更新」）：

- **風險警示徽章**（PRD 5.2）：`components/common/RiskBadge.jsx`，圓形徽章＋`CircleAlert`
  圖示，顏色對應 `data/riskLevels.js` 的 `low`/`medium`/`high`/`insufficient`（評價數 <5 一律
  顯示「資料不足」，見 `resolveRiskLevel()`）。掛在 `TalentCard.jsx`（探索頁桌面版卡片）、
  `TalentSwipeStack.jsx`（探索頁手機版滑動卡片）、`CardView.jsx`（名片詳情頁／各處名片彈窗）
  三處卡片右上角；`talent` 沒有 `riskLevel`/`reviewCount` 資料時直接不渲染（目前只有
  `talentPool.js` 4 筆範例人才有 seed 這組欄位）。點擊開啟 `ResponsiveModal`，顯示各維度
  正/負比例（%）長條圖＋系統彙整描述文字，**不顯示個別評論**（符合 PRD 5.2.3 去識別化要求）。
  **注意**：徽章元件用 `<span role="button">` 而不是 `<button>`——因為它常被放進本身就是
  `<button>` 的卡片（`TalentCard`）裡，HTML 不允許 button 巢狀 button，用 `<button>` 會在
  console 噴 `validateDOMNesting` 錯誤（第一輪 Playwright 驗證時抓到，已修正）。
- **面談邀請**（PRD 5.3）：入口只在對話視窗（`ChatThreadView.jsx` 頭部「邀約面談」按鈕），
  對應 PRD「僅設於對話視窗內」。`InterviewInviteFormDialog.jsx` 填日期/時間/形式（單選：
  現場/視訊/電話）/地點連結，送出後對話中生成 `InterviewInviteCard.jsx`（比照
  `UnlockRequestBubble` 的做法：一個對話串同時間只追蹤一筆 `thread.interviewInvite`，
  不是存進 `msgs` 陣列，見 `appReducer.js` 的 `SEND_INTERVIEW_INVITE`）。
- **評分機制**（PRD 5.4）：這個 App 沒有獨立的 Talent 帳號，聊天室裡的使用者永遠是
  Sender 視角，所以**只做 Sender 對 Talent 評分這一側**（Talent 評 Sender 的維度資料仍留在
  `data/interviewOptions.js` 的 `TALENT_RATING_DIMENSIONS`，供未來若真的开放切換視角時使用）。
  `InterviewRatingDialog.jsx` 是「單題導引式介面」：Step0 出席與否（選「未出席」會分支到
  「是否提前告知」，選完直接提早結束評分流程，不進入後面的維度題，對應 PRD 5.4.3 的
  分支邏輯）→ Step1 準時狀況（單選）→ Step2–5 四個評分維度（尊重度/專業度/穩定度/契合度，
  各自「正面」「負面」兩組可複選標籤，`TagSelectGroup` 共用元件），送出後
  `SUBMIT_INTERVIEW_RATING` action 把 `thread.interviewInvite.senderRated` 設成
  `true`，卡片改顯示「已完成評分」。**沒有做**：PRD 5.5 的加權風險分數計算（公式本身
  PRD 標註「待更新」）、真正依評分結果動態更新名片風險等級（風險徽章顏色目前是
  `talentPool.js` 寫死的 seed 值，不會因為使用者送出評分而變動）、真正的日期觸發
  （PRD 5.4.1「面談日當晚跨日」系統推送，這裡改用 `InterviewInviteCard` 上一顆明確標示
  「（示範）標記面談已結束」的按鈕手動觸發，模擬日期已過）。
- **修了一個連帶發現的既有 bug**：`MasterDetailLayout.jsx` 手機版 fixed 詳情面板原本是
  `fixed inset-0`，會從螢幕最頂端（y=0）開始，跟 `Navbar`（`sticky top-0 z-20`，高度
  `h-14`=56px）重疊，導致 `/explore/:id`、`/chat/:threadId` 手機版詳情頁最上面 56px
  的內容（含這次新增的「邀約面談」按鈕）被 Navbar 蓋住、點不到。改成
  `fixed inset-x-0 top-14 bottom-0`，讓面板從 Navbar 底部開始。這是 Playwright
  驗證這次新功能時連帶抓到的既有版面 bug，不是這次新功能本身的邏輯問題。

## 技術棧

- React 19（純 JS，**沒有 TypeScript**，所有元件都是 `.jsx`）
- Vite 8（`@vitejs/plugin-react`）
- Tailwind CSS v4（透過 `@tailwindcss/vite` 外掛，CSS-first 設定，寫在 `src/index.css` 的 `@theme` 區塊，沒有 `tailwind.config.js`）
- shadcn/ui（`components.json` 設定 `style: radix-nova`、`base: radix`、`tsx: false`）
- react-router-dom v7（library mode，用法與 v6 相同：`Routes`/`Route`/`useNavigate`/`useParams`/`useMatch`/`<Outlet/>`）
- lucide-react（圖示）、sonner（toast 通知）、vaul（Drawer 底部彈出）
- @react-oauth/google（Google 登入，純前端 Google Identity Services 串接，見下方「Google 登入」一節）
- **後端（`server/`）**：Node.js + Express 5，`mysql2` 連線 MySQL、`bcryptjs` 雜湊密碼、
  `jsonwebtoken` 簽發登入用 JWT（存在 httpOnly cookie）、`cookie-parser`、`cors`、`dotenv`。
  只負責 email／密碼帳號系統，見下方「帳號密碼登入與後端」一節

## 開始開發

```bash
npm install
npm run dev       # 只啟動前端開發伺服器（預設 http://localhost:5173）
npm run server    # 只啟動後端 API 伺服器（預設 http://localhost:4000）
npm run dev:all   # 同時啟動前端 + 後端（用 concurrently）
npm run build     # 產出正式版（僅前端，後端不需要 build）
npm run lint      # oxlint 檢查
npm run preview   # 預覽 build 產出
```

若要用到帳號密碼登入功能，記得先照下方「帳號密碼登入與後端」設定好 MySQL／`.env`，
再用 `npm run dev:all` 啟動；只跑 `npm run dev` 的話，Email 登入／註冊會因為連不到
後端而失敗（Google 登入與訪客模式不受影響）。

## 整體架構

前端是純 SPA，**大部分資料沒有後端**。人才清單、邀請、聊天記錄、名片內容等
都存在 React Context 的記憶體狀態中，**重新整理瀏覽器就會重置**，這點與原型完全一致
（原型也是把資料存在全域 JS 變數裡）。

**例外是帳號系統**：`server/` 底下是一個獨立的 Express API，搭配 MySQL 資料庫，
真正把使用者的 email／密碼／姓名存起來（見下方「帳號密碼登入與後端」）。
這是目前唯一有真正持久化的部分——其餘資料（人才／邀請／聊天等）仍在待辦清單中。

如果未來要把其餘資料也接上後端，狀態管理層（`src/state/`）是唯一需要替換的地方——
把 `appReducer.js` 裡對應的 action 換成呼叫 API、並用 API 回傳值更新狀態即可，
其餘元件都是透過 `useAppState()`/`useAppDispatch()` 存取狀態，不需要大改。

## 路由對照表

| 路徑 | 頁面元件 | 說明 |
|---|---|---|
| `/` | `pages/HomePage.jsx` | 行銷首頁（hero + CTA），訪客／會員看到同一頁，僅 CTA 文案依登入狀態微調 |
| `/build` | `pages/BuildPage.jsx` | 建立名片三步驟精靈，訪客可用 |
| `/explore` | `pages/ExplorePage.jsx` | 探索頁（人才列表），訪客可瀏覽；桌面版與詳情頁組成主從分割版面 |
| `/explore/:talentId` | `pages/TalentDetailPage.jsx` | 人才詳情（`/explore` 的巢狀路由）；「收藏」「發送邀請」需登入 |
| `/explore/job/:jobId` | `pages/JobPostDetailPage.jsx` | 需求名片詳情（`/explore` 的巢狀路由，「我是人才」視角用）；「關注」需登入 |
| `/invites` | `pages/InvitesPage.jsx` | 通知頁（邀請／已邀請／關注三分頁，對應 PRD 6.5）；**需登入** |
| `/cardbox` | `pages/CardBoxPage.jsx` | 名片夾（名片夾／收藏／黑名單三分頁）；**需登入** |
| `/chat` | `pages/ChatPage.jsx` | 聊天列表，桌面版與聊天視窗組成主從分割版面；**需登入** |
| `/chat/:threadId` | `pages/ChatThreadPage.jsx` | 聊天視窗（`/chat` 的巢狀路由）；**需登入** |
| `/settings` | `pages/SettingsPage.jsx` | 設置頁；**需登入** |

所有路由都包在 `components/layout/AppShell.jsx` 這個版面路由（layout route）底下，
提供頂部固定導覽列 `Navbar`（桌面版水平排列導覽項目；手機版收合成漢堡選單，從左側滑出，
見 `Design.md`「導覽列」一節），並在底部掛載全站共用的 `AuthDialog`。標「需登入」的五條
路由額外包在 `components/layout/RequireAuth.jsx` 這層 layout route 底下：未登入時
`<Outlet/>` 直接替換成 `LoginPromptCard`（「請先登入」提示卡＋登入按鈕），保留網址可
分享／重新整理，不用 redirect。彈窗類 UI（登入/註冊、聯絡資料編輯、實名認證、
篩選面板、婉拒原因、資料夾選擇／管理、發送邀請、風險徽章回饋摘要、邀約面談、面談評分）
**都不是路由**，而是各元件內部的
`useState` 控制開關，用 `ResponsiveModal` 統一處理桌面 Dialog／手機 Drawer 的切換
（登入/註冊彈窗 `AuthDialog` 例外，開關狀態放在全域 `state.authDialogOpen`，見下一節）。

## 登入彈窗與訪客／會員頁面區分

2026-07 改版：登入不再是進站前的強制關卡，而是右上角 Navbar 的次要動作。`Navbar.jsx`
右上角（桌面）／抽屜選單底部（手機）依 `isLoggedIn` 顯示「登入 / 註冊」按鈕（含 `LogIn` icon）或使用者頭像；
點擊登入按鈕 dispatch `{ type: 'OPEN_AUTH_DIALOG' }`，開啟全站共用（只在 `AppShell.jsx`
掛載一次）的 `components/common/AuthDialog.jsx`（Google 登入 + Email 登入/註冊 Tabs，
合併自舊版 `WelcomePage.jsx` 的 Google 按鈕與 `EmailAuthDialog.jsx`，兩者皆已刪除／
併入）。彈窗開關狀態放進 `state.authDialogOpen`（`OPEN_AUTH_DIALOG`/`CLOSE_AUTH_DIALOG`
action），而不是元件本地 `useState`，因為訪客要能從很多不同地方觸發登入（Navbar、
`RequireAuth` 提示卡、探索頁動作按鈕）。登入成功後**留在原本瀏覽的頁面**，不強制導頁。

需要登入的功能分兩層攔截：

- **整頁**（通知／名片夾／聊天／設置）：`RequireAuth.jsx` layout route，見上一節
- **頁面內單一動作**（探索頁「收藏」「發送邀請」「關注」）：`hooks/useRequireAuth.js`，
  未登入時 dispatch `OPEN_AUTH_DIALOG` 並中斷動作，已登入才放行

`Navbar.jsx` 的 `NAV_ITEMS`（`components/layout/navItems.js`）用 `authRequired: true`
標記通知／名片夾／聊天三項，訪客狀態下項目旁會多顯示一個 `Lock` 圖示（純視覺提示，
點擊仍正常導頁，由 `RequireAuth` 接手擋下，不在 Navbar 層攔截）。

**開發用快速登入**（2026-07 新增）：`AuthDialog.jsx` 底部有一顆「以測試帳號登入」按鈕，
只在 `import.meta.env.DEV` 為真時渲染（`npm run dev` 才有，`npm run build` 產出的正式版
不會打包進去，已用 `grep` 確認產出的 JS 裡沒有這段文字）。點下去直接
`dispatch({ type: 'ENTER_APP', loggedIn: true, user: { name: '測試帳號', email:
'dev-test@local', source: 'dev' } })`，純前端假帳號，不呼叫任何 API、不寫進資料庫，跟其餘
模擬資料一樣重新整理就消失。用途：本機開發時不需要真的申請 Google OAuth Client ID 或架設
MySQL，也能快速登入查看通知／名片夾／聊天／設置等需要登入才能看到的頁面。`source: 'dev'`
不是 `'local'`，所以 `AccountCard.jsx` 登出時不會誤呼叫後端 `logoutAccount()` API。

## 狀態管理

`src/state/` 資料夾：

- `initialState.js`：定義所有初始狀態、`blankCardData()`（產生一張空白名片）
- `appReducer.js`：唯一的 reducer，所有狀態變更都透過 `dispatch({ type, ... })` 進行
- `AppContext.jsx`：拆成 `StateContext` + `DispatchContext` 兩個 Context，
  搭配 `src/hooks/useAppState.js` / `useAppDispatch.js` 使用

**為什麼用 Context + useReducer 而不是 Redux/Zustand？**
因為像「接受邀請」這類操作需要同時原子性地更新三個狀態區塊（邀請狀態、名片夾清單、
新增聊天室），寫成一個 reducer action（`ACCEPT_INVITE`）最乾淨；而且這個 App
單人使用、沒有跨分頁同步或伺服器快取的需求，不需要額外的狀態管理套件。

完整 action 清單請直接看 `src/state/appReducer.js` 的 `switch` 分支，主要包含：

- 登入：`ENTER_APP`（進入 App，帶 `loggedIn` 與可選的 `user`）、`LOGOUT`
- 名片精靈：`SET_CARD_DATA`、`RESET_CARD_DATA`
- 探索／收藏：`ADD_KEEP`、`REMOVE_TALENT`、`MARK_KEEP_INVITE_SENT`
- 篩選：`SET_FILTER_STATE`、`RESET_FILTER`
- 探索視角：`SET_EXPLORE_PERSPECTIVE`（`'hire'` 求才方視角／`'jobseek'` 找工作視角，預設 `'hire'`）
- 關注：`FOLLOW_JOB_CARD`（`state.followedJobCards`，依 id 去重避免重複關注）、`UNFOLLOW_JOB_CARD`
- 名片夾／黑名單：`SET_CARDBOX_FOLDER`、`MOVE_CARDBOX_TO_BLOCK`、`MOVE_BLOCK_TO_CARDBOX`、`REMOVE_FROM_LIST`
- 資料夾管理：`ADD_FOLDER`、`DELETE_FOLDER`
- 邀請：`ACCEPT_INVITE`（原子性更新三個狀態區塊）、`REJECT_INVITE`、`SEND_INVITE`（探索頁
  `InviteForm`／名片夾「收藏」分頁 `CardBoxInviteDialog` 送出邀請時寫入 `sentInvites`，
  供 `/invites`「已邀請」子頁籤顯示；因為是本機模擬、沒有對方帳號可真的回應，狀態固定為
  `pending`，UI 顯示「邀請中」）
- 聊天：`ADD_MESSAGE`、`SET_THREAD_READ`、`SET_THREAD_UNLOCK`
- 設置：`SET_CONTACT_DATA`、`SET_VERIFIED`、`SET_PERMISSION`
- 需求名片：`ADD_JOB_CARD`（超過 `MAX_JOB_CARDS` 上限時忽略，UI 也會先擋）、
  `UPDATE_JOB_CARD`、`DELETE_JOB_CARD`
- 面談與評分（UI-only，見上方「面談與評分機制」一節）：`SEND_INTERVIEW_INVITE`／
  `COMPLETE_INTERVIEW`／`SUBMIT_INTERVIEW_RATING`，都寫在對話串的 `thread.interviewInvite`
  欄位（單一物件，非陣列，同一對話同時間只追蹤一筆面談邀請，比照 `unlockSent`/`unlockDone`
  的做法）

**如何新增一個狀態區塊**：在 `initialState.js` 加初始值 → 在 `appReducer.js` 加對應的
`case` 分支 → 在需要的元件用 `useAppState()` 讀取、`useAppDispatch()` 觸發 action。

## 登入狀態的共用資料結構

不管是 Google 登入還是 Email 帳號登入，登入後都會把使用者資訊塞進同一個
`state.user`（`{ name, email, picture?, sub?, id?, source }` 或 `null`），
`source` 是 `'google'` 或 `'local'`，用來分辨要不要在登出時呼叫後端登出 API。
`state.isLoggedIn` 與 `state.user` 一起由 `ENTER_APP` / `LOGOUT` action 維護，
見 `appReducer.js`。`src/components/settings/AccountCard.jsx`／`ProfileCard.jsx`
都是讀這個共用欄位來顯示帳號 email／姓名，不用分別處理兩種登入方式。

## Google 登入

`src/components/common/AuthDialog.jsx` 用 `@react-oauth/google` 的 `useGoogleLogin`（implicit flow）
串接真正的 Google OAuth：使用者點擊按鈕 → Google 回傳 `access_token` →
`src/lib/googleAuth.js` 的 `fetchGoogleProfile()` 呼叫 Google `userinfo` endpoint
取得 `{ name, email, picture, sub, source: 'google' }` → 存進 `state.user`。
純前端即可完成，不需要後端驗證 token。

- **設定方式**：複製 `.env.example` 為 `.env`，依註解說明到
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 申請
  OAuth 用戶端 ID（網頁應用程式），填入 `VITE_GOOGLE_CLIENT_ID`
- 未設定 `VITE_GOOGLE_CLIENT_ID` 時，點擊登入按鈕會顯示錯誤 toast，不會讓 App 崩潰
  （見 `src/lib/googleAuth.js` 的 `isGoogleLoginConfigured`）
- **常見錯誤「已封鎖存取權：授權錯誤」（Access blocked: Authorization Error）**：
  幾乎都是 Google Cloud Console 那邊的設定問題，不是程式碼的錯，常見原因：
  1. OAuth 同意畫面（OAuth consent screen）還沒填完基本資料（App 名稱／支援 email）
  2. 同意畫面處於「測試中（Testing）」狀態，且目前登入的 Google 帳號不在
     「測試使用者（Test users）」名單裡——把要測試的帳號加進去即可
  3. 「已授權的 JavaScript 來源」沒加到目前開發用的網址
     （例如 `http://localhost:5173`，注意 port 要跟 `npm run dev` 印出來的一致）
- 登出：`src/components/settings/AccountCard.jsx` 的登出按鈕會 dispatch `LOGOUT` action
  並導回首頁

## 帳號密碼登入與後端（`server/`）

`server/` 是一個獨立的 Node.js + Express API，搭配 MySQL 資料庫，提供最基本的
email／密碼註冊、登入、登出、還原登入狀態。**只管帳號本身**，其餘資料
（人才／邀請／聊天等）不受影響，仍在前端記憶體。

```
server/
  index.js               Express 進入點：掛 CORS／cookie-parser／路由／錯誤處理，讀 .env
  db.js                  mysql2 連線池，讀 .env 的 DB_* 變數
  schema.sql             users 資料表的建表 SQL，貼到 phpMyAdmin 的「SQL」分頁執行即可
  routes/auth.js         POST /api/auth/register、/login、/logout、GET /api/auth/me
  middleware/requireAuth.js   驗證 httpOnly cookie 裡的 JWT，掛在需要登入的路由前面
```

**運作方式**：註冊/登入成功後，後端會簽發一個 JWT，用 `Set-Cookie` 存成 httpOnly
cookie（前端 JS 拿不到、也不用管，`fetch` 帶 `credentials: 'include'` 即可自動帶上）。
`src/state/AppContext.jsx` 在 App 掛載時會呼叫一次 `GET /api/auth/me`，如果 cookie
還有效就自動還原登入狀態（所以帳號登入重新整理頁面不會被登出，其餘資料還是會重置）。

**前端串接**：`src/lib/api.js` 封裝了 `registerAccount` / `loginAccount` /
`logoutAccount` / `fetchCurrentUser` 四支 fetch；Email 登入/註冊的 Tabs 表單是
`src/components/common/AuthDialog.jsx` 的一部分（見上方「登入彈窗與訪客／會員頁面
區分」一節），成功後一樣 dispatch `ENTER_APP`（`user.source` 會是 `'local'`）。

**開發環境設定（第一次要做的事）**：

1. 安裝 MySQL + phpMyAdmin：最簡單的方式是裝 [XAMPP](https://www.apachefriends.org/)，
   它會一次裝好 Apache、MySQL、phpMyAdmin。裝好後開「XAMPP Control Panel」把
   `MySQL` 那一列的 `Start` 按下去（Apache 可開可不開，phpMyAdmin 是靠 Apache 提供網頁介面）
2. 開瀏覽器到 `http://localhost/phpmyadmin`，點上方「SQL」分頁，把
   `server/schema.sql` 的內容貼進去執行——會建立 `cotrace` 資料庫與 `users` 資料表
3. 複製 `.env.example` 為 `.env`（若已經有 `.env` 則直接在裡面補上 `DB_*`／`JWT_SECRET`
   這幾行），`DB_USER`/`DB_PASSWORD` 對應 XAMPP 預設通常是 `root` / 空白密碼，
   `JWT_SECRET` 隨便打一長串亂數字串即可（正式上線前要換成真正機密的值）
4. `npm run dev:all` 同時啟動前端與後端，就可以在歡迎頁測試「以 Email 帳號登入／註冊」

**Vite Proxy**：`vite.config.js` 設定了 `/api` 開頭的請求轉發到
`http://localhost:4000`（後端），所以前端 fetch 一律打相對路徑 `/api/...`，
開發時瀏覽器看到的還是同源 `localhost:5173`，cookie 可以正常運作、不用處理
CORS 的 credentials 眉眉角角。正式上線時，需要另外規劃前後端同網域或設定
`sameSite: 'none'; secure: true` 的 cookie（目前 `COOKIE_OPTIONS` 已預留
`secure: process.env.NODE_ENV === 'production'`）。

## 部署（GitHub Pages）

`.github/workflows/deploy.yml` 會在每次 push 到 `main` 時自動 build 並部署到
GitHub Pages，網址是 `https://<GitHub 帳號>.github.io/cotrace/`（`cotrace`
是 GitHub 上的 repo 名稱，跟本機資料夾名稱 `my-project` 不同，注意別搞混）。
**只有前端會部署**，`server/` 後端不會、也不能靠 GitHub Pages 執行
（GitHub Pages 只能放靜態檔案），所以部署上去之後：

- Google 登入、訪客模式、探索／名片夾等純前端功能都正常
- **Email／密碼登入會失效**（找不到後端 API），屬於預期行為，按鈕還在、只是點下去會顯示錯誤
  toast，不會讓頁面壞掉

**跟這份設定綁在一起、不要隨便亂改的地方**：

- `vite.config.js` 的 `base` 在 `command === 'build'` 時會讀 CI 提供的
  `GITHUB_REPOSITORY` 環境變數（GitHub Actions 內建、格式是「帳號/repo 名稱」）
  組出 `/<repo 名稱>/`，本機 `npm run dev` 還是 `/`。這樣以後在 GitHub 上把 repo
  改名，不用回來改這個檔案，下次 push 觸發部署時就會自動套用新名稱
  ——但**改名後 GitHub Pages 的實際網址不會自動跟著換**，要去 Settings → Pages
  重新確認一次（關閉再重開 Source 可強制刷新），否則就算 `base` 是對的，
  Pages 實際服務的網址還是卡在舊名稱，一樣會資源 404 造成整頁空白
- `src/main.jsx` 用 `HashRouter` 而不是 `BrowserRouter`：GitHub Pages 是純靜態
  空間、沒有伺服器端 rewrite，`BrowserRouter` 的話重新整理 `/explore/123` 這種
  巢狀路由會直接 404；`HashRouter` 把路徑放在 `#` 後面（例如
  `.../cotrace/#/explore/123`），瀏覽器永遠先拿到 `index.html` 再由前端解析路由，
  就不會有這個問題。代價是網址會多一個 `#`

**第一次設定 / 之後要注意的事**：

1. Repo 的 Settings → Pages → Build and deployment → Source 要選
   **「GitHub Actions」**（不是「Deploy from a branch」，選錯會變成直接把
   `main` 分支的原始碼當靜態檔案放上去，瀏覽器會抓到 `/src/main.jsx` 這種還沒
   編譯的檔案，整頁空白就是這樣來的）
2. 如果想讓部署上去的網站也能用 Google 登入，要在 repo 的
   Settings → Secrets and variables → Actions 加一個 repository secret
   `VITE_GOOGLE_CLIENT_ID`（值跟本機 `.env` 裡的一樣），workflow 會在 build 時讀取；
   同時要到 Google Cloud Console 把 `https://<帳號>.github.io` 加進
   「已授權的 JavaScript 來源」（見「Google 登入」一節）
3. 部署進度看 repo 的 Actions 分頁；跑完之後開網址記得**強制重新整理**
   （Ctrl+Shift+R）避免看到瀏覽器快取的舊版本

## 目錄結構

```
src/
  lib/          共用工具函式（cn()、genCode()、getSalaryHint()、getContactEmail/Display()、avatarPalette）
  data/         所有模擬資料（原型中寫死在 JS 全域變數的資料，原樣搬過來）
  state/        Context + reducer 狀態管理層
  hooks/        useAppState / useAppDispatch / useDebounce / useMediaQuery / useAutocomplete /
                useFilteredTalents（探索頁「我想求才」視角的篩選＋排序邏輯，TalentGrid 與
                TalentSwipeStack 共用，避免兩處篩選邏輯分岔）
  components/
    ui/         shadcn 自動產生的基礎元件（不要手動大改，要改用 `npx shadcn add` 重新產生或用 className 覆寫）
    layout/     AppShell、Navbar（頂部導覽列，桌面水平／手機漢堡選單）、MasterDetailLayout、ResponsiveModal
    common/     跨頁共用元件（CardView、TagChip、SkillTagInput、AutocompleteSearch、StepIndicator...）
    build/      建立名片精靈專用元件
    explore/    探索頁／人才詳情專用元件
    invites/    通知頁（/invites）專用元件
    cardbox/    名片夾頁專用元件
    chat/       聊天頁專用元件
    settings/   設置頁專用元件
  pages/        對應路由的頁面元件（負責組裝上面的元件，不寫太多業務邏輯）
server/         Email 帳號登入用的後端 API（Express + MySQL），見上方「帳號密碼登入與後端」
```

## 模擬資料清單（`src/data/`）

| 檔案 | 內容 |
|---|---|
| `talentPool.js` | 探索頁「我想求才」視角可瀏覽的 4 位範例人才；2026-07 起每筆額外帶 `riskLevel`/`reviewCount`/`feedbackDistribution`/`feedbackSummary`，供風險警示徽章（見「面談與評分機制」一節）demo 用，4 筆分別對應低/中/高風險與資料不足四種狀態 |
| `riskLevels.js` | 風險等級定義（`low`/`medium`/`high`/`insufficient`）與 `resolveRiskLevel()` |
| `interviewOptions.js` | 面談形式選項、出席/準時度問題文字、Sender／Talent 雙向評分維度與正負選項（PRD 5.4.4 原文轉錄，目前只有 Sender 評 Talent 這側有接上 UI，Talent 側資料留著備用） |
| `jobCardPool.js` | 探索頁「我是人才」視角可瀏覽的 4 張範例需求名片（別人發布的，非自己的 `jobCards`） |
| `receivedFollows.js` | 2 筆模擬「別人關注你需求名片」的通知，`talentId` 對應 `talentPool.js` 既有人才 |
| `invites.js` | 3 筆範例邀請（含完整的邀請人名片資料） |
| `chatThreads.js` | 2 筆範例聊天室：一筆帶尚未處理的個資解鎖請求（`unlockSent: true, unlockDone: false`），
  一筆已完成解鎖的對話（`unlockDone: true`），`name` 分別對應 `invites.js`／`cardBoxSeed.js` 的人名，
  讓點聊天室頭像時能比對到完整名片（見 `ChatThreadView.buildThreadCard()`） |
| `sampleProfile.js` | 「我」的名片草稿（`SAMPLE_CARD_DATA`）與聯絡資料（`SAMPLE_CONTACT_DATA`）範例，
  登入後直接看到填好的設置頁／名片預覽，不用先跑一遍建立名片精靈 |
| `cardBoxSeed.js` | 名片夾頁三分頁的範例資料：`INITIAL_CARD_BOX_LIST`（已交換，2 筆）／
  `INITIAL_KEEP_LIST`（收藏，2 筆，其中一筆 `inviteSent: true` 展示「邀請中」狀態）／
  `INITIAL_BLOCK_LIST`（黑名單，1 筆） |
| `sentInvitesSeed.js` | 通知頁「已邀請」分頁的範例資料（2 筆），`talentId` 對應 `talentPool.js` |
| `jobCardsSeed.js` | 設置頁「需求名片」管理入口的範例資料（我自己發布的 2 張需求名片） |
| `companies.js` | 公司自動完成用的台灣公司名稱清單（本地比對，見下方「哪些是模擬的」） |
| `languages.js` | 語言自動完成清單（~50 種語言） |
| `values.js` | 4 組價值觀分類標籤 |
| `workStyleQuestions.js` | 工作風格問卷（6 題） |
| `workModeOptions.js` / `workTimeOptions.js` | 工作模式／工作時段選項 |
| `careerLevels.js` | 職涯落點選項（人選名片用，含括號說明） |
| `jobCardOptions.js` | 需求名片（Job Card）用的工作模式／時程／職涯落點選項＋`MAX_JOB_CARDS` 上限常數，數值與 `careerLevels.js`／`workModeOptions.js` 不同（PRD 6.2.1 與 4.2.1 本來就是兩組不同選項） |
| `rejectReasons.js` | 婉拒邀請的固定原因清單 |
| `folderDefaults.js` | 名片夾預設資料夾名稱 |
| `emailDomains.js` / `areaCodes.js` | 聯絡資料表單用的下拉選單資料 |
| `taiwanDistricts.js` | 探索頁篩選「工作地點」用，22 縣市＋368 個行政區完整清單（資料來源：內政部
  國土測繪中心官方 API `api.nlsc.gov.tw`，逐縣市查詢後彙整；縣市／行政區名稱一律用「台」而非
  「臺」，跟 `talentPool.js` 既有資料用字一致），另外匯出 `OVERSEAS_LOCATION`（'國外'）常數 |

**如何新增一位人才**：在 `talentPool.js` 的陣列裡加一個物件，欄位比照現有項目
（`id`、`name`、`ini`、`title`、`code`、`level`、`company`、`lang`、`skills`、`bio`、
`goodAt`、`wantTo`、`values`、`ai`、`salary`、`loc`）。`ai` 是頭像色票索引（0-4 循環），
`code` 建議用 `genCode()`（`src/lib/code.js`）產生。

**2026-07：`createInitialState()`（`src/state/initialState.js`）預設把每一份清單都塞滿範例
資料**（`cardBoxList`／`keepList`／`blockList`／`sentInvites`／`jobCards`／
`followedJobCards`／`cardData`／`contactData`，`isVerified` 也預設 `true`），不再是空陣列/
空白表單。原因：這些清單原本要透過「同意邀請」「收藏」「建立名片」等操作才會有內容，
剛登入（含開發用快速登入）時大部分頁面都是空的，不利於瀏覽/測試既有功能。真正要清空
重新開始的話，各頁面既有的「刪除」「取消收藏」「取消黑名單」等操作都正常運作，會直接
從這份初始清單移除；`blankCardData()`／`blankJobCardData()` 兩個「空白」函式維持原樣，
只有它們是`初始狀態`跟`建立名片精靈`真正需要「乾淨草稿」時才用（`RESET_CARD_DATA` action
與精靈的 `id: null` 新增流程）。

## 哪些功能是模擬／非真實的

- **公司搜尋**：本地端字串比對 `data/companies.js`，取代原型中直接從瀏覽器呼叫
  Anthropic API 的作法（原本沒有 API 金鑰、在瀏覽器端呼叫也不安全，實際上會失敗）
- **實名認證**：假的，輸入任何文字送出就會把 `isVerified` 設成 `true`，沒有真正的驗證
- **檔案上傳（聊天室）**：純前端本地預覽（`FileReader.readAsDataURL`），不會真的上傳到任何地方
- **個資定價／付費解鎖**：只是 UI 流程展示，沒有串接金流
- **除了帳號系統以外的所有資料**（人才清單、邀請、聊天記錄、名片內容等）：
  都在前端記憶體中，重新整理頁面就會重置，沒有資料庫或 localStorage。
  Email／密碼帳號是唯一真正存進資料庫的部分，見「帳號密碼登入與後端」

## 開發慣例

- 全專案使用純 JS（`.jsx`），**不要**寫 TypeScript 語法或 `.tsx` 檔案
- 需要新增 shadcn 元件時用 `npx shadcn@latest add <元件名>`，會自動產生到 `src/components/ui/`
- 共用的物件形狀（例如「人才」「邀請」「聊天室」的欄位）沒有用 TS type 或 PropTypes 定義，
  想確認欄位請直接參考 `src/data/*.js` 裡的範例資料，或搜尋 `appReducer.js` 中相關 action 的用法
- 顏色一律使用 `src/index.css` 定義好的語意化 Tailwind class（`bg-primary`、`text-muted-foreground`、
  `bg-brand-purple-light` 等），不要在元件裡寫死 hex 色碼

## 待辦事項／未來可以做的

### 既有技術債

- 把其餘資料（人才清單、邀請、聊天記錄、名片內容等）也接上後端與資料庫
  （目前只有 email／密碼帳號系統是真的，見「帳號密碼登入與後端」；
  Google 登入本身沒有後端 session，重新整理頁面一樣會登出，只有 Email 帳號會靠
  httpOnly cookie 自動還原登入狀態）
- 帳號系統的進階功能：忘記密碼／重設密碼、Email 驗證、修改密碼
- 真正的公司搜尋 API（含後端 proxy，不要在前端直接暴露金鑰）
- 真正的實名認證與金流串接
- 多語系（目前僅繁體中文）
- `npm run build` 目前有「單一 JS chunk 超過 500KB」的警告，量體還在合理範圍，
  但未來頁面變多時可考慮用 `React.lazy()` 對各 `pages/*.jsx` 做 code splitting
- `FilterDrawer` 沒有依探索視角切換欄位標籤（PRD 4.3.1 求才方／找工作兩視角欄位標籤略有不同），
  也沒有套用需求名片的預算篩選（需求名片預算是自由格式文字如「140–160萬/年薪」，
  不是人選名片 `salary` 那種數字，現有 `sal` 篩選邏輯無法直接套用；2026-07 新增的月薪/年薪
  切換與縣市/行政區篩選都只接到人選名片 `TalentGrid`／`TalentSwipeStack`，`JobPostGrid` 的
  `loc` 比對維持原本的字串包含邏輯，`sal` 依然不適用）

### PRD 0.9.0 新功能（尚未排入開發，見上方「PRD 對照與目前實作範圍」）

- **面談與評分機制**：UI 已於 2026-07-23 完成（見上方「面談與評分機制（UI-only）」一節），
  尚未實作的是 PRD 5.5 加權風險分數計算（公式本身標註「待更新」）、評分送出後動態更新
  名片風險等級（目前風險徽章顏色是 `talentPool.js` 寫死的 seed 值）、真正的面談日期
  觸發評分通知（目前用手動「（示範）標記面談已結束」按鈕代替）
- **邀請每日額度限制**、**名片夾 200 張上限**、**黑名單容量規則**：現有邏輯尚未加上限制
