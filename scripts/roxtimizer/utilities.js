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
        { src: 'img/Test_New-V_ArcAngel.jpg', caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_0.jpg', caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_1.jpg', caption: '' },
        { src: 'img/Calc_x_Ingame_1.1.6_2.jpg', caption: 'Spear Flash Triggered' }
      ]
    },
    {
      name: 'roxtimizer',
      images: [
        { src: 'img/01_RoXtimizer.jpg', caption: 'Recommendation pre Companion Opt.' },
        { src: 'img/02_RoXtimizer.jpg', caption: 'Test Before Opt.' },
        { src: 'img/03_RoXtimizer.jpg', caption: 'After Opt. (in-game ±26%, tool expect ±23%)' },
        { src: 'img/04_RoXtimizer.jpg', caption: 'Before Opt. (+Companion)' },
        { src: 'img/05_RoXtimizer.jpg', caption: 'Opt. Recommendation (+Companion)' },
        { src: 'img/06_RoXtimizer.jpg', caption: 'Test Before Opt.' },
        { src: 'img/07_RoXtimizer.jpg', caption: 'Test After Opt.(in-game ±22%, tool expect ±24%)' }
      ]
    },
    {
      name: 'roxtimizer_2',
      images: [
        { src: 'img/Roxtimizer_STR_Multiplier.jpg', caption: 'Multiplier FULL STR ENCHANT' },
        { src: 'img/Roxtimizer_Shadow_Multiplier.jpg', caption: 'Multiplier FULL DMG to Shadow ENCHANT' },
        { src: 'img/Roxtimizer_STR_Enchant.jpg', caption: 'DPS FULL STR' },
        { src: 'img/Roxtimizer_Shadow_Enchant.jpg', caption: 'DPS SHADOW Enchant ±180% Increase,\n\n Lower from tool (±200%) because cant calculate STR enchant contribution.' }
      ]
    },
    {
      name: 'roxtimizer_3',
      images: [
        { src: 'img/Current_Stats_Vs_Retri.jpg', caption: 'Another test (Retribution) with All Shadow Enchant' },
        { src: 'img/Recommend_Vs_Retri.jpg', caption: 'Use custom mode enchant optimizer, change to 3 Angel in Main-Hand. Tool expect ±46% increace' },
        { src: 'img/Retri_6Shadow.jpg', caption: 'All Shadow Enchant' },
        { src: 'img/Retri_3Angel_3Shadow.jpg', caption: 'DPS Mix angel & shadow enchant, actual-ingame increase ±41% (tool expect ±46%). As i said before, can be higher or lower ' }
      ]
    }
  ]
};
const imgLightbox = ((config = {}) => {
  const overlay = document.getElementById('img-lightbox-overlay');
  if (overlay?._lbInited) return { destroy: () => {}, openGallery: () => {} };

  const URL_RE = /^https?:\/\//i;
  const PASSIVE = { passive: false };
  const MIN_SCALE = 1;
  const MAX_SCALE = 8;
  const ZOOM_STEP = 0.8;
  const DBLCLICK_SCALE = 3;
  const BASE_DIR = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
  const ORIGIN = window.location.origin;

  const configByName = new Map((config.galleries || []).map(g => [g.name, g]));

  const root = overlay || (() => {
    const el = document.createElement('div');
    el.id = 'img-lightbox-overlay';
    el.className = 'img-lightbox-overlay';
    el.innerHTML =
      '<span class="img-lightbox-close">&times;</span>' +
      '<div class="img-lightbox-counter">1 / 1</div>' +
      '<button class="img-lightbox-nav img-lightbox-prev">&#8249;</button>' +
      '<button class="img-lightbox-nav img-lightbox-next">&#8250;</button>' +
      '<div class="img-lightbox-inner">' +
        '<div class="img-lightbox-loader">Loading...</div>' +
        '<img class="img-lightbox-image" src="" alt="">' +
      '</div>' +
      '<div class="img-lightbox-caption"></div>';
    document.body.appendChild(el);
    return el;
  })();
  root._lbInited = true;

  const els = {
    overlay: root,
    image: root.querySelector('.img-lightbox-image'),
    closeBtn: root.querySelector('.img-lightbox-close'),
    caption: root.querySelector('.img-lightbox-caption'),
    counter: root.querySelector('.img-lightbox-counter'),
    prevBtn: root.querySelector('.img-lightbox-prev'),
    nextBtn: root.querySelector('.img-lightbox-next')
  };

  const state = {
    scale: MIN_SCALE, translateX: 0, translateY: 0,
    isDragging: false, dragStartX: 0, dragStartY: 0,
    pinchStart: 0, scaleStart: MIN_SCALE,
    imageLoadId: null, isOpen: false, rafId: null, baseRect: null,
    galleries: {}, currentGallery: null, currentIndex: 0, items: []
  };

  const isZoomed = () => state.scale > MIN_SCALE;
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const midpt = (a, b) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });

  const createTracker = () => {
    const bound = [];
    const on = (el, type, fn, opts) => {
      if (!el) return;
      el.addEventListener(type, fn, opts);
      bound.push({ el, type, fn, opts });
    };
    const offAll = () => {
      bound.forEach(({ el, type, fn, opts }) => el.removeEventListener(type, fn, opts));
      bound.length = 0;
    };
    return { on, offAll };
  };
  const uiTracker = createTracker();

  const invalidateBaseRect = () => { state.baseRect = null; };

  const captureBaseRect = () => {
    const prevTransform = els.image.style.transform;
    els.image.style.transform = 'none';
    state.baseRect = els.image.getBoundingClientRect();
    els.image.style.transform = prevTransform;
  };

  const applyTransform = () => {
    if (state.rafId !== null) return;
    state.rafId = requestAnimationFrame(() => {
      els.image.style.transform = `translate(${state.translateX}px,${state.translateY}px) scale(${state.scale})`;
      state.rafId = null;
    });
  };

  const setScale = (scale, translateX = 0, translateY = 0) => {
    state.scale = scale;
    state.translateX = translateX;
    state.translateY = translateY;
    applyTransform();
    els.image.classList.toggle('img-lightbox-zoomed', isZoomed());
  };

  const resetTransform = () => {
    state.isDragging = false;
    setScale(MIN_SCALE);
  };

  const updateTransform = (newScale, clientX, clientY) => {
    const prev = state.scale;
    newScale = clamp(newScale, MIN_SCALE, MAX_SCALE);
    if (newScale === prev) return;
    if (newScale === MIN_SCALE) return resetTransform();

    if (!state.baseRect) captureBaseRect();
    const ratio = newScale / prev;
    setScale(
      newScale,
      state.translateX + (clientX - (state.baseRect.left + state.translateX)) * (1 - ratio),
      state.translateY + (clientY - (state.baseRect.top + state.translateY)) * (1 - ratio)
    );
  };

  const cleanupLoaders = () => {
    els.image.onload = null;
    els.image.onerror = null;
    state.imageLoadId = null;
  };

  const resolveURL = (path) => {
    if (URL_RE.test(path)) return path;
    if (path.startsWith('/')) return ORIGIN + path;
    return `${ORIGIN}${BASE_DIR}/${path}`;
  };

  const updateUI = () => {
    const { items, currentIndex } = state;
    const caption = items[currentIndex]?.caption;
    els.prevBtn.classList.toggle('disabled', currentIndex === 0);
    els.nextBtn.classList.toggle('disabled', currentIndex === items.length - 1);
    els.counter.textContent = `${currentIndex + 1} / ${items.length}`;
    els.caption.textContent = caption || '';
    els.caption.classList.toggle('active', Boolean(caption));
  };

  const setActive = (active) => {
    state.isOpen = active;
    els.overlay.classList.toggle('img-lightbox-active', active);
    document.body.classList.toggle('img-lightbox-open', active);
    if (active) return;
    cleanupLoaders();
    resetTransform();
    state.currentGallery = null;
    state.items = [];
  };

  const close = () => setActive(false);

  const loadImage = (index) => {
    const { items } = state;
    if (index < 0 || index >= items.length) return;
    state.currentIndex = index;
    cleanupLoaders();
    els.overlay.classList.add('img-lightbox-loading');
    resetTransform();
    const id = Symbol();
    state.imageLoadId = id;
    const done = (ok) => {
      if (state.imageLoadId !== id) return;
      els.overlay.classList.remove('img-lightbox-loading');
      if (!ok) console.error('[lightbox] failed to load image');
      state.imageLoadId = null;
      invalidateBaseRect();
    };
    els.image.onload = () => done(true);
    els.image.onerror = () => done(false);
    els.image.src = resolveURL(items[index].src);
    updateUI();
  };

  const navigate = (dir) => loadImage(state.currentIndex + dir);

  const onWheel = (e) => {
    if (!state.isOpen) return;
    e.preventDefault();
    updateTransform(state.scale + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP), e.clientX, e.clientY);
  };

  const endDrag = () => {
    state.isDragging = false;
    els.image.classList.remove('img-lightbox-dragging');
  };

  const startDrag = (cx, cy) => {
    state.isDragging = true;
    state.dragStartX = cx - state.translateX;
    state.dragStartY = cy - state.translateY;
    return true;
  };

  const startDragIfZoomed = (cx, cy) => {
    if (!isZoomed()) return false;
    return startDrag(cx, cy);
  };

  const onMouseDown = (e) => {
    if (!startDragIfZoomed(e.clientX, e.clientY)) return;
    els.image.classList.add('img-lightbox-dragging');
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
    endDrag();
  };

  const onDblClick = (e) => {
    e.preventDefault();
    if (isZoomed()) return resetTransform();
    updateTransform(DBLCLICK_SCALE, e.clientX, e.clientY);
  };

  const onTouchStart = (e) => {
    const t = e.touches;
    if (t.length === 2) {
      e.preventDefault();
      state.isDragging = false;
      state.pinchStart = dist(t[0], t[1]);
      state.scaleStart = state.scale;
      return;
    }
    if (t.length === 1) startDragIfZoomed(t[0].clientX, t[0].clientY);
  };

  const onTouchMove = (e) => {
    const t = e.touches;
    if (t.length === 2 && state.pinchStart) {
      e.preventDefault();
      const c = midpt(t[0], t[1]);
      updateTransform(state.scaleStart * (dist(t[0], t[1]) / state.pinchStart), c.x, c.y);
      return;
    }
    if (t.length !== 1 || !state.isDragging) return;
    e.preventDefault();
    state.translateX = t[0].clientX - state.dragStartX;
    state.translateY = t[0].clientY - state.dragStartY;
    applyTransform();
  };

  const onTouchEnd = (e) => {
    const remaining = e.touches.length;
    state.pinchStart = 0;
    if (remaining === 1) return startDragIfZoomed(e.touches[0].clientX, e.touches[0].clientY);
    if (remaining !== 0) return;
    state.isDragging = false;
  };

  const KEY_HANDLERS = {
    Escape: close,
    '0': resetTransform,
    ArrowLeft: () => navigate(-1),
    ArrowRight: () => navigate(1)
  };
  const onKey = (e) => {
    if (!state.isOpen) return;
    KEY_HANDLERS[e.key]?.();
  };
  const onVisibility = () => {
    if (!document.hidden || !state.isDragging) return;
    endDrag();
  };

  const galleriesContainer = () =>
    document.getElementById('lightbox-galleries') ?? (() => {
      const d = document.createElement('div');
      d.id = 'lightbox-galleries';
      d.className = 'img-lightbox-data-holder';
      document.body.appendChild(d);
      return d;
    })();

  const lazyInitGallery = (galleryName) => {
    if (state.galleries[galleryName]) return;
    const galleryConfig = configByName.get(galleryName);
    if (!galleryConfig) return;
    const container = galleriesContainer();
    galleryConfig.images.forEach(img => {
      const div = document.createElement('div');
      div.setAttribute('data-lightbox-item', galleryName);
      div.setAttribute('data-lightbox-image', img.src);
      if (img.caption) div.setAttribute('data-caption', img.caption);
      container.appendChild(div);
    });
    initGalleries(container);
  };

  const openGallery = (galleryName, startIndex = 0) => {
    lazyInitGallery(galleryName);
    const items = state.galleries[galleryName];
    if (!items) return;
    state.currentGallery = galleryName;
    state.items = items;
    setActive(true);
    loadImage(startIndex);
  };

  const bindOpenTrigger = (el, resolveName) => {
    uiTracker.on(el, 'click', (e) => {
      e.preventDefault();
      const name = resolveName();
      if (name) openGallery(name, 0);
    });
  };

  const claimUninit = (scope, selector, markAttr) => {
    const found = scope.querySelectorAll(`${selector}:not([${markAttr}])`);
    found.forEach(el => el.setAttribute(markAttr, ''));
    return found;
  };

  const INIT_RULES = [
    {
      selector: '[data-lightbox-item]',
      mark: 'data-lb-init',
      handle: (item) => {
        const name = item.getAttribute('data-lightbox-item');
        (state.galleries[name] ??= []).push({
          src: item.getAttribute('data-lightbox-image'),
          caption: item.getAttribute('data-caption') || ''
        });
      }
    },
    {
      selector: '[data-lightbox-trigger]',
      mark: 'data-lb-trigger-init',
      handle: (trigger) => bindOpenTrigger(trigger, () => trigger.getAttribute('data-lightbox-gallery'))
    },
    {
      selector: '[data-lightbox-image]:not([data-lightbox-trigger])',
      mark: 'data-lb-single-init',
      handle: (link) => {
        const uid = `single-${Math.random().toString(36).slice(2, 11)}`;
        state.galleries[uid] = [{
          src: link.getAttribute('data-lightbox-image'),
          caption: link.getAttribute('data-caption') || ''
        }];
        bindOpenTrigger(link, () => uid);
      }
    }
  ];

  function initGalleries(scope = document) {
    INIT_RULES.forEach(({ selector, mark, handle }) => {
      claimUninit(scope, selector, mark).forEach(handle);
    });
  }

  initGalleries();

  const observer = new MutationObserver((mutations) => {
    const targets = new Set();
    for (const m of mutations) {
      if (m.addedNodes.length) targets.add(m.target);
    }
    targets.forEach(initGalleries);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  uiTracker.on(els.closeBtn, 'click', close);
  uiTracker.on(els.prevBtn, 'click', () => navigate(-1));
  uiTracker.on(els.nextBtn, 'click', () => navigate(1));
  uiTracker.on(document, 'keydown', onKey);
  uiTracker.on(document, 'visibilitychange', onVisibility);
  uiTracker.on(window, 'resize', invalidateBaseRect);
  uiTracker.on(els.image, 'wheel', onWheel, PASSIVE);
  uiTracker.on(els.image, 'mousedown', onMouseDown);
  uiTracker.on(document, 'mousemove', onMouseMove);
  uiTracker.on(document, 'mouseup', onMouseUp);
  uiTracker.on(els.image, 'dblclick', onDblClick);
  uiTracker.on(els.image, 'touchstart', onTouchStart, PASSIVE);
  uiTracker.on(els.image, 'touchmove', onTouchMove, PASSIVE);
  uiTracker.on(els.image, 'touchend', onTouchEnd);
  uiTracker.on(els.image, 'touchcancel', onTouchEnd);

  const destroy = () => {
    cleanupLoaders();
    if (state.rafId !== null) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    observer.disconnect();
    uiTracker.offAll();
    els.overlay._lbInited = false;
  };
  uiTracker.on(window, 'beforeunload', destroy);

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