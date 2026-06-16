function renderStatsModal() {
  if (document.getElementById('statsModal')) return;
  const html = `
<div class="modal-overlay" id="statsModal">
  <div class="modal-panel">

    <button class="modal-close" id="modalClose" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="M256-192 192-256l224-224-224-224 64-64 224 224 224-224 64 64-224 224 224 224-64 64-224-224-224 224Z"/>
      </svg>
    </button>

    <div class="modal-header">
      <div class="modal-header-top">
        <svg class="modal-header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M80-120v-720h80v720H80Zm160 0v-420h80v420h-80Zm160 0v-300h80v300h-80Zm160 0v-540h80v540h-80Zm160 0v-180h80v180h-80Zm160 0v-660h80v660h-80Z"/>
        </svg>
        <span class="modal-title">Stats</span>
      </div>
      <p class="modal-desc">The actual order for using this tool: set up Divinity, Cards, Companion, and Enchantment first. Then input your total stats in the form at the top of the page.<br><br>Though it doesn't really matter, as long as it matches your in-game detailed stats. Input from wherever you want, just make sure nothing changes after the form at the top is filled in.</p>
    </div>

    <div class="modal-divider"></div>

    <div class="modal-nodes">

      <div class="modal-node-row" style="transition-delay:89ms">
        <div class="modal-node-head">
          <svg class="modal-node-icon" style="color:rgb(91,142,240)" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M769-88 645-212l-88 88-43-43q-17-17-17-42t17-42l199-199q17-17 42-17t42 17l43 43-88 88 123 124q9 9 9 21t-9 21l-64 65q-9 9-21 9t-21-9Zm111-636L427-271l19 20q17 17 17 42t-17 42l-43 43-88-88L191-88q-9 9-21 9t-21-9l-65-65q-9-9-9-21t9-21l124-124-88-88 43-43q17-17 42-17t42 17l20 19 453-453h160v160ZM320-568l38-38 38-38-38 38-38 38Zm-42 42L80-724v-160h160l198 198-42 42-181-180h-75v75l180 181-42 42Zm105 212 437-435v-75h-75L308-389l75 75Zm0 0-37-38-38-37 38 37 37 38Z"/>
          </svg>
          <span class="modal-node-name" style="color:rgb(91,142,240)">Divinity</span>
        </div>
        <p class="modal-node-desc">Honestly. I'm lazy to write a real how-to for this. More motivated when I'm prompting and blaming AI for bugs.</p>
      </div>

      <div class="modal-node-row" style="transition-delay:144ms">
        <div class="modal-node-head">
          <svg class="modal-node-icon" style="color:rgb(140,85,230)" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="m604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z"/>
          </svg>
          <span class="modal-node-name" style="color:rgb(140,85,230)">Cards</span>
        </div>
        <p class="modal-node-desc">So, if you think the content here is going to be some integrated guide on how to use this tool, well, obviously not.</p>
      </div>

      <div class="modal-node-row" style="transition-delay:233ms">
        <div class="modal-node-head">
          <svg class="modal-node-icon" style="color:rgb(60,200,120)" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M169.86-485Q132-485 106-511.14t-26-64Q80-613 106.14-639t64-26Q208-665 234-638.86t26 64Q260-537 233.86-511t-64 26Zm185-170Q317-655 291-681.14t-26-64Q265-783 291.14-809t64-26Q393-835 419-808.86t26 64Q445-707 418.86-681t-64 26Zm250 0Q567-655 541-681.14t-26-64Q515-783 541.14-809t64-26Q643-835 669-808.86t26 64Q695-707 668.86-681t-64 26Zm185 170Q752-485 726-511.14t-26-64Q700-613 726.14-639t64-26Q828-665 854-638.86t26 64Q880-537 853.86-511t-64 26ZM266-75q-42 0-69-31.53-27-31.52-27-74.47 0-42 25.5-74.5T250-318q22-22 41-46.5t36-50.5q29-44 65-82t88-38q52 0 88.5 38t65.5 83q17 26 35.5 50t40.5 46q29 30 54.5 62.5T790-181q0 42.95-27 74.47Q736-75 694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/>
          </svg>
          <span class="modal-node-name" style="color:rgb(60,200,120)">Companion</span>
        </div>
        <p class="modal-node-desc">Especially since this is a personal-use tool anyway. I'm not gonna explain much. Every feature here exists because I needed it.</p>
      </div>

      <div class="modal-node-row" style="transition-delay:377ms">
        <div class="modal-node-head">
          <svg class="modal-node-icon" style="color:rgb(200,136,10)" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="m320-240 160-122 160 122-64-197 160-113H541l-61-203-62 203H223l160 113-63 197ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
          </svg>
          <span class="modal-node-name" style="color:rgb(200,136,10)">Enchantment</span>
        </div>
        <p class="modal-node-desc">If you wanna use it, explore on your own how it works. It's like that in ROX too, right? We're all blind <img alt=":pepekekcry:" src="https://masihterjaga.github.io/sim/img/pepekekcry.png" width="13" height="13"></p>
      </div>

    </div>

    <div class="modal-vis">

      <div class="modal-vis-header">
        <span class="modal-node-name" style="color:var(--muted)">Visualization</span>
        <p class="modal-node-desc">Tap Calctimize, you'll see how this tool works, Stop to see your best build.</p>
      </div>

      <div class="modal-vis-rows" id="visRows">

      <div class="modal-vis-group" id="visGroup0" style="transform:translateY(0px); transition:none">
        <div class="modal-vis-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" style="color:rgb(91,142,240)">
            <path d="M769-88 645-212l-88 88-43-43q-17-17-17-42t17-42l199-199q17-17 42-17t42 17l43 43-88 88 123 124q9 9 9 21t-9 21l-64 65q-9 9-21 9t-21-9Zm111-636L427-271l19 20q17 17 17 42t-17 42l-43 43-88-88L191-88q-9 9-21 9t-21-9l-65-65q-9-9-9-21t9-21l124-124-88-88 43-43q17-17 42-17t42 17l20 19 453-453h160v160ZM320-568l38-38 38-38-38 38-38 38Zm-42 42L80-724v-160h160l198 198-42 42-181-180h-75v75l180 181-42 42Zm105 212 437-435v-75h-75L308-389l75 75Zm0 0-37-38-38-37 38 37 37 38Z"/>
          </svg>
        </div>
        <div class="vis-row" id="divCircles">
          <div class="div-circle" data-idx="0"><span class="div-num">1</span></div>
          <div class="div-circle" data-idx="1"><span class="div-num">2</span></div>
          <div class="div-circle" data-idx="2"><span class="div-num">3</span></div>
          <div class="div-circle" data-idx="3"><span class="div-num">4</span></div>
          <div class="div-circle" data-idx="4"><span class="div-num">5</span></div>
          <div class="div-circle" data-idx="5"><span class="div-num">6</span></div>
          <div class="div-circle" data-idx="6"><span class="div-num">7</span></div>
          <div class="div-circle" data-idx="7"><span class="div-num">8</span></div>
        </div>
      </div>

      <div class="modal-vis-group" id="visGroup1" style="transform:translateY(55px); transition:none">
        <div class="modal-vis-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" style="color:rgb(140,85,230)">
            <path d="m604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z"/>
          </svg>
        </div>
        <div class="vis-row" id="cardIcons">
          <div class="card-icon" id="cardIcon0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z"/>
            </svg>
          </div>
          <div class="card-icon" id="cardIcon1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z"/>
            </svg>
          </div>
          <div class="card-icon" id="cardIcon2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m604-389 40-145-124-85-40 145 124 85ZM195-160 56-217l139-330v387Zm60 58v-395l147 395H255Zm209-4L231-741l432-156 235 633-434 158Zm36-78 318-116-191-519-318 115 191 520Zm64-318Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="modal-vis-group" id="visGroup2" style="transform:translateY(110px); transition:none">
        <div class="modal-vis-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" style="color:rgb(60,200,120)">
            <path d="M169.86-485Q132-485 106-511.14t-26-64Q80-613 106.14-639t64-26Q208-665 234-638.86t26 64Q260-537 233.86-511t-64 26Zm185-170Q317-655 291-681.14t-26-64Q265-783 291.14-809t64-26Q393-835 419-808.86t26 64Q445-707 418.86-681t-64 26Zm250 0Q567-655 541-681.14t-26-64Q515-783 541.14-809t64-26Q643-835 669-808.86t26 64Q695-707 668.86-681t-64 26Zm185 170Q752-485 726-511.14t-26-64Q700-613 726.14-639t64-26Q828-665 854-638.86t26 64Q880-537 853.86-511t-64 26ZM266-75q-42 0-69-31.53-27-31.52-27-74.47 0-42 25.5-74.5T250-318q22-22 41-46.5t36-50.5q29-44 65-82t88-38q52 0 88.5 38t65.5 83q17 26 35.5 50t40.5 46q29 30 54.5 62.5T790-181q0 42.95-27 74.47Q736-75 694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/>
          </svg>
        </div>
        <div class="vis-row">
          <div class="comp-wrap" id="compCircles">
            <div class="comp-circle" id="compC0" style="transform:translateX(0px)"></div>
            <div class="comp-circle" id="compC1" style="transform:translateX(29px)"></div>
            <div class="comp-circle" id="compC2" style="transform:translateX(58px)"></div>
            <div class="comp-circle" id="compC3" style="transform:translateX(87px)"></div>
          </div>
        </div>
      </div>

      <div class="modal-vis-group" id="visGroup3" style="transform:translateY(165px); transition:none">
        <div class="modal-vis-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" style="color:rgb(200,136,10)">
            <path d="m320-240 160-122 160 122-64-197 160-113H541l-61-203-62 203H223l160 113-63 197ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
          </svg>
        </div>
        <div class="vis-row" id="pinIcons">
          <div class="pin-icon" id="pinIcon0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z"/>
            </svg>
          </div>
          <div class="pin-icon" id="pinIcon1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z"/>
            </svg>
          </div>
          <div class="pin-icon" id="pinIcon2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z"/>
            </svg>
          </div>
        </div>
      </div>

      </div>

    </div>

    <button class="modal-calctimize" id="modalCalctimize">Calctimize</button>

  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  initStatsModal();
}

function initStatsModal() {
  const el   = id => document.getElementById(id);
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];

  const DIV_COLORS  = [
    { bg: 'rgba(91,142,240,0.18)',  border: 'rgba(91,142,240,0.50)',  text: 'rgba(91,142,240,0.90)'  },
    { bg: 'rgba(140,85,230,0.18)',  border: 'rgba(140,85,230,0.50)',  text: 'rgba(140,85,230,0.90)'  },
    { bg: 'rgba(200,136,10,0.18)',  border: 'rgba(200,136,10,0.50)',  text: 'rgba(200,136,10,0.90)'  },
  ];
  const ICON_COLORS = ['rgba(91,142,240,0.72)', 'rgba(200,136,10,0.72)'];
  const PIN_COLORS  = ['rgba(91,142,240,0.72)', 'rgba(140,85,230,0.72)', 'rgba(200,136,10,0.72)'];
  const COMP_COLORS = [
    { bg: 'rgba(140,85,230,0.30)', border: 'rgba(140,85,230,0.55)' },
    { bg: 'rgba(200,136,10,0.25)', border: 'rgba(200,136,10,0.50)' },
  ];

  const SLOT_W = 34;
  const SLOT_H = 55;
  const IDX4   = [0, 1, 2, 3];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const timers = { intervals: [], timeouts: [] };
  const after  = (fn, ms) => { const id = setTimeout(fn, ms);   timers.timeouts.push(id);  return id; };
  const every  = (fn, ms) => { const id = setInterval(fn, ms);  timers.intervals.push(id); return id; };

  function clearAll() {
    timers.intervals.forEach(clearInterval);
    timers.timeouts.forEach(clearTimeout);
    timers.intervals = [];
    timers.timeouts  = [];
  }

  function triggerSpinSlot(domEl, colorPool) {
    domEl.classList.remove('spinning');
    void domEl.offsetWidth;
    domEl.classList.add('spinning');
    domEl.style.color = rand(colorPool);
    domEl.addEventListener('animationend', () => domEl.classList.remove('spinning'), { once: true });
  }

  function tickDivinity() {
    const nums    = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
    const circles = document.querySelectorAll('#divCircles .div-circle');
    circles.forEach((circle, i) => {
      after(() => {
        const c    = rand(DIV_COLORS);
        const span = circle.querySelector('.div-num');
        span.classList.remove('shuffle-in', 'shuffle-out');
        void span.offsetWidth;
        span.classList.add('shuffle-out');
        after(() => {
          circle.style.background  = c.bg;
          circle.style.borderColor = c.border;
          circle.style.color       = c.text;
          span.textContent         = nums[i];
          span.classList.remove('shuffle-out');
          void span.offsetWidth;
          span.classList.add('shuffle-in');
          span.addEventListener('animationend', () => span.classList.remove('shuffle-in'), { once: true });
        }, 144);
      }, i * 144);
    });
  }

  function tickSlotRow(ids, colorPool, stagger) {
    ids.forEach((id, i) => after(() => triggerSpinSlot(el(id), colorPool), i * stagger));
  }

  function tickCompanion() {
    const slots = shuffle(IDX4);
    IDX4.forEach(i => {
      after(() => {
        const c = rand(COMP_COLORS);
        const circle = el(`compC${i}`);
        circle.style.background  = c.bg;
        circle.style.borderColor = c.border;
        circle.style.transform   = `translateX(${slots[i] * SLOT_W}px)`;
      }, i * 89);
    });
  }

  function tickVisGroups() {
    const slots = shuffle(IDX4);
    IDX4.forEach(i => {
      after(() => {
        const group = el(`visGroup${i}`);
        group.style.transition = '';
        group.style.transform  = `translateY(${slots[i] * SLOT_H}px)`;
      }, i * 89);
    });
  }

  const CARD_IDS = ['cardIcon0', 'cardIcon1', 'cardIcon2'];
  const PIN_IDS  = ['pinIcon0',  'pinIcon1',  'pinIcon2' ];

  let running = false;

  function start() {
    running = true;
    el('modalCalctimize').textContent = 'Stop';
    tickDivinity();
    tickSlotRow(CARD_IDS, ICON_COLORS, 233);
    tickCompanion();
    tickSlotRow(PIN_IDS, PIN_COLORS, 233);
    tickVisGroups();
    every(tickDivinity,                           1597);
    every(() => tickSlotRow(CARD_IDS, ICON_COLORS, 233), 2584);
    every(tickCompanion,                           987);
    every(() => tickSlotRow(PIN_IDS, PIN_COLORS,   233), 2584);
    every(tickVisGroups,                          1597);
  }

  function stop() {
    running = false;
    clearAll();
    const btn = el('modalCalctimize');
    btn.textContent = 'Calctimize';
    btn.disabled = true;

    const popup = document.createElement('div');
    popup.className = 'gif-popup';
    popup.innerHTML = `
<div class="gif-card">
  <div class="gif-flip" id="gifFlip">
    <div class="gif-front"><img alt="Bejomaru Card" src="https://masihterjaga.github.io/sim/img/optimized.gif"></div>
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
<button class="gif-popup-close"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/></svg> SKIP</button>`;
    document.body.appendChild(popup);

    const flipEl = popup.querySelector('#gifFlip');
    flipEl.addEventListener('animationend', () => {
      flipEl.style.animation = 'none';
      flipEl.style.transition = 'transform 610ms cubic-bezier(0.19,1,0.22,1)';
    }, { once: true });

    flipEl.addEventListener('click', () => {
      flipEl.classList.toggle('flipped');
    });

    popup.querySelector('.gif-popup-close').addEventListener('click', () => {
      popup.remove();
      btn.disabled = false;
    });
  }

  function destroy() {
    clearAll();
    document.removeEventListener('keydown', onKeydown);
    const overlay = el('statsModal');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 233);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') destroy();
  }

  el('modalCalctimize').addEventListener('click', () => running ? stop() : start());
  el('modalClose').addEventListener('click', destroy);
  el('statsModal').addEventListener('click', e => { if (e.target === el('statsModal')) destroy(); });
  document.addEventListener('keydown', onKeydown);
}

function openStatsModal() {
  const overlay = document.getElementById('statsModal');
  if (!overlay) return;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
}

function closeStatsModal() {
  const overlay = document.getElementById('statsModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.classList.add('closing');
  setTimeout(() => overlay.remove(), 233);
}
