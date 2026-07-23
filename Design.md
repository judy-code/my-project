# Design.md

設計系統文件：色票、字體、間距、響應式規則、元件對照表，以及與原型的差異紀錄。

## 設計原則

參考 Apple Human Interface Guidelines 的三個核心原則，落實在 shadcn/ui 元件的使用方式上：

- **Clarity（清晰）**：文字色與背景色的對比度以 WCAG AA（一般文字 ≥4.5:1）為底線
  （見下方色票表逐一標示的對比度數值）；介面裝飾克制，用色一律走語意化 token，
  不在元件裡寫死 hex 色碼（見 `CLAUDE.md`「開發慣例」）
- **Deference（內容優先）**：UI 元素（卡片邊框、分隔線）用低對比的暖色調
  `border`／`--muted` 襯托內容，不用高對比裝飾線搶走內容焦點
- **Depth（層次）**：彈窗／抽屜（`Dialog`／`Drawer`／`Sheet`）用陰影與疊層順序表達
  前後關係，而非額外邊框；互動焦點統一用品牌色 `--ring` 標示（見色票表）

## 品牌識別（Logo 與色系來源）

2026-07 改版：正式品牌 logo 是拼圖圖標＋「COTRACE」字樣的組合（來源檔
`logo.webp`，四色拼圖代表「連結、拼接、互補」的品牌意象）。色票不再只是沿用
原型的 `:root` CSS 變數，而是**直接用程式取樣 logo 的實際像素色值**（見下表「取樣自
logo」欄），再對應到 shadcn 語意 token。取樣結果與原型的 `--red`（`#b84b37`）幾乎完全
吻合，代表原型色票本來就是以這套品牌色為本——這次改版是把它正式化、補齊米杏／深棕
兩個 logo 延伸色，並換上與 logo 調性相符的 Google Fonts 字體。

logo 相關素材（`public/`）：

| 檔案 | 用途 |
|---|---|
| `logo-mark.png` | 拼圖圖標（去除文字，方形），用於側邊欄／頂欄橫向 lockup、favicon 來源 |
| `logo-full.png` | 完整堆疊版（圖標在上、COTRACE 字樣在下），用於歡迎頁等大留白場合 |
| `favicon-32.png` / `favicon-16.png` | 瀏覽器分頁圖示 |
| `apple-touch-icon.png` | iOS 加入主畫面圖示（180×180，米杏色底，因 iOS 不支援透明背景圖示） |

對應元件：`src/components/common/Logo.jsx` 匯出 `LogoMark`（純圖標）、
`Logo`（圖標＋COTRACE 字樣橫向組合，側邊欄／行動版頂欄使用）、
`LogoStacked`（完整堆疊版，歡迎頁使用）三個元件，取代原本用 CSS 手刻的
「Co + 色彩化 Trace」純文字 logotype。

## 色票對應表

實際定義寫在 `src/index.css` 的 `:root` 區塊，用 Tailwind v4 的 `@theme inline` 產生對應的
utility class（例如 `--primary` 會產生 `bg-primary`／`text-primary`／`border-primary` 等）。

| 取樣自 logo | 顏色值 | shadcn 語意 token | 說明 |
|---|---|---|---|
| 白 | `#ffffff` | `--background` | 頁面底色維持純白，品牌色集中用在次要區塊（標籤、hover／選中狀態、側邊欄品牌區）而非整體版面，避免大面積暖色調背景稀釋品牌色本身的識別度 |
| 深棕加深版 | `#241512` | `--foreground` | 主要文字色，取 logo 深棕拼圖色再加深以確保對比度 |
| 白 | `#ffffff` | `--card` / `--popover` | 卡片、彈窗底色 |
| 赤陶橙拼圖色／COTRACE 字樣色 | `#b64937` | `--primary` | 品牌主色，前景色固定白色（對比度 ≈5.1:1，通過 WCAG AA） |
| 米杏拼圖色 | `#f7eedd` | `--secondary` / `--muted` | 標籤／次要背景 |
| 深棕系文字 | `#6b5645` | `--secondary-foreground` | 對比度 ≈5.98:1（相對 `--secondary`） |
| 深棕系文字（較淺） | `#7d6c5c` | `--muted-foreground` | 對比度 ≈5.04:1（相對白色） |
| 主色淺色調 | `#fbeae5` | `--accent` | hover／選中狀態底色 |
| 主色深色調 | `#7a2f1e` | `--accent-foreground` | 對比度 ≈7.99:1（相對 `--accent`） |
| 同 `--primary` | `#b64937` | `--destructive` | shadcn Button 的 `destructive` 變體預設就是柔和色調（`bg-destructive/10`），沿用同一支赤陶橙色即可 |
| 深棕加深版（12% 透明度） | `rgba(36,21,18,.12)` | `--border` / `--input` | 分隔線／邊框，改用暖色調（原為純黑 `rgba(0,0,0,.12)`）以呼應品牌色 |
| 同 `--primary` | `#b64937` | `--ring` | 聚焦外框直接用品牌色，符合 HIG「用品牌色標示互動焦點」的慣例 |
| — | `12px` | `--radius` | 卡片圓角，數值未變。`--radius-sm` 用 `calc(var(--radius) * 0.67)` ≈ 8px |

### logo 原色延伸 token

`--brand-cream` (`#f7eedd`)／`--brand-terracotta` (`#b64937`)／`--brand-espresso`
(`#47211e`)／`--brand-espresso-tint` (`#e7dcd4`，深棕的淺色調)：對應 Tailwind class
`bg-brand-cream`／`text-brand-terracotta`／`bg-brand-espresso`／`bg-brand-espresso-tint`
等，供需要精確重現 logo 原色、或需要「第三種」與 `--secondary`（米杏）／`--accent`
（赤陶橙淺調）都不同的品牌色階時使用（例如 `UnlockRequestBubble` 解鎖訊息氣泡）。
與上面「語意化後」的 `--primary`／`--secondary` 等 token 分開維護——語意 token 可能
因無障礙對比度考量而與 logo 原色有些微差異，這幾個 token 則是未經調整的品牌原色基準。

### 移除紫色系（2026-07 品牌一致性調整）

原本 `--brand-purple`／`--brand-purple-light`／`--brand-purple-deep`／
`--brand-purple-foreground`（對應原型 `--pu`/`--pl`）用在兩處：`CardView` 的「核心技能」
標籤、`UnlockRequestBubble` 解鎖訊息氣泡。這組紫色與頭像色票裡的藍／綠一樣，
**純粹是裝飾性配色、不帶語意**（不像「已驗證＝綠色」那樣有通用意涵），沒有理由自成一套
色系跳出品牌色盤，因此整組移除，改用品牌色階做視覺區隔：

- 核心技能標籤 → 改用 `bg-accent` / `text-accent-foreground`（赤陶橙淺色調），
  與同張名片上「價值觀」「工作模式」標籤使用的 `secondary`（米杏）形成色階差異，
  兩者都在品牌色家族內
- 解鎖訊息氣泡 → 改用新增的 `bg-brand-espresso-tint` / `text-brand-espresso`，
  價格金額改用 `text-primary` 強調，讓氣泡本身、金額強調、`accept` 按鈕
  （`bg-primary`）三者色階分明但全落在品牌色家族內

### 面談風險警示色（2026-07-23 新增，PRD 5.2）

`--status-risk-low`/`--status-risk-medium`/`--status-risk-high`/`--status-risk-insufficient`
四個新 token，供 `RiskBadge` 實心圓形徽章底色使用（白色圖示疊在上面，不是文字，所以不用
額外驗算 WCAG 文字對比度，只要求非文字對比 ≥3:1 的圖形辨識度）：低風險沿用
`--status-verified-fg`（`#55603a`，橄欖綠）同色階、高風險沿用 `--primary`/`--destructive`
（`#b64937`，品牌赤陶橙，語意上「紅＝警示」跟「品牌主色」剛好重疊不衝突）、中風險另取一支
深琥珀金 `#8a6116`（避免跟「待回應」的暖橙 `--status-pending-fg`／品牌赤陶橙撞色）、
資料不足用中性的 `--muted-foreground` 同值灰棕 `#7d6c5c`。

### 狀態色：保留語意、調和飽和度

`--status-pending-*`（待回應，暖橙）與 `--status-verified-*`（已實名驗證，綠）**保留**
原本色相，因為兩者都是使用者仰賴快速掃視辨識的通用語意色（橙＝等待中、綠＝成功／已驗證），
不像紫色系與頭像色票純屬裝飾——硬改成品牌赤陶橙反而會跟主要 CTA／`primary` 按鈕撞色，
造成「這是可以點的按鈕還是狀態標籤」的辨識問題。但 `--status-verified-*` 原本是較飽和的
草綠色，在暖色調色盤裡顯得突兀，因此把它**降飽和、偏灰橄欖調**（`#eef0e4` /
`#a8ad8c` / `#55603a`），保留「綠＝已驗證」的辨識度，同時融入整體暖色調性。

### 頭像色票（AC 陣列）

**不做成 Tailwind token**，因為是依陣列索引值輪流套用（不是固定語意），
直接原樣搬進 `src/lib/avatarPalette.js` 的 `AVATAR_COLORS` 陣列，
用 `avatarColor(index)` 取得 `{bg, fg}` 後透過 inline style 套用在 `AppAvatar` 元件上。

2026-07 起改用「赤陶橙 → 橙棕 → 琥珀金 → 深棕 → 沙米」五階暖色調色票（取代原本混雜
藍／紫／綠的版本）：多個頭像並排時仍可靠色相/明度互相區分，但每一階都落在品牌色家族內，
不會有突兀的跳色。

## 字體排印

平台介面以中文為主、混排英數，字體堆疊改用兩支 Google Fonts 開源字型組合
（`index.html` 用 `<link>` 載入，`src/index.css` 的 `--font-sans` 設定堆疊順序）：

- **Inter**（wght 400/500/600/700）：涵蓋拉丁字母與數字，是目前 UI 介面設計最常見的
  無襯線字型之一，小字級下的辨識度優於中文字型內附的拉丁字符
- **Noto Sans TC**（wght 400/500/700/900）：Google 開源、繁體中文覆蓋率最完整的無襯線
  字型，補上 Inter 沒有的中文字符

字型堆疊順序為 `'Inter', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', system-ui,
sans-serif`——瀏覽器會依「每個字符」自動選字型：拉丁字母/數字落在 Inter 的字符集內就用
Inter 顯示，中文字符不在 Inter 字符集內則自動 fallback 到 Noto Sans TC，兩者視覺高度
（x-height、字重對應）經過調校，混排不會有明顯字級落差。`PingFang TC`／`Microsoft
JhengHei` 是離線或字型載入失敗時的作業系統內建字型 fallback。
- 原型 `.t12`/`.t13` → Tailwind `text-xs`/`text-sm`
- 原型 `.fw5` → Tailwind `font-medium`

## 間距與圓角

沿用 Tailwind 預設的 4px 間距刻度，涵蓋原型中常見的 4/6/8/10/12/16/20px 間距。
圓角規則見上方色票表的 `--radius` 說明。

## 導覽列（Navbar）

2026-07 改版：捨棄「桌面左側常駐 Sidebar ＋ 手機底部 BottomNav」的 App 化版型，
改採一般網頁常見的「頂部固定導覽列」版型——桌面版導覽項目水平排列在頂部；手機版收合成
漢堡選單，點擊後從**左側**滑出（而不是像原本那樣把導覽放在底部分頁列），三個舊元件
（`Sidebar.jsx`／`TopBar.jsx`／`BottomNav.jsx`）合併成單一 `components/layout/Navbar.jsx`：

- **`md`（≥768px）以上**：`Navbar` 顯示完整水平導覽（logo + 探索／通知／名片夾／聊天
  文字連結 + 頭像或登入按鈕），漢堡按鈕隱藏
- **`< 768px`**：只顯示 logo + 漢堡按鈕（左）+ 頭像或登入按鈕（右）；點漢堡按鈕開啟
  shadcn `Sheet side="left"`，內容是垂直排列的導覽項目 + 底部帳號／設置捷徑，
  結構上等同於原本 `Sidebar` 的內容，只是從「常駐」改為「可收合的滑出選單」
- 移除底部導覽列後，手機版內容區可用高度增加（不再被底部分頁列佔用）
- **2026-07（續）登入狀態區分**：右側頭像／登入按鈕、通知／名片夾／聊天三個導覽項目
  依 `isLoggedIn` 呈現不同狀態——訪客看到「登入」按鈕（點擊開啟全站共用的
  `AuthDialog`）與導覽項目旁的 `Lock` 小圖示，已登入才顯示真實姓名頭像；詳見
  `CLAUDE.md`「登入彈窗與訪客／會員頁面區分」一節
- **2026-07（續 2）篩選按鈕移出 Navbar**：篩選只在有卡片列表的頁面才有意義，原本放在
  Navbar 右側（僅 `/explore` 顯示）不符合「全站導覽列只放全站共用功能」的原則，
  改移進 `pages/ExplorePage.jsx` 的清單欄標頭，跟 `PerspectiveSwitcher` 並排；
  `FilterDrawer` 本身元件與行為都不變，只是觸發按鈕跟開關狀態搬到 `ExplorePage`

## 響應式中斷點

| 中斷點 | 觸發變化 |
|---|---|
| `< 768px`（手機） | `Navbar` 收合為漢堡選單（左側滑出）；單欄版面；詳情頁以全螢幕滑出方式呈現 |
| `md`（≥768px，平板） | `Navbar` 展開為頂部水平導覽列；探索頁網格 1→2 欄；名片夾／通知頁加大留白 |
| `lg`（≥1024px，桌面） | 探索頁與聊天頁啟用主從分割版面（`MasterDetailLayout`）：左側固定約 380px 寬清單欄 + 右側詳情／聊天視窗欄，兩者同時顯示 |

**探索頁網格欄數的設計取捨**：原計畫設想「`lg` 時網格變 3 欄」，但實際上 `lg` 同時會啟用
主從分割版面、左側清單欄固定寬度約 380px，塞不下 3 欄卡片。因此改為：`md`（尚未進入分割
模式，清單佔滿版面寬度）時 2 欄，`lg`（已進入分割模式、清單欄變窄）時退回 1 欄，
以清單欄實際可用寬度為準，而不是單純依螢幕寬度決定欄數。名片夾／通知頁在所有寬度下
維持單欄（僅加大留白），因為每列內容較密集、文字量大，不適合切成多欄。

## 彈窗策略

`components/layout/ResponsiveModal.jsx` 是核心元件：用 `useMediaQuery('(min-width: 768px)')`
判斷，桌面版渲染 shadcn `Dialog`（置中彈窗），手機版渲染 `Drawer`（底部滑出）——這是 shadcn
官方推薦的「響應式對話框」寫法。套用在：

- 聯絡資料編輯（`ContactEditDialog`）
- 實名認證（`VerifyIdentityDialog`，會疊在聯絡資料編輯視窗之上，兩個 Dialog/Drawer 同時開啟，
  對應原型 `showVerifyModal(parentOv)` 的巢狀彈層行為）
- 婉拒原因（`RejectReasonDialog`）
- 資料夾選擇（`FolderPickerDialog`）／資料夾管理（`FolderManagerSheet`）
- 名片夾「收藏」分頁的發送邀請彈窗（`CardBoxInviteDialog`）
- 各處點開一張名片查看完整內容時（`CardView` 包在 `ResponsiveModal` 裡）
- 登入／註冊（`AuthDialog`，2026-07 新增）：開關狀態放全域 `state.authDialogOpen`
  而非元件本地 `useState`，因為訪客需要從 Navbar、`RequireAuth` 提示卡、探索頁動作
  按鈕等多處觸發，詳見 `CLAUDE.md`「登入彈窗與訪客／會員頁面區分」一節

**例外**：篩選面板（`FilterDrawer`）不用 `ResponsiveModal`，而是直接用 shadcn
`Sheet side="right"`（從右側滑入），在所有螢幕寬度下都一致，因為它本質上是「側拉篩選面板」
而非「確認型彈窗」。

**例外**：探索頁的「發送邀請」表單（`InviteForm`）不是彈窗，而是**內嵌**在人才詳情面板裡，
對應原型 `renderInviteForm()` 直接把表單 append 進詳情內容區、而非開新的浮層。

## 元件對照表（原型 → shadcn/自訂元件）

| 原型 class／概念 | 對應元件 |
|---|---|
| `.btn` / `.btn.pr` / `.btn.dg` / `.btn.gh` | shadcn `Button`（`default`/`outline`/`destructive`/`ghost` 變體） |
| `.card` / `.tc` | shadcn `Card` 樣式（多數地方直接用 `rounded-xl border` 手刻，未特別包一層 Card 元件） |
| `.tag` / `.tag.pu` | shadcn `Badge`（`secondary` 變體 / 自訂 `bg-accent text-accent-foreground` 樣式，2026-07 起不再用紫色系，見上方「移除紫色系」） |
| `.tsel` / `.tsp` | 自訂 `TagChip` + `TagSelectGroup`（`src/components/common/`） |
| `.skwrap` | 自訂 `SkillTagInput` |
| `.sw` / `.sdd` / `.so` | 自訂 `AutocompleteSearch` + `useAutocomplete` hook |
| `.steps` / `.sd` / `.sl` | 自訂 `StepIndicator` |
| `.locked` | 自訂 `LockedSection` |
| `.ri` / `.ci`（整列可點選的 radio/checkbox） | 自訂 `RadioOptionList`（radio）／shadcn `Checkbox`（checkbox） |
| 底部彈出視窗（`showOverlay()`） | `ResponsiveModal`（桌面 `Dialog` / 手機 `Drawer`） |
| 右側滑入篩選面板 | shadcn `Sheet side="right"` |
| `.msg.them/.me/.sys` | `MessageBubble` |
| `.msg.ulk`（解鎖請求氣泡） | `UnlockRequestBubble` |
| `.filemsg` | `FileUploadBubble` |
| `.dv` / `.dv.open`（滑出詳情頁） | `MasterDetailLayout`（手機版用 `translate-x`，桌面版恆常顯示雙欄） |
| `.avsm` / `.av` | 自訂 `AppAvatar`（見下方說明） |

**為什麼頭像不用 shadcn `Avatar`**：原型全程只用「字首 + 色票背景」的圓形頭像，從未使用
真實圖片；shadcn `Avatar` 的尺寸是固定的 `sm`/`default`/`lg` 三檔，無法自由指定像素尺寸
（原型裡頭像尺寸從 32px 到 56px 都有）。因此改用可自由帶入 `size` 屬性的自訂 `AppAvatar`。

## 圖示對照（原型內嵌 SVG → lucide-react）

| 原型用途 | lucide-react 圖示 |
|---|---|
| 返回箭頭 | `ChevronLeft` |
| 篩選 | `SlidersHorizontal` |
| 探索／通知／名片夾／聊天（底部導覽、側邊欄） | `Search` / `Bell` / `CreditCard` / `MessageCircle` |
| 設置 | `Settings` |
| 鎖頭（Want 區塊鎖定提示） | `Lock` |
| 上傳附件 | `Paperclip` |
| 發送訊息 | `Send` |
| 移除標籤／關閉 | `X` |
| 已完成勾選 | `Check` |
| Google 登入按鈕圖示 | 保留原型內嵌多色 SVG（品牌色圖示，不適合用單色 icon 套件） |

## 行為異動日誌（照搬 vs. 刻意調整）

- **公司搜尋**：原型直接從瀏覽器呼叫 Anthropic API（無金鑰、不安全，實際上會失敗）→
  改為本地字串比對 `data/companies.js`，UX（debounce、下拉選單、找不到結果提示）保持一致
- **表單驗證**：原型用 `alert()` 彈窗提示必填欄位 → 改為欄位下方的行內錯誤文字，
  屬於一般網頁體驗上的合理提升
- **建立名片精靈的狀態管理**：原型每個輸入框都直接即時修改全域 `cardData` 物件 →
  改為精靈內部維護一份「草稿」狀態，掛載時從全域狀態帶入初始值，只有在完成/送出時才
  一次性寫回全域狀態，避免使用者填到一半透過導覽列離開時污染全域名片資料
- **桌面版主從分割的空狀態**：原型是純手機版 App，沒有「尚未選取項目」這種狀態
  （因為永遠是全螢幕單一頁面）→ 桌面版新增「選擇左側名片／對話以查看詳情」的提示文字，
  這是因應 RWD 桌面版佈局新增的設計，原型沒有對應畫面
- **探索頁篩選的死碼**：原型原始碼中 `filterState.type` 與對應的 `.fbar`/`.fc` 快速篩選
  按鈕邏輯雖然存在，但實際渲染出來的 DOM 裡從未出現 `#fbar` 這個元素，是原型作者留下的
  死碼 → 重寫時**刻意捨棄**，只保留真正有用到的 `titleKw`/`skill`/`loc`/`sal` 四個篩選欄位
- **`.btn.dg` 柔和版危險按鈕**：不需要额外新增 Button variant，shadcn 這版 CLI 產生的
  `destructive` 變體預設就是柔和色調（`bg-destructive/10`），恰好符合需求，直接使用
- **聯絡資料編輯表單**：與建立名片精靈採用一致的「草稿 + 送出時才寫回」模式（原型是
  逐欄即時寫回全域變數），理由相同：避免使用者填到一半關閉彈窗時污染已儲存的聯絡資料

## 首頁 landing page（2026-07 改版）

`src/pages/HomePage.jsx` 從單螢幕置中版型（logo+標語+CTA）改寫成完整長頁 landing page，
內容與版面參考使用者提供的 `網站排版參考.pptx`（slide14~21 文案）與 `Desktop - 1.png`
視覺稿，第一輪先簡化執行（拿掉斜切卡片與名片 mock），使用者反饋「要更依照參考圖的排版跟
插畫」後**第二輪補回斜切卡片與名片 mock、Hero 改成參考圖的遞名片構圖**，色系全部改用
既有品牌 token（不沿用參考圖的黃/灰配色）。九個區塊：

1. **Hero**：改用新畫的 `HeroHandoffIllustration`（兩人遞名片構圖，取代原本的
   `PuzzleHeroIllustration`，貼近參考圖 Hero 視覺；拼圖意象元件保留在
   `illustrations.jsx`，未來若有其他場合需要品牌識別度高的裝飾圖仍可取用），標題／CTA
   一律用 `animate-in fade-in slide-in-from-bottom-*` 進場（不用 `Reveal`，因為一開始就在
   視窗內，捲動觸發沒有意義）
2. **介紹**：「每一次連結，都從「為什麼是你」開始」單段文字
3. **三方卡片**（人才方／求才方／雙方）：`bg-secondary/70`（米杏）卡片，用 Tailwind
   arbitrary property `[clip-path:polygon(0_3%,100%_0%,100%_97%,0_100%)]` 做出參考圖的
   斜切邊緣感；人才方／求才方卡片左上／右上角各疊一張 `MiniCardMock`（縮小名片示意圖，
   `-rotate-6` 傾斜、`hidden md:block`——手機版寬度不夠放這種純裝飾性疊層，隱藏更乾淨），
   插畫與 mock 卡左右交錯（人才方插畫在右、mock 在左；求才方相反），對應參考圖兩張卡片
   互為鏡射的版面；雙方卡片沒有 mock（參考圖雙方段落也是用對話框插畫而非名片 mock）
4. **語錄**：Marcus Aurelius 英文原文＋中文翻譯
5. **人才方好處清單**
6. **求才方好處清單**（原因 + 獲得，兩組 bullet）
7. **三特色卡**（反向媒合／漸進式揭露／第三方專業支持）：不畫新插畫，改用 lucide icon
   （`ArrowLeftRight`／`Unlock`／`LifeBuoy`）保持「簡單」
8. **結尾呼籲**：與 Hero 相同的兩顆 CTA 首尾呼應
9. **Footer**：簡介用真實品牌文案（非 lorem ipsum）＋聯絡資訊（Instagram/Threads/Discord，
   `href="#"` 佔位，社群帳號尚未申請）＋ Logo

### 吉祥物：拼圖角色（取代線稿人物插畫）

**2026-07 四次改版**：首頁曾經有一套線稿人物插畫（`FaceHead`／`HandBurst`／
`BlazerDetails` 共用子元件＋四張人物插圖，逐步從簡化版加細節到接近參考圖的西裝人物畫
法），使用者後續要求「設計一個符合專案的吉祥物，用吉祥物做遞名片之類的插圖」，全面取代
先前的人物插畫（含共用子元件在內整組刪除，不是並存）。

**造型設計**：吉祥物直接延伸 logo 的拼圖意象——本體是一塊圓角方形拼圖（比 logo 裡的拼圖
塊更接近正方形、比例更可愛），臉直接畫在方形正面（雙眼圓點＋笑臉弧線），身體側邊伸出的
「手」是一顆小圓球，借用 `PuzzleHeroIllustration` 拼圖中心「榫接圓點」的視覺語言——伸出
榫接點手 = 伸手遞名片/連結，是刻意做的視覺雙關，呼應「名片交換＝連結」的品牌概念。底部
兩隻矮短腳讓角色站得住。色彩：身體主色 `fill-primary`（赤陶橘，跟其他插畫的重點色一致），
身上一顆榫接飾點依場景用 `fill-brand-cream` 或 `fill-brand-espresso` 軟強調，黑色線稿
一律 `stroke-foreground`。

**共用子元件**（不對外 export，只給同檔案裡的四張吉祥物插圖用）：

- `MascotBody({ accentClass })`：身體方形＋臉＋一顆榫接飾點＋雙腳，固定畫在區域中心
  `(0,-10)` 附近，呼叫端用 `<g transform="translate(cx,cy) scale(s)">` 決定位置/大小
- `MascotHand({ accentClass })`：一顆榫接圓點，呼叫端用
  `<g transform="translate(x,y)">` 決定位置（不需要 rotate，因為造型是圓形，各角度看起來
  一致，比先前人物插畫的 `HandBurst` 更省一個 transform 參數）

**四張插圖**（1:1 對應先前人物插畫的呼叫位置與 viewBox 尺寸，`HomePage.jsx` 內只改
import 名稱，版面/尺寸/位置完全不用動）：

| 元件 | 取代對象 | 使用場景 |
|---|---|---|
| `MascotHandoffDuo` | `HeroHandoffIllustration` | 首頁 Hero |
| `MascotHandoff` | `PersonHandoffIllustration` | 三方卡片「人才方」＋人才方好處清單 |
| `MascotSearch` | `PersonSearchIllustration` | 三方卡片「求才方」＋求才方好處清單 |
| `MascotExchange` | `PeopleExchangeIllustration` | 三方卡片「雙方」 |

`PuzzleHeroIllustration`（拼圖裝飾插圖本身，跟吉祥物是不同元件）不受影響，維持原樣。

### 名片示意圖：`MiniCardMock`

`src/components/common/MiniCardMock.jsx`：首頁三方卡片專用的縮小名片預覽卡（純裝飾用假
資料，不對應任何真實名片），欄位標籤沿用 PRD／`CardView` 慣用命名（「最關注的領域/產業」
「擅長使用的語言」）以貼近真實名片觀感，但只放 2 個欄位＋2 個標籤，不像參考圖完整複製所有
名片欄位——保留「像名片」的辨識度即可，避免版面過重。

### 捲動進場動畫：`Reveal` 元件

新增 `src/hooks/useInView.js`（IntersectionObserver，只觸發一次，不支援時直接視為已進入）
與 `src/components/common/Reveal.jsx`（包裝元件，子內容捲動進入視窗前 `opacity-0`，進入後
播放 `fade-in slide-in-from-bottom-4`，不做捲出重播）。這是本次改版唯一新增的動態機制，
沒有引入 Framer Motion；Hero 插圖的持續漂浮沿用既有 `animate-gentle-float`（見下方
「插圖與手寫字」一節），兩者互不重疊——`Reveal` 管「進場」，`animate-gentle-float` 管
「進場後的持續動態」。

## 插圖與手寫字（2026-07 視覺改版）

參考使用者提供的三份風格範本（Amplemarket／Getharvest／Geniestudio）共同點：乾淨的中性色
版面＋一個集中的品牌色、搭配插圖與少量手寫字為情緒性強調、進出場都有明確動態效果。這次
改版**沿用既有 logo 三色配色**（不是換色），只補上插圖、手寫字、進出動態三個原本缺少的
元素。

- **插圖**：`src/components/common/illustrations.jsx` 匯出 `PuzzleHeroIllustration`（歡迎頁用，
  放大版拼圖四格＋周圍散落節點與虛線，呼應 logo「連結／拼接」意象）與
  `PuzzleEmptyIllustration`（`EmptyState` 用，虛線拼圖框＋一塊待歸位的拼圖，象徵「還沒有
  內容」）。兩者都是手刻 `<svg>`，顏色一律用語意化 Tailwind class（`fill-brand-terracotta`／
  `fill-primary` 等），沒有寫死 hex，也沒有外部圖片依賴。
  - **原本規劃用 nano-banana 生成 AI 插圖**，但當下環境未設定 `GEMINI_API_KEY`，且
    `gemini --yolo` 需要使用者明確授權才能執行第三方 CLI，因此改為手刻 SVG 方案
    （使用者在 AskUserQuestion 中選擇的方案）。未來若要換成 AI 生成的插圖，兩個元件的
    對外介面（`size`/`className` props）維持不變，直接替換內部實作即可。
- **手寫字**：新增 Google Fonts「Caveat」，token 為 `--font-handwriting`（`src/index.css`），
  Tailwind class 為 `font-handwriting`。**只用於少量英文裝飾性文字**（例如歡迎頁插圖旁的
  `let's connect` 小標籤），不用於中文內文——Caveat 沒有中文字符，中文文字套用這個 class
  會直接 fallback 回 `--font-sans`，不會有手寫效果。
- **進出動態效果**：全部沿用既有的 `tw-animate-css`（已是專案依賴，shadcn 的
  Dialog/Sheet/Drawer 本來就靠它做開關動畫），沒有新增動畫套件（例如 Framer Motion）：
  - `src/lib/utils.js` 的 `staggerDelay(index, step)` 產生 `animationDelay` inline style，
    搭配 `animate-in fade-in slide-in-from-bottom-*` class，讓列表卡片逐一淡入進場
    （`TalentGrid`／`JobPostGrid`／`CardBoxPage`／`InvitesPage` 的列表都是同一個模式：
    外層包一個帶動畫 class 的 `<div>`，不動裡面卡片元件本身）
  - `AppShell.jsx` 用 `<Outlet/>` 外層 `<div key={section}>`（`section` 取路徑第一段，
    例如 `/explore/123` 與 `/explore` 視為同一段）做整頁淡入轉場，刻意不用完整
    `location.pathname` 當 key，避免主從分割版面切換巢狀詳情頁時，連帶重播整個列表欄
    的進場動畫
  - `StepIndicator`（建立名片精靈）：目前步驟圓點/連接線加上 `transition-colors`，
    切換到新步驟時圓點有 `zoom-in` 小彈跳
  - `EmptyState`／`WelcomePage`：插圖與文字都有 `fade-in`／`zoom-in` 進場，
    `PuzzleHeroIllustration` 額外套用 `animate-gentle-float`（`src/index.css` 定義的
    緩慢浮動 keyframe，尊重 `prefers-reduced-motion`）

## 面談風險徽章與面談邀請卡片（2026-07-23 新增）

延續「彈窗策略」一節的既有規則，這次新增的三個彈窗全部走 `ResponsiveModal`
（風險徽章的「回饋摘要分布」、邀約面談表單、面談評分導引流程），沒有新增彈窗變體。

- **風險徽章的定位**：PRD 5.2.1 要求「顯示於名稱旁，整體介面的右上角，不與名片代碼
  共用同一行」，實作用 `absolute top-* right-*` 疊在卡片/名片標頭的相對定位容器上
  （`TalentCard`／`TalentSwipeStack`／`CardView` 三處各自的外層加 `relative`），
  不是跟名字塞進同一個 flex row，符合「不共用同一行」的要求
- **面談評分的「單題導引式介面」**：沿用 `StepIndicator`（原本是建立名片精靈在用）
  表達進度，多選題沿用 `TagSelectGroup`／`TagChip`（原本是價值觀/技能標籤在用），
  單選題沿用 `RadioOptionList`（原本是工作風格問卷在用）——**這次沒有新增任何互動元件**，
  全部是既有共用元件的組合應用，維持「元件對照表」一節列出的元件不重複發明
- **「不影響/影響風險標記」的分支流程**：PRD 5.4.3 面談出席狀態的分支（未出席時是否
  提前告知，會提早結束評分流程）用元件內部的 `phase` 狀態機處理（`attendance` →
  `notice`/`punctuality` → `dimension` → `ended`），不是額外拆路由或額外的彈窗——單一
  `ResponsiveModal` 內用條件渲染切換不同階段的問題內容

## 已知的技術限制（非 bug，記錄供未來參考）

- 應用程式所有狀態存在記憶體中，瀏覽器整頁重新整理（`location.reload()` 或直接輸入網址）
  會重置所有資料，這與原型行為一致，非本次改寫引入的問題
- `npm run build` 目前有「單一 JS chunk 超過 500KB」的警告，尚在合理範圍內，
  詳見 `CLAUDE.md` 待辦事項
