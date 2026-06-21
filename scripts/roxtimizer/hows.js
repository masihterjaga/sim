(function () {
  const ICON_PATHS = {
    divinity: 'M769-88 645-212l-88 88-43-43q-17-17-17-42t17-42l199-199q17-17 42-17t42 17l43 43-88 88 123 124q9 9 9 21t-9 21l-64 65q-9 9-21 9t-21-9Zm111-636L427-271l19 20q17 17 17 42t-17 42l-43 43-88-88L191-88q-9 9-21 9t-21-9l-65-65q-9-9-9-21t9-21l124-124-88-88 43-43q17-17 42-17t42 17l20 19 453-453h160v160ZM320-568l38-38 38-38-38 38-38 38Zm-42 42L80-724v-160h160l198 198-42 42-181-180h-75v75l180 181-42 42Zm105 212 437-435v-75h-75L308-389l75 75Zm0 0-37-38-38-37 38 37 37 38Z',
    cards: 'm604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z',
    companion: 'M169.86-485Q132-485 106-511.14t-26-64Q80-613 106.14-639t64-26Q208-665 234-638.86t26 64Q260-537 233.86-511t-64 26Zm185-170Q317-655 291-681.14t-26-64Q265-783 291.14-809t64-26Q393-835 419-808.86t26 64Q445-707 418.86-681t-64 26Zm250 0Q567-655 541-681.14t-26-64Q515-783 541.14-809t64-26Q643-835 669-808.86t26 64Q695-707 668.86-681t-64 26Zm185 170Q752-485 726-511.14t-26-64Q700-613 726.14-639t64-26Q828-665 854-638.86t26 64Q880-537 853.86-511t-64 26ZM266-75q-42 0-69-31.53-27-31.52-27-74.47 0-42 25.5-74.5T250-318q22-22 41-46.5t36-50.5q29-44 65-82t88-38q52 0 88.5 38t65.5 83q17 26 35.5 50t40.5 46q29 30 54.5 62.5T790-181q0 42.95-27 74.47Q736-75 694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z',
    enchant: 'm320-240 160-122 160 122-64-197 160-113H541l-61-203-62 203H223l160 113-63 197ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z',
    pin: 'M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z',
    bars: 'M80-120v-720h80v720H80Zm160 0v-420h80v420h-80Zm160 0v-300h80v300h-80Zm160 0v-540h80v540h-80Zm160 0v-180h80v180h-80Zm160 0v-660h80v660h-80Z',
    close: 'M256-192 192-256l224-224-224-224 64-64 224 224 224-224 64 64-224 224 224 224-64 64-224-224-224 224Z'
  };

  const NODES = [
    { key: 'divinity', name: 'Divinity',
      desc: `Honestly. I'm lazy to write a real how-to for this. More motivated when I'm prompting and blaming AI for bugs.` },
    { key: 'cards', name: 'Cards',
      desc: `So, if you think the content here is going to be some integrated guide on how to use this tool, well, obviously not.` },
    { key: 'companion', name: 'Companion',
      desc: `Especially since this is a personal-use tool anyway. I'm not gonna explain much. Every feature here exists because I needed it.` },
    { key: 'enchant', name: 'Enchantment',
      desc: `If you wanna use it, explore on your own how it works. It's like that in ROX too, right? We're all blind <img alt=":pepekekcry:" src="https://masihterjaga.github.io/sim/img/pepekekcry.png" width="13" height="13">` }
  ];

  const DIV_COLORS = [
    { bg: 'rgba(91,142,240,0.18)', border: 'rgba(91,142,240,0.50)', text: 'rgba(91,142,240,0.90)' },
    { bg: 'rgba(140,85,230,0.18)', border: 'rgba(140,85,230,0.50)', text: 'rgba(140,85,230,0.90)' },
    { bg: 'rgba(200,136,10,0.18)', border: 'rgba(200,136,10,0.50)', text: 'rgba(200,136,10,0.90)' }
  ];
  const ICON_COLORS = ['rgba(91,142,240,0.72)', 'rgba(200,136,10,0.72)'];
  const PIN_COLORS  = ['rgba(91,142,240,0.72)', 'rgba(140,85,230,0.72)', 'rgba(200,136,10,0.72)'];
  const COMP_COLORS = [
    { bg: 'rgba(140,85,230,0.30)', border: 'rgba(140,85,230,0.55)' },
    { bg: 'rgba(200,136,10,0.25)', border: 'rgba(200,136,10,0.50)' }
  ];

  const SLOT_W = 34;
  const SLOT_H = 55;
  const IDX3 = [0, 1, 2];
  const IDX4 = [0, 1, 2, 3];
  const IDX8 = [0, 1, 2, 3, 4, 5, 6, 7];

  const CARD_IDS = IDX3.map(i => `cardIcon${i}`);
  const PIN_IDS  = IDX3.map(i => `pinIcon${i}`);

  const TICK_INTERVALS = { divinity: 1597, slot: 2584, companion: 987, vis: 1597 };
  const POPUP_GIF_URL  = 'https://masihterjaga.github.io/sim/img/optimized.gif';

  const modalRuntime = { timers: { intervals: [], timeouts: [] }, onKeydown: null };

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function svgIcon(path, cls) {
    const c = cls ? ` class="${cls}"` : '';
    return `<svg${c} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="${path}"/></svg>`;
  }

  function applyVisualState(el, { bg, border, text }) {
    el.style.background = bg;
    el.style.borderColor = border;
    el.style.color = text;
  }

  function setAxisTransform(el, axis, value, transition) {
    if (transition !== undefined) el.style.transition = transition;
    el.style.transform = `translate${axis}(${value}px)`;
  }

  function onceAnimationEnd(el, removeClass) {
    el.addEventListener('animationend', () => el.classList.remove(removeClass), { once: true });
  }

  function replay(el, addClass, removeClasses = [addClass]) {
    el.classList.remove(...removeClasses);
    void el.offsetWidth;
    el.classList.add(addClass);
  }

  function buildNodeRowHTML(n) {
    return `
      <div class="modal-node-row">
        <div class="modal-node-head">
          ${svgIcon(ICON_PATHS[n.key], `modal-node-icon modal-node-icon--${n.key}`)}
          <span class="modal-node-name modal-node-name--${n.key}">${n.name}</span>
        </div>
        <p class="modal-node-desc">${n.desc}</p>
      </div>`;
  }

  function buildVisGroupHTML(rowId, labelKey, innerHTML, idx) {
    const rowAttr = rowId ? ` id="${rowId}"` : '';
    return `
      <div class="modal-vis-group" id="visGroup${idx}">
        <div class="modal-vis-label modal-vis-label--${labelKey}">${svgIcon(ICON_PATHS[labelKey])}</div>
        <div class="vis-row"${rowAttr}>${innerHTML}</div>
      </div>`;
  }

  function renderStatsModal() {
    if (document.getElementById('statsModal')) return;

    const nodeRows = NODES.map(buildNodeRowHTML).join('');

    const divCircles = IDX8.map(i =>
      `<div class="div-circle" data-idx="${i}"><span class="div-num">${i + 1}</span></div>`).join('');
    const cardIcons = CARD_IDS.map(id => `<div class="card-icon" id="${id}">${svgIcon(ICON_PATHS.cards)}</div>`).join('');
    const pinIcons  = PIN_IDS.map(id => `<div class="pin-icon" id="${id}">${svgIcon(ICON_PATHS.pin)}</div>`).join('');
    const compCircles = IDX4.map(i => `<div class="comp-circle" id="compC${i}"></div>`).join('');

    const visGroups = [
      buildVisGroupHTML('divCircles', 'divinity', divCircles, 0),
      buildVisGroupHTML('cardIcons', 'cards', cardIcons, 1),
      buildVisGroupHTML(null, 'companion', `<div class="comp-wrap" id="compCircles">${compCircles}</div>`, 2),
      buildVisGroupHTML('pinIcons', 'enchant', pinIcons, 3)
    ].join('');

    const html = `
<div class="modal-overlay" id="statsModal">
  <div class="modal-panel">

    <button class="modal-close" id="modalClose" aria-label="Close">${svgIcon(ICON_PATHS.close)}</button>

    <div class="modal-header">
      <div class="modal-header-top">
        ${svgIcon(ICON_PATHS.bars, 'modal-header-icon')}
        <span class="modal-title">Stats</span>
      </div>
      <p class="modal-desc">The actual order for using this tool: set up Divinity, Cards, Companion, and Enchantment first. Then input your total stats in the form at the top of the page.<br><br>Though it doesn't really matter, as long as it matches your in-game detailed stats. Input from wherever you want, just make sure nothing changes after the form at the top is filled in.</p>
    </div>

    <div class="modal-divider"></div>

    <div class="modal-nodes">${nodeRows}
    </div>

    <div class="modal-vis">

      <div class="modal-vis-header">
        <span class="modal-node-name">Visualization</span>
        <p class="modal-node-desc">Tap Calctimize, you'll see how this tool works, Stop to see your best build.</p>
      </div>

      <div class="modal-vis-rows" id="visRows">${visGroups}
      </div>

    </div>

    <button class="modal-calctimize" id="modalCalctimize">Calctimize</button>

  </div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    initStatsModal();
  }

  function clearModalTimers() {
    modalRuntime.timers.intervals.forEach(clearInterval);
    modalRuntime.timers.timeouts.forEach(clearTimeout);
    modalRuntime.timers.intervals = [];
    modalRuntime.timers.timeouts = [];
  }

  function closeStatsModal() {
    const overlay = document.getElementById('statsModal');
    if (!overlay) return;
    clearModalTimers();
    if (modalRuntime.onKeydown) document.removeEventListener('keydown', modalRuntime.onKeydown);
    document.querySelector('.gif-popup')?.remove();
    overlay.classList.remove('open');
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 233);
  }

  function buildGifPopupHTML() {
    return `
<div class="gif-card">
  <div class="gif-flip" id="gifFlip">
    <div class="gif-front"><img alt="Bejomaru Card" src="${POPUP_GIF_URL}"></div>
<div class="gif-back">
  <div class="effect">
    <p class="basic">Bns DMG to <img width="13" height="13" alt="Pak Alan" src="https://masihterjaga.github.io/sim/img/hai.png">: +888%<br/>
    Bns DMG to Developer: +88%
    </p>
    <p class="exclusive">
      Equipping <u>Bejomaru Card [2048]</u> grants the following effects:<br/>
      • Each basic attack / skill increases Final DMG Bonus by 88 % (max 8 stacks)<br/>
      • Zeny, Base EXP, Job EXP & Card drop ×8 in the wilderness<br/>
      • Guaranteed rare reward on Hit & Run from MVP/Mini (excludes Tome & Divinities)<br/>
      • Guaranteed Flash & all usable stats when upgrading Spear, Blade, Chanter, and Reaper (1x each) to max<br/>
      • Upgrade / enchant / refine success rate up to 88%<br/>
      • At least 1 Costume / Card / Pet guaranteed per week from Trial Illusions<br/>
      • EC-listed items prioritized (easy to sell)<br/>
      • 88k Dias sent via mail every month.
    </p>
  </div>
</div>
  </div>
  <div class="grats"><strong>Bejomaru Card [2048]</strong></div>
</div>
<button class="gif-popup-close">${svgIcon(ICON_PATHS.close)} SKIP</button>`;
  }

  function initStatsModal() {
    const el = id => document.getElementById(id);

    const after = (fn, ms) => { const id = setTimeout(fn, ms); modalRuntime.timers.timeouts.push(id); return id; };
    const every = (fn, ms) => { const id = setInterval(fn, ms); modalRuntime.timers.intervals.push(id); return id; };

    function triggerSpinSlot(domEl, colorPool) {
      domEl.style.color = rand(colorPool);
      replay(domEl, 'spinning');
      onceAnimationEnd(domEl, 'spinning');
    }

    function tickDivinity() {
      const nums = shuffle(IDX8.map(i => i + 1));
      document.querySelectorAll('#divCircles .div-circle').forEach((circle, i) => {
        after(() => {
          const c = rand(DIV_COLORS);
          const span = circle.querySelector('.div-num');
          replay(span, 'shuffle-out', ['shuffle-in', 'shuffle-out']);
          after(() => {
            applyVisualState(circle, c);
            span.textContent = nums[i];
            replay(span, 'shuffle-in', ['shuffle-out']);
            onceAnimationEnd(span, 'shuffle-in');
          }, 144);
        }, i * 144);
      });
    }

    function tickSlotRow(ids, colorPool, stagger) {
      ids.forEach((id, i) => after(() => triggerSpinSlot(el(id), colorPool), i * stagger));
    }

    function tickCompanion() {
      const slots = shuffle(IDX4);
      IDX4.forEach(i => after(() => {
        applyVisualState(el(`compC${i}`), rand(COMP_COLORS));
        setAxisTransform(el(`compC${i}`), 'X', slots[i] * SLOT_W);
      }, i * 89));
    }

    function tickVisGroups() {
      const slots = shuffle(IDX4);
      IDX4.forEach(i => after(() => setAxisTransform(el(`visGroup${i}`), 'Y', slots[i] * SLOT_H, ''), i * 89));
    }

    const TICKS = [
      { fn: tickDivinity, interval: TICK_INTERVALS.divinity },
      { fn: () => tickSlotRow(CARD_IDS, ICON_COLORS, 233), interval: TICK_INTERVALS.slot },
      { fn: tickCompanion, interval: TICK_INTERVALS.companion },
      { fn: () => tickSlotRow(PIN_IDS, PIN_COLORS, 233), interval: TICK_INTERVALS.slot },
      { fn: tickVisGroups, interval: TICK_INTERVALS.vis }
    ];

    let running = false;

    function start() {
      running = true;
      el('modalCalctimize').textContent = 'Stop';
      TICKS.forEach(({ fn, interval }) => { fn(); every(fn, interval); });
    }

    function showGifPopup(btn) {
      const popup = document.createElement('div');
      popup.className = 'gif-popup';
      popup.innerHTML = buildGifPopupHTML();
      document.body.appendChild(popup);

      const flipEl = popup.querySelector('#gifFlip');
      flipEl.addEventListener('animationend', () => {
        flipEl.style.animation = 'none';
        flipEl.style.transition = 'transform 610ms cubic-bezier(0.19,1,0.22,1)';
      }, { once: true });
      flipEl.addEventListener('click', () => flipEl.classList.toggle('flipped'));

      popup.querySelector('.gif-popup-close').addEventListener('click', () => {
        popup.remove();
        btn.disabled = false;
      });
    }

    function stop() {
      running = false;
      clearModalTimers();
      const btn = el('modalCalctimize');
      btn.textContent = 'Calctimize';
      btn.disabled = true;
      showGifPopup(btn);
    }

    function onKeydown(e) {
      if (e.key !== 'Escape') return;
      closeStatsModal();
    }

    IDX4.forEach(i => setAxisTransform(el(`compC${i}`), 'X', i * SLOT_W));
    IDX4.forEach(i => setAxisTransform(el(`visGroup${i}`), 'Y', i * SLOT_H, 'none'));

    const overlay = el('statsModal');
    el('modalCalctimize').addEventListener('click', () => running ? stop() : start());
    el('modalClose').addEventListener('click', closeStatsModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeStatsModal(); });
    modalRuntime.onKeydown = onKeydown;
    document.addEventListener('keydown', onKeydown);
  }

  function openStatsModal() {
    const overlay = document.getElementById('statsModal');
    if (!overlay) return;
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
  }

  window.renderStatsModal = renderStatsModal;
  window.closeStatsModal = closeStatsModal;
  window.initStatsModal = initStatsModal;
  window.openStatsModal = openStatsModal;
})();
