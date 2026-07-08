'use strict';

const pluck = (obj, key) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v[key]]));
const numericOptionsHTML = count =>
  Array.from({ length: count }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');

const Config = (() => {
  const base = {

    app: {
      storageKey: 'roxtimizer',
      snapKey:    'pwa_snap',
      storeKeys: {
        divinity:  'divinity',
        cards:     'cards',
        companion: 'companion',
        enchant:   'enchantment',
        stats:     'stats',
      },
    },

    game: {
      equipSlots: {
        weapon:    { label: 'Weapon',    count: { default: 5, dagger: 6 } },
        clothes:   { label: 'Clothes',   count: 2 },
        cloak:     { label: 'Cloak',     count: 2 },
        shoes:     { label: 'Shoes',     count: 2 },
        accessory: { label: 'Accessory', count: 6 },
        headgear:  { label: 'Headgear',  count: 6 },
      },
      elemList: ['Fire', 'Water', 'Wind', 'Earth', 'Holy', 'Shadow', 'Ghost', 'Poison', 'Neutral', 'Undead'],
      sizeList: ['Small', 'Medium', 'Large'],
      raceList: ['Demi-Human', 'Brute', 'Demon', 'Angel', 'Fish', 'Formless', 'Insect', 'Dragon', 'Plant', 'Undead'],
    },

    stats: {
      labels: {
        pen:      'Final PEN',
        crit:     'Crit DMG Bns',
        dmg:      'Final P/M DMG Bns',
        dmgStack: 'Final DMG Stack',
        rawPen:   'Raw PEN',
        pctPen:   'PEN%',
      },
      numFields:   ['pen', 'crit', 'dmg', 'elemEnh', 'sizeEnh', 'race', 'attr', 'dmgStack'],
      snapFields:  {
        pen: 'pen', crit: 'crit', dmg: 'dmg',
        elemEnh: 'elemEnhance', sizeEnh: 'sizeEnhance',
        race: 'race', attr: 'attr', dmgStack: 'dmgStack',
        rawPen: 'rawPen',
      },
      dedupGroups: [
        ['Final P.DMG Bonus', 'Final M.DMG Bonus'],
        ['Final P.PEN',       'Final M.PEN'],
      ],
      exclKeys: { crit: new Set(['pen', 'rawPen', 'pctPen']), pen: new Set(['crit']) },
    },

    optimizer: {
      convergenceEpsilon: 1e-8,
    },

    divinity: {
      maxPanels: 8,
      maxStats:  { blue: 5, purple: 6, gold: 7 },
      sizes:     ['small', 'medium', 'large'],
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
      rates: {
        main: { blue: 0.15, purple: 0.18, gold: 0.21 },
        sub:  { blue: 0.18, purple: 0.23, gold: 0.26 },
        crit: { blue: 0.29, purple: 0.37, gold: 0.42 },
      },
      defs: {
        pen:         { field: 'pen',     rates: 'main' },
        crit:        { field: 'crit',    rates: 'crit' },
        dmg:         { field: 'dmg',     rates: 'main' },
        element:     { field: 'elemEnh', rates: 'sub'  },
        size_small:  { field: 'sizeEnh', rates: 'sub',  cond: ctx => ctx.tSize === 'Small'  },
        size_medium: { field: 'sizeEnh', rates: 'sub',  cond: ctx => ctx.tSize === 'Medium' },
        size_large:  { field: 'sizeEnh', rates: 'sub',  cond: ctx => ctx.tSize === 'Large'  },
      },
    },

    companion: {
      slots:    4,
      maxItems: 16,
      maxStats: 3,
      statKeys: ['elemEnh', 'pen', 'crit', 'dmg'],
      rates:    { purple: { crit: 0.0040, default: 0.0020 }, gold: { crit: 0.0066, default: 0.0033 } },
      starMult: 1.17,
    },

    enchant: {
      maxPrefs:          2,
      awakeningPerLevel: 0.1,
      sixSlot:           new Set(['One-Handed Sword', 'One-Handed Axe', 'One-Handed Staff', 'Mace', 'GS', 'Dagger']),
      levelHtml:         '<option value="" selected>Level</option>' + numericOptionsHTML(15),
      options: [
        { value: 'morroc_crit',   label: 'Morroc – Crit DMG Bns',      type: 'crit', eq: { weapon: { '1H': 2.40, '2H': 3.60,  Dagger: 1.80, Shield: 1.20 } } },
        { value: 'morroc_rawpen', label: 'Morroc – Raw PEN',            type: 'rawPen', eq: { weapon: { '1H': 36,   '2H': 54,    Dagger: 27,   Shield: 18   } } },
        { value: 'izlude_element',  label: 'Izlude – Element Enhance',  type: 'elemEnh', eq: { acc: { value: 1.00 } } },
        { value: 'izlude_size',     label: 'Izlude – DMG to Size',      type: 'sizeEnh', eq: { acc: { value: 1.00 } } },
        { value: 'izlude_race',   label: 'Izlude – DMG to Race',       type: 'race', eq: { weapon: { '1H': 2.00, '2H': 3.00,  Dagger: 1.50, Shield: 1.00 } } },
        { value: 'alberta_pctpen', label: 'Alberta – PEN%',            type: 'pctPen', eq: { acc: { value: 1.60 } } },
        { value: 'alberta_dmg',   label: 'Alberta – Final P/M DMG Bns',type: 'dmg',  eq: { weapon: { '1H': 1.60, '2H': 2.40,  Dagger: 1.20, Shield: 0.80 } } },
        { value: 'alberta_attr',  label: 'Alberta – DMG to Attribute', type: 'attr', eq: { weapon: { '1H': 2.00, '2H': 3.00,  Dagger: 1.50, Shield: 1.00 } } },
        { value: 'payon_crit',    label: 'Payon – Crit DMG Bns',       type: 'crit', eq: { weapon: { '1H': 3.60, '2H': 5.40,  Dagger: 2.70, Shield: 1.80 } } },
        { value: 'payon_rawpen',  label: 'Payon – Raw PEN',             type: 'rawPen', eq: { weapon: { '1H': 60,   '2H': 90,    Dagger: 45,   Shield: 30   } } },
        { value: 'geffen_crit',   label: 'Geffen – Crit DMG Bns',      type: 'crit', eq: { weapon: { '1H': 4.80, '2H': 7.20,  Dagger: 3.60, Shield: 2.40 }, acc: { value: 2.40 } } },
        { value: 'geffen_pen',    label: 'Geffen – Final PEN',         type: 'pen',  eq: { weapon: { '1H': 2.40, '2H': 3.60,  Dagger: 1.80, Shield: 1.20 }, acc: { value: 1.20 } } },
        { value: 'geffen_dmg',    label: 'Geffen – Final P/M DMG Bns', type: 'dmg',  eq: { weapon: { '1H': 2.40, '2H': 3.60,  Dagger: 1.80, Shield: 1.20 } } },
        { value: 'comodo_crit',   label: 'Comodo – Crit DMG Bns',      type: 'crit', eq: { weapon: { '1H': 6.40, '2H': 9.60,  Dagger: 4.80, Shield: 3.20 } } },
        { value: 'comodo_pen',    label: 'Comodo – Final PEN',         type: 'pen',  eq: { weapon: { '1H': 3.20, '2H': 4.80,  Dagger: 2.40, Shield: 1.60 } } },
        { value: 'comodo_dmg',    label: 'Comodo – Final P/M DMG Bns', type: 'dmg',  eq: { weapon: { '1H': 3.20, '2H': 4.80,  Dagger: 2.40, Shield: 1.60 } } },
        { value: 'comodo_element',  label: 'Comodo – Element Enhance',  type: 'elemEnh', eq: { acc: { value: 2.00 } } },
        { value: 'umbala_crit',   label: 'Umbala – Crit DMG Bns',      type: 'crit', eq: { weapon: { '1H': 7.20, '2H': 10.80, Dagger: 5.40, Shield: 3.60 }, acc: { value: 3.60 } } },
        { value: 'umbala_pen',    label: 'Umbala – Final PEN',         type: 'pen',  eq: { weapon: { '1H': 3.60, '2H': 5.40,  Dagger: 2.70, Shield: 1.80 }, acc: { value: 1.80 } } },
        { value: 'umbala_dmg',    label: 'Umbala – Final P/M DMG Bns', type: 'dmg',  eq: { weapon: { '1H': 3.60, '2H': 5.40,  Dagger: 2.70, Shield: 1.80 } } },
        { value: 'umbala_size',    label: 'Umbala – DMG to Size',      type: 'sizeEnh', eq: { acc: { value: 2.25 } } },
        { value: 'umbala_race',    label: 'Umbala – DMG to Race',      type: 'race', eq: { acc: { value: 2.25 } } },
        { value: 'rachel_crit',   label: 'Rachel – Crit DMG Bns',      type: 'crit', eq: { weapon: { '1H': 8.80, '2H': 13.20, Dagger: 6.60, Shield: 4.40 } } },
        { value: 'rachel_pen',    label: 'Rachel – Final PEN',         type: 'pen',  eq: { weapon: { '1H': 4.40, '2H': 6.60,  Dagger: 3.30, Shield: 2.20 } } },
        { value: 'rachel_dmg',    label: 'Rachel – Final P/M DMG Bns', type: 'dmg',  eq: { weapon: { '1H': 4.40, '2H': 6.60,  Dagger: 3.30, Shield: 2.20 }, acc: { value: 2.20 } } },
        { value: 'rachel_element',  label: 'Rachel – Element Enhance',  type: 'elemEnh', eq: { acc: { value: 2.75 } } },
      ],
    },

    ui: {
      loaderTiming: {
        convexMirror:       1748,
        okScanned:          3863,
        timeTravel:         1873,
        flywingScam:        7867,
        qqq:                773,
        longComboThreshold: 8_888_888,
      },
      errMsg: 'No saved stats found. Use the <a href="https://masihterjaga.github.io/sim" target="_blank" rel="noopener">ratio calculator</a> first so you don\'t have to re-enter your stats each time.',
      icons: {
        lockClosed: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`,
        lockOpen:   `<path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>`,
        horizSwap:  `<svg class="co-chip-swap" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4l4 4-4 4M3 8h18"/><path d="M7 20l-4-4 4-4M21 16H3"/></svg>`,
        vertSwap:   `<svg class="co-div-swap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l4 4 4-4M8 21V3"/><path d="M20 7l-4-4-4 4M16 3v18"/></svg>`,
        divLock:    `<svg class="co-div-lock" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`,
        lightning:  `<svg class="co-div-lightning" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"/></svg>`,
        arrowUp:    `<svg class="co-stat-arrow co-stat-arrow--up" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8-12 8 12z"/></svg>`,
        arrowDown:  `<svg class="co-stat-arrow co-stat-arrow--down" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6l8 12 8-12z"/></svg>`,
        flash:      `<svg class="co-stat-flash" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"/></svg>`,
        trash:      `<svg viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M4.5 3.5v-1.5h3v1.5M3 3.5l.6 6.5h4.8l.6-6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        close:      `<svg viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
        check:      `<svg viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        chevLeft:   `<svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        chevRight:  `<svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        person:         `<svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="3.5" r="2" stroke="currentColor" stroke-width="1.3"/><line x1="6" y1="5.5" x2="6" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="3.5" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
        star:           `<svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9" class="icon-star-svg"><path d="M8 1.5l1.64 3.32 3.66.53-2.65 2.58.63 3.65L8 9.77l-3.28 1.81.63-3.65L2.7 5.35l3.66-.53L8 1.5z"/></svg>`,
        companionSwap:  `<svg class="co-companion-swap" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        sync:           `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
      },
    },
  };

  const nodeOrder  = base.divinity.nodes.map(n => n.id);
  const NODE_NAMES = Object.fromEntries(base.divinity.nodes.map(n => [n.id, n.name]));
  const DIR_MAP    = Object.fromEntries(base.divinity.nodes.map(n => [n.id, n.dir]));

  const slotCounts  = { ...pluck(base.game.equipSlots, 'count'), weapon: base.game.equipSlots.weapon.count.default };
  const equipLabels = pluck(base.game.equipSlots, 'label');

  const ENCHANT_OPTIONS_MAP = new Map(base.enchant.options.map(o => [o.value, o]));

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

  const statsConverter = raw => {
    const rd = (n, d = 0) => Math.floor(n * 10 ** d) / 10 ** d;

    if (raw < 5750) {
      const n = rd((-1 + Math.sqrt(8 * raw / 25 + 1)) / 2);
      const base = n * (n + 1) / 2 * 25;
      return Math.round((n * 0.05 + (raw - base) * 0.002 / (n + 1)) * 10000) / 100;
    }

    if (raw < 35300) {
      const step = Math.min(rd((raw - 5750) / 500), 58);
      const rate = (105 + 5 * step) / 100;
      return Math.round((rate + (raw - (5750 + 500 * step)) / (rate + 0.05) / 10000) * 10000) / 100;
    }

    const brackets = [
      [35300, 400, 575, 100, 50, 25, 575],
      [42500, 445, 1050, 200, 100, 50, 1050],
      [58000, 495, 2150, 600, 300, 150, 2150],
      [94500, 545, 5250, 1000, 500, 250, 5250],
    ];

    const [A, R, B, C, D, c1, c2] = brackets.findLast(([A]) => raw >= A);
    const step = rd((-B + Math.sqrt(B ** 2 + C * (raw - A))) / D);
    const rate = (R + 5 * step) / 100;
    const base = A + c1 * step ** 2 + c2 * step;

    return Math.round((rate + (raw - base) / (rate + 0.05) / 10000) * 10000) / 100;
  };

  const labelWithVal = (base, val) => (val ? `${base} (${val})` : base);
  const cssTranslate  = (axis, pct) => `translate${axis}(${pct}%)`;
  const buildLockSvg  = closed => `<svg viewBox="0 0 24 24" fill="currentColor">${closed ? Config.ui.icons.lockClosed : Config.ui.icons.lockOpen}</svg>`;

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

  const rAF2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

  const debounce = (fn, delay = 300) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const argmaxBy = (candidates, scoreFn, initial = null) => {
    let best  = initial;
    let bestScore = -Infinity;
    for (const c of candidates) {
      const s = scoreFn(c);
      if (s > bestScore) { bestScore = s; best = c; }
    }
    return { best, bestScore };
  };

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
      rAF2(() => { body.classList.add('collapsed'); body.style.height = '0px'; });
    }
    body.addEventListener('transitionend', () => { body.style.height = ''; }, { once: true });
  };

  const setQualityClass = (el, quality, prefix = 'quality', extra = []) => {
    el.classList.remove(`${prefix}-blue`, `${prefix}-purple`, `${prefix}-gold`, ...extra.map(v => `${prefix}-${v}`));
    if (quality) el.classList.add(`${prefix}-${quality}`);
  };

  const fromHTML = html => {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.firstElementChild;
  };

  const bindCoPanelToggle = hd => {
    const toggle = () => toggleCoPanel(hd);
    hd.addEventListener('click', toggle);
    hd.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  };

  const updateUseBtn = (btn, isUsed) => {
    btn.classList.toggle('active', isUsed);
    btn.querySelector('span').textContent = isUsed ? 'In Use' : 'Use';
  };

  const setInteractionLocked = (locked, exemptEl) => {
    document.body.style.pointerEvents = locked ? 'none' : '';
    if (exemptEl) exemptEl.style.pointerEvents = locked ? 'auto' : '';
  };

  return {
    escHtml, fmtNum, statsConverter, fmtPct, fmtRawPct, labelWithVal, cssTranslate, buildLockSvg,
    createStatResolver, parseStatPct, countBy, rAF2, debounce, argmaxBy,
    numericOptionsHTML,
    buildLoadingHTML, setLoadingText, buildResSectionHTML, EMPTY_STATE_HTML,
    renderSummaryList, toggleConditionalBtn, updateSelectsDisabled,
    initSlider, animateSlideTransition, animateSlide,
    bindCoPanelToggle, updateUseBtn, fromHTML, setQualityClass,
    setInteractionLocked,
  };
})();

const Formula = (() => {
  const calculateMultiplier = (state) => {
    const {
      atkType = '', weapon = '', wElem = '', tDefKey = '', tSize = '', tRace = '', tAttr = '',
        pen = 0, crit = 0, dmg = 0,
        elemEnh = 0, sizeEnh = 0, race = 0, attr = 0, dmgStack = 0,
        reaperValue = 0, spearValue = 0,
        rawPen = 0,
    } = state;

    const toPercent = val => val / 100;

    const effectivePen = pen + (rawPen && atkType === 'pen' ? Utils.statsConverter(rawPen) : 0);

    const defData = tDefKey ?
      (DEFENSE_TABLE[tDefKey] || DEFENSE_TABLE['DUMMY Lvl.0 (0 DEF)']) :
      DEFENSE_TABLE;
    const { def, dmgred } = defData;

    const sizeMod = weapon && weapon !== 'all' ?
      (WEAPON_SIZE_MODIFIER_TABLE[weapon]?.[tSize] ?? 1.0) :
      1.0;

    const elemCtr = wElem && wElem !== 'all' ?
      (ELEMENT_COUNTER_TABLE[wElem]?.[tAttr || 'Neutral'] ?? 1.0) :
      1.0;

    let atkF = 0;
    if (atkType === 'crit') {
      atkF = toPercent(crit);
    } else if (atkType === 'pen') {
      const r = effectivePen - def;
      atkF = r > 0 ? 1 + toPercent(r >= 150 ? r * 2 - 150 : r) : 0;
    }

    const e1 = 1 + toPercent(dmgStack) + toPercent(reaperValue);
    const e2 = 1 + toPercent(spearValue);

    const mult = atkF *
      (1 + toPercent(dmg - dmgred)) *
      (elemCtr + toPercent(elemEnh)) *
      (1 + (tAttr ? toPercent(attr) : 0)) *
      (1 + (tRace ? toPercent(race) : 0)) *
      e1 * e2 *
      (sizeMod + toPercent(sizeEnh));

    return { mult };
  };

  return { calculateMultiplier };
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
    rawPen:           g('rawPen'),
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
    divinitySectionToggle: g('divinitySectionToggle'),
    enchWeaponLines:     g('enchLines'),
    enchAccLines:        g('enchLinesAcc'),
    enchSlideLabel:      g('enchSlideLabel'),
    enchAwakeningSelect: g('enchAwakeningSelect'),
    enchSettingsPanel:   g('enchSettingsPanel'),
    enchSettingsBtn:     g('enchSettingsBtn'),
    enchResetBtn:        g('enchResetBtn'),
    enchSettingsInner:   g('enchSettingsInner'),
    enchSectionToggle:   g('enchSectionToggle'),
    coCompanionBackdrop:    g('coCompanionModalBackdrop'),
    coCompanionModal:       g('coCompanionModal'),
    companionSectionToggle: g('companionSectionToggle'),
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
    companionQLock: g('companion-q-lock'),
    companionQPurple: g('companion-q-purple'),
    companionQGold: g('companion-q-gold'),
    companionQStar: g('companion-q-star'),
    companionUseBtn: g('companion-use-btn'),
    companionRemoveBtn: g('companion-remove-btn'),
    companionEditBtn: g('companion-sheet-edit-btn'),
    companionSlideLabel: g('companion-slide-label'),
    divModalClose:            g('divModalClose'),
    coCompanionModalClose:    g('coCompanionModalClose'),
    coCompanionModalStar:     g('coCompanionModalStar'),
    coCompanionModalSlotName: g('coCompanionModalSlotName'),
    coCompanionModalSubtitle: g('coCompanionModalSubtitle'),
    coCompanionModalStatsCur: g('coCompanionModalStatsCur'),
    coCompanionModalArrow:    g('coCompanionModalArrow'),
    coCompanionModalStatsRec: g('coCompanionModalStatsRec'),
    companionSummaryModal: g('companionSummaryModal'),
    companionSummaryList:  g('companionSummaryList'),
    companionHelpModal:    g('companionHelpModal'),
    trashDivBtn:           g('trashDivBtn'),
    loadStatsBtn:          g('loadStatsBtn'),
    calculateBtn:          g('calculateBtn'),
    companionResetInputBtn: g('companionResetInputBtn'),
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

  const isAtkExcluded = key => Config.stats.exclKeys[Dom.atkType.value]?.has(key) ?? false;

  const STAT_OPTIONS = [
    { key: 'pen',         label: Config.stats.labels.pen  },
    { key: 'crit',        label: Config.stats.labels.crit },
    { key: 'dmg',         label: Config.stats.labels.dmg  },
    { key: 'element',     get label() { return getElemEnhLabel(); } },
    { key: 'size_small',  label: 'DMG to Small'   },
    { key: 'size_medium', label: 'DMG to Medium'  },
    { key: 'size_large',  label: 'DMG to Large'   },
  ];
  const STAT_OPTIONS_MAP = new Map(STAT_OPTIONS.map(o => [o.key, o]));

  const { createStatResolver } = Utils;
  const { elemList, sizeList, raceList } = Config.game;
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

  const ALL_STAT_FIELDS = [
    { field: 'dmg',      label: Config.stats.labels.dmg      },
    { field: 'pen',      label: Config.stats.labels.pen      },
    { field: 'crit',     label: Config.stats.labels.crit     },
    { field: 'elemEnh',  get label() { return getElemEnhLabel();  } },
    { field: 'sizeEnh',  get label() { return getTargetSizeLabel(); } },
    { field: 'race',     get label() { return getTargetRaceLabel(); } },
    { field: 'attr',     get label() { return getTargetAttrLabel(); } },
    { field: 'dmgStack', label: Config.stats.labels.dmgStack },
  ];

  const COMPANION_STAT_OPTIONS = (() => {
    const keys = Config.companion.statKeys;
    const set  = new Set(keys);
    return ALL_STAT_FIELDS
      .filter(f => set.has(f.field))
      .sort((a, b) => keys.indexOf(a.field) - keys.indexOf(b.field))
      .map(f => ({ key: f.field, get label() { return f.label; } }));
  })();
  const COMPANION_FIELD_LABELS = Object.fromEntries(
    COMPANION_STAT_OPTIONS.map(o => [o.key, null])
  );
  for (const o of COMPANION_STAT_OPTIONS) {
    Object.defineProperty(COMPANION_FIELD_LABELS, o.key, { get() { return o.label; }, enumerable: true });
  }

  const getAtkFieldOption = atkType =>
    ALL_STAT_FIELDS.find(({ field }) => field === atkType) ?? { field: atkType, label: atkType };

  const getBuffStatOptions = () => ALL_STAT_FIELDS.map(({ field, label }) => ({ field, label }));

  const getBaseStatLabels = () =>
    ALL_STAT_FIELDS
      .filter(({ field }) => field !== 'pen' && field !== 'crit')
      .map(({ field, label }) => ({ field, label }));

  const getEnchantTypeLabel = type => ({
    crit:    Config.stats.labels.crit,
    race:    getTargetRaceLabel(),
    attr:    getTargetAttrLabel(),
    dmg:     Config.stats.labels.dmg,
    pen:     Config.stats.labels.pen,
    rawPen:  Config.stats.labels.rawPen,
    pctPen:  Config.stats.labels.pctPen,
    sizeEnh: getTargetSizeLabel(),
    elemEnh: getElemEnhLabel(),
  })[type] ?? type;

  const getEnchantOptLabel = opt => {
    const sep = opt.label.indexOf('\u2013');
    if (sep === -1) return opt.label;
    return opt.label.slice(0, sep + 2) + getEnchantTypeLabel(opt.type);
  };

  const buildEnchantOptionsHTML = (currentVal = '', slotKey = 'weapon') => {
    const slotLabel = slotKey === 'acc' ? 'Acc.' : 'Weapon';
    return `<option value="" selected>${slotLabel} Enchantment</option>` +
      Config.enchant.options.filter(o => o.eq[slotKey]).map(o => {
        const excluded = isAtkExcluded(o.type) && o.value !== currentVal;
        return `<option value="${o.value}"${excluded ? ' disabled' : ''}>${getEnchantOptLabel(o)}</option>`;
      }).join('');
  };

  return {
    getElemEnhLabel, getTargetRaceLabel, getTargetAttrLabel, getTargetSizeLabel,
    isAtkExcluded,
    STAT_OPTIONS, STAT_OPTIONS_MAP, STAT_RESOLVERS,
    COMPANION_STAT_OPTIONS, COMPANION_FIELD_LABELS,
    getBuffStatOptions, getBaseStatLabels, getAtkFieldOption,
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

  const restore = (fn, warnMsg) => {
    try {
      fn();
    } catch (err) {
      console.warn(warnMsg, err);
    }
  };

  return { section, write, restore };
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

  const openComparison = ({ backdropEl, qualityEl, titleEl, flashEl, curEl, arrowEl, recEl, quality, title, flashVisible, curHTML, recHTML, showComparison }) => {
    Utils.setQualityClass(qualityEl, quality);
    if (titleEl)  titleEl.textContent  = title;
    if (flashEl)  flashEl.hidden       = !flashVisible;
    if (curEl)    curEl.hidden         = !showComparison;
    if (arrowEl)  arrowEl.hidden       = !showComparison;
    if (showComparison && curEl) curEl.innerHTML = curHTML;
    recEl.innerHTML = recHTML;
    recEl.hidden    = false;
    backdropEl.classList.add('open');
  };

  return { closeAll, bind, bindModalNodes, openComparison };
})();

const Divinity = (() => {
  const { nodeOrder, NODE_NAMES, DIR_MAP, divinity, ui: { icons } } = Config;
  const { specialNodes, defs: divinityDefs, rates: divinityRates, sizes: divSizes } = divinity;
  const { fmtRawPct, buildLockSvg, cssTranslate, rAF2,
          toggleConditionalBtn, updateSelectsDisabled,
          animateSlideTransition, animateSlide,
          updateUseBtn, renderSummaryList, fromHTML, setQualityClass } = Utils;

  const nodeData = {};
  let divOptimize = true;
  const saveDivinityState = () => Store.write(Config.app.storeKeys.divinity, { nodes: nodeData, optimize: divOptimize });

  const isOptimizeEnabled  = () => divOptimize;
  const setOptimizeEnabled = enabled => { divOptimize = !!enabled; saveDivinityState(); };

  const panelState = {
    activeId:         null,
    activeSize:       'small',
    activePanel:      null,
    activeDir:        null,
    isAnimating:      false,
    isNodeNavigating: false,
  };

  const getActiveId    = ()   => panelState.activeId;
  const getActiveSize  = ()   => panelState.activeSize;
  const getActivePanel = ()   => panelState.activePanel;
  const setActiveSize  = size => { panelState.activeSize = size; };

  const getQuality = panel => (panel.gold ? 'gold' : panel.purple ? 'purple' : 'blue');
  const getStatVal = (key, quality) => {
    const def = divinityDefs[key];
    return def ? (divinityRates[def.rates]?.[quality] ?? null) : null;
  };
  const fmtStatPct = (key, quality) => { const v = getStatVal(key, quality); return v === null ? '' : fmtRawPct(v); };

  const defaultItem      = () => ({ blue: true, purple: false, gold: false, lightning: false, locked: false, stats: [null] });
  const defaultSizeMap    = (val = () => ({})) => Object.fromEntries(divSizes.map(s => [s, typeof val === 'function' ? val() : val]));
  const defaultInUse = () => defaultSizeMap(() => null);

  const getUsed         = id => getData(id).inUse[panelState.activeSize] ?? null;
  const setUsed         = (id, idx) => { getData(id).inUse[panelState.activeSize] = idx; saveDivinityState(); };
  const isUsedInAnySize = (id, idx) => Object.values(getData(id).inUse).some(v => v === idx);
  const canShowTrash    = (id, count, idx, locked = false) => !locked && count > 1 && !isUsedInAnySize(id, idx);

  function writeBestSelection(selection) {
    for (const { id, panelIndex } of selection) setUsed(id, panelIndex);
    Config.nodeOrder.forEach(updateDivCircle);
  }

  const loadDivinityState = () => {
    Store.restore(() => {
      const stored = Store.section(Config.app.storeKeys.divinity);
      Object.assign(nodeData, stored.nodes);
      divOptimize = stored.optimize ?? true;
      normalize();
    }, 'Divinity.loadDivinityState: failed to restore divinity state');
  };

  function normalize() {
    for (const id of Object.keys(nodeData)) {
      const d = nodeData[id];
      while (d.items.length < d.count) d.items.push(defaultItem());
      for (const p of d.items) {
        if (!Array.isArray(p.stats)) p.stats = [null];
        p.locked ??= false;
        if (!p.blue && !p.purple && !p.gold) p.blue = true;
      }
    }
  }

  function getData(id) {
    if (!nodeData[id])
      nodeData[id] = { count: 1, inUse: defaultInUse(), items: [defaultItem()] };
    nodeData[id].current ??= 0;
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
    const s = nodeData[id]?.items[usedIdx];
    if (!s) return;
    setQualityClass(circle, getQuality(s));
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

  function applyDivLockBtn(btn, locked) {
    btn.classList.toggle('active', locked);
    btn.innerHTML = buildLockSvg(locked);
    btn.title     = locked ? 'Unlock this divinity' : 'Lock this divinity';
  }

  function toggleAddBtn(footerRight, count) {
    toggleConditionalBtn(footerRight, '.add-btn', count < divinity.maxPanels, makeAddBtn);
  }

  function makeAddBtn() {
    const btn = fromHTML('<button class="add-btn">+ Add Div</button>');
    btn.addEventListener('click', addSubPanel);
    return btn;
  }

  function makeDelBtn() {
    const btn = fromHTML(`<button class="nav-btn del-btn">${icons.trash}</button>`);
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
    const updateDivAddToggle      = () => { addToggle.style.display = s.stats.length >= divinity.maxStats[getQuality(s)] ? 'none' : ''; };
    const updateDivOptionDisabled = () => updateSelectsDisabled(list, '.divinity-select', () => s.stats, Labels.isAtkExcluded);

    function makeDivRow(selectedKey, index) {
      const quality    = getQuality(s);
      const optionsHTML = Labels.STAT_OPTIONS.map(opt => {
        const excl = Labels.isAtkExcluded(opt.key) && opt.key !== selectedKey;
        return `<option value="${opt.key}"${opt.key === selectedKey ? ' selected' : ''}${excl ? ' disabled' : ''}>${getDivOptionText(opt, quality)}</option>`;
      }).join('');
      const row    = fromHTML(`<div class="divinity-row">
        <div class="select-wrap"><select class="divinity-select"><option value="" disabled${!selectedKey ? ' selected' : ''}>Divinity Stats</option>${optionsHTML}</select></div>
        <button class="divinity-del-btn"><svg viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
      </div>`);
      const sel    = row.querySelector('.divinity-select');
      const delBtn = row.querySelector('.divinity-del-btn');
      sel.addEventListener('change', () => { s.stats[index] = sel.value; updateDivOptionDisabled(); saveDivinityState(); });
      delBtn.addEventListener('click', () => { s.stats.splice(index, 1); renderDivRows(); saveDivinityState(); });
      return row;
    }

    function renderDivRows() {
      list.innerHTML = '';
      s.stats.forEach((key, i) => list.appendChild(makeDivRow(key, i)));
      updateDivAddToggle();
      updateDivOptionDisabled();
    }

    function updateDivOptions() {
      const quality = getQuality(s);
      const max     = divinity.maxStats[quality];
      if (s.stats.length > max) { s.stats.splice(max); renderDivRows(); return; }
      list.querySelectorAll('.divinity-select').forEach(sel => {
        sel.querySelectorAll('option[value]:not([value=""])').forEach(opt => {
          const meta = Labels.STAT_OPTIONS_MAP.get(opt.value);
          if (meta) opt.textContent = getDivOptionText(meta, quality);
        });
      });
      updateDivAddToggle();
    }

    addToggle.addEventListener('click', () => {
      if (s.stats.length >= divinity.maxStats[getQuality(s)]) return;
      s.stats.push(null);
      renderDivRows();
      saveDivinityState();
    });

    const max = divinity.maxStats[getQuality(s)];
    if (s.stats.length > max) { s.stats.splice(max); }
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
      const s = data.items[data.current];
      t.blue.classList.toggle('active', s.blue);
      t.purple.classList.toggle('active', s.purple);
      t.gold.classList.toggle('active', s.gold);
      t.lightning.classList.toggle('active', s.lightning);
      t.lightning.classList.toggle('tag-disabled', !s.gold);
      applyDivLockBtn(t.lock, s.locked);
      onQualityChange?.();
    }

    const setDivQuality = qual => {
      const s = data.items[data.current];
      if (s[qual]) return;
      s.blue = s.purple = s.gold = false;
      s[qual] = true;
      if (qual !== 'gold') s.lightning = false;
      updateDivTags();
      saveDivinityState();
    };

    t.blue.addEventListener('click',      () => setDivQuality('blue'));
    t.purple.addEventListener('click',    () => setDivQuality('purple'));
    t.gold.addEventListener('click',      () => setDivQuality('gold'));
    t.lightning.addEventListener('click', () => {
      const s = data.items[data.current];
      if (!s.gold) return;
      s.lightning = !s.lightning;
      updateDivTags();
      saveDivinityState();
    });
    return updateDivTags;
  }

  function addSubPanel() {
    if (panelState.isAnimating || !panelState.activeId) return;
    const data = getData(panelState.activeId);
    if (data.count >= divinity.maxPanels) return;
    data.count++;
    data.items.push(defaultItem());
    saveDivinityState();
    navigateTo(data.count - 1, 1);
  }

  function navigateTo(newIndex, slideDir) {
    if (panelState.isAnimating || !panelState.activePanel || !panelState.activeId) return;
    const data = getData(panelState.activeId);
    data.current = newIndex;
    saveDivinityState();
    panelState.isAnimating = true;
    const s      = data.items[newIndex];
    const count  = data.count;
    const isUsed = getUsed(panelState.activeId) === newIndex;
    const p      = panelState.activePanel;
    const panelNav = p._panelNav;
    p._navCount.textContent = `${newIndex + 1}/${count}`;
    p._prevBtn.disabled     = newIndex === 0;
    p._nextBtn.disabled     = newIndex === count - 1;
    panelNav.style.visibility = count > 1 ? '' : 'hidden';
    panelNav.classList.toggle('panel-nav--hidden', count <= 1);
    toggleTrashBtn(panelNav, panelState.activeId, count, newIndex, s?.locked);
    toggleAddBtn(p._footerRight, count);
    updateUseBtn(p._useBtn, isUsed);
    p.syncTags?.();
    const wrap       = p._contentWrap;
    const oldContent = wrap.querySelector('.panel-content');
    const newContent = document.createElement('div');
    newContent.className        = 'panel-content';
    newContent.style.transition = 'none';
    newContent.style.transform  = cssTranslate('X', slideDir * 100);
    p.setUpdateOptions?.(initDivSubPanel(newContent, s));
    wrap.appendChild(newContent);
    animateSlideTransition(newContent, oldContent, 'X', slideDir, () => { panelState.isAnimating = false; });
  }

  function deleteSubPanel() {
    if (panelState.isAnimating || !panelState.activeId) return;
    if (!confirm('Delete this divinity panel? This cannot be undone.')) return;
    const data = getData(panelState.activeId);
    const idx  = data.current;
    data.items.splice(idx, 1);
    data.count--;
    for (const size of divSizes) {
      const u = data.inUse[size];
      if (u === idx)    data.inUse[size] = null;
      else if (u > idx) data.inUse[size]--;
    }
    saveDivinityState();
    updateDivCircle(panelState.activeId);
    navigateTo(idx === 0 ? 0 : idx - 1, idx === 0 ? 1 : -1);
  }

  function swapPanel(incoming, slideDir) {
    const outgoing = panelState.activePanel;
    Dom.sliderContainer.appendChild(incoming);
    panelState.activePanel = incoming;
    animateSlide(incoming, outgoing, 'X', slideDir,
      () => { panelState.isAnimating = true; },
      () => { panelState.isAnimating = false; }
    );
  }

  function closePanel(onDone) {
    if (panelState.isAnimating || !panelState.activePanel) return;
    panelState.isAnimating = true;
    const panel = panelState.activePanel;
    const dir   = panelState.activeDir;
    panel.style.transform      = cssTranslate(dir.axis, dir.sign * 100);
    Dom.grid.style.transform   = cssTranslate(dir.axis, 0);
    panel.addEventListener('transitionend', () => {
      panel.remove();
      Dom.sliderContainer.style.height = '';
      panelState.activePanel = null;
      panelState.activeDir   = null;
      if (panelState.activeId) { document.getElementById(panelState.activeId).checked = false; panelState.activeId = null; }
      panelState.isAnimating = false;
      onDone?.();
    }, { once: true });
  }

  function navigateNode(dir) {
    if (panelState.isAnimating || !panelState.activeId) return;
    const nextIdx = nodeOrder.indexOf(panelState.activeId) + dir;
    if (nextIdx < 0 || nextIdx >= nodeOrder.length) return;
    const nextId = nodeOrder[nextIdx];
    panelState.isNodeNavigating = true;
    document.getElementById(panelState.activeId).checked = false;
    document.getElementById(nextId).checked      = true;
    panelState.isNodeNavigating = false;
    const nextData   = getData(nextId);
    nextData.current = getUsed(nextId) ?? 0;
    saveDivinityState();
    panelState.activeId = nextId;
    swapPanel(makePanelEl(nextId), dir);
  }

  function makePanelEl(id) {
    const data    = getData(id);
    const idx     = data.current;
    const count   = data.count;
    const s       = data.items[idx];
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
        <div class="panel-nav${count > 1 ? '' : ' panel-nav--hidden'}">
          <button class="nav-btn prev-btn" ${idx === 0 ? 'disabled' : ''}>${icons.chevLeft}</button>
          <span class="panel-nav-count">${idx + 1}/${count}</span>
          <button class="nav-btn next-btn" ${idx === count - 1 ? 'disabled' : ''}>${icons.chevRight}</button>
        </div>
        <div class="panel-footer-right">
          <button class="use-btn${isUsed ? ' active' : ''}"><svg viewBox="0 0 12 12" fill="none">${icons.person}</svg><span>${isUsed ? 'In Use' : 'Use'}</span></button>
          ${count < divinity.maxPanels ? '<button class="add-btn">+ Add Div</button>' : ''}
        </div>
      </div>`;

    const lockBtn    = panel.querySelector('.tag-lock');
    const panelNav   = panel.querySelector('.panel-nav');
    const footerRight = panel.querySelector('.panel-footer-right');
    const useBtn     = panel.querySelector('.use-btn');
    const contentWrap = panel.querySelector('.panel-content-wrap');
    const navCount   = panel.querySelector('.panel-nav-count');
    const prevBtn    = panel.querySelector('.prev-btn');
    const nextBtn    = panel.querySelector('.next-btn');

    panel._panelNav    = panelNav;
    panel._footerRight = footerRight;
    panel._useBtn      = useBtn;
    panel._contentWrap = contentWrap;
    panel._navCount    = navCount;
    panel._prevBtn     = prevBtn;
    panel._nextBtn     = nextBtn;

    panel.querySelector('.close-btn').addEventListener('click', () => closePanel());
    lockBtn.addEventListener('click', () => {
      const cur  = data.items[data.current];
      cur.locked = !cur.locked;
      applyDivLockBtn(lockBtn, cur.locked);
      toggleTrashBtn(panelNav, panelState.activeId, data.count, data.current, cur.locked);
      saveDivinityState();
    });

    if (nodeIdx > 0)                    panel.querySelector('.node-prev-btn').addEventListener('click', () => navigateNode(-1));
    if (nodeIdx < nodeOrder.length - 1) panel.querySelector('.node-next-btn').addEventListener('click', () => navigateNode(1));
    prevBtn.addEventListener('click', () => { if (data.current > 0) navigateTo(data.current - 1, -1); });
    nextBtn.addEventListener('click', () => { if (data.current < data.count - 1) navigateTo(data.current + 1, 1); });
    if (count < divinity.maxPanels) footerRight.querySelector('.add-btn').addEventListener('click', addSubPanel);
    if (canShowTrash(id, count, idx, s.locked)) panelNav.appendChild(makeDelBtn());

    useBtn.addEventListener('click', () => {
      const cur = data.current;
      setUsed(id, getUsed(id) === cur ? null : cur);
      updateDivCircle(id);
      updateUseBtn(useBtn, getUsed(id) === cur);
      toggleTrashBtn(panelNav, id, data.count, cur, data.items[cur]?.locked);
    });

    let currentUpdateOptions = initDivSubPanel(contentWrap.querySelector('.panel-content'), s);
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
    saveDivinityState();
    panelState.activeId  = cb.id;
    panelState.activeDir = dir;
    Dom.sliderContainer.style.height = Dom.grid.offsetHeight + 'px';
    const panel = makePanelEl(cb.id);
    panel.style.transition = 'none';
    panel.style.transform  = cssTranslate(dir.axis, dir.sign * 100);
    Dom.sliderContainer.appendChild(panel);
    panelState.activePanel = panel;
    panelState.isAnimating = true;
    rAF2(() => {
      panel.style.transition = '';
      panel.style.transform  = cssTranslate(dir.axis, 0);
      Dom.grid.style.transform = cssTranslate(dir.axis, -dir.sign * 100);
    });
    panel.addEventListener('transitionend', () => { panelState.isAnimating = false; }, { once: true });
  }

  function applyDivinityStats(state, panel, ctx, sign) {
    const quality = getQuality(panel);
    let result    = { ...state };
    for (const key of panel.stats) {
      if (!key) continue;
      const meta = divinityDefs[key];
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
      const panel = getData(id).items[panelIndex];
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
    p.stats.some(Boolean) ||
    (!!specialNodes[id] && p.gold && p.lightning && p.stats.length <= 1);

  const hasNode     = id => !!nodeData[id];
  const resetAll    = () => {
    for (const id of nodeOrder) {
      nodeData[id] = { count: 1, inUse: defaultInUse(), items: [defaultItem()] };
    }
    saveDivinityState();
    for (const id of nodeOrder) updateDivCircle(id);
    if (getActivePanel()) closePanel();
  };

  const isNodeActive = id => {
    const d = getData(id);
    return d.items.slice(0, d.count).some(p => isPanelActive(id, p)) ||
      (!!specialNodes[id] && getUsed(id) != null);
  };

  const getDivSummary = () => {
    const totals = {};
    for (const id of nodeOrder) {
      const usedIdx = getUsed(id);
      if (usedIdx == null) continue;
      const s = getData(id).items[usedIdx];
      if (!s) continue;
      const quality = getQuality(s);
      for (const key of s.stats) {
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
    return panel.stats.filter(k => k).map(k => {
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
      const panel = getData(id).items[panelIndex];
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
    const panel = data.items[panelIndex];
    if (!panel) return;
    const curUsedIdx     = getUsed(nodeId);
    const currentNum     = curUsedIdx != null ? curUsedIdx + 1 : null;
    const showComparison = isChanged && curUsedIdx != null && !!data.items[curUsedIdx];
    Modals.openComparison({
      backdropEl:     Dom.divModalBackdrop,
      qualityEl:      Dom.divModal,
      titleEl:        Dom.divModalName,
      flashEl:        Dom.divModalFlash,
      curEl:          Dom.divModalStatsCur,
      arrowEl:        Dom.divModalArrow,
      recEl:          Dom.divModalStatsRec,
      quality:        getQuality(panel),
      title:          (isChanged && currentNum != null)
                        ? `${NODE_NAMES[nodeId]} #${currentNum} \u00bb #${panelIndex + 1}`
                        : `${NODE_NAMES[nodeId]} #${panelIndex + 1}`,
      flashVisible:   panel.lightning && panel.gold,
      curHTML:        showComparison ? buildDivStatRowsHTML(data.items[curUsedIdx]) : '',
      recHTML:        buildDivStatRowsHTML(panel),
      showComparison,
    });
  }

  const closeDivModal = () => Dom.divModalBackdrop.classList.remove('open');

  const bindDivModalNodes = container =>
    Modals.bindModalNodes(container, '.co-div-node', el => ({
      nodeId:     el.dataset.nodeid,
      panelIndex: parseInt(el.dataset.panelindex),
      isChanged:  el.dataset.changed === 'true',
    }), openDivModal);

  return {
    defaultSizeMap,
    getUsed,
    getData, loadDivinityState,
    hasNode, resetAll,
    updateDivCircle, setLockState, toggleTrashBtn, navigateTo,
    applyDivinityPanel, applyDivinity,
    stripCurrentDivinity, isNodeActive,
    writeBestSelection,
    renderSummaryModal,
    buildDivNodesHTML,
    closeDivModal, bindDivModalNodes,
    openPanel, closePanel,
    getActiveId, getActiveSize, getActivePanel, setActiveSize,
    isOptimizeEnabled, setOptimizeEnabled,
    get isAnimating()      { return panelState.isAnimating; },
    get isNodeNavigating() { return panelState.isNodeNavigating; },
  };
})();

const Cards = (() => {
  const { escHtml, parseStatPct, countBy, buildLockSvg, bindCoPanelToggle, fromHTML, setQualityClass, initSlider } = Utils;
  const { isAtkExcluded, getBuffStatOptions } = Labels;
  const { stats: { numFields, dedupGroups: statDedupGroups }, game: { equipSlots }, slotCounts: SLOT_COUNTS, equipLabels: EQUIP_LABELS, ui: { icons } } = Config;

  const MAX_UNUSED_QTY   = 6;
  const QTY_OPTIONS_HTML = Utils.numericOptionsHTML(MAX_UNUSED_QTY);

  const cardDeltaCache     = new Map();
  const cardSkipStatsCache = new Map();

  let cardsOptimize = true;
  const isOptimizeEnabled  = () => cardsOptimize;
  const setOptimizeEnabled = enabled => {
    cardsOptimize = !!enabled;
    Store.write(Config.app.storeKeys.cards, { ...Store.section(Config.app.storeKeys.cards), optimize: cardsOptimize });
  };

  let allCardNamesSorted = null;
  const getAllCardNamesSorted = () => {
    if (allCardNamesSorted) return allCardNamesSorted;
    allCardNamesSorted = typeof cardData !== 'undefined' ? Object.keys(cardData).sort() : [];
    return allCardNamesSorted;
  };

  const cardNamesByEquipCache = new Map();
  const getCardNamesByEquip = equip => {
    if (cardNamesByEquipCache.has(equip)) return cardNamesByEquipCache.get(equip);
    const names = getAllCardNamesSorted().filter(n => cardData[n].equip === equip);
    cardNamesByEquipCache.set(equip, names);
    return names;
  };

  const getCard     = name => (typeof cardData !== 'undefined' ? (cardData[name] ?? null) : null);
  const isValidCard = name => !!name && name !== '—';
  const filterValid = names => names.filter(isValidCard);

  const getWeaponSlotCount = () => (Dom.weapon.value === 'Dagger' ? equipSlots.weapon.count.dagger : equipSlots.weapon.count.default);
  const getSlotKey          = el => `${el.dataset.equip}_${el.dataset.slot}`;

  function buildPoolFromSection(section, adjustForLocked = null, cardSelects = null) {
    const equippedNames = (cardSelects ?? [...section.querySelectorAll('.co-card-select')]).map(input => input.dataset.value || '');

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
    const quality = input.dataset.value ? getCard(input.dataset.value)?.quality : null;
    setQualityClass(input, quality, 'card-q', ['white']);
  }

  function updateCardSelectQuality(sel) {
    const quality = sel.value ? getCard(sel.value)?.quality : null;
    setQualityClass(sel, quality, 'card-q', ['white']);
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
    const allOptions = getCardNamesByEquip(equip);
    createCardSearch({
      input,
      panel: input.nextElementSibling,
      getOptions: () => allOptions,
      onSelect: () => { updateCardSelectQuality(input); saveStateDebounced(section); updateActionBtnVisibility(section); },
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
      const prev           = Store.section(Config.app.storeKeys.cards);
      const inUse = prev.inUse ?? Divinity.defaultSizeMap();
      const locked   = prev.locked   ?? Divinity.defaultSizeMap();
      const unused   = prev.unused   ?? Divinity.defaultSizeMap(() => []);
      inUse[Divinity.getActiveSize()] = readEquipped(section);
      locked[Divinity.getActiveSize()]   = readLocked(section);
      unused[Divinity.getActiveSize()]   = readUnused(section);
      Store.write(Config.app.storeKeys.cards, { inUse, locked, unused, buffs: readBuffs(section), optimize: cardsOptimize });
    } catch (err) {
      console.warn('Cards.saveState: failed to persist card state', err);
    }
  }

  const saveStateDebounced = Utils.debounce(saveState);

  function loadSizeToDOM(section, stored, size) {
    const equipped = (stored.inUse || {})[size] || {};
    const locked   = (stored.locked   || {})[size] || {};
    const unused   = (stored.unused   || {})[size] || [];
    for (const input of section.querySelectorAll('.co-card-select')) {
      const val = equipped[getSlotKey(input)] ?? '';
      input.value = input.dataset.value = val;
      updateCardSelectQuality(input);
    }
    for (const btn of section.querySelectorAll('.co-lock-btn'))
      Divinity.setLockState(btn, !!(locked[getSlotKey(btn)]));
    section.querySelector('#co-unused-list').innerHTML = '';
    for (const { name, qty } of unused) addUnusedRow(section, name, qty);
    updateActionBtnVisibility(section);
  }

  const loadState = section => {
    Store.restore(() => {
      const stored = Store.section(Config.app.storeKeys.cards);
      loadSizeToDOM(section, stored, Divinity.getActiveSize());
      for (const { stat, val } of (stored.buffs || [])) addBuffRow(section, stat, val);
      cardsOptimize = stored.optimize ?? true;
      updateActionBtnVisibility(section);
    }, 'Cards.loadState: failed to restore card state');
  };

  const switchSize = section => {
    Store.restore(
      () => loadSizeToDOM(section, Store.section(Config.app.storeKeys.cards), Divinity.getActiveSize()),
      'Cards.switchSize: failed to reload card state for size change'
    );
  };

  function makeRow({ listSelector, html, populate, onRemove, section }) {
    const row = fromHTML(html);
    populate(row);
    row.querySelector('.co-rm-btn').addEventListener('click', () => { row.remove(); onRemove?.(); });
    row.addEventListener('change', () => saveStateDebounced(section));
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
      onRemove: () => saveStateDebounced(section),
    });
  }

  function rebuildBuffList() {
    const section  = Dom.coSection;
    const buffList = section.querySelector('#co-buff-list');
    if (!buffList) return;
    const buffs = Store.section(Config.app.storeKeys.cards).buffs ?? readBuffs(section);
    buffList.innerHTML = '';
    for (const { stat, val } of buffs) addBuffRow(section, stat, val);
  }

  function addUnusedRow(section, name = '', qty = '1') {
    const allOptions = getAllCardNamesSorted();
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
      onRemove: () => saveStateDebounced(section),
    });
    const input = row.querySelector('.co-unused-name');
    createCardSearch({
      input,
      panel: row.querySelector('.co-card-search-panel'),
      getOptions: () => allOptions,
      onSelect: () => { updateCardSearchQuality(input); saveStateDebounced(section); },
    });
    return row;
  }

  function getSkipStats(card) {
    let skipStats = cardSkipStatsCache.get(card);
    if (skipStats) return skipStats;
    skipStats = new Set(
      statDedupGroups.flatMap(group => {
        const present = group.filter(s => s in card.stats);
        return present.length > 1 ? present.slice(1) : [];
      })
    );
    cardSkipStatsCache.set(card, skipStats);
    return skipStats;
  }

  function getCardStatDelta(name, ctx) {
    const card = getCard(name);
    if (!card || !card.stats) return null;
    const ctxKey  = `${ctx.atkType}|${ctx.wElem}|${ctx.tSize}|${ctx.tRace}|${ctx.tAttr}`;
    let byCtx = cardDeltaCache.get(name);
    if (!byCtx) { byCtx = new Map(); cardDeltaCache.set(name, byCtx); }
    const cached = byCtx.get(ctxKey);
    if (cached) return cached;
    const delta = Object.fromEntries(numFields.map(f => [f, 0]));
    const skipStats = getSkipStats(card);
    for (const [statName, rawVal] of Object.entries(card.stats)) {
      if (skipStats.has(statName)) continue;
      const field = Labels.STAT_RESOLVERS[statName]?.(ctx);
      if (!field) continue;
      const value = parseStatPct(rawVal);
      if (value !== null) delta[field] += value;
    }
    const result = { delta, equip: card.equip };
    byCtx.set(ctxKey, result);
    return result;
  }

  function applyCardStats(state, names, ctx, sign) {
    let result = { ...state };
    for (const name of names) {
      if (!isValidCard(name)) continue;
      const r = getCardStatDelta(name, ctx);
      if (!r) continue;
      for (const field of numFields)
        if (field in result) result[field] = (result[field] || 0) + sign * r.delta[field];
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

  function writeToSlots(names, section) {
    const byEquip = getCardsEquipMap(names);
    const queues  = {};
    for (const [equip, counts] of Object.entries(byEquip))
      queues[equip] = Object.entries(counts).flatMap(([name, qty]) => Array(qty).fill(name));
    for (const input of section.querySelectorAll('.co-card-select')) {
      const queue = queues[input.dataset.equip];
      const val   = queue?.length ? queue.shift() : '';
      input.value = input.dataset.value = val;
      updateCardSelectQuality(input);
    }
    saveState(section);
  }

  const EQUIP_SLIDE_GROUPS = [
    ['weapon'],
    ['clothes', 'cloak', 'shoes'],
    ['accessory'],
    ['headgear'],
  ];

  function buildEquipSlidesHTML() {
    return EQUIP_SLIDE_GROUPS.map((equips, i) => {
      const groupsHTML = equips
        .map(equip => buildEquipGroupHTML(equip, equipSlots[equip].label, equip === 'weapon' ? getWeaponSlotCount() : equipSlots[equip].count))
        .join('');
      return `<div class="co-slide${i === 0 ? ' co-slide--active' : ' co-slide--hidden-right'}">${groupsHTML}</div>`;
    }).join('');
  }

  function buildCardsHTML() {
    return `
      <div class="co-hd" role="button" tabindex="0" aria-expanded="false">
        <div class="co-hd-left">
          <label class="sec-toggle" title="Include in optimizer" onclick="event.stopPropagation()">
            <input type="checkbox" class="sec-toggle-input" id="cardBuffSectionToggle" checked>
            <span class="sec-toggle-track"></span>
            <span class="sec-toggle-thumb"></span>
          </label>
          <span class="co-hd-title">Card & Buff</span>
        </div>
        <span class="co-chevron"></span>
      </div>
      <div class="co-body collapsed" id="co-body-inner">
        <div class="co-body-inner">
          <div class="co-block">
            <div class="co-block-title">Equipped Card</div>
            <p class="co-block-desc">Select currently equipped cards. Lock slots if specific cards are needed for an exclusive set. <span class="spoiler">Pls ignore the color if differ vs in-game <img alt=":pepelaugh:" src="https://masihterjaga.github.io/sim/img/pepelaugh.png" width="10" height="10"></span></p>
            <div class="co-slider">
              <div class="co-slides-wrap" id="co-equipped-slots">${buildEquipSlidesHTML()}</div>
            </div>
            <div class="co-btn-group co-btn-group--split">
              <div class="co-slider-footer-nav">
                <button class="co-slide-nav-btn co-slide-nav-btn--prev" id="co-equip-slide-prev" data-dir="-1" disabled>${icons.chevLeft}Prev</button>
                <button class="co-slide-nav-btn co-slide-nav-btn--next" id="co-equip-slide-next" data-dir="1">Next${icons.chevRight}</button>
              </div>
              <button class="co-action-btn muted" id="co-unequip-all" type="button">Unequip All</button>
            </div>
          </div>
          <div class="co-block">
            <div class="co-block-title">Card Pool</div>
            <p class="co-block-desc">Add unused cards relevant to your target to the pool. <span class="spoiler">Or any cards you're dreaming of and definitely can't afford, here you GO! <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="10" height="10"></span></p>
            <div id="co-unused-list" class="co-unused-list"></div>
            <div class="co-btn-group co-btn-group--split">
              <button class="co-action-btn blue"  id="co-add-unused"    type="button">+ Add Card</button>
              <button class="co-action-btn muted" id="co-dismantle-all" type="button">Dismantle All</button>
            </div>
          </div>
          <div class="co-block">
            <div class="co-block-title">Extra Buff</div>
            <p class="co-block-desc">It is highly recommended to add <span class="buff">Eternal Chaos (Bard/Dancer) or Glorious Command (GS)</span> bonus here.<br /><br />If there are exclusive effects (element enhance, damage bonus, etc.) from cards/equips, add them here. Make sure these haven't been included in the base inputs yet.<br /><br />Note that some effects are already included in your detailed stats (Nano Flying Blade, Acc Obs and Skeg 3*Set, One Punch Man Headgear, etc).</p>
            <div id="co-buff-list" class="co-buff-list"></div>
            <div class="co-btn-group co-btn-group--split">
              <button class="co-action-btn blue"  id="co-add-buff"        type="button">+ Add Buff</button>
              <button class="co-action-btn muted" id="co-clear-all-buffs" type="button">Clear All</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function rebuildWeaponSlots(section) {
    const wrap     = section.querySelector('#co-equipped-slots');
    const oldGroup = wrap.querySelector('[data-equip="weapon"]')?.closest('.co-equip-group');
    if (!oldGroup) return;
    const count    = getWeaponSlotCount();
    const stored   = Store.section(Config.app.storeKeys.cards);
    const equipped = (stored.inUse || {})[Divinity.getActiveSize()] || {};
    const locked   = (stored.locked   || {})[Divinity.getActiveSize()] || {};
    const newGroup = fromHTML(buildEquipGroupHTML('weapon', equipSlots.weapon.label, count));
    newGroup.querySelectorAll('.co-card-select').forEach(input => {
      const val = equipped[`weapon_${input.dataset.slot}`] ?? '';
      input.value = input.dataset.value = val;
      updateCardSelectQuality(input);
      bindEquipSlotSearch(input, section);
    });
    newGroup.querySelectorAll('.co-lock-btn').forEach(btn => {
      Divinity.setLockState(btn, !!(locked[`weapon_${btn.dataset.slot}`]));
    });
    oldGroup.parentNode.replaceChild(newGroup, oldGroup);
    updateActionBtnVisibility(section);
  }

  function updateActionBtnVisibility(section) {
    const hasEquipped = [...section.querySelectorAll('.co-card-select')].some(input => input.dataset.value);
    const hasUnused   = section.querySelector('#co-unused-list').children.length > 0;
    const hasBuffs    = section.querySelector('#co-buff-list').children.length > 0;
    section.querySelector('#co-unequip-all').hidden    = !hasEquipped;
    section.querySelector('#co-dismantle-all').hidden  = !hasUnused;
    section.querySelector('#co-clear-all-buffs').hidden = !hasBuffs;
  }

  function bindCardsEvents(section) {
    bindCoPanelToggle(section.querySelector('.co-hd'));
    const equippedSlots = section.querySelector('#co-equipped-slots');
    const unusedList    = section.querySelector('#co-unused-list');
    const buffList      = section.querySelector('#co-buff-list');
    const refreshBtns   = () => updateActionBtnVisibility(section);
    const save          = () => { saveStateDebounced(section); refreshBtns(); };

    initSlider(
      section, [...equippedSlots.querySelectorAll('.co-slide')],
      null, null,
      null, '#co-equip-slide-prev', '#co-equip-slide-next'
    );

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
        countBy([val], tally);
        input.value = input.dataset.value = '';
        updateCardSelectQuality(input);
      });
      section.querySelectorAll('.co-lock-btn').forEach(btn => Divinity.setLockState(btn, false));
      for (const [name, count] of Object.entries(tally)) {
        const existing = [...unusedList.querySelectorAll('.co-unused-name')].find(el => el.dataset.value === name);
        if (existing) {
          const qtySel = existing.closest('.co-unused-row').querySelector('.co-unused-qty');
          qtySel.value = Math.min(MAX_UNUSED_QTY, (parseInt(qtySel.value) || 0) + count);
        } else {
          addUnusedRow(section, name, String(Math.min(MAX_UNUSED_QTY, count)));
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

    section.addEventListener('click', e => { if (e.target.closest('.co-rm-btn')) refreshBtns(); });

    const toggleCb = section.querySelector('#cardBuffSectionToggle');
    toggleCb.checked = isOptimizeEnabled();
    toggleCb.addEventListener('change', e => setOptimizeEnabled(e.target.checked));

    refreshBtns();
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
          parts.push(`<span class="co-chip co-chip--locked${qClass}"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">${Config.ui.icons.lockClosed}</svg>${escHtml(n)}${numLocked > 1 ? `<span class="co-chip-qty"> ×${numLocked}</span>` : ''}</span>`);
        if (numFree > 0) {
          const freeCurrent = Math.max(0, (beforeInEquip[n] || 0) - (lockedInEquip[n] || 0));
          const swapIcon    = beforeEquipMap != null && numFree > freeCurrent ? Config.ui.icons.horizSwap : '';
          parts.push(`<span class="co-chip${qClass}">${swapIcon}${escHtml(n)}${numFree > 1 ? `<span class="co-chip-qty"> ×${numFree}</span>` : ''}</span>`);
        }
        return parts.join('');
      }).join('');
      return `<div class="co-res-equip"><span class="co-res-equip-lbl">${EQUIP_LABELS[equip] ?? equip}</span><span class="co-res-cards">${chipsHTML}</span></div>`;
    }).join('') || Utils.EMPTY_STATE_HTML;
  }

  const onContextChanged = () => { cardDeltaCache.clear(); rebuildBuffList(); };

  return {
    isValidCard, filterValid,
    getWeaponSlotCount, getSlotKey, buildPoolFromSection,
    applyCards, stripCards,
    getCardsEquipMap, writeToSlots,
    buildCardsHTML, buildCardsBreakdownHTML,
    addBuffRow, rebuildBuffList, addUnusedRow,
    saveState, loadState, switchSize,
    bindCardsEvents, rebuildWeaponSlots,
    onContextChanged,
    SLOT_COUNTS,
    isOptimizeEnabled, setOptimizeEnabled,
  };
})();

const Companion = (() => {
  const { fmtPct, escHtml, updateUseBtn, initSlider, updateSelectsDisabled, bindCoPanelToggle, fromHTML, setQualityClass, buildLockSvg } = Utils;
  const { companion, ui: { icons } } = Config;
  const { slots: companionSlots, maxItems: maxCompanion, maxStats: maxCompanionStats, rates: companionRates, starMult: companionStarMult } = companion;

  const companionState = { items: [], formation: {}, optimize: true };
  const items      = companionState.items;
  const formation = companionState.formation;
  const isOptimizeEnabled  = () => companionState.optimize;
  const setOptimizeEnabled = enabled => { companionState.optimize = !!enabled; saveCompanionState(); };
  let activeIdx   = null;
  let currentSlot = 0;

  const clearFormation = () => { for (const k of Object.keys(formation)) delete formation[k]; };

  const getFormationItem = slotIdx => formation[slotIdx]?.item ?? null;
  const getFormationLock = slotIdx => formation[slotIdx]?.lock ?? false;
  const getLockedSlots    = () => new Set(
    Object.entries(formation).filter(([, entry]) => entry?.lock).map(([slot]) => Number(slot))
  );
  const getFlatFormation = () => {
    const flat = {};
    for (const [slot, entry] of Object.entries(formation)) flat[slot] = entry?.item ?? null;
    return flat;
  };
  const isCompanionSlotLocked = slotIdx => getFormationLock(slotIdx);


  const slides      = [...Dom.companionSection.querySelectorAll('.co-slide')];
  const addBtnLabel = Dom.companionAddBtn.closest('.companion-item-add-node').querySelector('.companion-item-dot-lbl');
  Dom.companionClearBtn.innerHTML = icons.trash;
  Dom.companionQLock.innerHTML   = buildLockSvg(false);

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
      const isLocked  = isCompanionSlotLocked(s);
      const recName   = item.name?.trim() || `Item ${recIdx + 1}`;
      parts.push(`<div class="co-companion-node${isChanged ? ' co-companion-changed' : ''}"
        data-slot="${s}" data-recidx="${recIdx}" data-curidx="${curIdx ?? ''}" data-changed="${isChanged}">
        <div class="co-companion-dot${quality ? ' quality-' + quality : ''}"><span>${s + 1}</span>${isChanged ? icons.companionSwap : ''}${isLocked ? icons.divLock : ''}</div>
        <span class="co-companion-lbl">${escHtml(recName)}</span>
      </div>`);
    }
    return parts.join('');
  }

  function buildCompanionStatRowsHTML(item, idx) {
    const statOptMap = new Map(Labels.COMPANION_STAT_OPTIONS.map(o => [o.key, o]));
    const stats = item?.stats || [];
    if (!stats.length) return `<div class="co-companion-modal-empty">No stats configured.</div>`;
    const name = item.name?.trim() || `Item ${idx + 1}`;
    return `<div class="co-companion-modal-item-name">${escHtml(name)}</div>` +
      stats.map(key => {
        const lbl = key ? escHtml(statOptMap.get(key)?.label ?? key) : '-';
        return `<span class="co-chip${key ? '' : ' co-chip--empty'}">${lbl}</span>`;
      }).join('');
  }

  function openCompanionModal({ slotIdx, recIdx, curIdx, isChanged }) {
    const recItem        = recIdx != null ? items[recIdx] : null;
    const curItem        = curIdx != null ? items[curIdx] : null;
    const showComparison = isChanged && curItem != null;
    Dom.coCompanionModalStar.hidden          = !recItem?.star;
    Dom.coCompanionModalSlotName.textContent = `Formation Slot ${slotIdx + 1}`;
    Dom.coCompanionModalSubtitle.textContent = showComparison ? 'Item Change' : 'Recommended Item';
    Modals.openComparison({
      backdropEl:     Dom.coCompanionBackdrop,
      qualityEl:      Dom.coCompanionModal,
      titleEl:        null,
      flashEl:        null,
      curEl:          Dom.coCompanionModalStatsCur,
      arrowEl:        Dom.coCompanionModalArrow,
      recEl:          Dom.coCompanionModalStatsRec,
      quality:        recItem?.quality ?? null,
      title:          '',
      flashVisible:   false,
      curHTML:        showComparison ? buildCompanionStatRowsHTML(curItem, curIdx) : '',
      recHTML:        buildCompanionStatRowsHTML(recItem, recIdx),
      showComparison,
    });
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
  const serializeFormation = () => Object.fromEntries(
    Object.entries(formation).map(([slot, entry]) => [slot, entry.lock ? { item: entry.item, lock: true } : { item: entry.item }])
  );
  const saveCompanionState = () => Store.write(Config.app.storeKeys.companion, { ...companionState, formation: serializeFormation(), upgradeProgress: readSlideInputs() });

  const saveCompanionStateDebounced = Utils.debounce(saveCompanionState);

  function loadCompanionState() {
    Store.restore(() => {
      const stored = Store.section(Config.app.storeKeys.companion);
      if (!Object.keys(stored).length) return;
      companionState.optimize = stored.optimize ?? true;
      if (Array.isArray(stored.items)) {
        const mapped = stored.items.map(it => {
          const def = defaultCompanionItem();
          return { stats: Array.isArray(it.stats) ? it.stats : def.stats, quality: it.quality ?? def.quality, name: it.name ?? def.name, star: it.star ?? def.star };
        });
        items.length = 0;
        items.push(...mapped);
      }
      const usedEntries = Object.entries(stored.formation ?? {})
        .map(([k, v]) => [Number(k), typeof v === 'object' && v !== null ? { item: Number(v.item), lock: !!v.lock } : { item: Number(v), lock: false }])
        .filter(([slot, entry]) => Number.isFinite(slot) && Number.isFinite(entry.item) && entry.item < items.length);
      clearFormation();
      for (const [k, entry] of usedEntries) formation[k] = { item: entry.item, lock: entry.lock };
      if (Array.isArray(stored.upgradeProgress)) {
        stored.upgradeProgress.forEach((vals, si) => {
          if (!slides[si]) return;
          const inputs = slides[si].querySelectorAll('.stats-input');
          vals.forEach((v, vi) => { if (inputs[vi]) inputs[vi].value = v; });
        });
      }
    }, 'Companion.loadCompanionState: failed to restore companion state');
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

  const calcCompanionSlotValues = slotIdx => resolveCompanionSlot(slotIdx, getFormationItem(slotIdx)) ?? {};
  const getCompanionItemSlot    = itemIdx => {
    for (const [slot, entry] of Object.entries(formation)) {
      if (entry?.item === itemIdx) return Number(slot);
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
  const getCompanionUsed  = () => getFlatFormation();

  function writeAssignment(assign) {
    const lockedSlots = getLockedSlots();
    clearFormation();
    for (const [slot, idx] of Object.entries(assign ?? {}))
      if (idx != null) formation[slot] = { item: idx, lock: lockedSlots.has(Number(slot)) };
    saveCompanionState();
    renderCompanionCircles();
    updateCompanionAddBtn();
    updateCompanionClearBtn();
    updateAllCompanionSlides();
  }

  const applyCompanion    = (state, slotMap) => applyCompanionStats(state, slotMap,  1);
  const stripCompanion    = (state, slotMap) => applyCompanionStats(state, slotMap, -1);

  function runCompanionOptimizer(baseState) {
    if (!items.length) return null;
    const lockedSlots = getLockedSlots();
    const lockedMap   = new Map([...lockedSlots].map(s => [s, getFormationItem(s)]));
    let bestMult   = -Infinity;
    let bestAssign = {};
    function backtrack(slotIdx, assign, usedItems, state) {
      if (slotIdx === companionSlots) {
        const m = Formula.calculateMultiplier(state).mult;
        if (m > bestMult) { bestMult = m; bestAssign = { ...assign }; }
        return;
      }
      if (lockedMap.has(slotIdx)) {
        const lockedItem = lockedMap.get(slotIdx);
        assign[slotIdx] = lockedItem;
        backtrack(slotIdx + 1, assign, usedItems, applyCompanion(state, { [slotIdx]: lockedItem }));
        assign[slotIdx] = null;
        return;
      }
      assign[slotIdx] = null;
      backtrack(slotIdx + 1, assign, usedItems, state);
      for (let i = 0; i < items.length; i++) {
        if (usedItems.has(i)) continue;
        assign[slotIdx] = i;
        usedItems.add(i);
        backtrack(slotIdx + 1, assign, usedItems, applyCompanion(state, { [slotIdx]: i }));
        usedItems.delete(i);
        assign[slotIdx] = null;
      }
    }
    backtrack(0, {}, new Set(lockedMap.values()), baseState);
    const currentUsed = getFlatFormation();
    const improved    = Object.keys(bestAssign).some(s => (bestAssign[s] ?? null) !== (currentUsed[s] ?? null));
    return { assignment: bestAssign, improved };
  }


  function updateCompanionSlideLabel(slotIdx) {
    const itemIdx = getFormationItem(slotIdx);
    const suffix  = itemIdx != null ? ` (${getCompanionItemName(itemIdx)})` : '';
    Dom.companionSlideLabel.textContent = `SLOT ${slotIdx + 1}${suffix}`;
  }

  function updateCompanionSlideValues(slotIdx) {
    if (!slides[slotIdx]) return;
    let display  = slides[slotIdx].querySelector('.companion-slot-values');
    const itemIdx = getFormationItem(slotIdx);
    const item    = itemIdx != null ? items[itemIdx] : null;
    if (slotIdx === currentSlot) updateCompanionSlideLabel(slotIdx);
    if (!item) { display?.remove(); return; }
    if (!display) {
      display = document.createElement('div');
      display.className = 'companion-slot-values';
      slides[slotIdx].appendChild(display);
    }
    const vals       = calcCompanionSlotValues(slotIdx);
    const hasVals    = Object.keys(vals).length > 0;
    const starActive = item.star;
    const statsHTML  = item.stats.map(key => {
      if (!key) return `<div class="companion-slot-val-row"><span class="companion-slot-val-lbl">-</span></div>`;
      const lbl = Labels.COMPANION_FIELD_LABELS[key] || key;
      const val = hasVals ? vals[key] ?? 0 : 0;
      return `<div class="companion-slot-val-row">
        <span class="companion-slot-val-lbl">${lbl}</span>
        <span class="companion-slot-val-num">+${fmtPct(val)}%</span>
      </div>`;
    }).join('');
    display.innerHTML = statsHTML + (starActive ? `<div class="companion-slot-val-row companion-slot-star-row"><span class="companion-slot-val-lbl companion-slot-star-lbl">${icons.star.repeat(4)}</span><span class="companion-slot-val-num companion-slot-val-num--star">×${companionStarMult}</span></div>` : '');
  }

  const updateAllCompanionSlides = () => { for (let s = 0; s < companionSlots; s++) updateCompanionSlideValues(s); };

  function companionOnSlotChange(slotIdx) {
    currentSlot = slotIdx;
    updateCompanionSlideLabel(slotIdx);
    if (activeIdx != null) { updateCompanionUseBtn(); updateCompanionCircle(activeIdx); updateCompanionLockBtn(); }
  }


  const getCompanionDotClasses = (item, idx, usedSlot) => {
    const cls = ['companion-item-dot'];
    if (item.quality)      cls.push(`quality-${item.quality}`);
    if (usedSlot != null)  cls.push('is-used');
    if (idx === activeIdx) cls.push('is-active-panel');
    return cls.join(' ');
  };

  function makeCircleEl(idx) {
    const node     = document.createElement('div');
    node.className   = 'companion-item-node';
    node.dataset.idx = idx;
    node.innerHTML   = `<div class="companion-item-dot"></div><span class="companion-item-dot-lbl"></span>`;
    node.addEventListener('click', () => toggleCompanionSheet(idx));
    updateCompanionCircle(idx, node);
    return node;
  }

  function renderCompanionCircles() {
    Dom.companionItemRow.querySelectorAll('.companion-item-node').forEach(el => el.remove());
    const addNode = Dom.companionItemRow.querySelector('.companion-item-add-node');
    items.forEach((_, idx) => Dom.companionItemRow.insertBefore(makeCircleEl(idx), addNode));
  }

  function updateCompanionCircle(idx, el) {
    if (idx == null || idx < 0 || idx >= items.length) return;
    el = el ?? Dom.companionItemRow.querySelector(`.companion-item-node[data-idx="${idx}"]`);
    if (!el) return;
    const item     = items[idx];
    const usedSlot = getCompanionItemSlot(idx);
    el.classList.toggle('has-stats', item.stats.some(Boolean));
    const dot = el.querySelector('.companion-item-dot');
    dot.className   = getCompanionDotClasses(item, idx, usedSlot);
    dot.textContent = usedSlot != null ? String(usedSlot + 1) : '';
    el.querySelector('.companion-item-dot-lbl').textContent = getCompanionItemName(idx);
  }

  function updateCompanionQualityBtns() {
    const item = activeIdx != null ? items[activeIdx] : null;
    const q    = item?.quality ?? null;
    Dom.companionQPurple.classList.toggle('active', q === 'purple');
    Dom.companionQGold.classList.toggle('active',   q === 'gold');
    Dom.companionQStar.classList.toggle('active',   !!(item?.star));
  }

  function updateCompanionLockBtn() {
    const canShowLock = activeIdx != null && getFormationItem(currentSlot) === activeIdx;
    Dom.companionQLock.style.display = canShowLock ? '' : 'none';
    if (!canShowLock) return;
    const locked = getFormationLock(currentSlot);
    Dom.companionQLock.classList.toggle('active', locked);
    Dom.companionQLock.innerHTML = buildLockSvg(locked);
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

  function setCompanionLock() {
    if (activeIdx == null || getFormationItem(currentSlot) !== activeIdx) return;
    formation[currentSlot].lock = !getFormationLock(currentSlot);
    updateCompanionLockBtn();
    saveCompanionState();
  }

  const updateCompanionUseBtn = () =>
    updateUseBtn(Dom.companionUseBtn, activeIdx != null && getFormationItem(currentSlot) === activeIdx);

  function openCompanionSheet(idx) {
    activeIdx = idx;
    Dom.companionSheetTitle.textContent = getCompanionItemName(idx);
    updateCompanionQualityBtns();
    updateCompanionLockBtn();
    updateCompanionUseBtn();
    renderCompanionSheetStats();
    Dom.companionItemPanel.classList.add('open');
    Dom.companionQualityBtns.style.visibility = 'visible';
    updateCompanionCircle(idx);
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
    const optionsHTML = Labels.COMPANION_STAT_OPTIONS.map(o => {
      const excl = Labels.isAtkExcluded(o.key) && o.key !== selectedKey;
      return `<option value="${o.key}"${o.key === selectedKey ? ' selected' : ''}${excl ? ' disabled' : ''}>${o.label}</option>`;
    }).join('');
    const rowEl = fromHTML(`<div class="companion-sheet-stat-row"><span class="stats-label">Stat ${index + 1}</span><div class="select-wrap"><select class="companion-sheet-select"><option value="">— Select —</option>${optionsHTML}</select></div></div>`);
    const sel   = rowEl.querySelector('.companion-sheet-select');
    sel.addEventListener('change', () => {
      items[activeIdx].stats[index] = sel.value || null;
      updateCompanionSelects();
      const slot = getCompanionItemSlot(activeIdx);
      if (slot != null) updateCompanionSlideValues(slot);
      updateCompanionCircle(activeIdx);
      saveCompanionState();
    });
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
        inp.addEventListener('input', () => { updateCompanionSlideValues(si); saveCompanionStateDebounced(); });
      });
    });

    Dom.companionQLock.addEventListener('click',   () => setCompanionLock());
    Dom.companionQPurple.addEventListener('click', () => setCompanionQuality('purple'));
    Dom.companionQGold.addEventListener('click',   () => setCompanionQuality('gold'));
    Dom.companionQStar.addEventListener('click',   () => setCompanionStar());

    Dom.companionUseBtn.addEventListener('click', () => {
      if (activeIdx == null) return;
      if (getFormationItem(currentSlot) === activeIdx) {
        delete formation[currentSlot];
        updateCompanionSlideValues(currentSlot);
      } else {
        const prevSlot = getCompanionItemSlot(activeIdx);
        if (prevSlot != null) { delete formation[prevSlot]; updateCompanionSlideValues(prevSlot); }
        const prevItem = getFormationItem(currentSlot);
        if (prevItem != null) { delete formation[currentSlot]; updateCompanionCircle(prevItem); }
        formation[currentSlot] = { item: activeIdx, lock: false };
        updateCompanionSlideValues(currentSlot);
      }
      saveCompanionState();
      updateCompanionCircle(activeIdx);
      updateCompanionUseBtn();
      updateCompanionLockBtn();
    });

    Dom.companionRemoveBtn.addEventListener('click', () => {
      if (activeIdx == null) return;
      if (!confirm(`Remove Item ${activeIdx + 1}?`)) return;
      for (const [slot, entry] of Object.entries(formation)) {
        if (entry?.item === activeIdx) { delete formation[slot]; updateCompanionSlideValues(Number(slot)); }
      }
      items.splice(activeIdx, 1);
      const shifted = Object.entries(formation).map(([slot, entry]) => [slot, { item: entry.item > activeIdx ? entry.item - 1 : entry.item, lock: entry.lock }]);
      clearFormation();
      for (const [slot, entry] of shifted) formation[slot] = entry;
      saveCompanionState();
      closeCompanionSheet();
      renderCompanionCircles();
      updateCompanionAddBtn();
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
      if (!confirm('Remove all added companions?')) return;
      items.length = 0;
      clearFormation();
      saveCompanionState();
      closeCompanionSheet();
      renderCompanionCircles();
      updateCompanionAddBtn();
      updateCompanionClearBtn();
      for (let s = 0; s < companionSlots; s++) updateCompanionSlideValues(s);
    });

    Dom.companionResetInputBtn.addEventListener('click', () => {
      if (!confirm('Reset all upgrade progress for Slot 1-4?')) return;
      for (let s = 0; s < companionSlots; s++) {
        if (slides[s]) slides[s].querySelectorAll('.stats-input').forEach(inp => { inp.value = ''; });
        updateCompanionSlideValues(s);
      }
      saveCompanionState();
    });

    Dom.companionAddBtn.addEventListener('click', () => {
      if (items.length >= maxCompanion) return;
      items.push(defaultCompanionItem());
      saveCompanionState();
      renderCompanionCircles();
      updateCompanionAddBtn();
      updateCompanionClearBtn();
    });

    loadCompanionState();
    renderCompanionCircles();
    updateCompanionAddBtn();
    updateCompanionClearBtn();
    updateAllCompanionSlides();
  }

  return {
    buildCompanionNodesHTML, bindCompanionModalNodes,
    initCompanionSlider, initCompanionItems,
    applyCompanion, stripCompanion,
    runOptimizer:  runCompanionOptimizer,
    getItems:      getCompanionItems,
    getUsed:       getCompanionUsed,
    writeAssignment,
    getBonuses:    getCompanionBonuses,
    rerenderSheet: rerenderCompanionSheet,
    isOptimizeEnabled, setOptimizeEnabled,
  };
})();

const Enchant = (() => {
  const { enchant, ENCHANT_OPTIONS_MAP: EOMAP } = Config;
  const { sixSlot: enchantSixSlot, options: enchantOptions, levelHtml: enchantLevelHtml, awakeningPerLevel: enchantAwakeningPerLevel, maxPrefs: maxEnchPrefs } = enchant;
  const { fromHTML, bindCoPanelToggle, initSlider } = Utils;

  const ACC_GROUPS = [
    { label: 'Left Accessory',  range: [0, 3] },
    { label: 'Right Accessory', range: [3, 6] },
    { label: 'Talisman',        range: [6, 9] },
  ];

  let activeSlide = 0;

  const makeDefaultEnchantGroup = () => ({
    slots: [],
    prefs: { mode: 'chip', chip: [], custom: [] },
  });

  const enchantState = {
    awakening: '',
    customPrefAwk: '',
    weapon: makeDefaultEnchantGroup(),
    acc:    makeDefaultEnchantGroup(),
    optimize: true,
  };
  const saveEnchantState = () => Store.write(Config.app.storeKeys.enchant, enchantState);
  const isOptimizeEnabled  = () => enchantState.optimize;
  const setOptimizeEnabled = enabled => { enchantState.optimize = !!enabled; saveEnchantState(); };

  const renderActiveSettingsPanel = () => { activeSlide === 0 ? renderWeaponSettingsPanel() : renderAccSettingsPanel(); };

  const refresh = () => {
    if (!Dom.enchSettingsPanel?.classList.contains('open')) return;
    renderActiveSettingsPanel();
  };

  const resetEnchantPrefs = (group, mode) => {
    enchantState[group].prefs[mode] = [];
    if (mode === 'custom') enchantState.customPrefAwk = '';
    saveEnchantState();
    refresh();
  };

  const resetEnchantSlots = group => {
    enchantState[group].slots = [];
    if (Dom.enchAwakeningSelect) Dom.enchAwakeningSelect.value = '';
    enchantState.awakening = '';
    saveEnchantState();
    if (group === 'weapon') rebuildWeaponEnchantPairs(true);
    else                    rebuildAccEnchantPairs(true);
    refresh();
  };

  const setActiveSlide = idx => { activeSlide = idx; };
  const getActiveSlide = () => activeSlide;

  const toggleMode = (group, renderFn) => {
    enchantState[group].prefs.mode = enchantState[group].prefs.mode === 'custom' ? 'chip' : 'custom';
    saveEnchantState();
    renderFn();
  };

  const getWeaponEnchantLayout = weapon => {
    const groups = enchantSixSlot.has(weapon)
      ? [{ label: 'Main Hand', range: [0, 3] }, { label: 'Off Hand', range: [3, 6] }]
      : [{ label: '2Handed Enchantment', range: [0, 3] }];
    return { slotCount: groups[groups.length - 1].range[1], groups };
  };

  const getWeaponEnchantColForSlot = (weapon, slotIndex) => {
    if (weapon === 'Dagger') return 'Dagger';
    return enchantSixSlot.has(weapon) ? (slotIndex < 3 ? '1H' : 'Shield') : '2H';
  };

  const getAwkMult    = () => { const v = parseInt(Dom.enchAwakeningSelect?.value) || 0; return v > 0 ? (1 + v * enchantAwakeningPerLevel) : 1; };
  const getCustomAwkMult = () => { const v = parseInt(enchantState.customPrefAwk) || 0; return v > 0 ? (1 + v * enchantAwakeningPerLevel) : getAwkMult(); };
  const getEnchantVal    = (key, level, col, awkMult) => {
    const eq     = EOMAP.get(key)?.eq;
    const perLvl = col === 'acc' ? eq?.acc?.value : eq?.weapon?.[col];
    if (perLvl == null) return null;
    return +(perLvl * level * awkMult).toFixed(2);
  };
  const getEnchantsByEq  = eq => enchantOptions.filter(o => o.eq[eq]);

  const getPairSelects = pair => [pair.children[0]?.firstElementChild, pair.children[1]?.firstElementChild];
  const readPair = pair => {
    const [enchantSel, lvlSel] = getPairSelects(pair);
    return { enchant: enchantSel?.value || '', level: lvlSel?.value || '' };
  };
  const readPairsFrom = lines => [...(lines?.querySelectorAll('.ench-pair') ?? [])].map(readPair);

  function makeEnchantLabel(id, text) {
    const el = document.createElement('div');
    el.className = 'ench-section-title';
    el.id = id;
    el.textContent = text;
    return el;
  }

  function makeEnchantPairEl(savedEnchant, savedLevel, slotKey = 'weapon') {
    const pair = fromHTML(`<div class="ench-pair">
      <div class="select-wrap"><select class="stats-select">${Labels.buildEnchantOptionsHTML(savedEnchant || '', slotKey)}</select></div>
      <div class="select-wrap"><select class="stats-select">${enchantLevelHtml}</select></div>
    </div>`);
    const [enchantSel, lvlSel] = getPairSelects(pair);
    if (savedEnchant) enchantSel.value = savedEnchant;
    if (savedLevel)   lvlSel.value     = savedLevel;
    return pair;
  }

  function rebuildEnchantPairs({ lines, groups, slotCount, slotKey, saved }, force) {
    if (!lines) return;
    const pairs = lines.querySelectorAll('.ench-pair');
    if (!force && pairs.length === slotCount) {
      pairs.forEach(pair => {
        const [enchantSel] = getPairSelects(pair);
        if (!enchantSel) return;
        const cur = enchantSel.value;
        enchantSel.innerHTML = Labels.buildEnchantOptionsHTML(cur, slotKey);
        enchantSel.value = cur;
      });
      return;
    }
    lines.innerHTML = '';
    for (const { label, range: [start, end] } of groups) {
      lines.appendChild(makeEnchantLabel(`${slotKey === 'acc' ? 'enchLblAcc' : 'enchLbl'}_${start}`, label));
      for (let i = start; i < end; i++)
        lines.appendChild(makeEnchantPairEl(saved[i]?.enchant, saved[i]?.level, slotKey));
    }
  }

  function rebuildWeaponEnchantPairs(force = false) {
    const weapon = Dom.weapon.value;
    const { slotCount, groups } = getWeaponEnchantLayout(weapon);
    rebuildEnchantPairs({ lines: Dom.enchWeaponLines, groups, slotCount, slotKey: 'weapon', saved: enchantState.weapon.slots }, force);
  }

  function rebuildAccEnchantPairs(force = false) {
    const slotCount = ACC_GROUPS[ACC_GROUPS.length - 1].range[1];
    rebuildEnchantPairs({ lines: Dom.enchAccLines, groups: ACC_GROUPS, slotCount, slotKey: 'acc', saved: enchantState.acc.slots }, force);
  }

  function readEnchantStateFromDOM() {
    enchantState.awakening       = Dom.enchAwakeningSelect?.value || '';
    enchantState.weapon.slots    = readPairsFrom(Dom.enchWeaponLines);
    enchantState.acc.slots       = readPairsFrom(Dom.enchAccLines);
    saveEnchantState();
  }

  function loadEnchantState() {
    Store.restore(() => {
      const stored = Store.section(Config.app.storeKeys.enchant);
      enchantState.awakening = stored.awakening || '';
      enchantState.customPrefAwk = stored.customPrefAwk || '';
      enchantState.optimize  = stored.optimize ?? true;
      const normalizeGroup = raw => ({
        slots: raw.slots || [],
        prefs: {
          mode:   raw.prefs?.mode   || 'chip',
          chip:   raw.prefs?.chip   || [],
          custom: raw.prefs?.custom || [],
        },
      });
      enchantState.weapon = normalizeGroup(stored.weapon || {});
      enchantState.acc    = normalizeGroup(stored.acc    || {});
      if (Dom.enchAwakeningSelect && enchantState.awakening) Dom.enchAwakeningSelect.value = enchantState.awakening;
      rebuildWeaponEnchantPairs();
      rebuildAccEnchantPairs();
    }, 'Enchant.loadEnchantState: failed to restore enchantment state');
  }

  function getEnchantSlotState() {
    const weapon  = Dom.weapon.value;
    const awkMult = getAwkMult();
    const weaponSlots = readPairsFrom(Dom.enchWeaponLines).map(({ enchant, level }, i) =>
      ({ key: enchant, level: parseInt(level) || 0, col: getWeaponEnchantColForSlot(weapon, i), slotIdx: i, group: 'weapon', awkMult })
    );
    const accSlots = readPairsFrom(Dom.enchAccLines).map(({ enchant, level }, i) =>
      ({ key: enchant, level: parseInt(level) || 0, col: 'acc', slotIdx: i, group: 'acc', awkMult })
    );
    return [...weaponSlots, ...accSlots];
  }

  const makeEnchantEntry = (key, level, col, awkMult) => {
    const opt = EOMAP.get(key);
    if (!opt) return null;
    const val = getEnchantVal(key, level, col, awkMult);
    if (val == null) return null;
    return { key, field: opt.type, val, label: opt.label, type: opt.type };
  };

  const getAccGroupForSlot = slotIdx => {
    const groupIdx = ACC_GROUPS.findIndex(({ range: [start, end] }) => slotIdx >= start && slotIdx < end);
    return groupIdx === -1 ? null : { groupIdx, localIdx: slotIdx - ACC_GROUPS[groupIdx].range[0] };
  };

  function getEnchantCandidates(slotState) {
    return slotState.map(({ key, level, col, slotIdx, group, awkMult }) => {
      const grpState = group === 'acc' ? enchantState.acc : enchantState.weapon;
      const prefs    = grpState.prefs;
      const isCustom = prefs.mode === 'custom';

      if (isCustom) {
        const cs = prefs.custom?.[slotIdx];
        if (!cs?.enchant || !cs?.level) return [];
        const entry = makeEnchantEntry(cs.enchant, parseInt(cs.level), col, getCustomAwkMult());
        return entry ? [entry] : [];
      }

      if (!level) return [];
      let chipPool;
      if (group === 'acc') {
        const loc = getAccGroupForSlot(slotIdx);
        chipPool = loc ? (prefs.chip[loc.groupIdx]?.[loc.localIdx] || []) : [];
      } else {
        chipPool = prefs.chip[slotIdx] || [];
      }
      const poolKeys = new Set(chipPool);
      if (key) poolKeys.add(key);
      return [...poolKeys].map(k => makeEnchantEntry(k, level, col, awkMult)).filter(Boolean);
    });
  }

  const getEnchantCurrentAssign = slotState =>
    slotState.map(({ key, level, col, awkMult }) =>
      (key && level) ? makeEnchantEntry(key, level, col, awkMult) : null
    );

  function writeAssignment(assignment) {
    if (!assignment?.length) return;
    const weaponPairs = [...Dom.enchWeaponLines.querySelectorAll('.ench-pair')];
    const accPairs    = [...Dom.enchAccLines.querySelectorAll('.ench-pair')];
    const allPairs    = [...weaponPairs, ...accPairs];
    allPairs.forEach((pair, i) => {
      const entry = assignment[i];
      if (!entry?.key) return;
      const [enchantSel] = getPairSelects(pair);
      if (enchantSel) enchantSel.value = entry.key;
    });
    readEnchantStateFromDOM();
  }

  const isPenEntry = entry => entry?.field === 'rawPen' || entry?.field === 'pctPen';

  function stripRawPenEnchant(rawPenVal, enchRaw, enchPct) {
    const withoutPct = enchPct ? rawPenVal / (1 + enchPct / 100) : rawPenVal;
    return withoutPct - enchRaw;
  }

  function applyRawPenEnchant(basePen, enchRaw, enchPct) {
    return (basePen + enchRaw) * (1 + enchPct / 100);
  }

  function applyEnchantStats(state, assignment, sign = 1) {
    if (!assignment?.length) return state;
    let result = { ...state };
    let enchRaw = 0;
    let enchPct = 0;
    for (const s of assignment) {
      if (!s?.field) continue;
      if (s.field === 'rawPen') { enchRaw += s.val; continue; }
      if (s.field === 'pctPen') { enchPct += s.val; continue; }
      result[s.field] = (result[s.field] || 0) + sign * s.val;
    }
    if (enchRaw || enchPct)
      result.rawPen = sign > 0
        ? applyRawPenEnchant(result.rawPen || 0, enchRaw, enchPct)
        : stripRawPenEnchant(result.rawPen || 0, enchRaw, enchPct);
    return result;
  }

  const applyEnchant = (state, assignment) => applyEnchantStats(state, assignment,  1);
  const stripEnchant  = (state, assignment) => applyEnchantStats(state, assignment, -1);

  function runEnchantOptimizer(baseState, candidates, initialAssignment) {
    if (!candidates?.length || candidates.every(c => !c.length)) return null;

    const slots = candidates.length;
    const candList = candidates.map((c, i) => c.length ? c : [initialAssignment[i] ?? null]);

    const coupledIdx     = [];
    const independentIdx = [];
    for (let i = 0; i < slots; i++) (candList[i].some(isPenEntry) ? coupledIdx : independentIdx).push(i);

    const independentPick    = new Array(slots).fill(null);
    let stateAfterIndependent = { ...baseState };
    for (const i of independentIdx) {
      const { best: bestCand } = Utils.argmaxBy(
        candList[i],
        cand => {
          const trial = { ...stateAfterIndependent };
          if (cand?.field) trial[cand.field] = (trial[cand.field] || 0) + cand.val;
          return Formula.calculateMultiplier(trial).mult;
        },
        candList[i][0] ?? null
      );
      independentPick[i] = bestCand;
      if (bestCand?.field) stateAfterIndependent[bestCand.field] = (stateAfterIndependent[bestCand.field] || 0) + bestCand.val;
    }

    let bestCoupled = coupledIdx.map(i => candList[i][0] ?? null);
    if (coupledIdx.length) {
      const indices = new Array(coupledIdx.length).fill(0);
      let bestMult = -Infinity;
      while (true) {
        let enchRaw = 0;
        let enchPct = 0;
        const state = { ...stateAfterIndependent };
        for (let j = 0; j < coupledIdx.length; j++) {
          const cand = candList[coupledIdx[j]][indices[j]];
          if (!cand?.field) continue;
          if (cand.field === 'rawPen') { enchRaw += cand.val; continue; }
          if (cand.field === 'pctPen') { enchPct += cand.val; continue; }
          state[cand.field] = (state[cand.field] || 0) + cand.val;
        }
        state.rawPen = applyRawPenEnchant(stateAfterIndependent.rawPen || 0, enchRaw, enchPct);
        const mult = Formula.calculateMultiplier(state).mult;
        if (mult > bestMult) {
          bestMult    = mult;
          bestCoupled = indices.map((idx, j) => candList[coupledIdx[j]][idx] ?? null);
        }

        let carry = coupledIdx.length - 1;
        while (carry >= 0) {
          indices[carry]++;
          if (indices[carry] < candList[coupledIdx[carry]].length) break;
          indices[carry] = 0;
          carry--;
        }
        if (carry < 0) break;
      }
    }

    const bestAssignment = new Array(slots).fill(null);
    independentIdx.forEach(i => { bestAssignment[i] = independentPick[i]; });
    coupledIdx.forEach((i, k) => { bestAssignment[i] = bestCoupled[k]; });
    return bestAssignment;
  }

  const hasActiveEnchantCandidates = () => getEnchantCandidates(getEnchantSlotState()).some(c => c.length);

  function runOptimizer(baseState, currentAssignment) {
    const slotState  = getEnchantSlotState();
    const candidates = getEnchantCandidates(slotState);
    return runEnchantOptimizer(baseState, candidates, currentAssignment ?? getEnchantCurrentAssign(slotState));
  }

  function buildModeToggleButton(isCustom, onToggle) {
    const modeBtn = document.createElement('button');
    modeBtn.type        = 'button';
    modeBtn.className   = 'ench-mode-btn' + (isCustom ? ' active' : '');
    modeBtn.textContent = isCustom ? 'Back to Chip' : 'Switch to Custom';
    modeBtn.addEventListener('click', () => {
      const panel = Dom.enchSettingsPanel;
      panel.classList.remove('open');
      panel.addEventListener('transitionend', () => {
        onToggle();
        setTimeout(() => panel.classList.add('open'), 120);
      }, { once: true });
    });
    return modeBtn;
  }

  const getGroupLabel = group => (group === 'acc' ? 'Accessory' : 'Weapon');

  function buildPrefsResetButton(group, isCustom) {
    const mode = isCustom ? 'custom' : 'chip';
    const groupLabel = getGroupLabel(group);
    const modeLabel  = isCustom ? 'Custom' : 'Chip';
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'ench-prefs-reset-btn';
    btn.title     = `Reset ${groupLabel} ${modeLabel} preferences`;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';
    btn.addEventListener('click', () => {
      if (!confirm(`Reset ${groupLabel} ${modeLabel} preferences? This cannot be undone.`)) return;
      resetEnchantPrefs(group, mode);
    });
    return btn;
  }

  function buildModeToggleRow(group, isCustom, onToggle) {
    const row = document.createElement('div');
    row.className = 'ench-mode-row';
    row.appendChild(buildModeToggleButton(isCustom, onToggle));
    row.appendChild(buildPrefsResetButton(group, isCustom));
    return row;
  }

  function buildCustomPairsPanel(groups, savedSlots, slotKey, onSave) {
    const pairsWrap = document.createElement('div');
    pairsWrap.className = 'ench-lines';
    for (const { label, range: [start, end] } of groups) {
      pairsWrap.appendChild(makeEnchantLabel(`${slotKey === 'acc' ? 'customEnchLblAcc' : 'customEnchLbl'}_${start}`, label));
      for (let i = start; i < end; i++) {
        const cs = savedSlots[i] || { enchant: '', level: '' };
        pairsWrap.appendChild(makeEnchantPairEl(cs.enchant, cs.level, slotKey));
      }
    }
    pairsWrap.addEventListener('change', () => onSave(readPairsFrom(pairsWrap)));

    const awkDesc = document.createElement('p');
    awkDesc.className   = 'co-block-desc';
    awkDesc.textContent = "If your awakening level hasn't changed, you can skip this.";
    pairsWrap.appendChild(awkDesc);
    pairsWrap.appendChild(makeEnchantLabel('customAwkLbl', 'Custom Awakening'));
    const awkPair = fromHTML(`<div class="select-wrap"><select class="stats-select" id="customAwkSelect">
      <option value="" selected>Skip</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select></div>`);
    const awkSelect = awkPair.firstElementChild;
    awkSelect.value = enchantState.customPrefAwk || '';
    awkSelect.addEventListener('change', () => {
      enchantState.customPrefAwk = awkSelect.value;
      saveEnchantState();
    });
    pairsWrap.appendChild(awkPair);

    return pairsWrap;
  }

  function buildTabSwitcher(slotCount, tabLabels, initialTab = 0) {
    const tabBar = document.createElement('div');
    tabBar.className = 'ench-tab-bar';
    const panelsWrap = document.createElement('div');
    panelsWrap.className = 'ench-tab-panels-wrap';
    let activeTab = initialTab >= slotCount ? 0 : initialTab;

    for (let i = 0; i < slotCount; i++) {
      const btn = fromHTML(`<button class="ench-tab-btn${i === activeTab ? ' active' : ''}" type="button" data-tab="${i}">${tabLabels[i]}</button>`);
      btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.tab);
        if (next === activeTab) return;
        panelsWrap.querySelectorAll('.ench-tab-panel').forEach(p => {
          const idx = parseInt(p.dataset.tab);
          p.classList.remove('ench-tab-panel--active', 'ench-tab-panel--hidden-left', 'ench-tab-panel--hidden-right');
          if (idx === activeTab) p.classList.add(next > activeTab ? 'ench-tab-panel--hidden-left' : 'ench-tab-panel--hidden-right');
          else if (idx === next)  p.classList.add('ench-tab-panel--active');
          else                    p.classList.add(idx < next ? 'ench-tab-panel--hidden-left' : 'ench-tab-panel--hidden-right');
        });
        tabBar.querySelectorAll('.ench-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = next;
      });
      tabBar.appendChild(btn);
    }
    return { tabBar, panelsWrap, activeTab };
  }

  const isChipDisabled = (atMax, isExcl, isChecked) => (atMax && !isChecked) || (isExcl && !isChecked);

  function buildChipPanel({ panelsWrap, slotCount, activeTab, eqType, curEnchantFor, chipsFor, extraAttrsFor }) {
    for (let i = 0; i < slotCount; i++) {
      const curEnchant = curEnchantFor(i);
      const checked    = new Set(chipsFor(i).slice(0, maxEnchPrefs).filter(v => v !== curEnchant));
      const atMax      = checked.size >= maxEnchPrefs;
      const panel = document.createElement('div');
      panel.className   = 'ench-tab-panel ' + (i === activeTab ? 'ench-tab-panel--active' : 'ench-tab-panel--hidden-right');
      panel.dataset.tab = i;
      getEnchantsByEq(eqType).forEach(opt => {
        if (opt.value === curEnchant) return;
        const isExcl    = Labels.isAtkExcluded(opt.type);
        const isChecked = checked.has(opt.value);
        const disable   = isChipDisabled(atMax, isExcl, isChecked);
        panel.appendChild(fromHTML(`<label class="ench-check-row${disable ? ' ench-check-disabled' : ''}"><input type="checkbox" value="${opt.value}"${isChecked ? ' checked' : ''}${disable ? ' disabled' : ''}${extraAttrsFor(i)}><span class="ench-check-label">${Labels.getEnchantOptLabel(opt)}</span></label>`));
      });
      panelsWrap.appendChild(panel);
    }
  }

  function bindChipChangeHandler({ target, scope, slotCount, onSave }) {
    target.addEventListener('change', e => {
      const cb = e.target;
      if (cb.type !== 'checkbox' || !scope.contains(cb)) return;
      const slotIdx = parseInt(cb.dataset.slot);
      const allCbs  = [...scope.querySelectorAll(`input[type="checkbox"][data-slot="${slotIdx}"]`)];
      if (allCbs.filter(c => c.checked).length > maxEnchPrefs) cb.checked = false;
      const atMax    = allCbs.filter(c => c.checked).length >= maxEnchPrefs;
      allCbs.forEach(c => {
        const isExcl  = Labels.isAtkExcluded(EOMAP.get(c.value)?.type);
        const disable = isChipDisabled(atMax, isExcl, c.checked);
        c.disabled = disable;
        c.closest('.ench-check-row').classList.toggle('ench-check-disabled', disable);
      });
      onSave(Array.from({ length: slotCount }, (_, s) =>
        [...scope.querySelectorAll(`input[type="checkbox"][data-slot="${s}"]`)]
          .filter(c => c.checked).map(c => c.value)
      ));
    });
  }

  function renderWeaponSettingsPanel() {
    const inner  = Dom.enchSettingsInner;
    if (!inner) return;
    const weapon = Dom.weapon.value;
    const { slotCount, groups } = getWeaponEnchantLayout(weapon);
    const prefs    = enchantState.weapon.prefs;
    const isCustom = prefs.mode === 'custom';

    inner.innerHTML = '';

    inner.appendChild(buildModeToggleRow('weapon', isCustom, () => toggleMode('weapon', renderWeaponSettingsPanel)));

    const desc = document.createElement('p');
    desc.className   = 'co-block-desc';
    desc.textContent = isCustom
      ? 'Try your own combination before creating new sets or transferring. Physical Suno/Meister can switch the weapon option to GS or One-Handed Staff (Weapon Perfection).'
      : 'Select up to 2 enchants per slot. Tool will find the best option based on your choices. Switch to custom mode for more flexibility.';
    inner.appendChild(desc);

    if (isCustom) {
      inner.appendChild(buildCustomPairsPanel(groups, prefs.custom || [], 'weapon', slots => {
        enchantState.weapon.prefs.custom = slots;
        saveEnchantState();
      }));
    } else {
      const prevActiveTab = inner.querySelector('.ench-tab-btn.active');
      const initialTab    = prevActiveTab ? parseInt(prevActiveTab.dataset.tab) : 0;

      const tabLabels = groups.flatMap(({ label, range: [start, end] }) => {
        const prefix = label.includes('Main') ? 'MH' : label.includes('Off') ? 'OH' : 'Slot';
        return Array.from({ length: end - start }, (_, i) => `${prefix} ${i + 1}`);
      });

      const { tabBar, panelsWrap, activeTab } = buildTabSwitcher(slotCount, tabLabels, initialTab);
      inner.appendChild(tabBar);
      inner.appendChild(panelsWrap);

      const allPairs = readPairsFrom(Dom.enchWeaponLines);
      buildChipPanel({
        panelsWrap, slotCount, activeTab, eqType: 'weapon',
        curEnchantFor:  i => allPairs[i]?.enchant || '',
        chipsFor:       i => prefs.chip[i] || [],
        extraAttrsFor:  i => ` data-slot="${i}"`,
      });

      bindChipChangeHandler({
        target: inner, scope: panelsWrap, slotCount,
        onSave: chips => { enchantState.weapon.prefs.chip = chips; saveEnchantState(); },
      });
    }
  }

  function buildAccTabGroup(group, groupIdx) {
    const { label, range: [start, end] } = group;
    const slotCount = end - start;

    const wrap = document.createElement('div');
    wrap.className = 'ench-acc-tab-group';
    wrap.appendChild(makeEnchantLabel(`accSettingsLbl_${start}`, label));

    const tabLabels = Array.from({ length: slotCount }, (_, i) => `Slot ${i + 1}`);
    const { tabBar, panelsWrap, activeTab } = buildTabSwitcher(slotCount, tabLabels);
    wrap.appendChild(tabBar);
    wrap.appendChild(panelsWrap);

    const groupChip   = enchantState.acc.prefs.chip[groupIdx] || [];
    const allAccPairs = readPairsFrom(Dom.enchAccLines);
    buildChipPanel({
      panelsWrap, slotCount, activeTab, eqType: 'acc',
      curEnchantFor:  i => allAccPairs[start + i]?.enchant || '',
      chipsFor:       i => groupChip[i] || [],
      extraAttrsFor:  i => ` data-group="${groupIdx}" data-slot="${i}"`,
    });

    bindChipChangeHandler({
      target: wrap, scope: panelsWrap, slotCount,
      onSave: chips => { enchantState.acc.prefs.chip[groupIdx] = chips; saveEnchantState(); },
    });

    return wrap;
  }

  function renderAccSettingsPanel() {
    const inner    = Dom.enchSettingsInner;
    if (!inner) return;
    const prefs    = enchantState.acc.prefs;
    const isCustom = prefs.mode === 'custom';
    inner.innerHTML = '';

    inner.appendChild(buildModeToggleRow('acc', isCustom, () => toggleMode('acc', renderAccSettingsPanel)));

    const desc = document.createElement('p');
    desc.className   = 'co-block-desc';
    desc.textContent = isCustom
      ? 'Try your own combination before creating new sets or transferring.'
      : 'Select up to 2 enchants per slot. Tool will find the best option based on your choices.';
    inner.appendChild(desc);

    if (isCustom) {
      inner.appendChild(buildCustomPairsPanel(ACC_GROUPS, prefs.custom || [], 'acc', slots => {
        enchantState.acc.prefs.custom = slots;
        saveEnchantState();
      }));
    } else {
      ACC_GROUPS.forEach((group, groupIdx) => inner.appendChild(buildAccTabGroup(group, groupIdx)));
    }
  }

  function buildEnchantSectionHTML(assign, slotState, compareAssign = null) {
    const weapon            = Dom.weapon.value;
    const { groups }        = getWeaponEnchantLayout(weapon);
    let hasChanged           = false;

    const getEnchantRowLabel = entry => {
      const opt = entry ? EOMAP.get(entry.key) : null;
      return opt ? Labels.getEnchantOptLabel(opt) : (entry?.key ?? '-');
    };

    const buildEnchantRow = (entry, globalIdx, slot, localIdx) => {
      const isChanged    = compareAssign != null && (entry?.key ?? null) !== (compareAssign[globalIdx]?.key ?? null);
      if (isChanged) hasChanged = true;
      const num          = localIdx + 1;
      if (!slot.level) return `<div class="co-ench-row"><span class="co-ench-num">${num}</span><span class="co-ench-val">-</span><span class="co-ench-lvl"></span></div>`;
      const label        = getEnchantRowLabel(entry);
      const changedClass = isChanged ? ' co-ench-changed' : '';
      const rawVal       = entry ? getEnchantVal(entry.key, slot.level, slot.col, 1) : null;
      const valStr       = rawVal != null ? (entry.type === 'rawPen' ? Utils.fmtNum(rawVal) : `${Utils.fmtPct(rawVal)}%`) : '';
      return `<div class="co-ench-row${changedClass}"><span class="co-ench-num">${num}</span><span class="co-ench-val">Lv.${slot.level}${label}</span><span class="co-ench-lvl">${valStr ? `+${valStr}` : ''}</span></div>`;
    };

    const buildGroupRows = (groupDefs, groupSlots, groupAssign, indexOffset, anyLevel) => {
      if (!anyLevel) return '';
      return groupDefs.map(({ label, range: [start, end] }) => {
        const rows = groupSlots.slice(start, end)
          .map((slot, j) => buildEnchantRow(groupAssign[start + j], indexOffset + start + j, slot, j))
          .join('');
        return `<div class="co-ench-group-hdr">${label}</div>${rows}`;
      }).join('');
    };

    const weaponSlotState = slotState.filter(s => s.group !== 'acc');
    const accSlotState    = slotState.filter(s => s.group === 'acc');
    const weaponAssign    = assign.slice(0, weaponSlotState.length);
    const accAssign       = assign.slice(weaponSlotState.length);

    const weaponHasLevel = weaponSlotState.some(s => s.level);
    const accHasLevel    = accSlotState.some(s => s.level);

    const weaponHTML = buildGroupRows(groups, weaponSlotState, weaponAssign, 0, weaponHasLevel);
    const accHTML    = accSlotState.length ? buildGroupRows(ACC_GROUPS, accSlotState, accAssign, weaponSlotState.length, accHasLevel) : '';

    const bodyHTML = (weaponHTML || accHTML) ? (weaponHTML + accHTML) : null;
    const title = !isOptimizeEnabled()
      ? 'Enchantment (Toggle off, optimizer ignore this)'
      : (compareAssign != null && !hasChanged ? 'Enchantment (No Change)' : 'Enchantment');
    return Utils.buildResSectionHTML(title, bodyHTML && `<div class="co-ench-result-list">${bodyHTML}</div>`, Utils.EMPTY_STATE_HTML);
  }

  const initEnchantSlider = () => {
    bindCoPanelToggle(Dom.enchantSection.querySelector('.co-hd'));
    initSlider(Dom.enchantSection, [...Dom.enchantSection.querySelectorAll('.co-slide')], Dom.enchSlideLabel, ['Weapon', 'Accessories'], idx => {
      setActiveSlide(idx);
      if (Dom.enchSettingsPanel.classList.contains('open')) renderActiveSettingsPanel();
    }, '#enchSlidePrev', '#enchSlideNext');
  };

  return {
    enchantState,
    refresh,
    rebuildWeaponEnchantPairs, rebuildAccEnchantPairs, readEnchantStateFromDOM, loadEnchantState,
    getEnchantSlotState, getEnchantCandidates, getEnchantCurrentAssign,
    applyEnchant, stripEnchant, writeAssignment,
    runOptimizer, hasActiveEnchantCandidates,
    renderActiveSettingsPanel, buildEnchantSectionHTML,
    setActiveSlide, getActiveSlide, resetEnchantPrefs, resetEnchantSlots,
    initEnchantSlider, getGroupLabel,
    isPenEntry,
    isOptimizeEnabled, setOptimizeEnabled,
  };
})();

const Stats = (() => {
  const { labelWithVal, fmtPct, fmtNum } = Utils;
  const { getElemEnhLabel } = Labels;
  const { stats: { numFields, snapFields } } = Config;

  const showMsg     = (html, type) => { Dom.msg.innerHTML = html; Dom.msg.className = `stats-msg ${type} show`; };
  const setFormOpen = open => { Dom.form.classList.toggle('open', open); Dom.manualBtn.classList.toggle('active', open); };
  const syncElemEnhanceLabel = () => { Dom.elemEnhanceLabel.textContent = getElemEnhLabel(); };

  function saveStatsState() {
    Store.write(Config.app.storeKeys.stats, {
      targetDef: Dom.tDef.value,
      weapon:    Dom.weapon.value,
      wElem:     Dom.wElem.value,
      atkType:   Dom.atkType.value,
      ...Object.fromEntries(numFields.map(f => [f, Dom[f].value])),
      rawPen: Dom.rawPen.value,
    });
  }

  const saveStatsStateDebounced = Utils.debounce(saveStatsState);

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
    if (sizeKey === Divinity.getActiveSize()) return;
    Divinity.setActiveSize(sizeKey || '');
    Config.nodeOrder.forEach(Divinity.updateDivCircle);
    if (Dom.coSection.querySelector('.co-card-select')) Cards.switchSize(Dom.coSection);
  }

  function loadStatsState() {
    Store.restore(() => {
      const stats = Store.section(Config.app.storeKeys.stats);
      if (!Object.keys(stats).length) return;
      if (stats.targetDef) { Dom.tDef.value = stats.targetDef; updateTargetLabels(stats.targetDef); updateActiveSize(); }
      if (stats.weapon)    { Dom.weapon.value = stats.weapon; if (Dom.coSection?.querySelector('.co-card-select')) Cards.rebuildWeaponSlots(Dom.coSection); }
      if (stats.wElem)     { Dom.wElem.value = stats.wElem; syncElemEnhanceLabel(); }
      const atkType = stats.atkType ?? 'pen';
      Dom.atkType.value    = atkType;
      Dom.penField.hidden  = atkType !== 'pen';
      Dom.critField.hidden = atkType === 'pen';
      for (const f of numFields) { if (stats[f]) Dom[f].value = stats[f]; }
      if (stats.rawPen) Dom.rawPen.value = stats.rawPen;
    }, 'Stats.loadStatsState: failed to restore stats form state');
  }

  function loadStatsFromSnap(snap) {
    const f = snap.form;
    Dom.tDef.value    = f.targetDefSelect?.value     ?? '';
    Dom.weapon.value  = f.weaponSelect?.value        ?? '';
    Dom.wElem.value   = f.weaponElementSelect?.value ?? '';
    Dom.atkType.value = f.penCritSelect?.value       ?? 'pen';
    Dom.atkType.dispatchEvent(new Event('change'));
    for (const [el, key] of Object.entries(snapFields)) Dom[el].value = f[key] ?? '';
    syncElemEnhanceLabel();
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
      Object.entries(Config.divinity.specialNodes).map(([id, spec]) => {
        const usedIdx = Divinity.getUsed(id);
        const panel   = usedIdx != null ? Divinity.getData(id).items[usedIdx] : null;
        return [spec.field, panel ? spec.calcValue(partialCtx, panel) : 0];
      })
    );
    const atkType = Dom.atkType.value;
    return {
      ...Object.fromEntries(numFields.map(k => [k, parseFloat(Dom[k].value) || 0])),
      ...(atkType === 'pen' && { pen: parseFloat(Dom.pen.value) || 0, rawPen: parseFloat(Dom.rawPen.value) || 0 }),
      atkType,
      weapon:  Dom.weapon.value || '',
      wElem:   wElemVal,
      tDefKey,
      tSize:   target.sizeMob  ?? '',
      tRace:   target.raceMob  ?? '',
      tAttr:   tAttrVal,
      ...specialVals,
    };
  }

  function writeStatsToForm(finalState) {
    const fmt = v => fmtPct(v).replace(/\.?0+$/, '');
    if (Dom.atkType.value === 'pen') {
      Dom.pen.value    = fmt(finalState.pen || 0);
      Dom.rawPen.value = Math.round(finalState.rawPen || 0);
    } else {
      Dom.crit.value = fmt(finalState.crit || 0);
    }
    for (const f of numFields) {
      if (f === 'pen' || f === 'crit') continue;
      Dom[f].value = fmt(finalState[f] || 0);
    }
    saveStatsState();
    setFormOpen(true);
  }

  return {
    showMsg, setFormOpen, saveStatsState, saveStatsStateDebounced, initSelect,
    updateTargetLabels, updateActiveSize, syncElemEnhanceLabel,
    loadStatsState, loadStatsFromSnap, buildStatsState, writeStatsToForm,
  };
})();

const Domains = (() => {
  const registry = [];

  const register = descriptor => { registry.push(descriptor); };
  const getAux   = () => registry.filter(d => d.isAux);

  return { register, getAux };
})();

Domains.register({
  key:      'companion',
  isAux:    true,
  isActive: () => Companion.isOptimizeEnabled() && Companion.getItems().length > 0,
  optimize: state => Companion.runOptimizer(state)?.assignment ?? null,
  apply:    (state, assign) => (assign ? Companion.applyCompanion(state, assign) : state),
  strip:    (state, assign) => (assign ? Companion.stripCompanion(state, assign) : state),
});

Domains.register({
  key:      'enchant',
  isAux:    true,
  isActive: () => Enchant.isOptimizeEnabled() && Enchant.hasActiveEnchantCandidates(),
  optimize: (state, current) => Enchant.runOptimizer(state, current),
  apply:    (state, assign) => Enchant.applyEnchant(state, assign),
  strip:    (state, assign) => Enchant.stripEnchant(state, assign),
});

const Optimizer = (() => {
  const { buildLoadingHTML, escHtml, setInteractionLocked } = Utils;
  const { isPenEntry } = Enchant;
  const { SLOT_COUNTS } = Cards;
  const { nodeOrder, divinity: { specialNodes }, optimizer, ui: { loaderTiming } } = Config;
  const specialNodeZeroFields = Object.fromEntries(Object.values(specialNodes).map(s => [s.field, 0]));

  const calcMult = state => Formula.calculateMultiplier(state).mult;

  const countDivCombos = () =>
    nodeOrder.filter(id => Divinity.hasNode(id) && Divinity.isNodeActive(id)).reduce((acc, id) => {
      const d = Divinity.getData(id), usedIdx = Divinity.getUsed(id);
      return acc + (usedIdx != null && d.items[usedIdx]?.locked ? 1 : d.count);
    }, 0);

  const countCompanionCombos = companionItemCount => companionItemCount;

  const countEnchantCombos = enchantCandidates => {
    let independentSum  = 0;
    let coupledProduct  = 1;
    for (const c of enchantCandidates) {
      const size = c.length + 1;
      if (c.some(isPenEntry)) coupledProduct *= size;
      else independentSum += size;
    }
    return independentSum + coupledProduct;
  };

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
    let totalCombos      = 0;
    for (const equip of equipTypes) {
      const pool = (cardPool[equip] || []).filter(c => c.qty > 0);
      combosPerEquip[equip] = genEquipCombinations(pool, slotCounts[equip] || 0);
      totalCombos += combosPerEquip[equip].length;
    }
    return { equipTypes, combosPerEquip, totalCombos };
  }

  function runCardsExact(baseState, combosPerEquip, equipTypes, ctx, currentMult) {
    const bestCards = [];
    let running = baseState;
    for (const equip of equipTypes) {
      const { best: bestCombo } = Utils.argmaxBy(
        combosPerEquip[equip],
        combo => calcMult(Cards.applyCards(running, combo, ctx))
      );
      if (bestCombo?.length) bestCards.push(...bestCombo);
      running = Cards.applyCards(running, bestCombo ?? [], ctx);
    }
    const finalMult = calcMult(running);
    return finalMult > currentMult ? { cards: bestCards, mult: finalMult } : null;
  }

  function runCardsOptimizer(baseState, cardPool, slotCounts, ctx, currentMult, prebuilt) {
    const { equipTypes, combosPerEquip } = prebuilt ?? genCardCombos(cardPool, slotCounts);
    return runCardsExact(baseState, combosPerEquip, equipTypes, ctx, currentMult);
  }

  function runDivinityOptimizer(cardState, ctx, activeNodes) {
    if (!activeNodes.length) return null;
    const pools = activeNodes.map(id => {
      const d       = Divinity.getData(id);
      const usedIdx = Divinity.getUsed(id);
      if (usedIdx != null && d.items[usedIdx]?.locked)
        return { id, entries: [{ panel: d.items[usedIdx], idx: usedIdx }] };
      return { id, entries: d.items.slice(0, d.count).map((panel, i) => ({ panel, idx: i })) };
    });
    const base = { ...cardState, ...specialNodeZeroFields };

    let running          = { ...base };
    const bestSelection  = [];
    for (const { id, entries } of pools) {
      const { best: localBestEntry } = Utils.argmaxBy(
        entries,
        ({ panel }) => calcMult(Divinity.applyDivinityPanel(running, panel, id, ctx)),
        entries[0]
      );
      bestSelection.push({ id, panelIndex: localBestEntry.idx });
      running = Divinity.applyDivinityPanel(running, localBestEntry.panel, id, ctx);
    }

    return { bestSelection, bestMult: calcMult(running) };
  }

  function runCoordinateDescent(pureBase, lockedBaseState, cardPool, slotCounts, allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx, prebuilt, currentEnchantAssign) {
    const buildCardsAndDivinityState = (cards, divSelection) =>
      Divinity.applyDivinity(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), divSelection, ctx);

    const AUX_DIMS = Domains.getAux();

    const buildAuxState = (cardsAndDivState, auxAssign, uptoKey) => {
      let state = cardsAndDivState;
      for (const aux of AUX_DIMS) {
        if (aux.key === uptoKey) break;
        state = aux.apply(state, auxAssign[aux.key]);
      }
      return state;
    };

    const auxStateAfterAll = (cardsAndDivState, auxAssign) => buildAuxState(cardsAndDivState, auxAssign, null);

    const calcMultWithAll = (cardsAndDivState, auxAssign) =>
      calcMult(auxStateAfterAll(cardsAndDivState, auxAssign));

    const DIMS = ['card', 'divinity', ...AUX_DIMS.map(aux => aux.key)];

    const runOnce = (startCards, startDivSelection, startAuxAssign, anchorOrder) => {
      let cards        = startCards;
      let divSelection = startDivSelection;
      const auxAssign  = { ...startAuxAssign };
      let mult         = calcMultWithAll(buildCardsAndDivinityState(cards, divSelection), auxAssign);
      const deltas     = Object.fromEntries(DIMS.map(dim => [dim, 0]));

      for (let iter = 0; iter < 4; iter++) {
        const prevMult = mult;
        const order    = iter === 0 ? anchorOrder : [...DIMS].sort((a, b) => deltas[b] - deltas[a]);
        for (const dim of order) {
          const before = mult;
          if (dim === 'card' && Cards.isOptimizeEnabled()) {
            const cardResult = runCardsOptimizer(
              Divinity.applyDivinity(lockedBaseState, divSelection, ctx), cardPool, slotCounts, ctx,
              mult,
              prebuilt
            );
            if (cardResult) {
              const newCards = [...allLockedNames, ...cardResult.cards];
              const newMult  = calcMultWithAll(buildCardsAndDivinityState(newCards, divSelection), auxAssign);
              if (newMult > mult) { cards = newCards; mult = newMult; }
            }
          } else if (dim === 'divinity' && activeNodes.length) {
            const divResult = runDivinityOptimizer(Cards.applyCards(pureBase, Cards.filterValid(cards), ctx), ctx, activeNodes);
            if (divResult) {
              const newMult = calcMultWithAll(buildCardsAndDivinityState(cards, divResult.bestSelection), auxAssign);
              if (newMult > mult) { divSelection = divResult.bestSelection; mult = newMult; }
            }
          } else {
            const aux = AUX_DIMS.find(a => a.key === dim);
            if (aux && aux.isActive()) {
              const cardsAndDivState = buildCardsAndDivinityState(cards, divSelection);
              const auxBaseState     = buildAuxState(cardsAndDivState, auxAssign, aux.key);
              const newSelection     = aux.optimize(auxBaseState, auxAssign[aux.key]);
              if (newSelection) {
                const newAuxAssign = { ...auxAssign, [aux.key]: newSelection };
                const newMult      = calcMultWithAll(cardsAndDivState, newAuxAssign);
                if (newMult > mult) { auxAssign[aux.key] = newSelection; mult = newMult; }
              }
            }
          }
          deltas[dim] = mult - before;
        }
        if (mult - prevMult < optimizer.convergenceEpsilon) break;
      }
      return { bestCards: cards, bestDivSelection: divSelection, bestMult: mult, bestAuxAssign: auxAssign };
    };

    const coldStartCards = Cards.isOptimizeEnabled() ? (() => {
      const result = runCardsOptimizer(Divinity.applyDivinity(lockedBaseState, currentDivSelection, ctx), cardPool, slotCounts, ctx, -Infinity, prebuilt);
      return result ? [...allLockedNames, ...result.cards] : [...allLockedNames, ...nonLockedEquipped];
    })() : [...allLockedNames, ...nonLockedEquipped];
    const warmCards   = [...allLockedNames, ...nonLockedEquipped];
    const baseDivSel  = () => currentDivSelection.map(s => ({ ...s }));
    const baseAuxAssign = () => ({ companion: null, enchant: currentEnchantAssign ? [...currentEnchantAssign] : [] });

    const starts = [
      { cards: warmCards,      divSelection: baseDivSel(), auxAssign: baseAuxAssign(), anchorOrder: ['card',      'divinity',  'companion', 'enchant'  ] },
      { cards: coldStartCards, divSelection: baseDivSel(), auxAssign: baseAuxAssign(), anchorOrder: ['divinity',  'card',      'enchant',   'companion'] },
      { cards: coldStartCards, divSelection: baseDivSel(), auxAssign: baseAuxAssign(), anchorOrder: ['companion', 'enchant',   'card',      'divinity' ] },
      { cards: coldStartCards, divSelection: baseDivSel(), auxAssign: baseAuxAssign(), anchorOrder: ['enchant',   'companion', 'divinity',  'card'     ] },
    ];

    let best = { bestCards: warmCards, bestDivSelection: baseDivSel(), bestMult: currentMult, bestAuxAssign: baseAuxAssign() };
    for (const { cards, divSelection, auxAssign, anchorOrder } of starts) {
      const result = runOnce(cards, divSelection, auxAssign, anchorOrder);
      if (result.bestMult > best.bestMult) best = result;
    }
    return {
      bestCards:        best.bestCards,
      bestDivSelection: best.bestDivSelection,
      bestMult:         best.bestMult,
      bestAuxAssign:    best.bestAuxAssign,
    };
  }

  function buildCardComputation(section) {
    const slotCounts      = { ...SLOT_COUNTS, weapon: Cards.getWeaponSlotCount() };
    const lockedCards     = {};
    const lockedSlotKeys  = new Set();
    const allCardSelects  = [...section.querySelectorAll('.co-card-select')];
    const cardSelectByKey = {};
    for (const inp of allCardSelects) cardSelectByKey[Cards.getSlotKey(inp)] = inp;

    for (const btn of section.querySelectorAll('.co-lock-btn')) {
      if (btn.dataset.locked !== 'true') continue;
      const key = Cards.getSlotKey(btn);
      lockedSlotKeys.add(key);
      const cardName = cardSelectByKey[key]?.dataset.value || '';
      if (cardName) (lockedCards[btn.dataset.equip] ??= []).push(cardName);
    }
    const allLockedNames = Object.values(lockedCards).flat();
    for (const [equip, cards] of Object.entries(lockedCards))
      slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards.length);

    const { equippedNames, cardPool } = Cards.buildPoolFromSection(section, allLockedNames, allCardSelects);

    const buffMap = {};
    for (const row of section.querySelectorAll('.co-buff-row')) {
      const field = row.querySelector('.co-buff-stat').value;
      const val   = parseFloat(row.querySelector('.co-buff-val').value) || 0;
      if (field && val !== 0) buffMap[field] = (buffMap[field] || 0) + val;
    }

    const nonLockedEquipped = allCardSelects
      .filter(input => !lockedSlotKeys.has(Cards.getSlotKey(input)) && input.dataset.value)
      .map(input => input.dataset.value);

    const prebuiltCombos = genCardCombos(cardPool, slotCounts);

    return { slotCounts, lockedCards, allLockedNames, equippedNames, cardPool, buffMap, nonLockedEquipped, prebuiltCombos };
  }

  function runAndRender(section, calcState, ctx, precomputed) {
    const resultEl = Dom.resultCard;
    const {
      slotCounts, lockedCards, allLockedNames, equippedNames,
      cardPool, buffMap, nonLockedEquipped, prebuiltCombos,
    } = precomputed ?? buildCardComputation(section);

    try {
      const baseState = Cards.stripCards(calcState, Cards.filterValid(equippedNames), ctx);
      for (const [field, val] of Object.entries(buffMap)) if (field in baseState) baseState[field] += val;

      const enchantSlotState     = Enchant.getEnchantSlotState();
      const currentEnchantAssign = Enchant.getEnchantCurrentAssign(enchantSlotState);
      const currentDivSelection  = nodeOrder.filter(id => Divinity.hasNode(id) && Divinity.getUsed(id) != null).map(id => ({ id, panelIndex: Divinity.getUsed(id) }));
      const currentCompanionUsed = Companion.getUsed();

      const currentAuxAssign = { companion: currentCompanionUsed, enchant: currentEnchantAssign };
      const pureBase = Domains.getAux().reduce(
        (state, aux) => aux.strip(state, currentAuxAssign[aux.key]),
        Divinity.stripCurrentDivinity(baseState, ctx)
      );
      const lockedBaseState          = Cards.applyCards(pureBase, allLockedNames, ctx);
      const currentBaseWithCards     = Cards.applyCards(lockedBaseState, nonLockedEquipped, ctx);
      const currentBaseWithDivinity  = Divinity.applyDivinity(currentBaseWithCards, currentDivSelection, ctx);
      const currentBaseWithCompanion = Companion.applyCompanion(currentBaseWithDivinity, currentCompanionUsed ?? {});
      const currentMult              = calcMult(Enchant.applyEnchant(currentBaseWithCompanion, currentEnchantAssign));
      const activeNodes              = Divinity.isOptimizeEnabled()
        ? nodeOrder.filter(id => Divinity.hasNode(id) && Divinity.isNodeActive(id))
        : [];

      const { bestCards, bestDivSelection, bestMult, bestAuxAssign } = runCoordinateDescent(
        pureBase, lockedBaseState, cardPool, slotCounts,
        allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx,
        prebuiltCombos, currentEnchantAssign
      );
      const bestCompanionAssign = bestAuxAssign.companion;
      const bestEnchantAssign   = bestAuxAssign.enchant;

      const bestStateWithCards    = Cards.applyCards(pureBase, Cards.filterValid(bestCards), ctx);
      const bestStateWithDivinity = Divinity.applyDivinity(bestStateWithCards, bestDivSelection, ctx);
      const resolvedCompanionAssign = bestCompanionAssign ?? (Companion.isOptimizeEnabled() ? Companion.runOptimizer(bestStateWithDivinity)?.assignment ?? null : null);
      const divinityResult        = activeNodes.length ? { bestSelection: bestDivSelection, bestMult } : null;

      resultEl.innerHTML = buildLoadingHTML('qqq');
      setTimeout(() => {
        Results.render(resultEl, {
          bestResult: { cards: bestCards, mult: bestMult },
          pureBase, lockedCards, equippedNames, ctx, divinityResult,
          currentDivSelection, buffMap, bestCompanionAssign: resolvedCompanionAssign,
          bestEnchantAssign, currentEnchantAssign, enchantSlotState,
        });
        resultEl.classList.remove('co-result-enter');
        void resultEl.offsetWidth;
        resultEl.classList.add('co-result-enter');
        setInteractionLocked(false, Dom.calculateBtn);
      }, loaderTiming.qqq);
    } catch (err) {
      resultEl.innerHTML = `<div class="co-error">Error: ${escHtml(err.message)}</div>`;
      setInteractionLocked(false, Dom.calculateBtn);
    }
  }

  return { calcMult, countDivCombos, countCompanionCombos, countEnchantCombos, genCardCombos, buildCardComputation, runAndRender };
})();

const Results = (() => {
  const { fmtNum, statsConverter, countBy, buildResSectionHTML, EMPTY_STATE_HTML, initSlider } = Utils;
  const { getBaseStatLabels, getBuffStatOptions, getAtkFieldOption } = Labels;
  const { ui: { icons } } = Config;

  const NOTE_HTML = `<div class="co-res-note">
  Crosscheck the result on the <u>next slide</u> with the input at the top of the page, and make sure it matches your current detailed stats (in-game).<br/><br/>

  This tool only supports some offensive stats, so if your build has a lot of ATK% / Flat & Stat% bonuses (esp. in divinity) and the tool still suggests switching, <u>in-game results may vary</u><span class="spoiler">, could go higher or lower <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="10" height="10"></span><br/><br/>

  But since this tool calculates base multipliers, it'll be more accurate as long as your other stats (ATK, Flat STAT/%, Haste, Max HP) don't drop too much after the switch, especially for jobs that rely on those.<br/><br/>

  <sup>[Tool vs In-game#<a href='#' class='job-sim' data-lightbox-gallery='my-gallery' data-lightbox-trigger>1</a>],[<a href='#' class='job-sim' data-lightbox-gallery='new-version' data-lightbox-trigger>2</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer' data-lightbox-trigger>3</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer_2' data-lightbox-trigger>4</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer_3' data-lightbox-trigger>5</a>]</sup> TG can differ vs field; they might be lower depending on the affix, or higher since certain debuffs from other players are shared across all attackers.
</div>`;

  const MORE_TOOLS = [
    { href: 'https://masihterjaga.github.io/sim',                                                     name: 'Old Version' },
    { href: 'https://masihterjaga.github.io/sim/weapon-awakening.html',                                name: 'Weapon Awakening' },
    { href: 'https://masihterjaga.github.io/sim/physical-suno-mammonite-se.html',                      name: 'Mammonite I / II?' },
    { href: 'https://discord.com/channels/784407151342256148/909016309218541568/1498338086449319957', name: 'Specific-Job Simulator' },
    { href: 'https://masihterjaga.github.io/sim/advanced-transfer.html',                               name: 'Adv. Transfer' },
  ];
  const buildMoreToolsHTML = () => `<div class="co-more-tools">
        <span class="co-more-tools-label">More Tools</span>
        <div class="co-more-tools-row">
          ${MORE_TOOLS.map(({ href, name }) => `<a class="co-tool-card" href="${href}" target="_blank" rel="noopener">
            <span class="co-tool-card-name">${name}</span>
          </a>`).join('\n          ')}
        </div>
      </div>`;

  const buildSectionPair = (label, bestInner, currentInner, nodesClass, bestSuffix = ' (tap for details)') => ({
    best:    buildResSectionHTML(`${label}${bestSuffix}`, bestInner    && `<div class="${nodesClass}">${bestInner}</div>`,    EMPTY_STATE_HTML),
    current: buildResSectionHTML(label,                   currentInner && `<div class="${nodesClass}">${currentInner}</div>`, EMPTY_STATE_HTML),
  });

  const buildHeroHTML = (leftVal, leftLbl, right) => `<div class="co-res-hero">
        <div class="co-res-hero-block"><div class="co-res-hero-val">${leftVal}</div><div class="co-res-hero-lbl">${leftLbl}</div></div>
        <div class="co-res-hero-block${right.cls ? ` ${right.cls}` : ''}"><div class="co-res-hero-val">${right.val}</div><div class="co-res-hero-lbl">${right.lbl}</div></div>
      </div>`;

  const buildStatsTitleHTML = showUseSyncBtn =>
    showUseSyncBtn
      ? `<div class="co-res-section-title-row"><div class="co-res-section-title">Final Stats</div><button class="co-use-sync-btn" id="coUseSyncBtn">${icons.sync}Use &amp; Sync</button></div>`
      : `<div class="co-res-section-title">Final Stats</div>`;

  const diffArrow = diff => (diff > 0 ? icons.arrowUp : diff < 0 ? icons.arrowDown : '');

  const buildStatsRowHTML = ({ field, label, isSpear }, state, compareState) => {
    const val   = state[field] ?? 0;
    const diff  = compareState != null ? val - (compareState[field] ?? 0) : 0;
    const arrow = diffArrow(diff);
    const rawPen      = field === 'pen' ? (state.rawPen || 0) : 0;
    const rawPenDiff  = compareState != null ? rawPen - (compareState.rawPen || 0) : 0;
    const rawPenArrow = diffArrow(rawPenDiff);
    const totalVal    = val + statsConverter(rawPen);
    const totalCompare = compareState != null ? (compareState.pen || 0) + statsConverter(compareState.rawPen || 0) : null;
    const totalDiff   = totalCompare != null ? totalVal - totalCompare : 0;
    const totalArrow  = diffArrow(totalDiff);
    const rawPenRows  = rawPen
      ? `<div class="co-final-stat-row co-final-stat-row--rawpen">
        <span class="co-final-stat-lbl">Raw PEN</span>
        <span class="co-final-stat-val">${Math.round(rawPen)}${rawPenArrow}</span>
      </div>
      <div class="co-final-stat-row co-final-stat-row--rawpen-total">
        <span class="co-final-stat-lbl">Final + Raw PEN</span>
        <span class="co-final-stat-val">${fmtNum(totalVal)}%${totalArrow}</span>
      </div>`
      : '';
    return `<div class="co-final-stat-row${isSpear ? ' co-final-stat-row--spear' : ''}">
      <span class="co-final-stat-lbl">${isSpear ? `${icons.flash}<span class="co-stat-lbl-text">${label}</span>` : label}</span>
      <span class="co-final-stat-val">${fmtNum(val)}%${arrow}</span>
    </div>${rawPenRows}`;
  };

  const buildBuffFooterHTML = buffMap => {
    const buffEntries = Object.entries(buffMap).filter(([, v]) => v !== 0);
    if (!buffEntries.length) return '';
    const buffOpts = getBuffStatOptions();
    const rows = buffEntries.map(([field, val]) => {
      const opt = buffOpts.find(o => o.field === field);
      return `<div class="co-final-stat-row co-buff-footer-row">
        <span class="co-final-stat-lbl">${opt ? opt.label : field}</span>
        <span class="co-final-stat-val co-buff-footer-val">${fmtNum(val)}%</span>
      </div>`;
    }).join('');
    return `<div class="co-res-divider co-buff-footer-divider"></div>
    <div class="co-buff-footer-note">Stats above already include the extra buffs you added</div>
    <div class="co-final-stats-grid">${rows}</div>`;
  };

  function buildStatsGridHTML(state, compareState, atkType, showUseSyncBtn = false, buffMap = {}) {
    const labels = [
      getAtkFieldOption(atkType),
      ...getBaseStatLabels().map(item =>
        item.field === 'dmgStack' && (state.reaperValue || 0) > 0 ? { ...item, isSpear: true } : item
      ),
      ...((state.spearValue || 0) > 0 ? [{ field: 'spearValue', label: 'DMG to MVP/MINI, BOSS, and Normal Monsters', isSpear: true }] : []),
    ];
    const gridHTML = `<div class="co-final-stats-grid">${labels.map(item => buildStatsRowHTML(item, state, compareState)).join('')}</div>`;
    return `<div class="co-res-section">${buildStatsTitleHTML(showUseSyncBtn)}${gridHTML}${buildBuffFooterHTML(buffMap)}</div>`;
  }

  function render(container, {
    bestResult, pureBase, lockedCards = {}, equippedNames = [], ctx = {},
    divinityResult = null, currentDivSelection = [], buffMap = {},
    bestCompanionAssign = null, bestEnchantAssign = null,
    currentEnchantAssign = [], enchantSlotState = [],
  }) {
    if (!bestResult) {
      container.innerHTML = '<div class="co-empty-state">No valid combinations found. Add cards to the pool.</div>';
      return;
    }
    const best = bestResult;
    const lockedCountByEquip = {};
    for (const [equip, names] of Object.entries(lockedCards)) {
      lockedCountByEquip[equip] = {};
      for (const name of names) lockedCountByEquip[equip][name] = (lockedCountByEquip[equip][name] || 0) + 1;
    }
    const byEquip          = Cards.getCardsEquipMap(best.cards);
    const beforeByEquip    = Cards.getCardsEquipMap(equippedNames);
    const bestDivSelection = divinityResult?.bestSelection ?? currentDivSelection;

    const currentCompanionUsedForState = Companion.getUsed();
    const resolvedBestEnchantAssign    = bestEnchantAssign ?? currentEnchantAssign;

    const finalAuxAssign  = { companion: bestCompanionAssign, enchant: resolvedBestEnchantAssign };
    const beforeAuxAssign = { companion: currentCompanionUsedForState, enchant: currentEnchantAssign };
    const computeBuildState = (cardsList, divSelection, auxAssign) => {
      const withCards = Cards.applyCards(pureBase, cardsList, ctx);
      const stateBase = Divinity.applyDivinity(withCards, divSelection, ctx);
      return Domains.getAux().reduce((s, aux) => aux.apply(s, auxAssign[aux.key]), stateBase);
    };

    const finalState  = computeBuildState(best.cards, bestDivSelection, finalAuxAssign);
    const beforeState = computeBuildState(Cards.filterValid(equippedNames), currentDivSelection, beforeAuxAssign);

    const combinedBestMult = Optimizer.calcMult(finalState);
    const currentMultFinal = Optimizer.calcMult(beforeState);
    const pctRaw = currentMultFinal > 0 ? ((combinedBestMult - currentMultFinal) / currentMultFinal * 100) : 0;
    const pct    = pctRaw.toFixed(2);
    const isGain = combinedBestMult >= currentMultFinal;
    const resolveDisplayState = s => ({
      ...s,
      dmgStack: s.dmgStack + (s.reaperValue || 0),
    });
    const displayFinal  = resolveDisplayState(finalState);
    const displayBefore = resolveDisplayState(beforeState);

    container.classList.toggle('spear-active', (finalState.spearValue || 0) > 0);

    const currentDivByNode = Object.fromEntries(currentDivSelection.map(s => [s.id, s.panelIndex]));
    const divBestHTML      = Divinity.buildDivNodesHTML(divinityResult?.bestSelection ?? [], currentDivByNode);
    const divCurrentHTML   = Divinity.buildDivNodesHTML(currentDivSelection, currentDivByNode);
    const { best: bestDivNodesHTML, current: currentDivNodesHTML } = Divinity.isOptimizeEnabled()
      ? buildSectionPair('Divinity', divBestHTML, divCurrentHTML, 'co-div-nodes')
      : buildSectionPair('Divinity (Toggle off, optimizer ignore this)', divBestHTML, divCurrentHTML, 'co-div-nodes', '');

    const bestCompanionAssignment = bestCompanionAssign ?? currentCompanionUsedForState;
    const companionItems          = Companion.getItems();
    const hasCompanionItems       = companionItems.length > 0;
    const compBestNodes           = hasCompanionItems ? Companion.buildCompanionNodesHTML(bestCompanionAssignment, currentCompanionUsedForState) : '';
    const compCurrentNodes        = hasCompanionItems ? Companion.buildCompanionNodesHTML(currentCompanionUsedForState, currentCompanionUsedForState) : '';
    const { best: companionNodesHTML, current: currentCompanionHTML } = Companion.isOptimizeEnabled()
      ? buildSectionPair('Companion', compBestNodes, compCurrentNodes, 'co-companion-nodes')
      : buildSectionPair('Companion (Toggle off, optimizer ignore this)', compBestNodes, compCurrentNodes, 'co-companion-nodes', '');

    const resolvedEnchantSlotState = enchantSlotState.map(slot => {
      const grpPrefs = slot.group === 'acc' ? Enchant.enchantState.acc.prefs : Enchant.enchantState.weapon.prefs;
      const isCustom = grpPrefs.mode === 'custom';
      if (!isCustom) return slot;
      const customSlots = grpPrefs.custom;
      return { ...slot, level: parseInt(customSlots?.[slot.slotIdx]?.level) || slot.level };
    });
    const enchantResultHTML  = Enchant.buildEnchantSectionHTML(resolvedBestEnchantAssign, resolvedEnchantSlotState, bestEnchantAssign ? currentEnchantAssign : null);
    const currentEnchantHTML = Enchant.buildEnchantSectionHTML(currentEnchantAssign, enchantSlotState);

    const sign        = pctRaw >= 0 ? '≈' : '';
    const slideLabels = [ctx.tDefKey ? `Recommendation vs ${ctx.tDefKey}` : 'Recommendation', 'Before Optimization'];
    const cardsTitle  = Cards.isOptimizeEnabled() ? 'Cards' : 'Cards (Toggle off, optimizer ignore this)';

    const slide1 = `
      ${buildResSectionHTML(cardsTitle, `<div class="co-res-breakdown">${Cards.buildCardsBreakdownHTML(byEquip, lockedCountByEquip, beforeByEquip)}</div>`)}
      ${bestDivNodesHTML}
      ${companionNodesHTML}
      ${enchantResultHTML}
      <div class="co-res-divider"></div>
      ${buildStatsGridHTML(displayFinal, displayBefore, ctx.atkType, pctRaw > 8)}
      ${buildHeroHTML(`≈${fmtNum(combinedBestMult)}`, 'New Multiplier', { val: `${sign}${pct}%`, lbl: 'vs. Before', cls: isGain ? 'pos' : 'neg' })}${NOTE_HTML}
      ${buildMoreToolsHTML()}`;

    const slide2 = `
      ${buildResSectionHTML(cardsTitle, `<div class="co-res-breakdown">${Cards.buildCardsBreakdownHTML(beforeByEquip, lockedCountByEquip)}</div>`)}
      ${currentDivNodesHTML}
      ${currentCompanionHTML}
      ${currentEnchantHTML}
      <div class="co-res-divider"></div>
      ${buildStatsGridHTML(displayBefore, null, ctx.atkType, false, buffMap)}
      ${buildHeroHTML(`≈${fmtNum(currentMultFinal)}`, 'Current Multiplier', { val: 'BASE', lbl: 'Reference' })}`;

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
            <button class="co-slide-nav-btn co-slide-nav-btn--prev" id="co-result-slide-prev" data-dir="-1" disabled>${icons.chevLeft}Prev</button>
            <button class="co-slide-nav-btn co-slide-nav-btn--next" id="co-result-slide-next" data-dir="1">Next${icons.chevRight}</button>
          </div>
        </div>
      </div>`;

    initSlider(container, [...container.querySelectorAll('.co-slide')], container.querySelector('#co-slider-label'), slideLabels, null, '#co-result-slide-prev', '#co-result-slide-next');
    Divinity.bindDivModalNodes(container);
    Companion.bindCompanionModalNodes(container);

    const useSyncBtn = container.querySelector('#coUseSyncBtn');
    if (useSyncBtn) {
      useSyncBtn.addEventListener('click', () => {
        if (!confirm('This will update your equipped cards, divinities, companion, enchantment, and base stats. Ill keep reminding you, in-game results can be differ!')) return;
        try {
          const { unusedMap } = Cards.buildPoolFromSection(Dom.coSection);
          const usedCount     = countBy(Cards.filterValid(best.cards));
          const totalPool     = { ...unusedMap };
          for (const name of Cards.filterValid(equippedNames)) totalPool[name] = (totalPool[name] || 0) + 1;
          const newUnused = {};
          for (const [name, total] of Object.entries(totalPool)) {
            const remaining = total - (usedCount[name] || 0);
            if (remaining > 0) newUnused[name] = remaining;
          }
          Cards.writeToSlots(best.cards, Dom.coSection);
          Divinity.writeBestSelection(bestDivSelection);
          if (resolvedBestEnchantAssign) Enchant.writeAssignment(resolvedBestEnchantAssign);
          if (bestCompanionAssign) Companion.writeAssignment(bestCompanionAssign);
          const finalStateNoBuff = { ...finalState };
          for (const [field, val] of Object.entries(buffMap)) if (field in finalStateNoBuff) finalStateNoBuff[field] -= val;
          Stats.writeStatsToForm(finalStateNoBuff);
          Dom.coSection.querySelector('#co-unused-list').innerHTML = '';
          for (const [name, qty] of Object.entries(newUnused)) Cards.addUnusedRow(Dom.coSection, name, String(qty));
          Cards.saveState(Dom.coSection);
          useSyncBtn.innerHTML = `${icons.check} Applied`;
          useSyncBtn.disabled  = true;
        } catch { useSyncBtn.textContent = 'Error'; }
      });
    }
  }

  return { render };
})();

(() => {
  const { fmtPct, buildLoadingHTML, setLoadingText, updateUseBtn, setInteractionLocked, escHtml } = Utils;
  let calcTimeouts = [];
  const { COMPANION_FIELD_LABELS } = Labels;
  const { nodeOrder, ui: { loaderTiming } } = Config;
  const refreshEnchantBoth = () => {
    Enchant.rebuildWeaponEnchantPairs(true);
    Enchant.rebuildAccEnchantPairs(true);
    Enchant.refresh();
  };

  document.addEventListener('click', Modals.closeAll);
  document.addEventListener('click', e => {
    const sp = e.target.closest('.spoiler');
    if (sp) { e.stopPropagation(); sp.classList.toggle('revealed'); }
  });
  Modals.bind('helpBtn', Dom.helpModal, { closeId: 'helpClose', spoilerToggle: true });

  Stats.initSelect(Dom.tDef,   Object.keys(DEFENSE_TABLE).filter(k => !k.includes('Lvl.')));
  Stats.initSelect(Dom.weapon, Object.keys(WEAPON_SIZE_MODIFIER_TABLE));
  Stats.initSelect(Dom.wElem,  Object.keys(ELEMENT_COUNTER_TABLE));
  Dom.tDef.addEventListener('change', () => {
    Stats.updateTargetLabels(Dom.tDef.value);
    Stats.updateActiveSize();
    Stats.saveStatsState();
    Cards.onContextChanged();
    refreshEnchantBoth();
  });
  Dom.wElem.addEventListener('change', () => {
    Stats.syncElemEnhanceLabel();
    Stats.saveStatsState();
    if (Divinity.getActivePanel()) Divinity.getActivePanel().updateOptions?.();
    Cards.onContextChanged();
    Companion.rerenderSheet();
  });
  Dom.weapon.addEventListener('change', () => {
    if (Dom.coSection.querySelector('.co-card-select')) Cards.rebuildWeaponSlots(Dom.coSection);
    Stats.saveStatsState();
    Enchant.rebuildWeaponEnchantPairs();
    Enchant.refresh();
  });
  Dom.atkType.addEventListener('change', () => {
    const isPen = Dom.atkType.value === 'pen';
    Dom.penField.hidden  = !isPen;
    Dom.critField.hidden = isPen;
    Dom.pen.value = Dom.crit.value = '';
    Stats.saveStatsState();
    refreshEnchantBoth();
    if (Divinity.getActivePanel() && Divinity.getActiveId()) {
      const d = Divinity.getData(Divinity.getActiveId());
      Divinity.navigateTo(d.current, 0);
    }
    Cards.onContextChanged();
    Companion.rerenderSheet();
  });
  Dom.manualBtn.addEventListener('click', () => Stats.setFormOpen(!Dom.form.classList.contains('open')));
  Dom.form.addEventListener('input',  Stats.saveStatsStateDebounced);
  Dom.form.addEventListener('change', Stats.saveStatsState);
  Dom.loadStatsBtn.addEventListener('click', () => {
    try {
      if (Object.keys(Store.section(Config.app.storeKeys.stats)).length) {
        Stats.setFormOpen(true);
        Stats.showMsg('Stats already saved.', 'ok');
        return;
      }
      const raw = localStorage.getItem(Config.app.snapKey);
      if (!raw) { Stats.showMsg(Config.ui.errMsg, 'err'); return; }
      Stats.loadStatsFromSnap(JSON.parse(raw));
      Stats.setFormOpen(true);
      Stats.showMsg('Stats loaded.', 'ok');
    } catch {
      Stats.showMsg(Config.ui.errMsg, 'err');
    }
  });
  Stats.loadStatsState();

  Divinity.loadDivinityState();
  nodeOrder.forEach(Divinity.updateDivCircle);
  Dom.divModalClose.addEventListener('click', Divinity.closeDivModal);
  Dom.divModalBackdrop.addEventListener('click', e => { if (e.target === Dom.divModalBackdrop) Divinity.closeDivModal(); });
  Dom.divinitySectionToggle.checked = Divinity.isOptimizeEnabled();
  Dom.divinitySectionToggle.addEventListener('change', e => Divinity.setOptimizeEnabled(e.target.checked));
  Modals.bind('summaryBtn', Dom.summaryModal, {
    closeId: 'summaryClose',
    onOpen:  Divinity.renderSummaryModal,
  });
  Dom.trashDivBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (!confirm('Clear all divinity? This will `force` remove all added divinities including locked and currently in use.')) return;
    Divinity.resetAll();
  });
  Dom.divSizeSelect.addEventListener('change', e => {
    Divinity.setActiveSize(e.target.value);
    nodeOrder.forEach(Divinity.updateDivCircle);
    Cards.switchSize(Dom.coSection);
    if (!Divinity.getActivePanel() || !Divinity.getActiveId()) return;
    const data = Divinity.getData(Divinity.getActiveId());
    updateUseBtn(Divinity.getActivePanel()._useBtn, Divinity.getUsed(Divinity.getActiveId()) === data.current);
    Divinity.toggleTrashBtn(
      Divinity.getActivePanel()._panelNav,
      Divinity.getActiveId(), data.count, data.current, data.items[data.current]?.locked
    );
  });
  document.querySelectorAll('.node').forEach(cb => {
    cb.addEventListener('change', () => {
      if (Divinity.isNodeNavigating || !cb.checked) return;
      if (Divinity.isAnimating) { cb.checked = false; return; }
      Divinity.getActivePanel() ? Divinity.closePanel(() => Divinity.openPanel(cb)) : Divinity.openPanel(cb);
    });
  });

  Dom.coSection.innerHTML = Cards.buildCardsHTML();
  Cards.loadState(Dom.coSection);
  if (Cards.getWeaponSlotCount() !== Config.game.equipSlots.weapon.count.default) Cards.rebuildWeaponSlots(Dom.coSection);
  Cards.bindCardsEvents(Dom.coSection);

  Utils.bindCoPanelToggle(document.querySelector('#card-about .co-hd'));
  Companion.initCompanionSlider();
  Companion.initCompanionItems();
  Dom.companionSectionToggle.checked = Companion.isOptimizeEnabled();
  Dom.companionSectionToggle.addEventListener('change', e => Companion.setOptimizeEnabled(e.target.checked));
  const closeCompanionModal = () => Dom.coCompanionBackdrop.classList.remove('open');
  Dom.coCompanionModalClose.addEventListener('click', closeCompanionModal);
  Dom.coCompanionBackdrop.addEventListener('click', e => { if (e.target === Dom.coCompanionBackdrop) closeCompanionModal(); });
  Modals.bind('companionSummaryBtn', Dom.companionSummaryModal, {
    closeId: 'companionSummaryClose',
    onOpen: () => {
      const totals = Companion.getBonuses();
      Utils.renderSummaryList(
        Dom.companionSummaryList,
        Object.entries(COMPANION_FIELD_LABELS)
          .filter(([field]) => (totals[field] || 0) > 0)
          .map(([field, lbl]) => ({ lbl, val: `${fmtPct(totals[field])}%` }))
      );
    },
  });
  Modals.bind('companionHelpBtn', Dom.companionHelpModal, { closeId: 'companionHelpClose' });

  const syncEnchantFromDOM = () => { Enchant.readEnchantStateFromDOM(); Enchant.refresh(); };

  Enchant.loadEnchantState();
  Enchant.initEnchantSlider();
  Dom.enchSectionToggle.checked = Enchant.isOptimizeEnabled();
  Dom.enchSectionToggle.addEventListener('change', e => Enchant.setOptimizeEnabled(e.target.checked));
  Dom.enchAwakeningSelect.addEventListener('change', syncEnchantFromDOM);
  Dom.enchantSection.addEventListener('change', e => {
    if (!e.target.closest('#enchLines .ench-pair') && !e.target.closest('#enchLinesAcc .ench-pair')) return;
    syncEnchantFromDOM();
  });
  Dom.enchSettingsBtn.addEventListener('click', () => {
    const open = Dom.enchSettingsPanel.classList.toggle('open');
    Dom.enchSettingsBtn.classList.toggle('active', open);
    if (open) Enchant.renderActiveSettingsPanel();
  });
  Dom.enchResetBtn.addEventListener('click', () => {
    const group = Enchant.getActiveSlide() === 1 ? 'acc' : 'weapon';
    const groupLabel = Enchant.getGroupLabel(group);
    if (!confirm(`Reset ${groupLabel} enchantment selections? This cannot be undone.`)) return;
    Enchant.resetEnchantSlots(group);
  });

  Dom.calculateBtn.addEventListener('click', () => {
    calcTimeouts.forEach(clearTimeout);
    calcTimeouts = [];
    setInteractionLocked(true, Dom.calculateBtn);

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

    const cardComputation = Optimizer.buildCardComputation(Dom.coSection);
    const cardCombos      = cardComputation.prebuiltCombos.totalCombos;
    const totalCombos     = cardCombos + divCombos + companionCombos + enchantCombos;
    const targetLabel     = (ctx.tDefKey || 'target').replace(/\s*Lv\.?\s*\d{3}/i, '');
    const comboLabel      = totalCombos.toLocaleString();

    calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, `Scanned! ${targetLabel} appear in ${comboLabel} seconds`);
    }, loaderTiming.convexMirror));
    calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, totalCombos > loaderTiming.longComboThreshold ? 'Too long, let me fly to the future' : 'Wait, still finding');
    }, loaderTiming.convexMirror + loaderTiming.okScanned));
    calcTimeouts.push(setTimeout(() => {
      setLoadingText(resultEl, totalCombos > loaderTiming.longComboThreshold ? 'Wait, still finding, fly wing skemm' : 'Wait, fly wing skemm', true);
    }, loaderTiming.convexMirror + loaderTiming.okScanned + loaderTiming.timeTravel));
    calcTimeouts.push(setTimeout(() => {
      try {
        Optimizer.runAndRender(Dom.coSection, calcState, ctx, cardComputation);
      } catch (err) {
        resultEl.innerHTML = `<div class="co-error">Error: ${escHtml(err.message)}</div>`;
        setInteractionLocked(false, Dom.calculateBtn);
      }
    }, loaderTiming.convexMirror + loaderTiming.okScanned + loaderTiming.timeTravel + loaderTiming.flywingScam));
  });
})();
