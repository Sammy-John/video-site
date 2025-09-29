// /src/js/channel.js
import videosRaw from "../data/videos.index.json";

console.log("[channel] loaded");

const $ = (s, d = document) => d.querySelector(s);

(function initChannel() {
  const main = $("#main");
  if (!main) return;

  const creatorId = main.getAttribute("data-creator") || "";
  const grid = $("#channel-grid");
  const followBtn = $("#followBtn");
  const nameEl = main.querySelector("h1");

  // Normalize data
  const all = Array.isArray(videosRaw) ? videosRaw : (videosRaw?.videos ?? []);
  const creatorVideos = creatorId
    ? all.filter(v => v.creatorId === creatorId)
    : all;

  // If page title is generic, adopt creator name from data
  if (creatorVideos.length && nameEl && !nameEl.dataset.locked) {
    nameEl.textContent = creatorVideos[0].creatorName || "Creator";
  }

  // Render
  if (grid) {
    grid.innerHTML = creatorVideos.length
      ? creatorVideos.map(cardHTML).join("")
      : `<p class="text-sm">No uploads yet.</p>`;
  }

  // Follow/Unfollow (localStorage)
  if (followBtn && creatorId) {
    const set = getFollowSet();
    const followed = set.has(creatorId);
    followBtn.setAttribute("aria-pressed", String(followed));
    followBtn.textContent = followed ? "Unfollow" : "Follow";

    followBtn.addEventListener("click", () => {
      const now = getFollowSet();
      if (now.has(creatorId)) now.delete(creatorId);
      else now.add(creatorId);
      saveFollowSet(now);
      const isNow = now.has(creatorId);
      followBtn.setAttribute("aria-pressed", String(isNow));
      followBtn.textContent = isNow ? "Unfollow" : "Follow";
    });
  }
})();

function cardHTML(v) {
  const tags = (v.tags || [])
    .slice(0, 3)
    .map(t => `<span class="badge">${escapeHtml(t)}</span>`)
    .join("");
  const ccBadge = v.captions
    ? `<span class="badge cc" title="Closed Captions available">CC</span>`
    : "";
  const thumb = v.thumbnail || "https://via.placeholder.co/640x360?text=Thumbnail";
  // Relative, clean link
// feed.js / channel.js — replace the url line
const base = import.meta.env.BASE_URL.replace(/\/+$/, "/");
const url = `${base}video/?c=${slug(v.creatorName)}&v=${slug(v.title)}`;

  return `
  <article class="card video">
    <a class="video__link" href="${url}">
      <img class="video__thumb" src="${escapeAttr(thumb)}" alt="${escapeAttr(v.title)} — thumbnail" loading="lazy">
      <div class="video__meta">
        <h3 class="video__title">${escapeHtml(v.title)}</h3>
        <p class="video__creator">${escapeHtml(v.creatorName)}</p>
        <div class="video__tags">
          <span class="badge">${escapeHtml(v.category || "General")}</span>
          ${tags}${ccBadge}
        </div>
      </div>
    </a>
  </article>`;
}

function getFollowSet() {
  try { return new Set(JSON.parse(localStorage.getItem("follows") || "[]")); }
  catch { return new Set(); }
}
function saveFollowSet(set) {
  localStorage.setItem("follows", JSON.stringify([...set]));
}

function slug(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
