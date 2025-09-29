// /src/js/video.js
import videosRaw from "../data/videos.index.json";

const $ = (s,d=document)=>d.querySelector(s);
const grid = $("#more-grid");
const titleEl = $("#video-title");
const creatorEl = $("#video-creator");
const bcCreator = $("#bc-creator");
const bcTitle = $("#bc-title");
const creatorLink = $("#creator-link");
const srcEl = $("#player-src");
const vttEl = $("#player-vtt");
const player = $("#player");

const all = Array.isArray(videosRaw) ? videosRaw : (videosRaw?.videos ?? []);

const { creatorSlug, videoSlug } = parseVideoFromURL();
const current = findBySlugs(creatorSlug, videoSlug);

if (!current) {
  titleEl.textContent = "Video not found";
  creatorEl.textContent = "";
  if (grid) grid.innerHTML = `<p class="text-sm">No matching video.</p>`;
} else {
  // Fill page
  titleEl.textContent = current.title;
  creatorEl.textContent = current.creatorName;
  bcCreator.textContent = current.creatorName;
  bcTitle.textContent = current.title;
  creatorLink.href = "/channel"; // (MVP: generic channel link)
  srcEl.src = current.src;
  if (current.captions) vttEl.src = current.captions; else vttEl.remove();
  player.load();

  // More from creator
  const more = all.filter(v => v.creatorId === current.creatorId && v.id !== current.id).slice(0, 6);
  grid.innerHTML = more.map(cardHTML).join("") || `<p class="text-sm">No more videos from this creator yet.</p>`;
}

// ---------- helpers ----------
function parseVideoFromURL(){
  // Supports: /video/?c=creator&v=title   OR   /video/creator/title
  const u = new URL(location.href);
  let c = (u.searchParams.get("c") || "").toLowerCase();
  let v = (u.searchParams.get("v") || "").toLowerCase();
  if (!c || !v) {
    const parts = u.pathname.replace(/\/+$/,"").split("/"); // ["","video","creator","title"]
    const idx = parts.indexOf("video");
    if (idx >= 0) {
      c = (parts[idx+1]||"").toLowerCase();
      v = (parts[idx+2]||"").toLowerCase();
    }
  }
  return { creatorSlug:c, videoSlug:v };
}

function findBySlugs(cSlug, vSlug){
  const s = (x)=>String(x).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  return all.find(v => s(v.creatorName)===cSlug && s(v.title)===vSlug);
}

function cardHTML(v){
  const s = (x)=>String(x).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "/");
  const url = `${base}video/?c=${s(v.creatorName)}&v=${s(v.title)}`;
  const thumb = v.thumbnail || "https://via.placeholder.co/640x360?text=Thumbnail";
  const tags = (v.tags||[]).slice(0,2).map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("");
  const cc = v.captions ? `<span class="badge cc">CC</span>` : "";
  return `
  <article class="card video">
    <a class="video__link" href="${url}">
      <img class="video__thumb" src="${escapeAttr(thumb)}" alt="${escapeAttr(v.title)} — thumbnail" loading="lazy">
      <div class="video__meta">
        <h3 class="video__title">${escapeHtml(v.title)}</h3>
        <p class="video__creator">${escapeHtml(v.creatorName)}</p>
        <div class="video__tags"><span class="badge">${escapeHtml(v.category||"General")}</span>${tags}${cc}</div>
      </div>
    </a>
  </article>`;
}

function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,"&quot;"); }
