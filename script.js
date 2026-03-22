/* ══════════════════════════════════════════════
   DormChef v3 — Nielsen Heuristics Applied
   All 10 principles woven into logic & UX
   ══════════════════════════════════════════════

   H1  Visibility of system status
   H2  Match between system and real world
   H3  User control & freedom
   H4  Consistency & standards
   H5  Error prevention
   H6  Recognition over recall
   H7  Flexibility & efficiency of use
   H8  Aesthetic & minimalist design
   H9  Help users recognize, diagnose, recover from errors
   H10 Help & documentation
   ══════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════
   H2: LANGUAGE — match real world
════════════════════════════════════════ */
let currentLang = localStorage.getItem('dormchef_lang') || 'en';

const LANG = {
  en: {
    greeting_morning: 'Good morning 👋',
    greeting_afternoon: 'Good afternoon 👋',
    greeting_evening: 'Good evening 👋',
    greeting_night: 'Late night craving? 🌙',
    search_ph: 'Search any dish or ingredient…',
    all_recipes: 'All Recipes',
    results: n => `${n} recipe${n !== 1 ? 's' : ''} found`,
    no_results: 'Nothing found',
    no_results_sub: q => `No recipes match "${q}". Try different keywords or clear your filters.`,
    saved: n => `❤️ Saved! ${n} recipe${n !== 1 ? 's' : ''} saved`,
    unsaved: '💔 Removed from saved',
    saved_title: '❤️ Saved Recipes',
    chef_pick: 'Chef\'s Pick',
    watch_yt: '▶ Watch on YouTube',
    ingredients_section: 'Ingredients',
    tools_section: 'Tools Needed',
    steps_section: 'How to Cook',
    you_have: 'You have this',
    filters_cleared: 'All filters cleared',
    random_toast: '🎲 New recipe picked!',
    lang_switched: '🇵🇭 Filipino',
  },
  fil: {
    greeting_morning: 'Magandang umaga 👋',
    greeting_afternoon: 'Magandang hapon 👋',
    greeting_evening: 'Magandang gabi 👋',
    greeting_night: 'Gutom ka na naman? 🌙',
    search_ph: 'Maghanap ng pagkain o sangkap…',
    all_recipes: 'Lahat ng Recipe',
    results: n => `${n} recipe ang nahanap`,
    no_results: 'Wala pang nahanap',
    no_results_sub: q => `Walang recipe para sa "${q}". Subukan ng ibang salita.`,
    saved: n => `❤️ Na-save na! ${n} recipe`,
    unsaved: '💔 Tinanggal sa listahan',
    saved_title: '❤️ Mga Na-save',
    chef_pick: 'Pinili ng Chef',
    watch_yt: '▶ Panoorin sa YouTube',
    ingredients_section: 'Mga Sangkap',
    tools_section: 'Mga Gamit',
    steps_section: 'Paraan ng Pagluluto',
    you_have: 'Mayroon ka nito',
    filters_cleared: 'Lahat ng filter ay na-clear',
    random_toast: '🎲 Bagong recipe!',
    lang_switched: '🇺🇸 English',
  }
};
function L(key) { return LANG[currentLang][key] ?? LANG.en[key] ?? key; }
function Lf(key, ...args) {
  const fn = LANG[currentLang][key] ?? LANG.en[key];
  return typeof fn === 'function' ? fn(...args) : fn;
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'fil' : 'en';
  localStorage.setItem('dormchef_lang', currentLang);
  document.getElementById('lang-label').textContent = currentLang.toUpperCase();
  setGreeting();
  updateSearchPlaceholder();
  applyFilters();
  showToast(L('lang_switched'));
}

/* ════════════════════════════════════════
   H1: STATUS BAR CLOCK
════════════════════════════════════════ */
function tickClock() {
  const el = document.getElementById('sb-time');
  if (!el) return;
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2,'0');
  el.textContent = `${h}:${m}`;
}

/* ════════════════════════════════════════
   H2: GREETING — time-aware
════════════════════════════════════════ */
function setGreeting() {
  const h = new Date().getHours();
  const key = h < 12 ? 'greeting_morning' : h < 17 ? 'greeting_afternoon' : h < 22 ? 'greeting_evening' : 'greeting_night';
  const el = document.getElementById('home-greeting');
  if (el) el.textContent = L(key);
}

function updateSearchPlaceholder() {
  const ph = document.getElementById('search-placeholder');
  if (ph) ph.textContent = L('search_ph');
  const inp = document.getElementById('main-search-input');
  if (inp) inp.setAttribute('aria-label', L('search_ph'));
}

/* ════════════════════════════════════════
   INGREDIENT & TOOL GROUPS
════════════════════════════════════════ */
const INGREDIENT_GROUPS = {
  staples:    { label:'🛒 Pantry Staples', items:['Rice','Bread','Cooking Oil','Salt','Pepper','Sugar','Vinegar','Soy Sauce','Fish Sauce (Patis)','Ketchup','Flour','Margarine / Butter'] },
  proteins:   { label:'🥩 Proteins',       items:['Egg','Chicken','Pork','Ground Pork','Hotdog','Tocino','Longganisa','Tuna (canned)','Sardines (canned)','Corned Beef (canned)','Spam','Squid Ball','Bangus (Milkfish)','Tilapia','Beef'] },
  veggies:    { label:'🥬 Vegetables',     items:['Onion','Garlic','Tomato','Cabbage','Kangkong','Sitaw (String Beans)','Ampalaya (Bitter Melon)','Potato','Carrot','Pechay','Talong (Eggplant)','Sayote','Kamote (Sweet Potato)','Green Onion','Ginger','Kalabasa','Langka(hilaw)'] },
  instant:    { label:'🥫 Instant & Canned', items:['Instant Noodles','Lucky Me Pancit Canton','Mushroom (canned)','Coconut Milk (canned)','Tomato Sauce (canned)','Condensed Milk','Evaporated Milk','Instant Oatmeal','Monggo Bean'] },
  condiments: { label:'🧂 Condiments',     items:['Oyster Sauce','Calamansi','Chili / Siling Labuyo','Banana Catsup','Liquid Seasoning','Peanut Butter','Bread Crumbs','Cheese'] },
};
const TOOLS = [
  { id:'rice-cooker',   name:'Rice Cooker',     emoji:'🍚' },
  { id:'frying-pan',    name:'Frying Pan',      emoji:'🍳' },
  { id:'microwave',     name:'Microwave',        emoji:'📦' },
  { id:'electric-stove',name:'Electric Stove',  emoji:'🔌' },
  { id:'gas-stove',     name:'Gas Stove',        emoji:'🔥' },
  { id:'pot',           name:'Pot / Kaldero',    emoji:'🫕' },
  { id:'oven-toaster',  name:'Oven Toaster',     emoji:'🟫' },
  { id:'kettle',        name:'Electric Kettle',  emoji:'☕' },
  { id:'knife',         name:'Knife & Board',    emoji:'🔪' },
];

/* ════════════════════════════════════════
   APP STATE
════════════════════════════════════════ */
let allRecipes = [];
let filteredRecipes = [];
let selectedIngredients = new Set();
let selectedTools = new Set();
let selectedCategory = '';
let searchQuery = '';
let favorites = loadFavorites();
let currentDetailRecipe = null;
let featuredRecipe = null;
let currentActiveScreen = 'screen-home';
let searchDebounceTimer = null;
let lastRemovedFav = null; // H3: undo support
let hintShown = false;

/* ════════════════════════════════════════
   PERSISTENCE
════════════════════════════════════════ */
function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('dc_favs_v3') || '[]'); }
  catch { return []; }
}
function saveFavorites() {
  localStorage.setItem('dc_favs_v3', JSON.stringify(favorites));
}
function isFav(name) { return favorites.some(f => f.name === name); }

/* ════════════════════════════════════════
   NAVIGATION — H3: always escapable
════════════════════════════════════════ */
function showScreen(id) {
  const current = document.querySelector('.screen.active');
  if (current && current.id !== id) {
    current.classList.add('slide-out');
    setTimeout(() => current.classList.remove('slide-out', 'active'), 420);
  }
  const next = document.getElementById(id);
  if (next) { next.classList.add('active'); currentActiveScreen = id; }
  syncBottomNav(id);
}

function closeScreen(id) {
  const s = document.getElementById(id);
  if (s) s.classList.remove('active');
  const home = document.getElementById('screen-home');
  home.classList.remove('slide-out', 'active');
  home.classList.add('active');
  currentActiveScreen = 'screen-home';
  syncBottomNav('screen-home');
}

function syncBottomNav(id) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  if (id === 'screen-home') document.getElementById('bn-home')?.classList.add('active');
  if (id === 'screen-favs') document.getElementById('bn-favs')?.classList.add('active');
}

function goHome() { if (currentActiveScreen !== 'screen-home') closeScreen(currentActiveScreen); }

/* ════════════════════════════════════════
   SEARCH — H1: spinner shows system status
════════════════════════════════════════ */
function focusSearch() { document.getElementById('main-search-input')?.focus(); }

function onSearchFocus() {
  document.getElementById('search-wrap')?.classList.add('focused');
  document.getElementById('search-placeholder')?.classList.add('hidden-ph');
}
function onSearchBlur() {
  document.getElementById('search-wrap')?.classList.remove('focused');
  if (!document.getElementById('main-search-input')?.value) {
    document.getElementById('search-placeholder')?.classList.remove('hidden-ph');
  }
}

function onSearchInput() {
  const val = document.getElementById('main-search-input').value;
  searchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById('hs-clear');
  const ph = document.getElementById('search-placeholder');
  if (val) { clearBtn?.classList.remove('hidden'); ph?.classList.add('hidden-ph'); }
  else     { clearBtn?.classList.add('hidden');    ph?.classList.remove('hidden-ph'); }

  // H1: Show spinner while debouncing
  document.getElementById('search-spinner')?.classList.remove('hidden');
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    document.getElementById('search-spinner')?.classList.add('hidden');
    applyFilters();
  }, 200);
}

function clearMainSearch() {
  const inp = document.getElementById('main-search-input');
  if (inp) inp.value = '';
  searchQuery = '';
  document.getElementById('hs-clear')?.classList.add('hidden');
  document.getElementById('search-placeholder')?.classList.remove('hidden-ph');
  applyFilters();
}

function openSearchScreen() { goHome(); setTimeout(focusSearch, 300); }

/* ════════════════════════════════════════
   CATEGORY — H6: recognition
════════════════════════════════════════ */
function selectCat(btn, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected','false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  selectedCategory = cat;
  applyFilters();
}

/* ════════════════════════════════════════
   INGREDIENT / TOOL CHIPS — H6: recognition
════════════════════════════════════════ */
function buildIngredientChips() {
  const gridMap = {
    staples:    'grid-staples',
    proteins:   'grid-proteins',
    veggies:    'grid-veggies',
    instant:    'grid-instant',
    condiments: 'grid-condiments',
  };
  for (const [key, gridId] of Object.entries(gridMap)) {
    const el = document.getElementById(gridId);
    if (!el) continue;
    const { items } = INGREDIENT_GROUPS[key];
    el.innerHTML = items.map(item => `
      <label class="chip-label" data-val="${item.toLowerCase()}" title="${item}">
        <input type="checkbox" value="${item}" onchange="toggleIngredient('${item}',this.checked)"/>
        ${item}
      </label>`).join('');
  }
  const toolGrid = document.getElementById('tools-chip-grid');
  if (toolGrid) {
    toolGrid.innerHTML = TOOLS.map(t => `
      <label class="chip-label" data-val="${t.name.toLowerCase()}" title="${t.name}">
        <input type="checkbox" value="${t.id}" onchange="toggleTool('${t.id}',this.checked)"/>
        ${t.emoji} ${t.name}
      </label>`).join('');
  }
}

function toggleIngredient(name, checked) {
  if (checked) selectedIngredients.add(name); else selectedIngredients.delete(name);
  updateIngBadge();
  updateActiveFiltersRow();
  applyFilters();
}

function toggleTool(id, checked) {
  if (checked) selectedTools.add(id); else selectedTools.delete(id);
  updateIngBadge();
  applyFilters();
}

function updateIngBadge() {
  const n = selectedIngredients.size + selectedTools.size;
  const badge = document.getElementById('ing-count-badge');
  const toggle = document.getElementById('ing-toggle');
  if (badge) { badge.textContent = n; badge.classList.toggle('hidden', n === 0); }
  if (toggle) toggle.setAttribute('aria-label', n > 0 ? `${n} filter${n>1?'s':''} active` : 'Show ingredient filter');
  document.getElementById('ing-clear-all')?.classList.toggle('hidden', n === 0);
}

function filterIngredients() {
  const q = (document.getElementById('ing-drawer-search')?.value || '').toLowerCase().trim();
  document.querySelectorAll('.chip-label').forEach(chip => {
    const val = chip.dataset.val || '';
    chip.classList.toggle('hidden-chip', q.length > 0 && !val.includes(q));
  });
}

/* H3: Clear all — always reachable */
function clearAllFilters() {
  selectedIngredients.clear();
  selectedTools.clear();
  document.querySelectorAll('.chip-label.checked').forEach(l => {
    l.classList.remove('checked');
    const cb = l.querySelector('input');
    if (cb) cb.checked = false;
  });
  updateIngBadge();
  updateActiveFiltersRow();
  applyFilters();
  showToast(L('filters_cleared'));
}

function toggleIngPanel() {
  const drawer = document.getElementById('ing-drawer');
  const toggle = document.getElementById('ing-toggle');
  const isOpen = drawer.classList.toggle('open');
  toggle.textContent = isOpen ? 'Hide' : 'Show';
  const badge = document.getElementById('ing-count-badge');
  if (badge && !badge.classList.contains('hidden')) toggle.appendChild(badge);
  toggle.setAttribute('aria-expanded', String(isOpen));
  drawer.setAttribute('aria-hidden', String(!isOpen));
}

/* H1: Active filter summary row */
function updateActiveFiltersRow() {
  const row = document.getElementById('active-filters-row');
  if (!row) return;
  const pills = [];
  selectedIngredients.forEach(name => {
    pills.push(`<span class="af-pill">${name}<button onclick="removeIngFilter('${name}')" aria-label="Remove ${name} filter">✕</button></span>`);
  });
  if (pills.length === 0) {
    row.classList.add('hidden');
    row.innerHTML = '';
  } else {
    row.classList.remove('hidden');
    row.innerHTML = pills.join('') + (pills.length > 1 ? `<span class="af-pill" style="background:var(--spice-dim);color:#e07060;border-color:rgba(212,68,40,.2)"><button onclick="clearAllFilters()">✕ Clear all</button></span>` : '');
  }
}

function removeIngFilter(name) {
  selectedIngredients.delete(name);
  // Uncheck the chip
  document.querySelectorAll('.chip-label').forEach(chip => {
    const cb = chip.querySelector('input');
    if (cb && cb.value === name) { chip.classList.remove('checked'); cb.checked = false; }
  });
  updateIngBadge();
  updateActiveFiltersRow();
  applyFilters();
}

/* ════════════════════════════════════════
   FILTER + SEARCH LOGIC
════════════════════════════════════════ */
function applyFilters() {
  const hasFilters = searchQuery || selectedCategory || selectedIngredients.size > 0 || selectedTools.size > 0;
  const skeletons = document.getElementById('skeleton-list');
  const container = document.getElementById('recipes-container');
  const empty = document.getElementById('empty-state');
  const hint = document.getElementById('first-run-hint');

  skeletons?.classList.add('hidden');
  container?.classList.remove('hidden');

  // Show onboarding hint if first visit and no search yet
  if (!hasFilters && !hintShown && !localStorage.getItem('dc_hint_dismissed')) {
    hint?.classList.remove('hidden');
  } else {
    hint?.classList.add('hidden');
  }

  let results = [...allRecipes];

  // Text search — H9: shows what matched
  if (searchQuery) {
    results = results.filter(r =>
      r.name.toLowerCase().includes(searchQuery) ||
      (r.description || '').toLowerCase().includes(searchQuery) ||
      (r.category || '').toLowerCase().includes(searchQuery) ||
      (r.ingredients || []).some(i => i.toLowerCase().includes(searchQuery))
    );
  }

  // Category
  if (selectedCategory) results = results.filter(r => r.category === selectedCategory);

  // Tool filter
  if (selectedTools.size > 0) {
    results = results.filter(r => {
      const rTools = (r.tools || []);
      return [...selectedTools].every(tid => rTools.includes(tid));
    });
  }

  // Ingredient scoring — H1: match % always shown
  if (selectedIngredients.size > 0) {
    const selArr = [...selectedIngredients].map(s => s.toLowerCase());
    results = results.map(r => {
      const rIngs = (r.ingredients || []).map(i => i.toLowerCase());
      const matched = selArr.filter(sel => rIngs.some(ri => ri.includes(sel))).length;
      return { ...r, _matched: matched, _total: selectedIngredients.size, _ratio: matched / selectedIngredients.size };
    }).filter(r => r._matched > 0)
      .sort((a, b) => b._ratio - a._ratio || b._matched - a._matched);
  }

  filteredRecipes = results;
  renderRecipeList(results, hasFilters);
}

/* ════════════════════════════════════════
   RECIPE LIST RENDER — H8: minimal noise
════════════════════════════════════════ */
function renderRecipeList(recipes, hasFilters) {
  const container = document.getElementById('recipes-container');
  const empty = document.getElementById('empty-state');
  const countEl = document.getElementById('results-count');
  const labelEl = document.getElementById('results-label');

  container.innerHTML = '';
  empty?.classList.add('hidden');

  if (!hasFilters) {
    labelEl.textContent = L('all_recipes');
    countEl.textContent = recipes.length;
  } else {
    labelEl.textContent = 'Results';
    countEl.textContent = Lf('results', recipes.length);
  }

  if (recipes.length === 0) {
    // H9: Friendly, contextual error recovery
    empty?.classList.remove('hidden');
    const titleEl = document.getElementById('empty-title');
    const subEl = document.getElementById('empty-sub');
    if (titleEl) titleEl.textContent = L('no_results');
    if (subEl) subEl.textContent = searchQuery ? Lf('no_results_sub', searchQuery) : 'Try removing some filters.';
    return;
  }

  container.innerHTML = recipes.map((r, i) => recipeCardHTML(r, i)).join('');
}

function recipeCardHTML(r, index) {
  const saved = isFav(r.name);
  const matchBadge = r._matched != null
    ? `<span class="rc-match ${r._ratio >= 0.7 ? 'match-hi' : 'match-mid'}">${Math.round(r._ratio * 100)}% match</span>`
    : '';
  const catTag  = r.category  ? `<span class="rc-tag cat">${r.category}</span>` : '';
  const timeTag = r.cookingTime ? `<span class="rc-tag">⏱ ${r.cookingTime}</span>` : (r.time ? `<span class="rc-tag">⏱ ${r.time}</span>` : '');
  const costTag = r.estimatedCost ? `<span class="rc-tag cost">₱ ${r.estimatedCost.replace('₱','').replace('P','').trim()}</span>` : '';
  const ytTag   = r.youtube ? `<span class="rc-tag yt">▶ Video</span>` : '';
  const img = r.image && r.image.trim()
    ? `<img class="rc-thumb-img" src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="rc-thumb-emoji" style="display:none">${r.emoji||'🍽️'}</div>`
    : `<div class="rc-thumb-emoji">${r.emoji||'🍽️'}</div>`;

  return `<div class="recipe-card" onclick="openDetail(${index})" style="animation-delay:${Math.min(index*0.03,0.3)}s" role="article" tabindex="0" aria-label="${r.name}">
    <div class="rc-thumb">${img}</div>
    <div class="rc-info">
      <div class="rc-info-top">
        <span class="rc-name">${r.name}</span>
        ${matchBadge}
      </div>
      ${r.description ? `<p class="rc-desc">${r.description}</p>` : ''}
      <div class="rc-tags">${catTag}${timeTag}${costTag}${ytTag}</div>
    </div>
    <button class="rc-save-btn ${saved ? 'saved' : ''}" onclick="event.stopPropagation();quickSave('${r.name}',this)" aria-label="${saved ? 'Remove from saved' : 'Save recipe'}">${saved ? '❤️' : '♡'}</button>
  </div>`;
}

/* ════════════════════════════════════════
   DETAIL SCREEN — H6: owned ingredients highlighted
════════════════════════════════════════ */
function openDetail(indexInFiltered) {
  const r = filteredRecipes[indexInFiltered];
  if (!r) return;
  const found = allRecipes.find(x => x.name === r.name) || r;
  currentDetailRecipe = found;
  renderDetailScreen(found);
  showScreen('screen-detail');
  updateDetailFavBtn();
  // H1: Scroll to top
  document.getElementById('detail-body')?.scrollTo(0, 0);
  // H1: Show back-title only after scroll
  setupDetailScroll();
}

function openFeaturedRecipe() {
  if (!featuredRecipe) return;
  currentDetailRecipe = featuredRecipe;
  renderDetailScreen(featuredRecipe);
  showScreen('screen-detail');
  updateDetailFavBtn();
  document.getElementById('detail-body')?.scrollTo(0, 0);
  setupDetailScroll();
}

function setupDetailScroll() {
  const scroll = document.getElementById('detail-body');
  const titleEl = document.getElementById('detail-header-title');
  if (!scroll || !titleEl) return;
  const handler = () => {
    const show = scroll.scrollTop > 200;
    titleEl.classList.toggle('hidden', !show);
    if (show && currentDetailRecipe) titleEl.textContent = currentDetailRecipe.name;
  };
  scroll.removeEventListener('scroll', scroll._titleHandler);
  scroll._titleHandler = handler;
  scroll.addEventListener('scroll', handler, { passive: true });
}

function renderDetailScreen(r) {
  const body = document.getElementById('detail-body');
  if (!body) return;

  const heroHTML = r.image && r.image.trim()
    ? `<img class="d-hero-img" src="${r.image}" alt="${r.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="d-hero-emoji" style="display:none">${r.emoji||'🍽️'}</div>`
    : `<div class="d-hero-emoji">${r.emoji||'🍽️'}</div>`;

  const catPill = r.category ? `<span class="d-meta-pill cat">${r.category}</span>` : '';
  const timePill = (r.cookingTime || r.time) ? `<span class="d-meta-pill">⏱ ${r.cookingTime||r.time}</span>` : '';
  const servPill = r.servings ? `<span class="d-meta-pill">🍽️ ${r.servings}</span>` : '';
  const diffPill = r.difficulty ? `<span class="d-meta-pill">${r.difficulty}</span>` : '';
  const costPill = r.estimatedCost ? `<span class="d-meta-pill cost">₱ ${r.estimatedCost.replace('₱','').trim()}</span>` : '';

  const ytURL = r.youtube || `https://www.youtube.com/results?search_query=${encodeURIComponent(r.name+' Filipino recipe')}`;
  const ytBtn = `<a class="d-yt-btn" href="${ytURL}" target="_blank" rel="noopener" aria-label="Watch ${r.name} on YouTube">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 7a2.4 2.4 0 00-1.69-1.7C16.35 5 12 5 12 5s-4.35 0-5.9.3A2.4 2.4 0 004.41 7 25 25 0 004.1 12a25 25 0 00.31 5 2.4 2.4 0 001.69 1.7C7.65 19 12 19 12 19s4.35 0 5.9-.3A2.4 2.4 0 0019.59 17 25 25 0 0019.9 12a25 25 0 00-.31-5zM10 15V9l5.2 3z"/></svg>
    ${L('watch_yt')}
  </a>`;

  // H6: highlight ingredients you own
  const ownedLower = [...selectedIngredients].map(s => s.toLowerCase());
  const ingItems = (r.ingredients || []).map(ing => {
    const owned = ownedLower.some(o => ing.toLowerCase().includes(o));
    return `<li class="d-ing-item${owned ? ' owned' : ''}" title="${owned ? L('you_have') : ''}">${ing}</li>`;
  }).join('');

  const steps = (r.steps || []).map((s, i) =>
    `<div class="d-step"><span class="d-step-num">${i+1}</span><p class="d-step-text">${s}</p></div>`
  ).join('');

  const toolsHTML = (r.tools || []).map(tid => {
    const found = TOOLS.find(t => t.id === tid);
    return found ? `<span class="d-tool-chip">${found.emoji} ${found.name}</span>` : `<span class="d-tool-chip">${tid}</span>`;
  }).join('');

  // H4: Save CTA also in detail body (consistent with card's ♡)
  const saved = isFav(r.name);
  const saveCTA = `<button class="d-save-cta ${saved ? 'saved' : ''}" id="d-save-cta" onclick="toggleFavorite()" aria-label="${saved ? 'Remove from saved' : 'Save this recipe'}">
    ${saved ? '❤️ Saved to your list' : '♡ Save this recipe'}
  </button>`;

  body.innerHTML = `
    <div class="d-hero">${heroHTML}<div class="d-hero-fade"></div></div>
    <div class="d-content">
      <h1 class="d-name">${r.name}</h1>
      <div class="d-meta-row">${catPill}${timePill}${servPill}${diffPill}${costPill}</div>
      ${ytBtn}
      ${r.description ? `<p style="font-size:.88rem;color:var(--cream-2);line-height:1.7;margin-bottom:20px;font-style:italic;">${r.description}</p>` : ''}
      ${toolsHTML ? `<div class="d-sec"><div class="d-sec-head"><span class="d-sec-title">${L('tools_section')}</span><div class="d-sec-line"></div></div><div class="d-tools">${toolsHTML}</div></div>` : ''}
      ${ingItems ? `<div class="d-sec"><div class="d-sec-head"><span class="d-sec-title">${L('ingredients_section')}</span><div class="d-sec-line"></div></div><ul class="d-ing-list">${ingItems}</ul></div>` : ''}
      ${steps ? `<div class="d-sec"><div class="d-sec-head"><span class="d-sec-title">${L('steps_section')}</span><div class="d-sec-line"></div></div><div class="d-steps">${steps}</div></div>` : ''}
      ${saveCTA}
    </div>`;
}

function closeDetail() {
  const screen = document.getElementById('screen-detail');
  screen?.classList.remove('active');
  const home = document.getElementById('screen-home');
  home.classList.remove('slide-out');
  home.classList.add('active');
  currentActiveScreen = 'screen-home';
  syncBottomNav('screen-home');
}

/* ════════════════════════════════════════
   FAVORITES — H3: undo on remove
════════════════════════════════════════ */
function toggleFavorite() {
  if (!currentDetailRecipe) return;
  quickSaveByRecipe(currentDetailRecipe);
  updateDetailFavBtn();
  // Sync body CTA
  const cta = document.getElementById('d-save-cta');
  if (cta) {
    const saved = isFav(currentDetailRecipe.name);
    cta.classList.toggle('saved', saved);
    cta.innerHTML = saved ? '❤️ Saved to your list' : '♡ Save this recipe';
    cta.setAttribute('aria-label', saved ? 'Remove from saved' : 'Save this recipe');
  }
}

function quickSave(name, btn) {
  const recipe = allRecipes.find(r => r.name === name);
  if (!recipe) return;
  quickSaveByRecipe(recipe);
  if (btn) {
    const saved = isFav(name);
    btn.textContent = saved ? '❤️' : '♡';
    btn.classList.toggle('saved', saved);
    btn.setAttribute('aria-label', saved ? 'Remove from saved' : 'Save recipe');
  }
}

function quickSaveByRecipe(recipe) {
  const alreadySaved = isFav(recipe.name);
  if (alreadySaved) {
    lastRemovedFav = recipe;
    favorites = favorites.filter(f => f.name !== recipe.name);
    saveFavorites();
    updateFavCount();
    // H3: Undo option in toast
    showToastWithUndo(L('unsaved'), 'Undo', () => {
      if (lastRemovedFav) {
        favorites.push(lastRemovedFav);
        saveFavorites();
        updateFavCount();
        updateDetailFavBtn();
        lastRemovedFav = null;
        showToast('❤️ Restored!');
      }
    });
  } else {
    favorites.push(recipe);
    saveFavorites();
    updateFavCount();
    showToast(Lf('saved', favorites.length));
  }
}

function updateDetailFavBtn() {
  const btn = document.getElementById('detail-fav-header');
  if (!btn || !currentDetailRecipe) return;
  const saved = isFav(currentDetailRecipe.name);
  btn.textContent = saved ? '❤️' : '♡';
  btn.classList.toggle('saved', saved);
  btn.setAttribute('aria-label', saved ? 'Remove from saved' : 'Save this recipe');
}

function updateFavCount() {
  const n = favorites.length;
  const badge = document.getElementById('bn-fav-count');
  const dot = document.getElementById('fav-dot');
  if (badge) { badge.textContent = n; badge.classList.toggle('hidden', n === 0); }
  if (dot) dot.classList.toggle('hidden', n === 0);
}

function updateFeaturedFavBtn() {
  const btn = document.getElementById('fc-fav-btn');
  if (!btn || !featuredRecipe) return;
  const saved = isFav(featuredRecipe.name);
  btn.textContent = saved ? '❤️' : '♡';
  btn.classList.toggle('saved', saved);
}

function toggleFeaturedFav() {
  if (!featuredRecipe) return;
  quickSaveByRecipe(featuredRecipe);
  updateFeaturedFavBtn();
}

function openFavorites() {
  renderFavList();
  document.getElementById('fav-screen-title').textContent = L('saved_title');
  showScreen('screen-favs');
}

function renderFavList() {
  const list = document.getElementById('fav-list');
  const noFav = document.getElementById('no-fav');
  if (!list) return;
  if (favorites.length === 0) {
    list.innerHTML = '';
    noFav?.classList.remove('hidden');
    return;
  }
  noFav?.classList.add('hidden');
  list.innerHTML = favorites.map((r, i) => {
    const thumbHTML = r.image && r.image.trim()
      ? `<img class="fav-thumb-img" src="${r.image}" alt="${r.name}" onerror="this.innerHTML='${r.emoji||'🍽️'}'"/>`
      : `<span>${r.emoji||'🍽️'}</span>`;
    return `<div class="fav-row" onclick="openFavDetail(${i})" role="button" tabindex="0" aria-label="Open ${r.name}">
      <div class="fav-thumb">${thumbHTML}</div>
      <div class="fav-info">
        <p class="fav-name">${r.name}</p>
        <p class="fav-meta">${r.category||''} ${(r.cookingTime||r.time) ? '· '+(r.cookingTime||r.time) : ''}</p>
      </div>
      <button class="fav-del" onclick="event.stopPropagation();removeFav('${r.name}')" aria-label="Remove ${r.name} from saved">✕</button>
    </div>`;
  }).join('');
}

function openFavDetail(index) {
  const r = favorites[index];
  if (!r) return;
  currentDetailRecipe = allRecipes.find(x => x.name === r.name) || r;
  renderDetailScreen(currentDetailRecipe);
  showScreen('screen-detail');
  updateDetailFavBtn();
  document.getElementById('detail-body')?.scrollTo(0, 0);
  setupDetailScroll();
}

function removeFav(name) {
  const recipe = favorites.find(f => f.name === name);
  lastRemovedFav = recipe || null;
  favorites = favorites.filter(f => f.name !== name);
  saveFavorites();
  updateFavCount();
  renderFavList();
  // H3: Undo
  showToastWithUndo(L('unsaved'), 'Undo', () => {
    if (lastRemovedFav) {
      favorites.push(lastRemovedFav);
      saveFavorites();
      updateFavCount();
      renderFavList();
      lastRemovedFav = null;
      showToast('❤️ Restored!');
    }
  });
}

/* ════════════════════════════════════════
   FEATURED / RANDOM — H7: efficiency
════════════════════════════════════════ */
function pickFeatured() {
  if (!allRecipes.length) return;
  featuredRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
  renderFeaturedCard(featuredRecipe);
}

function renderFeaturedCard(r) {
  const imgEl = document.getElementById('fc-img');
  const placeholder = document.getElementById('fc-placeholder');
  const nameEl = document.getElementById('fc-name');
  const tagEl = document.getElementById('fc-tag');
  const metaEl = document.getElementById('fc-meta');
  if (nameEl) nameEl.textContent = r.name;
  if (tagEl) tagEl.textContent = L('chef_pick');
  if (metaEl) {
    const pills = [
      (r.cookingTime||r.time) && `⏱ ${r.cookingTime||r.time}`,
      r.servings && `🍽️ ${r.servings}`,
      r.difficulty,
      r.category,
    ].filter(Boolean);
    metaEl.innerHTML = pills.map(p=>`<span>${p}</span>`).join('');
  }
  if (imgEl && placeholder) {
    if (r.image && r.image.trim()) {
      imgEl.src = r.image;
      imgEl.classList.remove('hidden');
      placeholder.style.display = 'none';
      imgEl.onerror = () => { imgEl.classList.add('hidden'); placeholder.textContent = r.emoji||'🍳'; placeholder.style.display = 'flex'; };
    } else {
      imgEl.classList.add('hidden');
      placeholder.textContent = r.emoji||'🍳';
      placeholder.style.display = 'flex';
    }
  }
  updateFeaturedFavBtn();
}

function randomRecipe() {
  if (!allRecipes.length) return;
  pickFeatured();
  const scroll = document.querySelector('.home-scroll');
  if (scroll) scroll.scrollTo({ top: 0, behavior: 'smooth' });
  const card = document.getElementById('featured-card');
  if (card) {
    card.style.opacity = '0.6';
    card.style.transform = 'scale(0.97)';
    requestAnimationFrame(() => setTimeout(() => { card.style.opacity = ''; card.style.transform = ''; }, 200));
  }
  showToast(L('random_toast'));
}

/* ════════════════════════════════════════
   H1+H3: TOAST STACK with undo
════════════════════════════════════════ */
function showToast(msg) {
  _pushToast(msg, null, null);
}

function showToastWithUndo(msg, undoLabel, undoFn) {
  _pushToast(msg, undoLabel, undoFn);
}

function _pushToast(msg, undoLabel, undoFn) {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `<span>${msg}</span>${undoLabel ? `<button class="toast-undo" aria-label="Undo">${undoLabel}</button>` : ''}`;
  if (undoFn) {
    item.querySelector('.toast-undo')?.addEventListener('click', () => {
      undoFn();
      item.classList.add('toast-out');
      setTimeout(() => item.remove(), 250);
    });
  }
  stack.appendChild(item);
  // Limit stack to 3
  while (stack.children.length > 3) stack.removeChild(stack.firstChild);
  setTimeout(() => { item.classList.add('toast-out'); setTimeout(() => item.remove(), 250); }, undoFn ? 4500 : 2500);
}

/* ════════════════════════════════════════
   H10: ONBOARDING HINT
════════════════════════════════════════ */
function dismissHint() {
  localStorage.setItem('dc_hint_dismissed', '1');
  hintShown = true;
  document.getElementById('first-run-hint')?.classList.add('hidden');
}

/* ════════════════════════════════════════
   RECIPE DATA — full 130+ recipe database
   (merged from DormChef v6)
════════════════════════════════════════ */
function loadRecipes() {
  allRecipes = [
    { id:1,  name:'Sinangag na Kanin',      category:'Breakfast', emoji:'🍚', cookingTime:'10 mins', estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'fied rice.jpg',           description:'Garlicky Filipino fried rice – the dorm staple.',             ingredients:['Rice','Garlic','Cooking Oil','Salt','Egg'],                                                                         tools:['frying-pan'],                           steps:['Heat oil in frying pan over medium heat.','Fry minced garlic until golden and fragrant.','Add cold leftover rice, breaking up clumps.','Season with salt and mix well.','Push rice to side, scramble egg in the space, then mix together.','Serve hot with your protein of choice.'] },
    { id:2,  name:'Egg Fried Rice',          category:'Breakfast', emoji:'🍳', cookingTime:'12 mins', estimatedCost:'₱20–₱35', difficulty:'Easy',   image:'egg fried rice.jpg',      description:'Fluffy egg and rice stir-fried in soy sauce.',                ingredients:['Rice','Egg','Garlic','Onion','Soy Sauce','Cooking Oil'],                                                            tools:['frying-pan'],                           steps:['Heat oil, sauté garlic and onion until soft.','Beat eggs and add to the pan, scramble.','Add cold cooked rice and stir-fry on high heat.','Drizzle soy sauce around the edges of the pan.','Toss everything together and serve.'] },
    { id:3,  name:'Tortang Itlog',           category:'Breakfast', emoji:'🥚', cookingTime:'8 mins',  estimatedCost:'₱12–₱20', difficulty:'Easy',   image:'tortang itlog.jpg',       description:'Classic Filipino egg omelette with onion.',                  ingredients:['Egg','Onion','Salt','Pepper','Cooking Oil'],                                                                       tools:['frying-pan'],                           steps:['Beat eggs in a bowl with salt and pepper.','Add finely chopped onion and mix.','Heat oil in pan over medium heat.','Pour egg mixture and cook until edges set.','Flip carefully and cook the other side until golden.','Serve with rice and ketchup.'] },
    { id:4,  name:'Sardines Rice Bowl',      category:'Lunch',     emoji:'🥫', cookingTime:'15 mins', estimatedCost:'₱25–₱40', difficulty:'Easy',   image:'sardines rice bowl.jpg',  description:'Canned sardines sautéed with tomato over hot rice.',         ingredients:['Rice','Sardines (canned)','Garlic','Onion','Tomato','Cooking Oil'],                                                tools:['frying-pan','rice-cooker'],             steps:['Cook rice in rice cooker.','Heat oil, sauté garlic, onion, and tomato.','Open sardines and add to pan, sauce and all.','Mash lightly and cook 3–4 minutes, stirring.','Serve generous spoonful over hot rice.'] },
    { id:5,  name:'Corned Beef Fried Rice',  category:'Breakfast', emoji:'🥩', cookingTime:'12 mins', estimatedCost:'₱40–₱55', difficulty:'Easy',   image:'corned beef rice.jpg',    description:'Savory corned beef scrambled into garlic rice.',             ingredients:['Rice','Corned Beef (canned)','Garlic','Onion','Egg','Cooking Oil'],                                               tools:['frying-pan'],                           steps:['Heat oil, fry garlic until golden.','Add onion, cook until translucent.','Add corned beef and break apart with spatula.','Add cold rice and mix well over high heat.','Push to side, scramble an egg in, then combine.','Season with salt and serve.'] },
    { id:6,  name:'Tuna Omelette',           category:'Breakfast', emoji:'🐟', cookingTime:'10 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'tuna omellete.jpg',       description:'Flaky tuna folded into a golden egg omelette.',              ingredients:['Egg','Tuna (canned)','Onion','Tomato','Salt','Pepper','Cooking Oil'],                                             tools:['frying-pan'],                           steps:['Drain canned tuna and flake.','Beat eggs, add diced onion, tomato, salt, and pepper.','Stir in tuna flakes.','Heat oil in pan, pour mixture.','Cook until set, flip gently, cook other side.','Serve hot.'] },
    { id:7,  name:'Ginisang Repolyo',        category:'Lunch',     emoji:'🥬', cookingTime:'10 mins', estimatedCost:'₱20–₱30', difficulty:'Easy',   image:'ginisang repolyo.jpg',    description:'Stir-fried cabbage in soy sauce – simple and filling.',     ingredients:['Cabbage','Garlic','Onion','Cooking Oil','Soy Sauce','Salt','Pepper'],                                             tools:['frying-pan'],                           steps:['Heat oil, sauté garlic and onion.','Add shredded cabbage and toss over high heat.','Add a splash of soy sauce.','Season with salt and pepper.','Cook until cabbage is tender but still crisp.','Serve as side dish with rice.'] },
    { id:8,  name:'Hotdog Sinangag',         category:'Breakfast', emoji:'🌭', cookingTime:'10 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'hotdog sinangag.jpg',     description:'Crispy hotdog coins tossed into garlic fried rice.',         ingredients:['Rice','Hotdog','Garlic','Cooking Oil','Soy Sauce'],                                                                tools:['frying-pan'],                           steps:['Slice hotdogs into coins.','Fry garlic in oil until golden.','Add hotdog slices and fry until lightly charred.','Add cold rice and stir-fry together.','Drizzle soy sauce and mix well.','Serve hot.'] },
    { id:9,  name:'Instant Mami',            category:'Lunch',     emoji:'🍜', cookingTime:'7 mins',  estimatedCost:'₱12–₱18', difficulty:'Easy',   image:'instany mami.jpg',        description:'Upgraded instant noodle soup with egg and green onion.',    ingredients:['Instant Noodles','Egg','Green Onion','Garlic'],                                                                    tools:['pot','kettle'],                         steps:['Boil 2 cups water in pot.','Add noodles and cook 2 minutes.','Crack egg in and stir gently.','Add seasoning packet.','Top with chopped green onion.','Serve immediately.'] },
    { id:10, name:'Pancit Canton',           category:'Lunch',     emoji:'🍝', cookingTime:'12 mins', estimatedCost:'₱18–₱30', difficulty:'Easy',   image:'pancit canton.jpg',       description:'Stir-fried noodles with veggies – Filipino street classic.',ingredients:['Lucky Me Pancit Canton','Cabbage','Carrot','Egg','Cooking Oil','Garlic'],                                              tools:['frying-pan'],                           steps:['Soak noodles in warm water for 1 minute, drain.','Heat oil, sauté garlic.','Add vegetables and stir-fry 2 minutes.','Add drained noodles and mix.','Add seasoning packets and toss well.','Push aside, scramble egg, combine.','Serve hot.'] },
    { id:11, name:"Tokwa't Baboy Style Tofu",category:'Lunch',     emoji:'🧆', cookingTime:'15 mins', estimatedCost:'₱18–₱25', difficulty:'Easy',   image:'tokwa baboy.jpg',         description:'Fried egg in tangy soy-vinegar sauce – bar chow classic.',  ingredients:['Egg','Soy Sauce','Vinegar','Onion','Chili / Siling Labuyo','Garlic','Cooking Oil'],                               tools:['frying-pan'],                           steps:['Hard-boil egg, slice.','Mix soy sauce, vinegar, minced onion, garlic, and chili for sauce.','Fry egg pieces lightly in oil until golden.','Pour sauce over and serve.','Best paired with congee or rice.'] },
    { id:12, name:'Spam Fried Rice',         category:'Breakfast', emoji:'🥓', cookingTime:'13 mins', estimatedCost:'₱55–₱70', difficulty:'Easy',   image:'spam rice.webp',          description:'Caramelized Spam with garlic rice and egg.',                ingredients:['Rice','Spam','Garlic','Egg','Soy Sauce','Cooking Oil'],                                                            tools:['frying-pan'],                           steps:['Dice Spam into cubes.','Fry Spam in oil until caramelized. Set aside.','Fry garlic in same pan.','Add rice, stir-fry on high.','Scramble egg into the rice.','Add back Spam, drizzle soy sauce, and toss.','Serve hot.'] },
    { id:13, name:'Tocilog',                 category:'Breakfast', emoji:'🍖', cookingTime:'15 mins', estimatedCost:'₱40–₱60', difficulty:'Easy',   image:'tocilog.png',             description:'Tocino + sinangag + itlog — the ultimate silog.',           ingredients:['Tocino','Rice','Egg','Garlic','Cooking Oil'],                                                                      tools:['frying-pan','rice-cooker'],             steps:['Cook rice in rice cooker.','Fry tocino in oil over medium heat until caramelized.','In same pan, fry egg sunny side up.','Plate rice, tocino, and egg together.','Serve with garlic vinegar on the side.'] },
    { id:14, name:'Longsilog',               category:'Breakfast', emoji:'🌭', cookingTime:'18 mins', estimatedCost:'₱35–₱55', difficulty:'Easy',   image:'longsilog.png',           description:'Longganisa silog — sweet and garlicky breakfast.',          ingredients:['Longganisa','Rice','Egg','Garlic','Cooking Oil','Vinegar'],                                                        tools:['frying-pan','rice-cooker'],             steps:['Cook rice in rice cooker.','Add a bit of water to pan, cook longganisa covered until water evaporates.','Fry in own fat until browned.','Fry egg in remaining oil.','Serve with sinangag and egg.','Dip longganisa in vinegar.'] },
    { id:15, name:'Canned Tuna Pasta Hack',  category:'Lunch',     emoji:'🍝', cookingTime:'15 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', description:'Instant noodles as pasta with tuna tomato sauce.', ingredients:['Instant Noodles','Tuna (canned)','Tomato Sauce (canned)','Garlic','Onion','Cooking Oil'], tools:['pot'], steps:['Boil instant noodles without seasoning packet, drain.','Heat oil, sauté garlic and onion.','Add drained tuna, stir.','Pour tomato sauce, simmer 3 mins.','Add noodles and toss to coat.','Season with salt and serve.'] },
    { id:16, name:'Ginisang Pechay',         category:'Lunch',     emoji:'🥬', cookingTime:'8 mins',  estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'ginisang pichay.jpg',     description:'Quick sautéed pechay — nutritious dorm side dish.',          ingredients:['Pechay','Garlic','Onion','Soy Sauce','Cooking Oil','Salt'],                                                        tools:['frying-pan'],                           steps:['Heat oil and sauté garlic and onion.','Add washed pechay and toss.','Season with soy sauce and salt.','Cover and steam 2 minutes.','Serve with rice.'] },
    { id:17, name:'Kamote Que',              category:'Snacks',    emoji:'🍠', cookingTime:'20 mins', estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'kamote que.webp',         description:'Caramelized sweet potato — classic Filipino street merienda.',ingredients:['Kamote (Sweet Potato)','Sugar','Cooking Oil'],                                                                    tools:['frying-pan'],                           steps:['Peel and slice kamote into thick rounds.','Heat oil in pan over medium.','Fry kamote slices until soft, about 5 mins each side.','Sprinkle sugar over the slices.','Continue cooking until sugar caramelizes.','Serve as snack or merienda.'] },
    { id:18, name:'Giniling na Baboy Bowl',  category:'Lunch',     emoji:'🥩', cookingTime:'20 mins', estimatedCost:'₱55–₱75', difficulty:'Easy',   image:'giniling baboy.jpg',      description:'Ground pork in savory tomato sauce over rice.',              ingredients:['Ground Pork','Garlic','Onion','Tomato','Soy Sauce','Cooking Oil','Rice'],                                         tools:['frying-pan','rice-cooker'],             steps:['Cook rice.','Sauté garlic and onion in oil.','Add ground pork and cook until brown.','Add diced tomato and soy sauce.','Simmer 5 minutes.','Serve over rice.'] },
    { id:19, name:'Egg Sandwich',            category:'Breakfast', emoji:'🥪', cookingTime:'8 mins',  estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'egg sandwich.jpg',        description:'Quick egg sandwich — perfect dorm breakfast.',               ingredients:['Egg','Bread','Margarine / Butter','Salt','Pepper'],                                                                tools:['frying-pan','oven-toaster'],            steps:['Toast bread in oven toaster.','Fry egg to your preference.','Spread margarine on toast.','Place egg on bread, season with salt and pepper.','Close sandwich and enjoy.'] },
    { id:20, name:'Arrozcaldo',              category:'Breakfast', emoji:'🍲', cookingTime:'35 mins', estimatedCost:'₱60–₱85', difficulty:'Easy',   image:'arozcaldo.jpg',           description:'Comforting chicken rice porridge — Filipino lugaw upgrade.', ingredients:['Rice','Chicken','Garlic','Ginger','Onion','Fish Sauce (Patis)','Green Onion'],                                      tools:['pot'],                                  steps:['Sauté garlic, ginger, and onion in oil.','Add chicken pieces, cook until white.','Add rice and stir 2 minutes.','Pour 5–6 cups water, bring to boil.','Simmer 25 mins until rice breaks down.','Season with patis.','Garnish with green onion.'] },
    { id:21, name:'Ginisang Kangkong',       category:'Lunch',     emoji:'🌿', cookingTime:'7 mins',  estimatedCost:'₱15–₱22', difficulty:'Easy',   image:'gisang kanfkong.jpg',     description:'Oyster sauce kangkong — quick and healthy.',                ingredients:['Kangkong','Garlic','Onion','Oyster Sauce','Cooking Oil'],                                                          tools:['frying-pan'],                           steps:['Separate kangkong leaves and stems.','Sauté garlic and onion in oil.','Add kangkong stems first, cook 1 min.','Add leaves, toss quickly.','Add oyster sauce and mix.','Serve immediately.'] },
    { id:22, name:'Tortang Giniling',        category:'Lunch',     emoji:'🥚', cookingTime:'18 mins', estimatedCost:'₱45–₱60', difficulty:'Easy',   image:'tortang giniling.jpg',    description:'Ground pork omelette — meatier version of torta.',          ingredients:['Egg','Ground Pork','Onion','Garlic','Salt','Pepper','Cooking Oil'],                                               tools:['frying-pan'],                           steps:['Sauté garlic, onion, and ground pork. Season and cool slightly.','Beat eggs in a bowl, add cooked pork mixture.','Heat oil in pan.','Pour one ladleful of the egg-pork mix.','Cook until set, flip, cook other side.','Repeat and serve with rice and ketchup.'] },
    { id:23, name:'Fried Bangus',            category:'Dinner',    emoji:'🐟', cookingTime:'30 mins', estimatedCost:'₱55–₱80', difficulty:'Easy',   image:'bangus.jpg',              description:'Crispy fried milkfish — Filipino dinner classic.',           ingredients:['Bangus (Milkfish)','Garlic','Salt','Pepper','Vinegar','Cooking Oil'],                                             tools:['frying-pan'],                           steps:['Marinate bangus in vinegar, salt, and garlic for 15 mins.','Pat dry with paper towel.','Heat oil in pan, enough to shallow-fry.','Fry bangus until golden brown on both sides.','Serve with tomato, onion salsa and rice.'] },
    { id:24, name:'Tinolang Manok (Simple)', category:'Dinner',    emoji:'🍗', cookingTime:'35 mins', estimatedCost:'₱80–₱110',difficulty:'Easy',   image:'tinolang manok.jpg',      description:'Light ginger chicken soup with sayote.',                    ingredients:['Chicken','Ginger','Garlic','Onion','Sayote','Kangkong','Fish Sauce (Patis)'],                                     tools:['pot'],                                  steps:['Sauté ginger, garlic, and onion.','Add chicken, cook 5 minutes.','Add fish sauce and 4 cups water.','Bring to boil, simmer 20 mins.','Add sayote, cook 5 mins.','Add kangkong, turn off heat.','Serve hot.'] },
    { id:25, name:'Adobong Manok (Simple)',  category:'Dinner',    emoji:'🍗', cookingTime:'35 mins', estimatedCost:'₱75–₱100',difficulty:'Easy',   image:'adobo manok.jpg',         description:'The Filipino national dish — braised chicken adobo.',       ingredients:['Chicken','Soy Sauce','Vinegar','Garlic','Pepper','Cooking Oil'],                                                   tools:['pot','frying-pan'],                     steps:['Marinate chicken in soy sauce, vinegar, garlic, pepper for 15 mins.','Heat oil in pot, sauté garlic.','Add chicken with marinade.','Bring to boil, simmer 20 mins.','Uncover and cook until sauce reduces.','Serve over rice.'] },
    { id:26, name:'Adobong Baboy',           category:'Dinner',    emoji:'🥩', cookingTime:'35 mins', estimatedCost:'₱80–₱110',difficulty:'Easy',   image:'pork Adobo.jpg',          description:'Classic pork braised in vinegar, soy sauce and garlic.',    ingredients:['Pork','Soy Sauce','Vinegar','Garlic','Pepper','Cooking Oil'],                                                      tools:['pot'],                                  steps:['Combine pork, soy sauce, vinegar, garlic, pepper in pot.','Boil without stirring, simmer 20 minutes.','Uncover and fry in own fat until browned.','Serve with rice.'] },
    { id:27, name:'Sardinas con Kamatis',    category:'Lunch',     emoji:'🥫', cookingTime:'12 mins', estimatedCost:'₱25–₱35', difficulty:'Easy',   image:'sardinas kamatis.jpg',    description:'Sautéed sardines with tomatoes — budget ulam.',             ingredients:['Sardines (canned)','Tomato','Onion','Garlic','Cooking Oil','Salt','Pepper'],                                      tools:['frying-pan'],                           steps:['Sauté garlic, onion, and tomato in oil.','Add sardines (whole, with sauce).','Season with salt and pepper.','Cook 5 minutes, mashing lightly.','Serve hot with rice.'] },
    { id:28, name:'Pritong Tilapia',         category:'Dinner',    emoji:'🐟', cookingTime:'25 mins', estimatedCost:'₱55–₱75', difficulty:'Easy',   image:'pritong tilapia.jpg',     description:'Simply fried tilapia — crispy on the outside, tender inside.',ingredients:['Tilapia','Salt','Pepper','Garlic','Cooking Oil','Calamansi'],                                                         tools:['frying-pan'],                           steps:['Score tilapia flesh with knife.','Season with salt, pepper, calamansi juice.','Let sit 10 minutes.','Heat plenty of oil in pan.','Fry tilapia until golden and crispy on both sides.','Serve with spiced vinegar.'] },
    { id:29, name:'Sopas (Chicken Noodles)',  category:'Dinner',    emoji:'🍜', cookingTime:'30 mins', estimatedCost:'₱70–₱95', difficulty:'Easy',   image:'sopas.jpg',               description:'Creamy chicken noodle soup — rainy day comfort food.',      ingredients:['Chicken','Instant Noodles','Carrot','Cabbage','Onion','Garlic','Evaporated Milk','Salt','Pepper'],               tools:['pot'],                                  steps:['Boil chicken in 4 cups water with garlic and onion.','Remove chicken, shred. Keep broth.','Add noodles to broth.','Add carrot and cabbage, cook 5 mins.','Return chicken, add evaporated milk.','Season and simmer 3 mins.','Serve hot.'] },
    { id:30, name:'Ginisang Sitaw',          category:'Lunch',     emoji:'🫑', cookingTime:'15 mins', estimatedCost:'₱20–₱35', difficulty:'Easy',   image:'sitaw.jpg',               description:'Sautéed string beans in fish sauce and tomato.',            ingredients:['Sitaw (String Beans)','Garlic','Onion','Tomato','Cooking Oil','Fish Sauce (Patis)'],                              tools:['frying-pan'],                           steps:['Cut sitaw into 2-inch pieces.','Sauté garlic, onion, tomato in oil.','Add sitaw and toss.','Add a splash of water, cover.','Cook 8 minutes until tender.','Season with patis and serve.'] },
    { id:31, name:'Lugaw na May Itlog',      category:'Breakfast', emoji:'🥣', cookingTime:'30 mins', estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'lugaw.jpg',               description:'Filipino rice porridge topped with a soft egg.',             ingredients:['Rice','Ginger','Garlic','Onion','Egg','Fish Sauce (Patis)','Green Onion'],                                        tools:['pot','rice-cooker'],                    steps:['Sauté garlic, ginger, onion in oil in pot.','Add rice and stir 1 minute.','Pour 5 cups water, bring to boil.','Simmer 20–25 mins, stirring occasionally, until porridge consistency.','Season with patis.','Top with poached or fried egg and green onion.'] },
    { id:33, name:'Microwave Scrambled Egg', category:'Breakfast', emoji:'🥚', cookingTime:'3 mins',  estimatedCost:'₱10–₱18', difficulty:'Easy',   image:'microegg.jpg',            description:'Fastest breakfast — scrambled eggs in a mug.',              ingredients:['Egg','Salt','Pepper','Margarine / Butter','Evaporated Milk'],                                                     tools:['microwave'],                            steps:['Crack 2 eggs into a microwave-safe mug.','Add a splash of evaporated milk, salt, and pepper.','Beat with a fork.','Microwave 30 seconds, stir.','Microwave another 30 seconds, stir.','Heat in additional 15-second intervals until just set.','Serve on bread or rice.'] },
    { id:35, name:'Tortang Talong',          category:'Breakfast', emoji:'🍆', cookingTime:'20 mins', estimatedCost:'₱20–₱35', difficulty:'Easy',   image:'talong omellete.webp',    description:'Smoky eggplant omelette — a Filipino classic.',              ingredients:['Talong (Eggplant)','Egg','Garlic','Onion','Salt','Pepper','Cooking Oil'],                                         tools:['frying-pan','oven-toaster'],            steps:['Roast eggplant directly on flame or oven toaster until charred.','Peel off burnt skin, keep stem.','Flatten with fork.','Beat egg with garlic, onion, salt, pepper.','Dip eggplant into egg mixture.','Fry in oil until golden on both sides.','Serve with banana catsup.'] },
    { id:37, name:'Pork Sinigang (Simple)',  category:'Dinner',    emoji:'🍲', cookingTime:'35 mins', estimatedCost:'₱90–₱120',difficulty:'Medium', image:'pork sinigang.jpg',       description:'Sour tamarind pork soup — Filipino comfort food.',           ingredients:['Pork','Tomato','Onion','Kangkong','Sitaw (String Beans)','Salt','Calamansi'],                                     tools:['pot'],                                  steps:['Boil pork with onion and tomato in 5 cups water.','Simmer 25 minutes until pork is tender.','Add sitaw and cook 3 mins.','Add kangkong, season with salt.','Squeeze calamansi for sourness.','Serve hot with rice.'] },
    { id:38, name:'Monggo (Simple)',         category:'Dinner',    emoji:'🫘', cookingTime:'30 mins', estimatedCost:'₱25–₱40', difficulty:'Easy',   image:'Monggo.jpg',              description:'Mung bean soup — nutritious and filling.',                   ingredients:['Monggo Bean','Garlic','Onion','Tomato','Cooking Oil','Fish Sauce (Patis)'],                                       tools:['pot'],                                  steps:['Boil the Monggo bean until soft.','Heat oil, sauté garlic, onion, tomato.','Add the soft beans and stir.','Simmer 10 minutes.','Season with patis.','Serve over rice.'] },
    { id:39, name:'Hotdog and Egg Fry',      category:'Breakfast', emoji:'🍳', cookingTime:'8 mins',  estimatedCost:'₱22–₱35', difficulty:'Easy',   image:'hotegg.jpg',              description:'Pan-fried hotdogs and eggs — dorm breakfast MVP.',           ingredients:['Hotdog','Egg','Cooking Oil','Salt','Ketchup'],                                                                     tools:['frying-pan'],                           steps:['Slice hotdogs diagonally.','Fry in oil until charred on the outside.','Remove and fry eggs in same pan.','Plate together, season with salt.','Drizzle ketchup and serve with rice.'] },
    { id:40, name:'Creamy Tuna Pasta Hack',  category:'Lunch',     emoji:'🍜', cookingTime:'15 mins', estimatedCost:'₱28–₱40', difficulty:'Easy',   image:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', description:'Creamy instant noodle pasta with canned tuna.', ingredients:['Instant Noodles','Tuna (canned)','Evaporated Milk','Onion','Garlic','Cooking Oil'], tools:['pot'], steps:['Cook noodles without seasoning, drain.','Sauté garlic and onion, add tuna.','Pour evaporated milk, simmer 2 minutes.','Season with salt and pepper.','Toss in noodles and coat well.','Serve hot.'] },
    { id:41, name:'Ampalaya with Egg',       category:'Lunch',     emoji:'🥒', cookingTime:'12 mins', estimatedCost:'₱20–₱30', difficulty:'Easy',   image:'ampaegg.jpg',             description:'Bitter melon scrambled with eggs — acquired taste worth it.',ingredients:['Ampalaya (Bitter Melon)','Egg','Garlic','Onion','Salt','Cooking Oil'],                                              tools:['frying-pan'],                           steps:['Slice ampalaya thinly, rub with salt, squeeze out liquid.','Sauté garlic and onion.','Add ampalaya, cook 3 minutes.','Beat eggs and pour over ampalaya.','Stir until egg sets.','Serve with rice.'] },
    { id:42, name:'Corned Beef Omelette',    category:'Breakfast', emoji:'🥩', cookingTime:'12 mins', estimatedCost:'₱35–₱50', difficulty:'Easy',   image:'corned omelette.jpg',     description:'Corned beef folded into a golden omelette.',                ingredients:['Corned Beef (canned)','Egg','Onion','Garlic','Salt','Pepper','Cooking Oil'],                                      tools:['frying-pan'],                           steps:['Sauté garlic, onion, add corned beef.','Cook 3 minutes and let cool slightly.','Beat eggs, add corned beef mixture.','Heat oil, pour mixture in pan.','Cook until set, flip, cook other side.','Serve with rice.'] },
    { id:43, name:'Potato and Egg Salad',    category:'Snacks',    emoji:'🥗', cookingTime:'20 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'potato salad.jpg',        description:'Simple buttered potato and egg salad.',                     ingredients:['Potato','Egg','Onion','Salt','Pepper','Margarine / Butter'],                                                      tools:['pot'],                                  steps:['Boil potatoes until fork-tender, peel and cube.','Hard boil eggs, peel and chop.','Mix potato, egg, diced onion.','Add melted butter, salt, and pepper.','Mix gently and serve.'] },
    { id:44, name:'Arroz Caldo sa Rice Cooker',category:'Breakfast',emoji:'🍲',cookingTime:'25 mins',estimatedCost:'₱10–₱20', difficulty:'Easy',   image:'arozcaldo rice cooker.jpg',description:'No-stir lugaw made entirely in a rice cooker.',           ingredients:['Rice','Ginger','Garlic','Fish Sauce (Patis)','Green Onion','Salt'],                                               tools:['rice-cooker'],                          steps:['Rinse rice and add to rice cooker.','Add 3x normal water (for porridge).','Add grated ginger, garlic.','Cook on normal setting.','Once done, stir, season with patis.','Serve topped with green onion.'] },
    { id:46, name:'Pork Adobo Flakes',       category:'Dinner',    emoji:'🥩', cookingTime:'45 mins', estimatedCost:'₱80–₱110',difficulty:'Medium', image:'pork adobo flakes.webp',  description:'Crispy shredded pork adobo — great over garlic rice.',      ingredients:['Pork','Soy Sauce','Vinegar','Garlic','Pepper','Cooking Oil'],                                                      tools:['pot','frying-pan'],                     steps:['Cook pork adobo until very tender.','Remove pork, shred into small pieces.','Fry shredded pork in oil until crispy.','Mix with remaining sauce.','Serve as topping over garlic rice.'] },
    { id:47, name:'Ginataang Kamote',        category:'Snacks',    emoji:'🍠', cookingTime:'20 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'ginataang kamote.jpg',    description:'Sweet potato in coconut milk — simple Filipino dessert.',   ingredients:['Kamote (Sweet Potato)','Coconut Milk (canned)','Sugar','Salt'],                                                    tools:['pot'],                                  steps:['Peel and cube kamote.','Pour coconut milk into pot, add kamote.','Add sugar and a pinch of salt.','Bring to simmer, cook 15 minutes until kamote is tender.','Serve as dessert or snack.'] },
    { id:48, name:'Sautéed Squid Balls',     category:'Snacks',    emoji:'🦑', cookingTime:'10 mins', estimatedCost:'₱20–₱35', difficulty:'Easy',   image:'sautéed squid balls.jpg', description:'Garlicky squid balls with calamansi dipping sauce.',        ingredients:['Squid Ball','Garlic','Onion','Soy Sauce','Chili / Siling Labuyo','Cooking Oil','Calamansi'],                     tools:['frying-pan'],                           steps:['Fry squid balls in oil until golden, set aside.','In same pan, sauté garlic and onion.','Add chili and soy sauce.','Return squid balls, toss.','Squeeze calamansi and serve.'] },
    { id:50, name:'Ensaladang Kamatis',      category:'Snacks',    emoji:'🍅', cookingTime:'5 mins',  estimatedCost:'₱12–₱20', difficulty:'Easy',   image:'ensaladang kamatis at sibuyas.jpg',description:'Chilled tomato and onion salad — best sawsawan.',      ingredients:['Tomato','Onion','Fish Sauce (Patis)','Calamansi','Salt','Chili / Siling Labuyo'],                                tools:['knife'],                                steps:['Slice tomatoes and onions thinly.','Combine in a bowl.','Mix patis, calamansi juice, and chili for dressing.','Pour dressing over vegetables.','Toss gently and serve.','Best eaten with fried fish.'] },
    { id:52, name:'Peanut Butter Rice',      category:'Lunch',     emoji:'🥜', cookingTime:'15 mins', estimatedCost:'₱18–₱28', difficulty:'Easy',   image:'peanut butter rice.webp', description:'Savory peanut butter sauce over garlic rice — surprisingly good!',ingredients:['Rice','Peanut Butter','Soy Sauce','Garlic','Onion','Cooking Oil'],                                          tools:['frying-pan','rice-cooker'],             steps:['Cook rice.','Sauté garlic and onion.','Mix peanut butter with warm water to loosen.','Add soy sauce and simmer sauce 2 minutes.','Pour sauce over rice.','Serve as an affordable and filling meal.'] },
    { id:53, name:'Instant Carbonara Hack',  category:'Lunch',     emoji:'🍝', cookingTime:'10 mins', estimatedCost:'₱18–₱28', difficulty:'Easy',   image:'instant noodle upgrade.jpg',description:'Creamy carbonara-style instant noodles.',                 ingredients:['Instant Noodles','Egg','Evaporated Milk','Garlic','Margarine / Butter'],                                          tools:['pot'],                                  steps:['Cook noodles, drain but reserve 2 tbsp water.','Melt butter, sauté garlic.','Beat egg with evaporated milk.','Remove pan from heat, add noodles.','Pour egg-milk mixture and toss quickly so egg doesn\'t curdle.','Serve immediately.'] },
    { id:55, name:'Chicken Adobo sa Rice Cooker',category:'Dinner',emoji:'🍗',cookingTime:'30 mins',estimatedCost:'₱75–₱100',difficulty:'Easy',    image:'chicken adobo rice cooker.webp',description:'Hands-off chicken adobo made in the rice cooker.',      ingredients:['Chicken','Soy Sauce','Vinegar','Garlic','Pepper'],                                                                 tools:['rice-cooker'],                          steps:['Place chicken in rice cooker.','Add soy sauce, vinegar, garlic, and pepper.','Mix to coat.','Turn on rice cooker (cook setting).','Let it cycle twice for thorough cooking.','Serve with steamed rice.'] },
    { id:56, name:'Champorado',              category:'Breakfast', emoji:'🍫', cookingTime:'20 mins', estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'champorado.jpg',          description:'Sweet chocolate rice porridge — rainy morning comfort.',     ingredients:['Rice','Condensed Milk','Sugar','Salt','Evaporated Milk'],                                                          tools:['pot'],                                  steps:['Cook rice in 4 cups water until very soft and thick.','Add sugar and a pinch of salt.','Stir in condensed milk.','Cook until creamy.','Serve topped with evaporated milk.','Eat as breakfast or merienda.'] },
    { id:57, name:'Sinigang na Sardinas',    category:'Dinner',    emoji:'🐟', cookingTime:'15 mins', estimatedCost:'₱25–₱40', difficulty:'Easy',   image:'Sinigang Sardinas.jpg',   description:'Budget sinigang using canned sardines.',                    ingredients:['Sardines (canned)','Tomato','Onion','Kangkong','Sitaw (String Beans)','Calamansi','Salt'],                        tools:['pot'],                                  steps:['Pour sardines with sauce into pot, add 3 cups water.','Add tomato, onion.','Bring to boil, simmer 5 minutes.','Add sitaw and kangkong.','Squeeze calamansi generously.','Season with salt and serve.'] },
    { id:59, name:'Milanesa (Breaded Pork)', category:'Dinner',    emoji:'🥩', cookingTime:'20 mins', estimatedCost:'₱60–₱85', difficulty:'Easy',   image:'milanesa bread.jpeg',     description:'Crispy breaded pork chop — budget schnitzel.',               ingredients:['Pork','Egg','Bread Crumbs','Garlic','Salt','Pepper','Cooking Oil'],                                               tools:['frying-pan'],                           steps:['Pound pork slices thin.','Season with garlic, salt, and pepper.','Dip in beaten egg, then breadcrumbs.','Fry in hot oil until golden brown on both sides.','Drain on paper towel.','Serve with rice and ketchup.'] },
    { id:63, name:'Arroz con Leche',         category:'Snacks',    emoji:'🍮', cookingTime:'25 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'arroz con leche.jpg',     description:'Creamy milk rice dessert — Filipino-Spanish classic.',       ingredients:['Rice','Condensed Milk','Evaporated Milk','Sugar','Salt'],                                                          tools:['pot'],                                  steps:['Cook rice in 3 cups water until very soft.','Pour evaporated milk, stir.','Add condensed milk and sugar to taste.','Cook on low heat until thick and creamy.','Serve warm or chilled.'] },
    { id:64, name:'Inihaw na Bangus (Oven)', category:'Dinner',    emoji:'🐟', cookingTime:'30 mins', estimatedCost:'₱60–₱85', difficulty:'Easy',   image:'inihaw na bangus.jpg',    description:'Stuffed grilled milkfish baked in oven toaster.',            ingredients:['Bangus (Milkfish)','Tomato','Onion','Garlic','Salt','Pepper','Calamansi'],                                        tools:['oven-toaster','knife'],                 steps:['Open butterfly the bangus.','Stuff with sliced tomato, onion, garlic.','Season with salt, pepper, calamansi juice.','Wrap in foil.','Bake in oven toaster at 200°C for 20–25 minutes.','Serve with rice and spiced vinegar.'] },
    { id:67, name:'Ginisang Sayote',         category:'Dinner',    emoji:'🥦', cookingTime:'15 mins', estimatedCost:'₱45–₱65', difficulty:'Easy',   image:'ginisang sayote.jpg',     description:'Sayote and pork stir-fry — affordable and healthy.',        ingredients:['Sayote','Garlic','Onion','Pork','Fish Sauce (Patis)','Cooking Oil'],                                              tools:['frying-pan'],                           steps:['Peel and slice sayote thinly.','Sauté garlic and onion.','Add pork strips, cook until browned.','Add sayote, stir-fry 5 minutes.','Season with patis.','Serve with rice.'] },
    { id:68, name:'Spam Sandwich',           category:'Breakfast', emoji:'🥪', cookingTime:'10 mins', estimatedCost:'₱45–₱65', difficulty:'Easy',   image:'spam sandwich.jpg',       description:'Crispy SPAM, egg, and ketchup on toasted bread.',            ingredients:['Spam','Bread','Margarine / Butter','Ketchup','Egg'],                                                               tools:['frying-pan','oven-toaster'],            steps:['Slice Spam and fry until crispy.','Toast bread in oven toaster.','Fry egg sunny side up.','Spread margarine on toast.','Layer Spam, egg, and ketchup.','Close sandwich and serve.'] },
    { id:69, name:'Oatmeal with Condensed Milk',category:'Breakfast',emoji:'🥣',cookingTime:'5 mins',estimatedCost:'₱15–₱22',difficulty:'Easy',    image:'oatmeal with condensed milk.jpg',description:'Quick oatmeal drizzled with condensed milk.',           ingredients:['Instant Oatmeal','Condensed Milk','Sugar','Salt'],                                                                 tools:['microwave','kettle'],                   steps:['Boil water in kettle.','Place oatmeal in bowl.','Pour hot water and stir.','Let sit 2 minutes.','Add condensed milk and a pinch of salt.','Eat as breakfast.'] },
    { id:71, name:'Pork Menudo (Budget)',    category:'Dinner',    emoji:'🥘', cookingTime:'35 mins', estimatedCost:'₱90–₱120',difficulty:'Easy',   image:'pork menudo.jpg',         description:'Pork and potato in tomato sauce — budget menudo.',          ingredients:['Pork','Potato','Carrot','Tomato Sauce (canned)','Garlic','Onion','Cooking Oil','Salt'],                           tools:['pot'],                                  steps:['Sauté garlic and onion.','Add pork, cook until brown.','Add potato and carrot cubes.','Pour tomato sauce and ½ cup water.','Simmer 20 minutes until vegetables are tender.','Season with salt and serve.'] },
    { id:72, name:'Ginataang Mais',          category:'Snacks',    emoji:'🌽', cookingTime:'25 mins', estimatedCost:'₱28–₱38', difficulty:'Easy',   image:'ginataang mais.jpg',      description:'Sweet corn rice pudding in coconut milk.',                  ingredients:['Coconut Milk (canned)','Sugar','Rice','Salt'],                                                                     tools:['pot'],                                  steps:['Combine coconut milk, a cup of water, and rice in pot.','Cook over medium heat, stirring often.','Add sugar and salt.','Cook until rice is tender and mixture is creamy.','Serve as dessert or merienda.'] },
    { id:75, name:'Chili Garlic Fried Egg',  category:'Breakfast', emoji:'🍳', cookingTime:'6 mins',  estimatedCost:'₱10–₱18', difficulty:'Easy',   image:'chili garlic fried ggg.jpg',description:'Crispy garlic and chili fried egg basted in hot oil.',    ingredients:['Egg','Garlic','Chili / Siling Labuyo','Cooking Oil','Soy Sauce'],                                                 tools:['frying-pan'],                           steps:['Heat generous oil in pan.','Add sliced garlic and chili, fry until crispy.','Push aside, crack egg in hot oil.','Baste egg with hot oil using a spoon.','Drizzle soy sauce.','Serve on rice.'] },
    { id:76, name:'Instant Noodle Stir-fry', category:'Lunch',     emoji:'🍜', cookingTime:'10 mins', estimatedCost:'₱15–₱22', difficulty:'Easy',   image:'instant noodle Stir fry.jpg',description:'Dry stir-fried instant noodles with egg and cabbage.',  ingredients:['Instant Noodles','Egg','Cabbage','Garlic','Soy Sauce','Cooking Oil'],                                              tools:['frying-pan'],                           steps:['Soak noodles briefly in boiled water, drain.','Heat oil, fry garlic.','Add cabbage, stir-fry.','Scramble in the egg.','Add noodles and soy sauce.','Toss everything together and serve dry.'] },
    { id:82, name:'Nilagang Manok',          category:'Dinner',    emoji:'🍗', cookingTime:'35 mins', estimatedCost:'₱80–₱105',difficulty:'Easy',   image:'Nilagang Manok.jpg',      description:'Boiled chicken soup with potatoes and cabbage.',            ingredients:['Chicken','Potato','Cabbage','Onion','Salt','Pepper','Fish Sauce (Patis)'],                                         tools:['pot'],                                  steps:['Boil chicken with onion in 5 cups water.','Simmer 20 minutes.','Add potato cubes, cook 10 minutes.','Add cabbage.','Season with patis and pepper.','Serve hot.'] },
    { id:83, name:'Crispy Tuna Patties',     category:'Lunch',     emoji:'🐟', cookingTime:'15 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'crispy tuna patties.jpg', description:'Golden fried tuna cakes with garlic and egg binder.',       ingredients:['Tuna (canned)','Egg','Onion','Garlic','Flour','Salt','Pepper','Cooking Oil'],                                     tools:['frying-pan'],                           steps:['Drain tuna and mash.','Mix with beaten egg, minced onion, garlic, flour, salt, and pepper.','Form into small patties.','Fry in oil until golden on both sides.','Serve with ketchup and rice.'] },
    { id:84, name:'Chicken Inasal Style',    category:'Dinner',    emoji:'🍗', cookingTime:'35 mins', estimatedCost:'₱75–₱100',difficulty:'Easy',   image:'chicken inasal style.jpg',description:'Pan-fried chicken inasal with calamansi and vinegar.',     ingredients:['Chicken','Garlic','Onion','Calamansi','Cooking Oil','Salt','Pepper','Vinegar'],                                    tools:['frying-pan'],                           steps:['Marinate chicken in calamansi, vinegar, garlic, salt, pepper for 20 minutes.','Heat oil in pan.','Fry chicken on medium heat, covered, 10 minutes each side.','Brush with oil halfway.','Cook until fully done and slightly charred.','Serve with rice and spiced vinegar.'] },
    { id:85, name:'Sinigang na Tuna',        category:'Dinner',    emoji:'🍲', cookingTime:'12 mins', estimatedCost:'₱28–₱42', difficulty:'Easy',   image:'sinigang na tuna.jpg',    description:'Quick sour tuna soup using canned tuna.',                   ingredients:['Tuna (canned)','Tomato','Onion','Kangkong','Salt','Fish Sauce (Patis)','Calamansi'],                               tools:['pot'],                                  steps:['Pour 3 cups water into pot.','Add tomato and onion, boil.','Add tuna (with oil).','Squeeze calamansi generously for sourness.','Add kangkong.','Season with patis and salt.','Serve with rice.'] },
    { id:87, name:'Chicken Afritada',        category:'Dinner',    emoji:'🍗', cookingTime:'35 mins', estimatedCost:'₱85–₱110',difficulty:'Easy',   image:'chicken afritada.jpg',    description:'Chicken braised in tomato sauce with potatoes and carrots.',ingredients:['Chicken','Tomato Sauce (canned)','Potato','Carrot','Garlic','Onion','Cooking Oil'],                                 tools:['pot'],                                  steps:['Sauté garlic and onion.','Brown chicken pieces.','Add tomato sauce and ½ cup water.','Simmer 15 minutes.','Add potato and carrot, cook 10 more minutes.','Season with salt and serve.'] },
    { id:88, name:'Rice Cooker Chicken',     category:'Dinner',    emoji:'🍗', cookingTime:'30 mins', estimatedCost:'₱70–₱95', difficulty:'Easy',   image:'steamed rice cooker chicken.jpg',description:'Steamed chicken cooked directly in the rice cooker.',  ingredients:['Chicken','Ginger','Garlic','Soy Sauce','Salt','Pepper'],                                                           tools:['rice-cooker'],                          steps:['Season chicken with soy sauce, garlic, ginger, salt, pepper.','Marinate 15 minutes.','Place in rice cooker, no water needed.','Cook on cook setting.','Turn once halfway.','Serve with rice and sauce from pot.'] },
    { id:90, name:'Egg Drop Soup',           category:'Dinner',    emoji:'🥣', cookingTime:'8 mins',  estimatedCost:'₱12–₱20', difficulty:'Easy',   image:'egg drop soup.jpg',       description:'Light Chinese-style egg drop soup — warm and quick.',        ingredients:['Egg','Green Onion','Garlic','Soy Sauce','Salt','Pepper'],                                                          tools:['pot'],                                  steps:['Boil 3 cups water in pot.','Add garlic, soy sauce, salt, and pepper.','Beat eggs separately.','Pour beaten eggs slowly into boiling soup while stirring.','Add green onion.','Serve immediately.'] },
    { id:95, name:'Homemade Pork Tocino',    category:'Breakfast', emoji:'🍖', cookingTime:'20 mins', estimatedCost:'₱60–₱80', difficulty:'Easy',   image:'pork tocino style.webp',  description:'DIY cured pork — cheaper than store-bought tocino.',         ingredients:['Pork','Sugar','Salt','Garlic','Soy Sauce','Cooking Oil'],                                                          tools:['frying-pan'],                           steps:['Slice pork thinly.','Marinate in sugar, salt, garlic, and soy sauce overnight (or at least 1 hour).','Cook in a little water first until water evaporates.','Fry in own fat until caramelized.','Serve with garlic rice and egg.'] },
    { id:98, name:'Pork and Potato Hash',    category:'Dinner',    emoji:'🥘', cookingTime:'20 mins', estimatedCost:'₱65–₱85', difficulty:'Easy',   image:'pork and potato hash.jpg',description:'Diced pork and potato pan hash — hearty and filling.',     ingredients:['Pork','Potato','Onion','Garlic','Soy Sauce','Cooking Oil','Salt','Pepper'],                                       tools:['frying-pan'],                           steps:['Dice pork and potato into small cubes.','Boil potato briefly (3 mins), drain.','Fry pork until browned.','Add onion and garlic, sauté.','Add potato, fry until golden.','Season with soy sauce, salt, pepper.','Serve with fried egg and rice.'] },
    { id:99, name:'Egg in Coconut Milk',     category:'Breakfast', emoji:'🥚', cookingTime:'10 mins', estimatedCost:'₱22–₱35', difficulty:'Easy',   image:'egg coconut.jpg',         description:'Eggs poached in spiced coconut milk — creamy and unique.',  ingredients:['Egg','Coconut Milk (canned)','Garlic','Salt','Chili / Siling Labuyo'],                                            tools:['frying-pan'],                           steps:['Heat coconut milk in pan over medium.','Add garlic and chili.','Crack eggs directly into the simmering coconut milk.','Cover and cook until eggs are set.','Season with salt.','Serve over rice.'] },
    { id:100,name:'Filipino French Toast',   category:'Breakfast', emoji:'🍞', cookingTime:'10 mins', estimatedCost:'₱15–₱25', difficulty:'Easy',   image:'filipino french toast.jpg',description:'Monay-style French toast with banana catsup.',            ingredients:['Bread','Egg','Evaporated Milk','Sugar','Margarine / Butter','Banana Catsup'],                                      tools:['frying-pan'],                           steps:['Beat egg with evaporated milk and a pinch of sugar.','Dip bread slices in the mixture, coating both sides.','Melt butter in pan over medium heat.','Fry soaked bread until golden on both sides.','Serve with banana catsup or condensed milk.','Enjoy as merienda or breakfast.'] },
    { id:103,name:'Pinakbet',                category:'Lunch',     emoji:'🥗', cookingTime:'20 mins', estimatedCost:'₱45–₱65', difficulty:'Easy',   image:'pinakbet.webp',           description:'Classic vegetable medley in fish sauce — Filipino must-try.',ingredients:['Sitaw (String Beans)','Ampalaya (Bitter Melon)','Talong (Eggplant)','Garlic','Onion','Tomato','Cooking Oil','Fish Sauce (Patis)'], tools:['pot'], steps:['Sauté garlic, onion, and tomato in oil.','Add all vegetables and toss.','Season with patis.','Add ¼ cup water, cover and cook 10 minutes.','Do not over-stir to keep vegetables intact.','Serve with rice.'] },
    { id:104,name:'Chopsuey',                category:'Lunch',     emoji:'🥦', cookingTime:'15 mins', estimatedCost:'₱35–₱55', difficulty:'Easy',   image:'chopsuey.jpg',            description:'Filipino-Chinese mixed vegetables in oyster sauce.',         ingredients:['Cabbage','Carrot','Sitaw (String Beans)','Egg','Garlic','Onion','Oyster Sauce','Cooking Oil'],                    tools:['frying-pan'],                           steps:['Heat oil, sauté garlic and onion.','Add carrot and sitaw, stir-fry 3 minutes.','Add cabbage and toss.','Add oyster sauce and ¼ cup water.','Crack egg in center and scramble into veggies.','Season with salt, serve with rice.'] },
    { id:105,name:'Paksiw na Bangus',        category:'Lunch',     emoji:'🐟', cookingTime:'20 mins', estimatedCost:'₱55–₱75', difficulty:'Easy',   image:'paksiw na bangus.jpg',    description:'Bangus braised in vinegar and ginger — tangy and savory.',  ingredients:['Bangus (Milkfish)','Vinegar','Garlic','Ginger','Salt','Pepper'],                                                   tools:['pot'],                                  steps:['Place fish in pot.','Add vinegar, garlic, ginger, salt, and pepper.','Add ½ cup water.','Bring to boil without stirring.','Simmer 15 minutes until fish is cooked.','Serve with rice.'] },
    { id:106,name:'Daing na Bangus',         category:'Breakfast', emoji:'🐟', cookingTime:'20 mins', estimatedCost:'₱60–₱85', difficulty:'Easy',   image:'daing na bangus.jpg',     description:'Vinegar-marinated fried milkfish — classic Filipino breakfast.',ingredients:['Bangus (Milkfish)','Vinegar','Garlic','Salt','Pepper','Cooking Oil'],                                            tools:['frying-pan'],                           steps:['Butterfly the bangus, marinate in vinegar, garlic, salt, pepper overnight or 1 hour.','Heat generous oil in pan.','Fry bangus belly-side down first until golden.','Flip and fry other side.','Serve with garlic rice, egg, and tomatoes.'] },
    { id:108,name:'Canned Tuna with Sayote', category:'Lunch',     emoji:'🥦', cookingTime:'12 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'tuna sayote.jpg',         description:'Tuna and sayote stir-fry — cheap, filling, nutritious.',    ingredients:['Tuna (canned)','Sayote','Garlic','Onion','Soy Sauce','Cooking Oil'],                                               tools:['frying-pan'],                           steps:['Peel and slice sayote into thin strips.','Sauté garlic and onion.','Add sayote, cook 4 minutes.','Add drained tuna and soy sauce.','Stir and cook 3 more minutes.','Serve over rice.'] },
    { id:113,name:'Corned Beef with Cabbage',category:'Lunch',     emoji:'🥩', cookingTime:'10 mins', estimatedCost:'₱40–₱55', difficulty:'Easy',   image:'corned beef cabbage.jpg', description:'Quick corned beef and cabbage stir-fry.',                   ingredients:['Corned Beef (canned)','Cabbage','Garlic','Onion','Soy Sauce','Cooking Oil'],                                      tools:['frying-pan'],                           steps:['Sauté garlic and onion until soft.','Add corned beef, break apart and cook 3 minutes.','Add shredded cabbage and toss on high heat.','Drizzle soy sauce.','Cook until cabbage is tender.','Serve with rice.'] },
    { id:114,name:'Ginataang Manok',         category:'Dinner',    emoji:'🍗', cookingTime:'30 mins', estimatedCost:'₱90–₱120',difficulty:'Easy',   image:'ginataang manok.jpg',     description:'Chicken braised in spiced coconut milk — rich and creamy.',  ingredients:['Chicken','Coconut Milk (canned)','Garlic','Ginger','Onion','Chili / Siling Labuyo','Fish Sauce (Patis)'],        tools:['pot'],                                  steps:['Sauté garlic, ginger, onion.','Add chicken pieces, cook until white.','Pour coconut milk and add chili.','Simmer until cooked.','Season with patis.','Cook until sauce thickens slightly.','Serve with rice.'] },
    { id:115,name:'Spicy Tuna Rice Bowl',    category:'Lunch',     emoji:'🌶️', cookingTime:'12 mins', estimatedCost:'₱28–₱40', difficulty:'Easy',   image:'spicy tuna rice bowl.jpg',description:'Tuna sautéed with chili and soy sauce over hot rice.',      ingredients:['Tuna (canned)','Rice','Chili / Siling Labuyo','Garlic','Soy Sauce','Calamansi','Onion'],                         tools:['frying-pan','rice-cooker'],             steps:['Cook rice.','Drain tuna.','Sauté garlic, onion, and chili.','Add tuna, season with soy sauce and calamansi.','Cook 3 minutes, stirring.','Serve over rice.'] },
    { id:121,name:'Adobong Kangkong',        category:'Lunch',     emoji:'🌿', cookingTime:'5 mins',  estimatedCost:'₱15–₱22', difficulty:'Easy',   image:'adobong kangkong.jpg',    description:'Kangkong cooked in soy-vinegar — quick and punchy.',         ingredients:['Kangkong','Garlic','Soy Sauce','Vinegar','Cooking Oil','Pepper'],                                                  tools:['frying-pan'],                           steps:['Heat oil and fry garlic until golden.','Add kangkong stems first, then leaves.','Pour soy sauce and vinegar.','Toss quickly over high heat.','Season with pepper.','Serve immediately — do not overcook.'] },
    { id:130,name:'Pork Salpicao',           category:'Dinner',    emoji:'🥩', cookingTime:'20 mins', estimatedCost:'₱65–₱88', difficulty:'Easy',   image:'pork salpicao.jpg',       description:'Seared pork in garlic butter and oyster sauce.',             ingredients:['Pork','Garlic','Soy Sauce','Oyster Sauce','Cooking Oil','Pepper'],                                                 tools:['frying-pan'],                           steps:['Cube pork into bite-sized pieces.','Marinate in soy sauce, oyster sauce, pepper 15 mins.','Heat oil in pan on very high heat.','Add garlic, fry until golden and crispy.','Add pork, sear quickly until cooked through.','Serve on rice with garlic oil drizzle.'] },
    { id:135,name:'Pork Hamonado',           category:'Dinner',    emoji:'🍖', cookingTime:'25 mins', estimatedCost:'₱65–₱90', difficulty:'Easy',   image:'pork hamonado.jpg',       description:'Pork in sweet condensed milk sauce — sweet and savory.',    ingredients:['Pork','Condensed Milk','Soy Sauce','Garlic','Cooking Oil','Salt','Pepper'],                                       tools:['frying-pan'],                           steps:['Slice pork thinly.','Marinate in soy sauce, garlic 20 minutes.','Fry pork until browned.','Pour condensed milk over pork.','Simmer until sauce caramelizes and thickens.','Season and serve with rice.'] },
    { id:138,name:'Pork Humba',              category:'Dinner',    emoji:'🥩', cookingTime:'40 mins', estimatedCost:'₱75–₱100',difficulty:'Medium', image:'pork humba.jpg',          description:'Sweet braised pork Visayan style — sticky and tender.',     ingredients:['Pork','Soy Sauce','Vinegar','Sugar','Garlic','Cooking Oil','Pepper'],                                              tools:['pot'],                                  steps:['Brown pork pieces in oil.','Add soy sauce, vinegar, garlic, and pepper.','Add ½ cup water and sugar.','Simmer 30 minutes until sauce thickens.','The pork should be tender and caramelized.','Serve with rice.'] },
    { id:151,name:'Ginataang Sitaw at Kalabasa',category:'Dinner', emoji:'🍲', cookingTime:'15 mins', estimatedCost:'₱30–₱45', difficulty:'Easy',   image:'ginataang sitaw.jpg',     description:'String beans and squash in coconut milk.',                  ingredients:['Sitaw (String Beans)','Kalabasa','Coconut Milk (canned)','Garlic','Onion','Ginger','Fish Sauce (Patis)','Salt'], tools:['pot'],                                  steps:['Sauté garlic, ginger, onion.','Add kalabasa, stir-fry 2 minutes.','Add the sitaw.','Pour coconut milk.','Simmer 10 minutes until sitaw is tender.','Season with patis and salt.','Serve with rice.'] },
    { id:152,name:'Fried Rice with Vegetables',category:'Lunch',   emoji:'🍚', cookingTime:'12 mins', estimatedCost:'₱18–₱30', difficulty:'Easy',   image:'fried rice vegetables.jpg',description:'Mixed vegetable fried rice — great use for leftover rice.',ingredients:['Rice','Carrot','Cabbage','Egg','Garlic','Soy Sauce','Cooking Oil'],                                             tools:['frying-pan'],                           steps:['Sauté garlic in oil.','Add diced carrot, stir-fry 2 minutes.','Add shredded cabbage, toss.','Add cold rice, stir-fry on high.','Drizzle soy sauce, push aside and scramble egg.','Mix everything and serve.'] },
    { id:160,name:'Hainanese Chicken Rice',  category:'Dinner',    emoji:'🍗', cookingTime:'30 mins', estimatedCost:'₱70–₱95', difficulty:'Easy',   image:'hainanese style chicken rice.jpg',description:'One-pot Hainanese-style chicken cooked over rice.',     ingredients:['Chicken','Rice','Ginger','Garlic','Salt','Soy Sauce','Green Onion'],                                               tools:['rice-cooker'],                          steps:['Season chicken with salt, ginger, garlic.','Place chicken on top of washed rice in rice cooker.','Add normal amount of water.','Cook on normal setting.','Remove chicken, slice.','Serve chicken over flavored rice with soy sauce and green onion.'] },
    { id:172,name:'Chicken Adobo Dry Style', category:'Dinner',    emoji:'🍗', cookingTime:'25 mins', estimatedCost:'₱70–₱92', difficulty:'Easy',   image:'chicken adobo dry.jpg',   description:'Reduced chicken adobo — sticky, glossy, and intense.',      ingredients:['Chicken','Soy Sauce','Vinegar','Garlic','Onion','Pepper','Cooking Oil'],                                           tools:['frying-pan'],                           steps:['Cut chicken into small pieces.','Marinate in soy sauce, vinegar, garlic, pepper 15 minutes.','Heat oil, sauté onion.','Add chicken with marinade.','Cook until liquid reduces and chicken is glossy.','Serve over rice.'] },
    { id:175,name:'Longganisa Fried Rice',   category:'Breakfast', emoji:'🌭', cookingTime:'12 mins', estimatedCost:'₱35–₱50', difficulty:'Easy',   image:'longganisa fried rice.jpg',description:'Crumbled longganisa meat stir-fried into garlic rice.',    ingredients:['Longganisa','Rice','Garlic','Egg','Soy Sauce','Cooking Oil'],                                                      tools:['frying-pan'],                           steps:['Remove longganisa casing, crumble meat.','Fry longganisa in oil until cooked and slightly crispy.','Add garlic, fry golden.','Add cold rice, stir-fry.','Scramble egg in.','Drizzle soy sauce, mix and serve.'] },
    { id:177,name:'Corned Beef Hash Bowl',   category:'Breakfast', emoji:'🥘', cookingTime:'18 mins', estimatedCost:'₱45–₱60', difficulty:'Easy',   image:'corned beef hash bowl.jpg',description:'Crispy corned beef and potato hash topped with a fried egg.',ingredients:['Corned Beef (canned)','Potato','Onion','Egg','Cooking Oil','Salt','Pepper'],                                     tools:['frying-pan'],                           steps:['Dice and fry potato until golden.','Add diced onion, sauté.','Add corned beef, break apart.','Fry until crispy bits form.','Top with a fried egg.','Season and serve over rice.'] },
    { id:180,name:'Ginisang Talong with Egg',category:'Lunch',     emoji:'🍆', cookingTime:'15 mins', estimatedCost:'₱18–₱28', difficulty:'Easy',   image:'ginisang talong.jpg',     description:'Sautéed eggplant scrambled with egg and tomato.',           ingredients:['Talong (Eggplant)','Egg','Garlic','Onion','Tomato','Fish Sauce (Patis)','Cooking Oil'],                           tools:['frying-pan'],                           steps:['Slice eggplant into rounds.','Sauté garlic, onion, tomato.','Add the eggplant, add patis.','Add the beaten egg.','Stir gently until cooked.','Serve with rice.'] },
    { id:187,name:'Pinoy Egg Salad Sandwich',category:'Snacks',    emoji:'🥪', cookingTime:'15 mins', estimatedCost:'₱18–₱28', difficulty:'Easy',   image:'egg salad sandwich.jpg',  description:'Sweet and creamy Filipino egg salad on toasted bread.',     ingredients:['Egg','Bread','Margarine / Butter','Sugar','Salt','Condensed Milk'],                                                tools:['pot','knife'],                          steps:['Hard-boil eggs, peel and mash.','Mix with condensed milk, a pinch of sugar and salt.','Toast bread.','Spread butter on toast.','Pile egg salad on bread.','Close and serve.'] },
    { id:196,name:'Ginataang Langka',        category:'Dinner',    emoji:'🫙', cookingTime:'25 mins', estimatedCost:'₱70–₱95', difficulty:'Easy',   image:'Ginataang Langka.jpg',    description:'Young jackfruit braised in coconut milk with pork.',         ingredients:['Langka(hilaw)','Coconut Milk (canned)','Pork','Garlic','Onion','Ginger','Fish Sauce (Patis)','Chili / Siling Labuyo'],tools:['pot'],                             steps:['Sauté garlic, ginger, onion.','Brown pork.','Add langka and chili.','Pour coconut milk.','Simmer 15 minutes until langka is cooked.','Season with patis and serve.'] },
    { id:197,name:'Tuna and Pechay Stir-fry',category:'Lunch',     emoji:'🐟', cookingTime:'8 mins',  estimatedCost:'₱28–₱40', difficulty:'Easy',   image:'tuna pechay.jpg',         description:'Quick tuna and pechay in oyster sauce.',                    ingredients:['Tuna (canned)','Pechay','Garlic','Oyster Sauce','Soy Sauce','Cooking Oil'],                                        tools:['frying-pan'],                           steps:['Heat oil, sauté garlic.','Add drained tuna, cook 2 minutes.','Add pechay and toss.','Season with oyster sauce and soy sauce.','Cook 2 more minutes.','Serve over rice.'] },
    { id:193,name:'Pechay at Corned Beef',   category:'Lunch',     emoji:'🥬', cookingTime:'8 mins',  estimatedCost:'₱38–₱52', difficulty:'Easy',   image:'pechay corned beef.jpg',  description:'Quick corned beef and pechay stir-fry — 5 ingredients.',    ingredients:['Pechay','Corned Beef (canned)','Garlic','Onion','Soy Sauce','Cooking Oil'],                                        tools:['frying-pan'],                           steps:['Sauté garlic and onion.','Add corned beef, break apart.','Add pechay and toss.','Season with soy sauce.','Cook until pechay is wilted.','Serve with rice.'] },
    { id:170,name:'Budget Sopas (Macaroni)', category:'Dinner',    emoji:'🍜', cookingTime:'15 mins', estimatedCost:'₱25–₱38', difficulty:'Easy',   image:'budget sopas macaroni.jpg',description:'Creamy macaroni soup using instant noodles and evaporated milk.',ingredients:['Instant Noodles','Evaporated Milk','Carrot','Cabbage','Garlic','Onion','Salt','Pepper'],                      tools:['pot'],                                  steps:['Sauté garlic and onion in oil.','Add carrot and cabbage.','Pour 3 cups water, bring to boil.','Add broken noodles (as macaroni substitute).','Cook 3 minutes, add evaporated milk.','Season with salt and pepper, serve hot.'] },
  ];

  filteredRecipes = [...allRecipes];
  // Remove skeleton, show list
  document.getElementById('skeleton-list')?.classList.add('hidden');
  document.getElementById('recipes-container')?.classList.remove('hidden');
  renderRecipeList(allRecipes, false);
  pickFeatured();
  updateFavCount();

  // H10: Show first-run hint only if never dismissed
  if (!localStorage.getItem('dc_hint_dismissed')) {
    setTimeout(() => {
      document.getElementById('first-run-hint')?.classList.remove('hidden');
    }, 600);
  }
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // H1: Clock
  tickClock();
  setInterval(tickClock, 30000);

  setGreeting();
  buildIngredientChips();
  loadRecipes();
  updateSearchPlaceholder();

  // H3: Back gesture (swipe right from left edge)
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 80 && touchStartX < 50) {
      if (currentActiveScreen === 'screen-detail') closeDetail();
      else if (currentActiveScreen === 'screen-favs') closeScreen('screen-favs');
    }
  }, { passive: true });

  // H4: Keyboard shortcut — Escape to go back
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (currentActiveScreen !== 'screen-home') goHome();
      else clearMainSearch();
    }
  });

  // H7: Press Enter in search to open first result
  document.getElementById('main-search-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && filteredRecipes.length > 0) {
      openDetail(0);
    }
  });
});
