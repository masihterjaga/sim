// ======== messy (i dont care anymore) 
const CFG = {
  maxPanels:          8,
  maxCompanion:       16,
  maxCompanionStats:  3,
  maxDivinity:        { blue: 5, purple: 6, gold: 7 },
  maxEvalLimit:       1_234_567,
  maxEnchPrefs:       3,
  sizes:              ['small', 'medium', 'large'],
  storageKey:         'roxtimizer',
  snapKey:            'pwa_snap',
  companionSlots:     4,
};
const LOADER_TIMING = {
  convexMirror: 1748,
  okScanned: 3863,
  timeTravel: 1873,
  flywingScam: 7867,
  qqq: 773,
};
const DIVINITY_STATS = {
  pen:         { blue: 0.15, purple: 0.18, gold: 0.21 },
  crit:        { blue: 0.29, purple: 0.37, gold: 0.42 },
  dmg:   { blue: 0.15, purple: 0.18, gold: 0.21 },
  element:     { blue: 0.18, purple: 0.23, gold: 0.26 },
  size_small:  { blue: 0.18, purple: 0.23, gold: 0.26 },
  size_medium: { blue: 0.18, purple: 0.23, gold: 0.26 },
  size_large:  { blue: 0.18, purple: 0.23, gold: 0.26 },
};
const DIVINITY_KEY_MAP = {
  pen:         { field: 'pen'     },
  crit:        { field: 'crit'    },
  dmg:   { field: 'dmg'     },
  element:     { field: 'elemEnh' },
  size_small:  { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Small'  },
  size_medium: { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Medium' },
  size_large:  { field: 'sizeEnh', cond: ctx => ctx.tSize === 'Large'  },
};
const STAT_LABELS = {
  pen:      'Final PEN',
  crit:     'Crit DMG Bns',
  dmg:      'Final P/M DMG Bns',
  dmgStack: 'Final DMG Stack',
};
const DOM = {
  msg:              document.getElementById('statsMsg'),
  form:             document.getElementById('statsForm'),
  manualBtn:        document.getElementById('inputManualBtn'),
  tDef:             document.getElementById('targetDefSelect'),
  weapon:           document.getElementById('weaponSelect'),
  wElem:            document.getElementById('weaponElementSelect'),
  atkType:          document.getElementById('atkType'),
  penField:         document.getElementById('penField'),
  critField:        document.getElementById('critField'),
  pen:              document.getElementById('pen'),
  crit:             document.getElementById('crit'),
  dmg:              document.getElementById('dmg'),
  elemEnh:          document.getElementById('elemEnhance'),
  sizeEnh:          document.getElementById('sizeEnhance'),
  race:             document.getElementById('race'),
  attr:             document.getElementById('attr'),
  dmgStack:         document.getElementById('dmgStack'),
  elemEnhanceLabel: document.getElementById('elemEnhanceLabel'),
  dmgSizeLabel:     document.getElementById('dmgSizeLabel'),
  dmgRaceLabel:     document.getElementById('dmgRaceLabel'),
  dmgAttrLabel:     document.getElementById('dmgAttrLabel'),
  tFinalDef:        document.getElementById('targetFinalDefDisplay'),
  tDmgRed:          document.getElementById('targetDmgRedDisplay'),
  tSize:               document.getElementById('targetSizeSelect'),
  tRace:               document.getElementById('targetRaceSelect'),
  tAttr:               document.getElementById('targetElementSelect'),
  resultCard:          document.getElementById('resultCard'),
  divSizeSelect:       document.getElementById('divSizeSelect'),
  enchLines:           document.getElementById('enchLines'),
  enchAwakeningSelect: document.getElementById('enchAwakeningSelect'),
  enchSettingsPanel:   document.getElementById('enchSettingsPanel'),
  enchSettingsBtn:     document.getElementById('enchSettingsBtn'),
  enchSettingsInner:   document.getElementById('enchSettingsInner'),
  coCompanionBackdrop: document.getElementById('coCompanionModalBackdrop'),
};
const getDynamicLabel    = (domKey, format, fallback) => { const v = DOM?.[domKey]?.value; return (v && v !== '—') ? format(v) : fallback; };
const getElemEnhLabel    = () => getDynamicLabel('wElem', v => `${v} Enhance`, 'Element Enhance');
const STAT_OPTIONS = [
  { key: 'pen',         label: STAT_LABELS.pen  },
  { key: 'crit',        label: STAT_LABELS.crit },
  { key: 'dmg',         label: STAT_LABELS.dmg  },
  { key: 'element',    get label() { return getElemEnhLabel(); } },
  { key: 'size_small',  label: 'DMG to Small'   },
  { key: 'size_medium', label: 'DMG to Medium'  },
  { key: 'size_large',  label: 'DMG to Large'   },
];
const NODES = [
  { id: 'n1', name: 'Spear of Eternity',  dir: { axis: 'X', sign: -1 } },
  { id: 'n2', name: 'Thunderous Hammer',  dir: { axis: 'X', sign:  1 } },
  { id: 'n3', name: 'Blade of Godslayer', dir: { axis: 'X', sign: -1 } },
  { id: 'n4', name: 'Wolf Shackles',      dir: { axis: 'X', sign:  1 } },
  { id: 'n5', name: 'Stormrage Halberd',  dir: { axis: 'X', sign: -1 } },
  { id: 'n6', name: "Chanter's Harp",     dir: { axis: 'X', sign:  1 } },
  { id: 'n7', name: 'Bow of Winter',      dir: { axis: 'Y', sign: -1 } },
  { id: 'n8', name: "Reaper's Scythe",    dir: { axis: 'Y', sign:  1 } },
];
const nodeOrder  = NODES.map(n => n.id);
const NODE_NAMES = Object.fromEntries(NODES.map(n => [n.id, n.name]));
const DIR_MAP    = Object.fromEntries(NODES.map(n => [n.id, n.dir]));
const EQUIP_SLOTS = {
  weapon:    { label: 'Weapon',    count: 5 },
  clothes:   { label: 'Clothes',   count: 2 },
  cloak:     { label: 'Cloak',     count: 2 },
  shoes:     { label: 'Shoes',     count: 2 },
  accessory: { label: 'Accessory', count: 6 },
  headgear:  { label: 'Headgear',  count: 6 },
};
const pluck        = (obj, key) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v[key]]));
const SLOT_COUNTS  = pluck(EQUIP_SLOTS, 'count');
const EQUIP_LABELS = pluck(EQUIP_SLOTS, 'label');
const getTargetRaceLabel = () => getDynamicLabel('tRace', v => `DMG to ${v}`, 'DMG to Race');
const getTargetAttrLabel = () => getDynamicLabel('tAttr', v => `DMG to ${v}`, 'DMG to Attribute');
const getTargetSizeLabel = () => getDynamicLabel('tSize', v => `DMG to ${v}`, 'DMG to Size');
const getBuffStatOptions = () => [
  { field: 'dmg',      label: STAT_LABELS.dmg      },
  { field: 'pen',      label: STAT_LABELS.pen       },
  { field: 'crit',     label: STAT_LABELS.crit      },
  { field: 'elemEnh',  label: getElemEnhLabel()     },
  { field: 'sizeEnh',  label: getTargetSizeLabel()  },
  { field: 'race',     label: getTargetRaceLabel()  },
  { field: 'attr',     label: getTargetAttrLabel()  },
  { field: 'dmgStack', label: STAT_LABELS.dmgStack  },
];
const NUM_FIELDS = ['pen', 'crit', 'dmg', 'elemEnh', 'sizeEnh', 'race', 'attr', 'dmgStack'];
const SNAP_FIELDS = {
  pen:      'pen',
  crit:     'crit',
  dmg:      'dmg',
  elemEnh:  'elemEnhance',
  sizeEnh:  'sizeEnhance',
  race:     'race',
  attr:     'attr',
  dmgStack: 'dmgStack',
};
const STAT_OPTIONS_MAP = new Map(STAT_OPTIONS.map(o => [o.key, o]));
const createStatResolver = (ctxKey, ctxVal, field) => ctx => ctx[ctxKey] === ctxVal ? field : null;
const ELEM_LIST = ['Fire','Water','Wind','Earth','Holy','Shadow','Ghost','Poison','Neutral','Undead'];
const SIZE_LIST = ['Small', 'Medium', 'Large'];
const RACE_LIST = ['Demi-Human','Brute','Demon','Angel','Fish','Formless','Insect','Dragon','Plant','Undead'];
const STAT_RESOLVERS = {
  'Final P.PEN':       ctx => ctx.atkType === 'pen'  ? 'pen'  : null,
  'Final M.PEN':       ctx => ctx.atkType === 'pen'  ? 'pen'  : null,
  'Crit DMG Bonus':    ctx => ctx.atkType === 'crit' ? 'crit' : null,
  'Final P.DMG Bonus': () => 'dmg',
  'Final M.DMG Bonus': () => 'dmg',
  ...ELEM_LIST.reduce((acc, e) => ({ ...acc, [`${e} Enhance`]:                        createStatResolver('wElem', e, 'elemEnh') }), {}),
  ...SIZE_LIST.reduce((acc, s) => ({ ...acc, [`Bonus DMG to ${s}`]:                   createStatResolver('tSize', s, 'sizeEnh') }), {}),
  ...RACE_LIST.reduce((acc, r) => ({ ...acc, [`Bonus DMG to ${r}`]:                   createStatResolver('tRace', r, 'race')    }), {}),
  ...ELEM_LIST.reduce((acc, a) => ({ ...acc, [`Bonus DMG to ${a} Attribute Monster`]: createStatResolver('tAttr', a, 'attr')    }), {}),
};
const STAT_DEDUP_GROUPS = [
  ['Final P.DMG Bonus', 'Final M.DMG Bonus'],
  ['Final P.PEN',       'Final M.PEN'      ],
];
const getBaseStatLabels = () => [
  { field: 'dmg',      label: STAT_LABELS.dmg      },
  { field: 'elemEnh',  label: getElemEnhLabel()     },
  { field: 'sizeEnh',  label: getTargetSizeLabel()  },
  { field: 'race',     label: getTargetRaceLabel()  },
  { field: 'attr',     label: getTargetAttrLabel()  },
  { field: 'dmgStack', label: STAT_LABELS.dmgStack  },
];
const SPECIAL_NODES = {
  n1: { field: 'spearValue',  calcValue: (_ctx, panel) => panel.lightning ? 84 : 0 },
  n8: {
    field: 'reaperValue',
    calcValue: (ctx, panel) => panel.lightning
      ? ((ctx.wElem === ctx.tAttr) || (ctx.wElem === 'Neutral' && !ctx.tAttr) ? 84 : 28)
      : 0,
  },
};
const COMPANION_STAT_OPTIONS = [
  { key: 'elemEnh', get label() { return getElemEnhLabel(); } },
  { key: 'pen',     label: STAT_LABELS.pen  },
  { key: 'crit',    label: STAT_LABELS.crit },
  { key: 'dmg',     label: STAT_LABELS.dmg  },
];
const COMPANION_FIELD_LABELS = {
  get elemEnh() { return getElemEnhLabel(); },
  pen:  STAT_LABELS.pen,
  crit: STAT_LABELS.crit,
  dmg:  STAT_LABELS.dmg,
};
const COMPANION_RATES = {
  purple: { crit: 0.0040, default: 0.0020 },
  gold:   { crit: 0.0066, default: 0.0033 },
};
const ERR_MSG = 'No saved stats found. Use the <a href="https://masihterjaga.github.io/sim" target="_blank" rel="noopener">ratio calculator</a> first so you don\'t have to re-enter your stats each time.';
const ICONS = {
  lockClosed: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`,
  lockOpen:   `<path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>`,
  horizSwap:  `<svg class="co-chip-swap" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4l4 4-4 4M3 8h18"/><path d="M7 20l-4-4 4-4M21 16H3"/></svg>`,
  vertSwap:   `<svg class="co-div-swap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l4 4 4-4M8 21V3"/><path d="M20 7l-4-4-4 4M16 3v18"/></svg>`,
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
  person:        `<svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="3.5" r="2" stroke="currentColor" stroke-width="1.3"/><line x1="6" y1="5.5" x2="6" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="3.5" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  star:          `<svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9" class="icon-star-svg"><path d="M8 1.5l1.64 3.32 3.66.53-2.65 2.58.63 3.65L8 9.77l-3.28 1.81.63-3.65L2.7 5.35l3.66-.53L8 1.5z"/></svg>`,
  companionSwap: `<svg class="co-companion-swap" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const ENCHANT_OPTIONS = [
  { value: 'morroc_crit',  label: 'Morroc \u2013 Crit DMG Bns',      type: 'crit' },
  { value: 'payon_crit',   label: 'Payon \u2013 Crit DMG Bns',       type: 'crit' },
  { value: 'geffen_crit',  label: 'Geffen \u2013 Crit DMG Bns',      type: 'crit' },
  { value: 'izlude_race',  label: 'Izlude \u2013 DMG to Race',       type: 'race' },
  { value: 'alberta_attr', label: 'Alberta \u2013 DMG to Attribute', type: 'attr' },
  { value: 'alberta_dmg', label: 'Alberta \u2013 Final P/M DMG Bns', type: 'dmg' },
  { value: 'geffen_dmg',   label: 'Geffen \u2013 Final P/M DMG Bns',  type: 'dmg' },
  { value: 'geffen_pen',   label: 'Geffen \u2013 Final PEN',          type: 'pen' },
];
const ENCHANT_VALUES = {
  morroc_crit:  { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: null },
  izlude_race:  { '1H': 2.00, '2H': 3.00, Dagger: 1.50, Shield: 1.00, ACC: null },
  alberta_attr: { '1H': 2.00, '2H': 3.00, Dagger: 1.50, Shield: 1.00, ACC: null },
  alberta_dmg: { '1H': 1.60, '2H': 2.40, Dagger: 1.20, Shield: 0.80, ACC: null },
  payon_crit:   { '1H': 3.60, '2H': 5.40, Dagger: 2.70, Shield: 1.80, ACC: null },
  geffen_crit:  { '1H': 4.80, '2H': 7.20, Dagger: 3.60, Shield: 2.40, ACC: 2.40 },
  geffen_pen:   { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: 1.20 },
  geffen_dmg:   { '1H': 2.40, '2H': 3.60, Dagger: 1.80, Shield: 1.20, ACC: null },
};
const ENCHANT_SIX_SLOT = new Set([
  'One-Handed Sword', 'One-Handed Axe', 'One-Handed Staff', 'Mace', 'GS', 'Dagger',
]);
const ENCHANT_OPTIONS_MAP = new Map(ENCHANT_OPTIONS.map(o => [o.value, o]));
const getEnchantTypeLabel = type => ({
  crit: STAT_LABELS.crit,
  race: getTargetRaceLabel(),
  attr: getTargetAttrLabel(),
  dmg:  STAT_LABELS.dmg,
  pen:  STAT_LABELS.pen,
})[type] ?? type;
const getEnchantOptLabel = opt => {
  const sep = opt.label.indexOf('\u2013');
  if (sep === -1) return opt.label;
  return opt.label.slice(0, sep + 2) + getEnchantTypeLabel(opt.type);
};
const buildLockSvg = closed => `<svg viewBox="0 0 24 24" fill="currentColor">${closed ? ICONS.lockClosed : ICONS.lockOpen}</svg>`;
const cssTranslate      = (axis, pct) => `translate${axis}(${pct}%)`;
const labelWithVal = (base, val) => val ? `${base} (${val})` : base;
const fmtPct     = v => (Math.round((Number(v) || 0) * 100) / 100).toFixed(2);
const getQuality    = panel => panel.gold ? 'gold' : panel.purple ? 'purple' : 'blue';
const getStatVal    = (key, quality) => DIVINITY_STATS[key]?.[quality] ?? null;
const fmtRawPct  = val => (val * 100).toFixed(0) + '%';
const fmtStatPct = (key, quality) => { const v = getStatVal(key, quality); return v === null ? '' : fmtRawPct(v); };
const getEnchantExcludedType = () => DOM.atkType.value === 'pen' ? 'crit' : 'pen';
const EXCL_KEYS = { crit: new Set(['crit']), pen: new Set(['pen']) };
const isAtkExcluded = key => EXCL_KEYS[getEnchantExcludedType()]?.has(key) ?? false;
const buildEnchantOptionsHTML = (currentVal = '') => {
  const excl = getEnchantExcludedType();
  return '<option value="" selected>Enchantment</option>' +
    ENCHANT_OPTIONS.map(o => {
      const excluded = o.type === excl && o.value !== currentVal;
      return `<option value="${o.value}"${excluded ? ' disabled' : ''}>${getEnchantOptLabel(o)}</option>`;
    }).join('');
};
const ENCHANT_LEVEL_HTML =
  '<option value="" selected>Level</option>' +
  Array.from({ length: 15 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
const nodeData = {};
const ui = {
  activeId:         null,
  activeSize:       'small',
  activePanel:      null,
  activeDir:        null,
  isAnimating:      false,
  isNodeNavigating: false,
  calcTimeouts:     [],
};
const sliderContainer  = document.querySelector('.slider-container');
const grid             = document.getElementById('grid');
const summaryModal     = document.getElementById('summaryModal');
const helpModal        = document.getElementById('helpModal');
const coSection        = document.getElementById('card-optimizer');
const enchantSection      = document.getElementById('card-enchantment');
const divModalBackdrop = document.getElementById('divModalBackdrop');
const divModal         = document.getElementById('divModal');
const divModalName     = document.getElementById('divModalName');
const divModalFlash    = document.getElementById('divModalFlash');
const divModalStatsCur = document.getElementById('divModalStatsCurrent');
const divModalArrow    = document.getElementById('divModalArrow');
const divModalStatsRec = document.getElementById('divModalStatsRec');
const enchantState = { awakening: '', slots: [], prefs: { mode: 'chip', chip: [], custom: { awakening: '', slots: [] } } };
const defaultEnchPrefs = () => ({ mode: 'chip', chip: [], custom: { awakening: '', slots: [] } });
const defaultPanel          = () => ({ blue: true, purple: false, gold: false, lightning: false, locked: false, divinity: [null] });
const defaultSizeMap        = (val = () => ({})) => Object.fromEntries(CFG.sizes.map(s => [s, typeof val === 'function' ? val() : val]));
const defaultUsedBySize     = () => defaultSizeMap(() => null);
const defaultCompanionItem  = () => ({ stats: Array(CFG.maxCompanionStats).fill(null), quality: 'purple', name: null, star: false });
const getUsed         = id => getData(id).usedBySize[ui.activeSize] ?? null;
const setUsed         = (id, idx) => { getData(id).usedBySize[ui.activeSize] = idx; };
const isUsedInAnySize = (id, idx) => Object.values(getData(id).usedBySize).some(v => v === idx);
const isNodeFlash     = id => { const i = getUsed(id); return i != null && !!(getData(id).panels[i]?.lightning); };
const saveDivinityState = () => writeStore('divinity', nodeData);
const loadDivinityState = () => { try { Object.assign(nodeData, readSection('divinity')); normalizeNodeData(); } catch {} };
const getCard      = name => typeof cardData !== 'undefined' ? (cardData[name] ?? null) : null;
const isValidCard     = name => !!name && name !== '—';
const filterValidCards      = names => names.filter(isValidCard);
const countBy         = (names, obj = {}) => { for (const n of names) obj[n] = (obj[n] || 0) + 1; return obj; };
const calcMult        = state => calculateMultiplier(state).mult;
const runWithStrategy = (total, exactFn, greedyFn) => total <= CFG.maxEvalLimit ? exactFn() : greedyFn();
const parseStatPct    = raw =>
  typeof raw === 'string' && raw.includes('%')
    ? parseFloat(raw.replace('%', '').replace(/,/g, '')) : null;
const cardDeltaCache = new Map();
const stripCards = (state, names, ctx) => applyCardStats(state, names, ctx, -1);
const applyCards    = (state, names, ctx) => applyCardStats(state, names, ctx,  1);
const canShowTrash  = (id, count, idx, locked = false) =>
  !locked && count > 1 && !isUsedInAnySize(id, idx);
const getWeaponSlotCount = () => DOM.weapon.value === 'Dagger' ? 6 : EQUIP_SLOTS.weapon.count;
const showStatsMsg = (html, type) => { DOM.msg.innerHTML = html; DOM.msg.className = `stats-msg ${type} show`; };
const setFormOpen  = open => { DOM.form.classList.toggle('open', open); DOM.manualBtn.classList.toggle('active', open); };
const readCardsBuffs    = section => [...section.querySelectorAll('.co-buff-row')].map(row => ({
  stat: row.querySelector('.co-buff-stat').value,
  val:  row.querySelector('.co-buff-val').value,
}));
const getSlotKey      = el => `${el.dataset.equip}_${el.dataset.slot}`;
const readCardsEquipped = section => Object.fromEntries(
  [...section.querySelectorAll('.co-card-select')].map(sel => [getSlotKey(sel), sel.dataset.value ?? ''])
);
const readCardsLocked   = section => Object.fromEntries(
  [...section.querySelectorAll('.co-lock-btn')].map(btn => [getSlotKey(btn), btn.dataset.locked === 'true'])
);
const readCardsUnused   = section => [...section.querySelectorAll('.co-unused-row')].map(row => ({
  name: row.querySelector('.co-unused-name').dataset.value ?? '',
  qty:  row.querySelector('.co-unused-qty').value,
}));
const saveEnchantState = () => writeStore('enchantment', enchantState);
const refreshEnchantSettingsIfOpen = () => {
  if (DOM.enchSettingsPanel?.classList.contains('open')) renderEnchantSettingsPanel();
};
const rAF2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

const QTY_OPTIONS_HTML = Array.from({ length: 6 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
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
const stripCurrentDivinity = (state, ctx) => {
  const currentSel = nodeOrder
    .filter(id => nodeData[id] && getUsed(id) != null)
    .map(id => ({ id, panelIndex: getUsed(id) }));
  return applyDivinity(state, currentSel, ctx, -1);
};
const applyEnchant = (state, assign) => applyEnchantStats(state, assign,  1);
const buildResSectionHTML = (title, innerHTML, fallback = '') =>
  `<div class="co-res-section"><div class="co-res-section-title">${title}</div>${innerHTML || fallback}</div>`;
const closeDivModal = () => divModalBackdrop.classList.remove('open');
const bindModalNodes = (container, selector, getArgs, openFn) =>
  container.querySelectorAll(selector).forEach(el => el.addEventListener('click', () => openFn(getArgs(el))));
const bindDivModalNodes = container => bindModalNodes(container, '.co-div-node', el => ({
  nodeId:     el.dataset.nodeid,
  panelIndex: parseInt(el.dataset.panelindex),
  isChanged:  el.dataset.changed === 'true',
}), openDivModal);
const bindCompanionModalNodes = container => bindModalNodes(container, '.co-companion-node', el => ({
  slotIdx:   parseInt(el.dataset.slot),
  recIdx:    el.dataset.recidx !== '' ? parseInt(el.dataset.recidx) : null,
  curIdx:    el.dataset.curidx !== '' ? parseInt(el.dataset.curidx) : null,
  isChanged: el.dataset.changed === 'true',
}), openCompanionModal);
const getAwkMult = () => {
  const v = parseInt(DOM.enchAwakeningSelect?.value) || 0;
  return v > 0 ? (1 + v * 0.1) : 1;
};
const getEnchantVal = (key, level, col, awkMult) => {
  const perLvl = ENCHANT_VALUES[key]?.[col];
  if (perLvl == null) return null;
  return +(perLvl * level * awkMult).toFixed(2);
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
const stripEnchant = (state, assign) => applyEnchantStats(state, assign, -1);
const registeredModals = [];
const registerModal    = el => { if (el) registeredModals.push(el); };
const closeAllModals   = () => registeredModals.forEach(el => el.classList.remove('open'));
let _storeCache = null;
let applyCompanion = null;
let stripCompanion = null;
let runCompanionOptimizer = null;
let writeCompanionAssign = null;
let getCompanionItems = null;
let getCompanionUsed = null;
let getCompanionBonuses = null;
let companionOnSlotChange = null;
let rerenderCompanionSheet = null;

// shared 
function escHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
};
function fmtNum(n) {
  const v = Number(n) || 0, a = Math.abs(v);
  return a > 999999 ? `${(v / 1_000_000).toFixed(2)}M`
       : a > 9999   ? `${(v / 1000).toFixed(2)}K`
       : v % 1 === 0 ? v.toString()
       : (Math.floor(v * 100) / 100).toString();
};
function saveStatsState() {
  writeStore('stats', {
    targetDef: DOM.tDef.value,
    weapon:    DOM.weapon.value,
    wElem:     DOM.wElem.value,
    atkType:   DOM.atkType.value,
    ...Object.fromEntries(NUM_FIELDS.map(f => [f, DOM[f].value])),
  });
};
function initSelect(sel, keys) {
  const frag = document.createDocumentFragment();
  for (const key of keys) {
    const opt = document.createElement('option');
    opt.value = opt.textContent = key;
    frag.appendChild(opt);
  }
  sel.appendChild(frag);
};
function initSlider(container, slides, labelEl, slideLabels, onSlide, prevSelector, nextSelector) {
  const btnPrev = container.querySelector(prevSelector ?? '[data-dir="-1"]');
  const btnNext = container.querySelector(nextSelector ?? '[data-dir="1"]');
  let current = 0, transitioning = false;

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
function animateSlideTransition(incoming, outgoing, axis, dirSign, onDone) {
  rAF2(() => {
    incoming.style.transition = '';
    incoming.style.transform  = cssTranslate(axis, 0);
    outgoing.style.transform  = cssTranslate(axis, -dirSign * 100);
  });
  incoming.addEventListener('transitionend', () => { outgoing.remove(); onDone?.(); }, { once: true });
};
function animateSlide(incoming, outgoing, axis, dirSign, onDone) {
  incoming.style.transition = 'none';
  incoming.style.transform  = cssTranslate(axis, dirSign * 100);
  ui.isAnimating = true;
  animateSlideTransition(incoming, outgoing, axis, dirSign, () => { ui.isAnimating = false; onDone?.(); });
};
function toggleConditionalBtn(container, selector, shouldExist, makeEl) {
  const existing = container.querySelector(selector);
  if (shouldExist && !existing) container.appendChild(makeEl());
  else if (!shouldExist && existing) existing.remove();
};
function updateSelectsDisabled(container, selector, getValues) {
  const values   = getValues();
  const allTaken = new Set(values.filter(Boolean));
  container.querySelectorAll(selector).forEach((sel, i) => {
    const own = values[i];
    sel.querySelectorAll('option[value]:not([value=""])').forEach(opt => {
      opt.disabled = (opt.value !== own && allTaken.has(opt.value)) || (isAtkExcluded(opt.value) && opt.value !== own);
    });
  });
};
function toggleCoPanel(hd) {
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
function bindCoPanelToggle(hd) {
  const toggle = () => toggleCoPanel(hd);
  hd.addEventListener('click', toggle);
  hd.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
};
function makeRow({ listSelector, html, populate, onRemove, section }) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  const row = wrap.firstElementChild;
  populate(row);
  row.querySelector('.co-rm-btn').addEventListener('click', () => { row.remove(); onRemove?.(); });
  row.addEventListener('change', () => saveCardsState(section));
  section.querySelector(listSelector).appendChild(row);
  return row;
};
function buildEquipGroupHTML(equip, label, count) {
  const cardKeys = typeof cardData !== 'undefined'
    ? Object.keys(cardData).filter(n => cardData[n].equip === equip).sort()
    : [];
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
};
function bindEquipSlotSearch(input, section) {
  const equip      = input.dataset.equip;
  const allOptions = typeof cardData !== 'undefined'
    ? Object.keys(cardData).filter(n => cardData[n].equip === equip).sort()
    : [];
  const panel = input.nextElementSibling;
  let filtered = [], highlightIdx = -1, debounce = null;

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
    if (idx >= 0 && items[idx]) { items[idx].classList.add('co-card-search-highlighted'); items[idx].scrollIntoView({ block: 'nearest' }); }
    highlightIdx = idx;
  }

  function openPanel() {
    filtered = allOptions;
    renderPanel(filtered);
    panel.classList.add('open');
  }

  function closePanel() {
    panel.classList.remove('open');
    input.value = input.dataset.value;
    updateCardSelectQuality(input);
  }

  function selectCard(n) {
    input.value         = n;
    input.dataset.value = n;
    panel.classList.remove('open');
    updateCardSelectQuality(input);
    saveCardsState(section);
  }

  input.addEventListener('click', () => {
    if (panel.classList.contains('open')) { closePanel(); return; }
    input.select();
    openPanel();
  });

  input.addEventListener('input', () => {
    input.dataset.value = '';
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.toLowerCase();
      filtered = q ? allOptions.filter(n => n.toLowerCase().includes(q)) : allOptions;
      renderPanel(filtered);
      panel.classList.add('open');
    }, 120);
  });

  input.addEventListener('keydown', e => {
    const items = panel.querySelectorAll('.co-card-search-item');
    if      (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(Math.min(highlightIdx + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight(Math.max(highlightIdx - 1, 0)); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (highlightIdx >= 0 && filtered[highlightIdx]) selectCard(filtered[highlightIdx]); }
    else if (e.key === 'Escape')    { closePanel(); input.blur(); }
  });

  input.addEventListener('blur', () => { setTimeout(closePanel, 150); });
};
function bindModal(btnId, modalEl, opts = {}) {
  registerModal(modalEl);
  const { onOpen, stopClickPropagation = true, spoilerToggle = false } = opts;
  const closeEl = typeof opts.closeId === 'string' ? document.getElementById(opts.closeId) : opts.closeEl;
  const open  = () => { onOpen?.(); modalEl.classList.add('open'); };
  const close = () => modalEl.classList.remove('open');
  document.getElementById(btnId).addEventListener('click', e => {
    e.stopPropagation();
    const opening = !modalEl.classList.contains('open');
    closeAllModals();
    if (opening) open();
  });
  closeEl?.addEventListener('click', close);
  if (stopClickPropagation) {
    modalEl.addEventListener('click', e => {
      if (spoilerToggle) {
        const sp = e.target.closest('.spoiler');
        if (sp) { sp.classList.toggle('revealed'); e.stopPropagation(); return; }
      }
      e.stopPropagation();
    });
  }
};

// storage 
function readStore() {
  if (_storeCache) return _storeCache;
  
  try {
    _storeCache = JSON.parse(localStorage.getItem(CFG.storageKey) || '{}');
  } catch {
    _storeCache = {};
  }
  
  return _storeCache;
};
function readSection(key) {
  return readStore()[key] || {};
};
function writeStore(key, data) {
  try {
    const s = readStore();
    s[key] = data;
    localStorage.setItem(CFG.storageKey, JSON.stringify(s));
  } catch {}
};

// divinity 
function normalizeNodeData() {
  for (const id of Object.keys(nodeData)) {
    const d = nodeData[id];
    while (d.panels.length < d.count) d.panels.push(defaultPanel());
    for (const p of d.panels) {
      if (!Array.isArray(p.divinity)) p.divinity = [null];
      p.locked ??= false;
      if (!p.blue && !p.purple && !p.gold) p.blue = true;
    }
  }
};
function getData(id) {
  if (!nodeData[id]) {
    nodeData[id] = { count: 1, current: 0, usedBySize: defaultUsedBySize(), panels: [defaultPanel()] };
  }
  return nodeData[id];
};
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
};
function updateUseBtn(btn, isUsed) {
  btn.classList.toggle('active', isUsed);
  btn.querySelector('span').textContent  = isUsed ? 'In Use' : 'Use';
  btn.querySelector('svg').style.display = isUsed ? ''     : 'none';
};
function setLockState(btn, locked) {
  btn.dataset.locked = String(locked);
  btn.innerHTML      = buildLockSvg(locked);
  btn.title          = locked ? 'Unlock slot' : 'Lock slot';
};
function addSubPanel() {
  if (ui.isAnimating || !ui.activeId) return;
  const data = getData(ui.activeId);
  if (data.count >= CFG.maxPanels) return;
  data.count++;
  data.panels.push(defaultPanel());
  saveDivinityState();
  navigateTo(data.count - 1, 1);
};
function makeAddBtn() {
  const btn = document.createElement('button');
  btn.className   = 'add-btn';
  btn.textContent = '+ Add Div';
  btn.addEventListener('click', addSubPanel);
  return btn;
};
function toggleAddBtn(footerRight, count) {
  toggleConditionalBtn(footerRight, '.add-btn', count < CFG.maxPanels, makeAddBtn);
};
function initDivSubPanel(contentEl, s) {
  const list      = document.createElement('div');
  list.className  = 'divinity-list';
  const addToggle = document.createElement('button');
  addToggle.className   = 'divinity-add-toggle';
  addToggle.textContent = '+ Add Stat';
  const getDivOptionText = (opt, quality) => `${opt.label} · ${fmtStatPct(opt.key, quality)}`;
  const updateDivAddToggle      = () => { addToggle.style.display = s.divinity.length >= CFG.maxDivinity[getQuality(s)] ? 'none' : ''; };
  const updateDivOptionDisabled = () => updateSelectsDisabled(list, '.divinity-select', () => s.divinity);
  function makeDivRow(selectedKey, index) {
    const quality    = getQuality(s);
    const optionsHTML = STAT_OPTIONS.map(opt => {
      const excl = isAtkExcluded(opt.key) && opt.key !== selectedKey;
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
    sel.addEventListener('change', () => { s.divinity[index] = sel.value; saveDivinityState(); updateDivOptionDisabled(); });
    delBtn.addEventListener('click', () => { s.divinity.splice(index, 1); saveDivinityState(); renderDivRows(); });
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
    const max     = CFG.maxDivinity[quality];
    if (s.divinity.length > max) { s.divinity.splice(max); saveDivinityState(); renderDivRows(); return; }
    list.querySelectorAll('.divinity-select').forEach(sel => {
      sel.querySelectorAll('option[value]:not([value=""])').forEach(opt => {
        const meta = STAT_OPTIONS_MAP.get(opt.value);
        if (meta) opt.textContent = getDivOptionText(meta, quality);
      });
    });
    updateDivAddToggle();
  }
  addToggle.addEventListener('click', () => {
    if (s.divinity.length >= CFG.maxDivinity[getQuality(s)]) return;
    s.divinity.push(null);
    saveDivinityState();
    renderDivRows();
  });
  const max = CFG.maxDivinity[getQuality(s)];
  if (s.divinity.length > max) { s.divinity.splice(max); saveDivinityState(); }
  renderDivRows();
  contentEl.appendChild(list);
  contentEl.appendChild(addToggle);
  return updateDivOptions;
};
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
    saveDivinityState();
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
};
function navigateTo(newIndex, slideDir) {
  if (ui.isAnimating || !ui.activePanel || !ui.activeId) return;
  const data = getData(ui.activeId);
  data.current = newIndex;
  ui.isAnimating = true;
  const s      = data.panels[newIndex];
  const count  = data.count;
  const isUsed = getUsed(ui.activeId) === newIndex;
  const p      = ui.activePanel;
  p.querySelector('.panel-nav-count').textContent        = `${newIndex + 1}/${count}`;
  p.querySelector('.prev-btn').disabled                  = newIndex === 0;
  p.querySelector('.next-btn').disabled                  = newIndex === count - 1;
  const panelNav = p.querySelector('.panel-nav');
  panelNav.style.visibility = count > 1 ? '' : 'hidden';
  toggleTrashBtn(panelNav, ui.activeId, count, newIndex, s?.locked);
  toggleAddBtn(p.querySelector('.panel-footer-right'), count);
  updateUseBtn(p.querySelector('.use-btn'), isUsed);
  p._syncTags?.();
  const wrap       = p.querySelector('.panel-content-wrap');
  const oldContent = wrap.querySelector('.panel-content');
  const newContent = document.createElement('div');
  newContent.className        = 'panel-content';
  newContent.style.transition = 'none';
  newContent.style.transform  = cssTranslate('X', slideDir * 100);
  p._setUpdateOptions?.(initDivSubPanel(newContent, s));
  wrap.appendChild(newContent);
  animateSlideTransition(newContent, oldContent, 'X', slideDir, () => { ui.isAnimating = false; });
};
function deleteSubPanel() {
  if (ui.isAnimating || !ui.activeId) return;
  if (!confirm('Delete this divinity panel? This cannot be undone.')) return;
  const data = getData(ui.activeId);
  const idx  = data.current;
  data.panels.splice(idx, 1);
  data.count--;
  for (const size of CFG.sizes) {
    const u = data.usedBySize[size];
    if (u === idx)    data.usedBySize[size] = null;
    else if (u > idx) data.usedBySize[size]--;
  }
  saveDivinityState();
  updateDivCircle(ui.activeId);
  navigateTo(idx === 0 ? 0 : idx - 1, idx === 0 ? 1 : -1);
};
function makeDelBtn() {
  const btn = document.createElement('button');
  btn.className = 'nav-btn del-btn';
  btn.innerHTML = ICONS.trash;
  btn.addEventListener('click', deleteSubPanel);
  return btn;
};
function toggleTrashBtn(panelNav, id, count, idx, locked) {
  toggleConditionalBtn(panelNav, '.del-btn', canShowTrash(id, count, idx, locked), makeDelBtn);
};
function swapPanel(incoming, slideDir) {
  const outgoing = ui.activePanel;
  sliderContainer.appendChild(incoming);
  ui.activePanel = incoming;
  animateSlide(incoming, outgoing, 'X', slideDir);
};
function closePanel(onDone) {
  if (ui.isAnimating || !ui.activePanel) return;
  ui.isAnimating = true;
  const panel = ui.activePanel;
  const dir   = ui.activeDir;
  panel.style.transform = cssTranslate(dir.axis, dir.sign * 100);
  grid.style.transform  = cssTranslate(dir.axis, 0);
  panel.addEventListener('transitionend', () => {
    panel.remove();
    sliderContainer.style.height = '';
    ui.activePanel = null;
    ui.activeDir   = null;
    if (ui.activeId) { document.getElementById(ui.activeId).checked = false; ui.activeId = null; }
    ui.isAnimating = false;
    onDone?.();
  }, { once: true });
};
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
};
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
      <button class="close-btn">${ICONS.close}</button>
    </div>
    <div class="panel-header">
      <span class="panel-name">${NODE_NAMES[id]}</span>
      <div class="panel-node-nav">
        <button class="nav-btn node-prev-btn" ${nodeIdx === 0 ? 'disabled' : ''}>${ICONS.chevLeft}</button>
        <button class="nav-btn node-next-btn" ${nodeIdx === nodeOrder.length - 1 ? 'disabled' : ''}>${ICONS.chevRight}</button>
      </div>
    </div>
    <div class="panel-divider"></div>
    <div class="panel-content-wrap"><div class="panel-content"></div></div>
    <div class="panel-footer">
      <div class="panel-nav"${count > 1 ? '' : ' style="visibility:hidden"'}>
        <button class="nav-btn prev-btn" ${idx === 0 ? 'disabled' : ''}>${ICONS.chevLeft}</button>
        <span class="panel-nav-count">${idx + 1}/${count}</span>
        <button class="nav-btn next-btn" ${idx === count - 1 ? 'disabled' : ''}>${ICONS.chevRight}</button>
      </div>
      <div class="panel-footer-right">
        <button class="use-btn${isUsed ? ' active' : ''}">
          <svg style="${isUsed ? '' : 'display:none'}" viewBox="0 0 12 12" fill="none">${ICONS.person}</svg>
          <span>${isUsed ? 'In Use' : 'Use'}</span>
        </button>
        ${count < CFG.maxPanels ? '<button class="add-btn">+ Add Div</button>' : ''}
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
    saveDivinityState();
  });
  if (nodeIdx > 0) panel.querySelector('.node-prev-btn').addEventListener('click', () => navigateNode(-1));
  if (nodeIdx < nodeOrder.length - 1) panel.querySelector('.node-next-btn').addEventListener('click', () => navigateNode(1));
  panel.querySelector('.prev-btn').addEventListener('click', () => { if (data.current > 0) navigateTo(data.current - 1, -1); });
  panel.querySelector('.next-btn').addEventListener('click', () => { if (data.current < data.count - 1) navigateTo(data.current + 1, 1); });
  if (count < CFG.maxPanels) panel.querySelector('.add-btn').addEventListener('click', addSubPanel);
  if (canShowTrash(id, count, idx, s.locked)) panelNav.appendChild(makeDelBtn());
  const useBtn = panel.querySelector('.use-btn');
  useBtn.addEventListener('click', () => {
    const cur = data.current;
    setUsed(id, getUsed(id) === cur ? null : cur);
    saveDivinityState();
    updateDivCircle(id);
    const nowUsed = getUsed(id) === cur;
    updateUseBtn(useBtn, nowUsed);
    toggleTrashBtn(panelNav, id, data.count, cur, data.panels[cur]?.locked);
  });
  let currentUpdateOptions = initDivSubPanel(panel.querySelector('.panel-content'), s);
  panel._setUpdateOptions  = fn => { currentUpdateOptions = fn; };
  panel._updateOptions     = () => currentUpdateOptions?.();
  panel._syncTags = initDivTags(panel, data, () => {
    currentUpdateOptions?.();
    if (getUsed(id) === data.current) updateDivCircle(id);
  });
  return panel;
};
function openPanel(cb) {
  const dir    = DIR_MAP[cb.id];
  const data   = getData(cb.id);
  data.current = getUsed(cb.id) ?? 0;
  ui.activeId  = cb.id;
  ui.activeDir = dir;
  sliderContainer.style.height = grid.offsetHeight + 'px';
  const panel = makePanelEl(cb.id);
  panel.style.transition = 'none';
  panel.style.transform  = cssTranslate(dir.axis, dir.sign * 100);
  sliderContainer.appendChild(panel);
  ui.activePanel = panel;
  ui.isAnimating = true;
  rAF2(() => {
    panel.style.transition = '';
    panel.style.transform  = cssTranslate(dir.axis, 0);
    grid.style.transform   = cssTranslate(dir.axis, -dir.sign * 100);
  });
  panel.addEventListener('transitionend', () => { ui.isAnimating = false; }, { once: true });
};
function getDivSummary() {
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
function renderSummaryModal() {
  const totals = getDivSummary();
  renderSummaryList(
    document.getElementById('summaryList'),
    STAT_OPTIONS.filter(o => totals[o.key] !== undefined).map(o => ({ lbl: o.label, val: fmtRawPct(totals[o.key]) }))
  );
};
function applyDeltas(state, deltas, sign) {
  const result = { ...state };
  for (const { field, val } of deltas)
    result[field] = (result[field] || 0) + sign * val;
  return result;
};
function applyDivinityStats(state, panel, ctx, sign) {
  const quality = getQuality(panel);
  let result    = { ...state };
  for (const key of panel.divinity) {
    if (!key) continue;
    const meta = DIVINITY_KEY_MAP[key];
    if (!meta) continue;
    if (meta.cond && !meta.cond(ctx)) continue;
    const val = getStatVal(key, quality);
    if (val === null) continue;
    result[meta.field] = (result[meta.field] || 0) + sign * val * 100;
  }
  return result;
};
function applyDivinityPanel(state, panel, nodeId, ctx, sign = 1) {
  let result = applyDivinityStats(state, panel, ctx, sign);
  const special = SPECIAL_NODES[nodeId];
  if (special) {
    const delta = special.calcValue(ctx, panel);
    result = { ...result, [special.field]: (result[special.field] || 0) + sign * delta };
  }
  return result;
};
function applyDivinity(state, selection, ctx, sign = 1) {
  return selection.reduce((s, { id, panelIndex }) => {
    const panel = getData(id).panels[panelIndex];
    return panel ? applyDivinityPanel(s, panel, id, ctx, sign) : s;
  }, { ...state });
};
function isPanelActive(id, p) {
  return p.divinity.some(Boolean) ||
    (!!SPECIAL_NODES[id] && p.gold && p.lightning && p.divinity.length === 1);
};
function isNodeActive(id) {
  const d = getData(id);
  return d.panels.slice(0, d.count).some(p => isPanelActive(id, p)) ||
    (!!SPECIAL_NODES[id] && getUsed(id) != null);
};

// cards & buff 
function getCardStatDelta(name, ctx) {
  const card = getCard(name);
  if (!card) return null;
  const cacheKey = `${name}|${ctx.atkType}|${ctx.wElem}|${ctx.tSize}|${ctx.tRace}|${ctx.tAttr}`;
  const cached = cardDeltaCache.get(cacheKey);
  if (cached) return cached;
  const delta = Object.fromEntries(NUM_FIELDS.map(f => [f, 0]));
  const skipStats = new Set(
    STAT_DEDUP_GROUPS.flatMap(group => {
      const present = group.filter(s => s in card.stats);
      return present.length > 1 ? present.slice(1) : [];
    })
  );
  for (const [statName, rawVal] of Object.entries(card.stats)) {
    if (skipStats.has(statName)) continue;
    const field = STAT_RESOLVERS[statName]?.(ctx);
    if (!field) continue;
    const value = parseStatPct(rawVal);
    if (value !== null) delta[field] += value;
  }
  const result = { delta, equip: card.equip };
  cardDeltaCache.set(cacheKey, result);
  return result;
};
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
};
function saveCardsState(section) {
  try {
    const prev           = readSection('cards');
    const equippedBySize = prev.equippedBySize ?? defaultSizeMap();
    const lockedBySize   = prev.lockedBySize   ?? defaultSizeMap();
    const unusedBySize   = prev.unusedBySize   ?? defaultSizeMap(() => []);
    equippedBySize[ui.activeSize] = readCardsEquipped(section);
    lockedBySize[ui.activeSize]   = readCardsLocked(section);
    unusedBySize[ui.activeSize]   = readCardsUnused(section);
    writeStore('cards', { equippedBySize, lockedBySize, unusedBySize, buffs: readCardsBuffs(section) });
  } catch {}
};
function loadCardsState(section) {
  try {
    const stored = readSection('cards');
    loadCardsSizeToDOM(section, stored, ui.activeSize);
    for (const { stat, val } of (stored.buffs || [])) addCardsBuffRow(section, stat, val);
  } catch {}
};
function loadCardsSizeToDOM(section, stored, size) {
  const equipped = (stored.equippedBySize || {})[size] || {};
  const locked   = (stored.lockedBySize   || {})[size] || {};
  const unused   = (stored.unusedBySize   || {})[size] || [];
  for (const input of section.querySelectorAll('.co-card-select')) {
    const val           = equipped[getSlotKey(input)] ?? '';
    input.value         = val;
    input.dataset.value = val;
    updateCardSelectQuality(input);
  }
  for (const btn of section.querySelectorAll('.co-lock-btn'))
    setLockState(btn, !!(locked[getSlotKey(btn)]));
  section.querySelector('#co-unused-list').innerHTML = '';
  for (const { name, qty } of unused) addCardsUnusedRow(section, name, qty);
};
function switchCardsSize(section) {
  try { loadCardsSizeToDOM(section, readSection('cards'), ui.activeSize); } catch {}
};
function addCardsBuffRow(section, stat = '', val = '') {
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
    onRemove: () => saveCardsState(section),
  });
};
function rebuildCardsBuffList() {
  const buffList = coSection.querySelector('#co-buff-list');
  if (!buffList) return;
  buffList.innerHTML = '';
  for (const { stat, val } of readCardsBuffs(coSection)) addCardsBuffRow(coSection, stat, val);
};
function addCardsUnusedRow(section, name = '', qty = '1') {
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
        input.value         = name;
        input.dataset.value = name;
        updateCardSearchQuality(input);
      }
      if (qty !== '1') row.querySelector('.co-unused-qty').value = qty;
    },
    onRemove: () => saveCardsState(section),
  });
  const input   = row.querySelector('.co-unused-name');
  const panel   = row.querySelector('.co-card-search-panel');
  let filtered  = [], highlightIdx = -1, debounce = null;

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
    if (idx >= 0 && items[idx]) { items[idx].classList.add('co-card-search-highlighted'); items[idx].scrollIntoView({ block: 'nearest' }); }
    highlightIdx = idx;
  }

  function openPanel() {
    filtered = allOptions;
    renderPanel(filtered);
    panel.classList.add('open');
  }

  function closePanel() {
    panel.classList.remove('open');
    input.value = input.dataset.value;
    updateCardSearchQuality(input);
  }

  function selectCard(n) {
    input.value         = n;
    input.dataset.value = n;
    panel.classList.remove('open');
    updateCardSearchQuality(input);
    saveCardsState(section);
  }

  input.addEventListener('click', () => {
    if (panel.classList.contains('open')) { closePanel(); return; }
    input.select();
    openPanel();
  });

  input.addEventListener('input', () => {
    input.dataset.value = '';
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.toLowerCase();
      filtered = q ? allOptions.filter(n => n.toLowerCase().includes(q)) : allOptions;
      renderPanel(filtered);
      panel.classList.add('open');
    }, 120);
  });

  input.addEventListener('keydown', e => {
    const items = panel.querySelectorAll('.co-card-search-item');
    if      (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(Math.min(highlightIdx + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight(Math.max(highlightIdx - 1, 0)); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (highlightIdx >= 0 && filtered[highlightIdx]) selectCard(filtered[highlightIdx]); }
    else if (e.key === 'Escape')    { closePanel(); input.blur(); }
  });

  input.addEventListener('blur', () => { setTimeout(closePanel, 150); });

  return row;
};
function updateCardSearchQuality(input) {
  input.classList.remove('card-q-white', 'card-q-blue', 'card-q-gold');
  const quality = input.dataset.value ? getCard(input.dataset.value)?.quality : null;
  if (quality) input.classList.add(`card-q-${quality}`);
};
function updateCardSelectQuality(sel) {
  sel.classList.remove('card-q-white', 'card-q-blue', 'card-q-gold');
  const quality = sel.value ? getCard(sel.value)?.quality : null;
  if (quality) sel.classList.add(`card-q-${quality}`);
};
function buildCardsHTML() {
  const equippedSlotsHTML = Object.entries(EQUIP_SLOTS)
    .map(([equip, { label, count }]) => buildEquipGroupHTML(equip, label, count))
    .join('');
  return `
    <div class="co-hd" role="button" tabindex="0" aria-expanded="false">
      <div class="co-hd-left"><span class="co-hd-title">Cards</span></div>
      <span class="co-chevron">▾</span>
    </div>
    <div class="co-body collapsed" id="co-body-inner">
      <div class="co-body-inner">
        <div class="co-block">
          <div class="co-block-title">Equipped Cards</div>
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
          <div class="co-block-title">Extra Buffs</div>
          <p class="co-block-desc">If there are exclusive effects (element enhance, damage bonus, etc.) from cards/equips, add them here. Make sure these haven't been included in the base inputs yet.<br /><br />Note that some effects are already included in your detailed stats (Nano Flying Blade, Acc Obs and Skeg 3*Set, One Punch Man Headgear, etc).<br /><br />It is highly recommended to add <span class="buff">Eternal Chaos (Bard/Dancer) or Glorious Command (GS)</span> bonus here.</p>
          <div id="co-buff-list" class="co-buff-list"></div>
          <div class="co-btn-group">
            <button class="co-action-btn blue"  id="co-add-buff"        type="button">+ Add Buff</button>
            <button class="co-action-btn muted" id="co-clear-all-buffs" type="button">Clear All</button>
          </div>
        </div>
      </div>
    </div>`;
};
function bindCardsEvents(section) {
  bindCoPanelToggle(section.querySelector('.co-hd'));
  const equippedSlots = section.querySelector('#co-equipped-slots');
  const unusedList    = section.querySelector('#co-unused-list');
  const buffList      = section.querySelector('#co-buff-list');
  const save          = () => saveCardsState(section);
  equippedSlots.addEventListener('click', e => {
    const btn = e.target.closest('.co-lock-btn');
    if (!btn) return;
    setLockState(btn, btn.dataset.locked !== 'true');
    save();
  });
  for (const input of equippedSlots.querySelectorAll('.co-card-select'))
    bindEquipSlotSearch(input, section);
  section.querySelector('#co-add-buff').addEventListener('click',   () => { addCardsBuffRow(section);   save(); });
  section.querySelector('#co-add-unused').addEventListener('click', () => { addCardsUnusedRow(section); save(); });
  section.querySelector('#co-unequip-all').addEventListener('click', () => {
    if (!confirm('Unequip all cards?\n\nAll equipped cards (including locked slots) will be moved to the unused pool and slots will be unlocked. This does not update your input stats, re-enter them manually if needed.')) return;
    const tally = {};
    section.querySelectorAll('.co-card-select').forEach(input => {
      const val = input.dataset.value;
      if (!val) return;
      tally[val] = (tally[val] || 0) + 1;
      input.value         = '';
      input.dataset.value = '';
      updateCardSelectQuality(input);
    });
    section.querySelectorAll('.co-lock-btn').forEach(btn => setLockState(btn, false));
    for (const [name, count] of Object.entries(tally)) {
      const existing = [...unusedList.querySelectorAll('.co-unused-name')].find(el => el.dataset.value === name);
      if (existing) {
        const qtySel = existing.closest('.co-unused-row').querySelector('.co-unused-qty');
        qtySel.value = Math.min(6, (parseInt(qtySel.value) || 0) + count);
      } else {
        addCardsUnusedRow(section, name, String(Math.min(6, count)));
      }
    }
    save();
  });
  section.querySelector('#co-dismantle-all').addEventListener('click', () => {
    if (!confirm('Dismantle all unused cards? This cannot be undone.')) return;
    unusedList.innerHTML = '';
    save();
  });
  section.querySelector('#co-clear-all-buffs').addEventListener('click', () => {
    if (!confirm('Remove all buffs?')) return;
    buffList.innerHTML = '';
    save();
  });
};
function rebuildWeaponSlots(section) {
  const wrap     = section.querySelector('#co-equipped-slots');
  const oldGroup = wrap.querySelector('[data-equip="weapon"]')?.closest('.co-equip-group') ?? wrap.firstElementChild;
  const count    = getWeaponSlotCount();
  const stored   = readSection('cards');
  const equipped = (stored.equippedBySize || {})[ui.activeSize] || {};
  const locked   = (stored.lockedBySize   || {})[ui.activeSize] || {};
  const tmp      = document.createElement('div');
  tmp.innerHTML  = buildEquipGroupHTML('weapon', EQUIP_SLOTS.weapon.label, count);
  const newGroup = tmp.firstElementChild;
  newGroup.querySelectorAll('.co-card-select').forEach(input => {
    const val           = equipped[`weapon_${input.dataset.slot}`] ?? '';
    input.value         = val;
    input.dataset.value = val;
    updateCardSelectQuality(input);
    bindEquipSlotSearch(input, section);
  });
  newGroup.querySelectorAll('.co-lock-btn').forEach(btn => {
    setLockState(btn, !!(locked[`weapon_${btn.dataset.slot}`]));
  });
  wrap.replaceChild(newGroup, oldGroup);
};
function getCardsEquipMap(names) {
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
function writeCardsToSlots(bestCards, section) {
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
      const val           = recCards[nameIdx++] || '';
      input.value         = val;
      input.dataset.value = val;
      updateCardSelectQuality(input);
    }
  }
  saveCardsState(section);
};

// stats 
function updateTargetLabels(key) {
  const data = DEFENSE_TABLE[key] ?? {};
  DOM.dmgSizeLabel.textContent = labelWithVal('DMG to Size', data.sizeMob);
  DOM.dmgRaceLabel.textContent = labelWithVal('DMG to Race', data.raceMob);
  DOM.dmgAttrLabel.textContent = labelWithVal('DMG to Attribute', data.attributeMob);
  DOM.tSize.innerHTML = `<option>${data.sizeMob      ?? '—'}</option>`;
  DOM.tRace.innerHTML = `<option>${data.raceMob      ?? '—'}</option>`;
  DOM.tAttr.innerHTML = `<option>${data.attributeMob ?? '—'}</option>`;
  DOM.tFinalDef.innerHTML = `<option>${data.def    ?? '—'}</option>`;
  DOM.tDmgRed.innerHTML = `<option>${data.dmgred ?? '—'}</option>`;
};
function updateActiveSize() {
  const sizeKey = { Small: 'small', Medium: 'medium', Large: 'large' }[DOM.tSize.value] ?? '';
  if (sizeKey === ui.activeSize) return;
  ui.activeSize = sizeKey || '';
  if (DOM.divSizeSelect) DOM.divSizeSelect.value = sizeKey;
  nodeOrder.forEach(updateDivCircle);
  if (coSection.querySelector('.co-card-select')) switchCardsSize(coSection);
};
function loadStatsState() {
  try {
    const stats = readSection('stats');
    if (!Object.keys(stats).length) return;
    if (stats.targetDef) { DOM.tDef.value = stats.targetDef; updateTargetLabels(stats.targetDef); updateActiveSize(); }
    if (stats.weapon)    { DOM.weapon.value = stats.weapon; if (coSection?.querySelector('.co-card-select')) rebuildWeaponSlots(coSection); }
    if (stats.wElem)     { DOM.wElem.value = stats.wElem; DOM.elemEnhanceLabel.textContent = getElemEnhLabel(); }
    const atkType = stats.atkType ?? 'pen';
    DOM.atkType.value    = atkType;
    DOM.penField.hidden  = atkType !== 'pen';
    DOM.critField.hidden = atkType === 'pen';
    for (const f of NUM_FIELDS) { if (stats[f]) DOM[f].value = stats[f]; }
  } catch {}
};
function loadStatsFromSnap(snap) {
  const f = snap.form;
  DOM.tDef.value    = f.targetDefSelect?.value     ?? '';
  DOM.weapon.value  = f.weaponSelect?.value        ?? '';
  DOM.wElem.value   = f.weaponElementSelect?.value ?? '';
  DOM.atkType.value = f.penCritSelect?.value       ?? 'pen';
  DOM.atkType.dispatchEvent(new Event('change'));
  for (const [el, key] of Object.entries(SNAP_FIELDS)) DOM[el].value = f[key] ?? '';
  DOM.elemEnhanceLabel.textContent = getElemEnhLabel();
  updateTargetLabels(DOM.tDef.value);
  updateActiveSize();
  saveStatsState();
};
function buildStatsState() {
  const tDefKey    = DOM.tDef.value || '';
  const target     = DEFENSE_TABLE[tDefKey] ?? {};
  const wElemVal   = DOM.wElem.value || '';
  const tAttrVal   = target.attributeMob ?? '';
  const partialCtx = { wElem: wElemVal, tAttr: tAttrVal };
  const specialVals = Object.fromEntries(
    Object.entries(SPECIAL_NODES).map(([id, spec]) => {
      const usedIdx = getUsed(id);
      const panel   = usedIdx != null ? getData(id).panels[usedIdx] : null;
      return [spec.field, panel ? spec.calcValue(partialCtx, panel) : 0];
    })
  );
  return {
    ...Object.fromEntries(NUM_FIELDS.map(k => [k, parseFloat(DOM[k].value) || 0])),
    atkType: DOM.atkType.value,
    weapon:  DOM.weapon.value || '',
    wElem:   wElemVal,
    tDefKey,
    tSize:   target.sizeMob  ?? '',
    tRace:   target.raceMob  ?? '',
    tAttr:   tAttrVal,
    ...specialVals,
  };
};
function writeStatsToForm(finalState, buffMap, companionAssignment) {
  const fmt = v => fmtPct(v).replace(/\.?0+$/, '');
  const net  = f => (finalState[f] ?? 0) - (buffMap[f] || 0);
  const atkType = DOM.atkType.value;
  if (atkType === 'pen') DOM.pen.value  = fmt(net('pen'));
  else                   DOM.crit.value = fmt(net('crit'));
  for (const f of ['dmg', 'elemEnh', 'sizeEnh', 'race', 'attr', 'dmgStack'])
    DOM[f].value = fmt(net(f));
  saveStatsState();
  setFormOpen(true);
};

// companion 
function buildCompanionNodesHTML(assignment, currentUsed) {
  const items = getCompanionItems?.() ?? [];
  if (!items.length) return '';
  const parts = [];
  for (let s = 0; s < CFG.companionSlots; s++) {
    const recIdx = assignment[s] ?? null;
    if (recIdx == null) continue;
    const item = items[recIdx];
    if (!item) continue;
    const quality = item.quality ?? '';
    const curIdx = currentUsed[s] ?? null;
    const isChanged = recIdx !== curIdx;
    const recName = item.name?.trim() || `Item ${recIdx + 1}`;
    parts.push(`<div class="co-companion-node${isChanged ? ' co-companion-changed' : ''}"
      data-slot="${s}" data-recidx="${recIdx}" data-curidx="${curIdx ?? ''}" data-changed="${isChanged}">
      <div class="co-companion-dot${quality ? ' quality-' + quality : ''}">
        <span>${s + 1}</span>
        ${isChanged ? ICONS.companionSwap : ''}
      </div>
      <span class="co-companion-lbl">${escHtml(recName)}</span>
    </div>`);
  }
  return parts.join('');
};
function openCompanionModal({ slotIdx, recIdx, curIdx, isChanged }) {
  const items    = getCompanionItems?.() ?? [];
  const recItem  = recIdx != null ? items[recIdx] : null;
  const curItem  = curIdx != null ? items[curIdx] : null;
  const recName  = recItem ? (recItem.name?.trim() || `Item ${recIdx + 1}`) : '—';
  const curName  = curItem ? (curItem.name?.trim() || `Item ${curIdx + 1}`) : null;
  const slotEl      = document.getElementById('coCompanionModalSlotName');
  const subtitleEl  = document.getElementById('coCompanionModalSubtitle');
  const contentEl   = document.getElementById('coCompanionModalContent');
  const backdrop    = DOM.coCompanionBackdrop;
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
  backdrop.classList.add('open');
};
function initCompanionSlider() {
  const sec    = document.getElementById('card-companion');
  const hd     = sec.querySelector('.co-hd');
  const slides = [...sec.querySelectorAll('.co-slide')];
  const label  = sec.querySelector('#companion-slide-label');
  bindCoPanelToggle(hd);
  initSlider(
    sec, slides, label, null,
    idx => companionOnSlotChange?.(idx),
    '#companion-prev',
    '#companion-next'
  );
};
function initCompanionItems() {
  const sec         = document.getElementById('card-companion');
  const itemRow     = document.getElementById('companion-items-row');
  const addBtn      = document.getElementById('companion-item-add-btn');
  const clearBtn    = document.getElementById('companion-item-clear-btn');
  const clearNode   = document.getElementById('companion-item-clear-node');
  const itemPanel   = document.getElementById('companion-item-panel');
  const qualityBtns = document.getElementById('companion-quality-btns');
  const sheetTitle  = document.getElementById('companion-sheet-title');
  const statsWrap   = document.getElementById('companion-sheet-stats');
  const closeBtn    = document.getElementById('companion-sheet-close');
  const qPurpleBtn  = document.getElementById('companion-q-purple');
  const qGoldBtn    = document.getElementById('companion-q-gold');
  const qStarBtn    = document.getElementById('companion-q-star');
  const useBtn      = document.getElementById('companion-use-btn');
  const removeBtn   = document.getElementById('companion-remove-btn');
  const editBtn     = document.getElementById('companion-sheet-edit-btn');
  const slides      = [...sec.querySelectorAll('.co-slide')];
  let items      = [];
  let usedBySlot = {};
  let activeIdx  = null;
  let currentSlot = 0;
  function readSlideInputs() {
    return slides.map(slide =>
      [...slide.querySelectorAll('.stats-input')].map(inp => inp.value)
    );
  }
  function saveCompanionState() {
    writeStore('companion', { items, usedBySlot, slideInputs: readSlideInputs() });
  }
  function loadCompanionState() {
    try {
      const stored = readSection('companion');
      if (!Object.keys(stored).length) return;
      if (Array.isArray(stored.items)) {
        items = stored.items.map(it => {
          const def = defaultCompanionItem();
          return {
            stats:   Array.isArray(it.stats) ? it.stats : def.stats,
            quality: it.quality ?? def.quality,
            name:    it.name    ?? def.name,
            star:    it.star    ?? def.star,
          };
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
    } catch {}
  }
  function calcCompanionItemFields(item, rawVals, rates) {
    const result   = {};
    const starMult = item.star ? 1.17 : 1;
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
    const rates  = COMPANION_RATES[item.quality];
    const inputs = slides[slotIdx]?.querySelectorAll('.stats-input');
    if (!rates || !inputs) return null;
    const rawVals = [...inputs].map(inp => parseFloat(inp.value) || 0);
    return calcCompanionItemFields(item, rawVals, rates);
  }
  function applyCompanionStats(state, slotMap, sign) {
    let result = { ...state };
    for (let s = 0; s < CFG.companionSlots; s++) {
      const fieldVals = resolveCompanionSlot(s, slotMap[s] ?? null);
      if (fieldVals) for (const [field, val] of Object.entries(fieldVals))
        result[field] = (result[field] || 0) + sign * val;
    }
    return result;
  }
  function calcCompanionSlotValues(slotIdx) {
    return resolveCompanionSlot(slotIdx, usedBySlot[slotIdx] ?? null) ?? {};
  }
  getCompanionBonuses = () => {
    const totals = {};
    for (let s = 0; s < CFG.companionSlots; s++) {
      const vals = calcCompanionSlotValues(s);
      for (const [field, val] of Object.entries(vals)) totals[field] = (totals[field] || 0) + val;
    }
    return totals;
  };
  getCompanionItems    = () => items;
  getCompanionUsed     = () => usedBySlot;
  applyCompanion       = (state, slotMap) => applyCompanionStats(state, slotMap,  1);
  stripCompanion       = (state, slotMap) => applyCompanionStats(state, slotMap, -1);
  writeCompanionAssign = assignment => {
    for (let s = 0; s < CFG.companionSlots; s++) usedBySlot[s] = null;
    for (const [s, idx] of Object.entries(assignment)) {
      if (idx != null) usedBySlot[Number(s)] = idx;
    }
    items.forEach((_, i) => updateCompanionCircle(i));
    for (let s = 0; s < CFG.companionSlots; s++) updateCompanionSlideValues(s);
    saveCompanionState();
  };
  const calcCompanionAssignMult = (assignment, baseState) => {
    const stripped = stripCompanion(baseState, usedBySlot);
    return calcMult(applyCompanion(stripped, assignment));
  };
  runCompanionOptimizer = baseState => {
    if (!items.length) return null;
    let bestMult   = -Infinity;
    let bestAssign = {};
    function backtrack(slotIdx, assign, usedItems) {
      if (slotIdx === CFG.companionSlots) {
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
    const improved = Object.keys(bestAssign).some(s => (bestAssign[s] ?? null) !== (currentUsed[s] ?? null));
    return { assignment: bestAssign, improved };
  };
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
      const lbl = COMPANION_FIELD_LABELS[field] || field;
      return `<div class="companion-slot-val-row">
        <span class="companion-slot-val-lbl">${lbl}</span>
        <span class="companion-slot-val-num">+${fmtPct(val)}%</span>
      </div>`;
    }).join('') + (starActive ? `<div class="companion-slot-val-row companion-slot-star-row"><span class="companion-slot-val-lbl companion-slot-star-lbl">${ICONS.star.repeat(4)}</span><span class="companion-slot-val-num companion-slot-val-num--star">×1.17</span></div>` : '');
  }
  const updateAllCompanionSlides = () => { for (let s = 0; s < CFG.companionSlots; s++) updateCompanionSlideValues(s); };
  slides.forEach((slide, si) => {
    slide.querySelectorAll('.stats-input').forEach(inp => {
      inp.addEventListener('input', () => { updateCompanionSlideValues(si); saveCompanionState(); });
    });
  });
  companionOnSlotChange = slotIdx => {
    currentSlot = slotIdx;
    if (activeIdx != null) updateCompanionUseBtn();
    items.forEach((_, i) => updateCompanionCircle(i));
  };
  const getCompanionItemSlot = itemIdx => {
    for (const [slot, itm] of Object.entries(usedBySlot)) {
      if (itm === itemIdx) return Number(slot);
    }
    return null;
  };
  const getCompanionItemName    = idx => items[idx]?.name?.trim() || `Item ${idx + 1}`;
  const getCompanionDotClasses  = (item, idx, usedSlot) => {
    const cls = ['companion-item-dot'];
    if (item.quality)      cls.push(`quality-${item.quality}`);
    if (usedSlot != null)  cls.push('is-used');
    if (idx === activeIdx) cls.push('is-active-panel');
    return cls.join(' ');
  };
  function makeCircleEl(idx) {
    const item     = items[idx];
    const usedSlot = getCompanionItemSlot(idx);
    const node = document.createElement('div');
    node.className   = `companion-item-node${item.stats.some(Boolean) ? ' has-stats' : ''}`;
    node.dataset.idx = idx;
    node.innerHTML   = `
      <div class="${getCompanionDotClasses(item, idx, usedSlot)}">${usedSlot != null ? String(usedSlot + 1) : ''}</div>
      <span class="companion-item-dot-lbl">${getCompanionItemName(idx)}</span>`;
    node.addEventListener('click', () => toggleCompanionSheet(idx));
    return node;
  }
  function renderCompanionCircles() {
    itemRow.querySelectorAll('.companion-item-node').forEach(el => el.remove());
    const addNode = itemRow.querySelector('.companion-item-add-node');
    items.forEach((_, idx) => itemRow.insertBefore(makeCircleEl(idx), addNode));
  }
  function updateCompanionCircle(idx) {
    if (idx == null || idx < 0 || idx >= items.length) return;
    const el = itemRow.querySelector(`.companion-item-node[data-idx="${idx}"]`);
    if (!el) return;
    const item     = items[idx];
    const usedSlot = getCompanionItemSlot(idx);
    el.classList.toggle('has-stats', item.stats.some(Boolean));
    const dot = el.querySelector('.companion-item-dot');
    dot.className   = getCompanionDotClasses(item, idx, usedSlot);
    dot.textContent = usedSlot != null ? String(usedSlot + 1) : '';
    const lbl = el.querySelector('.companion-item-dot-lbl');
    if (lbl) lbl.textContent = getCompanionItemName(idx);
  }
  function updateCompanionQualityBtns() {
    const item = activeIdx != null ? items[activeIdx] : null;
    const q    = item?.quality ?? null;
    qPurpleBtn.classList.toggle('active', q === 'purple');
    qGoldBtn.classList.toggle('active', q === 'gold');
    qStarBtn.classList.toggle('active', !!(item?.star));
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
  qPurpleBtn.addEventListener('click', () => setCompanionQuality('purple'));
  qGoldBtn.addEventListener('click',   () => setCompanionQuality('gold'));
  qStarBtn.addEventListener('click',   () => setCompanionStar());
  function updateCompanionUseBtn() {
    updateUseBtn(useBtn, activeIdx != null && usedBySlot[currentSlot] === activeIdx);
  }
  useBtn.addEventListener('click', () => {
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
  removeBtn.addEventListener('click', () => {
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
  function openCompanionSheet(idx) {
    activeIdx = idx;
    sheetTitle.textContent = getCompanionItemName(idx);
    updateCompanionQualityBtns();
    updateCompanionUseBtn();
    renderCompanionSheetStats();
    itemPanel.classList.add('open');
    qualityBtns.style.visibility = 'visible';
    items.forEach((_, i) => updateCompanionCircle(i));
  }
  function closeCompanionSheet() {
    itemPanel.classList.remove('open');
    qualityBtns.style.visibility = 'hidden';
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
    statsWrap.innerHTML = '';
    const item = items[activeIdx];
    for (let i = 0; i < CFG.maxCompanionStats; i++) {
      statsWrap.appendChild(makeCompanionStatRow(item.stats[i] ?? null, i));
    }
    updateCompanionSelects();
  }
  rerenderCompanionSheet = () => { if (activeIdx != null) renderCompanionSheetStats(); };
  function makeCompanionStatRow(selectedKey, index) {
    const rowEl = document.createElement('div');
    rowEl.className = 'companion-sheet-stat-row';
    const lbl = document.createElement('span');
    lbl.className   = 'stats-label';
    lbl.textContent = `Stat ${index + 1}`;
    const sel = document.createElement('select');
    sel.className = 'companion-sheet-select';
    sel.innerHTML = '<option value="">— Select —</option>' +
      COMPANION_STAT_OPTIONS.map(o => {
        const excl = isAtkExcluded(o.key) && o.key !== selectedKey;
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
  function updateCompanionSelects() {
    updateSelectsDisabled(statsWrap, '.companion-sheet-select', () => items[activeIdx].stats);
  }
  closeBtn.addEventListener('click', closeCompanionSheet);
  editBtn.addEventListener('click', () => {
    if (activeIdx == null) return;
    sheetTitle.style.display = 'none';
    editBtn.style.display    = 'none';
    const inp = document.createElement('input');
    inp.type      = 'text';
    inp.className = 'companion-sheet-title-input';
    inp.value     = getCompanionItemName(activeIdx);
    inp.maxLength = 24;
    sheetTitle.parentNode.insertBefore(inp, sheetTitle);
    inp.focus();
    inp.select();
    function commitCompanionNameEdit() {
      const val = inp.value.trim();
      items[activeIdx].name    = val || null;
      sheetTitle.textContent   = getCompanionItemName(activeIdx);
      sheetTitle.style.display = '';
      editBtn.style.display    = '';
      inp.remove();
      updateCompanionCircle(activeIdx);
      saveCompanionState();
    }
    inp.addEventListener('blur', commitCompanionNameEdit);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); inp.blur(); }
      if (e.key === 'Escape') { inp.value = ''; inp.blur(); }
    });
  });
  const addBtnLabel = addBtn.closest('.companion-item-add-node').querySelector('.companion-item-dot-lbl');
  function updateCompanionAddBtn() {
    const isMax             = items.length >= CFG.maxCompanion;
    addBtn.disabled         = isMax;
    addBtn.textContent      = isMax ? '' : '+';
    addBtnLabel.textContent = isMax ? 'Max' : 'Add';
  }
  clearBtn.innerHTML = ICONS.trash;
  function updateCompanionClearBtn() {
    clearNode.style.display = items.length > 0 ? '' : 'none';
  }
  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all companion items and upgrade progress?')) return;
    items = [];
    usedBySlot = {};
    for (let s = 0; s < CFG.companionSlots; s++) {
      if (slides[s]) slides[s].querySelectorAll('.stats-input').forEach(inp => { inp.value = ''; });
      updateCompanionSlideValues(s);
    }
    closeCompanionSheet();
    renderCompanionCircles();
    updateCompanionAddBtn();
    updateCompanionClearBtn();
    saveCompanionState();
  });
  addBtn.addEventListener('click', () => {
    if (items.length >= CFG.maxCompanion) return;
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
};


// enchantment
function readEnchantStateFromDOM() {
  enchantState.awakening = DOM.enchAwakeningSelect?.value || '';
  enchantState.slots     = [...DOM.enchLines.querySelectorAll('.ench-pair')].map(pair => {
    const sels = pair.querySelectorAll('select');
    return { enchant: sels[0]?.value || '', level: sels[1]?.value || '' };
  });
};
function loadEnchantState() {
  try {
    const stored           = readSection('enchantment');
    enchantState.awakening = stored.awakening || '';
    enchantState.slots     = stored.slots     || [];
    const rawPrefs = stored.prefs;
    if (Array.isArray(rawPrefs)) {
      enchantState.prefs = defaultEnchPrefs();
      enchantState.prefs.chip = rawPrefs;
    } else if (rawPrefs && typeof rawPrefs === 'object') {
      enchantState.prefs = {
        mode:   rawPrefs.mode   || 'chip',
        chip:   rawPrefs.chip   || [],
        custom: rawPrefs.custom || { awakening: '', slots: [] },
      };
    } else {
      enchantState.prefs = defaultEnchPrefs();
    }
    if (DOM.enchAwakeningSelect && enchantState.awakening) DOM.enchAwakeningSelect.value = enchantState.awakening;
    rebuildEnchantPairs();
  } catch {}
};
function getEnchantColForSlot(weapon, slotIndex) {
  if (weapon === 'Dagger')        return 'Dagger';
  if (ENCHANT_SIX_SLOT.has(weapon)) return slotIndex < 3 ? '1H' : 'Shield';
  return '2H';
};
function getEnchantSlotState() {
  const weapon  = DOM.weapon.value;
  const awkMult = getAwkMult();
  const allPairs = [...DOM.enchLines.querySelectorAll('.ench-pair')];
  return allPairs.map((pair, i) => {
    const sels  = pair.querySelectorAll('select');
    const key   = sels[0]?.value || '';
    const level = parseInt(sels[1]?.value) || 0;
    const col   = getEnchantColForSlot(weapon, i);
    return { key, level, col, slotIdx: i, awkMult };
  });
};
function makeEnchantEntry(key, level, col, awkMult) {
  const opt = ENCHANT_OPTIONS_MAP.get(key);
  if (!opt) return null;
  const val = getEnchantVal(key, level, col, awkMult);
  if (val == null) return null;
  return { key, field: opt.type, val, label: opt.label, type: opt.type };
};
function getEnchantCandidates(slotState) {
  const prefs = enchantState.prefs;
  if (prefs.mode === 'custom') {
    const customSlots = prefs.custom?.slots || [];
    const customAwk   = (() => { const v = parseInt(prefs.custom?.awakening) || 0; return v > 0 ? (1 + v * 0.1) : 1; })();
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
};
function getEnchantCurrentAssign(slotState) {
  return slotState.map(({ key, level, col, awkMult }) =>
    key && level ? makeEnchantEntry(key, level, col, awkMult) : null
  );
};
function updateEnchantTotal() {
  const lines = DOM.enchLines;
  if (!lines) return;
  const weapon  = DOM.weapon.value;
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
};
function writeEnchantToDOM(bestEnchantAssign) {
  if (!bestEnchantAssign?.length) return;
  const allPairs = [...DOM.enchLines.querySelectorAll('.ench-pair')];
  allPairs.forEach((pair, i) => {
    const slot    = bestEnchantAssign[i];
    if (!slot) return;
    const enchantSel = pair.querySelectorAll('select')[0];
    if (enchantSel && slot.key) enchantSel.value = slot.key;
  });
  enchantState.prefs.chip = [];
  readEnchantStateFromDOM();
  saveEnchantState();
  updateEnchantTotal();
};
function makeEnchantLabel(id, text) {
  const el = document.createElement('div');
  el.className = 'ench-section-title';
  el.id = id;
  el.textContent = text;
  return el;
};
function makeEnchantPairEl(savedEnchant, savedLevel) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="ench-pair">
    <div class="select-wrap"><select class="stats-select">${buildEnchantOptionsHTML(savedEnchant || '')}</select></div>
    <div class="select-wrap"><select class="stats-select">${ENCHANT_LEVEL_HTML}</select></div>
  </div>`;
  const pair = wrap.firstElementChild;
  const [enchantSel, lvlSel] = pair.querySelectorAll('select');
  if (savedEnchant)  enchantSel.value = savedEnchant;
  if (savedLevel) lvlSel.value  = savedLevel;
  return pair;
};
function rebuildEnchantPairs(force = false) {
  const lines = DOM.enchLines;
  if (!lines) return;
  const is1H   = ENCHANT_SIX_SLOT.has(DOM.weapon.value);
  const target = is1H ? 6 : 3;
  const pairs  = lines.querySelectorAll('.ench-pair');
  if (!force && pairs.length === target) {
    pairs.forEach(pair => {
      const enchantSel = pair.querySelectorAll('select')[0];
      if (!enchantSel) return;
      const cur = enchantSel.value;
      enchantSel.innerHTML = buildEnchantOptionsHTML(cur);
      enchantSel.value = cur;
    });
    updateEnchantTotal();
    return;
  }
  const saved  = enchantState.slots;
  lines.innerHTML = '';
  if (is1H) {
    lines.appendChild(makeEnchantLabel('enchLblMH', 'Main Hand'));
    for (let i = 0; i < 3; i++) lines.appendChild(makeEnchantPairEl(saved[i]?.enchant, saved[i]?.level));
    lines.appendChild(makeEnchantLabel('enchLblOH', 'Off Hand'));
    for (let i = 3; i < 6; i++) lines.appendChild(makeEnchantPairEl(saved[i]?.enchant, saved[i]?.level));
  } else {
    lines.appendChild(makeEnchantLabel('enchLbl2H', '2Handed Enchantment'));
    for (let i = 0; i < 3; i++) lines.appendChild(makeEnchantPairEl(saved[i]?.enchant, saved[i]?.level));
  }
  updateEnchantTotal();
};
function renderEnchantSettingsPanel() {
  const inner = DOM.enchSettingsInner;
  if (!inner) return;
  const is1H      = ENCHANT_SIX_SLOT.has(DOM.weapon.value);
  const slotCount = is1H ? 6 : 3;
  const prefs     = enchantState.prefs;
  const isCustom  = prefs.mode === 'custom';

  inner.innerHTML = '';

  const modeBtn = document.createElement('button');
  modeBtn.type        = 'button';
  modeBtn.className   = 'ench-mode-btn' + (isCustom ? ' active' : '');
  modeBtn.textContent = isCustom ? 'Back to Chip' : 'Switch to Custom';
  modeBtn.addEventListener('click', () => {
    const panel = DOM.enchSettingsPanel;
    panel.classList.remove('open');
    panel.addEventListener('transitionend', () => {
      enchantState.prefs.mode = enchantState.prefs.mode === 'custom' ? 'chip' : 'custom';
      saveEnchantState();
      setTimeout(() => {
        renderEnchantSettingsPanel();
        panel.classList.add('open');
      }, 120);
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

    const pairsWrap = document.createElement('div');
    pairsWrap.className = 'ench-lines';

    let awkSel;

    if (is1H) {
      pairsWrap.appendChild(makeEnchantLabel('customEnchLblMH', 'Main Hand'));
      for (let i = 0; i < 3; i++) {
        const cs = customSlots[i] || { enchant: '', level: '' };
        pairsWrap.appendChild(makeEnchantPairEl(cs.enchant, cs.level));
      }
      pairsWrap.appendChild(makeEnchantLabel('customEnchLblOH', 'Off Hand'));
      for (let i = 3; i < 6; i++) {
        const cs = customSlots[i] || { enchant: '', level: '' };
        pairsWrap.appendChild(makeEnchantPairEl(cs.enchant, cs.level));
      }
    } else {
      pairsWrap.appendChild(makeEnchantLabel('customEnchLbl2H', '2Handed Enchantment'));
      for (let i = 0; i < 3; i++) {
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
    const awkRow = document.createElement('div');
    awkRow.className = 'ench-awakening-row';
    const awkSelWrap = document.createElement('div');
    awkSelWrap.className = 'select-wrap';
    awkSel = document.createElement('select');
    awkSel.className = 'stats-select';
    awkSel.innerHTML = '<option value="" disabled selected>Select</option>' +
      Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
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
      saveEnchantState();
    };

    awkSel.addEventListener('change', saveCustom);
    pairsWrap.addEventListener('change', saveCustom);

  } else {
    const prevActiveTab = inner.querySelector('.ench-tab-btn.active');
    let activeTab = prevActiveTab ? parseInt(prevActiveTab.dataset.tab) : 0;
    if (activeTab >= slotCount) activeTab = 0;

    const tabLabels = is1H
      ? ['MH 1','MH 2','MH 3','OH 1','OH 2','OH 3']
      : ['Slot 1','Slot 2','Slot 3'];

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

    const allPairs     = [...DOM.enchLines.querySelectorAll('.ench-pair')];
    const enchExclType = getEnchantExcludedType();
    for (let i = 0; i < slotCount; i++) {
      const raw          = prefs.chip[i] || [];
      const checked      = new Set(raw.slice(0, CFG.maxEnchPrefs));
      const atMax        = checked.size >= CFG.maxEnchPrefs;
      const currentEnchant  = allPairs[i]?.querySelectorAll('select')[0]?.value || '';
      const panel = document.createElement('div');
      panel.className  = 'ench-tab-panel' + (i === activeTab ? ' active' : '');
      panel.dataset.tab = i;
      ENCHANT_OPTIONS.forEach(opt => {
        if (opt.value === currentEnchant) return;
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
        lbl.textContent = getEnchantOptLabel(opt);
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
      if (allCbs.filter(c => c.checked).length > CFG.maxEnchPrefs) cb.checked = false;
      const atMax = allCbs.filter(c => c.checked).length >= CFG.maxEnchPrefs;
      allCbs.forEach(c => {
        const isExcl  = ENCHANT_OPTIONS_MAP.get(c.value)?.type === getEnchantExcludedType();
        const disable = (atMax && !c.checked) || (isExcl && !c.checked);
        c.disabled = disable;
        c.closest('.ench-check-row').classList.toggle('ench-check-disabled', disable);
      });
      enchantState.prefs.chip = Array.from({ length: slotCount }, (_, s) =>
        [...inner.querySelectorAll(`input[type="checkbox"][data-slot="${s}"]`)]
          .filter(c => c.checked).map(c => c.value)
      );
      saveEnchantState();
    });
  }
};
function buildEnchantSectionHTML(assign, slotState, compareAssign = null) {
  const is1H         = ENCHANT_SIX_SLOT.has(DOM.weapon.value);
  let hasChanged     = false;
  const getEnchantRowLabel = entry => {
    const opt = entry ? ENCHANT_OPTIONS_MAP.get(entry.key) : null;
    return opt ? getEnchantOptLabel(opt) : (entry?.key ?? '-');
  };
  const buildEnchantRow = (entry, slotIdx, slot) => {
    const isChanged    = compareAssign != null && (entry?.key ?? null) !== (compareAssign[slotIdx]?.key ?? null);
    if (isChanged) hasChanged = true;
    const label        = getEnchantRowLabel(entry);
    const changedClass = isChanged ? ' co-ench-changed' : '';
    const num          = (slotIdx % 3) + 1;
    return `<div class="co-ench-row${changedClass}"><span class="co-ench-num">${num}</span><span class="co-ench-val">${label}</span><span class="co-ench-lvl">Lv.${slot.level}</span></div>`;
  };
  let bodyHTML;
  if (is1H) {
    const buildEnchantGroup = (start, end) => slotState.slice(start, end)
      .map((slot, j) => slot.level ? buildEnchantRow(assign[start + j], start + j, slot) : null)
      .filter(Boolean);
    const mhRows = buildEnchantGroup(0, 3);
    const ohRows = buildEnchantGroup(3, 6);
    if (!mhRows.length && !ohRows.length) bodyHTML = null;
    else bodyHTML = (mhRows.length ? `<div class="co-ench-group-hdr">Main-Hand</div>${mhRows.join('')}` : '')
                 + (ohRows.length ? `<div class="co-ench-group-hdr">Off-Hand</div>${ohRows.join('')}` : '');
  } else {
    const rows = slotState.map((slot, i) => slot.level ? buildEnchantRow(assign[i], i, slot) : null).filter(Boolean);
    bodyHTML = rows.length ? rows.join('') : null;
  }
  const title = compareAssign != null && !hasChanged ? 'Enchantment (No Change)' : 'Enchantment';
  return buildResSectionHTML(title, bodyHTML && `<div class="co-ench-result-list">${bodyHTML}</div>`, EMPTY_STATE_HTML);
};

// optimizer 
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
};
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
      const nextState = applyCards(currentState, combo, ctx);
      if (equipIdx === equipTypes.length - 1 && calcMult(nextState) <= bestMult) continue;
      for (const c of combo) cardsSoFar.push(c);
      recurse(equipIdx + 1, nextState);
      cardsSoFar.length -= combo.length;
    }
  })(0, baseState);
  if (!bestCards) return { topResults: [] };
  return { topResults: [{ cards: bestCards, mult: bestMult }] };
};
function runCardsGreedy(baseState, cardPool, slotCounts, equipTypes, ctx, combosPerEquip) {
  let runningState   = { ...baseState };
  const bestPerEquip = {};
  for (const equip of equipTypes) {
    const pool   = (cardPool[equip] || []).filter(c => c.qty > 0);
    const combos = combosPerEquip[equip];
    let bestMult  = -Infinity;
    let bestCombo = [];
    for (const combo of combos) {
      const m = calcMult(applyCards(runningState, combo, ctx));
      if (m > bestMult) { bestMult = m; bestCombo = combo; }
    }
    bestPerEquip[equip] = bestCombo;
    runningState = applyCards(runningState, bestCombo, ctx);
  }
  const allBest = Object.values(bestPerEquip).flat();
  return { topResults: [{ cards: allBest, mult: calcMult(applyCards(baseState, allBest, ctx)) }] };
};
function genCardCombos(cardPool, slotCounts) {
  const equipTypes     = Object.keys(SLOT_COUNTS).filter(e => (slotCounts[e] ?? 0) > 0);
  const combosPerEquip = {};
  let totalCombos      = 1;
  let overflowed       = false;
  for (const equip of equipTypes) {
    const pool = (cardPool[equip] || []).filter(c => c.qty > 0);
    combosPerEquip[equip] = genEquipCombinations(pool, slotCounts[equip] || 0);
    totalCombos *= combosPerEquip[equip].length;
    if (totalCombos > CFG.maxEvalLimit) { overflowed = true; break; }
  }
  return { equipTypes, combosPerEquip, totalCombos, overflowed };
};
function runCardsOptimizer(baseState, cardPool, slotCounts, ctx, currentMult, prebuilt) {
  const { equipTypes, combosPerEquip, totalCombos, overflowed } = prebuilt ?? genCardCombos(cardPool, slotCounts);
  return runWithStrategy(
    overflowed ? CFG.maxEvalLimit + 1 : totalCombos,
    () => runCardsExact(baseState, combosPerEquip, equipTypes, ctx, currentMult),
    () => runCardsGreedy(baseState, cardPool, slotCounts, equipTypes, ctx, combosPerEquip)
  );
};
function runDivinityOptimizer(cardState, ctx) {
  const activeNodes = nodeOrder.filter(id => nodeData[id] && isNodeActive(id));
  if (!activeNodes.length) return null;
  const pools = activeNodes.map(id => {
    const d       = getData(id);
    const usedIdx = getUsed(id);
    if (usedIdx != null && d.panels[usedIdx]?.locked)
      return { id, entries: [{ panel: d.panels[usedIdx], idx: usedIdx }] };
    return { id, entries: d.panels.slice(0, d.count).map((panel, i) => ({ panel, idx: i })) };
  });
  const base        = { ...cardState, ...Object.fromEntries(Object.values(SPECIAL_NODES).map(s => [s.field, 0])) };
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
          recurse(poolIdx + 1, sel, applyDivinityPanel(state, panel, id, ctx));
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
          const m = calcMult(applyDivinityPanel(running, panel, id, ctx));
          if (m > localBest) { localBest = m; localIdx = idx; localPanel = panel; }
        }
        bestSelection.push({ id, panelIndex: localIdx });
        running = applyDivinityPanel(running, localPanel, id, ctx);
      }
      bestMult = calcMult(applyDivinity(base, bestSelection, ctx));
    }
  );
  return {
    bestSelection: bestSelection ?? activeNodes.map(id => ({ id, panelIndex: getUsed(id) ?? 0 })),
    bestMult,
  };
};
function applyEnchantStats(state, assignment, sign) {
  if (!assignment?.length) return state;
  const deltas = assignment.filter(s => s?.field).map(s => ({ field: s.field, val: s.val }));
  return applyDeltas(state, deltas, sign);
};
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
};
function runCoordinateDescent(pureBase, lockedBaseState, cardPool, slotCounts, allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx, prebuilt, enchantCandidates, currentEnchantAssign) {
  const validCards          = cards => cards.filter(n => n && n !== '—');
  const applyCompanionIfSet = (state, assign) =>
    (assign && applyCompanion) ? applyCompanion(state, assign) : state;
  const calcMultWithAll = (combinedState, companionAssign, enchantAssign) =>
    calcMult(applyEnchant(applyCompanionIfSet(combinedState, companionAssign), enchantAssign));

  const DIMS = ['card', 'divinity', 'companion', 'enchant'];

  const runOnce = (startCards, startDivSelection, startEnchantAssign, anchorOrder) => {
    let cards           = startCards;
    let divSelection    = startDivSelection;
    let companionAssign = null;
    let enchantAssign   = startEnchantAssign;
    const initBaseWithCards    = applyCards(pureBase, validCards(cards), ctx);
    const initBaseWithDivinity = applyDivinity(initBaseWithCards, divSelection, ctx);
    let mult            = calcMultWithAll(initBaseWithDivinity, null, enchantAssign);
    const deltas = { card: 0, divinity: 0, companion: 0, enchant: 0 };

    for (let iter = 0; iter < 4; iter++) {
      const prevMult = mult;
      const order = iter === 0
        ? anchorOrder
        : [...DIMS].sort((a, b) => deltas[b] - deltas[a]);

      for (const dim of order) {
        const before = mult;
        if (dim === 'card') {
          const baseWithCards    = applyCards(pureBase, validCards(cards), ctx);
          const baseWithDivinity = applyDivinity(lockedBaseState, divSelection, ctx);
          const cardBaseMult     = (companionAssign && applyCompanion)
            ? calcMult(applyDivinity(baseWithCards, divSelection, ctx))
            : mult;
          const cardResult       = runCardsOptimizer(baseWithDivinity, cardPool, slotCounts, ctx, cardBaseMult, prebuilt);
          if (cardResult.topResults.length) {
            const newCards         = [...allLockedNames, ...cardResult.topResults[0].cards];
            const newBaseWithCards = applyCards(pureBase, validCards(newCards), ctx);
            const newMult          = calcMultWithAll(applyDivinity(newBaseWithCards, divSelection, ctx), companionAssign, enchantAssign);
            if (newMult > mult) { cards = newCards; mult = newMult; }
          }
        } else if (dim === 'divinity' && activeNodes.length) {
          const baseWithCards = applyCards(pureBase, validCards(cards), ctx);
          const divResult     = runDivinityOptimizer(baseWithCards, ctx);
          if (divResult) {
            const newMult = calcMultWithAll(applyDivinity(baseWithCards, divResult.bestSelection, ctx), companionAssign, enchantAssign);
            if (newMult > mult) { divSelection = divResult.bestSelection; mult = newMult; }
          }
        } else if (dim === 'companion' && runCompanionOptimizer) {
          const baseWithCards    = applyCards(pureBase, validCards(cards), ctx);
          const baseWithDivinity = applyDivinity(baseWithCards, divSelection, ctx);
          const compResult       = runCompanionOptimizer(baseWithDivinity);
          if (compResult) {
            const newMult = calcMultWithAll(baseWithDivinity, compResult.assignment, enchantAssign);
            if (newMult > mult) { companionAssign = compResult.assignment; mult = newMult; }
          }
        } else if (dim === 'enchant' && enchantCandidates?.length) {
          const baseWithCards     = applyCards(pureBase, validCards(cards), ctx);
          const baseWithDivinity  = applyDivinity(baseWithCards, divSelection, ctx);
          const baseWithCompanion = applyCompanionIfSet(baseWithDivinity, companionAssign);
          const newEnchantAssign          = runEnchantOptimizer(baseWithCompanion, enchantCandidates, enchantAssign);
          if (newEnchantAssign) {
            const newMult = calcMult(applyEnchant(baseWithCompanion, newEnchantAssign));
            if (newMult > mult) { enchantAssign = newEnchantAssign; mult = newMult; }
          }
        }
        deltas[dim] = mult - before;
      }
      if (mult - prevMult < 1e-9) break;
    }
    return { bestCards: cards, bestDivSelection: divSelection, bestMult: mult, bestCompanionAssign: companionAssign, bestEnchantAssign: enchantAssign };
  };

  const coldStartCards = (() => {
    const result = runCardsOptimizer(applyDivinity(lockedBaseState, currentDivSelection, ctx), cardPool, slotCounts, ctx, -Infinity, prebuilt);
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

  let best = { bestCards: [...allLockedNames, ...nonLockedEquipped], bestDivSelection: currentDivSelection.map(s => ({ ...s })), bestMult: currentMult, bestCompanionAssign: null, bestEnchantAssign: currentEnchantAssign ? [...currentEnchantAssign] : [] };
  for (const { cards, divSelection, enchantAssign, anchorOrder } of starts) {
    const result = runOnce(cards, divSelection, enchantAssign, anchorOrder);
    if (result.bestMult > best.bestMult) best = result;
  }
  return best;
};
function runAndRender(section, calcState, ctx) {
  cardDeltaCache.clear();
  const resultEl = DOM.resultCard;
  const equippedNames  = [...section.querySelectorAll('.co-card-select')].map(input => input.dataset.value || '');
  const slotCounts = { ...SLOT_COUNTS, weapon: getWeaponSlotCount() };
  const lockedCards    = {};
  const lockedSlotKeys = new Set();
  for (const btn of section.querySelectorAll('.co-lock-btn')) {
    if (btn.dataset.locked !== 'true') continue;
    const { equip, slot } = btn.dataset;
    lockedSlotKeys.add(getSlotKey(btn));
    const cardName = section.querySelector(`.co-card-select[data-equip="${equip}"][data-slot="${slot}"]`)?.dataset.value || '';
    if (cardName) (lockedCards[equip] ??= []).push(cardName);
  }
  const allLockedNames = Object.values(lockedCards).flat();
  for (const [equip, cards] of Object.entries(lockedCards))
    slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards.length);
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
    const slot = (poolMap[card.equip] ??= {}); slot[name] = (slot[name] || 0) + count;
  };
  for (const name of equippedNames) if (name) addToPool(name, 1);
  for (const [name, qty] of Object.entries(unusedMap)) addToPool(name, qty);
  const cardPool = Object.fromEntries(Object.entries(poolMap).map(([e, m]) => [e, Object.entries(m).map(([name, qty]) => ({ name, qty }))]));
  const lockedCopiesUsed = countBy(allLockedNames);
  for (const equip of Object.keys(cardPool))
    cardPool[equip] = cardPool[equip].map(({ name, qty }) => ({ name, qty: Math.max(0, qty - (lockedCopiesUsed[name] || 0)) })).filter(c => c.qty > 0);
  const buffMap = {};
  for (const row of section.querySelectorAll('.co-buff-row')) {
    const field = row.querySelector('.co-buff-stat').value;
    const val   = parseFloat(row.querySelector('.co-buff-val').value) || 0;
    if (field && val !== 0) buffMap[field] = (buffMap[field] || 0) + val;
  }
  const nonLockedEquipped = [...section.querySelectorAll('.co-card-select')]
    .filter(input => !lockedSlotKeys.has(getSlotKey(input)) && input.dataset.value)
    .map(input => input.dataset.value);
  const prebuiltCombos = genCardCombos(cardPool, slotCounts);
  try {
    const baseState = stripCards(calcState, filterValidCards(equippedNames), ctx);
    for (const [field, val] of Object.entries(buffMap)) if (field in baseState) baseState[field] += val;
    const enchantSlotState     = getEnchantSlotState();
    const enchantCandidates    = getEnchantCandidates(enchantSlotState);
    const currentEnchantAssign = getEnchantCurrentAssign(enchantSlotState);
    const currentDivSelection  = nodeOrder.filter(id => nodeData[id] && getUsed(id) != null).map(id => ({ id, panelIndex: getUsed(id) }));
    const currentCompanionUsed = getCompanionUsed?.() ?? {};
    const divCombos = nodeOrder
      .filter(id => nodeData[id] && isNodeActive(id))
      .reduce((acc, id) => {
        const d = getData(id), usedIdx = getUsed(id);
        return acc * (usedIdx != null && d.panels[usedIdx]?.locked ? 1 : d.count);
      }, 1);
    const companionItems  = getCompanionItems?.() ?? [];
    const companionCombos = Array.from({ length: CFG.companionSlots }, (_, i) => Math.max(1, companionItems.length - i + 1)).reduce((a, b) => a * b, 1);
    const enchantCombos   = enchantCandidates.reduce((acc, c) => acc * (c.length + 1), 1);
    const cardCombos      = prebuiltCombos.overflowed ? CFG.maxEvalLimit + 1 : prebuiltCombos.totalCombos;
    const totalCombos     = cardCombos * divCombos * companionCombos * enchantCombos;
    const overflowed      = prebuiltCombos.overflowed || totalCombos > CFG.maxEvalLimit;
    const tDefLabel       = ctx.tDefKey || 'target';
    const comboLabel      = overflowed ? `${CFG.maxEvalLimit.toLocaleString()}+` : totalCombos.toLocaleString();
    const pureBase = stripEnchant(
      stripCompanion
        ? stripCompanion(stripCurrentDivinity(baseState, ctx), currentCompanionUsed)
        : stripCurrentDivinity(baseState, ctx),
      currentEnchantAssign
    );
    const lockedBaseState          = applyCards(pureBase, allLockedNames, ctx);
    const currentBaseWithCards     = applyCards(lockedBaseState, nonLockedEquipped, ctx);
    const currentBaseWithDivinity  = applyDivinity(currentBaseWithCards, currentDivSelection, ctx);
    const currentBaseWithCompanion = applyCompanion ? applyCompanion(currentBaseWithDivinity, currentCompanionUsed) : currentBaseWithDivinity;
    const currentMult              = calcMult(applyEnchant(currentBaseWithCompanion, currentEnchantAssign));
    const activeNodes = nodeOrder.filter(id => nodeData[id] && isNodeActive(id));
    const { bestCards, bestDivSelection, bestMult, bestCompanionAssign, bestEnchantAssign } = runCoordinateDescent(
      pureBase, lockedBaseState, cardPool, slotCounts,
      allLockedNames, nonLockedEquipped, activeNodes, currentDivSelection, currentMult, ctx,
      prebuiltCombos, enchantCandidates, currentEnchantAssign
    );
    const bestStateWithCards    = applyCards(pureBase, filterValidCards(bestCards), ctx);
    const bestStateWithDivinity = applyDivinity(bestStateWithCards, bestDivSelection, ctx);
    const companionResult = bestCompanionAssign != null
      ? { assignment: bestCompanionAssign, improved: true }
      : (runCompanionOptimizer?.(bestStateWithDivinity) ?? null);
    const divinityResult = activeNodes.length ? { bestSelection: bestDivSelection, bestMult } : null;
    resultEl.innerHTML = buildLoadingHTML('qqq');
    setTimeout(() => {
      renderResults(resultEl, [{ cards: bestCards, mult: bestMult }], pureBase, currentMult, lockedCards, equippedNames, ctx, divinityResult, currentDivSelection, buffMap, companionResult, bestEnchantAssign, currentEnchantAssign, enchantSlotState);
      resultEl.classList.remove('co-result-enter');
      void resultEl.offsetWidth;
      resultEl.classList.add('co-result-enter');
    }, LOADER_TIMING.qqq);
  } catch (err) {
    resultEl.innerHTML = `<div class="co-error">Error: ${escHtml(err.message)}</div>`;
  }
};

// build result 
function buildCardsBreakdownHTML(equipMap, lockedMap = {}, beforeEquipMap = null) {
  return Object.entries(equipMap).map(([equip, cards]) => {
    const lockedInEquip = lockedMap[equip]       || {};
    const beforeInEquip = beforeEquipMap?.[equip] || {};
    const chipsHTML = Object.entries(cards).map(([n, q]) => {
      const numLocked = Math.min(lockedInEquip[n] || 0, q);
      const numFree   = q - numLocked;
      const qClass    = ` card-q-${getCard(n)?.quality || 'white'}`;
      const parts     = [];
      if (numLocked > 0) {
        parts.push(`<span class="co-chip co-chip--locked${qClass}"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">${ICONS.lockClosed}</svg>${escHtml(n)}${numLocked > 1 ? `<span class="co-chip-qty"> ×${numLocked}</span>` : ''}</span>`);
      }
      if (numFree > 0) {
        const freeCurrent = Math.max(0, (beforeInEquip[n] || 0) - (lockedInEquip[n] || 0));
        const swapIcon    = beforeEquipMap != null && numFree > freeCurrent ? ICONS.horizSwap : '';
        parts.push(`<span class="co-chip${qClass}">${swapIcon}${escHtml(n)}${numFree > 1 ? `<span class="co-chip-qty"> ×${numFree}</span>` : ''}</span>`);
      }
      return parts.join('');
    }).join('');
    return `<div class="co-res-equip"><span class="co-res-equip-lbl">${EQUIP_LABELS[equip] ?? equip}</span><span class="co-res-cards">${chipsHTML}</span></div>`;
  }).join('') || EMPTY_STATE_HTML;
};
function buildStatsGridHTML(state, compareState, atkType, showUseSyncBtn = false, buffMap = {}) {
  const atkField = atkType === 'crit' ? { field: 'crit', label: STAT_LABELS.crit } : { field: 'pen', label: STAT_LABELS.pen };
  const labels   = [
    atkField,
    ...getBaseStatLabels().map(item =>
      item.field === 'dmgStack' && (state.reaperValue || 0) > 0 ? { ...item, isSpear: true } : item
    ),
    ...((state.spearValue || 0) > 0 ? [{ field: 'spearValue', label: 'DMG to MVP/MINI, BOSS, and Normal Monsters', isSpear: true }] : []),
  ];
  const titleHTML = showUseSyncBtn
    ? `<div class="co-res-section-title-row"><div class="co-res-section-title">Final Stats</div><button class="co-use-sync-btn" id="coUseSyncBtn">${ICONS.sync}Use &amp; Sync</button></div>`
    : `<div class="co-res-section-title">Final Stats</div>`;
  const gridHTML = `<div class="co-final-stats-grid">${
    labels.map(({ field, label, isSpear }) => {
      const val   = state[field] ?? 0;
      const diff  = compareState != null ? val - (compareState[field] ?? 0) : 0;
      const arrow = diff > 0 ? ICONS.arrowUp : diff < 0 ? ICONS.arrowDown : '';
      return `<div class="co-final-stat-row${isSpear ? ' co-final-stat-row--spear' : ''}">
        <span class="co-final-stat-lbl">${isSpear ? `${ICONS.flash}<span class="co-stat-lbl-text">${label}</span>` : label}</span>
        <span class="co-final-stat-val">${fmtNum(val)}%${arrow}</span>
      </div>`;
    }).join('')
  }</div>`;
  const buffEntries = Object.entries(buffMap).filter(([, v]) => v !== 0);
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
};
function buildDivStatRowsHTML(panel) {
  const quality = getQuality(panel);
  return panel.divinity.filter(k => k).map(k => {
    const opt = STAT_OPTIONS_MAP.get(k);
    const val = getStatVal(k, quality);
    if (!opt || val === null) return '';
    return `<div class="co-div-modal-stat-row">
      <span class="co-div-modal-stat-lbl">${opt.label}</span>
      <span class="co-div-modal-stat-val">+${fmtRawPct(val)}</span>
    </div>`;
  }).join('') || '<div class="co-div-modal-empty">No divinity stats configured.</div>';
};
function buildDivNodesHTML(selection, currentDivByNode = null) {
  if (!selection?.length) return '';
  return selection.map(({ id, panelIndex }) => {
    const panel = getData(id).panels[panelIndex];
    if (!panel) return '';
    const quality    = getQuality(panel);
    const isChanged  = currentDivByNode != null && panelIndex !== currentDivByNode[id];
    const circleClass = `co-div-circle quality-${quality}${panel.lightning ? ' has-lightning' : ''}`;
    return `<div class="co-div-node${isChanged ? ' co-div-changed' : ''}"
      data-nodeid="${id}" data-panelindex="${panelIndex}" data-changed="${isChanged}">
      <div class="${circleClass}">${ICONS.lightning}<span class="co-div-num">${panelIndex + 1}</span>${isChanged ? ICONS.vertSwap : ''}</div>
      <span class="co-div-lbl">${NODE_NAMES[id].split(' ')[0]}</span>
    </div>`;
  }).join('');
};
function openDivModal({ nodeId, panelIndex, isChanged }) {
  const data  = getData(nodeId);
  const panel = data.panels[panelIndex];
  if (!panel) return;
  divModalFlash.hidden = !(panel.lightning && panel.gold);
  divModal.classList.remove('quality-blue', 'quality-purple', 'quality-gold');
  divModal.classList.add(`quality-${getQuality(panel)}`);
  const curUsedIdx = getUsed(nodeId);
  const currentNum = curUsedIdx != null ? curUsedIdx + 1 : null;
  const showComparison = isChanged && curUsedIdx != null && data.panels[curUsedIdx];
  divModalName.textContent = isChanged && currentNum != null
    ? `${NODE_NAMES[nodeId]} #${currentNum} \u00bb #${panelIndex + 1}`
    : `${NODE_NAMES[nodeId]} #${panelIndex + 1}`;
  divModalStatsCur.hidden = !showComparison;
  divModalArrow.hidden    = !showComparison;
  if (showComparison) divModalStatsCur.innerHTML = buildDivStatRowsHTML(data.panels[curUsedIdx]);
  divModalStatsRec.innerHTML = buildDivStatRowsHTML(panel);
  divModalStatsRec.hidden    = false;
  divModalBackdrop.classList.add('open');
};
function writeBestDivinity(bestDivSelection) {
  for (const { id, panelIndex } of bestDivSelection) {
    setUsed(id, panelIndex);
    updateDivCircle(id);
  }
  saveDivinityState();
  if (!ui.activePanel || !ui.activeId) return;
  const useBtn = ui.activePanel.querySelector('.use-btn');
  if (useBtn) updateUseBtn(useBtn, getUsed(ui.activeId) === getData(ui.activeId).current);
};
function renderResults(container, topResults, pureBase, currentMult, lockedCards = {}, equippedNames = [], ctx = {}, divinityResult = null, currentDivSelection = [], buffMap = {}, companionResult = null, bestEnchantAssign = null, currentEnchantAssign = [], enchantSlotState = []) {
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
  const byEquip         = getCardsEquipMap(best.cards);
  const beforeByEquip   = getCardsEquipMap(equippedNames);
  const bestDivSelection       = divinityResult?.bestSelection ?? currentDivSelection;
  const finalBaseWithCards     = applyCards(pureBase, best.cards, ctx);
  const finalStateBase         = applyDivinity(finalBaseWithCards, bestDivSelection, ctx);
  const beforeBaseWithCards    = applyCards(pureBase, filterValidCards(equippedNames), ctx);
  const beforeStateBase        = applyDivinity(beforeBaseWithCards, currentDivSelection, ctx);
  const bestCompanionAssignmentForState = companionResult?.assignment ?? null;
  const currentCompanionUsedForState    = getCompanionUsed?.() ?? {};
  const finalStateWithComp  = (bestCompanionAssignmentForState && applyCompanion)
    ? applyCompanion(finalStateBase,  bestCompanionAssignmentForState)
    : finalStateBase;
  const beforeStateWithComp = applyCompanion
    ? applyCompanion(beforeStateBase, currentCompanionUsedForState)
    : beforeStateBase;
  const resolvedBestEnchantAssign  = bestEnchantAssign ?? currentEnchantAssign;
  const finalState  = applyEnchant(finalStateWithComp,  resolvedBestEnchantAssign);
  const beforeState = applyEnchant(beforeStateWithComp, currentEnchantAssign);
  const combinedBestMult = calcMult(finalState);
  const currentMultFinal = calcMult(beforeState);
  const pctRaw           = currentMultFinal > 0 ? ((combinedBestMult - currentMultFinal) / currentMultFinal * 100) : 0;
  const pct              = pctRaw.toFixed(2);
  const isGain           = combinedBestMult >= currentMultFinal;
  const displayFinal  = { ...finalState,  dmgStack: finalState.dmgStack  + (finalState.reaperValue  || 0) };
  const displayBefore = { ...beforeState, dmgStack: beforeState.dmgStack + (beforeState.reaperValue || 0) };
  container.classList.toggle('spear-active', (finalState.spearValue || 0) > 0);
  const currentDivByNode    = Object.fromEntries(currentDivSelection.map(s => [s.id, s.panelIndex]));
  const divBestHTML      = buildDivNodesHTML(divinityResult?.bestSelection ?? [], currentDivByNode);
  const divCurrentHTML   = buildDivNodesHTML(currentDivSelection);
  const bestDivNodesHTML    = buildResSectionHTML('Divinity (tap for details)', divBestHTML && `<div class="co-div-nodes">${divBestHTML}</div>`, EMPTY_STATE_HTML);
  const currentDivNodesHTML = buildResSectionHTML('Divinity', divCurrentHTML && `<div class="co-div-nodes">${divCurrentHTML}</div>`, EMPTY_STATE_HTML);
  const bestCompanionAssignment = companionResult?.assignment ?? currentCompanionUsedForState;
  const companionItems          = getCompanionItems?.() ?? [];
  const hasCompanionItems       = companionItems.length > 0;
  const compBestNodes    = hasCompanionItems ? buildCompanionNodesHTML(bestCompanionAssignment, currentCompanionUsedForState) : '';
  const compCurrentNodes = hasCompanionItems ? buildCompanionNodesHTML(currentCompanionUsedForState, currentCompanionUsedForState) : '';
  const companionNodesHTML   = buildResSectionHTML('Companion (tap for details)', compBestNodes && `<div class="co-companion-nodes">${compBestNodes}</div>`, EMPTY_STATE_HTML);
  const currentCompanionHTML = buildResSectionHTML('Companion', compCurrentNodes && `<div class="co-companion-nodes">${compCurrentNodes}</div>`, EMPTY_STATE_HTML);
  const resolvedEnchantSlotState = enchantState.prefs.mode === 'custom'
    ? enchantSlotState.map((slot, i) => ({ ...slot, level: parseInt(enchantState.prefs.custom?.slots?.[i]?.level) || slot.level }))
    : enchantSlotState;
  const enchantResultHTML  = buildEnchantSectionHTML(bestEnchantAssign ?? currentEnchantAssign, resolvedEnchantSlotState, bestEnchantAssign ? currentEnchantAssign : null);
  const currentEnchantHTML = buildEnchantSectionHTML(currentEnchantAssign, enchantSlotState);
  const noteHTML = `<div class="co-res-note">
  Crosscheck the result on the <u>next slide</u> with the input at the top of the page and make sure it matches your current detailed stats (in-game).<br/><br/>

  Keep in mind, this tool only supports some offensive stats. If your build has a lot of ATK%/Stat bonuses and the tool still suggests switching, <u>in-game results may vary</u><span class="spoiler">, could go higher or lower <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="12" height="12"></span><br/><br/>

  But, since this tool calculates base multipliers, it'll be more accurate as long as your other stats (ATK, Flat STAT/%, Haste, Max HP) don't drop too much after the switch, especially for jobs that rely on those<sup>[<a href='#' class='job-sim' data-lightbox-gallery='my-gallery' data-lightbox-trigger>1</a>],[<a href='#' class='job-sim' data-lightbox-gallery='new-version' data-lightbox-trigger>2</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer' data-lightbox-trigger>3</a>],[<a href='#' class='job-sim' data-lightbox-gallery='roxtimizer_2' data-lightbox-trigger>4</a>]</sup>.
</div>`;
  const sign     = pctRaw >= 0 ? '+' : '';
  const slideLabels = [ctx.tDefKey ? `Recommendation vs ${ctx.tDefKey}` : 'Recommendation', 'Before Optimization'];
  const slide1 = `
    ${buildResSectionHTML('Cards', `<div class="co-res-breakdown">${buildCardsBreakdownHTML(byEquip, lockedCountByEquip, beforeByEquip)}</div>`)}
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
    ${buildResSectionHTML('Cards', `<div class="co-res-breakdown">${buildCardsBreakdownHTML(beforeByEquip)}</div>`)}
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
          <a class="co-slider-footer-link" href="https://discord.gg/9j2WnTAnMu" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          RöX University
        </a>
        </div>
        <div class="co-slider-footer-nav">
          <button class="co-slide-nav-btn co-slide-nav-btn--prev" data-dir="-1" disabled>
            <svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Prev
          </button>
          <button class="co-slide-nav-btn co-slide-nav-btn--next" data-dir="1">
            Next
            <svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  const useSyncBtn = container.querySelector('#coUseSyncBtn');
  if (useSyncBtn) {
    useSyncBtn.addEventListener('click', () => {
      if (!confirm('This will update your equipped cards, divinities, companion, enchantment, and base stats. Ill keep reminding you, in-game results can be differ!')) return;
      try {
        const totalPool = countBy(filterValidCards(equippedNames));
        for (const row of coSection.querySelectorAll('.co-unused-row')) {
          const name = row.querySelector('.co-unused-name').dataset.value ?? '';
          const qty = parseInt(row.querySelector('.co-unused-qty').value) || 1;
          if (name) totalPool[name] = (totalPool[name] || 0) + qty;
        }
        const usedCount = countBy(filterValidCards(best.cards));
        const newUnused = {};
        for (const [name, total] of Object.entries(totalPool)) {
          const remaining = total - (usedCount[name] || 0);
          if (remaining > 0) newUnused[name] = remaining;
        }
        writeCardsToSlots(best.cards, coSection);
        writeBestDivinity(bestDivSelection);
        if (bestEnchantAssign) writeEnchantToDOM(bestEnchantAssign);
        if (companionResult?.assignment) writeCompanionAssign?.(companionResult.assignment);
        writeStatsToForm(finalState, buffMap, companionResult?.assignment ?? null);
        coSection.querySelector('#co-unused-list').innerHTML = '';
        for (const [name, qty] of Object.entries(newUnused)) addCardsUnusedRow(coSection, name, String(qty));
        saveCardsState(coSection);
        useSyncBtn.innerHTML = `${ICONS.check} Applied`;
        useSyncBtn.disabled = true;
      } catch { useSyncBtn.textContent = 'Error'; }
    });
  }
  initSlider(
    container,
    [...container.querySelectorAll('.co-slide')],
    container.querySelector('#co-slider-label'),
    slideLabels
  );
  bindDivModalNodes(container);
  bindCompanionModalNodes(container);
};

// event binding & init 
document.addEventListener('click', closeAllModals);
document.getElementById('divModalClose').addEventListener('click', closeDivModal);
divModalBackdrop.addEventListener('click', e => {
  if (e.target === divModalBackdrop) closeDivModal();
});
(function () {
  const closeModal = () => DOM.coCompanionBackdrop.classList.remove('open');
  document.getElementById('coCompanionModalClose').addEventListener('click', closeModal);
  DOM.coCompanionBackdrop.addEventListener('click', e => {
    if (e.target === DOM.coCompanionBackdrop) closeModal();
  });
})();
bindModal('summaryBtn', summaryModal, {
  closeId: 'summaryClose',
  onOpen: renderSummaryModal,
});
bindModal('companionSummaryBtn', document.getElementById('companionSummaryModal'), {
  closeId: 'companionSummaryClose',
  onOpen: () => {
    const totals = getCompanionBonuses?.() ?? {};
    renderSummaryList(
      document.getElementById('companionSummaryList'),
      Object.entries(COMPANION_FIELD_LABELS)
        .filter(([field]) => (totals[field] || 0) > 0)
        .map(([field, lbl]) => ({ lbl, val: `${fmtPct(totals[field])}%` }))
    );
  },
});
bindModal('companionHelpBtn', document.getElementById('companionHelpModal'), {
  closeId: 'companionHelpClose',
});
bindModal('helpBtn', helpModal, {
  closeId: 'helpClose',
  spoilerToggle: true,
});
document.addEventListener('click', e => {
  const sp = e.target.closest('.spoiler');
  if (sp) { e.stopPropagation(); sp.classList.toggle('revealed'); }
});
document.getElementById('trashDivBtn').addEventListener('click', e => {
  e.stopPropagation();
  if (!confirm('Clear all divinity? This will `force` remove all added divinities including locked and currently in use.')) return;
  for (const id of nodeOrder) {
    nodeData[id] = { count: 1, current: 0, usedBySize: defaultUsedBySize(), panels: [defaultPanel()] };
    updateDivCircle(id);
  }
  saveDivinityState();
  if (ui.activePanel) closePanel();
});
DOM.divSizeSelect.addEventListener('change', e => {
  ui.activeSize = e.target.value;
  nodeOrder.forEach(updateDivCircle);
  switchCardsSize(coSection);

  if (!ui.activePanel || !ui.activeId) return;
  const data = getData(ui.activeId);
  updateUseBtn(ui.activePanel.querySelector('.use-btn'), getUsed(ui.activeId) === data.current);
  toggleTrashBtn(
    ui.activePanel.querySelector('.panel-nav'),
    ui.activeId,
    data.count,
    data.current,
    data.panels[data.current]?.locked
  );
});
document.querySelectorAll('.node').forEach(cb => {
  cb.addEventListener('change', () => {
    if (ui.isNodeNavigating || !cb.checked) return;
    if (ui.isAnimating) { cb.checked = false; return; }
    ui.activePanel ? closePanel(() => openPanel(cb)) : openPanel(cb);
  });
});
DOM.tDef.addEventListener('change', () => {
  updateTargetLabels(DOM.tDef.value);
  updateActiveSize();
  saveStatsState();
  rebuildCardsBuffList();
  rebuildEnchantPairs(true);
  refreshEnchantSettingsIfOpen();
});
DOM.wElem.addEventListener('change', () => {
  DOM.elemEnhanceLabel.textContent = getElemEnhLabel();
  saveStatsState();
  if (ui.activePanel) ui.activePanel._updateOptions?.();
  rebuildCardsBuffList();
  rerenderCompanionSheet?.();
});
DOM.weapon.addEventListener('change', () => {
  if (coSection.querySelector('.co-card-select')) rebuildWeaponSlots(coSection);
  saveStatsState();
  rebuildEnchantPairs();
  refreshEnchantSettingsIfOpen();
});
DOM.atkType.addEventListener('change', () => {
  const isPen = DOM.atkType.value === 'pen';
  DOM.penField.hidden  = !isPen;
  DOM.critField.hidden = isPen;
  DOM.pen.value = DOM.crit.value = '';
  saveStatsState();
  rebuildEnchantPairs(true);
  refreshEnchantSettingsIfOpen();

  if (ui.activePanel && ui.activeId) {
    const d = getData(ui.activeId);
    navigateTo(d.current, 0);
  }

  rebuildCardsBuffList();
  rerenderCompanionSheet?.();
});
DOM.manualBtn.addEventListener('click', () => setFormOpen(!DOM.form.classList.contains('open')));
DOM.form.addEventListener('input',  saveStatsState);
DOM.form.addEventListener('change', saveStatsState);
document.getElementById('loadStatsBtn').addEventListener('click', () => {
  try {
    if (Object.keys(readSection('stats')).length) {
      setFormOpen(true);
      showStatsMsg('Stats already saved.', 'ok');
      return;
    }
    const raw = localStorage.getItem(CFG.snapKey);
    if (!raw) { showStatsMsg(ERR_MSG, 'err'); return; }
    loadStatsFromSnap(JSON.parse(raw));
    setFormOpen(true);
    showStatsMsg('Stats loaded.', 'ok');
  } catch {
    showStatsMsg(ERR_MSG, 'err');
  }
});
document.getElementById('calculateBtn').addEventListener('click', () => {
  ui.calcTimeouts.forEach(clearTimeout);
  ui.calcTimeouts = [];

  const calcState = buildStatsState();
  const { atkType, tDefKey, wElem, tSize, tRace, tAttr } = calcState;
  const ctx = { atkType, tDefKey, wElem, tSize, tRace, tAttr };

  const resultEl = DOM.resultCard;
  resultEl.hidden = false;
  resultEl.innerHTML = buildLoadingHTML('Let me buy and use a convex mirror first');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const enchantSlotState  = getEnchantSlotState();
  const enchantCandidates = getEnchantCandidates(enchantSlotState);
  const enchantCombos     = enchantCandidates.reduce((acc, c) => acc * (c.length + 1), 1);

  const companionItems  = getCompanionItems?.() ?? [];
  const companionCombos = (() => {
    let r = 1;
    for (let i = 0; i < CFG.companionSlots; i++) {
      r *= companionItems.length - i > 0 ? companionItems.length - i + 1 : 1;
    }
    return r;
  })();

  const divCombos = nodeOrder
    .filter(id => nodeData[id] && isNodeActive(id))
    .reduce((acc, id) => {
      const d = getData(id);
      const usedIdx = getUsed(id);
      return acc * (usedIdx != null && d.panels[usedIdx]?.locked ? 1 : d.count);
    }, 1);

  const equippedNames    = [...coSection.querySelectorAll('.co-card-select')].map(input => input.dataset.value || '');
  const slotCounts       = { ...SLOT_COUNTS, weapon: getWeaponSlotCount() };
  const lockedCopiesUsed = countBy(
    [...coSection.querySelectorAll('.co-lock-btn')]
      .filter(b => b.dataset.locked === 'true')
      .map(b => coSection.querySelector(
        `.co-card-select[data-equip="${b.dataset.equip}"][data-slot="${b.dataset.slot}"]`
      )?.dataset.value || '')
      .filter(Boolean)
  );
  for (const [equip, cards] of Object.entries(lockedCopiesUsed)) {
    slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards);
  }

  const unusedMap = {};
  for (const row of coSection.querySelectorAll('.co-unused-row')) {
    const name = row.querySelector('.co-unused-name').dataset.value ?? '';
    const qty  = parseInt(row.querySelector('.co-unused-qty').value) || 1;
    if (name) unusedMap[name] = (unusedMap[name] || 0) + qty;
  }

  const poolMap = {};
  const addToPool = (name, count) => {
    const card = getCard(name);
    if (!card) return;
    const s = (poolMap[card.equip] ??= {});
    s[name] = (s[name] || 0) + count;
  };
  for (const name of equippedNames) if (name) addToPool(name, 1);
  for (const [name, qty] of Object.entries(unusedMap)) addToPool(name, qty);

  const cardPool   = Object.fromEntries(
    Object.entries(poolMap).map(([e, m]) => [e, Object.entries(m).map(([name, qty]) => ({ name, qty }))])
  );
  const prebuilt   = genCardCombos(cardPool, slotCounts);
  const cardCombos = prebuilt.overflowed ? CFG.maxEvalLimit + 1 : prebuilt.totalCombos;

  const totalCombos = cardCombos * divCombos * companionCombos * enchantCombos;
  const comboLabel  = totalCombos.toLocaleString();
  const targetLabel = (ctx.tDefKey || 'target').replace(/\s*Lv\.?\s*\d{3}/i, '');

  ui.calcTimeouts.push(setTimeout(() => {
    setLoadingText(resultEl, `Scanned! ${targetLabel} appear in ${comboLabel} seconds`);
  }, LOADER_TIMING.convexMirror));

  ui.calcTimeouts.push(setTimeout(() => {
    setLoadingText(resultEl, totalCombos > 8888888 ? 'Too long, let me fly to the future' : 'Wait, still finding');
  }, LOADER_TIMING.convexMirror + LOADER_TIMING.okScanned));

  ui.calcTimeouts.push(setTimeout(() => {
    setLoadingText(resultEl, totalCombos > 8888888 ? 'Wait, still finding, fly wing skemm' : 'Wait, fly wing skemm', true);
  }, LOADER_TIMING.convexMirror + LOADER_TIMING.okScanned + LOADER_TIMING.timeTravel));

  ui.calcTimeouts.push(setTimeout(() => {
    runAndRender(coSection, calcState, ctx);
  }, LOADER_TIMING.convexMirror + LOADER_TIMING.okScanned + LOADER_TIMING.timeTravel + LOADER_TIMING.flywingScam));
});
initSelect(DOM.tDef,   Object.keys(DEFENSE_TABLE).filter(k => !k.includes('Lvl.')));
initSelect(DOM.weapon, Object.keys(WEAPON_SIZE_MODIFIER_TABLE));
initSelect(DOM.wElem,  Object.keys(ELEMENT_COUNTER_TABLE));
loadDivinityState();
nodeOrder.forEach(updateDivCircle);
loadStatsState();
coSection.innerHTML = buildCardsHTML();
loadCardsState(coSection);
if (getWeaponSlotCount() !== EQUIP_SLOTS.weapon.count) rebuildWeaponSlots(coSection);
bindCardsEvents(coSection);
initCompanionSlider();
initCompanionItems();
DOM.enchAwakeningSelect.addEventListener('change', () => {
  readEnchantStateFromDOM();
  saveEnchantState();
  updateEnchantTotal();
});
enchantSection.addEventListener('change', e => {
  if (!e.target.closest('.ench-pair')) return;
  readEnchantStateFromDOM();
  saveEnchantState();
  updateEnchantTotal();
  refreshEnchantSettingsIfOpen();
});
DOM.enchSettingsBtn.addEventListener('click', () => {
  const open = DOM.enchSettingsPanel.classList.toggle('open');
  DOM.enchSettingsBtn.classList.toggle('active', open);
  if (open) renderEnchantSettingsPanel();
});
bindCoPanelToggle(enchantSection.querySelector('.co-hd'));
loadEnchantState();