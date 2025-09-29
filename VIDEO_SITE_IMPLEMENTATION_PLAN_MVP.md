# Video Sharing Website — One-Page Implementation Plan (MVP)

> **Vision:** An ad-free, stress-free video platform that emphasizes creativity and discovery—**no likes, no public comments, no engagement ranking**—with randomized discovery and simple subscriptions (follow). Strong usability and accessibility across devices, with captions first.

---

## 1) Scope & Milestones

**MVP Pages:** Login/Sign Up, About, Privacy, Terms, Main (feed), Channel/Creator, Account/Profile.

**Core Features:** Ad-Free, Randomized Discovery, Subscriptions (follow), Mini-Player, Cross-Device Usability, Accessibility, Upload + Library, Category Navigation, User Account Management.

**Non-Goals (guardrails):** No ad networks/behavioral tracking; no likes/comments/engagement ranking.

**Milestones**
- **M0 – Repo & Shell:** scaffold, design system, static page shells.
- **M1 – Discovery & Player:** randomized feed, categories, mini-player.
- **M2 – Upload & Library:** small MP4 upload for demo, metadata + WebVTT captions.
- **M3 – Accounts (light):** optional local email/password (demo), profile; client-side “follow” & subscriptions feed.
- **M4 – A11y/SEO/Perf:** WCAG AA checks, schema, perf budgets, deploy.
- **M5 – Launch:** Netlify production, policies live, analytics wired.

---

## 2) Repo Layout & Tooling

```
/video-site/
├─ public/                 # static assets (favicons, robots.txt, sitemap.xml)
├─ src/
│  ├─ styles/              # base.css, components.css (focus-visible, skip-links)
│  ├─ js/
│  │  ├─ app.js           # router/init
│  │  ├─ feed.js          # random/chronological/subscription modes
│  │  ├─ player.js        # HTML5 player + mini-player + captions toggle
│  │  ├─ upload.js        # demo upload: metadata + captions attach
│  │  ├─ account.js       # profile + follow list (client-side)
│  │  └─ a11y.js          # keyboard + ARIA helpers
│  ├─ data/
│  │  ├─ videos.index.json
│  │  └─ creators.json
│  └─ pages/              # html partials/templates
├─ index.html              # feed shell
├─ about.html privacy.html terms.html login.html channel.html account.html
├─ netlify.toml            # redirects/headers/caching
├─ package.json
└─ README.md or PLAN.md
```

**Stack:** Vanilla HTML/CSS/JS. **Hosting:** Netlify.

**Suggested Scripts:**
- `dev` – local static server + live reload
- `build` – minify CSS/JS, copy assets
- `lint` – html-validate, eslint, stylelint
- `test` – link checker + Lighthouse CI (target URLs)

---

## 3) Implementation Checklist (by milestone)

### M0 — Repo & Shell
- Init repo: license, PR/issue templates.
- Base CSS (color, type, spacing) using **Playfair Display** (Headings) + **Nunito Sans** (Body); minimalist style.
- Page shells for all MVP pages.
- Header/nav, search, card components, forms with labels and visible focus.

### M1 — Discovery & Player
- Draft `videos.index.json` (10–20 demo entries).
- **Feed modes**: `random` (default), `chronological`, `subscriptions (stub)`.
- **Category chips** bound to `category` in JSON.
- **Mini-player**: sticky on scroll; full keyboard control; captions toggle.

### M2 — Upload & Library
- **Upload form**: title, description, tags, category, thumbnail, MP4 file (small demo clips).
- Store demo MP4s as static assets; link **WebVTT** captions; CC toggle in player.
- **Channel page**: list creator videos + **Follow** button.

### M3 — Accounts & Subscriptions (demo-light)
- Optional local email/password auth for demo; Profile editor.
- Client-side **follow** (localStorage) → **Subscriptions** feed view.

### M4 — Accessibility, SEO, Performance
- **Accessibility:** Captions required on demo videos; alt text; ARIA roles; keyboard navigation; test with screen readers.
- **SEO:** Semantic HTML; unique titles/descriptions; **VideoObject** schema; video sitemap; clean URLs like `/video/creator-name/video-title`.
- **Performance budgets (MVP):** page load < 2s (broadband); video start < 3s; lazy thumbnails; baseline uptime.

### M5 — Launch
- Netlify deploy (prod) with SSL; `netlify.toml` for redirects/headers.
- Publish **About / Privacy / Terms** pages.
- Analytics: privacy-first (e.g., Plausible); **no behavioral tracking**.

---

## 4) Data & Metadata

**`videos.index.json` (example):**
```json
{
  "id": "abc123",
  "title": "Clay Animation: Dawn",
  "creatorId": "maker01",
  "creatorName": "Maker One",
  "category": "Animation",
  "tags": ["stopmotion","clay"],
  "src": "/media/abc123.mp4",
  "thumbnail": "/thumbs/abc123.jpg",
  "captions": "/captions/abc123.vtt",
  "uploadedAt": "2025-09-28"
}
```

---

## 5) Accessibility & UX Must-Haves
- Closed captions (WebVTT) for demo videos; captions toggle in player.
- Alt text for images/thumbnails; ARIA roles; visible focus; skip links.
- Cross-device responsiveness (desktop/tablet/mobile).

---

## 6) SEO Essentials
- Per-page `<title>` & meta descriptions; OG/Twitter tags on video pages.
- **Schema.org `VideoObject`** per video; **video sitemap**; clean URLs.
- Robots.txt; XML sitemap; HTTPS.

---

## 7) Performance Targets
- **MVP:** Page load < 2s (broadband), video start < 3s; smooth 720p for demo clips; ≥99% uptime (Netlify baseline).
- **Production (later):** TTFF < 2s, adaptive bitrate (HLS/DASH), <1% buffer ratio, 99.9% uptime.

---

## 8) CI/CD & Ops
- **Netlify**: preview deploys on PR; production on `main`.
- Monitoring: Lighthouse CI; basic uptime check.
- Error logging (MVP): console; note Sentry for later.

---

## 9) Scale-Up Notes (post-MVP)
- **Auth**: OAuth (Google/Apple) + JWT refresh.
- **Media**: object storage (S3/R2/B2) + FFmpeg to HLS/DASH; CDN (CloudFront/Cloudflare/Bunny) or managed (Mux/Cloudflare Stream/Bunny Stream).
- **Discovery**: Meilisearch/Algolia index; modes: randomized/chronological/subscription feed.
- **Creator/Subscription**: server follow graph; email digest/web-push. **Moderation**: report queue; takedown workflow; audit log.
- **Analytics (privacy-first)** only; no ads/profiling.

---
**License & Governance:** Publish Privacy Policy & Terms; keep platform free of ad/engagement pressure per non-goals.
