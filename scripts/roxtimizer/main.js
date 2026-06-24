'use strict';

const pluck = (obj, key) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v[key]]));
const numericOptionsHTML = count =>
  Array.from({ length: count }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');

const Config = (() => {
  const base = {
  app: {
    maxPanels:          8,
    maxCompanion:       16,
    maxCompanionStats:  3,
    maxDivinity:        { blue: 5, purple: 6, gold: 7 },
    maxEvalLimit:       1_234_567,
    convergenceEpsilon: 1e-9,
    maxEnchPrefs:       3,
    sizes:              ['small', 'medium', 'large'],
    storageKey:         'roxtimizer',
    snapKey:            'pwa_snap',
    companionSlots:     4,
  },

  loaderTiming: {
    convexMirror: 1748,
    okScanned:    3863,
    timeTravel:   1873,
    flywingScam:  7867,
    qqq:          773,

    longComboThreshold: 8_888_888,
  },

  divinityStats: {
    pen:         { blue: 0.15, purple: 0.18, gold: 0.21 },
    crit:        { blue: 0.29, purple: 0.37, gold: 0.42 },
    dmg:         { blue: 0.15, purple: 0.18, gold: 0.21 },
    element:     { blue: 0.18, purple: 0.23, gold: 0.26 },
    size_small:  { blue: 0.18, purple: 0.23, gold: 0.26 },
    size_medium: { blue: 0.18, purple: 0.23, gold: 0.26 },
    size_large:  { blue: 0.18, purple: 0.23, gold: 0.26 },
  },
  divinityKeyMap: {
    pen:         { field: 'pen'     },
    crit:        { field: 'crit'    },
    dmg:         { field: 'dmg'     },
    element:     { field: 'elemEnh' },
    size_small:  { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Small'  },
    size_medium: { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Medium' },
    size_large:  { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Large'  },
  },
  nodes: [
    { id: 'n1', name: 'Spear of Eternity',  dir: { axis: 'X', sign: -1 } },
    { id: 'n2', name: 'Thunderous Hammer',  dir: { axis: 'X', sign:  1 } },
    { id: 'n3', name: 'Blade of Godslayer', dir: { axis: 'X', sign: -1 } },
    { id: 'n4', name: 'Wolf Shackles',      dir: { axis: 'X', sign:  1 } },
    { id: 'n5', name: 'Stormrage Halberd',  dir: { axis: 'X', sign: -1 } },
    { id: 'n6', name: "Chanter's Harp",     dir: { axis: 'X', sign:  1 } },
    { id: 'n7', name: 'Bow of Winter',      dir: { axis: 'Y', sign: -1 } },
    { id: 'n8', name: "Reaper's Scythe",    dir: { axis: 'Y', sign:  1 } },
  ],

  specialNodes: {
    n1: { field: 'spearValue', calcValue: (ctx, panel) => (panel.lightning ? 84 : 0) },
    n8: {
      field: 'reaperValue',
      calcValue: (ctx, panel) => (panel.lightning
        ? (((ctx.wElem === ctx.tAttr) || (ctx.wElem === 'Neutral' && !ctx.tAttr)) ? 84 : 28)
        : 0),
    },
  },

  equipSlots: {
    weapon:    { label: 'Weapon',    count: 5 },
    clothes:   { label: 'Clothes',   count: 2 },
    cloak:     { label: 'Cloak',     count: 2 },
    shoes:     { label: 'Shoes',     count: 2 },
    accessory: { label: 'Accessory', count: 6 },
    headgear:  { label: 'Headgear',  count: 6 },
  },

  statLabels: {
    pen:      'Final PEN',
    crit:     'Crit DMG Bns',
    dmg:      'Final P/M DMG Bns',
    dmgStack: 'Final DMG Stack',
  },
  numFields: ['pen', 'crit', 'dmg', 'elemEnh', 'sizeEnh', 'race', 'attr', 'dmgStack'],
  snapFields: {
    pen: 'pen', crit: 'crit', dmg: 'dmg',
    elemEnh: 'elemEnhance', sizeEnh: 'sizeEnhance',
    race: 'race', attr: 'attr', dmgStack: 'dmgStack',
  },
  elemList: ['Fire', 'Water', 'Wind', 'Earth', 'Holy', 'Shadow', 'Ghost', 'Poison', 'Neutral', 'Undead'],
  sizeList: ['Small', 'Medium', 'Large'],
  raceList: ['Demi-Human', 'Brute', 'Demon', 'Angel', 'Fish', 'Formless', 'Insect', 'Dragon', 'Plant', 'Undead'],
  statDedupGroups: [
    ['Final P.DMG Bonus', 'Final M.DMG Bonus'],
    ['Final P.PEN',       'Final M.PEN'],
  ],
  exclKeys: { crit: new Set(['crit']), pen: new Set(['pen']) },

  companionStatKeys: ['elemEnh', 'pen', 'crit', 'dmg'],
  companionRates: {
    purple: { crit: 0.0040, default: 0.0020 },
    gold:   { crit: 0.0066, default: 0.0033 },
  },
  companionStarMult: 1.17,

enchantOptions: [
    { value: 'morroc_crit', label: 'Morroc – Crit DMG Bns', type: 'crit' },
    { value: 'payon_crit', label: 'Payon – Crit DMG Bns', type: 'crit' },
    { value: 'geffen_crit', label: 'Geffen – Crit DMG Bns', type: 'crit' },
    { value: 'comodo_crit', label: 'Comodo – Crit DMG Bns', type: 'crit' },
    { value: 'umbala_crit', label: 'Umbala – Crit DMG Bns', type: 'crit' },
    { value: 'rachel_crit', label: 'Rachel – Crit DMG Bns', type: 'crit' },
    { value: 'izlude_race', label: 'Izlude – DMG to Race', type: 'race' },
    { value: 'alberta_attr', label: 'Alberta – DMG to Attribute', type: 'attr' },
    { value: 'alberta_dmg', label: 'Alberta – Final P/M DMG Bns', type: 'dmg' },
    { value: 'geffen_dmg', label: 'Geffen – Final P/M DMG Bns', type: 'dmg' },
    { value: 'comodo_dmg', label: 'Comodo – Final P/M DMG Bns', type: 'dmg' },
    { value: 'umbala_dmg', label: 'Umbala – Final P/M DMG Bns', type: 'dmg' },
    { value: 'rachel_dmg', label: 'Rachel – Final P/M DMG Bns', type: 'dmg' },
    { value: 'geffen_pen', label: 'Geffen – Final PEN', type: 'pen' },
    { value: 'comodo_pen', label: 'Comodo – Final PEN', type: 'pen' },
    { value: 'umbala_pen', label: 'Umbala – Final PEN', type: 'pen' },
    { value: 'rachel_pen', label: 'Rachel – Final PEN', type: 'pen' },
  ],
  
  enchantValues: {
    morroc_crit: { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: null },
    payon_crit: { '1H': 3.60, '2H': 5.40, Dagger: 2.70, Shield: 1.80, ACC: null },
    geffen_crit: { '1H': 4.80, '2H': 7.20, Dagger: 3.60, Shield: 2.40, ACC: 2.40 },
    comodo_crit: { '1H': 6.40, '2H': 9.60, Dagger: 4.80, Shield: 3.20, ACC: null },
    umbala_crit: { '1H': 7.20, '2H': 10.80, Dagger: 5.40, Shield: 3.60, ACC: null },
    rachel_crit: { '1H': 8.80, '2H': 13.20, Dagger: 6.60, Shield: 4.40, ACC: null },
    
    izlude_race: { '1H': 2.00, '2H': 3.00, Dagger: 1.50, Shield: 1.00, ACC: null },
    alberta_attr: { '1H': 2.00, '2H': 3.00, Dagger: 1.50, Shield: 1.00, ACC: null },
    
    alberta_dmg: { '1H': 1.60, '2H': 2.40, Dagger: 1.20, Shield: 0.80, ACC: null },
    geffen_dmg: { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: null },
    comodo_dmg: { '1H': 3.20, '2H': 4.80, Dagger: 2.40, Shield: 1.60, ACC: null },
    umbala_dmg: { '1H': 3.60, '2H': 5.40, Dagger: 2.70, Shield: 1.80, ACC: null },
    rachel_dmg: { '1H': 4.40, '2H': 6.60, Dagger: 3.30, Shield: 2.20, ACC: null },
    
    geffen_pen: { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: 1.20 },
    comodo_pen: { '1H': 3.20, '2H': 4.80, Dagger: 2.40, Shield: 1.60, ACC: null },
    umbala_pen: { '1H': 3.60, '2H': 5.40, Dagger: 2.70, Shield: 1.80, ACC: null },
    rachel_pen: { '1H': 4.40, '2H': 6.60, Dagger: 3.30, Shield: 2.20, ACC: null },
  },
  enchantSixSlot: new Set(['One-Handed Sword', 'One-Handed Axe', 'One-Handed Staff', 'Mace', 'GS', 'Dagger']),
  enchantLevelHtml:
    '<option value="" selected>Level</option>' + numericOptionsHTML(15),

  enchantAwakeningPerLevel: 0.1,

  errMsg: 'No saved stats found. Use the <a href="https://masihterjaga.github.io/sim" target="_blank" rel="noopener">ratio calculator</a> first so you don\'t have to re-enter your stats each time.',

  icons: {
    lockClosed: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`,
    lockOpen:   `<path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>`,
    horizSwap:  `<svg class="co-chip-swap" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4l4 4-4 4M3 8h18"/><path d="M7 20l-4-4 4-4M21 16H3"/></svg>`,
    vertSwap:   `<svg class="co-div-swap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l4 4 4-4M8 21V3"/><path d="M20 7l-4-4-4 4M16 3v18"/></svg>`,
    divLock: `<svg class="co-div-lock" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`,
    lightning:  `<svg class="co-div-lightning" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"/></svg>`,
    arrowUp:    `<svg class="co-stat-arrow co-stat-arrow--up" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8-12 8 12z"/></svg>`,
    arrowDown:  `<svg class="co-stat-arrow co-stat-arrow--down" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6l8 12 8-12z"/></svg>`,
    flash:      `<svg class="co-stat-flash" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"/></svg>`,
    sync:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="9" height="9"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    check:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="9" height="9"><polyline points="20 6 9 17 4 12"/></svg>`,
    trash:      `<svg viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M4.5 3.5v-1.5h3v1.5M3 3.5l.6 6.5h4.8l.6-6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    close:      `<svg viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    chevLeft:   `<svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chevRight:  `<svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    person:         `<svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="3.5" r="2" stroke="currentColor" stroke-width="1.3"/><line x1="6" y1="5.5" x2="6" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="3.5" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    star:           `<svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9" class="icon-star-svg"><path d="M8 1.5l1.64 3.32 3.66.53-2.65 2.58.63 3.65L8 9.77l-3.28 1.81.63-3.65L2.7 5.35l3.66-.53L8 1.5z"/></svg>`,
    companionSwap:  `<svg class="co-companion-swap" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
  };

  const nodeOrder  = base.nodes.map(n => n.id);
  const NODE_NAMES = Object.fromEntries(base.nodes.map(n => [n.id, n.name]));
  const DIR_MAP    = Object.fromEntries(base.nodes.map(n => [n.id, n.dir]));

  const slotCounts  = pluck(base.equipSlots, 'count');
  const equipLabels = pluck(base.equipSlots, 'label');

  const ENCHANT_OPTIONS_MAP = new Map(base.enchantOptions.map(o => [o.value, o]));

  return Object.freeze({
    ...base,
    nodeOrder, NODE_NAMES, DIR_MAP,
    slotCounts, equipLabels,
    ENCHANT_OPTIONS_MAP,
  });
})();

const Utils = (() => {
  const escHtml = s => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  const fmtNum = n => {
    const v = Number(n) || 0;
    const a = Math.abs(v);
    if (a > 999999) return `${(v / 1_000_000).toFixed(2)}M`;
    if (a > 9999)   return `${(v / 1000).toFixed(2)}K`;
    if (v % 1 === 0) return v.toString();
    return (Math.floor(v * 100) / 100).toString();
  };

  const fmtPct    = v => (Math.round((Number(v) || 0) * 100) / 100).toFixed(2);
  const fmtRawPct = val => (val * 100).toFixed(0) + '%';

  const labelWithVal = (base, val) => (val ? `${base} (${val})` : base);
  const cssTranslate  = (axis, pct) => `translate${axis}(${pct}%)`;
  const buildLockSvg  = closed => `<svg viewBox="0 0 24 24" fill="currentColor">${closed ? Config.icons.lockClosed : Config.icons.lockOpen}</svg>`;

  const createStatResolver = (ctxKey, ctxVal, field) => ctx => (ctx[ctxKey] === ctxVal ? field : null);

  const parseStatPct = raw => (
    typeof raw === 'string' && raw.includes('%')
      ? parseFloat(raw.replace('%', '').replace(/,/g, ''))
      : null
  );

  const countBy = (names, obj = {}) => {
    for (const n of names) obj[n] = (obj[n] || 0) + 1;
    return obj;
  };

  const runWithStrategy = (total, exactFn, greedyFn) =>
    (total <= Config.app.maxEvalLimit ? exactFn() : greedyFn());

  const rAF2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

  const buildLoadingHTML = text =>
    `<div class="co-loading"><span class="co-spinner"></span><span class="co-loading-text">${text}<span class="co-dots"><span>.</span><span>.</span><span>.</span></span></span></div>`;

  const setLoadingText = (resultEl, text, blink = false) => {
    const textEl = resultEl.querySelector('.co-loading-text');
    if (!textEl) { resultEl.innerHTML = buildLoadingHTML(text); return; }
    const dots = textEl.querySelector('.co-dots');
    textEl.textContent = text;
    textEl.appendChild(dots);
    textEl.classList.remove('co-loading-text-enter');
    void textEl.offsetWidth;
    textEl.classList.add('co-loading-text-enter');
    textEl.classList.toggle('co-loading-text-blink', blink);
  };

  const buildResSectionHTML = (title, innerHTML, fallback = '') =>
    `<div class="co-res-section"><div class="co-res-section-title">${title}</div>${innerHTML || fallback}</div>`;

  const EMPTY_STATE_HTML = '<span class="co-empty-state">Not set yet</span>';

  const renderSummaryList = (listEl, entries) => {
    listEl.innerHTML = entries.length
      ? entries.map(({ lbl, val }) =>
          `<div class="summary-row">
            <span class="summary-label">${lbl}</span>
            <span class="summary-value">${val}</span>
          </div>`).join('')
      : EMPTY_STATE_HTML;
  };

  const toggleConditionalBtn = (container, selector, shouldExist, makeEl) => {
    const existing = container.querySelector(selector);
    if (shouldExist && !existing) container.appendChild(makeEl());
    else if (!shouldExist && existing) existing.remove();
  };

  const updateSelectsDisabled = (container, selector, getValues, isExtraExcluded = () => false) => {
    const values   = getValues();
    const allTaken = new Set(values.filter(Boolean));
    container.querySelectorAll(selector).forEach((sel, i) => {
      const own = values[i];
      sel.querySelectorAll('option[value]:not([value=""])').forEach(opt => {
        opt.disabled = (opt.value !== own && allTaken.has(opt.value)) || (isExtraExcluded(opt.value) && opt.value !== own);
      });
    });
  };

  const initSlider = (container, slides, labelEl, slideLabels, onSlide, prevSelector, nextSelector) => {
    const btnPrev = container.querySelector(prevSelector ?? '[data-dir="-1"]');
    const btnNext = container.querySelector(nextSelector ?? '[data-dir="1"]');
    let current = 0;
    let transitioning = false;

    const updateSliderNav = () => {
      if (btnPrev) btnPrev.disabled = current === 0;
      if (btnNext) btnNext.disabled = current === slides.length - 1;
    };

    const goTo = idx => {
      if (transitioning || idx < 0 || idx >= slides.length || idx === current) return;
      transitioning = true;
      const dir      = idx > current ? 1 : -1;
      const outgoing = slides[current];
      const incoming = slides[idx];
      const hiddenIn  = dir > 0 ? 'co-slide--hidden-right' : 'co-slide--hidden-left';
      const hiddenOut = dir > 0 ? 'co-slide--hidden-left'  : 'co-slide--hidden-right';
      incoming.classList.remove('co-slide--hidden-left', 'co-slide--hidden-right');
      incoming.classList.add(hiddenIn);
      rAF2(() => {
        outgoing.classList.replace('co-slide--active', hiddenOut);
        incoming.classList.remove(hiddenIn);
        incoming.classList.add('co-slide--active');
      });
      incoming.addEventListener('transitionend', () => { transitioning = false; }, { once: true });
      current = idx;
      if (labelEl) labelEl.textContent = slideLabels?.[current] ?? `Slot ${current + 1}`;
      updateSliderNav();
      onSlide?.(current);
    };

    btnPrev?.addEventListener('click', () => goTo(current - 1));
    btnNext?.addEventListener('click', () => goTo(current + 1));
    updateSliderNav();
    return goTo;
  };

  const animateSlideTransition = (incoming, outgoing, axis, dirSign, onDone) => {
    rAF2(() => {
      incoming.style.transition = '';
      incoming.style.transform  = cssTranslate(axis, 0);
      outgoing.style.transform  = cssTranslate(axis, -dirSign * 100);
    });
    incoming.addEventListener('transitionend', () => { outgoing.remove(); onDone?.(); }, { once: true });
  };

  const animateSlide = (incoming, outgoing, axis, dirSign, onStart, onDone) => {
    incoming.style.transition = 'none';
    incoming.style.transform  = cssTranslate(axis, dirSign * 100);
    onStart?.();
    animateSlideTransition(incoming, outgoing, axis, dirSign, () => { onDone?.(); });
  };

  const toggleCoPanel = hd => {
    const body      = hd.nextElementSibling;
    const inner     = body.querySelector('.co-body-inner');
    const expanding = hd.getAttribute('aria-expanded') !== 'true';
    hd.setAttribute('aria-expanded', String(expanding));
    if (expanding) {
      body.classList.remove('collapsed');
      body.style.height = '0px';
      rAF2(() => { body.style.height = inner.scrollHeight + 'px'; });
    } else {
      body.style.height = body.scrollHeight + 'px';
      requestAnimationFrame(() => { body.classList.add('collapsed'); body.style.height = '0px'; });
    }
    body.addEventListener('transitionend', () => { body.style.height = ''; }, { once: true });
  };

  const bindCoPanelToggle = hd => {
    const toggle = () => toggleCoPanel(hd);
    hd.addEventListener('click', toggle);
    hd.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  };

  const updateUseBtn = (btn, isUsed) => {
    btn.classList.toggle('active', isUsed);
    btn.querySelector('span').textContent  = isUsed ? 'In Use' : 'Use';
    btn.querySelector('svg').style.display = isUsed ? '' : 'none';
  };

  return {
    escHtml, fmtNum, fmtPct, fmtRawPct, labelWithVal, cssTranslate, buildLockSvg,
    pluck, createStatResolver, parseStatPct, countBy, runWithStrategy, rAF2,
    numericOptionsHTML,
    buildLoadingHTML, setLoadingText, buildResSectionHTML, EMPTY_STATE_HTML,
    renderSummaryList, toggleConditionalBtn, updateSelectsDisabled,
    initSlider, animateSlideTransition, animateSlide,
    toggleCoPanel, bindCoPanelToggle, updateUseBtn,
  };
})();

const Dom = (() => {
  const g  = id  => document.getElementById(id);
  const qs = sel => document.querySelector(sel);
  return {
    msg:              g('statsMsg'),
    form:             g('statsForm'),
    manualBtn:        g('inputManualBtn'),
    tDef:             g('targetDefSelect'),
    weapon:           g('weaponSelect'),
    wElem:            g('weaponElementSelect'),
    atkType:          g('atkType'),
    penField:         g('penField'),
    critField:        g('critField'),
    pen:              g('pen'),
    crit:             g('crit'),
    dmg:              g('dmg'),
    elemEnh:          g('elemEnhance'),
    sizeEnh:          g('sizeEnhance'),
    race:             g('race'),
    attr:             g('attr'),
    dmgStack:         g('dmgStack'),
    elemEnhanceLabel: g('elemEnhanceLabel'),
    dmgSizeLabel:     g('dmgSizeLabel'),
    dmgRaceLabel:     g('dmgRaceLabel'),
    dmgAttrLabel:     g('dmgAttrLabel'),
    tFinalDef:        g('targetFinalDefDisplay'),
    tDmgRed:          g('targetDmgRedDisplay'),
    tSize:            g('targetSizeSelect'),
    tRace:            g('targetRaceSelect'),
    tAttr:            g('targetElementSelect'),
    resultCard:       g('resultCard'),
    divSizeSelect:    g('divSizeSelect'),
    enchLines:        g('enchLines'),
    enchAwakeningSelect: g('enchAwakeningSelect'),
    enchSettingsPanel:   g('enchSettingsPanel'),
    enchSettingsBtn:     g('enchSettingsBtn'),
    enchSettingsInner:   g('enchSettingsInner'),
    coCompanionBackdrop: g('coCompanionModalBackdrop'),
    sliderContainer:  qs('.slider-container'),
    grid:             g('grid'),
    summaryModal:     g('summaryModal'),
    helpModal:        g('helpModal'),
    coSection:        g('card-optimizer'),
    enchantSection:   g('card-enchantment'),
    divModalBackdrop: g('divModalBackdrop'),
    divModal:         g('divModal'),
    divModalName:     g('divModalName'),
    divModalFlash:    g('divModalFlash'),
    divModalStatsCur: g('divModalStatsCurrent'),
    divModalArrow:    g('divModalArrow'),
    divModalStatsRec: g('divModalStatsRec'),
    companionSection: g('card-companion'),
    companionItemRow: g('companion-items-row'),
    companionAddBtn: g('companion-item-add-btn'),
    companionClearBtn: g('companion-item-clear-btn'),
    companionClearNode: g('companion-item-clear-node'),
    companionItemPanel: g('companion-item-panel'),
   companionQualityBtns: g('companion-quality-btns'),
    companionSheetTitle: g('companion-sheet-title'),
    companionStatsWrap: g('companion-sheet-stats'),
    companionSheetClose: g('companion-sheet-close'),
    companionQPurple: g('companion-q-purple'),
    companionQGold: g('companion-q-gold'),
    companionQStar: g('companion-q-star'),
    companionUseBtn: g('companion-use-btn'),
    companionRemoveBtn: g('companion-remove-btn'),
    companionEditBtn: g('companion-sheet-edit-btn'),
    companionSlideLabel: g('companion-slide-label'),
  };
})();

const Labels = (() => {
  const getDynamicLabel = (domKey, format, fallback) => {
    const v = Dom[domKey]?.value;
    return (v && v !== '—') ? format(v) : fallback;
  };

  const getElemEnhLabel    = () => getDynamicLabel('wElem', v => `${v} Enhance`, 'Element Enhance');
  const getTargetRaceLabel = () => getDynamicLabel('tRace', v => `DMG to ${v}`, 'DMG to Race');
  const getTargetAttrLabel = () => getDynamicLabel('tAttr', v => `DMG to ${v}`, 'DMG to Attribute');
  const getTargetSizeLabel = () => getDynamicLabel('tSize', v => `DMG to ${v}`, 'DMG to Size');

  const getEnchantExcludedType = () => (Dom.atkType.value === 'pen' ? 'crit' : 'pen');
  const isAtkExcluded = key => Config.exclKeys[getEnchantExcludedType()]?.has(key) ?? false;

  const STAT_OPTIONS = [
    { key: 'pen',         label: Config.statLabels.pen  },
    { key: 'crit',        label: Config.statLabels.crit },
    { key: 'dmg',         label: Config.statLabels.dmg  },
    { key: 'element',     get label() { return getElemEnhLabel(); } },
    { key: 'size_small',  label: 'DMG to Small'   },
    { key: 'size_medium', label: 'DMG to Medium'  },
    { key: 'size_large',  label: 'DMG to Large'   },
  ];
  const STAT_OPTIONS_MAP = new Map(STAT_OPTIONS.map(o => [o.key, o]));

  const { createStatResolver } = Utils;
  const { elemList, sizeList, raceList } = Config;
  const STAT_RESOLVERS = {
    'Final P.PEN':       ctx => (ctx.atkType === 'pen'  ? 'pen'  : null),
    'Final M.PEN':       ctx => (ctx.atkType === 'pen'  ? 'pen'  : null),
    'Crit DMG Bonus':    ctx => (ctx.atkType === 'crit' ? 'crit' : null),
    'Final P.DMG Bonus': () => 'dmg',
    'Final M.DMG Bonus': () => 'dmg',
    ...elemList.reduce((a, e) => ({ ...a, [`${e} Enhance`]:                        createStatResolver('wElem', e, 'elemEnh') }), {}),
    ...sizeList.reduce((a, s) => ({ ...a, [`Bonus DMG to ${s}`]:                   createStatResolver('tSize', s, 'sizeEnh') }), {}),
    ...raceList.reduce((a, r) => ({ ...a, [`Bonus DMG to ${r}`]:                   createStatResolver('tRace', r, 'race')    }), {}),
    ...elemList.reduce((a, x) => ({ ...a, [`Bonus DMG to ${x} Attribute Monster`]: createStatResolver('tAttr', x, 'attr')   }), {}),
  };

  const COMPANION_STAT_OPTIONS = [
    { key: 'elemEnh', get label() { return getElemEnhLabel(); } },
    { key: 'pen',     label: Config.statLabels.pen  },
    { key: 'crit',    label: Config.statLabels.crit },
    { key: 'dmg',     label: Config.statLabels.dmg  },
  ];
  const COMPANION_FIELD_LABELS = {
    get elemEnh() { return getElemEnhLabel(); },
    pen:  Config.statLabels.pen,
    crit: Config.statLabels.crit,
    dmg:  Config.statLabels.dmg,
  };

  const getBuffStatOptions = () => [
    { field: 'dmg',      label: Config.statLabels.dmg      },
    { field: 'pen',      label: Config.statLabels.pen       },
    { field: 'crit',     label: Config.statLabels.crit      },
    { field: 'elemEnh',  label: getElemEnhLabel()           },
    { field: 'sizeEnh',  label: getTargetSizeLabel()        },
    { field: 'race',     label: getTargetRaceLabel()        },
    { field: 'attr',     label: getTargetAttrLabel()        },
    { field: 'dmgStack', label: Config.statLabels.dmgStack  },
  ];

  const getBaseStatLabels = () => [
    { field: 'dmg',      label: Config.statLabels.dmg      },
    { field: 'elemEnh',  label: getElemEnhLabel()           },
    { field: 'sizeEnh',  label: getTargetSizeLabel()        },
    { field: 'race',     label: getTargetRaceLabel()        },
    { field: 'attr',     label: getTargetAttrLabel()        },
    { field: 'dmgStack', label: Config.statLabels.dmgStack  },
  ];

  const getEnchantTypeLabel = type => ({
    crit: Config.statLabels.crit,
    race: getTargetRaceLabel(),
    attr: getTargetAttrLabel(),
    dmg:  Config.statLabels.dmg,
    pen:  Config.statLabels.pen,
  })[type] ?? type;

  const getEnchantOptLabel = opt => {
    const sep = opt.label.indexOf('\u2013');
    if (sep === -1) return opt.label;
    return opt.label.slice(0, sep + 2) + getEnchantTypeLabel(opt.type);
  };

  const buildEnchantOptionsHTML = (currentVal = '') => {
    const excl = getEnchantExcludedType();
    return '<option value="" selected>Enchantment</option>' +
      Config.enchantOptions.map(o => {
        const excluded = o.type === excl && o.value !== currentVal;
        return `<option value="${o.value}"${excluded ? ' disabled' : ''}>${getEnchantOptLabel(o)}</option>`;
      }).join('');
  };

  return {
    getElemEnhLabel, getTargetRaceLabel, getTargetAttrLabel, getTargetSizeLabel,
    getEnchantExcludedType, isAtkExcluded,
    STAT_OPTIONS, STAT_OPTIONS_MAP, STAT_RESOLVERS,
    COMPANION_STAT_OPTIONS, COMPANION_FIELD_LABELS,
    getBuffStatOptions, getBaseStatLabels,
    getEnchantTypeLabel, getEnchantOptLabel, buildEnchantOptionsHTML,
  };
})();

const Store = (() => {
  let cache = null;

  const read = () => {
    if (cache) return cache;
    try {
      cache = JSON.parse(localStorage.getItem(Config.app.storageKey) || '{}');
    } catch {
      cache = {};
    }
    return cache;
  };

  const section = key => read()[key] || {};

  const write = (key, data) => {
    try {
      const s = read();
      s[key] = data;
      localStorage.setItem(Config.app.storageKey, JSON.stringify(s));
    } catch (err) {
      console.warn(`Store.write: failed to persist "${key}" (localStorage full/disabled?)`, err);
    }
  };

  return { read, section, write };
})();

const Modals = (() => {
  const registered = [];

  const register = el => { if (el) registered.push(el); };
  const closeAll  = () => registered.forEach(el => el.classList.remove('open'));

  const bindModalNodes = (container, selector, getArgs, openFn) =>
    container.querySelectorAll(selector).forEach(el =>
      el.addEventListener('click', () => openFn(getArgs(el)))
    );

  const bind = (btnId, modalEl, opts = {}) => {
    register(modalEl);
    const { onOpen, stopClickPropagation = true, spoilerToggle = false } = opts;
    const closeEl = typeof opts.closeId === 'string'
      ? document.getElementById(opts.closeId)
      : opts.closeEl;
    const open  = () => { onOpen?.(); modalEl.classList.add('open'); };
    const close = () => modalEl.classList.remove('open');
    document.getElementById(btnId).addEventListener('click', e => {
      e.stopPropagation();
      const opening = !modalEl.classList.contains('open');
      closeAll();
      if (opening) open();
    });
    closeEl?.addEventListener('click', close);
    if (stopClickPropagation) {
      modalEl.addEventListener('click', e => {
        const sp = spoilerToggle ? e.target.closest('.spoiler') : null;
        if (sp) { sp.classList.toggle('revealed'); e.stopPropagation(); return; }
        e.stopPropagation();
      });
    }
  };

  return { register, closeAll, bind, bindModalNodes };
})();

const ui = {
  activeId:         null,
  activeSize:       'small',
  activePanel:      null,
  activeDir:        null,
  isAnimating:      false,
  isNodeNavigating: false,
  calcTimeouts:     [],
};

const Divinity = (() => {
  const { nodeOrder, NODE_NAMES, DIR_MAP, divinityStats, divinityKeyMap, specialNodes, app, icons } = Config;
  const { fmtRawPct, buildLockSvg, cssTranslate, rAF2,
          toggleConditionalBtn, updateSelectsDisabled,
          animateSlideTransition, animateSlide,
          updateUseBtn, renderSummaryList } = Utils;

  const nodeData = {};

  const getQuality = panel => (panel.gold ? 'gold' : panel.purple ? 'purple' : 'blue');
  const getStatVal = (key, quality) => divinityStats[key]?.[quality] ?? null;
  const fmtStatPct = (key, quality) => { const v = getStatVal(key, quality); return v === null ? '' : fmtRawPct(v); };

  const defaultPanel      = () => ({ blue: true, purple: false, gold: false, lightning: false, locked: false, divinity: [null] });
  const defaultSizeMap    = (val = () => ({})) => Object.fromEntries(app.sizes.map(s => [s, typeof val === 'function' ? val() : val]));
  const defaultUsedBySize = () => defaultSizeMap(() => null);

  const getUsed         = id => getData(id).usedBySize[ui.activeSize] ?? null;
  const setUsed         = (id, idx) => { getData(id).usedBySize[ui.activeSize] = idx; };
  const isUsedInAnySize = (id, idx) => Object.values(getData(id).usedBySize).some(v => v === idx);
  const canShowTrash    = (id, count, idx, locked = false) => !locked && count > 1 && !isUsedInAnySize(id, idx);

  const save = () => Store.write('divinity', nodeData);
  const load = () => {
    try { Object.assign(nodeData, Store.section('divinity')); normalize(); }
    catch (err) { console.warn('Divinity.load: failed to restore divinity state', err); }
  };

  function normalize() {
    for (const id of Object.keys(nodeData)) {
      const d = nodeData[id];
      while (d.panels.length < d.count) d.panels.push(defaultPanel());
      for (const p of d.panels) {
        if (!Array.isArray(p.divinity)) p.divinity = [null];
        p.locked ??= false;
        if (!p.blue && !p.purple && !p.gold) p.blue = true;
      }
    }
  }

  function getData(id) {
    if (!nodeData[id])
      nodeData[id] = { count: 1, current: 0, usedBySize: defaultUsedBySize(), panels: [defaultPanel()] };
    return nodeData[id];
  }

  function updateDivCircle(id) {
    const circle = document.querySelector(`[for="${id}"] .circle`);
    if (!circle) return;
    const usedIdx = getUsed(id);
    const hasUsed = usedIdx != null;
    circle.classList.toggle('has-num', hasUsed);
    circle.querySelector('.circle-num').textContent = hasUsed ? usedIdx + 1 : '';
    circle.classList.remove('quality-blue', 'quality-purple', 'quality-gold', 'has-lightning');
    let lockEl = circle.querySelector('.circle-lock');
    if (!hasUsed) { lockEl?.remove(); return; }
    const s = nodeData[id]?.panels[usedIdx];
    if (!s) return;
    circle.classList.add(`quality-${getQuality(s)}`);
    circle.classList.toggle('has-lightning', s.lightning);
    if (s.locked) {
      if (!lockEl) {
        lockEl = document.createElement('span');
        lockEl.className = 'circle-lock';
        lockEl.innerHTML = buildLockSvg(true);
        circle.appendChild(lockEl);
      }
    } else {
      lockEl?.remove();
    }
  }

  function setLockState(btn, locked) {
    btn.dataset.locked = String(locked);
    btn.innerHTML      = buildLockSvg(locked);
    btn.title          = locked ? 'Unlock slot' : 'Lock slot';
  }

  function toggleAddBtn(footerRight, count) {
    toggleConditionalBtn(footerRight, '.add-btn', count < app.maxPanels, makeAddBtn);
  }

  function makeAddBtn() {
    const btn = document.createElement('button');
    btn.className   = 'add-btn';
    btn.textContent = '+ Add Div';
    btn.addEventListener('click', addSubPanel);
    return btn;
  }

  function makeDelBtn() {
    const btn = document.createElement('button');
    btn.className = 'nav-btn del-btn';
    btn.innerHTML = icons.trash;
    btn.addEventListener('click', deleteSubPanel);
    return btn;
  }

  function toggleTrashBtn(panelNav, id, count, idx, locked) {
    toggleConditionalBtn(panelNav, '.del-btn', canShowTrash(id, count, idx, locked), makeDelBtn);
  }

  function initDivSubPanel(contentEl, s) {
    const list      = document.createElement('div');
    list.className  = 'divinity-list';
    const addToggle = document.createElement('button');
    addToggle.className   = 'divinity-add-toggle';
    addToggle.textContent = '+ Add Stat';

    const getDivOptionText        = (opt, quality) => `${opt.label} · ${fmtStatPct(opt.key, quality)}`;
    const updateDivAddToggle      = () => { addToggle.style.display = s.divinity.length >= app.maxDivinity[getQuality(s)] ? 'none' : ''; };
    const updateDivOptionDisabled = () => updateSelectsDisabled(list, '.divinity-select', () => s.divinity, Labels.isAtkExcluded);

    function makeDivRow(selectedKey, index) {
      const quality    = getQuality(s);
      const optionsHTML = Labels.STAT_OPTIONS.map(opt => {
        const excl = Labels.isAtkExcluded(opt.key) && opt.key !== selectedKey;
        return `<option value="${opt.key}"${opt.key === selectedKey ? ' selected' : ''}${excl ? ' disabled' : ''}>${getDivOptionText(opt, quality)}</option>`;
      }).join('');
      const wrap = document.createElement('div');
      wrap.innerHTML = `<div class="divinity-row">
        <div class="select-wrap"><select class="divinity-select"><option value="" disabled${!selectedKey ? ' selected' : ''}>Divinity Stats</option>${optionsHTML}</select></div>
        <button class="divinity-del-btn"><svg viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
      </div>`;
      const row    = wrap.firstElementChild;
      const sel    = row.querySelector('.divinity-select');
      const delBtn = row.querySelector('.divinity-del-btn');
      sel.addEventListener('change', () => { s.divinity[index] = sel.value; save(); updateDivOptionDisabled(); });
      delBtn.addEventListener('click', () => { s.divinity.splice(index, 1); save(); renderDivRows(); });
      return row;
    }

    function renderDivRows() {
      list.innerHTML = '';
      s.divinity.forEach((key, i) => list.appendChild(makeDivRow(key, i)));
      updateDivAddToggle();
      updateDivOptionDisabled();
    }

    function updateDivOptions() {
      const quality = getQuality(s);
      const max     = app.maxDivinity[quality];
      if (s.divinity.length > max) { s.divinity.splice(max); save(); renderDivRows(); return; }
      list.querySelectorAll('.divinity-select').forEach(sel => {
        sel.querySelectorAll('option[value]:not([value=""])').forEach(opt => {
          const meta = Labels.STAT_OPTIONS_MAP.get(opt.value);
          if (meta) opt.textContent = getDivOptionText(meta, quality);
        });
      });
      updateDivAddToggle();
    }

    addToggle.addEventListener('click', () => {
      if (s.divinity.length >= app.maxDivinity[getQuality(s)]) return;
      s.divinity.push(null);
      save();
      renderDivRows();
    });

    const max = app.maxDivinity[getQuality(s)];
    if (s.divinity.length > max) { s.divinity.splice(max); save(); }
    renderDivRows();
    contentEl.appendChild(list);
    contentEl.appendChild(addToggle);
    return updateDivOptions;
  }

  function initDivTags(panel, data, onQualityChange) {
    const t = {
      blue:      panel.querySelector('.tag-blue'),
      purple:    panel.querySelector('.tag-purple'),
      gold:      panel.querySelector('.tag-gold'),
      lightning: panel.querySelector('.tag-lightning'),
      lock:      panel.querySelector('.tag-lock'),
    };

    function updateDivTags() {
      const s = data.panels[data.current];
      t.blue.classList.toggle('active', s.blue);
      t.purple.classList.toggle('active', s.purple);
      t.gold.classList.toggle('active', s.gold);
      t.lightning.classList.toggle('active', s.lightning);
      t.lightning.classList.toggle('tag-disabled', !s.gold);
      t.lock.classList.toggle('active', s.locked);
      t.lock.innerHTML = buildLockSvg(s.locked);
      t.lock.title     = s.locked ? 'Unlock this divinity' : 'Lock this divinity';
      save();
      onQualityChange?.();
    }

    const setDivQuality = qual => {
      const s = data.panels[data.current];
      if (s[qual]) return;
      s.blue = s.purple = s.gold = false;
      s[qual] = true;
      if (qual !== 'gold') s.lightning = false;
      updateDivTags();
    };

    t.blue.addEventListener('click',      () => setDivQuality('blue'));
    t.purple.addEventListener('click',    () => setDivQuality('purple'));
    t.gold.addEventListener('click',      () => setDivQuality('gold'));
    t.lightning.addEventListener('click', () => {
      const s = data.panels[data.current];
      if (!s.gold) return;
      s.lightning = !s.lightning;
      updateDivTags();
    });
    return updateDivTags;
  }

  function addSubPanel() {
    if (ui.isAnimating || !ui.activeId) return;
    const data = getData(ui.activeId);
    if (data.count >= app.maxPanels) return;
    data.count++;
    data.panels.push(defaultPanel());
    save();
    navigateTo(data.count - 1, 1);
  }

  function navigateTo(newIndex, slideDir) {
    if (ui.isAnimating || !ui.activePanel || !ui.activeId) return;
    const data = getData(ui.activeId);
    data.current = newIndex;
    ui.isAnimating = true;
    const s      = data.panels[newIndex];
    const count  = data.count;
    const isUsed = getUsed(ui.activeId) === newIndex;
    const p      = ui.activePanel;
    p.querySelector('.panel-nav-count').textContent = `${newIndex + 1}/${count}`;
    p.querySelector('.prev-btn').disabled           = newIndex === 0;
    p.querySelector('.next-btn').disabled           = newIndex === count - 1;
    const panelNav = p.querySelector('.panel-nav');
    panelNav.style.visibility = count > 1 ? '' : 'hidden';
    toggleTrashBtn(panelNav, ui.activeId, count, newIndex, s?.locked);
    toggleAddBtn(p.querySelector('.panel-footer-right'), count);
    updateUseBtn(p.querySelector('.use-btn'), isUsed);
    p.syncTags?.();
    const wrap       = p.querySelector('.panel-content-wrap');
    const oldContent = wrap.querySelector('.panel-content');
    const newContent = document.createElement('div');
    newContent.className        = 'panel-content';
    newContent.style.transition = 'none';
    newContent.style.transform  = cssTranslate('X', slideDir * 100);
    p.setUpdateOptions?.(initDivSubPanel(newContent, s));
    wrap.appendChild(newContent);
    animateSlideTransition(newContent, oldContent, 'X', slideDir, () => { ui.isAnimating = false; });
  }

  function deleteSubPanel() {
    if (ui.isAnimating || !ui.activeId) return;
    if (!confirm('Delete this divinity panel? This cannot be undone.')) return;
    const data = getData(ui.activeId);
    const idx  = data.current;
    data.panels.splice(idx, 1);
    data.count--;
    for (const size of app.sizes) {
      const u = data.usedBySize[size];
      if (u === idx)    data.usedBySize[size] = null;
      else if (u > idx) data.usedBySize[size]--;
    }
    save();
    updateDivCircle(ui.activeId);
    navigateTo(idx === 0 ? 0 : idx - 1, idx === 0 ? 1 : -1);
  }

  function swapPanel(incoming, slideDir) {
    const outgoing = ui.activePanel;
    Dom.sliderContainer.appendChild(incoming);
    ui.activePanel = incoming;
    animateSlide(incoming, outgoing, 'X', slideDir,
      () => { ui.isAnimating = true; },
      () => { ui.isAnimating = false; }
    );
  }

  function closePanel(onDone) {
    if (ui.isAnimating || !ui.activePanel) return;
    ui.isAnimating = true;
    const panel = ui.activePanel;
    const dir   = ui.activeDir;
    panel.style.transform      = cssTranslate(dir.axis, dir.sign * 100);
    Dom.grid.style.transform   = cssTranslate(dir.axis, 0);
    panel.addEventListener('transitionend', () => {
      panel.remove();
      Dom.sliderContainer.style.height = '';
      ui.activePanel = null;
      ui.activeDir   = null;
      if (ui.activeId) { document.getElementById(ui.activeId).checked = false; ui.activeId = null; }
      ui.isAnimating = false;
      onDone?.();
    }, { once: true });
  }

  function navigateNode(dir) {
    if (ui.isAnimating || !ui.activeId) return;
    const nextIdx = nodeOrder.indexOf(ui.activeId) + dir;
    if (nextIdx < 0 || nextIdx >= nodeOrder.length) return;
    const nextId = nodeOrder[nextIdx];
    ui.isNodeNavigating = true;
    document.getElementById(ui.activeId).checked = false;
    document.getElementById(nextId).checked      = true;
    ui.isNodeNavigating = false;
    const nextData   = getData(nextId);
    nextData.current = getUsed(nextId) ?? 0;
    ui.activeId = nextId;
    swapPanel(makePanelEl(nextId), dir);
  }

  function makePanelEl(id) {
    const data    = getData(id);
    const idx     = data.current;
    const count   = data.count;
    const s       = data.panels[idx];
    const nodeIdx = nodeOrder.indexOf(id);
    const isUsed  = getUsed(id) === idx;
    const panel   = document.createElement('div');
    panel.className = 'detail-panel';
    panel.innerHTML = `
      <div class="panel-tags">
        <button class="tag-btn tag-lock${s.locked ? ' active' : ''}" title="${s.locked ? 'Unlock' : 'Lock'} this divinity">
          ${buildLockSvg(s.locked)}
        </button>
        <button class="tag-btn tag-blue${s.blue ? ' active' : ''}"></button>
        <button class="tag-btn tag-purple${s.purple ? ' active' : ''}"></button>
        <button class="tag-btn tag-gold${s.gold ? ' active' : ''}"></button>
        <button class="tag-btn tag-lightning${s.lightning ? ' active' : ''}${!s.gold ? ' tag-disabled' : ''}">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"/></svg>
        </button>
        <button class="close-btn">${icons.close}</button>
      </div>
      <div class="panel-header">
        <span class="panel-name">${NODE_NAMES[id]}</span>
        <div class="panel-node-nav">
          <button class="nav-btn node-prev-btn" ${nodeIdx === 0 ? 'disabled' : ''}>${icons.chevLeft}</button>
          <button class="nav-btn node-next-btn" ${nodeIdx === nodeOrder.length - 1 ? 'disabled' : ''}>${icons.chevRight}</button>
        </div>
      </div>
      <div class="panel-divider"></div>
      <div class="panel-content-wrap"><div class="panel-content"></div></div>
      <div class="panel-footer">
        <div class="panel-nav"${count > 1 ? '' : ' style="visibility:hidden"'}>
          <button class="nav-btn prev-btn" ${idx === 0 ? 'disabled' : ''}>${icons.chevLeft}</button>
          <span class="panel-nav-count">${idx + 1}/${count}</span>
          <button class="nav-btn next-btn" ${idx === count - 1 ? 'disabled' : ''}>${icons.chevRight}</button>
        </div>
        <div class="panel-footer-right">
          <button class="use-btn${isUsed ? ' active' : ''}"><svg style="${isUsed ? '' : 'display:none'}" viewBox="0 0 12 12" fill="none">${icons.person}</svg><span>${isUsed ? 'In Use' : 'Use'}</span></button>
          ${count < app.maxPanels ? '<button class="add-btn">+ Add Div</button>' : ''}
        </div>
      </div>`;

    const lockBtn  = panel.querySelector('.tag-lock');
    const panelNav = panel.querySelector('.panel-nav');

    panel.querySelector('.close-btn').addEventListener('click', () => closePanel());
    lockBtn.addEventListener('click', () => {
      const cur  = data.panels[data.current];
      cur.locked = !cur.locked;
      lockBtn.classList.toggle('active', cur.locked);
      lockBtn.title     = cur.locked ? 'Unlock this divinity' : 'Lock this divinity';
      lockBtn.innerHTML = buildLockSvg(cur.locked);
      toggleTrashBtn(panelNav, ui.activeId, data.count, data.current, cur.locked);
      save();
    });

    if (nodeIdx > 0)                    panel.querySelector('.node-prev-btn').addEventListener('click', () => navigateNode(-1));
    if (nodeIdx < nodeOrder.length - 1) panel.querySelector('.node-next-btn').addEventListener('click', () => navigateNode(1));
    panel.querySelector('.prev-btn').addEventListener('click', () => { if (data.current > 0) navigateTo(data.current - 1, -1); });
    panel.querySelector('.next-btn').addEventListener('click', () => { if (data.current < data.count - 1) navigateTo(data.current + 1, 1); });
    if (count < app.maxPanels) panel.querySelector('.add-btn').addEventListener('click', addSubPanel);
    if (canShowTrash(id, count, idx, s.locked)) panelNav.appendChild(makeDelBtn());

    const useBtn = panel.querySelector('.use-btn');
    useBtn.addEventListener('click', () => {
      const cur = data.current;
      setUsed(id, getUsed(id) === cur ? null : cur);
      save();
      updateDivCircle(id);
      updateUseBtn(useBtn, getUsed(id) === cur);
      toggleTrashBtn(panelNav, id, data.count, cur, data.panels[cur]?.locked);
    });

    let currentUpdateOptions = initDivSubPanel(panel.querySelector('.panel-content'), s);
    panel.setUpdateOptions  = fn => { currentUpdateOptions = fn; };
    panel.updateOptions     = () => currentUpdateOptions?.();
    panel.syncTags = initDivTags(panel, data, () => {
      currentUpdateOptions?.();
      if (getUsed(id) === data.current) updateDivCircle(id);
    });
    return panel;
  }

  function openPanel(cb) {
    const dir    = DIR_MAP[cb.id];
    const data   = getData(cb.id);
    data.current = getUsed(cb.id) ?? 0;
    ui.activeId  = cb.id;
    ui.activeDir = dir;
    Dom.sliderContainer.style.height = Dom.grid.offsetHeight + 'px';
    const panel = makePanelEl(cb.id);
    panel.style.transition = 'none';
    panel.style.transform  = cssTranslate(dir.axis, dir.sign * 100);
    Dom.sliderContainer.appendChild(panel);
    ui.activePanel = panel;
    ui.isAnimating = true;
    rAF2(() => {
      panel.style.transition = '';
      panel.style.transform  = cssTranslate(dir.axis, 0);
      Dom.grid.style.transform = cssTranslate(dir.axis, -dir.sign * 100);
    });
    panel.addEventListener('transitionend', () => { ui.isAnimating = false; }, { once: true });
  }

  function applyDeltas(state, deltas, sign) {
    const result = { ...state };
    for (const { field, val } of deltas)
      result[field] = (result[field] || 0) + sign * val;
    return result;
  }

  function applyDivinityStats(state, panel, ctx, sign) {
    const quality = getQuality(panel);
    let result    = { ...state };
    for (const key of panel.divinity) {
      if (!key) continue;
      const meta = divinityKeyMap[key];
      if (!meta) continue;
      if (meta.cond && !meta.cond(ctx)) continue;
      const val = getStatVal(key, quality);
      if (val === null) continue;
      result[meta.field] = (result[meta.field] || 0) + sign * val * 100;
    }
    return result;
  }

  function applyDivinityPanel(state, panel, nodeId, ctx, sign = 1) {
    let result    = applyDivinityStats(state, panel, ctx, sign);
    const special = specialNodes[nodeId];
    if (special) {
      const delta = special.calcValue(ctx, panel);
      result = { ...result, [special.field]: (result[special.field] || 0) + sign * delta };
    }
    return result;
  }

  function applyDivinity(state, selection, ctx, sign = 1) {
    return selection.reduce((s, { id, panelIndex }) => {
      const panel = getData(id).panels[panelIndex];
      return panel ? applyDivinityPanel(s, panel, id, ctx, sign) : s;
    }, { ...state });
  }

  const stripCurrentDivinity = (state, ctx) => {
    const currentSel = nodeOrder
      .filter(id => nodeData[id] && getUsed(id) != null)
      .map(id => ({ id, panelIndex: getUsed(id) }));
    return applyDivinity(state, currentSel, ctx, -1);
  };

  const isPanelActive = (id, p) =>
    p.divinity.some(Boolean) ||
    (!!specialNodes[id] && p.gold && p.lightning && p.divinity.length <= 1);

  const isNodeActive = id => {
    const d = getData(id);
    return d.panels.slice(0, d.count).some(p => isPanelActive(id, p)) ||
      (!!specialNodes[id] && getUsed(id) != null);
  };

  const getDivSummary = () => {
    const totals = {};
    for (const id of nodeOrder) {
      const usedIdx = getUsed(id);
      if (usedIdx == null) continue;
      const s = getData(id).panels[usedIdx];
      if (!s) continue;
      const quality = getQuality(s);
      for (const key of s.divinity) {
        if (!key) continue;
        const val = getStatVal(key, quality);
        if (val !== null) totals[key] = (totals[key] ?? 0) + val;
      }
    }
    return totals;
  };

  const renderSummaryModal = () => {
    const totals = getDivSummary();
    renderSummaryList(
      document.getElementById('summaryList'),
      Labels.STAT_OPTIONS.filter(o => totals[o.key] !== undefined).map(o => ({ lbl: o.label, val: fmtRawPct(totals[o.key]) }))
    );
  };

  function buildDivStatRowsHTML(panel) {
    const quality = getQuality(panel);
    return panel.divinity.filter(k => k).map(k => {
      const opt = Labels.STAT_OPTIONS_MAP.get(k);
      const val = getStatVal(k, quality);
      if (!opt || val === null) return '';
      return `<div class="co-div-modal-stat-row">
        <span class="co-div-modal-stat-lbl">${opt.label}</span>
        <span class="co-div-modal-stat-val">+${fmtRawPct(val)}</span>
      </div>`;
    }).join('') || '<div class="co-div-modal-empty">No divinity stats configured, flash with trash stats?</div>';
  }

  function buildDivNodesHTML(selection, currentDivByNode = null) {
    if (!selection?.length) return '';
    return selection.map(({ id, panelIndex }) => {
      const panel = getData(id).panels[panelIndex];
      if (!panel) return '';
      const quality     = getQuality(panel);
      const isChanged   = currentDivByNode != null && panelIndex !== currentDivByNode[id];
      const isLocked    = currentDivByNode != null && panel.locked;
      const circleClass = `co-div-circle quality-${quality}${panel.lightning ? ' has-lightning' : ''}`;
      return `<div class="co-div-node${isChanged ? ' co-div-changed' : ''}"
      data-nodeid="${id}" data-panelindex="${panelIndex}" data-changed="${isChanged}">
      <div class="${circleClass}">${icons.lightning}<span class="co-div-num">${panelIndex + 1}</span>${isChanged ? icons.vertSwap : ''}${isLocked ? icons.divLock : ''}</div>
      <span class="co-div-lbl">${NODE_NAMES[id].split(' ')[0]}</span>
    </div>`;
    }).join('');
  }

  function openDivModal({ nodeId, panelIndex, isChanged }) {
    const data  = getData(nodeId);
    const panel = data.panels[panelIndex];
    if (!panel) return;
    Dom.divModalFlash.hidden = !(panel.lightning && panel.gold);
    Dom.divModal.classList.remove('quality-blue', 'quality-purple', 'quality-gold');
    Dom.divModal.classList.add(`quality-${getQuality(panel)}`);
    const curUsedIdx     = getUsed(nodeId);
    const currentNum     = curUsedIdx != null ? curUsedIdx + 1 : null;
    const showComparison = isChanged && curUsedIdx != null && data.panels[curUsedIdx];
    Dom.divModalName.textContent = (isChanged && currentNum != null)
      ? `${NODE_NAMES[nodeId]} #${currentNum} \u00bb #${panelIndex + 1}`
      : `${NODE_NAMES[nodeId]} #${panelIndex + 1}`;
    Dom.divModalStatsCur.hidden = !showComparison;
    Dom.divModalArrow.hidden    = !showComparison;
    if (showComparison) Dom.divModalStatsCur.innerHTML = buildDivStatRowsHTML(data.panels[curUsedIdx]);
    Dom.divModalStatsRec.innerHTML = buildDivStatRowsHTML(panel);
    Dom.divModalStatsRec.hidden    = false;
    Dom.divModalBackdrop.classList.add('open');
  }

  const closeDivModal = () => Dom.divModalBackdrop.classList.remove('open');

  const bindDivModalNodes = container =>
    Modals.bindModalNodes(container, '.co-div-node', el => ({
      nodeId:     el.dataset.nodeid,
      panelIndex: parseInt(el.dataset.panelindex),
      isChanged:  el.dataset.changed === 'true',
    }), openDivModal);

  function writeBestDivinity(bestDivSelection) {
    for (const { id, panelIndex } of bestDivSelection) {
      setUsed(id, panelIndex);
      updateDivCircle(id);
    }
    save();
    if (!ui.activePanel || !ui.activeId) return;
    const useBtn = ui.activePanel.querySelector('.use-btn');
    if (useBtn) updateUseBtn(useBtn, getUsed(ui.activeId) === getData(ui.activeId).current);
  }

  return {
    nodeData,
    getQuality, getStatVal, fmtStatPct,
    defaultPanel, defaultSizeMap, defaultUsedBySize,
    getUsed, setUsed, isUsedInAnySize, canShowTrash,
    getData, save, load,
    updateDivCircle, setLockState, toggleTrashBtn, navigateTo,
    applyDeltas, applyDivinityStats, applyDivinityPanel, applyDivinity,
    stripCurrentDivinity, isPanelActive, isNodeActive,
    getDivSummary, renderSummaryModal,
    buildDivStatRowsHTML, buildDivNodesHTML,
    openDivModal, closeDivModal, bindDivModalNodes, writeBestDivinity,
    openPanel, closePanel,
  };
})();

const Cards = (() => {
  const { escHtml, parseStatPct, countBy, updateSelectsDisabled, buildLockSvg, bindCoPanelToggle } = Utils;
  const { isAtkExcluded, getBuffStatOptions } = Labels;
  const { numFields, equipSlots, slotCounts: SLOT_COUNTS, equipLabels: EQUIP_LABELS } = Config;

  const QTY_OPTIONS_HTML = Utils.numericOptionsHTML(6);

  const cardDeltaCache = new Map();

  const getCard     = name => (typeof cardData !== 'undefined' ? (cardData[name] ?? null) : null);
  const isValidCard = name => !!name && name !== '—';
  const filterValid = names => names.filter(isValidCard);

  const getWeaponSlotCount = () => (Dom.weapon.value === 'Dagger' ? 6 : equipSlots.weapon.count);
  const getSlotKey          = el => `${el.dataset.equip}_${el.dataset.slot}`;

  function buildPoolFromSection(section, adjustForLocked = null) {
    const equippedNames = [...section.querySelectorAll('.co-card-select')].map(input => input.dataset.value || '');

    const unusedMap = {};
    for (const row of section.querySelectorAll('.co-unused-row')) {
      const name = row.querySelector('.co-unused-name').dataset.value ?? '';
      const qty  = parseInt(row.querySelector('.co-unused-qty').value) || 1;
      if (name) unusedMap[name] = (unusedMap[name] || 0) + qty;
    }

    const poolMap   = {};
    const addToPool = (name, count) => {
      const card = getCard(name);
      if (!card) return;
      const slot = (poolMap[card.equip] ??= {});
      slot[name] = (slot[name] || 0) + count;
    };
    for (const name of equippedNames) if (name) addToPool(name, 1);
    for (const [name, qty] of Object.entries(unusedMap)) addToPool(name, qty);

    let cardPool = Object.fromEntries(
      Object.entries(poolMap).map(([e, m]) => [e, Object.entries(m).map(([name, qty]) => ({ name, qty }))])
    );

    if (adjustForLocked) {
      const lockedCopiesUsed = countBy(adjustForLocked);
      for (const equip of Object.keys(cardPool))
        cardPool[equip] = cardPool[equip]
          .map(({ name, qty }) => ({ name, qty: Math.max(0, qty - (lockedCopiesUsed[name] || 0)) }))
          .filter(c => c.qty > 0);
    }

    return { equippedNames, unusedMap, cardPool };
  }

  function updateCardSearchQuality(input) {
    input.classList.remove('card-q-white', 'card-q-blue', 'card-q-gold');
    const quality = input.dataset.value ? getCard(input.dataset.value)?.quality : null;
    if (quality) input.classList.add(`card-q-${quality}`);
  }

  function updateCardSelectQuality(sel) {
    sel.classList.remove('card-q-white', 'card-q-blue', 'card-q-gold');
    const quality = sel.value ? getCard(sel.value)?.quality : null;
    if (quality) sel.classList.add(`card-q-${quality}`);
  }

  function createCardSearch({ input, panel, getOptions, onSelect }) {
    let filtered     = [];
    let highlightIdx = -1;
    let debounce     = null;

    function renderPanel(list) {
      panel.innerHTML = '';
      highlightIdx = -1;
      if (!list.length) { panel.innerHTML = '<div class="co-card-search-empty">No results</div>'; return; }
      list.forEach(n => {
        const item = document.createElement('div');
        item.className   = 'co-card-search-item';
        item.textContent = n;
        const card = getCard(n);
        if (card?.quality) item.classList.add(`card-q-${card.quality}`);
        item.addEventListener('mousedown', e => { e.preventDefault(); selectCard(n); });
        panel.appendChild(item);
      });
    }

    function setHighlight(idx) {
      const items = panel.querySelectorAll('.co-card-search-item');
      items.forEach(el => el.classList.remove('co-card-search-highlighted'));
      if (idx >= 0 && items[idx]) {
        items[idx].classList.add('co-card-search-highlighted');
        items[idx].scrollIntoView({ block: 'nearest' });
      }
      highlightIdx = idx;
    }

    const openSearchPanel  = () => { filtered = getOptions(); renderPanel(filtered); panel.classList.add('open'); };
    const closeSearchPanel = () => { panel.classList.remove('open'); input.value = input.dataset.value; updateCardSearchQuality(input); };
    const selectCard = n  => {
      input.value = input.dataset.value = n;
      panel.classList.remove('open');
      updateCardSearchQuality(input);
      onSelect(n);
    };

    input.addEventListener('click', () => {
      if (panel.classList.contains('open')) { closeSearchPanel(); return; }
      input.select();
      openSearchPanel();
    });

    input.addEventListener('input', () => {
      input.dataset.value = '';
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = input.value.toLowerCase();
        filtered = q ? getOptions().filter(n => n.toLowerCase().includes(q)) : getOptions();
        renderPanel(filtered);
        panel.classList.add('open');
      }, 120);
    });

    input.addEventListener('keydown', e => {
      const items = panel.querySelectorAll('.co-card-search-item');
      if      (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(Math.min(highlightIdx + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight(Math.max(highlightIdx - 1, 0)); }
      else if (e.key === 'Enter')     { e.preventDefault(); if (highlightIdx >= 0 && filtered[highlightIdx]) selectCard(filtered[highlightIdx]); }
      else if (e.key === 'Escape')    { closeSearchPanel(); input.blur(); }
    });

    input.addEventListener('blur', () => { setTimeout(closeSearchPanel, 150); });
  }

  function bindEquipSlotSearch(input, section) {
    const equip      = input.dataset.equip;
    const allOptions = typeof cardData !== 'undefined'
      ? Object.keys(cardData).filter(n => cardData[n].equip === equip).sort()
      : [];
    createCardSearch({
      input,
      panel: input.nextElementSibling,
      getOptions: () => allOptions,
      onSelect: () => { updateCardSelectQuality(input); saveState(section); },
    });
  }

  function buildEquipGroupHTML(equip, label, count) {
    const slotsHTML = Array.from({ length: count }, (_, i) =>
      `<div class="co-slot">
        <span class="co-slot-lbl">Slot ${i + 1}</span>
        <div class="co-card-search">
          <input class="co-card-select co-card-search-input" type="text" placeholder="—" autocomplete="off" data-equip="${equip}" data-slot="${i}" data-value="">
          <div class="co-card-search-panel"></div>
        </div>
        <button class="co-lock-btn" type="button" data-equip="${equip}" data-slot="${i}" data-locked="false" title="Lock slot">${buildLockSvg(false)}</button>
      </div>`
    ).join('');
    return `<div class="co-equip-group" data-equip="${equip}"><div class="co-equip-lbl">${label}</div><div class="co-slots-row">${slotsHTML}</div></div>`;
  }

  const readBuffs    = section => [...section.querySelectorAll('.co-buff-row')].map(row => ({
    stat: row.querySelector('.co-buff-stat').value,
    val:  row.querySelector('.co-buff-val').value,
  }));
  const readEquipped = section => Object.fromEntries(
    [...section.querySelectorAll('.co-card-select')].map(sel => [getSlotKey(sel), sel.dataset.value ?? ''])
  );
  const readLocked   = section => Object.fromEntries(
    [...section.querySelectorAll('.co-lock-btn')].map(btn => [getSlotKey(btn), btn.dataset.locked === 'true'])
  );
  const readUnused   = section => [...section.querySelectorAll('.co-unused-row')].map(row => ({
    name: row.querySelector('.co-unused-name').dataset.value ?? '',
    qty:  row.querySelector('.co-unused-qty').value,
  }));

  function saveState(section) {
    try {
      const prev           = Store.section('cards');
      const equippedBySize = prev.equippedBySize ?? Divinity.defaultSizeMap();
      const lockedBySize   = prev.lockedBySize   ?? Divinity.defaultSizeMap();
      const unusedBySize   = prev.unusedBySize   ?? Divinity.defaultSizeMap(() => []);
      equippedBySize[ui.activeSize] = readEquipped(section);
      lockedBySize[ui.activeSize]   = readLocked(section);
      unusedBySize[ui.activeSize]   = readUnused(section);
      Store.write('cards', { equippedBySize, lockedBySize, unusedBySize, buffs: readBuffs(section) });
    } catch (err) {
      console.warn('Cards.saveState: failed to persist card state', err);
    }
  }

  function loadSizeToDOM(section, stored, size) {
    const equipped = (stored.equippedBySize || {})[size] || {};
    const locked   = (stored.lockedBySize   || {})[size] || {};
    const unused   = (stored.unusedBySize   || {})[size] || [];
    for (const input of section.querySelectorAll('.co-card-select')) {
      const val = equipped[getSlotKey(input)] ?? '';
      input.value = input.dataset.value = val;
      updateCardSelectQuality(input);
    }
    for (const btn of section.querySelectorAll('.co-lock-btn'))
      Divinity.setLockState(btn, !!(locked[getSlotKey(btn)]));
    section.querySelector('#co-unused-list').innerHTML = '';
    for (const { name, qty } of unused) addUnusedRow(section, name, qty);
  }

  const loadState = section => {
    try {
      const stored = Store.section('cards');
      loadSizeToDOM(section, stored, ui.activeSize);
      for (const { stat, val } of (stored.buffs || [])) addBuffRow(section, stat, val);
    } catch (err) {
      console.warn('Cards.loadState: failed to restore card state', err);
    }
  };

  const switchSize = section => {
    try { loadSizeToDOM(section, Store.section('cards'), ui.activeSize); }
    catch (err) { console.warn('Cards.switchSize: failed to reload card state for size change', err); }
  };

  function makeRow({ listSelector, html, populate, onRemove, section }) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const row = wrap.firstElementChild;
    populate(row);
    row.querySelector('.co-rm-btn').addEventListener('click', () => { row.remove(); onRemove?.(); });
    row.addEventListener('change', () => saveState(section));
    section.querySelector(listSelector).appendChild(row);
    return row;
  }

  function addBuffRow(section, stat = '', val = '') {
    const options = getBuffStatOptions().map(o => {
      const excl = isAtkExcluded(o.field) && o.field !== stat;
      return `<option value="${escHtml(o.field)}"${excl ? ' disabled' : ''}>${escHtml(o.label)}</option>`;
    }).join('');
    const html = `<div class="co-buff-row">
      <div class="select-wrap"><select class="co-buff-stat"><option value="">— Stat —</option>${options}</select></div>
      <input type="number" class="co-buff-val" placeholder="0" min="0" step="0.1">
      <button class="co-rm-btn" type="button">×</button>
    </div>`;
    return makeRow({
      listSelector: '#co-buff-list', html, section,
      populate: row => {
        if (stat) row.querySelector('.co-buff-stat').value = stat;
        if (val)  row.querySelector('.co-buff-val').value  = val;
      },
      onRemove: () => saveState(section),
    });
  }

  function rebuildBuffList() {
    const section  = Dom.coSection;
    const buffList = section.querySelector('#co-buff-list');
    if (!buffList) return;
    buffList.innerHTML = '';
    for (const { stat, val } of readBuffs(section)) addBuffRow(section, stat, val);
  }

  function addUnusedRow(section, name = '', qty = '1') {
    const allOptions = typeof cardData !== 'undefined' ? Object.keys(cardData).sort() : [];
    const html = `<div class="co-unused-row">
      <div class="co-card-search">
        <input class="co-unused-name co-card-search-input" type="text" placeholder="— Select Card —" autocomplete="off" data-value="">
        <div class="co-card-search-panel"></div>
      </div>
      <select class="co-unused-qty">${QTY_OPTIONS_HTML}</select>
      <button class="co-rm-btn" type="button">×</button>
    </div>`;
    const row = makeRow({
      listSelector: '#co-unused-list', html, section,
      populate: row => {
        if (name) {
          const input = row.querySelector('.co-unused-name');
          input.value = input.dataset.value = name;
          updateCardSearchQuality(input);
        }
        if (qty !== '1') row.querySelector('.co-unused-qty').value = qty;
      },
      onRemove: () => saveState(section),
    });
    const input = row.querySelector('.co-unused-name');
    createCardSearch({
      input,
      panel: row.querySelector('.co-card-search-panel'),
      getOptions: () => allOptions,
      onSelect: () => { updateCardSearchQuality(input); saveState(section); },
    });
    return row;
  }

  function getCardStatDelta(name, ctx) {
    const card = getCard(name);
    if (!card) return null;
    const cacheKey = `${name}|${ctx.atkType}|${ctx.wElem}|${ctx.tSize}|${ctx.tRace}|${ctx.tAttr}`;
    const cached = cardDeltaCache.get(cacheKey);
    if (cached) return cached;
    const delta = Object.fromEntries(numFields.map(f => [f, 0]));
    const skipStats = new Set(
      Config.statDedupGroups.flatMap(group => {
        const present = group.filter(s => s in card.stats);
        return present.length > 1 ? present.slice(1) : [];
      })
    );
    for (const [statName, rawVal] of Object.entries(card.stats)) {
      if (skipStats.has(statName)) continue;
      const field = Labels.STAT_RESOLVERS[statName]?.(ctx);
      if (!field) continue;
      const value = parseStatPct(rawVal);
      if (value !== null) delta[field] += value;
    }
    const result = { delta, equip: card.equip };
    cardDeltaCache.set(cacheKey, result);
    return result;
  }

  function applyCardStats(state, names, ctx, sign) {
    let result = { ...state };
    for (const name of names) {
      if (!name || name === '—') continue;
      const r = getCardStatDelta(name, ctx);
      if (!r) continue;
      for (const [field, val] of Object.entries(r.delta))
        if (field in result) result[field] = (result[field] || 0) + sign * val;
    }
    return result;
  }

  const stripCards = (state, names, ctx) => applyCardStats(state, names, ctx, -1);
  const applyCards = (state, names, ctx) => applyCardStats(state, names, ctx,  1);

  const getCardsEquipMap = names => {
    const map = {};
    for (const name of names) {
      if (!isValidCard(name)) continue;
      const card = getCard(name);
      if (!card) continue;
      const slot = (map[card.equip] ??= {});
      slot[name] = (slot[name] || 0) + 1;
    }
    return map;
  };

  function writeToSlots(bestCards, section) {
    const byEquip = {};
    for (const name of bestCards) {
      if (!name || name === '—') continue;
      const card = getCard(name);
      if (card) (byEquip[card.equip] ??= []).push(name);
    }
    for (const equip of Object.keys(SLOT_COUNTS)) {
      const inputs   = [...section.querySelectorAll(`.co-card-select[data-equip="${equip}"]`)];
      const recCards = byEquip[equip] || [];
      let nameIdx    = 0;
      for (const input of inputs) {
        const lockBtn = section.querySelector(`.co-lock-btn[data-equip="${equip}"][data-slot="${input.dataset.slot}"]`);
        if (lockBtn?.dataset.locked === 'true') continue;
        const val = recCards[nameIdx++] || '';
        input.value = input.dataset.value = val;
        updateCardSelectQuality(input);
      }
    }
    saveState(section);
  }

  function buildCardsHTML() {
    const equippedSlotsHTML = Object.entries(equipSlots)
      .map(([equip, { label, count }]) => buildEquipGroupHTML(equip, label, count))
      .join('');
    return `
      <div class="co-hd" role="button" tabindex="0" aria-expanded="false">
        <div class="co-hd-left"><span class="co-hd-title">Card & Buff</span></div>
        <span class="co-chevron">▾</span>
      </div>
      <div class="co-body collapsed" id="co-body-inner">
        <div class="co-body-inner">
          <div class="co-block">
            <div class="co-block-title">Equipped Card</div>
            <p class="co-block-desc">Select currently equipped cards. Lock slots if specific cards are needed for an exclusive set. <span class="spoiler">Pls ignore the color if differ vs in-game <img alt=":pepelaugh:" src="https://masihterjaga.github.io/sim/img/pepelaugh.png" width="12" height="12"></span></p>
            <div id="co-equipped-slots" class="co-equipped-wrap">${equippedSlotsHTML}</div>
            <div class="co-btn-group">
              <button class="co-action-btn muted" id="co-unequip-all" type="button">Unequip All</button>
            </div>
          </div>
          <div class="co-block">
            <div class="co-block-title">Card Pool</div>
            <p class="co-block-desc">Add unused cards relevant to your target to the pool. <span class="spoiler">Or any cards you're dreaming of and definitely can't afford, here you GO! <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="12" height="12"></span></p>
            <div id="co-unused-list" class="co-unused-list"></div>
            <div class="co-btn-group">
              <button class="co-action-btn blue"  id="co-add-unused"    type="button">+ Add Card</button>
              <button class="co-action-btn muted" id="co-dismantle-all" type="button">Dismantle All</button>
            </div>
          </div>
          <div class="co-block">
            <div class="co-block-title">Extra Buff</div>
            <p class="co-block-desc">It is highly recommended to add <span class="buff">Eternal Chaos (Bard/Dancer) or Glorious Command (GS)</span> bonus here.<br /><br />If there are exclusive effects (element enhance, damage bonus, etc.) from cards/equips, add them here. Make sure these haven't been included in the base inputs yet.<br /><br />Note that some effects are already included in your detailed stats (Nano Flying Blade, Acc Obs and Skeg 3*Set, One Punch Man Headgear, etc).</p>
            <div id="co-buff-list" class="co-buff-list"></div>
            <div class="co-btn-group">
              <button class="co-action-btn blue"  id="co-add-buff"        type="button">+ Add Buff</button>
              <button class="co-action-btn muted" id="co-clear-all-buffs" type="button">Clear All</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function rebuildWeaponSlots(section) {
    const wrap     = section.querySelector('#co-equipped-slots');
    const oldGroup = wrap.querySelector('[data-equip="weapon"]')?.closest('.co-equip-group') ?? wrap.firstElementChild;
    const count    = getWeaponSlotCount();
    const stored   = Store.section('cards');
    const equipped = (stored.equippedBySize || {})[ui.activeSize] || {};
    const locked   = (stored.lockedBySize   || {})[ui.activeSize] || {};
    const tmp      = document.createElement('div');
    tmp.innerHTML  = buildEquipGroupHTML('weapon', equipSlots.weapon.label, count);
    const newGroup = tmp.firstElementChild;
    newGroup.querySelectorAll('.co-card-select').forEach(input => {
      const val = equipped[`weapon_${input.dataset.slot}`] ?? '';
      input.value = input.dataset.value = val;
      updateCardSelectQuality(input);
      bindEquipSlotSearch(input, section);
    });
    newGroup.querySelectorAll('.co-lock-btn').forEach(btn => {
      Divinity.setLockState(btn, !!(locked[`weapon_${btn.dataset.slot}`]));
    });
    wrap.replaceChild(newGroup, oldGroup);
  }

  function bindCardsEvents(section) {
    bindCoPanelToggle(section.querySelector('.co-hd'));
    const equippedSlots = section.querySelector('#co-equipped-slots');
    const unusedList    = section.querySelector('#co-unused-list');
    const buffList      = section.querySelector('#co-buff-list');
    const save          = () => saveState(section);

    equippedSlots.addEventListener('click', e => {
      const btn = e.target.closest('.co-lock-btn');
      if (!btn) return;
      Divinity.setLockState(btn, btn.dataset.locked !== 'true');
      save();
    });
    for (const input of equippedSlots.querySelectorAll('.co-card-select'))
      bindEquipSlotSearch(input, section);

    section.querySelector('#co-add-buff').addEventListener('click',   () => { addBuffRow(section);   save(); });
    section.querySelector('#co-add-unused').addEventListener('click', () => { addUnusedRow(section); save(); });

    section.querySelector('#co-unequip-all').addEventListener('click', () => {
      if (!confirm('Unequip all cards?\n\nAll equipped cards (including locked slots) will be moved to the unused pool and slots will be unlocked. This does not update your input stats, re-enter them manually!')) return;
      const tally = {};
      section.querySelectorAll('.co-card-select').forEach(input => {
        const val = input.dataset.value;
        if (!val) return;
        tally[val] = (tally[val] || 0) + 1;
        input.value = input.dataset.value = '';
        updateCardSelectQuality(input);
      });
      section.querySelectorAll('.co-lock-btn').forEach(btn => Divinity.setLockState(btn, false));
      for (const [name, count] of Object.entries(tally)) {
        const existing = [...unusedList.querySelectorAll('.co-unused-name')].find(el => el.dataset.value === name);
        if (existing) {
          const qtySel = existing.closest('.co-unused-row').querySelector('.co-unused-qty');
          qtySel.value = Math.min(6, (parseInt(qtySel.value) || 0) + count);
        } else {
          addUnusedRow(section, name, String(Math.min(6, count)));
        }
      }
      save();
    });

    section.querySelector('#co-dismantle-all').addEventListener('click', () => {
      if (!confirm('Dismantle all unused cards? This cannot be undone.')) return;
      unusedList.innerHTML = ''; save();
    });
    section.querySelector('#co-clear-all-buffs').addEventListener('click', () => {
      if (!confirm('Remove all buffs?')) return;
      buffList.innerHTML = ''; save();
    });
  }

  function buildCardsBreakdownHTML(equipMap, lockedMap = {}, beforeEquipMap = null) {
    return Object.entries(equipMap).map(([equip, cards]) => {
      const lockedInEquip = lockedMap[equip]       || {};
      const beforeInEquip = beforeEquipMap?.[equip] || {};
      const chipsHTML = Object.entries(cards).map(([n, q]) => {
        const numLocked = Math.min(lockedInEquip[n] || 0, q);
        const numFree   = q - numLocked;
        const qClass    = ` card-q-${getCard(n)?.quality || 'white'}`;
        const parts     = [];
        if (numLocked > 0)
          parts.push(`<span class="co-chip co-chip--locked${qClass}"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">${Config.icons.lockClosed}</svg>${escHtml(n)}${numLocked > 1 ? `<span class="co-chip-qty"> ×${numLocked}</span>` : ''}</span>`);
        if (numFree > 0) {
          const freeCurrent = Math.max(0, (beforeInEquip[n] || 0) - (lockedInEquip[n] || 0));
          const swapIcon    = beforeEquipMap != null && numFree > freeCurrent ? Config.icons.horizSwap : '';
          parts.push(`<span class="co-chip${qClass}">${swapIcon}${escHtml(n)}${numFree > 1 ? `<span class="co-chip-qty"> ×${numFree}</span>` : ''}</span>`);
        }
        return parts.join('');
      }).join('');
      return `<div class="co-res-equip"><span class="co-res-equip-lbl">${EQUIP_LABELS[equip] ?? equip}</span><span class="co-res-cards">${chipsHTML}</span></div>`;
    }).join('') || Utils.EMPTY_STATE_HTML;
  }

  return {
    getCard, isValidCard, filterValid, cardDeltaCache,
    getWeaponSlotCount, getSlotKey, buildPoolFromSection,
    updateCardSearchQuality, updateCardSelectQuality,
    applyCards, stripCards, applyCardStats, getCardStatDelta,
    getCardsEquipMap, writeToSlots,
    buildEquipGroupHTML, buildCardsHTML, buildCardsBreakdownHTML,
    addBuffRow, rebuildBuffList, addUnusedRow,
    saveState, loadState, switchSize, loadSizeToDOM,
    bindEquipSlotSearch, bindCardsEvents, rebuildWeaponSlots,
    readBuffs, readEquipped, readLocked, readUnused,
    SLOT_COUNTS,
  };
})();

const Companion = (() => {
  const { fmtPct, escHtml, updateUseBtn, initSlider, updateSelectsDisabled, bindCoPanelToggle } = Utils;
  const { companionRates, companionStarMult, app, icons } = Config;
  const { companionSlots, maxCompanion, maxCompanionStats } = app;

  let items       = [];
  let usedBySlot  = {};
  let activeIdx   = null;
  let currentSlot = 0;

  const slides      = [...Dom.companionSection.querySelectorAll('.co-slide')];
  const addBtnLabel = Dom.companionAddBtn.closest('.companion-item-add-node').querySelector('.companion-item-dot-lbl');
  Dom.companionClearBtn.innerHTML = icons.trash;

  const defaultCompanionItem = () => ({
    stats:   Array(maxCompanionStats).fill(null),
    quality: 'purple',
    name:    null,
    star:    false,
  });

  function buildCompanionNodesHTML(assignment, currentUsed) {
    if (!items.length) return '';
    const parts = [];
    for (let s = 0; s < companionSlots; s++) {
      const recIdx = assignment[s] ?? null;
      if (recIdx == null) continue;
      const item = items[recIdx];
      if (!item) continue;
      const quality   = item.quality ?? '';
      const curIdx    = currentUsed[s] ?? null;
      const isChanged = recIdx !== curIdx;
      const recName   = item.name?.trim() || `Item ${recIdx + 1}`;
      parts.push(`<div class="co-companion-node${isChanged ? ' co-companion-changed' : ''}"
        data-slot="${s}" data-recidx="${recIdx}" data-curidx="${curIdx ?? ''}" data-changed="${isChanged}">
        <div class="co-companion-dot${quality ? ' quality-' + quality : ''}"><span>${s + 1}</span>${isChanged ? icons.companionSwap : ''}</div>
        <span class="co-companion-lbl">${escHtml(recName)}</span>
      </div>`);
    }
    return parts.join('');
  }

  function openCompanionModal({ slotIdx, recIdx, curIdx, isChanged }) {
    const recItem = recIdx != null ? items[recIdx] : null;
    const curItem = curIdx != null ? items[curIdx] : null;
    const recName = recItem ? (recItem.name?.trim() || `Item ${recIdx + 1}`) : '—';
    const curName = curItem ? (curItem.name?.trim() || `Item ${curIdx + 1}`) : null;
    const slotEl     = document.getElementById('coCompanionModalSlotName');
    const subtitleEl = document.getElementById('coCompanionModalSubtitle');
    const contentEl  = document.getElementById('coCompanionModalContent');
    slotEl.textContent = `Companion Slot ${slotIdx + 1}`;
    if (isChanged && curName) {
      subtitleEl.textContent = 'Item Change';
      contentEl.innerHTML = `
        <span class="co-companion-modal-item-name is-old">${escHtml(curName)}</span>
        <span class="co-companion-modal-arrow-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="co-companion-modal-item-name is-new">${escHtml(recName)}</span>`;
    } else {
      subtitleEl.textContent = 'Recommended Item';
      contentEl.innerHTML = `<span class="co-companion-modal-item-name is-new">${escHtml(recName)}</span>`;
    }
    Dom.coCompanionBackdrop.classList.add('open');
  }

  const bindCompanionModalNodes = container =>
    Modals.bindModalNodes(container, '.co-companion-node', el => ({
      slotIdx:   parseInt(el.dataset.slot),
      recIdx:    el.dataset.recidx !== '' ? parseInt(el.dataset.recidx) : null,
      curIdx:    el.dataset.curidx !== '' ? parseInt(el.dataset.curidx) : null,
      isChanged: el.dataset.changed === 'true',
    }), openCompanionModal);

  function initCompanionSlider() {
    bindCoPanelToggle(Dom.companionSection.querySelector('.co-hd'));
    initSlider(Dom.companionSection, slides, Dom.companionSlideLabel, null, idx => companionOnSlotChange(idx), '#companion-prev', '#companion-next');
  }

  const readSlideInputs    = () => slides.map(slide => [...slide.querySelectorAll('.stats-input')].map(inp => inp.value));
  const saveCompanionState = () => Store.write('companion', { items, usedBySlot, slideInputs: readSlideInputs() });

  function loadCompanionState() {
    try {
      const stored = Store.section('companion');
      if (!Object.keys(stored).length) return;
      if (Array.isArray(stored.items)) {
        items = stored.items.map(it => {
          const def = defaultCompanionItem();
          return { stats: Array.isArray(it.stats) ? it.stats : def.stats, quality: it.quality ?? def.quality, name: it.name ?? def.name, star: it.star ?? def.star };
        });
      }
      usedBySlot = Object.fromEntries(
        Object.entries(stored.usedBySlot ?? {})
          .map(([k, v]) => [Number(k), Number(v)])
          .filter(([slot, idx]) => Number.isFinite(slot) && Number.isFinite(idx) && idx < items.length)
      );
      if (Array.isArray(stored.slideInputs)) {
        stored.slideInputs.forEach((vals, si) => {
          if (!slides[si]) return;
          const inputs = slides[si].querySelectorAll('.stats-input');
          vals.forEach((v, vi) => { if (inputs[vi]) inputs[vi].value = v; });
        });
      }
    } catch (err) {
      console.warn('Companion.loadCompanionState: failed to restore companion state', err);
    }
  }

  function calcCompanionItemFields(item, rawVals, rates) {
    const result   = {};
    const starMult = item.star ? companionStarMult : 1;
    item.stats.forEach((key, i) => {
      if (!key) return;
      const rate = key === 'crit' ? rates.crit : rates.default;
      result[key] = (result[key] || 0) + rawVals[i] * rate * 100 * starMult;
    });
    return result;
  }

  function resolveCompanionSlot(slotIdx, itemIdx) {
    if (itemIdx == null) return null;
    const item = items[itemIdx];
    if (!item?.quality) return null;
    const rates  = companionRates[item.quality];
    const inputs = slides[slotIdx]?.querySelectorAll('.stats-input');
    if (!rates || !inputs) return null;
    const rawVals = [...inputs].map(inp => parseFloat(inp.value) || 0);
    return calcCompanionItemFields(item, rawVals, rates);
  }

  function applyCompanionStats(state, slotMap, sign) {
    let result = { ...state };
    for (let s = 0; s < companionSlots; s++) {
      const fieldVals = resolveCompanionSlot(s, slotMap[s] ?? null);
      if (fieldVals) for (const [field, val] of Object.entries(fieldVals))
        result[field] = (result[field] || 0) + sign * val;
    }
    return result;
  }

  const calcCompanionSlotValues = slotIdx => resolveCompanionSlot(slotIdx, usedBySlot[slotIdx] ?? null) ?? {};
  const getCompanionItemSlot    = itemIdx => {
    for (const [slot, itm] of Object.entries(usedBySlot)) {
      if (itm === itemIdx) return Number(slot);
    }
    return null;
  };
  const getCompanionItemName = idx => items[idx]?.name?.trim() || `Item ${idx + 1}`;

  const getCompanionBonuses = () => {
    const totals = {};
    for (let s = 0; s < companionSlots; s++) {
      const vals = calcCompanionSlotValues(s);
      for (const [field, val] of Object.entries(vals)) totals[field] = (totals[field] || 0) + val;
    }
    return totals;
  };
  const getCompanionItems = () => items;
  const getCompanionUsed  = () => usedBySlot;
  const applyCompanion    = (state, slotMap) => applyCompanionStats(state, slotMap,  1);
  const stripCompanion    = (state, slotMap) => applyCompanionStats(state, slotMap, -1);

  function writeCompanionAssign(assignment) {
    for (let s = 0; s < companionSlots; s++) usedBySlot[s] = null;
    for (const [s, idx] of Object.entries(assignment))
      if (idx != null) usedBySlot[Number(s)] = idx;
    items.forEach((_, i) => updateCompanionCircle(i));
    for (let s = 0; s < companionSlots; s++) updateCompanionSlideValues(s);
    saveCompanionState();
  }

  const calcCompanionAssignMult = (assignment, baseState) => {
    const stripped = stripCompanion(baseState, usedBySlot);
    return calculateMultiplier(applyCompanion(stripped, assignment)).mult;
  };

  function runCompanionOptimizer(baseState) {
    if (!items.length) return null;
    let bestMult   = -Infinity;
    let bestAssign = {};
    function backtrack(slotIdx, assign, usedItems) {
      if (slotIdx === companionSlots) {
        const m = calcCompanionAssignMult(assign, baseState);
        if (m > bestMult) { bestMult = m; bestAssign = { ...assign }; }
        return;
      }
      assign[slotIdx] = null;
      backtrack(slotIdx + 1, assign, usedItems);
      for (let i = 0; i < items.length; i++) {
        if (usedItems.has(i)) continue;
        assign[slotIdx] = i;
        usedItems.add(i);
        backtrack(slotIdx + 1, assign, usedItems);
        usedItems.delete(i);
      }
      assign[slotIdx] = null;
    }
    backtrack(0, {}, new Set());
    const currentUsed = { ...usedBySlot };
    const improved    = Object.keys(bestAssign).some(s => (bestAssign[s] ?? null) !== (currentUsed[s] ?? null));
    return { assignment: bestAssign, improved };
  }

  function updateCompanionSlideValues(slotIdx) {
    if (!slides[slotIdx]) return;
    let display   = slides[slotIdx].querySelector('.companion-slot-values');
    const vals    = calcCompanionSlotValues(slotIdx);
    const hasVals = Object.keys(vals).length > 0;
    if (!hasVals) { display?.remove(); return; }
    if (!display) {
      display = document.createElement('div');
      display.className = 'companion-slot-values';
      slides[slotIdx].appendChild(display);
    }
    const itemIdx2   = usedBySlot[slotIdx];
    const starActive = itemIdx2 != null && items[itemIdx2]?.star;
    display.innerHTML = Object.entries(vals).map(([field, val]) => {
      const lbl = Labels.COMPANION_FIELD_LABELS[field] || field;
      return `<div class="companion-slot-val-row">
        <span class="companion-slot-val-lbl">${lbl}</span>
        <span class="companion-slot-val-num">+${fmtPct(val)}%</span>
      </div>`;
    }).join('') + (starActive ? `<div class="companion-slot-val-row companion-slot-star-row"><span class="companion-slot-val-lbl companion-slot-star-lbl">${icons.star.repeat(4)}</span><span class="companion-slot-val-num companion-slot-val-num--star">×${companionStarMult}</span></div>` : '');
  }

  const updateAllCompanionSlides = () => { for (let s = 0; s < companionSlots; s++) updateCompanionSlideValues(s); };

  function companionOnSlotChange(slotIdx) {
    currentSlot = slotIdx;
    if (activeIdx != null) updateCompanionUseBtn();
    items.forEach((_, i) => updateCompanionCircle(i));
  }

  const getCompanionDotClasses = (item, idx, usedSlot) => {
    const cls = ['companion-item-dot'];
    if (item.quality)      cls.push(`quality-${item.quality}`);
    if (usedSlot != null)  cls.push('is-used');
    if (idx === activeIdx) cls.push('is-active-panel');
    return cls.join(' ');
  };

  function makeCircleEl(idx) {
    const item     = items[idx];
    const usedSlot = getCompanionItemSlot(idx);
    const node     = document.createElement('div');
    node.className   = `companion-item-node${item.stats.some(Boolean) ? ' has-stats' : ''}`;
    node.dataset.idx = idx;
    node.innerHTML   = `
      <div class="${getCompanionDotClasses(item, idx, usedSlot)}">${usedSlot != null ? String(usedSlot + 1) : ''}</div>
      <span class="companion-item-dot-lbl">${getCompanionItemName(idx)}</span>`;
    node.addEventListener('click', () => toggleCompanionSheet(idx));
    return node;
  }

  function renderCompanionCircles() {
    Dom.companionItemRow.querySelectorAll('.companion-item-node').forEach(el => el.remove());
    const addNode = Dom.companionItemRow.querySelector('.companion-item-add-node');
    items.forEach((_, idx) => Dom.companionItemRow.insertBefore(makeCircleEl(idx), addNode));
  }

  function updateCompanionCircle(idx) {
    if (idx == null || idx < 0 || idx >= items.length) return;
    const el = Dom.companionItemRow.querySelector(`.companion-item-node[data-idx="${idx}"]`);
    if (!el) return;
    const item     = items[idx];
    const usedSlot = getCompanionItemSlot(idx);
    el.classList.toggle('has-stats', item.stats.some(Boolean));
    const dot     = el.querySelector('.companion-item-dot');
    dot.className   = getCompanionDotClasses(item, idx, usedSlot);
    dot.textContent = usedSlot != null ? String(usedSlot + 1) : '';
    const lbl = el.querySelector('.companion-item-dot-lbl');
    if (lbl) lbl.textContent = getCompanionItemName(idx);
  }

  function updateCompanionQualityBtns() {
    const item = activeIdx != null ? items[activeIdx] : null;
    const q    = item?.quality ?? null;
    Dom.companionQPurple.classList.toggle('active', q === 'purple');
    Dom.companionQGold.classList.toggle('active',   q === 'gold');
    Dom.companionQStar.classList.toggle('active',   !!(item?.star));
  }

  function setCompanionQuality(q) {
    if (activeIdx == null) return;
    const item   = items[activeIdx];
    item.quality = item.quality === q ? null : q;
    updateCompanionQualityBtns();
    updateCompanionCircle(activeIdx);
    const slot = getCompanionItemSlot(activeIdx);
    if (slot != null) updateCompanionSlideValues(slot);
    saveCompanionState();
  }

  function setCompanionStar() {
    if (activeIdx == null) return;
    items[activeIdx].star = !items[activeIdx].star;
    updateCompanionQualityBtns();
    const slot = getCompanionItemSlot(activeIdx);
    if (slot != null) updateCompanionSlideValues(slot);
    saveCompanionState();
  }

  const updateCompanionUseBtn = () =>
    updateUseBtn(Dom.companionUseBtn, activeIdx != null && usedBySlot[currentSlot] === activeIdx);

  function openCompanionSheet(idx) {
    activeIdx = idx;
    Dom.companionSheetTitle.textContent = getCompanionItemName(idx);
    updateCompanionQualityBtns();
    updateCompanionUseBtn();
    renderCompanionSheetStats();
    Dom.companionItemPanel.classList.add('open');
    Dom.companionQualityBtns.style.visibility = 'visible';
    items.forEach((_, i) => updateCompanionCircle(i));
  }

  function closeCompanionSheet() {
    Dom.companionItemPanel.classList.remove('open');
    Dom.companionQualityBtns.style.visibility = 'hidden';
    const prev = activeIdx;
    activeIdx  = null;
    if (prev != null) updateCompanionCircle(prev);
  }

  function toggleCompanionSheet(idx) {
    if (activeIdx === idx) { closeCompanionSheet(); return; }
    const prev = activeIdx;
    openCompanionSheet(idx);
    if (prev != null) updateCompanionCircle(prev);
  }

  function renderCompanionSheetStats() {
    Dom.companionStatsWrap.innerHTML = '';
    const item = items[activeIdx];
    for (let i = 0; i < maxCompanionStats; i++)
      Dom.companionStatsWrap.appendChild(makeCompanionStatRow(item.stats[i] ?? null, i));
    updateCompanionSelects();
  }

  function rerenderCompanionSheet() { if (activeIdx != null) renderCompanionSheetStats(); }

  function makeCompanionStatRow(selectedKey, index) {
    const rowEl = document.createElement('div');
    rowEl.className = 'companion-sheet-stat-row';
    const lbl = document.createElement('span');
    lbl.className   = 'stats-label';
    lbl.textContent = `Stat ${index + 1}`;
    const sel = document.createElement('select');
    sel.className = 'companion-sheet-select';
    sel.innerHTML = '<option value="">— Select —</option>' +
      Labels.COMPANION_STAT_OPTIONS.map(o => {
        const excl = Labels.isAtkExcluded(o.key) && o.key !== selectedKey;
        return `<option value="${o.key}"${o.key === selectedKey ? ' selected' : ''}${excl ? ' disabled' : ''}>${o.label}</option>`;
      }).join('');
    sel.addEventListener('change', () => {
      items[activeIdx].stats[index] = sel.value || null;
      updateCompanionSelects();
      const slot = getCompanionItemSlot(activeIdx);
      if (slot != null) updateCompanionSlideValues(slot);
      updateCompanionCircle(activeIdx);
      saveCompanionState();
    });
    rowEl.appendChild(lbl);
    const selWrap = document.createElement('div');
    selWrap.className = 'select-wrap';
    selWrap.appendChild(sel);
    rowEl.appendChild(selWrap);
    return rowEl;
  }

  const updateCompanionSelects = () =>
    updateSelectsDisabled(Dom.companionStatsWrap, '.companion-sheet-select', () => items[activeIdx].stats, Labels.isAtkExcluded);

  function updateCompanionAddBtn() {
    const isMax                     = items.length >= maxCompanion;
    Dom.companionAddBtn.disabled    = isMax;
    Dom.companionAddBtn.textContent = isMax ? '' : '+';
    addBtnLabel.textContent         = isMax ? 'Max' : 'Add';
  }

  function updateCompanionClearBtn() {
    Dom.companionClearNode.style.display = items.length > 0 ? '' : 'none';
  }

  function initCompanionItems() {
    slides.forEach((slide, si) => {
      slide.querySelectorAll('.stats-input').forEach(inp => {
        inp.addEventListener('input', () => { updateCompanionSlideValues(si); saveCompanionState(); });
      });
    });

    Dom.companionQPurple.addEventListener('click', () => setCompanionQuality('purple'));
    Dom.companionQGold.addEventListener('click',   () => setCompanionQuality('gold'));
    Dom.companionQStar.addEventListener('click',   () => setCompanionStar());

    Dom.companionUseBtn.addEventListener('click', () => {
      if (activeIdx == null) return;
      if (usedBySlot[currentSlot] === activeIdx) {
        delete usedBySlot[currentSlot];
        updateCompanionSlideValues(currentSlot);
      } else {
        const prevSlot = getCompanionItemSlot(activeIdx);
        if (prevSlot != null) { delete usedBySlot[prevSlot]; updateCompanionSlideValues(prevSlot); }
        const prevItem = usedBySlot[currentSlot];
        if (prevItem != null) { delete usedBySlot[currentSlot]; updateCompanionCircle(prevItem); }
        usedBySlot[currentSlot] = activeIdx;
        updateCompanionSlideValues(currentSlot);
      }
      updateCompanionCircle(activeIdx);
      updateCompanionUseBtn();
      saveCompanionState();
    });

    Dom.companionRemoveBtn.addEventListener('click', () => {
      if (activeIdx == null) return;
      if (!confirm(`Remove Item ${activeIdx + 1}?`)) return;
      for (const [slot, itm] of Object.entries(usedBySlot)) {
        if (itm === activeIdx) { delete usedBySlot[slot]; updateCompanionSlideValues(Number(slot)); }
      }
      items.splice(activeIdx, 1);
      usedBySlot = Object.fromEntries(
        Object.entries(usedBySlot).map(([slot, itm]) => [slot, itm > activeIdx ? itm - 1 : itm])
      );
      closeCompanionSheet();
      renderCompanionCircles();
      updateCompanionAddBtn();
      saveCompanionState();
    });

    Dom.companionSheetClose.addEventListener('click', closeCompanionSheet);

    Dom.companionEditBtn.addEventListener('click', () => {
      if (activeIdx == null) return;
      Dom.companionSheetTitle.style.display = 'none';
      Dom.companionEditBtn.style.display    = 'none';
      const inp = document.createElement('input');
      inp.type      = 'text';
      inp.className = 'companion-sheet-title-input';
      inp.value     = getCompanionItemName(activeIdx);
      inp.maxLength = 24;
      Dom.companionSheetTitle.parentNode.insertBefore(inp, Dom.companionSheetTitle);
      inp.focus();
      inp.select();
      function commit() {
        const val                              = inp.value.trim();
        items[activeIdx].name                  = val || null;
        Dom.companionSheetTitle.textContent     = getCompanionItemName(activeIdx);
        Dom.companionSheetTitle.style.display   = Dom.companionEditBtn.style.display = '';
        inp.remove();
        updateCompanionCircle(activeIdx);
        saveCompanionState();
      }
      inp.addEventListener('blur', commit);
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter')  { e.preventDefault(); inp.blur(); }
        if (e.key === 'Escape') { inp.value = ''; inp.blur(); }
      });
    });

    Dom.companionClearBtn.addEventListener('click', () => {
      if (!confirm('Clear all companion items?')) return;
      items = [];
      usedBySlot = {};
      closeCompanionSheet();
      renderCompanionCircles();
      updateCompanionAddBtn();
      updateCompanionClearBtn();
      for (let s = 0; s < companionSlots; s++) updateCompanionSlideValues(s);
      saveCompanionState();

      if (!confirm('Also reset slot upgrade progress (the input fields)?')) return;
      for (let s = 0; s < companionSlots; s++) {
        if (slides[s]) slides[s].querySelectorAll('.stats-input').forEach(inp => { inp.value = ''; });
        updateCompanionSlideValues(s);
      }
      saveCompanionState();
    });

    Dom.companionAddBtn.addEventListener('click', () => {
      if (items.length >= maxCompanion) return;
      items.push(defaultCompanionItem());
      renderCompanionCircles();
      updateCompanionAddBtn();
      updateCompanionClearBtn();
      saveCompanionState();
    });

    loadCompanionState();
    if (!items.length) items.push(defaultCompanionItem());
    renderCompanionCircles();
    updateCompanionAddBtn();
    updateCompanionClearBtn();
    updateAllCompanionSlides();
  }

  return {
    defaultCompanionItem,
    buildCompanionNodesHTML, openCompanionModal, bindCompanionModalNodes,
    initCompanionSlider, initCompanionItems,
    apply:         applyCompanion,
    strip:         stripCompanion,
    runOptimizer:  runCompanionOptimizer,
    writeAssign:   writeCompanionAssign,
    getItems:      getCompanionItems,
    getUsed:       getCompanionUsed,
    getBonuses:    getCompanionBonuses,
    rerenderSheet: rerenderCompanionSheet,
  };
})();

const Enchant = (() => {
  const { enchantSixSlot, enchantValues, enchantOptions, ENCHANT_OPTIONS_MAP: EOMAP, enchantLevelHtml, enchantAwakeningPerLevel, app } = Config;

  const enchantState = {
    awakening: '',
    slots:     [],
    prefs:     { mode: 'chip', chip: [], custom: { awakening: '', slots: [] } },
  };

  const defaultEnchPrefs = () => ({ mode: 'chip', chip: [], custom: { awakening: '', slots: [] } });

  const save    = () => Store.write('enchantment', enchantState);
  const refresh = () => { if (Dom.enchSettingsPanel?.classList.contains('open')) renderSettingsPanel(); };

  const getEnchantLayout = weapon => {
    const is1H = enchantSixSlot.has(weapon);
    return is1H
      ? { slotCount: 6, groups: [{ label: 'Main Hand', range: [0, 3] }, { label: 'Off Hand', range: [3, 6] }] }
      : { slotCount: 3, groups: [{ label: '2Handed Enchantment', range: [0, 3] }] };
  };

  const getEnchantColForSlot = (weapon, slotIndex) => {
    if (weapon === 'Dagger') return 'Dagger';
    return enchantSixSlot.has(weapon) ? (slotIndex < 3 ? '1H' : 'Shield') : '2H';
  };

  const getAwkMult    = () => { const v = parseInt(Dom.enchAwakeningSelect?.value) || 0; return v > 0 ? (1 + v * enchantAwakeningPerLevel) : 1; };
  const getEnchantVal = (key, level, col, awkMult) => {
    const perLvl = enchantValues[key]?.[col];
    if (perLvl == null) return null;
    return +(perLvl * level * awkMult).toFixed(2);
  };

  function makeEnchantLabel(id, text) {
    const el = document.createElement('div');
    el.className = 'ench-section-title';
    el.id = id;
    el.textContent = text;
    return el;
  }

  function makeEnchantPairEl(savedEnchant, savedLevel) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="ench-pair">
      <div class="select-wrap"><select class="stats-select">${Labels.buildEnchantOptionsHTML(savedEnchant || '')}</select></div>
      <div class="select-wrap"><select class="stats-select">${enchantLevelHtml}</select></div>
    </div>`;
    const pair = wrap.firstElementChild;
    const [enchantSel, lvlSel] = pair.querySelectorAll('select');
    if (savedEnchant)  enchantSel.value = savedEnchant;
    if (savedLevel) lvlSel.value  = savedLevel;
    return pair;
  }

  function rebuildEnchantPairs(force = false) {
    const lines  = Dom.enchLines;
    if (!lines) return;
    const weapon = Dom.weapon.value;
    const { slotCount, groups } = getEnchantLayout(weapon);
    const pairs  = lines.querySelectorAll('.ench-pair');
    if (!force && pairs.length === slotCount) {
      pairs.forEach(pair => {
        const enchantSel = pair.querySelectorAll('select')[0];
        if (!enchantSel) return;
        const cur = enchantSel.value;
        enchantSel.innerHTML = Labels.buildEnchantOptionsHTML(cur);
        enchantSel.value = cur;
      });
      updateEnchantTotal();
      return;
    }
    const saved = enchantState.slots;
    lines.innerHTML = '';
    for (const { label, range: [start, end] } of groups) {
      lines.appendChild(makeEnchantLabel(`enchLbl_${start}`, label));
      for (let i = start; i < end; i++)
        lines.appendChild(makeEnchantPairEl(saved[i]?.enchant, saved[i]?.level));
    }
    updateEnchantTotal();
  }

  function readEnchantStateFromDOM() {
    enchantState.awakening = Dom.enchAwakeningSelect?.value || '';
    enchantState.slots     = [...Dom.enchLines.querySelectorAll('.ench-pair')].map(pair => {
      const sels = pair.querySelectorAll('select');
      return { enchant: sels[0]?.value || '', level: sels[1]?.value || '' };
    });
  }

  function loadEnchantState() {
    try {
      const stored           = Store.section('enchantment');
      enchantState.awakening = stored.awakening || '';
      enchantState.slots     = stored.slots     || [];
      const rawPrefs = stored.prefs;
      if (Array.isArray(rawPrefs)) {
        enchantState.prefs = defaultEnchPrefs();
        enchantState.prefs.chip = rawPrefs;
      } else if (rawPrefs && typeof rawPrefs === 'object') {
        enchantState.prefs = { mode: rawPrefs.mode || 'chip', chip: rawPrefs.chip || [], custom: rawPrefs.custom || { awakening: '', slots: [] } };
      } else {
        enchantState.prefs = defaultEnchPrefs();
      }
      if (Dom.enchAwakeningSelect && enchantState.awakening) Dom.enchAwakeningSelect.value = enchantState.awakening;
      rebuildEnchantPairs();
    } catch (err) {
      console.warn('Enchant.loadEnchantState: failed to restore enchantment state', err);
    }
  }

  function getEnchantSlotState() {
    const weapon  = Dom.weapon.value;
    const awkMult = getAwkMult();
    return [...Dom.enchLines.querySelectorAll('.ench-pair')].map((pair, i) => {
      const sels  = pair.querySelectorAll('select');
      const key   = sels[0]?.value || '';
      const level = parseInt(sels[1]?.value) || 0;
      const col   = getEnchantColForSlot(weapon, i);
      return { key, level, col, slotIdx: i, awkMult };
    });
  }

  const makeEnchantEntry = (key, level, col, awkMult) => {
    const opt = EOMAP.get(key);
    if (!opt) return null;
    const val = getEnchantVal(key, level, col, awkMult);
    if (val == null) return null;
    return { key, field: opt.type, val, label: opt.label, type: opt.type };
  };

  function getEnchantCandidates(slotState) {
    const prefs = enchantState.prefs;
    if (prefs.mode === 'custom') {
      const customSlots = prefs.custom?.slots || [];
      const v = parseInt(prefs.custom?.awakening) || 0;
      const customAwk = v > 0 ? (1 + v * enchantAwakeningPerLevel) : 1;
      return slotState.map(({ col, slotIdx }) => {
        const cs = customSlots[slotIdx];
        if (!cs?.enchant || !cs?.level) return [];
        const entry = makeEnchantEntry(cs.enchant, parseInt(cs.level), col, customAwk);
        return entry ? [entry] : [];
      });
    }
    return slotState.map(({ key, level, col, slotIdx, awkMult }) => {
      if (!level) return [];
      const poolKeys = new Set(prefs.chip[slotIdx] || []);
      if (key) poolKeys.add(key);
      return [...poolKeys].map(k => makeEnchantEntry(k, level, col, awkMult)).filter(Boolean);
    });
  }

  const getEnchantCurrentAssign = slotState =>
    slotState.map(({ key, level, col, awkMult }) =>
      (key && level) ? makeEnchantEntry(key, level, col, awkMult) : null
    );

  function updateEnchantTotal() {
    const lines = Dom.enchLines;
    if (!lines) return;
    const weapon  = Dom.weapon.value;
    const awkMult = getAwkMult();
    lines.querySelectorAll('.ench-pair').forEach((pair, i) => {
      const sels   = pair.querySelectorAll('select');
      const key    = sels[0]?.value;
      const level  = parseInt(sels[1]?.value);
      const valSel = sels[2];
      if (!key || !level) { if (valSel) valSel.options[0].text = '—'; return; }
      const col = getEnchantColForSlot(weapon, i);
      const val = getEnchantVal(key, level, col, awkMult);
      if (val == null) { if (valSel) valSel.options[0].text = '—'; return; }
      if (valSel) valSel.options[0].text = `${val}`;
    });
  }

  function applyEnchantStats(state, assignment, sign) {
    if (!assignment?.length) return state;
    const deltas = assignment.filter(s => s?.field).map(s => ({ field: s.field, val: s.val }));
    return Divinity.applyDeltas(state, deltas, sign);
  }

  const applyEnchant = (state, assign) => applyEnchantStats(state, assign,  1);
  const stripEnchant = (state, assign) => applyEnchantStats(state, assign, -1);

  function writeEnchantToDOM(bestEnchantAssign) {
    if (!bestEnchantAssign?.length) return;
    [...Dom.enchLines.querySelectorAll('.ench-pair')].forEach((pair, i) => {
      const slot = bestEnchantAssign[i];
      if (!slot) return;
      const enchantSel = pair.querySelectorAll('select')[0];
      if (enchantSel && slot.key) enchantSel.value = slot.key;
    });
    enchantState.prefs.chip = [];
    readEnchantStateFromDOM();
    save();
    updateEnchantTotal();
  }

  function renderSettingsPanel() {
    const inner  = Dom.enchSettingsInner;
    if (!inner) return;
    const weapon = Dom.weapon.value;
    const { slotCount, groups } = getEnchantLayout(weapon);
    const prefs    = enchantState.prefs;
    const isCustom = prefs.mode === 'custom';

    inner.innerHTML = '';

    const modeBtn = document.createElement('button');
    modeBtn.type        = 'button';
    modeBtn.className   = 'ench-mode-btn' + (isCustom ? ' active' : '');
    modeBtn.textContent = isCustom ? 'Back to Chip' : 'Switch to Custom';
    modeBtn.addEventListener('click', () => {
      const panel = Dom.enchSettingsPanel;
      panel.classList.remove('open');
      panel.addEventListener('transitionend', () => {
        enchantState.prefs.mode = enchantState.prefs.mode === 'custom' ? 'chip' : 'custom';
        save();
        setTimeout(() => { renderSettingsPanel(); panel.classList.add('open'); }, 120);
      }, { once: true });
    });
    inner.appendChild(modeBtn);

    const desc = document.createElement('p');
    desc.className   = 'co-block-desc';
    desc.textContent = isCustom
      ? 'Try your own combination before creating new sets or transferring. Physical Suno/Meister can switch the weapon option to GS or One-Handed Staff (Weapon Perfection).'
      : 'Select up to 3 enchants per slot. Tool will find the best option based on your choices. Switch to custom mode for more flexibility.';
    inner.appendChild(desc);

    if (isCustom) {
      const customPrefs = prefs.custom;
      const customAwk   = customPrefs.awakening || '';
      const customSlots = customPrefs.slots || [];
      const pairsWrap   = document.createElement('div');
      pairsWrap.className = 'ench-lines';
      let awkSel;

      for (const { label, range: [start, end] } of groups) {
        pairsWrap.appendChild(makeEnchantLabel(`customEnchLbl_${start}`, label));
        for (let i = start; i < end; i++) {
          const cs = customSlots[i] || { enchant: '', level: '' };
          pairsWrap.appendChild(makeEnchantPairEl(cs.enchant, cs.level));
        }
      }
      inner.appendChild(pairsWrap);

      const awkField = document.createElement('div');
      awkField.className = 'stats-field';
      const awkLabel = document.createElement('label');
      awkLabel.className   = 'stats-label';
      awkLabel.textContent = 'Awakening';
      const awkRow     = document.createElement('div');
      awkRow.className = 'ench-awakening-row';
      const awkSelWrap = document.createElement('div');
      awkSelWrap.className = 'select-wrap';
      awkSel = document.createElement('select');
      awkSel.className = 'stats-select';
      awkSel.innerHTML = '<option value="" disabled selected>Select</option>' + Utils.numericOptionsHTML(10);
      if (customAwk) awkSel.value = customAwk;
      awkSelWrap.appendChild(awkSel);
      awkRow.appendChild(awkSelWrap);
      awkField.appendChild(awkLabel);
      awkField.appendChild(awkRow);
      inner.appendChild(awkField);

      const saveCustom = () => {
        const slots = [];
        pairsWrap.querySelectorAll('.ench-pair').forEach((pair, i) => {
          const sels = pair.querySelectorAll('select');
          slots[i] = { enchant: sels[0]?.value || '', level: sels[1]?.value || '' };
        });
        enchantState.prefs.custom = { awakening: awkSel.value, slots };
        save();
      };
      awkSel.addEventListener('change', saveCustom);
      pairsWrap.addEventListener('change', saveCustom);
    } else {
      const prevActiveTab = inner.querySelector('.ench-tab-btn.active');
      let activeTab       = prevActiveTab ? parseInt(prevActiveTab.dataset.tab) : 0;
      if (activeTab >= slotCount) activeTab = 0;

      const tabLabels = groups.flatMap(({ label, range: [start, end] }) => {
        const prefix = label.includes('Main') ? 'MH' : label.includes('Off') ? 'OH' : 'Slot';
        return Array.from({ length: end - start }, (_, i) => `${prefix} ${i + 1}`);
      });

      const tabBar = document.createElement('div');
      tabBar.className = 'ench-tab-bar';
      for (let i = 0; i < slotCount; i++) {
        const btn = document.createElement('button');
        btn.className   = 'ench-tab-btn' + (i === activeTab ? ' active' : '');
        btn.textContent = tabLabels[i];
        btn.dataset.tab = i;
        btn.type        = 'button';
        btn.addEventListener('click', () => {
          tabBar.querySelectorAll('.ench-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          inner.querySelectorAll('.ench-tab-panel').forEach(p =>
            p.classList.toggle('active', p.dataset.tab === btn.dataset.tab)
          );
        });
        tabBar.appendChild(btn);
      }
      inner.appendChild(tabBar);

      const allPairs     = [...Dom.enchLines.querySelectorAll('.ench-pair')];
      const enchExclType = Labels.getEnchantExcludedType();
      for (let i = 0; i < slotCount; i++) {
        const raw         = prefs.chip[i] || [];
        const checked     = new Set(raw.slice(0, app.maxEnchPrefs));
        const atMax       = checked.size >= app.maxEnchPrefs;
        const curEnchant  = allPairs[i]?.querySelectorAll('select')[0]?.value || '';
        const panel = document.createElement('div');
        panel.className   = 'ench-tab-panel' + (i === activeTab ? ' active' : '');
        panel.dataset.tab = i;
        enchantOptions.forEach(opt => {
          if (opt.value === curEnchant) return;
          const isExcl    = opt.type === enchExclType;
          const isChecked = checked.has(opt.value);
          const disable   = (atMax && !isChecked) || (isExcl && !isChecked);
          const row = document.createElement('label');
          row.className = 'ench-check-row' + (disable ? ' ench-check-disabled' : '');
          const cb = document.createElement('input');
          cb.type         = 'checkbox';
          cb.value        = opt.value;
          cb.checked      = isChecked;
          cb.disabled     = disable;
          cb.dataset.slot = i;
          const lbl = document.createElement('span');
          lbl.className   = 'ench-check-label';
          lbl.textContent = Labels.getEnchantOptLabel(opt);
          row.appendChild(cb);
          row.appendChild(lbl);
          panel.appendChild(row);
        });
        inner.appendChild(panel);
      }

      inner.addEventListener('change', e => {
        const cb = e.target;
        if (cb.type !== 'checkbox') return;
        const slotIdx = parseInt(cb.dataset.slot);
        const allCbs  = [...inner.querySelectorAll(`input[type="checkbox"][data-slot="${slotIdx}"]`)];
        if (allCbs.filter(c => c.checked).length > app.maxEnchPrefs) cb.checked = false;
        const atMax    = allCbs.filter(c => c.checked).length >= app.maxEnchPrefs;
        const exclType = Labels.getEnchantExcludedType();
        allCbs.forEach(c => {
          const isExcl  = EOMAP.get(c.value)?.type === exclType;
          const disable = (atMax && !c.checked) || (isExcl && !c.checked);
          c.disabled = disable;
          c.closest('.ench-check-row').classList.toggle('ench-check-disabled', disable);
        });
        enchantState.prefs.chip = Array.from({ length: slotCount }, (_, s) =>
          [...inner.querySelectorAll(`input[type="checkbox"][data-slot="${s}"]`)]
            .filter(c => c.checked).map(c => c.value)
        );
        save();
      });
    }
  }

  function buildEnchantSectionHTML(assign, slotState, compareAssign = null) {
    const weapon     = Dom.weapon.value;
    const { groups } = getEnchantLayout(weapon);
    let hasChanged   = false;

    const getEnchantRowLabel = entry => {
      const opt = entry ? EOMAP.get(entry.key) : null;
      return opt ? Labels.getEnchantOptLabel(opt) : (entry?.key ?? '-');
    };

    const buildEnchantRow = (entry, slotIdx, slot) => {
      const isChanged    = compareAssign != null && (entry?.key ?? null) !== (compareAssign[slotIdx]?.key ?? null);
      if (isChanged) hasChanged = true;
      const label        = getEnchantRowLabel(entry);
      const changedClass = isChanged ? ' co-ench-changed' : '';
      const num          = (slotIdx % 3) + 1;
      const rawVal       = entry ? getEnchantVal(entry.key, slot.level, slot.col, 1) : null;
      const valStr       = rawVal != null ? `${Utils.fmtPct(rawVal)}%` : '';
      return `<div class="co-ench-row${changedClass}"><span class="co-ench-num">${num}</span><span class="co-ench-val">Lv.${slot.level}${label}</span><span class="co-ench-lvl">${valStr ? `+${valStr}` : ''}</span></div>`;
    };

    let bodyHTML;
    if (groups.length > 1) {
      const parts = groups.map(({ label, range: [start, end] }) => {
        const rows = slotState.slice(start, end)
          .map((slot, j) => slot.level ? buildEnchantRow(assign[start + j], start + j, slot) : null)
          .filter(Boolean);
        return rows.length ? `<div class="co-ench-group-hdr">${label}</div>${rows.join('')}` : '';
      }).filter(Boolean);
      bodyHTML = parts.length ? parts.join('') : null;
    } else {
      const rows = slotState.map((slot, i) => slot.level ? buildEnchantRow(assign[i], i, slot) : null).filter(Boolean);
      bodyHTML = rows.length ? rows.join('') : null;
    }

    const title = compareAssign != null && !hasChanged ? 'Enchantment (No Change)' : 'Enchantment';
    return Utils.buildResSectionHTML(title, bodyHTML && `<div class="co-ench-result-list">${bodyHTML}</div>`, Utils.EMPTY_STATE_HTML);
  }

  return {
    enchantState, defaultEnchPrefs,
    save, refresh,
    getEnchantLayout, getEnchantColForSlot, getAwkMult, getEnchantVal,
    makeEnchantLabel, makeEnchantPairEl,
    rebuildEnchantPairs, readEnchantStateFromDOM, loadEnchantState,
    getEnchantSlotState, makeEnchantEntry, getEnchantCandidates, getEnchantCurrentAssign,
    updateEnchantTotal, applyEnchantStats, applyEnchant, stripEnchant,
    writeEnchantToDOM, renderSettingsPanel, buildEnchantSectionHTML,
  };
})();

const Stats = (() => {
  const { fmtPct, labelWithVal } = Utils;
  const { getElemEnhLabel } = Labels;
  const { numFields, snapFields } = Config;

  const showMsg     = (html, type) => { Dom.msg.innerHTML = html; Dom.msg.className = `stats-msg ${type} show`; };
  const setFormOpen = open => { Dom.form.classList.toggle('open', open); Dom.manualBtn.classList.toggle('active', open); };

  function saveStatsState() {
    Store.write('stats', {
      targetDef: Dom.tDef.value,
      weapon:    Dom.weapon.value,
      wElem:     Dom.wElem.value,
      atkType:   Dom.atkType.value,
      ...Object.fromEntries(numFields.map(f => [f, Dom[f].value])),
    });
  }

  function initSelect(sel, keys) {
    const frag = document.createDocumentFragment();
    for (const key of keys) {
      const opt = document.createElement('option');
      opt.value = opt.textContent = key;
      frag.appendChild(opt);
    }
    sel.appendChild(frag);
  }

  function updateTargetLabels(key) {
    const data = DEFENSE_TABLE[key] ?? {};
    Dom.dmgSizeLabel.textContent = labelWithVal('DMG to Size', data.sizeMob);
    Dom.dmgRaceLabel.textContent = labelWithVal('DMG to Race', data.raceMob);
    Dom.dmgAttrLabel.textContent = labelWithVal('DMG to Attribute', data.attributeMob);
    Dom.tSize.innerHTML = `<option>${data.sizeMob      ?? '—'}</option>`;
    Dom.tRace.innerHTML = `<option>${data.raceMob      ?? '—'}</option>`;
    Dom.tAttr.innerHTML = `<option>${data.attributeMob ?? '—'}</option>`;
    Dom.tFinalDef.innerHTML = `<option>${data.def    ?? '—'}</option>`;
    Dom.tDmgRed.innerHTML   = `<option>${data.dmgred ?? '—'}</option>`;
  }

  function updateActiveSize() {
    const sizeKey = { Small: 'small', Medium: 'medium', Large: 'large' }[Dom.tSize.value] ?? '';

    if (Dom.divSizeSelect) Dom.divSizeSelect.value = sizeKey;
    if (sizeKey === ui.activeSize) return;
    ui.activeSize = sizeKey || '';
    Config.nodeOrder.forEach(Divinity.updateDivCircle);
    if (Dom.coSection.querySelector('.co-card-select')) Cards.switchSize(Dom.coSection);
  }

  function loadStatsState() {
    try {
      const stats = Store.section('stats');
      if (!Object.keys(stats).length) return;
      if (stats.targetDef) { Dom.tDef.value = stats.targetDef; updateTargetLabels(stats.targetDef); updateActiveSize(); }
      if (stats.weapon)    { Dom.weapon.value = stats.weapon; if (Dom.coSection?.querySelector('.co-card-select')) Cards.rebuildWeaponSlots(Dom.coSection); }
      if (stats.wElem)     { Dom.wElem.value = stats.wElem; Dom.elemEnhanceLabel.textContent = getElemEnhLabel(); }
      const atkType = stats.atkType ?? 'pen';
      Dom.atkType.value    = atkType;
      Dom.penField.hidden  = atkType !== 'pen';
      Dom.critField.hidden = atkType === 'pen';
      for (const f of numFields) { if (stats[f]) Dom[f].value = stats[f]; }
    } catch (err) {
      console.warn('Stats.loadStatsState: failed to restore stats form state', err);
    }
  }

  function loadStatsFromSnap(snap) {
    const f = snap.form;
    Dom.tDef.value    = f.targetDefSelect?.value     ?? '';
    Dom.weapon.value  = f.weaponSelect?.value        ?? '';
    Dom.wElem.value   = f.weaponElementSelect?.value ?? '';
    Dom.atkType.value = f.penCritSelect?.value       ?? 'pen';
    Dom.atkType.dispatchEvent(new Event('change'));
    for (const [el, key] of Object.entries(snapFields)) Dom[el].value = f[key] ?? '';
    Dom.elemEnhanceLabel.textContent = getElemEnhLabel();
    updateTargetLabels(Dom.tDef.value);
    updateActiveSize();
    saveStatsState();
  }

  function buildStatsState() {
    const tDefKey    = Dom.tDef.value || '';
    const target     = DEFENSE_TABLE[tDefKey] ?? {};
    const wElemVal   = Dom.wElem.value || '';
    const tAttrVal   = target.attributeMob ?? '';
    const partialCtx = { wElem: wElemVal, tAttr: tAttrVal };
    const specialVals = Object.fromEntries(
      Object.entries(Config.specialNodes).map(([id, spec]) => {
        const usedIdx = Divinity.getUsed(id);
        const panel   = usedIdx != null ? Divinity.getData(id).panels[usedIdx] : null;
        return [spec.field, panel ? spec.calcValue(partialCtx, panel) : 0];
      })
    );
    return {
      ...Object.fromEntries(numFields.map(k => [k, parseFloat(Dom[k].value) || 0])),
      atkType: Dom.atkType.value,
      weapon:  Dom.weapon.value || '',
      wElem:   wElemVal,
      tDefKey,
      tSize:   target.sizeMob  ?? '',
      tRace:   target.raceMob  ?? '',
      tAttr:   tAttrVal,
      ...specialVals,
    };
  }

  function writeStatsToForm(finalState, buffMap) {
    const fmt = v => fmtPct(v).replace(/\.?0+$/, '');
    const net = f => (finalState[f] ?? 0) - (buffMap[f] || 0);
    if (Dom.atkType.value === 'pen') Dom.pen.value  = fmt(net('pen'));
    else                             Dom.crit.value = fmt(net('crit'));
    for (const f of ['dmg', 'elemEnh', 'sizeEnh', 'race', 'attr', 'dmgStack'])
      Dom[f].value = fmt(net(f));
    saveStatsState();
    setFormOpen(true);
  }

  return {
    showMsg, setFormOpen, saveStatsState, initSelect,
    updateTargetLabels, updateActiveSize,
    loadStatsState, loadStatsFromSnap, buildStatsState, writeStatsToForm,
  };
})();

const Optimizer = (() => {
  const { runWithStrategy, countBy, buildLoadingHTML, escHtml } = Utils;
  const { SLOT_COUNTS } = Cards;
  const { nodeOrder, specialNodes, app, loaderTiming } = Config;

  const calcMult = state => calculateMultiplier(state).mult;

  const countDivCombos = () =>
    nodeOrder.filter(id => Divinity.nodeData[id] && Divinity.isNodeActive(id)).reduce((acc, id) => {
      const d = Divinity.getData(id), usedIdx = Divinity.getUsed(id);
      return acc * (usedIdx != null && d.panels[usedIdx]?.locked ? 1 : d.count);
    }, 1);

  const countCompanionCombos = companionItemCount =>
    Array.from({ length: app.companionSlots }, (_, i) => Math.max(1, companionItemCount - i + 1))
      .reduce((a, b) => a * b, 1);

  const countEnchantCombos = enchantCandidates =>
    enchantCandidates.reduce((acc, c) => acc * (c.length + 1), 1);

  function genEquipCombinations(pool, slots) {
    if (slots <= 0 || pool.length === 0) return [[]];
    const results = [];
    function backtrack(startIdx, current, remaining) {
      results.push([...current]);
      if (remaining === 0 || startIdx >= pool.length) return;
      for (let i = startIdx; i < pool.length; i++) {
        const { name, qty } = pool[i];
        const maxUse = Math.min(qty, remaining);
        for (let use = 1; use <= maxUse; use++) {
          for (let j = 0; j < use; j++) current.push(name);
          backtrack(i + 1, current, remaining - use);
          for (let j = 0; j < use; j++) current.pop();
        }
      }
    }
    backtrack(0, [], slots);
    return results;
  }

  function genCardCombos(cardPool, slotCounts) {
    const equipTypes     = Object.keys(SLOT_COUNTS).filter(e => (slotCounts[e] ?? 0) > 0);
    const combosPerEquip = {};
    let totalCombos      = 1;
    let overflowed       = false;
    for (const equip of equipTypes) {
      const pool = (cardPool[equip] || []).filter(c => c.qty > 0);
      combosPerEquip[equip] = genEquipCombinations(pool, slotCounts[equip] || 0);
      totalCombos *= combosPerEquip[equip].length;
      if (totalCombos > app.maxEvalLimit) { overflowed = true; break; }
    }
    return { equipTypes, combosPerEquip, totalCombos, overflowed };
  }

  function runCardsExact(baseState, combosPerEquip, equipTypes, ctx, currentMult) {
    let bestMult  = currentMult;
    let bestCards = null;
    const cardsSoFar = [];
    (function recurse(equipIdx, currentState) {
      if (equipIdx === equipTypes.length) {
        const m = calcMult(currentState);
        if (m > bestMult) { bestMult = m; bestCards = [...cardsSoFar]; }
        return;
      }
      for (const combo of combosPerEquip[equipTypes[equipIdx]]) {
        const nextState = Cards.applyCards(currentState, combo, ctx);
        if (equipIdx === equipTypes.length - 1 && calcMult(nextState) <= bestMult) continue;
        for (const c of combo) cardsSoFar.push(c);
        recurse(equipIdx + 1, nextState);
        cardsSoFar.length -= combo.length;
      }
    })(0, baseState);
    return bestCards ? { topResults: [{ cards: bestCards, mult: bestMult }] } : { topResults: [] };
  }

  function runCardsGreedy(baseState, equipTypes, ctx, combosPerEquip) {
    let runningState   = { ...baseState };
    const bestPerEquip = {};
    for (const equip of equipTypes) {
      const combos = combosPerEquip[equip];
      let bestMult  = -Infinity;
      let bestCombo = [];
      for (const combo of combos) {
        const m = calcMult(Cards.applyCards(runningState, combo, ctx));
        if (m > bestMult) { bestMult = m; bestCombo = combo; }
      }
      bestPerEquip[equip] = bestCombo;
      runningState = Cards.applyCards(runningState, bestCombo, ctx);
    }
    const allBest = Object.values(bestPerEquip).flat();
    return { topResults: [{ cards: allBest, mult: calcMult(Cards.applyCards(baseState, allBest, ctx)) }] };
  }

  function runCardsOptimizer(baseState, cardPool, slotCounts, ctx, currentMult, prebuilt) {
    const { equipTypes, combosPerEquip, totalCombos, overflowed } = prebuilt ?? genCardCombos(cardPool, slotCounts);
    return runWithStrategy(
      overflowed ? app.maxEvalLimit + 1 : totalCombos,
      () => runCardsExact(baseState, combosPerEquip, equipTypes, ctx, currentMult),
      () => runCardsGreedy(baseState, equipTypes, ctx, combosPerEquip)
    );
  }

  function runDivinityOptimizer(cardState, ctx) {
    const activeNodes = nodeOrder.filter(id => Divinity.nodeData[id] && Divinity.isNodeActive(id));
    if (!activeNodes.length) return null;
    const pools = activeNodes.map(id => {
      const d       = Divinity.getData(id);
      const usedIdx = Divinity.getUsed(id);
      if (usedIdx != null && d.panels[usedIdx]?.locked)
        return { id, entries: [{ panel: d.panels[usedIdx], idx: usedIdx }] };
      return { id, entries: d.panels.slice(0, d.count).map((panel, i) => ({ panel, idx: i })) };
    });
    const base        = { ...cardState, ...Object.fromEntries(Object.values(specialNodes).map(s => [s.field, 0])) };
    const totalCombos = pools.reduce((acc, p) => acc * p.entries.length, 1);
    let bestMult      = -Infinity;
    let bestSelection = null;
    runWithStrategy(totalCombos,
      () => {
        (function recurse(poolIdx, sel, state) {
          if (poolIdx === pools.length) {
            const m = calcMult(state);
            if (m > bestMult) { bestMult = m; bestSelection = sel.map(s => ({ ...s })); }
            return;
          }
          const { id, entries } = pools[poolIdx];
          for (const { panel, idx } of entries) {
            sel.push({ id, panelIndex: idx });
            recurse(poolIdx + 1, sel, Divinity.applyDivinityPanel(state, panel, id, ctx));
            sel.pop();
          }
        })(0, [], base);
      },
      () => {
        let running = { ...base };
        bestSelection = [];
        for (const { id, entries } of pools) {
          let localBest = -Infinity, localIdx = entries[0].idx, localPanel = entries[0].panel;
          for (const { panel, idx } of entries) {
            const m = calcMult(Divinity.applyDivinityPanel(running, panel, id, ctx));
            if (m > localBest) { localBest = m; localIdx = idx; localPanel = panel; }
          }
          bestSelection.push({ id, panelIndex: localIdx });
          running = Divinity.applyDivinityPanel(running, localPanel, id, ctx);
        }
        bestMult = calcMult(Divinity.applyDivinity(base, bestSelection, ctx));
      }
    );
    return {
      bestSelection: bestSelection ?? activeNodes.map(id => ({ id, panelIndex: Divinity.getUsed(id) ?? 0 })),
      bestMult,
    };
  }

  function runEnchantOptimizer(baseState, candidates, initialAssignment) {
    if (!candidates?.length || candidates.every(c => !c.length)) return null;
    let assignment = initialAssignment.map((cur, i) => {
      if (!candidates[i]?.length) return null;
      return candidates[i].find(c => c.key === cur?.key) ?? candidates[i][0] ?? null;
    });
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < candidates.length; i++) {
        if (!candidates[i]?.length) continue;
        const baseWithOthers = { ...baseState };
        for (let j = 0; j < assignment.length; j++) {
          if (j === i) continue;
          const a = assignment[j];
          if (a?.field) baseWithOthers[a.field] = (baseWithOthers[a.field] || 0) + a.val;
        }
        let bestMult = -Infinity;
        let bestCand = assignment[i];
        for (const cand of candidates[i]) {
          const testState = { ...baseWithOthers };
          if (cand?.field) testState[cand.field] = (testState[cand.field] || 0) + cand.val;
          const mult = calcMult(testState);
          if (mult > bestMult) { bestMult = mult; bestCand = cand; }
        }
        if (bestCand?.key !== assignment[i]?.key) { assignment[i] = bestCand; changed = true; }
      }
    }
    return assignment;
  }

  function runCoordinateDescent(pureBase, lockedBaseState, cardPool, slotCounts, allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx, prebuilt, enchantCandidates, currentEnchantAssign) {
    const applyCompanionIfSet = (state, assign) => (assign ? Companion.apply(state, assign) : state);
    const calcMultWithAll     = (combinedState, companionAssign, enchantAssign) =>
      calcMult(Enchant.applyEnchant(applyCompanionIfSet(combinedState, companionAssign), enchantAssign));

    const DIMS = ['card', 'divinity', 'companion', 'enchant'];

    const runOnce = (startCards, startDivSelection, startEnchantAssign, anchorOrder) => {
      let cards           = startCards;
      let divSelection    = startDivSelection;
      let companionAssign = null;
      let enchantAssign   = startEnchantAssign;
      let mult            = calcMultWithAll(Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), divSelection, ctx), null, enchantAssign);
      const deltas        = { card: 0, divinity: 0, companion: 0, enchant: 0 };

      for (let iter = 0; iter < 4; iter++) {
        const prevMult = mult;
        const order    = iter === 0 ? anchorOrder : [...DIMS].sort((a, b) => deltas[b] - deltas[a]);
        for (const dim of order) {
          const before = mult;
          if (dim === 'card') {

            const cardResult = runCardsOptimizer(
              Divinity.applyDivinity(lockedBaseState, divSelection, ctx), cardPool, slotCounts, ctx,
              mult,
              prebuilt
            );
            if (cardResult.topResults.length) {
              const newCards = [...allLockedNames, ...cardResult.topResults[0].cards];
              const newMult  = calcMultWithAll(Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(newCards), ctx), divSelection, ctx), companionAssign, enchantAssign);
              if (newMult > mult) { cards = newCards; mult = newMult; }
            }
          } else if (dim === 'divinity' && activeNodes.length) {
            const divResult = runDivinityOptimizer(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), ctx);
            if (divResult) {
              const newMult = calcMultWithAll(Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), divResult.bestSelection, ctx), companionAssign, enchantAssign);
              if (newMult > mult) { divSelection = divResult.bestSelection; mult = newMult; }
            }
          } else if (dim === 'companion') {
            const baseWithDivinity = Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), divSelection, ctx);
            const compResult       = Companion.runOptimizer(baseWithDivinity);
            if (compResult) {
              const newMult = calcMultWithAll(baseWithDivinity, compResult.assignment, enchantAssign);
              if (newMult > mult) { companionAssign = compResult.assignment; mult = newMult; }
            }
          } else if (dim === 'enchant' && enchantCandidates?.length) {
            const baseWithCompanion = applyCompanionIfSet(Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), divSelection, ctx), companionAssign);
            const newEnchantAssign  = runEnchantOptimizer(baseWithCompanion, enchantCandidates, enchantAssign);
            if (newEnchantAssign) {
              const newMult = calcMult(Enchant.applyEnchant(baseWithCompanion, newEnchantAssign));
              if (newMult > mult) { enchantAssign = newEnchantAssign; mult = newMult; }
            }
          }
          deltas[dim] = mult - before;
        }
        if (mult - prevMult < app.convergenceEpsilon) break;
      }
      return { bestCards: cards, bestDivSelection: divSelection, bestMult: mult, bestCompanionAssign: companionAssign, bestEnchantAssign: enchantAssign };
    };

    const coldStartCards = (() => {
      const result = runCardsOptimizer(Divinity.applyDivinity(lockedBaseState, currentDivSelection, ctx), cardPool, slotCounts, ctx, -Infinity, prebuilt);
      return result.topResults.length ? [...allLockedNames, ...result.topResults[0].cards] : [...allLockedNames, ...nonLockedEquipped];
    })();
    const warmCards   = [...allLockedNames, ...nonLockedEquipped];
    const baseDivSel  = () => currentDivSelection.map(s => ({ ...s }));
    const baseEnchant = () => currentEnchantAssign ? [...currentEnchantAssign] : [];

    const starts = [
      { cards: warmCards,      divSelection: baseDivSel(), enchantAssign: baseEnchant(), anchorOrder: ['card',      'divinity',  'companion', 'enchant'  ] },
      { cards: coldStartCards, divSelection: baseDivSel(), enchantAssign: baseEnchant(), anchorOrder: ['divinity',  'card',      'enchant',   'companion'] },
      { cards: coldStartCards, divSelection: baseDivSel(), enchantAssign: baseEnchant(), anchorOrder: ['companion', 'enchant',   'card',      'divinity' ] },
      { cards: coldStartCards, divSelection: baseDivSel(), enchantAssign: baseEnchant(), anchorOrder: ['enchant',   'companion', 'divinity',  'card'     ] },
    ];

    let best = { bestCards: warmCards, bestDivSelection: baseDivSel(), bestMult: currentMult, bestCompanionAssign: null, bestEnchantAssign: baseEnchant() };
    for (const { cards, divSelection, enchantAssign, anchorOrder } of starts) {
      const result = runOnce(cards, divSelection, enchantAssign, anchorOrder);
      if (result.bestMult > best.bestMult) best = result;
    }
    return best;
  }

  function runAndRender(section, calcState, ctx) {
    Cards.cardDeltaCache.clear();
    const resultEl = Dom.resultCard;
    const slotCounts     = { ...SLOT_COUNTS, weapon: Cards.getWeaponSlotCount() };
    const lockedCards    = {};
    const lockedSlotKeys = new Set();

    for (const btn of section.querySelectorAll('.co-lock-btn')) {
      if (btn.dataset.locked !== 'true') continue;
      const { equip, slot } = btn.dataset;
      lockedSlotKeys.add(Cards.getSlotKey(btn));
      const cardName = section.querySelector(`.co-card-select[data-equip="${equip}"][data-slot="${slot}"]`)?.dataset.value || '';
      if (cardName) (lockedCards[equip] ??= []).push(cardName);
    }
    const allLockedNames = Object.values(lockedCards).flat();
    for (const [equip, cards] of Object.entries(lockedCards))
      slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards.length);

    const { equippedNames, cardPool } = Cards.buildPoolFromSection(section, allLockedNames);

    const buffMap = {};
    for (const row of section.querySelectorAll('.co-buff-row')) {
      const field = row.querySelector('.co-buff-stat').value;
      const val   = parseFloat(row.querySelector('.co-buff-val').value) || 0;
      if (field && val !== 0) buffMap[field] = (buffMap[field] || 0) + val;
    }

    const nonLockedEquipped = [...section.querySelectorAll('.co-card-select')]
      .filter(input => !lockedSlotKeys.has(Cards.getSlotKey(input)) && input.dataset.value)
      .map(input => input.dataset.value);

    const prebuiltCombos = genCardCombos(cardPool, slotCounts);

    try {
      const baseState = Cards.stripCards(calcState, Cards.filterValid(equippedNames), ctx);
      for (const [field, val] of Object.entries(buffMap)) if (field in baseState) baseState[field] += val;

      const enchantSlotState     = Enchant.getEnchantSlotState();
      const enchantCandidates    = Enchant.getEnchantCandidates(enchantSlotState);
      const currentEnchantAssign = Enchant.getEnchantCurrentAssign(enchantSlotState);
      const currentDivSelection  = nodeOrder.filter(id => Divinity.nodeData[id] && Divinity.getUsed(id) != null).map(id => ({ id, panelIndex: Divinity.getUsed(id) }));
      const currentCompanionUsed = Companion.getUsed();

      const pureBase = Enchant.stripEnchant(
        Companion.strip(Divinity.stripCurrentDivinity(baseState, ctx), currentCompanionUsed),
        currentEnchantAssign
      );
      const lockedBaseState          = Cards.applyCards(pureBase, allLockedNames, ctx);
      const currentBaseWithCards     = Cards.applyCards(lockedBaseState, nonLockedEquipped, ctx);
      const currentBaseWithDivinity  = Divinity.applyDivinity(currentBaseWithCards, currentDivSelection, ctx);
      const currentBaseWithCompanion = Companion.apply(currentBaseWithDivinity, currentCompanionUsed);
      const currentMult              = calcMult(Enchant.applyEnchant(currentBaseWithCompanion, currentEnchantAssign));
      const activeNodes              = nodeOrder.filter(id => Divinity.nodeData[id] && Divinity.isNodeActive(id));

      const { bestCards, bestDivSelection, bestMult, bestCompanionAssign, bestEnchantAssign } = runCoordinateDescent(
        pureBase, lockedBaseState, cardPool, slotCounts,
        allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx,
        prebuiltCombos, enchantCandidates, currentEnchantAssign
      );

      const bestStateWithCards    = Cards.applyCards(pureBase, Cards.filterValid(bestCards), ctx);
      const bestStateWithDivinity = Divinity.applyDivinity(bestStateWithCards, bestDivSelection, ctx);
      const companionResult       = bestCompanionAssign != null ?
  { assignment: bestCompanionAssign, improved: true } : Companion.runOptimizer(bestStateWithDivinity);
      const divinityResult        = activeNodes.length ? { bestSelection: bestDivSelection, bestMult } : null;

      resultEl.innerHTML = buildLoadingHTML('qqq');
      setTimeout(() => {
        Results.render(resultEl, [{ cards: bestCards, mult: bestMult }], pureBase, lockedCards, equippedNames, ctx, divinityResult, currentDivSelection, buffMap, companionResult, bestEnchantAssign, currentEnchantAssign, enchantSlotState);
        resultEl.classList.remove('co-result-enter');
        void resultEl.offsetWidth;
        resultEl.classList.add('co-result-enter');
      }, loaderTiming.qqq);
    } catch (err) {
      resultEl.innerHTML = `<div class="co-error">Error: ${escHtml(err.message)}</div>`;
    }
  }

  return { calcMult, countDivCombos, countCompanionCombos, countEnchantCombos, genCardCombos, runCardsOptimizer, runDivinityOptimizer, runEnchantOptimizer, runCoordinateDescent, runAndRender };
})();

const Results = (() => {
  const { fmtNum, buildResSectionHTML, EMPTY_STATE_HTML, initSlider, countBy } = Utils;
  const { getBaseStatLabels, getBuffStatOptions } = Labels;
  const { statLabels, icons } = Config;

  function buildStatsGridHTML(state, compareState, atkType, showUseSyncBtn = false, buffMap = {}) {
    const atkField = atkType === 'crit' ? { field: 'crit', label: statLabels.crit } : { field: 'pen', label: statLabels.pen };
    const labels   = [
      atkField,
      ...getBaseStatLabels().map(item =>
        item.field === 'dmgStack' && (state.reaperValue || 0) > 0 ? { ...item, isSpear: true } : item
      ),
      ...((state.spearValue || 0) > 0 ? [{ field: 'spearValue', label: 'DMG to MVP/MINI, BOSS, and Normal Monsters', isSpear: true }] : []),
    ];
    const titleHTML = showUseSyncBtn
      ? `<div class="co-res-section-title-row"><div class="co-res-section-title">Final Stats</div><button class="co-use-sync-btn" id="coUseSyncBtn">${icons.sync}Use &amp; Sync</button></div>`
      : `<div class="co-res-section-title">Final Stats</div>`;
    const gridHTML = `<div class="co-final-stats-grid">${
      labels.map(({ field, label, isSpear }) => {
        const val   = state[field] ?? 0;
        const diff  = compareState != null ? val - (compareState[field] ?? 0) : 0;
        const arrow = diff > 0 ? icons.arrowUp : diff < 0 ? icons.arrowDown : '';
        return `<div class="co-final-stat-row${isSpear ? ' co-final-stat-row--spear' : ''}">
          <span class="co-final-stat-lbl">${isSpear ? `${icons.flash}<span class="co-stat-lbl-text">${label}</span>` : label}</span>
          <span class="co-final-stat-val">${fmtNum(val)}%${arrow}</span>
        </div>`;
      }).join('')
    }</div>`;
    const buffEntries    = Object.entries(buffMap).filter(([, v]) => v !== 0);
    const buffFooterHTML = buffEntries.length > 0 ? (() => {
      const buffOpts = getBuffStatOptions();
      const rows = buffEntries.map(([field, val]) => {
        const opt = buffOpts.find(o => o.field === field);
        const lbl = opt ? opt.label : field;
        return `<div class="co-final-stat-row co-buff-footer-row">
          <span class="co-final-stat-lbl">${lbl}</span>
          <span class="co-final-stat-val co-buff-footer-val">${fmtNum(val)}%</span>
        </div>`;
      }).join('');
      return `<div class="co-res-divider co-buff-footer-divider"></div>
      <div class="co-buff-footer-note">Stats above already include the extra buffs you added</div>
      <div class="co-final-stats-grid">${rows}</div>`;
    })() : '';
    return `<div class="co-res-section">${titleHTML}${gridHTML}${buffFooterHTML}</div>`;
  }

  function render(container, topResults, pureBase, lockedCards = {}, equippedNames = [], ctx = {}, divinityResult = null, currentDivSelection = [], buffMap = {}, companionResult = null, bestEnchantAssign = null, currentEnchantAssign = [], enchantSlotState = []) {
    if (!topResults?.length) {
      container.innerHTML = '<div class="co-empty-state">No valid combinations found. Add cards to the pool.</div>';
      return;
    }
    const best = topResults[0];
    const lockedCountByEquip = {};
    for (const [equip, names] of Object.entries(lockedCards)) {
      lockedCountByEquip[equip] = {};
      for (const name of names) lockedCountByEquip[equip][name] = (lockedCountByEquip[equip][name] || 0) + 1;
    }
    const byEquip             = Cards.getCardsEquipMap(best.cards);
    const beforeByEquip       = Cards.getCardsEquipMap(equippedNames);
    const bestDivSelection    = divinityResult?.bestSelection ?? currentDivSelection;
    const finalBaseWithCards  = Cards.applyCards(pureBase, best.cards, ctx);
    const finalStateBase      = Divinity.applyDivinity(finalBaseWithCards, bestDivSelection, ctx);
    const beforeBaseWithCards = Cards.applyCards(pureBase, Cards.filterValid(equippedNames), ctx);
    const beforeStateBase     = Divinity.applyDivinity(beforeBaseWithCards, currentDivSelection, ctx);

    const bestCompanionAssignmentForState = companionResult?.assignment ?? null;
    const currentCompanionUsedForState    = Companion.getUsed();
    const finalStateWithComp  = bestCompanionAssignmentForState ? Companion.apply(finalStateBase, bestCompanionAssignmentForState) : finalStateBase;
    const beforeStateWithComp = Companion.apply(beforeStateBase, currentCompanionUsedForState);

    const resolvedBestEnchantAssign = bestEnchantAssign ?? currentEnchantAssign;
    const finalState  = Enchant.applyEnchant(finalStateWithComp,  resolvedBestEnchantAssign);
    const beforeState = Enchant.applyEnchant(beforeStateWithComp, currentEnchantAssign);

    const combinedBestMult = Optimizer.calcMult(finalState);
    const currentMultFinal = Optimizer.calcMult(beforeState);
    const pctRaw = currentMultFinal > 0 ? ((combinedBestMult - currentMultFinal) / currentMultFinal * 100) : 0;
    const pct    = pctRaw.toFixed(2);
    const isGain = combinedBestMult >= currentMultFinal;
    const displayFinal  = { ...finalState,  dmgStack: finalState.dmgStack  + (finalState.reaperValue  || 0) };
    const displayBefore = { ...beforeState, dmgStack: beforeState.dmgStack + (beforeState.reaperValue || 0) };

    container.classList.toggle('spear-active', (finalState.spearValue || 0) > 0);

    const currentDivByNode    = Object.fromEntries(currentDivSelection.map(s => [s.id, s.panelIndex]));
    const divBestHTML         = Divinity.buildDivNodesHTML(divinityResult?.bestSelection ?? [], currentDivByNode);
    const divCurrentHTML      = Divinity.buildDivNodesHTML(currentDivSelection);
    const bestDivNodesHTML    = buildResSectionHTML('Divinity (tap for details)', divBestHTML    && `<div class="co-div-nodes">${divBestHTML}</div>`, EMPTY_STATE_HTML);
    const currentDivNodesHTML = buildResSectionHTML('Divinity', divCurrentHTML && `<div class="co-div-nodes">${divCurrentHTML}</div>`, EMPTY_STATE_HTML);

    const bestCompanionAssignment = companionResult?.assignment ?? currentCompanionUsedForState;
    const companionItems          = Companion.getItems();
    const hasCompanionItems       = companionItems.length > 0;
    const compBestNodes           = hasCompanionItems ? Companion.buildCompanionNodesHTML(bestCompanionAssignment, currentCompanionUsedForState) : '';
    const compCurrentNodes        = hasCompanionItems ? Companion.buildCompanionNodesHTML(currentCompanionUsedForState, currentCompanionUsedForState) : '';
    const companionNodesHTML   = buildResSectionHTML('Companion (tap for details)', compBestNodes    && `<div class="co-companion-nodes">${compBestNodes}</div>`, EMPTY_STATE_HTML);
    const currentCompanionHTML = buildResSectionHTML('Companion', compCurrentNodes && `<div class="co-companion-nodes">${compCurrentNodes}</div>`, EMPTY_STATE_HTML);

    const resolvedEnchantSlotState = Enchant.enchantState.prefs.mode === 'custom'
      ? enchantSlotState.map((slot, i) => ({ ...slot, level: parseInt(Enchant.enchantState.prefs.custom?.slots?.[i]?.level) || slot.level }))
      : enchantSlotState;
    const enchantResultHTML  = Enchant.buildEnchantSectionHTML(bestEnchantAssign ?? currentEnchantAssign, resolvedEnchantSlotState, bestEnchantAssign ? currentEnchantAssign : null);
    const currentEnchantHTML = Enchant.buildEnchantSectionHTML(currentEnchantAssign, enchantSlotState);

    const noteHTML = `<div class="co-res-note">
  Crosscheck the result on the <u>next slide</u> with the input at the top of the page and make sure it matches your current detailed stats (in-game).<br/><br/>

  Keep in mind, this tool only supports some offensive stats. If your build has a lot of ATK% / Flat & Stat% bonuses (esp. in divinity) and the tool still suggests switching, <u>in-game results may vary</u><span class="spoiler">, could go higher or lower <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="12" height="12"></span><br/><br/>

  But, since this tool calculates base multipliers, it'll be more accurate as long as your other stats (ATK, Flat STAT/%, Haste, Max HP) don't drop too much after the switch, especially for jobs that rely on those. <sup>[Tool vs In-game#<a href='#' class='job-sim' data-lightbox-gallery='my-gallery' data-lightbox-trigger>1</a>],[<a href='#' class='job-sim' data-lightbox-gallery='new-version' data-lightbox-trigger>2</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer' data-lightbox-trigger>3</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer_2' data-lightbox-trigger>4</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer_3' data-lightbox-trigger>5</a>]</sup>.
</div>`;

    const sign        = pctRaw >= 0 ? '+' : '';
    const slideLabels = [ctx.tDefKey ? `Recommendation vs ${ctx.tDefKey}` : 'Recommendation', 'Before Optimization'];

    const slide1 = `
      ${buildResSectionHTML('Cards', `<div class="co-res-breakdown">${Cards.buildCardsBreakdownHTML(byEquip, lockedCountByEquip, beforeByEquip)}</div>`)}
      ${bestDivNodesHTML}
      ${companionNodesHTML}
      ${enchantResultHTML}
      <div class="co-res-divider"></div>
      ${buildStatsGridHTML(displayFinal, displayBefore, ctx.atkType, true)}
      <div class="co-res-hero">
        <div class="co-res-hero-block"><div class="co-res-hero-val">≈${fmtNum(combinedBestMult)}</div><div class="co-res-hero-lbl">New Multiplier</div></div>
        <div class="co-res-hero-block ${isGain ? 'pos' : 'neg'}"><div class="co-res-hero-val">${sign}${pct}%</div><div class="co-res-hero-lbl">vs. Before</div></div>
      </div>${noteHTML}`;

    const slide2 = `
      ${buildResSectionHTML('Cards', `<div class="co-res-breakdown">${Cards.buildCardsBreakdownHTML(beforeByEquip)}</div>`)}
      ${currentDivNodesHTML}
      ${currentCompanionHTML}
      ${currentEnchantHTML}
      <div class="co-res-divider"></div>
      ${buildStatsGridHTML(displayBefore, null, ctx.atkType, false, buffMap)}
      <div class="co-res-hero">
        <div class="co-res-hero-block"><div class="co-res-hero-val">≈${fmtNum(currentMultFinal)}</div><div class="co-res-hero-lbl">Current Multiplier</div></div>
        <div class="co-res-hero-block"><div class="co-res-hero-val">BASE</div><div class="co-res-hero-lbl">Reference</div></div>
      </div>`;

    container.innerHTML = `
      <div class="co-slider">
        <div class="co-slider-header">
          <div class="co-slider-label" id="co-slider-label">${slideLabels[0]}</div>
        </div>
        <div class="co-slides-wrap">
          <div class="co-slide co-slide--active">${slide1}</div>
          <div class="co-slide co-slide--hidden-right">${slide2}</div>
        </div>
        <div class="co-slider-footer">
          <div>
            <a class="co-slider-footer-link" href="https://discord.gg/9j2WnTAnMu" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>RöX University</a>
          </div>
          <div class="co-slider-footer-nav">
            <button class="co-slide-nav-btn co-slide-nav-btn--prev" data-dir="-1" disabled><svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Prev</button>
            <button class="co-slide-nav-btn co-slide-nav-btn--next" data-dir="1">Next<svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </div>`;

    const useSyncBtn = container.querySelector('#coUseSyncBtn');
    if (useSyncBtn) {
      useSyncBtn.addEventListener('click', () => {
        if (!confirm('This will update your equipped cards, divinities, companion, enchantment, and base stats. Ill keep reminding you, in-game results can be differ!')) return;
        try {
          const totalPool = countBy(Cards.filterValid(equippedNames));
          for (const row of Dom.coSection.querySelectorAll('.co-unused-row')) {
            const name = row.querySelector('.co-unused-name').dataset.value ?? '';
            const qty  = parseInt(row.querySelector('.co-unused-qty').value) || 1;
            if (name) totalPool[name] = (totalPool[name] || 0) + qty;
          }
          const usedCount = countBy(Cards.filterValid(best.cards));
          const newUnused = {};
          for (const [name, total] of Object.entries(totalPool)) {
            const remaining = total - (usedCount[name] || 0);
            if (remaining > 0) newUnused[name] = remaining;
          }
          Cards.writeToSlots(best.cards, Dom.coSection);
          Divinity.writeBestDivinity(bestDivSelection);
          if (bestEnchantAssign) Enchant.writeEnchantToDOM(bestEnchantAssign);
          if (companionResult?.assignment) Companion.writeAssign(companionResult.assignment);
          Stats.writeStatsToForm(finalState, buffMap);
          Dom.coSection.querySelector('#co-unused-list').innerHTML = '';
          for (const [name, qty] of Object.entries(newUnused)) Cards.addUnusedRow(Dom.coSection, name, String(qty));
          Cards.saveState(Dom.coSection);
          useSyncBtn.innerHTML = `${icons.check} Applied`;
          useSyncBtn.disabled  = true;
        } catch { useSyncBtn.textContent = 'Error'; }
      });
    }

    initSlider(container, [...container.querySelectorAll('.co-slide')], container.querySelector('#co-slider-label'), slideLabels);
    Divinity.bindDivModalNodes(container);
    Companion.bindCompanionModalNodes(container);
  }

  return { render, buildStatsGridHTML };
})();

(() => {
  const { fmtPct, buildLoadingHTML, setLoadingText, countBy, bindCoPanelToggle, updateUseBtn } = Utils;
  const { getElemEnhLabel, COMPANION_FIELD_LABELS } = Labels;
  const { nodeOrder, loaderTiming, app } = Config;

  document.addEventListener('click', Modals.closeAll);

  document.getElementById('divModalClose').addEventListener('click', Divinity.closeDivModal);
  Dom.divModalBackdrop.addEventListener('click', e => { if (e.target === Dom.divModalBackdrop) Divinity.closeDivModal(); });

  (() => {
    const closeModal = () => Dom.coCompanionBackdrop.classList.remove('open');
    document.getElementById('coCompanionModalClose').addEventListener('click', closeModal);
    Dom.coCompanionBackdrop.addEventListener('click', e => { if (e.target === Dom.coCompanionBackdrop) closeModal(); });
  })();

  Modals.bind('summaryBtn', Dom.summaryModal, {
    closeId: 'summaryClose',
    onOpen:  Divinity.renderSummaryModal,
  });
  Modals.bind('companionSummaryBtn', document.getElementById('companionSummaryModal'), {
    closeId: 'companionSummaryClose',
    onOpen: () => {
      const totals = Companion.getBonuses();
      Utils.renderSummaryList(
        document.getElementById('companionSummaryList'),
        Object.entries(COMPANION_FIELD_LABELS)
          .filter(([field]) => (totals[field] || 0) > 0)
          .map(([field, lbl]) => ({ lbl, val: `${fmtPct(totals[field])}%` }))
      );
    },
  });
  Modals.bind('companionHelpBtn', document.getElementById('companionHelpModal'), { closeId: 'companionHelpClose' });
  Modals.bind('helpBtn', Dom.helpModal, { closeId: 'helpClose', spoilerToggle: true });

  document.addEventListener('click', e => {
    const sp = e.target.closest('.spoiler');
    if (sp) { e.stopPropagation(); sp.classList.toggle('revealed'); }
  });

  document.getElementById('trashDivBtn').addEventListener('click', e => {
    e.stopPropagation();
    if (!confirm('Clear all divinity? This will `force` remove all added divinities including locked and currently in use.')) return;
    for (const id of nodeOrder) {
      Divinity.nodeData[id] = { count: 1, current: 0, usedBySize: Divinity.defaultUsedBySize(), panels: [Divinity.defaultPanel()] };
      Divinity.updateDivCircle(id);
    }
    Divinity.save();
    if (ui.activePanel) Divinity.closePanel();
  });

  Dom.divSizeSelect.addEventListener('change', e => {
    ui.activeSize = e.target.value;
    nodeOrder.forEach(Divinity.updateDivCircle);
    Cards.switchSize(Dom.coSection);
    if (!ui.activePanel || !ui.activeId) return;
    const data = Divinity.getData(ui.activeId);
    updateUseBtn(ui.activePanel.querySelector('.use-btn'), Divinity.getUsed(ui.activeId) === data.current);
    Divinity.toggleTrashBtn(
      ui.activePanel.querySelector('.panel-nav'),
      ui.activeId, data.count, data.current, data.panels[data.current]?.locked
    );
  });

  document.querySelectorAll('.node').forEach(cb => {
    cb.addEventListener('change', () => {
      if (ui.isNodeNavigating || !cb.checked) return;
      if (ui.isAnimating) { cb.checked = false; return; }
      ui.activePanel ? Divinity.closePanel(() => Divinity.openPanel(cb)) : Divinity.openPanel(cb);
    });
  });

  Dom.tDef.addEventListener('change', () => {
    Stats.updateTargetLabels(Dom.tDef.value);
    Stats.updateActiveSize();
    Stats.saveStatsState();
    Cards.rebuildBuffList();
    Enchant.rebuildEnchantPairs(true);
    Enchant.refresh();
  });

  Dom.wElem.addEventListener('change', () => {
    Dom.elemEnhanceLabel.textContent = getElemEnhLabel();
    Stats.saveStatsState();
    if (ui.activePanel) ui.activePanel.updateOptions?.();
    Cards.rebuildBuffList();
    Companion.rerenderSheet();
  });

  Dom.weapon.addEventListener('change', () => {
    if (Dom.coSection.querySelector('.co-card-select')) Cards.rebuildWeaponSlots(Dom.coSection);
    Stats.saveStatsState();
    Enchant.rebuildEnchantPairs();
    Enchant.refresh();
  });

  Dom.atkType.addEventListener('change', () => {
    const isPen = Dom.atkType.value === 'pen';
    Dom.penField.hidden  = !isPen;
    Dom.critField.hidden = isPen;
    Dom.pen.value = Dom.crit.value = '';
    Stats.saveStatsState();
    Enchant.rebuildEnchantPairs(true);
    Enchant.refresh();
    if (ui.activePanel && ui.activeId) {
      const d = Divinity.getData(ui.activeId);
      Divinity.navigateTo(d.current, 0);
    }
    Cards.rebuildBuffList();
    Companion.rerenderSheet();
  });

  Dom.manualBtn.addEventListener('click', () => Stats.setFormOpen(!Dom.form.classList.contains('open')));
  Dom.form.addEventListener('input',  Stats.saveStatsState);
  Dom.form.addEventListener('change', Stats.saveStatsState);

  document.getElementById('loadStatsBtn').addEventListener('click', () => {
    try {
      if (Object.keys(Store.section('stats')).length) {
        Stats.setFormOpen(true);
        Stats.showMsg('Stats already saved.', 'ok');
        return;
      }
      const raw = localStorage.getItem(Config.app.snapKey);
      if (!raw) { Stats.showMsg(Config.errMsg, 'err'); return; }
      Stats.loadStatsFromSnap(JSON.parse(raw));
      Stats.setFormOpen(true);
      Stats.showMsg('Stats loaded.', 'ok');
    } catch {
      Stats.showMsg(Config.errMsg, 'err');
    }
  });

  document.getElementById('calculateBtn').addEventListener('click', () => {
    ui.calcTimeouts.forEach(clearTimeout);
    ui.calcTimeouts = [];

    const calcState = Stats.buildStatsState();
    const { atkType, tDefKey, wElem, tSize, tRace, tAttr } = calcState;
    const ctx = { atkType, tDefKey, wElem, tSize, tRace, tAttr };

    const resultEl = Dom.resultCard;
    resultEl.hidden = false;
    resultEl.innerHTML = buildLoadingHTML('Let me buy and use a convex mirror first');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const enchantSlotState  = Enchant.getEnchantSlotState();
    const enchantCandidates = Enchant.getEnchantCandidates(enchantSlotState);
    const enchantCombos     = Optimizer.countEnchantCombos(enchantCandidates);

    const companionItems  = Companion.getItems();
    const companionCombos = Optimizer.countCompanionCombos(companionItems.length);

    const divCombos = Optimizer.countDivCombos();

    const slotCounts = { ...Cards.SLOT_COUNTS, weapon: Cards.getWeaponSlotCount() };
    const lockedCopiesUsed = countBy(
      [...Dom.coSection.querySelectorAll('.co-lock-btn')]
        .filter(b => b.dataset.locked === 'true')
        .map(b => Dom.coSection.querySelector(`.co-card-select[data-equip="${b.dataset.equip}"][data-slot="${b.dataset.slot}"]`)?.dataset.value || '')
        .filter(Boolean)
    );
    for (const [equip, cards] of Object.entries(lockedCopiesUsed))
      slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards);

    const { cardPool } = Cards.buildPoolFromSection(Dom.coSection);
    const prebuilt    = Optimizer.genCardCombos(cardPool, slotCounts);
    const cardCombos  = prebuilt.overflowed ? app.maxEvalLimit + 1 : prebuilt.totalCombos;
    const totalCombos = cardCombos * divCombos * companionCombos * enchantCombos;
    const targetLabel = (ctx.tDefKey || 'target').replace(/\s*Lv\.?\s*\d{3}/i, '');
    const comboLabel  = totalCombos.toLocaleString();

    ui.calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, `Scanned! ${targetLabel} appear in ${comboLabel} seconds`);
    }, loaderTiming.convexMirror));
    ui.calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, totalCombos > loaderTiming.longComboThreshold ? 'Too long, let me fly to the future' : 'Wait, still finding');
    }, loaderTiming.convexMirror + loaderTiming.okScanned));
    ui.calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, totalCombos > loaderTiming.longComboThreshold ? 'Wait, still finding, fly wing skemm' : 'Wait, fly wing skemm', true);
    }, loaderTiming.convexMirror + loaderTiming.okScanned + loaderTiming.timeTravel));
    ui.calcTimeouts.push(setTimeout(() => {
      Optimizer.runAndRender(Dom.coSection, calcState, ctx);
    }, loaderTiming.convexMirror + loaderTiming.okScanned + loaderTiming.timeTravel + loaderTiming.flywingScam));
  });

  Dom.enchAwakeningSelect.addEventListener('change', () => {
    Enchant.readEnchantStateFromDOM();
    Enchant.save();
    Enchant.updateEnchantTotal();
  });
  Dom.enchantSection.addEventListener('change', e => {
    if (!e.target.closest('.ench-pair')) return;
    Enchant.readEnchantStateFromDOM();
    Enchant.save();
    Enchant.updateEnchantTotal();
    Enchant.refresh();
  });
  Dom.enchSettingsBtn.addEventListener('click', () => {
    const open = Dom.enchSettingsPanel.classList.toggle('open');
    Dom.enchSettingsBtn.classList.toggle('active', open);
    if (open) Enchant.renderSettingsPanel();
  });
  bindCoPanelToggle(Dom.enchantSection.querySelector('.co-hd'));

  Stats.initSelect(Dom.tDef,   Object.keys(DEFENSE_TABLE).filter(k => !k.includes('Lvl.')));
  Stats.initSelect(Dom.weapon, Object.keys(WEAPON_SIZE_MODIFIER_TABLE));
  Stats.initSelect(Dom.wElem,  Object.keys(ELEMENT_COUNTER_TABLE));
  Divinity.load();
  nodeOrder.forEach(Divinity.updateDivCircle);
  Stats.loadStatsState();
  Dom.coSection.innerHTML = Cards.buildCardsHTML();
  Cards.loadState(Dom.coSection);
  if (Cards.getWeaponSlotCount() !== Config.equipSlots.weapon.count) Cards.rebuildWeaponSlots(Dom.coSection);
  Cards.bindCardsEvents(Dom.coSection);
  Companion.initCompanionSlider();
  Companion.initCompanionItems();
  Enchant.loadEnchantState();
})();
