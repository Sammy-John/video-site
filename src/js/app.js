// /src/js/app.js
const $ = (s, d = document) => d.querySelector(s);
const $$ = (s, d = document) => Array.from(d.querySelectorAll(s));

console.log('[app] loaded');

/** Active nav (by path) */
// /src/js/app.js (active nav bit)
(function setActiveNav(){
  let p = location.pathname.toLowerCase();
  p = p.replace(/\/+$/, '').replace(/\.html$/, '');
  if (p.endsWith('/index') || p === '') p = '/';
  const map = { '/': 'home', '/channel': 'channel', '/account': 'account', '/about': 'about', '/privacy': 'privacy', '/terms': 'terms' };
  const el = document.querySelector(`[data-nav="${map[p]}"]`);
  if (el) el.setAttribute('aria-current','page');
})();


/** Mobile menu toggle */
(function navToggle() {
  const header = $('[data-js="site-header"]');
  const btn = $('[data-js="nav-toggle"]');
  if (!header || !btn) return;

  btn.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();

/** Site-wide search: emits `search:query` on input */
(function wireSearch() {
  const form = $('[data-js="site-search-form"]');
  const input = $('#site-search');
  if (!form || !input) return;

  const emit = () => {
    const q = input.value.trim();
    window.dispatchEvent(new CustomEvent('search:query', { detail: q }));
  };
  input.addEventListener('input', emit);
  form.addEventListener('submit', (e) => { e.preventDefault(); emit(); });
})();
