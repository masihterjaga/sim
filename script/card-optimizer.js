const LOCK_CLOSED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#dcdfe3"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
const LOCK_OPEN_SVG   = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#dcdfe3"><path d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;

const SLOT_COUNTS = {
  weapon:    5,
  clothes:   2,
  cloak:     2,
  shoes:     2,
  accessory: 6,
  headgear:  6,
};

const EQUIP_LABELS = {
  weapon: 'Weapon', clothes: 'Clothes', cloak: 'Cloak',
  shoes: 'Shoes', accessory: 'Accessory', headgear: 'Headgear',
};

const BUFF_STAT_OPTIONS = [
  { label: 'Final P/M DMG Bonus', field: 'dmg'      },
  { label: 'Final PEN',           field: 'pen'      },
  { label: 'Crit DMG Bonus',      field: 'crit'     },
  { label: 'Element Enhance',     field: 'elemEnh'  },
  { label: 'DMG to Size',         field: 'sizeEnh'  },
  { label: 'DMG to Race',         field: 'race'     },
  { label: 'DMG to Attribute',    field: 'attr'     },
  { label: 'Final Damage Stack',  field: 'dmgStack' },
];

const MAX_EVAL_LIMIT = 66_666;

const STAT_RESOLVERS = {
  'Final P.PEN':  (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
  'P.PEN':        (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
  'Final M.PEN':  (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
  'M.PEN':        (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
  'Crit DMG Bonus':    (ctx) => ctx.atkType === 'crit' ? 'crit' : null,
  'Final P.DMG Bonus': () => 'dmg',
  'Final M.DMG Bonus': () => 'dmg',
  'Fire Enhance':    (ctx) => ctx.wElem === 'Fire'    ? 'elemEnh' : null,
  'Water Enhance':   (ctx) => ctx.wElem === 'Water'   ? 'elemEnh' : null,
  'Wind Enhance':    (ctx) => ctx.wElem === 'Wind'    ? 'elemEnh' : null,
  'Earth Enhance':   (ctx) => ctx.wElem === 'Earth'   ? 'elemEnh' : null,
  'Holy Enhance':    (ctx) => ctx.wElem === 'Holy'    ? 'elemEnh' : null,
  'Shadow Enhance':  (ctx) => ctx.wElem === 'Shadow'  ? 'elemEnh' : null,
  'Ghost Enhance':   (ctx) => ctx.wElem === 'Ghost'   ? 'elemEnh' : null,
  'Poison Enhance':  (ctx) => ctx.wElem === 'Poison'  ? 'elemEnh' : null,
  'Neutral Enhance': (ctx) => ctx.wElem === 'Neutral' ? 'elemEnh' : null,
  'Undead Enhance':  (ctx) => ctx.wElem === 'Undead'  ? 'elemEnh' : null,
  'Bonus DMG to Small':      (ctx) => ctx.tSize === 'Small'      ? 'sizeEnh' : null,
  'Bonus DMG to Medium':     (ctx) => ctx.tSize === 'Medium'     ? 'sizeEnh' : null,
  'Bonus DMG to Large':      (ctx) => ctx.tSize === 'Large'      ? 'sizeEnh' : null,
  'Bonus DMG to Demi-Human': (ctx) => ctx.tRace === 'Demi-Human' ? 'race'    : null,
  'Bonus DMG to Brute':      (ctx) => ctx.tRace === 'Brute'      ? 'race'    : null,
  'Bonus DMG to Demon':      (ctx) => ctx.tRace === 'Demon'      ? 'race'    : null,
  'Bonus DMG to Angel':      (ctx) => ctx.tRace === 'Angel'      ? 'race'    : null,
  'Bonus DMG to Fish':       (ctx) => ctx.tRace === 'Fish'       ? 'race'    : null,
  'Bonus DMG to Formless':   (ctx) => ctx.tRace === 'Formless'   ? 'race'    : null,
  'Bonus DMG to Insect':     (ctx) => ctx.tRace === 'Insect'     ? 'race'    : null,
  'Bonus DMG to Dragon':     (ctx) => ctx.tRace === 'Dragon'     ? 'race'    : null,
  'Bonus DMG to Plant':      (ctx) => ctx.tRace === 'Plant'      ? 'race'    : null,
  'Bonus DMG to Undead':     (ctx) => ctx.tRace === 'Undead'     ? 'race'    : null,
};

function parseStatValue(raw) {
  if (typeof raw !== 'string' || !raw.includes('%')) return null;
  return parseFloat(raw.replace('%', '').replace(/,/g, ''));
}

function lookupCard(cardName) {
  return cardData[cardName] ?? null;
}

function getCardStatDelta(cardName, ctx) {
  const card = lookupCard(cardName);
  if (!card) return null;

  const delta = { pen: 0, crit: 0, dmg: 0, elemEnh: 0, sizeEnh: 0, race: 0, attr: 0, dmgStack: 0 };

  for (const [statName, rawVal] of Object.entries(card.stats)) {
    const resolver = STAT_RESOLVERS[statName];
    if (!resolver) continue;
    const field = resolver(ctx);
    if (!field) continue;
    const value = parseStatValue(rawVal);
    if (value === null) continue;
    delta[field] += value;
  }

  return { delta, equip: card.equip };
}

function applyCardDeltas(state, cardNames, ctx, sign = 1) {
  const result = { ...state };
  for (const name of cardNames) {
    if (!name || name === '—') continue;
    const cardResult = getCardStatDelta(name, ctx);
    if (!cardResult) continue;
    for (const [key, val] of Object.entries(cardResult.delta)) {
      if (key in result) result[key] += sign * val;
    }
  }
  return result;
}

function calcBaseStats(calcState, equippedNames, ctx) {
  return applyCardDeltas(calcState, equippedNames, ctx, -1);
}

function applyCards(baseState, cardNames, ctx) {
  return applyCardDeltas(baseState, cardNames, ctx);
}

function generateEquipCombinations(pool, slots) {
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

function runOptimizer(baseState, cardPool, slotCounts, ctx) {
  const equipTypes = Object.keys(SLOT_COUNTS).filter(e => (slotCounts[e] ?? 0) > 0);

  const combosPerEquip = {};
  let totalCombos = 1;
  let overflowed = false;

  for (const equip of equipTypes) {
    const pool = (cardPool[equip] || []).filter(c => c.qty > 0);
    const slots = slotCounts[equip] || 0;
    combosPerEquip[equip] = generateEquipCombinations(pool, slots);
    totalCombos *= combosPerEquip[equip].length;
    if (totalCombos > MAX_EVAL_LIMIT) {
      overflowed = true;
      break;
    }
  }
  console.log('Total combos:', totalCombos, '| Mode:', overflowed ? 'GREEDY' : 'EXACT');


  return overflowed
    ? runGreedyOptimizer(baseState, cardPool, slotCounts, equipTypes, ctx, combosPerEquip)
    : runExactOptimizer(baseState, combosPerEquip, equipTypes, ctx);
}

function runExactOptimizer(baseState, combosPerEquip, equipTypes, ctx) {
  const allResults = [];

  function recurse(equipIdx, cardsSoFar) {
    if (equipIdx === equipTypes.length) {
      const state = applyCards(baseState, cardsSoFar, ctx);
      const { mult } = calculateMultiplier(state);
      allResults.push({ cards: [...cardsSoFar], mult });
      return;
    }
    for (const combo of combosPerEquip[equipTypes[equipIdx]]) {
      recurse(equipIdx + 1, cardsSoFar.concat(combo));
    }
  }

  recurse(0, []);
  allResults.sort((a, b) => b.mult - a.mult);

  return { topResults: allResults.slice(0, 1), mode: 'exact' };
}

function runGreedyOptimizer(baseState, cardPool, slotCounts, equipTypes, ctx, combosPerEquip) {
  let runningState = { ...baseState };
  const bestPerEquip = {};

  for (const equip of equipTypes) {
    const pool = (cardPool[equip] || []).filter(c => c.qty > 0);
    const slots = slotCounts[equip] || 0;
    const combos = combosPerEquip[equip] ?? generateEquipCombinations(pool, slots);

    let bestMult = -Infinity;
    let bestCombo = [];

    for (const combo of combos) {
      const state = applyCards(runningState, combo, ctx);
      const { mult } = calculateMultiplier(state);
      if (mult > bestMult) { bestMult = mult; bestCombo = combo; }
    }

    bestPerEquip[equip] = bestCombo;
    runningState = applyCards(runningState, bestCombo, ctx);
  }

  const allBestCards = Object.values(bestPerEquip).flat();
  const { mult } = calculateMultiplier(applyCards(baseState, allBestCards, ctx));

  return {
    topResults: [{ cards: allBestCards, mult, breakdown: bestPerEquip }],
    mode: 'exact',
  };
}

function renderCardOptimizer(calcState, container) {
  injectStyles();

  const ctx = {
    atkType: calcState.atkType,
    wElem:   calcState.wElem,
    tSize:   calcState.tSize,
    tRace:   calcState.tRace,
  };

  const existing = container.querySelector('#card-optimizer');
  if (existing) {
    existing._calcState = calcState;
    existing._ctx       = ctx;
    return;
  }

  const section = document.createElement('div');
  section.id         = 'card-optimizer';
  section.className  = 'co-section-wrap';
  section._calcState = calcState;
  section._ctx       = ctx;
  section.innerHTML  = buildOptimizerHTML();

  restoreOptimizerState(section);
  bindOptimizerEvents(section);

  setTimeout(() => container.appendChild(section), 0);
}

function buildOptimizerHTML() {
  const equippedSlotsHTML = Object.entries(EQUIP_LABELS).map(([equip, label]) => {
    const maxSlots = SLOT_COUNTS[equip];
    const options = '<option value="">—</option>'
      + Object.keys(cardData)
          .filter(name => cardData[name].equip === equip)
          .sort()
          .map(n => `<option value="${esc(n)}">${esc(n)}</option>`)
          .join('');

    const slotsHTML = Array.from({ length: maxSlots }, (_, i) =>
      `<div class="co-slot">
        <span class="co-slot-lbl">Slot ${i + 1}</span>
        <div class="input-wrap select-wrap">
          <select class="co-card-select" data-equip="${equip}" data-slot="${i}">
            ${options}
          </select>
        </div>
        <button class="co-lock-btn" type="button" data-equip="${equip}" data-slot="${i}" data-locked="false" title="Lock slot (keep in optimization result)">${LOCK_OPEN_SVG}</button>
      </div>`
    ).join('');

    return `<div class="co-equip-group">
      <div class="co-equip-lbl">${label}</div>
      <div class="co-slots-row">${slotsHTML}</div>
    </div>`;
  }).join('');

  return `
    <div class="co-panel">
      <div class="co-panel-hd" role="button" tabindex="0" aria-expanded="true">
        <span>Build Optimizer</span>
        <span class="co-chevron" aria-hidden="true">▾</span>
      </div>
      <div class="co-body">

        <div class="co-block">
          <div class="co-block-title">Equipped Cards</div>
          <p class="co-block-desc">
            Select your currently equipped cards, then add any cards in your inventory relevant to your target.<br/><br/>Results may not fully match in-game values, especially for cards with ATK% stats. This feature is still a work in progress and some stats might be missing.<br/><br/>Lock slots if specific cards are needed for exclusive set.
          </p>
          <div id="co-equipped-slots" class="co-equipped-wrap">${equippedSlotsHTML}</div>
          <button class="co-add-btn co-clear-btn" id="co-unequip-all" type="button">Unequip All</button>
        </div>

        <div class="co-block">
          <div class="co-block-title">Unused Cards (owned but not equipped)</div>
          <p class="spoiler co-block-desc">Or any cards you're dreaming of and definitely can't afford <img src="/img/dogekek.png" width="14" height="14"></img></p>
          <div id="co-unused-list" class="co-unused-list"></div>
          <div class="co-btn-group">
            <button class="co-add-btn" id="co-add-unused" type="button">+ Add Card</button>
            <button class="co-add-btn co-clear-btn" id="co-dismantle-all" type="button">Dismantle All</button>
          </div>
        </div>

        <div class="co-block">
          <div class="co-block-title">Equipment Effect / Buffs</div>
          <p class="co-block-desc">
            If your gear has exclusive effects (elemental bonus, damage bonus, etc.), add them here. Make sure you haven't already included them in the base inputs before Calculate.<br/><br/>It is highly recommended to always add your Dancer's/Bard's Eternal Chaos or GS's Glorious Command bonus here for better accuracy.
          </p>
          <div id="co-buff-list" class="co-buff-list"></div>
          <div class="co-btn-group">
            <button class="co-add-btn" id="co-add-buff" type="button">+ Add Buff</button>
            <button class="co-add-btn co-clear-btn" id="co-clear-all-buffs" type="button">Clear All</button>
          </div>
        </div>

        <div class="btn-row co-run-row">
          <button id="co-run-btn">Find Best Combination</button>
        </div>

        <div id="co-result" class="co-result" hidden></div>

      </div>
    </div>`;
}

function buildUnusedRowHTML() {
  const allOptions = Object.keys(cardData).sort()
    .map(n => `<option value="${esc(n)}">${esc(n)}</option>`)
    .join('');
  const qtyOptions = Array.from({ length: 10 }, (_, i) =>
    `<option value="${i + 1}">${i + 1}</option>`
  ).join('');

  return `<div class="co-unused-row">
    <div class="input-wrap select-wrap co-unused-name-wrap">
      <select class="co-unused-name">
        <option value="">— Select Card —</option>${allOptions}
      </select>
    </div>
    <div class="input-wrap select-wrap co-unused-qty-wrap">
      <select class="co-unused-qty">${qtyOptions}</select>
    </div>
    <button class="co-rm-btn" type="button">×</button>
  </div>`;
}

function buildBuffRowHTML() {
  const options = BUFF_STAT_OPTIONS
    .map(o => `<option value="${esc(o.field)}">${esc(o.label)}</option>`)
    .join('');

  return `<div class="co-buff-row">
    <div class="input-wrap select-wrap co-buff-stat-wrap">
      <select class="co-buff-stat">
        <option value="">— Select Stat —</option>${options}
      </select>
    </div>
    <div class="input-wrap co-buff-val-wrap">
      <input type="number" class="co-buff-val" placeholder="0" min="0" step="0.1">
    </div>
    <button class="co-rm-btn" type="button">×</button>
  </div>`;
}

function addUnusedRow(section, name = '', qty = '1') {
  const wrap = document.createElement('div');
  wrap.innerHTML = buildUnusedRowHTML();
  const row = wrap.firstElementChild;
  if (name) row.querySelector('.co-unused-name').value = name;
  if (qty !== '1') row.querySelector('.co-unused-qty').value = qty;
  row.querySelector('.co-rm-btn').addEventListener('click', () => {
    row.remove();
    saveOptimizerState(section);
  });
  row.addEventListener('change', () => saveOptimizerState(section));
  section.querySelector('#co-unused-list').appendChild(row);
  return row;
}

function addBuffRow(section, stat = '', val = '') {
  const wrap = document.createElement('div');
  wrap.innerHTML = buildBuffRowHTML();
  const row = wrap.firstElementChild;
  if (stat) row.querySelector('.co-buff-stat').value = stat;
  if (val)  row.querySelector('.co-buff-val').value  = val;
  row.querySelector('.co-rm-btn').addEventListener('click', () => {
    row.remove();
    saveOptimizerState(section);
  });
  row.addEventListener('change', () => saveOptimizerState(section));
  row.addEventListener('input',  () => saveOptimizerState(section));
  section.querySelector('#co-buff-list').appendChild(row);
  return row;
}

function togglePanel(hd) {
  const isExpanded = hd.getAttribute('aria-expanded') !== 'false';
  hd.setAttribute('aria-expanded', String(!isExpanded));
}

function bindOptimizerEvents(section) {
  const hd = section.querySelector('.co-panel-hd');
  hd.addEventListener('click', () => togglePanel(hd));
  hd.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(hd); }
  });

  section.querySelector('#co-equipped-slots').addEventListener('change', () => {
    saveOptimizerState(section);
  });

  section.querySelector('#co-equipped-slots').addEventListener('click', e => {
    const btn = e.target.closest('.co-lock-btn');
    if (!btn) return;
    const isLocked = btn.dataset.locked === 'true';
    btn.dataset.locked = String(!isLocked);
    btn.innerHTML      = !isLocked ? LOCK_CLOSED_SVG : LOCK_OPEN_SVG;
    btn.title          = !isLocked ? 'Unlock slot' : 'Lock slot (keep in optimization result)';
    saveOptimizerState(section);
  });

  section.querySelector('#co-add-buff').addEventListener('click', () => {
    addBuffRow(section);
    saveOptimizerState(section);
  });

  section.querySelector('#co-add-unused').addEventListener('click', () => {
    addUnusedRow(section);
    saveOptimizerState(section);
  });

  section.querySelector('#co-unequip-all').addEventListener('click', () => {
    section.querySelectorAll('.co-card-select').forEach(sel => { sel.value = ''; });
    saveOptimizerState(section);
  });

  section.querySelector('#co-dismantle-all').addEventListener('click', () => {
    section.querySelector('#co-unused-list').innerHTML = '';
    saveOptimizerState(section);
  });

  section.querySelector('#co-clear-all-buffs').addEventListener('click', () => {
    section.querySelector('#co-buff-list').innerHTML = '';
    saveOptimizerState(section);
  });

  section.querySelector('#co-run-btn').addEventListener('click', () => {
    runAndRender(section, section._calcState, section._ctx);
  });
}

const LS_KEY = 'cardOptimizer_state';

function saveOptimizerState(section) {
  try {
    const equipped = {};
    for (const sel of section.querySelectorAll('.co-card-select')) {
      equipped[`${sel.dataset.equip}_${sel.dataset.slot}`] = sel.value;
    }

    const locked = {};
    for (const btn of section.querySelectorAll('.co-lock-btn')) {
      locked[`${btn.dataset.equip}_${btn.dataset.slot}`] = btn.dataset.locked === 'true';
    }

    const buffs = [];
    for (const row of section.querySelectorAll('.co-buff-row')) {
      buffs.push({
        stat: row.querySelector('.co-buff-stat').value,
        val:  row.querySelector('.co-buff-val').value,
      });
    }

    const unused = [];
    for (const row of section.querySelectorAll('.co-unused-row')) {
      unused.push({
        name: row.querySelector('.co-unused-name').value,
        qty:  row.querySelector('.co-unused-qty').value,
      });
    }

    localStorage.setItem(LS_KEY, JSON.stringify({ equipped, locked, buffs, unused }));
  } catch (_) {}
}

function restoreOptimizerState(section) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const { equipped = {}, locked = {}, buffs = [], unused = [] } = JSON.parse(raw);

    for (const sel of section.querySelectorAll('.co-card-select')) {
      const key = `${sel.dataset.equip}_${sel.dataset.slot}`;
      if (equipped[key] !== undefined) sel.value = equipped[key];
    }

    for (const btn of section.querySelectorAll('.co-lock-btn')) {
      const key = `${btn.dataset.equip}_${btn.dataset.slot}`;
      if (locked[key]) {
        btn.dataset.locked = 'true';
        btn.innerHTML      = LOCK_CLOSED_SVG;
        btn.title          = 'Unlock slot';
      }
    }

    for (const { stat, val } of buffs) addBuffRow(section, stat, val);
    for (const { name, qty } of unused) addUnusedRow(section, name, qty);
  } catch (_) {}
}

function runAndRender(section, calcState, ctx) {
  const resultEl = section.querySelector('#co-result');
  resultEl.hidden = false;
  resultEl.innerHTML = '<div class="co-loading">Calculating…</div>';

  const equippedNames = [...section.querySelectorAll('.co-card-select')].map(sel => sel.value || '');
  const slotCounts = { ...SLOT_COUNTS };

  const lockedCards = {};
  for (const btn of section.querySelectorAll('.co-lock-btn')) {
    if (btn.dataset.locked !== 'true') continue;
    const equip = btn.dataset.equip;
    const slot  = btn.dataset.slot;
    const sel   = section.querySelector(`.co-card-select[data-equip="${equip}"][data-slot="${slot}"]`);
    const cardName = sel?.value || '';
    if (cardName) (lockedCards[equip] ??= []).push(cardName);
  }
  const allLockedNames = Object.values(lockedCards).flat();

  for (const [equip, cards] of Object.entries(lockedCards)) {
    slotCounts[equip] = Math.max(0, (slotCounts[equip] || 0) - cards.length);
  }

  const unusedMap = {};
  for (const row of section.querySelectorAll('.co-unused-row')) {
    const name = row.querySelector('.co-unused-name').value;
    const qty  = parseInt(row.querySelector('.co-unused-qty').value) || 1;
    if (name) unusedMap[name] = (unusedMap[name] || 0) + qty;
  }

  const poolMap = {};
  const addToPool = (name, count) => {
    const card = lookupCard(name);
    if (!card) return;
    const equipPool = (poolMap[card.equip] ??= {});
    equipPool[name] = (equipPool[name] || 0) + count;
  };

  for (const name of equippedNames) {
    if (name) addToPool(name, 1);
  }
  for (const [name, qty] of Object.entries(unusedMap)) {
    addToPool(name, qty);
  }

  const cardPool = {};
  for (const [equip, map] of Object.entries(poolMap)) {
    cardPool[equip] = Object.entries(map).map(([name, qty]) => ({ name, qty }));
  }

  const lockedCopiesUsed = {};
  for (const name of allLockedNames) {
    lockedCopiesUsed[name] = (lockedCopiesUsed[name] || 0) + 1;
  }
  for (const equip of Object.keys(cardPool)) {
    cardPool[equip] = cardPool[equip]
      .map(({ name, qty }) => ({ name, qty: Math.max(0, qty - (lockedCopiesUsed[name] || 0)) }))
      .filter(c => c.qty > 0);
  }

  const buffMap = {};
  for (const row of section.querySelectorAll('.co-buff-row')) {
    const field = row.querySelector('.co-buff-stat').value;
    const val   = parseFloat(row.querySelector('.co-buff-val').value) || 0;
    if (field && val !== 0) buffMap[field] = (buffMap[field] || 0) + val;
  }

  const lockedSlotKeys = new Set();
  for (const btn of section.querySelectorAll('.co-lock-btn')) {
    if (btn.dataset.locked === 'true') {
      lockedSlotKeys.add(`${btn.dataset.equip}_${btn.dataset.slot}`);
    }
  }
  const nonLockedEquipped = [];
  for (const sel of section.querySelectorAll('.co-card-select')) {
    const key = `${sel.dataset.equip}_${sel.dataset.slot}`;
    if (!lockedSlotKeys.has(key) && sel.value) {
      nonLockedEquipped.push(sel.value);
    }
  }

  setTimeout(() => {
    try {
      const baseState = calcBaseStats(calcState, equippedNames, ctx);

      for (const [field, val] of Object.entries(buffMap)) {
        if (field in baseState) baseState[field] += val;
      }

      const lockedBaseState = applyCards(baseState, allLockedNames, ctx);

      const currentSetupState = applyCards(lockedBaseState, nonLockedEquipped, ctx);
      const currentMult = calculateMultiplier(currentSetupState).mult;

      const { topResults } = runOptimizer(lockedBaseState, cardPool, slotCounts, ctx);

      if (topResults.length && allLockedNames.length) {
        topResults[0].cards = [...allLockedNames, ...topResults[0].cards];
      }

      if (!topResults.length || topResults[0].mult < currentMult) {
        topResults.unshift({
          cards: [...allLockedNames, ...nonLockedEquipped],
          mult:  currentMult,
        });
      }

      renderResults(resultEl, topResults, baseState, currentMult, lockedCards, equippedNames);
    } catch (err) {
      resultEl.innerHTML = `<div class="co-error">Error: ${esc(err.message)}</div>`;
    }
  }, 30);
}

function renderResults(container, topResults, baseState, currentMult, lockedCards = {}, equippedNames = []) {
  if (!topResults?.length) {
    container.innerHTML = '<div class="co-empty">No valid combinations found. Add cards to the pool.</div>';
    return;
  }

  const best      = topResults[0];
  const isGain    = best.mult >= currentMult;
  const pctRaw    = currentMult > 0 ? ((best.mult - currentMult) / currentMult * 100) : 0;
  const pct       = pctRaw.toFixed(2);
  const sign      = pctRaw >= 0 ? '+' : '';
  const rawAttack = baseState.baseAttack || 1;

  const lockedCountByEquip = {};
  for (const [equip, names] of Object.entries(lockedCards)) {
    lockedCountByEquip[equip] = {};
    for (const name of names) {
      lockedCountByEquip[equip][name] = (lockedCountByEquip[equip][name] || 0) + 1;
    }
  }

  const buildBreakdownHTML = (equipMap, lockedMap = {}) =>
    Object.entries(equipMap).map(([equip, cards]) => {
      const lockedInEquip = lockedMap[equip] || {};
      const chipsHTML = Object.entries(cards).map(([n, q]) => {
        const numLocked = Math.min(lockedInEquip[n] || 0, q);
        const numFree   = q - numLocked;
        const parts     = [];
        if (numLocked > 0) {
          parts.push(`<span class="co-chip co-chip--locked">${LOCK_CLOSED_SVG}${esc(n)}${numLocked > 1 ? `<span class="co-chip-qty"> ×${numLocked}</span>` : ''}</span>`);
        }
        if (numFree > 0) {
          parts.push(`<span class="co-chip">${esc(n)}${numFree > 1 ? `<span class="co-chip-qty"> ×${numFree}</span>` : ''}</span>`);
        }
        return parts.join('');
      }).join('');
      return `<div class="co-res-equip">
        <span class="co-res-equip-lbl">${EQUIP_LABELS[equip] ?? equip}</span>
        <span class="co-res-cards">${chipsHTML}</span>
      </div>`;
    }).join('') || '<em style="font-size:var(--font-size-sm);color:var(--text-muted)">No cards</em>';

  const byEquip = {};
  for (const name of best.cards) {
    const card = lookupCard(name);
    if (!card) continue;
    const equipPool = (byEquip[card.equip] ??= {});
    equipPool[name] = (equipPool[name] || 0) + 1;
  }

  const noteHTML = pctRaw >= 0 && pctRaw <= 8
    ? `<div class="co-res-note">Current setup is good already. Feel free to use these or just stick with what's in use.</div>`
    : '';

  const slide1HTML = `
    <div class="co-res-section">
      <div class="co-res-section-title">Recommended Cards</div>
      <div class="co-res-breakdown">${buildBreakdownHTML(byEquip, lockedCountByEquip)}</div>
    </div>
    <div class="co-res-hero">
      <div class="co-res-hero-block">
        <div class="co-res-hero-val">×${fmtNum(best.mult / rawAttack)}</div>
        <div class="co-res-hero-lbl">New Multiplier</div>
      </div>
      <div class="co-res-hero-block ${isGain ? 'pos' : 'neg'}">
        <div class="co-res-hero-val">${sign}${pct}%</div>
        <div class="co-res-hero-lbl">vs. before</div>
      </div>
    </div>
    ${noteHTML}`;

  const beforeByEquip = {};
  for (const name of equippedNames) {
    if (!name || name === '—') continue;
    const card = lookupCard(name);
    if (!card) continue;
    const pool = (beforeByEquip[card.equip] ??= {});
    pool[name] = (pool[name] || 0) + 1;
  }

  const slide2HTML = `
    <div class="co-res-section">
      <div class="co-res-section-title">Current Cards</div>
      <div class="co-res-breakdown">${buildBreakdownHTML(beforeByEquip)}</div>
    </div>
    <div class="co-res-hero">
      <div class="co-res-hero-block">
        <div class="co-res-hero-val">×${fmtNum(currentMult / rawAttack)}</div>
        <div class="co-res-hero-lbl">Current Multiplier</div>
      </div>
    </div>`;

  container.innerHTML = `
    <div class="co-slider">
      <div class="co-slider-header">
        <div class="co-slider-label" id="co-slider-label">Recommendation</div>
        <div class="co-slider-nav">
          <button class="co-slide-btn" data-dir="-1">‹</button>
          <button class="co-slide-btn" data-dir="1">›</button>
        </div>
      </div>
      <div class="co-slider-track">
        <div class="co-slide co-slide--active">${slide1HTML}</div>
        <div class="co-slide">${slide2HTML}</div>
      </div>
    </div>`;

  const slides = container.querySelectorAll('.co-slide');
  const slideLabels = ['Recommendation', 'Before Optimization'];
  let current  = 0;

  const goTo = (idx) => {
    slides[current].classList.remove('co-slide--active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('co-slide--active');
    container.querySelector('#co-slider-label').textContent = slideLabels[current];
  };

  container.querySelectorAll('.co-slide-btn').forEach(btn => {
    btn.addEventListener('click', () => goTo(current + parseInt(btn.dataset.dir)));
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmtNum(n) {
  const v = Number(n) || 0;
  if (Math.abs(v) > 999999) return `${(v / 1000000).toFixed(2)}M`;
  if (Math.abs(v) > 9999)   return `${Math.floor(v / 1000)}K`;
  return v % 1 === 0 ? v.toString() : (Math.floor(v * 100) / 100).toString();
}

let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;

  const css = `
.spoiler {
  filter: blur(8px);
}

.spoiler:hover {
  filter: blur(0);
}
.co-section-wrap { margin-top: 1.5rem; }

.co-panel {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.co-panel-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .6rem 1rem;
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--label);
  user-select: none;
  outline: none;
}
.co-panel-hd:hover { background: rgba(128,128,128,.06); }
.co-panel-hd:focus-visible { box-shadow: inset 0 0 0 2px var(--primary, #5a7de8); }

.co-chevron {
  font-size: .75rem;
  line-height: 1;
  transition: transform var(--transition-fast);
}
.co-panel-hd[aria-expanded="false"] .co-chevron { transform: rotate(-90deg); }
.co-panel-hd[aria-expanded="false"] + .co-body { display: none; }

.co-body {
  padding: .75rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid var(--border);
}

.co-block { display: flex; flex-direction: column; gap: .5rem; }
.co-block-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--text-muted);
}
.co-block-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: .15rem 0 .6rem;
  line-height: 1.55;
}

.co-equipped-wrap { display: flex; flex-direction: column; gap: .4rem; }
.co-equip-group { display: flex; flex-direction: column; gap: .3rem; }
.co-equip-lbl {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--label);
}
.co-slots-row { display: flex; flex-wrap: wrap; gap: .35rem; }
.co-slot { display: flex; align-items: center; gap: .3rem; }
.co-slot-lbl {
  font-size: var(--font-size-xs);
  color: var(--text-subtle);
  min-width: 1.3rem;
}

.co-slot .select-wrap { max-width: 11rem; }

.co-lock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 34px;
  font-size: .9rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  padding: 0;
  opacity: .4;
  transition:
    opacity var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast);
}
.co-lock-btn:hover { opacity: 1; }
.co-lock-btn[data-locked="true"] {
  opacity: 1;
  border-color: #e5a020;
  background: rgba(229,160,32,.12);
}
.co-unused-name-wrap { flex: 1; min-width: 0; }
.co-unused-qty-wrap { width: 5rem; flex-shrink: 0; }

.co-unused-list { display: flex; flex-direction: column; gap: .35rem; }
.co-unused-row { display: flex; gap: .4rem; align-items: center; flex-wrap: wrap; }

.co-buff-list { display: flex; flex-direction: column; gap: .35rem; }
.co-buff-row { display: flex; gap: .4rem; align-items: center; flex-wrap: wrap; }
.co-buff-stat-wrap { flex: 1; min-width: 9rem; max-width: 13rem; }
.co-buff-val-wrap { width: 6rem; flex-shrink: 0; }
.co-buff-val-wrap input {
  width: 100%;
  height: 34px;
  padding: 0 .5rem;
  font-size: var(--font-size-sm);
  background: var(--input-bg, var(--surface));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  outline: none;
  transition: border-color var(--transition-fast);
}
.co-buff-val-wrap input:focus { border-color: var(--primary, #5a7de8); }

.co-btn-group { display: flex; gap: .5rem; flex-wrap: wrap; }

.co-clear-btn { background: var(--danger, #c0392b); }
.co-clear-btn:hover { background: #a93226; }
.co-clear-btn:active { background: #922b21; }

.co-add-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  height: 34px;
  padding: 0 14px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  color: #fff;
  background: var(--secondary);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    background var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}
.co-add-btn:hover {
  background: #5a5f6b;
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}
.co-add-btn:active {
  transform: translateY(0) scale(.97);
  box-shadow: var(--shadow);
}

.co-rm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition:
    color var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}
.co-rm-btn:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
  transform: scale(1.05);
}
.co-rm-btn:active { transform: scale(.95); }

.co-run-row { justify-content: flex-end; }
#co-run-btn { background: #3a9648; }
#co-run-btn:hover { background: #32823e; }
#co-run-btn:active, #co-run-btn:focus { background: #286e34; }
#co-run-btn:focus-visible {
  box-shadow: 0 0 0 2px rgba(58, 150, 72, .5), 0 3px 8px rgba(0, 0, 0, .3);
}

.co-result { margin-top: .5rem; display: flex; flex-direction: column; gap: .85rem; }
.co-loading, .co-empty, .co-error {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: .5rem 0;
}
.co-error { color: #e55; }

.co-res-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6rem;
}
.co-res-hero-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: .65rem .75rem;
  border-radius: var(--radius);
  background: rgba(128,128,128,.07);
  border: 1px solid var(--border);
  gap: .15rem;
}
.co-res-hero-block.pos { border-color: rgba(87,171,104,.35); background: rgba(87,171,104,.07); }
.co-res-hero-block.neg { border-color: rgba(221,85,85,.3);   background: rgba(221,85,85,.06); }
.co-res-hero-val {
  font-size: var(--font-size-lg, 1.15rem);
  font-weight: var(--font-weight-bold);
  color: var(--text);
  letter-spacing: -.01em;
  line-height: 1.2;
}
.co-res-hero-block.pos .co-res-hero-val { color: #57ab68; }
.co-res-hero-block.neg .co-res-hero-val { color: #e55; }
.co-res-hero-lbl {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
}

.co-res-section { display: flex; flex-direction: column; gap: .4rem; }
.co-res-section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--text-muted);
}

.co-res-breakdown { display: flex; flex-direction: column; gap: .35rem; }
.co-res-equip { display: flex; gap: .5rem; align-items: flex-start; }
.co-res-equip-lbl {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--label);
  min-width: 5.5rem;
  padding-top: .2rem;
  flex-shrink: 0;
}
.co-res-cards { display: flex; flex-wrap: wrap; gap: .25rem; }
.co-chip {
  font-size: var(--font-size-xs);
  padding: .2rem .5rem;
  border-radius: 4px;
  background: rgba(128,128,128,.12);
  color: var(--text);
  border: 1px solid var(--border-subtle);
  white-space: nowrap;
}
.co-chip--locked {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  background: rgba(229,160,32,.15);
}
.co-chip--locked svg { flex-shrink: 0; }
.co-chip-qty {
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}
.co-res-note {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  line-height: 1.55;
  padding: .4rem .65rem;
  border-left: 2px solid var(--border);
}

.co-slider { display: flex; flex-direction: column; gap: .75rem; }
.co-slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: .4rem;
  border-bottom: 1px solid var(--border);
}
.co-slide { display: none; flex-direction: column; gap: .85rem; }
.co-slide--active { display: flex; }
.co-slider-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--text-muted);
}
.co-slider-nav {
  display: flex;
  align-items: center;
  gap: .4rem;
}
.co-slide-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 1.15rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast);
}
.co-slide-btn:hover {
  color: var(--text);
  border-color: var(--text-muted);
  background: rgba(128,128,128,.08);
}
.co-slide-dots { display: flex; gap: .35rem; align-items: center; }
.co-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}
.co-dot--active {
  background: var(--primary, #5a7de8);
  transform: scale(1.3);
}
`;

  const style = document.createElement('style');
  style.id = 'co-styles';
  style.textContent = css;
  document.head.appendChild(style);
}
