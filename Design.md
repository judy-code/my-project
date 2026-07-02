# Design.md

設計系統文件：色票、字體、間距、響應式規則、元件對照表，以及與原型的差異紀錄。

## 色票對應表

原始資料來源：`../cotrace_prototype (2).html` 的 `:root` CSS 變數。
實際定義寫在 `src/index.css` 的 `:root` 區塊，用 Tailwind v4 的 `@theme inline` 產生對應的
utility class（例如 `--primary` 會產生 `bg-primary`／`text-primary`／`border-primary` 等）。

| 原型變數 | 顏色值 | shadcn 語意 token | 說明 |
|---|---|---|---|
| `--bg` | `#FBFBFD` | `--background` | 頁面底色 |
| `#1a1a18`（原型 body 文字） | | `--foreground` | 主要文字色 |
| `#fff`（`.card`／`.app`） | | `--card` / `--popover` | 卡片、彈窗底色 |
| `--red` | `#b84b37` | `--primary` | 品牌主色，前景色固定白色 |
| `--gl` | `#F1EFE8` | `--secondary` / `--muted` | 標籤／次要背景 |
| `#666`（`.tag` 文字） | | `--secondary-foreground` | |
| `#888`（`.tm` 文字） | | `--muted-foreground` | |
| `--rl` | `#fdf0ee` | `--accent` | hover／選中狀態底色 |
| `--rd` | `#8a2e1e` | `--accent-foreground` | |
| `--red`（用於 `.btn.dg`） | | `--destructive` | shadcn Button 的 `destructive` 變體預設就是柔和色調（`bg-destructive/10`），**剛好對應**原型 `.btn.dg` 的柔和紅色風格，不需要額外新增 variant |
| `--bd` | `rgba(0,0,0,.12)` | `--border` / `--input` / `--ring` | 分隔線／邊框 |
| `--r` | `12px` | `--radius` | 卡片圓角。`--radius-sm` 用 `calc(var(--radius) * 0.67)` ≈ 8px，對應原型的 `--rs` |

### 額外自訂色票（非 shadcn 標準語意 token）

同樣定義在 `src/index.css` 的 `:root` + `@theme inline`，Tailwind 會自動產生對應 class：

| 原型變數／用途 | 顏色值 | Tailwind class |
|---|---|---|
| `--pu` | `#7F77DD` | `bg-brand-purple` / `text-brand-purple` |
| `--pl` | `#EEEDFE` | `bg-brand-purple-light` |
| `.tag.pu` 文字色 | `#3C3489` | `text-brand-purple-foreground` |
| 解鎖訊息氣泡標題 | `#26215C` | `text-brand-purple-deep` |
| 邀請「待回應」標籤 | `#FFF3E0` / `#E65100` | `bg-status-pending-bg` / `text-status-pending-fg` |
| 實名認證完成狀態列 | `#eaf3de` / `#97C459` / `#3B6D11` | `bg-status-verified-bg` / `border-status-verified-border` / `text-status-verified-fg` |

### 頭像色票（AC 陣列）

**不做成 Tailwind token**，因為是依陣列索引值輪流套用（不是固定語意），
直接原樣搬進 `src/lib/avatarPalette.js` 的 `AVATAR_COLORS` 陣列，
用 `avatarColor(index)` 取得 `{bg, fg}` 後透過 inline style 套用在 `AppAvatar` 元件上。

## 字體排印

- 字型：`system-ui, -apple-system, Segoe UI, sans-serif`（與原型一致，沒有使用 shadcn CLI
  預設帶入的 Geist 字型，該套件已移除）
- 原型 `.t12`/`.t13` → Tailwind `text-xs`/`text-sm`
- 原型 `.fw5` → Tailwind `font-medium`

## 間距與圓角

沿用 Tailwind 預設的 4px 間距刻度，涵蓋原型中常見的 4/6/8/10/12/16/20px 間距。
圓角規則見上方色票表的 `--radius` 說明。

## 響應式中斷點

| 中斷點 | 觸發變化 |
|---|---|
| `< 768px`（手機） | 底部導覽列（`BottomNav`）、單欄版面、詳情頁以全螢幕滑出方式呈現 |
| `md`（≥768px，平板） | 側邊欄（`Sidebar`）取代底部導覽列；探索頁網格 1→2 欄；名片夾／邀請頁加大留白 |
| `lg`（≥1024px，桌面） | 探索頁與聊天頁啟用主從分割版面（`MasterDetailLayout`）：左側固定約 380px 寬清單欄 + 右側詳情／聊天視窗欄，兩者同時顯示 |

**探索頁網格欄數的設計取捨**：原計畫設想「`lg` 時網格變 3 欄」，但實際上 `lg` 同時會啟用
主從分割版面、左側清單欄固定寬度約 380px，塞不下 3 欄卡片。因此改為：`md`（尚未進入分割
模式，清單佔滿版面寬度）時 2 欄，`lg`（已進入分割模式、清單欄變窄）時退回 1 欄，
以清單欄實際可用寬度為準，而不是單純依螢幕寬度決定欄數。名片夾／邀請頁在所有寬度下
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
- 名片夾「保留區」的發送邀請彈窗（`CardBoxInviteDialog`）
- 各處點開一張名片查看完整內容時（`CardView` 包在 `ResponsiveModal` 裡）

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
| `.tag` / `.tag.pu` | shadcn `Badge`（`secondary` 變體 / 自訂 `bg-brand-purple-light` 樣式） |
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
| 探索／邀請／名片夾／聊天（底部導覽、側邊欄） | `Search` / `Inbox` / `CreditCard` / `MessageCircle` |
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

## 已知的技術限制（非 bug，記錄供未來參考）

- 應用程式所有狀態存在記憶體中，瀏覽器整頁重新整理（`location.reload()` 或直接輸入網址）
  會重置所有資料，這與原型行為一致，非本次改寫引入的問題
- `npm run build` 目前有「單一 JS chunk 超過 500KB」的警告，尚在合理範圍內，
  詳見 `CLAUDE.md` 待辦事項
