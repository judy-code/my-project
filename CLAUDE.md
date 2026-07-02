# CLAUDE.md

給未來接手這個專案的 Claude（或任何開發者）看的說明文件。

## 專案簡介

CoTrace 是一個「反向求職媒合」平台：求職者建立三層式名片（I'm / Have / Want），
企業方瀏覽、邀請並在雙方同意後交換聯絡資訊。

本專案是從一份手機 App 原型改寫而來的正式 RWD 網頁版本：

- 原型檔案：`../cotrace_prototype (2).html`（單一 HTML 檔，內含所有 CSS/JS，1083 行）
- 目標：保留原型的所有功能，改用 React + shadcn/ui 重新實作為響應式網頁

設計系統的完整色票對應、元件對照表、行為異動日誌請見同目錄下的 [Design.md](Design.md)。

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
| `/` | `pages/WelcomePage.jsx` | 歡迎頁，不套用 AppShell（沒有側邊欄/底部導覽） |
| `/build` | `pages/BuildPage.jsx` | 建立名片三步驟精靈 |
| `/explore` | `pages/ExplorePage.jsx` | 探索頁（人才列表），桌面版與詳情頁組成主從分割版面 |
| `/explore/:talentId` | `pages/TalentDetailPage.jsx` | 人才詳情（`/explore` 的巢狀路由） |
| `/invites` | `pages/InvitesPage.jsx` | 邀請列表 |
| `/cardbox` | `pages/CardBoxPage.jsx` | 名片夾（名片夾／保留區／黑名單三分頁） |
| `/chat` | `pages/ChatPage.jsx` | 聊天列表，桌面版與聊天視窗組成主從分割版面 |
| `/chat/:threadId` | `pages/ChatThreadPage.jsx` | 聊天視窗（`/chat` 的巢狀路由） |
| `/settings` | `pages/SettingsPage.jsx` | 設置頁 |

`/` 以外的所有路由都包在 `components/layout/AppShell.jsx` 這個版面路由（layout route）底下，
提供 TopBar／Sidebar（桌面）／BottomNav（手機）。彈窗類 UI（聯絡資料編輯、實名認證、
篩選面板、婉拒原因、資料夾選擇／管理、發送邀請）**都不是路由**，而是各元件內部的
`useState` 控制開關，用 `ResponsiveModal` 統一處理桌面 Dialog／手機 Drawer 的切換。

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
- 探索／保留：`ADD_KEEP`、`REMOVE_TALENT`、`MARK_KEEP_INVITE_SENT`
- 篩選：`SET_FILTER_STATE`、`RESET_FILTER`
- 名片夾／黑名單：`SET_CARDBOX_FOLDER`、`MOVE_CARDBOX_TO_BLOCK`、`MOVE_BLOCK_TO_CARDBOX`、`REMOVE_FROM_LIST`
- 資料夾管理：`ADD_FOLDER`、`DELETE_FOLDER`
- 邀請：`ACCEPT_INVITE`（原子性更新三個狀態區塊）、`REJECT_INVITE`
- 聊天：`ADD_MESSAGE`、`SET_THREAD_READ`、`SET_THREAD_UNLOCK`
- 設置：`SET_CONTACT_DATA`、`SET_VERIFIED`、`SET_PERMISSION`

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

`src/pages/WelcomePage.jsx` 用 `@react-oauth/google` 的 `useGoogleLogin`（implicit flow）
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
  並導回歡迎頁

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
`logoutAccount` / `fetchCurrentUser` 四支 fetch；`src/components/common/EmailAuthDialog.jsx`
是 WelcomePage 上「以 Email 帳號登入／註冊」按鈕開出來的 Tabs 表單，成功後一樣
dispatch `ENTER_APP`（`user.source` 會是 `'local'`）。

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

## 目錄結構

```
src/
  lib/          共用工具函式（cn()、genCode()、getSalaryHint()、getContactEmail/Display()、avatarPalette）
  data/         所有模擬資料（原型中寫死在 JS 全域變數的資料，原樣搬過來）
  state/        Context + reducer 狀態管理層
  hooks/        useAppState / useAppDispatch / useDebounce / useMediaQuery / useAutocomplete
  components/
    ui/         shadcn 自動產生的基礎元件（不要手動大改，要改用 `npx shadcn add` 重新產生或用 className 覆寫）
    layout/     AppShell、TopBar、Sidebar、BottomNav、MasterDetailLayout、ResponsiveModal
    common/     跨頁共用元件（CardView、TagChip、SkillTagInput、AutocompleteSearch、StepIndicator...）
    build/      建立名片精靈專用元件
    explore/    探索頁／人才詳情專用元件
    invites/    邀請頁專用元件
    cardbox/    名片夾頁專用元件
    chat/       聊天頁專用元件
    settings/   設置頁專用元件
  pages/        對應路由的頁面元件（負責組裝上面的元件，不寫太多業務邏輯）
server/         Email 帳號登入用的後端 API（Express + MySQL），見上方「帳號密碼登入與後端」
```

## 模擬資料清單（`src/data/`）

| 檔案 | 內容 |
|---|---|
| `talentPool.js` | 探索頁可瀏覽的 4 位範例人才 |
| `invites.js` | 3 筆範例邀請（含完整的邀請人名片資料） |
| `chatThreads.js` | 1 筆範例聊天室（帶一個尚未處理的個資解鎖請求） |
| `companies.js` | 公司自動完成用的台灣公司名稱清單（本地比對，見下方「哪些是模擬的」） |
| `languages.js` | 語言自動完成清單（~50 種語言） |
| `values.js` | 4 組價值觀分類標籤 |
| `workStyleQuestions.js` | 工作風格問卷（6 題） |
| `workModeOptions.js` / `workTimeOptions.js` | 工作模式／工作時段選項 |
| `careerLevels.js` | 職涯落點選項 |
| `rejectReasons.js` | 婉拒邀請的固定原因清單 |
| `folderDefaults.js` | 名片夾預設資料夾名稱 |
| `emailDomains.js` / `areaCodes.js` | 聯絡資料表單用的下拉選單資料 |

**如何新增一位人才**：在 `talentPool.js` 的陣列裡加一個物件，欄位比照現有項目
（`id`、`name`、`ini`、`title`、`code`、`level`、`company`、`lang`、`skills`、`bio`、
`goodAt`、`wantTo`、`values`、`ai`、`salary`、`loc`）。`ai` 是頭像色票索引（0-4 循環），
`code` 建議用 `genCode()`（`src/lib/code.js`）產生。

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
