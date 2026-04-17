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

const MAX_EVAL_LIMIT = 88_888;

const STAT_RESOLVERS = {
  'Final P.PEN':  (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
  'Final M.PEN':  (ctx) => ctx.atkType === 'pen'  ? 'pen'  : null,
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
  'Bonus DMG to Fire Attribute Monster':    (ctx) => ctx.tAttr === 'Fire'    ? 'attr' : null,
  'Bonus DMG to Water Attribute Monster':   (ctx) => ctx.tAttr === 'Water'   ? 'attr' : null,
  'Bonus DMG to Wind Attribute Monster':    (ctx) => ctx.tAttr === 'Wind'    ? 'attr' : null,
  'Bonus DMG to Earth Attribute Monster':   (ctx) => ctx.tAttr === 'Earth'   ? 'attr' : null,
  'Bonus DMG to Holy Attribute Monster':    (ctx) => ctx.tAttr === 'Holy'    ? 'attr' : null,
  'Bonus DMG to Shadow Attribute Monster':  (ctx) => ctx.tAttr === 'Shadow'  ? 'attr' : null,
  'Bonus DMG to Ghost Attribute Monster':   (ctx) => ctx.tAttr === 'Ghost'   ? 'attr' : null,
  'Bonus DMG to Poison Attribute Monster':  (ctx) => ctx.tAttr === 'Poison'  ? 'attr' : null,
  'Bonus DMG to Undead Attribute Monster':  (ctx) => ctx.tAttr === 'Undead'  ? 'attr' : null,
  'Bonus DMG to Neutral Attribute Monster': (ctx) => ctx.tAttr === 'Neutral' ? 'attr' : null,
};

function parseStatValue(raw) {
  if (typeof raw !== 'string' || !raw.includes('%')) return null;
  return parseFloat(raw.replace('%', '').replace(/,/g, ''));
}

function lookupCard(cardName) {
  return cardData[cardName] ?? null;
}

const STAT_DEDUP_GROUPS = [
  ['Final P.DMG Bonus', 'Final M.DMG Bonus'],
  ['Final P.PEN',       'Final M.PEN'      ],
];

function getCardStatDelta(cardName, ctx) {
  const card = lookupCard(cardName);
  if (!card) return null;

  const delta = { pen: 0, crit: 0, dmg: 0, elemEnh: 0, sizeEnh: 0, race: 0, attr: 0, dmgStack: 0 };

  const skipStats = new Set();
  for (const group of STAT_DEDUP_GROUPS) {
    const present = group.filter(s => s in card.stats);
    if (present.length > 1) {
      for (const s of present.slice(1)) skipStats.add(s);
    }
  }

  for (const [statName, rawVal] of Object.entries(card.stats)) {
    if (skipStats.has(statName)) continue;
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

function runOptimizer(baseState, cardPool, slotCounts, ctx, currentMult) {
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

  return overflowed
    ? runGreedyOptimizer(baseState, cardPool, slotCounts, equipTypes, ctx, combosPerEquip)
    : runExactOptimizer(baseState, combosPerEquip, equipTypes, ctx, currentMult);
}

function runExactOptimizer(baseState, combosPerEquip, equipTypes, ctx, currentMult) {
  let bestMult = currentMult;
  let bestCards = null;

  function recurse(equipIdx, cardsSoFar, currentState) {
    if (equipIdx === equipTypes.length) {
      const { mult } = calculateMultiplier(currentState);
      if (mult > bestMult) {
        bestMult = mult;
        bestCards = [...cardsSoFar];
      }
      return;
    }
    for (const combo of combosPerEquip[equipTypes[equipIdx]]) {
      const nextState = applyCards(currentState, combo, ctx);
      if (equipIdx === equipTypes.length - 1) {
        const { mult } = calculateMultiplier(nextState);
        if (mult <= bestMult) continue;
      }
      recurse(equipIdx + 1, cardsSoFar.concat(combo), nextState);
    }
  }

  recurse(0, [], baseState);

  if (!bestCards) return { topResults: [], mode: 'exact' };

  return { topResults: [{ cards: bestCards, mult: bestMult }], mode: 'exact' };
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
  const ctx = {
    atkType: calcState.atkType,
    wElem:   calcState.wElem,
    tSize:   calcState.tSize,
    tRace:   calcState.tRace,
    tAttr:   calcState.tAttr,
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
            Select the currently equipped cards, then add any cards relevant to the target. Lock slots if specific cards are needed for an exclusive set.<br/><br/>Results may not fully match in-game values, especially for cards with ATK% because this feature is still a work in progress, and some stats may be missing.
          </p>
          <div id="co-equipped-slots" class="co-equipped-wrap">${equippedSlotsHTML}</div>
          <button class="co-add-btn co-clear-btn" id="co-unequip-all" type="button">Unequip All</button>
        </div>

        <div class="co-block">
          <div class="co-block-title">Unused Cards (owned but not equipped)</div>
          <p class="spoiler co-block-desc">Or any cards you're dreaming of and definitely can't afford, here you GO! <img alt=":dogekek:" src="https://masihterjaga.github.io/sim/img/dogekek.png" width="14" height="14"></img></p>
          <div id="co-unused-list" class="co-unused-list"></div>
          <div class="co-btn-group">
            <button class="co-add-btn" id="co-add-unused" type="button">+ Add Card</button>
            <button class="co-add-btn co-clear-btn" id="co-dismantle-all" type="button">Dismantle All</button>
          </div>
        </div>

        <div class="co-block">
          <div class="co-block-title">Equipment Effect / Buffs</div>
          <p class="co-block-desc">
            If there are exclusive effects (elemental bonus, damage bonus, etc.) from card / eq (except headgear), add them here. Make sure these haven't already been included in the base inputs before Calculate.<br/><br/>
            It is highly recommended to always add the Dancer's/Bard's Eternal Chaos or GS's Glorious Command bonus here for better accuracy.
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
  const qtyOptions = Array.from({ length: 6 }, (_, i) =>
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
      if (!locked[key]) continue;
      btn.dataset.locked = 'true';
      btn.innerHTML      = LOCK_CLOSED_SVG;
      btn.title          = 'Unlock slot';
    }

    for (const { stat, val } of buffs) addBuffRow(section, stat, val);
    for (const { name, qty } of unused) addUnusedRow(section, name, qty);
  } catch (_) {}
}

function runAndRender(section, calcState, ctx) {
  const resultEl = section.querySelector('#co-result');
  resultEl.hidden = false;
  resultEl.innerHTML = '<div class="co-loading">Still finding…</div>';

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

      const lockedBaseState   = applyCards(baseState, allLockedNames, ctx);
      const currentSetupState = applyCards(lockedBaseState, nonLockedEquipped, ctx);
      const currentMult       = calculateMultiplier(currentSetupState).mult;

      const { topResults } = runOptimizer(lockedBaseState, cardPool, slotCounts, ctx, currentMult);

      if (topResults.length && allLockedNames.length) {
        topResults[0].cards = [...allLockedNames, ...topResults[0].cards];
      }

      if (!topResults.length || topResults[0].mult < currentMult) {
        topResults.unshift({
          cards: [...allLockedNames, ...nonLockedEquipped],
          mult:  currentMult,
        });
      }

      renderResults(resultEl, topResults, baseState, currentMult, lockedCards, equippedNames, ctx);
    } catch (err) {
      resultEl.innerHTML = `<div class="co-error">Error: ${esc(err.message)}</div>`;
    }
  }, 30);
}

function renderResults(container, topResults, baseState, currentMult, lockedCards = {}, equippedNames = [], ctx = {}) {
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
    }).join('') || '<em class="co-empty">No cards</em>';

  const byEquip = {};
  for (const name of best.cards) {
    const card = lookupCard(name);
    if (!card) continue;
    const equipPool = (byEquip[card.equip] ??= {});
    equipPool[name] = (equipPool[name] || 0) + 1;
  }

  const noteHTML = pctRaw >= 0 && pctRaw <= 5
    ? `<div class="co-res-note">Current setup is good already. Feel free to use these or just stick with what's in use.</div>`
    : '';

  const finalState  = applyCards(baseState, best.cards, ctx);
  const beforeState = applyCards(baseState, equippedNames.filter(n => n && n !== '—'), ctx);

  const beforeByEquip = {};
  for (const name of equippedNames) {
    if (!name || name === '—') continue;
    const card = lookupCard(name);
    if (!card) continue;
    const pool = (beforeByEquip[card.equip] ??= {});
    pool[name] = (pool[name] || 0) + 1;
  }

  const FINAL_STAT_LABELS = [
    { field: 'pen',      label: 'Final PEN'            },
    { field: 'dmg',      label: 'Final P/M DMG Bonus'  },
    { field: 'elemEnh',  label: 'Element Enhance'       },
    { field: 'sizeEnh',  label: 'DMG to Size'           },
    { field: 'race',     label: 'DMG to Race'           },
    { field: 'attr',     label: 'DMG to Attribute'      },
    { field: 'dmgStack', label: 'Final DMG Bonus'       },
  ];

  const finalStatsHTML = `
    <div class="co-res-section co-res-final-stats">
      <div class="co-res-section-title">Final Stats</div>
      <div class="co-final-stats-grid">
        ${FINAL_STAT_LABELS.map(({ field, label }) => {
          const val     = finalState[field] ?? 0;
          const prevVal = beforeState[field] ?? 0;
          const diff    = val - prevVal;
          const arrow   = diff > 0
            ? '<svg class="co-stat-arrow co-stat-arrow--up" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8-12 8 12z"/></svg>'
            : diff < 0
            ? '<svg class="co-stat-arrow co-stat-arrow--down" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6l8 12 8-12z"/></svg>'
            : '';
          return '<div class="co-final-stat-row">'
            + '<span class="co-final-stat-lbl">' + label + '</span>'
            + '<span class="co-final-stat-val">' + fmtNum(val) + '%' + arrow + '</span>'
            + '</div>';
        }).join('')}
      </div>
    </div>`;

  const slide1HTML = `
    <div class="co-res-section">
      <div class="co-res-section-title">Recommended Cards</div>
      <div class="co-res-breakdown">${buildBreakdownHTML(byEquip, lockedCountByEquip)}</div>
    </div>
    ${finalStatsHTML}
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

  const beforeStatsHTML = `
    <div class="co-res-section co-res-final-stats">
      <div class="co-res-section-title">Final Stats</div>
      <div class="co-final-stats-grid">
        ${FINAL_STAT_LABELS.map(({ field, label }) => {
          const val = beforeState[field] ?? 0;
          return `<div class="co-final-stat-row">
            <span class="co-final-stat-lbl">${label}</span>
            <span class="co-final-stat-val">${fmtNum(val)}%</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  const slide2HTML = `
    <div class="co-res-section">
      <div class="co-res-section-title">Current Cards</div>
      <div class="co-res-breakdown">${buildBreakdownHTML(beforeByEquip)}</div>
    </div>
    ${beforeStatsHTML}
    <div class="co-res-hero">
      <div class="co-res-hero-block">
        <div class="co-res-hero-val">×${fmtNum(currentMult / rawAttack)}</div>
        <div class="co-res-hero-lbl">Current Multiplier</div>
      </div>
      <div class="co-res-hero-block">
        <div class="co-res-hero-val">BASE</div>
        <div class="co-res-hero-lbl">Current</div>
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

  const slides      = container.querySelectorAll('.co-slide');
  const slideLabels = ['Recommendation', 'Before Optimization'];
  let current       = 0;

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