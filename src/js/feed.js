// /src/js/feed.js
import videosRaw from "../data/videos.index.json";

console.log("[feed] loaded");

const grid = document.getElementById("feed-grid");
if (grid) init();

function init() {
  const videos = Array.isArray(videosRaw) ? videosRaw : (videosRaw?.videos ?? []);

  // default: random
  render(shuffle(videos.slice()));

  // mode chips
  document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-mode]").forEach(b => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      const mode = btn.getAttribute("data-mode");
      if (mode === "random") {
        render(shuffle(videos.slice()));
      } else if (mode === "chronological") {
        render(videos.slice().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
      } else if (mode === "subscriptions") {
        render(videos.filter(v => isFollowed(v.creatorId)));
      }
    });
  });

  // search wiring
  window.addEventListener("search:query", (ev) => {
    const q = (ev.detail || "").toLowerCase();
    if (!q) return render(videos);
    const filtered = videos.filter(v => {
      const hay = [v.title, v.creatorName, v.category, ...(v.tags || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    render(filtered);
  });
}

/** Basic shuffle */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function render(list) {
  if (!list || list.length === 0) {
    grid.innerHTML = `<p class="text-sm">No results.</p>`;
    return;
  }
  grid.innerHTML = list.map(cardHTML).join("");
}

function isFollowed(creatorId) {
  try {
    const set = new Set(JSON.parse(localStorage.getItem("follows") || "[]"));
    return set.has(creatorId);
  } catch {
    return false;
  }
}

function cardHTML(v) {
  const tags = (v.tags || [])
    .slice(0, 3)
    .map(t => `<span class="badge">${escapeHtml(t)}</span>`)
    .join("");
  const ccBadge = v.captions ? `<span class="badge cc" title="Closed Captions available">CC</span>` : "";
  const thumb = v.thumbnail || "https://via.placeholder.co/640x360?text=Thumbnail";
// feed.js / channel.js — replace the url line
const base = import.meta.env.BASE_URL.replace(/\/+$/, "/");
const url = `${base}video/?c=${slug(v.creatorName)}&v=${slug(v.title)}`;

  return `
  <article class="card video"
    data-title="${escapeAttr(v.title)}"
    data-creator="${escapeAttr(v.creatorName)}"
    data-tags="${escapeAttr((v.tags||[]).join(','))}"
    data-category="${escapeAttr(v.category||'')}">
    <a class="video__link" href="${url}">
      <img class="video__thumb" src="${escapeAttr(thumb)}" alt="${escapeAttr(v.title)} — thumbnail" loading="lazy">
      <div class="video__meta">
        <h3 class="video__title">${escapeHtml(v.title)}</h3>
        <p class="video__creator">${escapeHtml(v.creatorName)}</p>
        <div class="video__tags">
          <span class="badge">${escapeHtml(v.category||'General')}</span>
          ${tags}${ccBadge}
        </div>
      </div>
    </a>
  </article>`;
}

function slug(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }
