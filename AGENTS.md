# AGENTS.md — 留數喵的複變筆記

> 給 AI（Claude、Codex、Cursor、Copilot…）的工作說明書。
> **開始任何修改前請先完整讀完這份文件**，並遵守其中所有規則。

---

## 1. 專案目的

這是一個「複變函數」課程的**筆記網站**，把課程內容拆成一張張**知識卡片**：

- 一張卡片 = 一個觀念（一個定義、一個定理、一個例題或一個解題方法）
- 每一章 = 一個 HTML 頁面
- 讀者是正在修複變的大學生，用途是**上課複習與考前速查**

吉祥物是「留數喵」🐱，語氣親切但數學內容必須嚴謹。

---

## 2. 技術限制（不可違反）

| 規則 | 原因 |
|---|---|
| **純靜態網站**：只用 HTML + CSS + 原生 JavaScript | 直接用 GitHub Pages 發布，不需要建置 |
| **不要**引入 React、Vue、Tailwind、npm、建置工具 | 保持任何人都能直接打開 `.html` 檔修改 |
| 只能使用 `assets/style.css` 和 `assets/site.js` 兩個共用檔 | 全站風格一致，改一處全站生效 |
| 外部資源只允許 Google Fonts | 減少失效風險 |
| 所有連結用**相對路徑** | GitHub Pages 的網址在子路徑 `/repo名稱/` 底下 |

---

## 3. 檔案結構

```
residue-cat-notes/
├── AGENTS.md                  ← 你正在讀的這份規則
├── CLAUDE.md                  ← 給 Claude Code，內容是引用 AGENTS.md
├── README.md                  ← 給人看的專案介紹
├── index.html                 ← 首頁（章節卡片由 site.js 自動產生，不要手寫）
├── .nojekyll                  ← 讓 GitHub Pages 不經過 Jekyll 處理
├── assets/
│   ├── style.css              ← 全站樣式（顏色變數、卡片、版面）
│   └── site.js                ← CHAPTERS 章節清單 + 導覽列/目錄/篩選/上下章
├── chapters/
│   ├── 01-complex-numbers.html
│   ├── 02-analytic-functions.html
│   ├── ...
│   └── 06-residues.html
└── templates/
    └── chapter-template.html  ← 新增章節時「複製」這個檔案
```

### 檔名規則

- 章節頁：`chapters/兩位數章號-英文小寫短橫線.html`
  例：`07-conformal-mapping.html`、`08-harmonic-functions.html`
- 只能用英文小寫、數字、`-`，**不能有中文、空白或大寫**（避免網址編碼問題）
- 章號一律兩位數（`07` 不是 `7`），檔案才會依序排列

---

## 4. 網頁風格

- **主題**：紙本筆記本。米白紙張底色 + 淡淡的點陣格線（像 GoodNotes 的點格紙）
- **主色**：留數橘 `--accent`
- **字體**：標題用 Noto Serif TC（襯線），內文用 Noto Sans TC，公式用 JetBrains Mono
- **深色模式**：已用 `prefers-color-scheme` 自動支援
- 顏色**一律使用** `style.css` 裡的 CSS 變數（例如 `var(--accent)`），**禁止**在 HTML 寫 `style="color:#..."`
- 不要新增 emoji 以外的圖片；吉祥物用 🐱 表示

### 卡片類型與顏色（固定 6 種，不要自創新類型）

| `data-type` | 用途 | 顏色 |
|---|---|---|
| `定義` | 名詞的正式定義 | 藍 |
| `定理` | 定理、引理、推論 | 橘 |
| `例題` | 有具體數字的計算示範 | 綠 |
| `方法` | 解題步驟、技巧、決策流程 | 紫 |
| `公式` | 需要背的公式整理 | 青 |
| `性質` | 函數或運算的性質 | 灰藍 |

> 如果真的需要新類型，必須**同時**在 `style.css` 的「卡片類型色」區塊新增變數與 `.card[data-type="新類型"]` 規則，並更新這張表。

---

## 5. 頁面結構

### 章節頁的固定骨架

每個章節頁都必須包含這些元素（`site.js` 會用 id 找到它們並自動填內容）：

| 元素 | 作用 | 誰負責內容 |
|---|---|---|
| `<body data-root="../" data-chapter="章號">` | 告訴 site.js 這是第幾章 | 手寫 |
| `.chapter-head` | 章號、章名、一句話摘要 | 手寫 |
| `<nav id="toc">` | 左側本章目錄 | **site.js 自動產生** |
| `<div id="type-filter">` | 類型篩選按鈕 | **site.js 自動產生** |
| `<article class="card">` × N | 知識卡片 | 手寫 |
| `<nav id="pager">` | 上一章 / 下一章 | **site.js 自動產生** |
| 頂部導覽列、頁尾 | 全站共用 | **site.js 自動產生** |

### 知識卡片的標準格式

```html
<article class="card" id="ch7-1" data-type="定義">
  <span class="tag">定義</span>
  <h2>卡片標題</h2>
  <p>內容段落，一段只講一件事。</p>
  <div class="formula">重要公式獨立一行</div>
  <ul><li>條列（選用）</li></ul>
  <p class="pitfall"><strong>⚠️ 常見錯誤</strong>學生最容易犯的錯（選用）</p>
  <details class="practice"><summary>🧠 自我檢測</summary><p>一個問題？</p></details>
  <div class="chips keywords"><span class="chip">關鍵字</span></div>
</article>
```

卡片規則：

1. `id` 格式為 `ch章號-序號`，序號從 1 開始連續編號，例如 `ch7-1`、`ch7-2`
2. `data-type` 和 `<span class="tag">` 的文字**必須相同**
3. 每張卡片**一定要有**：`tag`、`h2`、至少一個 `<p>`、`practice`（自我檢測）、`keywords`
4. `pitfall`（常見錯誤）只在真的有常見錯誤時才加
5. 卡片排列依照**上課的學習順序**：先給定義，再講定理/性質；例題緊接在它所示範的定理後面；解題流程類的「方法」卡放在該章最後
6. 一章建議 4～8 張卡片；超過 10 張就考慮拆成兩章

### 數學式寫法

- 用 Unicode 符號直接寫：`z₀`、`zⁿ`、`∮`、`∫`、`Σ`、`π`、`√`、`≤`、`→`、`θ`
- 上標下標較複雜時用 `e^{iθ}`、`∫_C` 這種寫法
- 一行以上或需要強調的式子放進 `<div class="formula">`，多行直接換行即可
- HTML 特殊字元要跳脫：`<` 寫成 `&lt;`、`>` 寫成 `&gt;`、`&` 寫成 `&amp;`

---

## 6. 常見任務的操作步驟

### ✅ 任務 A：新增一個章節（最常見）

請**依序**完成以下 5 步，缺一不可：

1. **複製範本**：把 `templates/chapter-template.html` 複製成 `chapters/0N-英文名稱.html`
2. **改頁首**：`<title>`、`data-chapter`、`CHAPTER 0N`、`<h1>` 章名、摘要；並刪除範本裡的 `✏️ 改` 註解
3. **寫卡片**：依照 §5 的卡片格式撰寫，刪掉範本的示範卡片
4. **登記章節**：在 `assets/site.js` 的 `CHAPTERS` 陣列**最後面**加一筆：
   ```js
   {
     no: 7, slug: "07-conformal-mapping", title: "保角映射",
     summary: "一句話摘要（和頁面上的摘要相同）",
     tags: ["關鍵字1", "關鍵字2", "關鍵字3"]
   },
   ```
   `slug` 必須和檔名（不含 `.html`）**完全相同**
5. **自我檢查**：跑一遍 §8 的檢查清單

> 不需要修改 `index.html`、其他章節頁或導覽列：首頁卡片、下拉選單、上一章/下一章都會**自動更新**。

### ✅ 任務 B：在既有章節新增一張卡片

1. 依照 §5 的格式寫一張 `<article class="card">`
2. 放在該章適當的位置（依 §5 第 5 點的順序）
3. `id` 接續該章目前最大的序號，**不要**重新編號舊卡片（避免別人分享的 `#ch4-3` 連結失效）

### ✅ 任務 C：修改網頁外觀

1. 只改 `assets/style.css`，不要在個別頁面寫 `<style>`
2. 改顏色就改 `:root` 的變數，並同步調整 `@media (prefers-color-scheme: dark)` 裡對應的值
3. 修改後必須檢查：手機寬度（390px）不能出現水平捲軸

---

## 7. AI 修改內容時必須遵守的規則

1. **語言**：全部使用**繁體中文（台灣用語）**，例如「程式」不是「程序」、「函數」不是「函式」（數學語境）
2. **數學正確性優先**：
   - 新增定理時，要寫出**完整的條件**（例如「f 在 C 上及其內部解析」不能省略）
   - 新增例題時，**必須實際驗算答案**，最好用程式數值驗證後再寫入
   - 不確定的內容寧可不寫，並在回覆中告訴使用者「這部分請與課本核對」
3. **不要刪除**使用者既有的卡片或章節，除非使用者明確要求
4. **不要更動** `site.js` 的程式邏輯，除非任務就是修改功能；新增章節只需要改 `CHAPTERS` 陣列
5. **一次只做一件事**：完成一個任務後，列出你修改了哪些檔案，再進行下一個
6. 語氣：卡片內容是正式筆記，**不要**在卡片裡加「喵」；吉祥物口吻只出現在首頁介紹、搜尋不到結果等介面文字

---

## 8. 完成前的檢查清單

每次修改後，逐項確認：

- [ ] 新頁面的檔名符合 `0N-english-name.html` 格式
- [ ] `site.js` 的 `CHAPTERS` 已登記，`slug` 與檔名一致，`no` 與 `data-chapter` 一致
- [ ] 每張卡片的 `id` 不重複、`data-type` 與 tag 文字相同
- [ ] 每張卡片都有 `practice` 和 `keywords`
- [ ] 所有路徑都是相對路徑（章節頁用 `../assets/...`）
- [ ] 打開首頁，新章節的卡片有出現；點進去左側目錄、篩選按鈕、上一章/下一章都正常
- [ ] 瀏覽器開發者工具 Console 沒有錯誤
- [ ] 手機寬度沒有水平捲軸

---

## 9. 發布方式

- 推送到 GitHub 的 `main` 分支後，GitHub Pages（Settings → Pages → Deploy from branch → `main` / `/ (root)`）會自動更新網站
- 本機預覽：直接雙擊 `index.html`，或在專案資料夾執行 `python -m http.server` 後開 `http://localhost:8000`
