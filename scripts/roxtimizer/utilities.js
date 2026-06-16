/* lightbox.js */
const lightboxConfig = {
  galleries: [
    {
      name: 'my-gallery',
      images: [
        { src: 'img/Calc_vs_Ingame-0.jpg', caption: 'Final DMG Bonus 24 from 5 Stack Vesper T2' },
        { src: 'img/Calc_vs_Ingame-1.jpg', caption: 'no buff active (P ATTK 325002)' },
        { src: 'img/Calc_vs_Ingame-2.jpg', caption: '5 Stack Vesper (P ATTK 352793)' },
        { src: 'img/Calc_vs_Ingame-3.jpg', caption: 'Spear Flash Triggered (P ATTK 325002)' },
        { src: 'img/Calc_vs_Ingame-4.jpg', caption: 'Spear + 5 Stack Vesper (P ATTK 352793)' }
      ]
    },
    {
      name: 'new-version',
      images: [
        { src: 'img/Test_New-V_ArcAngel.jpg',    caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_0.jpg',  caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_1.jpg',  caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_2.jpg',  caption: 'Spear Flash Triggered' }
      ]
    },
    {
      name: 'roxtimizer',
      images: [
        { src: 'img/01_RoXtimizer.jpg', caption: 'Recommendation pre Companion Opt.' },
        { src: 'img/02_RoXtimizer.jpg', caption: 'Test Before Opt.' },
        { src: 'img/03_RoXtimizer.jpg', caption: 'After Opt.' },
        { src: 'img/04_RoXtimizer.jpg', caption: 'Before Opt. (+Companion)' },
        { src: 'img/05_RoXtimizer.jpg', caption: 'Opt. Recommendation (+Companion)' },
        { src: 'img/06_RoXtimizer.jpg', caption: 'Test Before Opt.' },
        { src: 'img/07_RoXtimizer.jpg', caption: 'Test After Opt.' }
      ]
    },
    {
      name: 'roxtimizer_2',
      images: [
        { src: '/img/Roxtimizer_STR_Multiplier.jpg', caption: 'Multiplier FULL STR ENCHANT' },
        { src: '/img/Roxtimizer_Shadow_Multiplier.jpg', caption: 'Multiplier FULL DMG to Shadow ENCHANT' },
        { src: '/img/Roxtimizer_STR_Enchant.jpg', caption: 'DPS FULL STR' },
        { src: '/img/Roxtimizer_Shadow_Enchant.jpg', caption: 'DPS SHADOW Enchant ±180% Increase,\n\n Lower from tool (±200%) because cant calculate STR enchant contribution.' }
      ]
    },
    
  ]
};
const imgLightbox = ((config = {}) => {

  let _overlay = document.getElementById('img-lightbox-overlay');
  if (!_overlay) {
    _overlay = document.createElement('div');
    _overlay.id        = 'img-lightbox-overlay';
    _overlay.className = 'img-lightbox-overlay';
    _overlay.innerHTML =
      '<span class="img-lightbox-close">&times;</span>'                      +
      '<div class="img-lightbox-counter">1 / 1</div>'                        +
      '<button class="img-lightbox-nav img-lightbox-prev">&#8249;</button>'  +
      '<button class="img-lightbox-nav img-lightbox-next">&#8250;</button>'  +
      '<div class="img-lightbox-inner">'                                      +
        '<div class="img-lightbox-loader">Loading...</div>'                  +
        '<img class="img-lightbox-image" src="" alt="">'                     +
      '</div>'                                                                +
      '<div class="img-lightbox-caption"></div>';
    document.body.appendChild(_overlay);
  }

  // ── double-init guard ──────────────────────────────────────
  if (_overlay._lbInited) return { destroy: () => {}, openGallery: () => {} };
  _overlay._lbInited = true;

  // ── element refs ───────────────────────────────────────────
  const els = {
    overlay:  _overlay,
    image:    document.querySelector('.img-lightbox-image'),
    loader:   document.querySelector('.img-lightbox-loader'),
    closeBtn: document.querySelector('.img-lightbox-close'),
    inner:    document.querySelector('.img-lightbox-inner'),
    caption:  document.querySelector('.img-lightbox-caption'),
    counter:  document.querySelector('.img-lightbox-counter'),
    prevBtn:  document.querySelector('.img-lightbox-prev'),
    nextBtn:  document.querySelector('.img-lightbox-next')
  };

  // ── state ──────────────────────────────────────────────────
  const state = {
    scale: 1, translateX: 0, translateY: 0,
    isDragging: false, dragStartX: 0, dragStartY: 0,
    pinchStart: 0, scaleStart: 1,
    imageLoadId: null,
    galleries: {}, currentGallery: null, currentIndex: 0
  };

  const cfg = { MIN: 1, MAX: 5, STEP: 0.3 };

  // ── event registries (for cleanup) ────────────────────────
  // main UI events
  const _uiEvents = [];
  const on = (el, type, fn, opts) => {
    if (!el) return;
    el.addEventListener(type, fn, opts);
    _uiEvents.push({ el, type, fn, opts });
  };

  // gallery trigger events (separate so they survive destroy if needed)
  const _galleryEvents = [];
  const onGallery = (el, type, fn) => {
    el.addEventListener(type, fn);
    _galleryEvents.push({ el, type, fn });
  };
  const offAllGallery = () => {
    _galleryEvents.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
    _galleryEvents.length = 0;
  };

  // ── helpers ────────────────────────────────────────────────
  const clamp  = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const dist   = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const midpt  = (a, b) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });

  const applyTransform = () => {
    els.image.style.transform =
      `translate(${state.translateX}px,${state.translateY}px) scale(${state.scale})`;
  };

  const resetTransform = () => {
    Object.assign(state, { scale: 1, translateX: 0, translateY: 0, isDragging: false });
    applyTransform();
    els.image.style.cursor = 'default';
  };

  const cleanupLoaders = () => {
    if (els.image) { els.image.onload = null; els.image.onerror = null; }
    state.imageLoadId = null;
  };

  const getCurrentItems = () =>
    state.currentGallery ? (state.galleries[state.currentGallery] ?? []) : [];

  // ── URL resolver ───────────────────────────────────────────
  const resolveURL = (path) => {
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/')) return window.location.origin + path;
    const dir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    return window.location.origin + dir + '/' + path;
  };

  // ── UI update ──────────────────────────────────────────────
  const updateUI = () => {
    const items = getCurrentItems();
    const item  = items[state.currentIndex];

    els.prevBtn.classList.toggle('disabled', state.currentIndex === 0);
    els.nextBtn.classList.toggle('disabled', state.currentIndex === items.length - 1);
    els.counter.textContent = `${state.currentIndex + 1} / ${items.length}`;

    if (item?.caption) {
      els.caption.textContent = item.caption;
      els.caption.classList.add('active');
    } else {
      els.caption.textContent = '';
      els.caption.classList.remove('active');
    }
  };

  // ── open / close ───────────────────────────────────────────
  const setActive = (active) => {
    els.overlay.classList.toggle('img-lightbox-active', active);
    document.body.style.overflow = active ? 'hidden' : '';
    if (!active) {
      cleanupLoaders();
      resetTransform();
      state.currentGallery = null;
    }
  };

  const close = () => setActive(false);

  // ── image loading ──────────────────────────────────────────
  const loadImage = (index) => {
    const items = getCurrentItems();
    if (index < 0 || index >= items.length) return;

    state.currentIndex = index;
    cleanupLoaders();

    els.loader.style.display = 'block';
    els.image.style.display  = 'none';
    resetTransform();

    const id   = Symbol();
    state.imageLoadId = id;

    const done = (ok) => {
      if (state.imageLoadId !== id) return;
      els.loader.style.display = 'none';
      if (ok) els.image.style.display = 'block';
      else console.error('[lightbox] failed to load image');
      cleanupLoaders();
    };

    els.image.onload  = () => done(true);
    els.image.onerror = () => done(false);
    els.image.src     = resolveURL(items[index].src);

    updateUI();
  };

  const navigate = (dir) => {
    const items = getCurrentItems();
    const next  = state.currentIndex + dir;
    if (next >= 0 && next < items.length) loadImage(next);
  };

  // ── zoom / pan ─────────────────────────────────────────────
  const updateTransform = (newScale, cx, cy) => {
    const prev = state.scale;
    state.scale = clamp(newScale, cfg.MIN, cfg.MAX);
    if (state.scale === prev) return;

    if (state.scale === cfg.MIN) {
      state.translateX = state.translateY = 0;
    } else {
      const r = state.scale / prev;
      state.translateX = cx - (cx - state.translateX) * r;
      state.translateY = cy - (cy - state.translateY) * r;
    }
    applyTransform();
    els.image.style.cursor = state.scale > cfg.MIN ? 'move' : 'default';
  };

  // ── mouse events ───────────────────────────────────────────
  const onWheel = (e) => {
    if (!els.overlay.classList.contains('img-lightbox-active')) return;
    e.preventDefault();
    updateTransform(state.scale + (e.deltaY < 0 ? cfg.STEP : -cfg.STEP), e.clientX, e.clientY);
  };

  const onMouseDown = (e) => {
    if (state.scale <= cfg.MIN) return;
    state.isDragging = true;
    state.dragStartX = e.clientX - state.translateX;
    state.dragStartY = e.clientY - state.translateY;
    els.image.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!state.isDragging) return;
    state.translateX = e.clientX - state.dragStartX;
    state.translateY = e.clientY - state.dragStartY;
    applyTransform();
  };

  const onMouseUp = () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    els.image.style.cursor = state.scale > cfg.MIN ? 'move' : 'default';
  };

  const onDblClick = (e) => {
    e.preventDefault();
    if (state.scale > cfg.MIN) {
      resetTransform();
    } else {
      const rect = els.image.getBoundingClientRect();
      state.scale      = 2;
      state.translateX = e.clientX - (e.clientX - rect.left) * 2;
      state.translateY = e.clientY - (e.clientY - rect.top)  * 2;
      applyTransform();
      els.image.style.cursor = 'move';
    }
  };

  // ── touch events ───────────────────────────────────────────
  const startDrag = (cx, cy) => {
    state.isDragging = true;
    state.dragStartX = cx - state.translateX;
    state.dragStartY = cy - state.translateY;
  };

  const onTouchStart = (e) => {
    const t = e.touches;
    if (t.length === 1 && state.scale > cfg.MIN) {
      startDrag(t[0].clientX, t[0].clientY);
    } else if (t.length === 2) {
      e.preventDefault();
      state.isDragging  = false;
      state.pinchStart  = dist(t[0], t[1]);
      state.scaleStart  = state.scale;
    }
  };

  const onTouchMove = (e) => {
    const t = e.touches;
    if (t.length === 1 && state.isDragging) {
      e.preventDefault();
      state.translateX = t[0].clientX - state.dragStartX;
      state.translateY = t[0].clientY - state.dragStartY;
      applyTransform();
    } else if (t.length === 2 && state.pinchStart) {
      e.preventDefault();
      const c        = midpt(t[0], t[1]);
      const ratio    = dist(t[0], t[1]) / state.pinchStart;
      const newScale = clamp(state.scaleStart * ratio, cfg.MIN, cfg.MAX);
      const sr       = newScale / state.scale;
      state.scale      = newScale;
      state.translateX = c.x - (c.x - state.translateX) * sr;
      state.translateY = c.y - (c.y - state.translateY) * sr;
      if (state.scale === cfg.MIN) { state.translateX = state.translateY = 0; }
      applyTransform();
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length === 0) {
      state.isDragging = false;
      state.pinchStart = 0;
      if (state.scale === cfg.MIN) { state.translateX = state.translateY = 0; applyTransform(); }
    } else if (e.touches.length === 1 && state.scale > cfg.MIN) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
      state.pinchStart = 0;
    }
  };

  // ── keyboard ───────────────────────────────────────────────
  const onKey = (e) => {
    if (!els.overlay.classList.contains('img-lightbox-active')) return;
    ({ Escape: close, '0': resetTransform, ArrowLeft: () => navigate(-1), ArrowRight: () => navigate(1) })[e.key]?.();
  };

  const onVisibility = () => {
    if (document.hidden && state.isDragging) {
      state.isDragging = false;
      els.image.style.cursor = state.scale > cfg.MIN ? 'move' : 'default';
    }
  };

  // ── gallery init ───────────────────────────────────────────
  const lazyInitGallery = (galleryName) => {
    if (state.galleries[galleryName]) return;

    const galleryConfig = config.galleries?.find(g => g.name === galleryName);
    if (!galleryConfig) return;

    const container = document.getElementById('lightbox-galleries') ?? (() => {
      const d = document.createElement('div');
      d.id = 'lightbox-galleries';
      d.style.display = 'none';
      document.body.appendChild(d);
      return d;
    })();

    galleryConfig.images.forEach(img => {
      const div = document.createElement('div');
      div.setAttribute('data-lightbox-item',  galleryName);
      div.setAttribute('data-lightbox-image', img.src);
      if (img.caption) div.setAttribute('data-caption', img.caption);
      container.appendChild(div);
    });

    initGalleries(container);
  };

  const openGallery = (galleryName, startIndex = 0) => {
    lazyInitGallery(galleryName);
    if (!state.galleries[galleryName]) return;
    state.currentGallery = galleryName;
    setActive(true);
    loadImage(startIndex);
  };

  const initGalleries = (root = document) => {
    // register gallery items
    root.querySelectorAll('[data-lightbox-item]:not([data-lb-init])').forEach(item => {
      item.setAttribute('data-lb-init', '');
      const name    = item.getAttribute('data-lightbox-item');
      const src     = item.getAttribute('data-lightbox-image');
      const caption = item.getAttribute('data-caption') || '';
      if (!state.galleries[name]) state.galleries[name] = [];
      state.galleries[name].push({ src, caption });
    });

    // gallery trigger buttons
    root.querySelectorAll('[data-lightbox-trigger]:not([data-lb-trigger-init])').forEach(trigger => {
      trigger.setAttribute('data-lb-trigger-init', '');
      const name = trigger.getAttribute('data-lightbox-gallery');
      const handler = (e) => { e.preventDefault(); if (name) openGallery(name, 0); };
      onGallery(trigger, 'click', handler);
    });

    // single-image links
    root.querySelectorAll('[data-lightbox-image]:not([data-lightbox-trigger]):not([data-lb-single-init])').forEach(link => {
      link.setAttribute('data-lb-single-init', '');
      const src     = link.getAttribute('data-lightbox-image');
      const caption = link.getAttribute('data-caption') || '';
      const uid     = `single-${Math.random().toString(36).slice(2, 11)}`;
      state.galleries[uid] = [{ src, caption }];
      const handler = (e) => { e.preventDefault(); openGallery(uid, 0); };
      onGallery(link, 'click', handler);
    });
  };

  initGalleries();

  // ── mutation observer (dynamic DOM) ───────────────────────
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.hasAttribute?.('data-lightbox-item') || node.hasAttribute?.('data-lightbox-trigger')) {
          initGalleries(node.parentElement);
        }
        if (node.querySelectorAll) initGalleries(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── register all UI events ─────────────────────────────────
  const passive = { passive: false };

  on(els.closeBtn, 'click',            close);
  on(els.prevBtn,  'click',            () => navigate(-1));
  on(els.nextBtn,  'click',            () => navigate(1));
  on(els.overlay,  'click',            (e) => { if (e.target === els.overlay) close(); });
  on(els.inner,    'click',            (e) => e.stopPropagation());
  on(document,     'keydown',          onKey);
  on(document,     'visibilitychange', onVisibility);
  on(els.image,    'wheel',            onWheel,      passive);
  on(els.image,    'mousedown',        onMouseDown);
  on(document,     'mousemove',        onMouseMove);
  on(document,     'mouseup',          onMouseUp);
  on(els.image,    'dblclick',         onDblClick);
  on(els.image,    'touchstart',       onTouchStart, passive);
  on(els.image,    'touchmove',        onTouchMove,  passive);
  on(els.image,    'touchend',         onTouchEnd);
  on(els.image,    'touchcancel',      onTouchEnd);

  // ── destroy ────────────────────────────────────────────────
  const destroy = () => {
    cleanupLoaders();
    observer.disconnect();
    _uiEvents.forEach(({ el, type, fn, opts }) => el.removeEventListener(type, fn, opts));
    _uiEvents.length = 0;
    offAllGallery();
    els.overlay._lbInited = false;
  };

  on(window, 'beforeunload', destroy);

  return { destroy, openGallery };

})(lightboxConfig);

/* changelog */
(function () {
  const btn      = document.getElementById('clBtn');
  const backdrop = document.getElementById('clBackdrop');
  const closeBtn = document.getElementById('clClose');
  const body     = document.getElementById('clBody');
  let   loaded   = false;

  function catClass(cat) {
    const c = cat.toLowerCase();
    if (c === 'added')    return 'cl-cat--added';
    if (c === 'update')   return 'cl-cat--update';
    if (c === 'improved') return 'cl-cat--improved';
    return 'cl-cat--default';
  }

  function renderItem(item) {
    const el = document.createElement('div');
    el.className = 'cl-item';
    if (typeof item === 'string') {
      const wrap = document.createElement('span');
      wrap.innerHTML = item;
      el.appendChild(wrap);
    } else {
      const wrap = document.createElement('span');
      wrap.innerHTML = item.text;
      el.appendChild(wrap);
      if (item.items && item.items.length) {
        const sub = document.createElement('div');
        sub.className = 'cl-subitems';
        item.items.forEach(function(s) {
          const si = document.createElement('div');
          si.className = 'cl-subitem';
          const sw = document.createElement('span');
          sw.textContent = s;
          si.appendChild(sw);
          sub.appendChild(si);
        });
        el.appendChild(sub);
      }
    }
    return el;
  }

  function render(data) {
    body.innerHTML = '';
    data.versions.forEach(function(v, vi) {
      const block = document.createElement('div');
      block.className = 'cl-version';

      const hd = document.createElement('div');
      hd.className = 'cl-version-hd';
      const num = document.createElement('span');
      num.className = 'cl-version-num' + (vi === 0 ? ' cl-version-num--latest' : '');
      num.textContent = 'v' + v.version;
      const date = document.createElement('span');
      date.className = 'cl-version-date';
      date.textContent = v.date;
      hd.appendChild(num);
      hd.appendChild(date);
      block.appendChild(hd);

      v.changes.forEach(function(ch) {
        const group = document.createElement('div');
        group.className = 'cl-change-group';

        if (ch.category) {
          const hdr = document.createElement('div');
          hdr.className = 'cl-change-hd';
          const badge = document.createElement('span');
          badge.className = 'cl-cat ' + catClass(ch.category);
          badge.textContent = ch.category;
          hdr.appendChild(badge);
          group.appendChild(hdr);
        }

        const items = document.createElement('div');
        items.className = 'cl-items';
        ch.items.forEach(function(item) { items.appendChild(renderItem(item)); });
        group.appendChild(items);
        block.appendChild(group);
      });

      body.appendChild(block);
    });
  }

  function openModal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!loaded) {
      loaded = true;
      fetch('changelog.json')
        .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(render)
        .catch(function() { body.innerHTML = '<div class="cl-state">Failed to load changelog.</div>'; });
    }
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
})();

/* Save this
 *
localStorage.setItem('roxtimizer', JSON.stringify({
  "stats": {
    "targetDef": "Arc Angeling Lv.160",
    "weapon": "One-Handed Axe",
    "wElem": "Neutral",
    "atkType": "pen",
    "pen": "894.9",
    "crit": "",
    "dmg": "478.1",
    "elemEnh": "360",
    "sizeEnh": "443",
    "race": "172.4",
    "attr": "84.1",
    "dmgStack": "0"
  },
  "enchantment": {
    "awakening": "9",
    "slots": [
      { "enchant": "izlude_race", "level": "15" },
      { "enchant": "izlude_race", "level": "14" },
      { "enchant": "izlude_race", "level": "14" },
      { "enchant": "geffen_dmg", "level": "14" },
      { "enchant": "alberta_attr", "level": "15" },
      { "enchant": "alberta_attr", "level": "14" }
    ],
    "prefs": [[], [], [], [], [], []]
  },
  "cards": {
    "equippedBySize": {
      "small": {},
      "medium": {
        "weapon_0": "Gazeti Card",
        "weapon_1": "Gazeti Card",
        "weapon_2": "Gazeti Card",
        "weapon_3": "Gazeti Card",
        "weapon_4": "Gazeti Card",
        "clothes_0": "",
        "clothes_1": "",
        "cloak_0": "",
        "cloak_1": "",
        "shoes_0": "",
        "shoes_1": "",
        "accessory_0": "Chen Card",
        "accessory_1": "Chen Card",
        "accessory_2": "Chen Card",
        "accessory_3": "Gibbet Card",
        "accessory_4": "Gibbet Card",
        "accessory_5": "Rem Card [Accessory]",
        "headgear_0": "Apocalypse Card",
        "headgear_1": "Apocalypse Card",
        "headgear_2": "Apocalypse Card",
        "headgear_3": "Toki Card [Headgear]",
        "headgear_4": "Echio Card",
        "headgear_5": "Echio Card"
      },
      "large": {
        "weapon_0": "Eremes Guile Card",
        "weapon_1": "Eremes Guile Card",
        "weapon_2": "Eremes Guile Card",
        "weapon_3": "Ice Titan Card",
        "weapon_4": "Ice Titan Card",
        "clothes_0": "",
        "clothes_1": "",
        "cloak_0": "",
        "cloak_1": "",
        "shoes_0": "",
        "shoes_1": "",
        "accessory_0": "Vanberk Card",
        "accessory_1": "Vanberk Card",
        "accessory_2": "Vanberk Card",
        "accessory_3": "Vanberk Card",
        "accessory_4": "Vanberk Card",
        "accessory_5": "Vanberk Card",
        "headgear_0": "Apocalypse Card",
        "headgear_1": "Apocalypse Card",
        "headgear_2": "Apocalypse Card",
        "headgear_3": "Apocalypse Card",
        "headgear_4": "Apocalypse Card",
        "headgear_5": "Apocalypse Card"
      }
    },
    "lockedBySize": {
      "small": {},
      "medium": {
        "weapon_0": false, "weapon_1": false, "weapon_2": false, "weapon_3": false, "weapon_4": false,
        "clothes_0": false, "clothes_1": false,
        "cloak_0": false, "cloak_1": false,
        "shoes_0": false, "shoes_1": false,
        "accessory_0": false, "accessory_1": false, "accessory_2": false,
        "accessory_3": false, "accessory_4": false, "accessory_5": false,
        "headgear_0": false, "headgear_1": false, "headgear_2": false,
        "headgear_3": false, "headgear_4": false, "headgear_5": false
      },
      "large": {
        "weapon_0": false, "weapon_1": false, "weapon_2": false, "weapon_3": false, "weapon_4": false,
        "clothes_0": false, "clothes_1": false,
        "cloak_0": false, "cloak_1": false,
        "shoes_0": false, "shoes_1": false,
        "accessory_0": false, "accessory_1": false, "accessory_2": false,
        "accessory_3": false, "accessory_4": false, "accessory_5": false,
        "headgear_0": false, "headgear_1": false, "headgear_2": false,
        "headgear_3": false, "headgear_4": false, "headgear_5": false
      }
    },
    "unusedBySize": {
      "small": [],
      "medium": [
        { "name": "Ice Titan Card", "qty": "1" },
        { "name": "Eremes Guile Card", "qty": "2" },
        { "name": "Gibbet Card", "qty": "1" },
        { "name": "Orange Venatu Card", "qty": "2" },
        { "name": "Takeru Takaishi Card [Accessory]", "qty": "1" }
      ],
      "large": []
    },
    "buffs": [
      { "stat": "elemEnh", "val": "120" },
      { "stat": "dmgStack", "val": "36" },
      { "stat": "dmg", "val": "182" }
    ]
  },
  "divinity": {
    "n1": {
      "count": 1, "current": 0,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": false, "gold": true, "lightning": true, "locked": true, "divinity": [null] }
      ]
    },
    "n2": {
      "count": 4, "current": 3,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["pen", "dmg"] },
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["size_medium", "pen"] },
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["pen", "dmg"] },
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["dmg", "element"] }
      ]
    },
    "n3": {
      "count": 3, "current": 1,
      "usedBySize": { "small": null, "medium": 1, "large": null },
      "panels": [
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["element", "pen"] },
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["element", "size_medium"] },
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["pen", "dmg"] }
      ]
    },
    "n4": {
      "count": 2, "current": 1,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["size_medium", "dmg"] },
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["dmg", "size_medium", "element"] }
      ]
    },
    "n5": {
      "count": 1, "current": 0,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": true, "gold": false, "lightning": false, "locked": false, "divinity": ["pen", "element", "dmg"] }
      ]
    },
    "n6": {
      "count": 1, "current": 0,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["element"] }
      ]
    },
    "n7": {
      "count": 3, "current": 1,
      "usedBySize": { "small": null, "medium": 1, "large": null },
      "panels": [
        { "blue": true, "purple": false, "gold": false, "lightning": false, "locked": false, "divinity": ["pen", "element", "dmg"] },
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["size_medium"] },
        { "blue": false, "purple": false, "gold": true, "lightning": false, "locked": false, "divinity": ["pen"] }
      ]
    },
    "n8": {
      "count": 1, "current": 0,
      "usedBySize": { "small": null, "medium": 0, "large": null },
      "panels": [
        { "blue": false, "purple": false, "gold": true, "lightning": true, "locked": false, "divinity": ["dmg", "size_medium"] }
      ]
    }
  },
  "companion": {
    "items": [
      { "stats": ["pen", null, "dmg"], "quality": "purple", "name": "Chirp", "star": true },
      { "stats": [null, "elemEnh", "pen"], "quality": "gold", "name": "Spuki", "star": false },
      { "stats": ["elemEnh", "pen", null], "quality": "purple", "name": "Bub", "star": false },
      { "stats": [null, null, "dmg"], "quality": "purple", "name": "Mush", "star": true }
    ],
    "usedBySlot": { "0": 1, "1": 0, "2": 3, "3": 2 },
    "slideInputs": [
      ["61", "100", "92"],
      ["100", "64.5", "92"],
      ["73", "93", "94.5"],
      ["92", "94", "71"]
    ]
  }
}));
 *
*/