/* =========================================================
   留數喵的複變筆記 — 全站共用程式
   ⚠️ 新增章節時「只要」在 CHAPTERS 加一筆資料，
      導覽選單、首頁卡片、上一章/下一章都會自動更新（見 AGENTS.md §5）
   ========================================================= */

const CHAPTERS = [
  {
    no: 1, slug: "01-complex-numbers", title: "複數基礎",
    summary: "極式與尤拉公式、n 次方根、主幅角，以及複數平面上的開集與區域。",
    tags: ["尤拉公式", "棣美弗", "Arg", "單連通"]
  },
  {
    no: 2, slug: "02-analytic-functions", title: "解析函數",
    summary: "複可微的定義、柯西-黎曼方程、解析與整函數、調和函數。",
    tags: ["CR 方程", "解析", "調和函數"]
  },
  {
    no: 3, slug: "03-elementary-functions", title: "基本函數",
    summary: "e^z 的週期性、Log z 與分支切割、i^i、為什麼 sin z 無界。",
    tags: ["e^z", "Log z", "分支切割", "sin z"]
  },
  {
    no: 4, slug: "04-complex-integration", title: "複積分與柯西定理",
    summary: "路徑積分、ML 不等式、柯西-古薩定理、柯西積分公式、劉維爾定理。",
    tags: ["柯西積分公式", "ML 不等式", "劉維爾"]
  },
  {
    no: 5, slug: "05-series-singularities", title: "級數與奇點",
    summary: "泰勒與羅朗級數、收斂半徑、孤立奇點的三種分類、零點與極點。",
    tags: ["羅朗級數", "極點", "本性奇點"]
  },
  {
    no: 6, slug: "06-residues", title: "留數與應用",
    summary: "留數公式、留數定理、三種實積分、Rouché 定理與解題決策流程。",
    tags: ["留數定理", "實積分", "Rouché"]
  },
];

const ROOT = document.body.dataset.root || "";          // 章節頁是 "../"，首頁是 ""
const chapterHref = (c) => `${ROOT}chapters/${c.slug}.html`;
const pad = (n) => String(n).padStart(2, "0");

/* ---------- 頂部導覽列（每一頁都有） ---------- */
function buildTopbar() {
  const current = Number(document.body.dataset.chapter || 0);
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <div class="topbar-inner">
      <a class="brand" href="${ROOT}index.html">🐱 留數喵的<span>複變筆記</span></a>
      <select class="chapter-select" aria-label="切換章節">
        <option value="${ROOT}index.html">📚 所有章節</option>
        ${CHAPTERS.map(c => `<option value="${chapterHref(c)}" ${c.no === current ? "selected" : ""}>第 ${c.no} 章　${c.title}</option>`).join("")}
      </select>
    </div>`;
  bar.querySelector("select").addEventListener("change", e => { location.href = e.target.value; });
  document.body.prepend(bar);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `留數喵的複變筆記 · 依照 <code>AGENTS.md</code> 的規則維護 · 內容僅供學習參考，請與課本核對`;
  document.body.append(footer);
}

/* ---------- 首頁：章節卡片＋搜尋 ---------- */
function buildIndex() {
  const grid = document.querySelector("#chapter-grid");
  if (!grid) return;
  const render = (q = "") => {
    const key = q.trim().toLowerCase();
    const list = CHAPTERS.filter(c =>
      !key || [c.title, c.summary, ...c.tags].join(" ").toLowerCase().includes(key));
    grid.innerHTML = list.length ? list.map(c => `
      <a class="chapter-tile" href="${chapterHref(c)}">
        <div class="no">${pad(c.no)}</div>
        <h2>${c.title}</h2>
        <p>${c.summary}</p>
        <div class="chips">${c.tags.map(t => `<span class="chip">${t}</span>`).join("")}</div>
      </a>`).join("") : `<p class="empty">找不到「${q}」相關的章節喵～換個關鍵字試試？</p>`;
  };
  document.querySelector("#search")?.addEventListener("input", e => render(e.target.value));
  render();
}

/* ---------- 章節頁：目錄、類型篩選、上一章/下一章 ---------- */
function buildChapter() {
  const no = Number(document.body.dataset.chapter || 0);
  if (!no) return;
  const cards = [...document.querySelectorAll("article.card")];

  // 1) 左側目錄：自動抓每張卡片的 h2
  const toc = document.querySelector("#toc ol");
  if (toc) {
    toc.innerHTML = cards.map(c => `<li><a href="#${c.id}">${c.querySelector("h2").textContent}</a></li>`).join("");
    const links = [...toc.querySelectorAll("a")];
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + en.target.id));
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    cards.forEach(c => io.observe(c));
  }

  // 2) 類型篩選按鈕：只列出這一章實際有的類型
  const filter = document.querySelector("#type-filter");
  if (filter) {
    const types = ["全部", ...new Set(cards.map(c => c.dataset.type))];
    filter.innerHTML = types.map((t, i) => `<button type="button" aria-pressed="${i === 0}">${t}</button>`).join("");
    filter.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      filter.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn));
      cards.forEach(c => { c.hidden = btn.textContent !== "全部" && c.dataset.type !== btn.textContent; });
    });
  }

  // 3) 上一章 / 下一章
  const pager = document.querySelector("#pager");
  if (pager) {
    const i = CHAPTERS.findIndex(c => c.no === no);
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
    pager.innerHTML =
      (prev ? `<a class="prev" href="${chapterHref(prev)}"><small>← 上一章</small>第 ${prev.no} 章　${prev.title}</a>` : "") +
      (next ? `<a class="next" href="${chapterHref(next)}"><small>下一章 →</small>第 ${next.no} 章　${next.title}</a>` : "");
  }
}

buildTopbar();
buildIndex();
buildChapter();
