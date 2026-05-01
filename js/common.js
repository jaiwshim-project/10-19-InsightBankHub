/* ============================================================
   Insight Bank Hub — Common JS
   라우팅 / 네비 / 에러 / 공용 유틸
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. 활성 네비 표시 (자동 라우팅 인디케이터) ---------- */
  function markActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    // 일반 nav__link
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
    // 드롭다운 menu link + 부모 group active
    document.querySelectorAll('.nav__menu-link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href === path) {
        link.classList.add('active');
        const group = link.closest('.nav__group');
        if (group) group.classList.add('has-active');
      }
    });
  }

  /* ---------- 2. 모바일 네비 토글 ---------- */
  function bindMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove('open');
    });
  }

  /* ---------- 3. 부드러운 앵커 스크롤 ---------- */
  function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', id);
      });
    });
  }

  /* ---------- 4. 스크롤 인뷰 애니메이션 ---------- */
  function bindReveal() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('animate-up');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ---------- 5. 토스트 알림 ---------- */
  window.IBH = window.IBH || {};
  window.IBH.toast = function (msg, type = 'info') {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.innerHTML = `<span style="font-size:18px">${
      type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ⓘ'
    }</span><span>${msg}</span>`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  };

  /* ---------- 6. 글로벌 에러 핸들러 ---------- */
  function bindErrorHandler() {
    window.addEventListener('error', (e) => {
      console.error('[IBH]', e.message, e.filename, e.lineno);
    });
    window.addEventListener('unhandledrejection', (e) => {
      console.error('[IBH] Unhandled rejection:', e.reason);
    });
  }

  /* ---------- 7. 카운트업 (KPI 등) ---------- */
  window.IBH.countUp = function (el, target, duration = 1400) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    const isFloat = String(target).includes('.');
    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (target - start) * eased;
      el.textContent = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('ko-KR');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  /* ---------- 8. 카운트업 자동 트리거 (data-count) ---------- */
  function bindAutoCount() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const tgt = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const orig = el.textContent;
        window.IBH.countUp(el, tgt);
        // 접두/접미사 유지
        setTimeout(() => {
          el.textContent = prefix + el.textContent + suffix;
        }, 1450);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }

  /* ---------- 9. 글로벌 언어 선택기 (i18n) ---------- */
  const LANGS = [
    { code: 'ko', flag: '🇰🇷', name: 'Korean',     native: '한국어',    dir: 'ltr', primary: true },
    { code: 'en', flag: '🇺🇸', name: 'English',    native: 'English',  dir: 'ltr', primary: true },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese',    native: '中文',      dir: 'ltr', primary: true },
    { code: 'ja', flag: '🇯🇵', name: 'Japanese',   native: '日本語',    dir: 'ltr', primary: true },
    { code: 'es', flag: '🇪🇸', name: 'Spanish',    native: 'Español',  dir: 'ltr' },
    { code: 'fr', flag: '🇫🇷', name: 'French',     native: 'Français', dir: 'ltr' },
    { code: 'de', flag: '🇩🇪', name: 'German',     native: 'Deutsch',  dir: 'ltr' },
    { code: 'ar', flag: '🇸🇦', name: 'Arabic',     native: 'العربية',  dir: 'rtl' }
  ];
  const LANG_KEY = 'ibh-lang';

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && LANGS.find(l => l.code === saved)) return saved;
    const nav = (navigator.language || 'ko').slice(0,2).toLowerCase();
    return LANGS.find(l => l.code === nav) ? nav : 'ko';
  }

  function injectLangSwitch() {
    const headers = document.querySelectorAll('.header__inner');
    headers.forEach(header => {
      if (header.querySelector('.lang-switch')) return; // 이미 있으면 스킵
      const navToggle = header.querySelector('.nav-toggle');
      const current = LANGS.find(l => l.code === getLang()) || LANGS[0];

      const wrap = document.createElement('div');
      wrap.className = 'lang-switch';

      const primaryItems = LANGS.filter(l => l.primary);
      const moreItems = LANGS.filter(l => !l.primary);

      wrap.innerHTML = `
        <button class="lang-switch__trigger" aria-haspopup="listbox" aria-expanded="false" type="button">
          <span class="lang-switch__flag">${current.flag}</span>
          <span class="lang-switch__trigger__name">${current.code.toUpperCase()}</span>
          <svg class="lang-switch__chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="lang-switch__menu" role="listbox">
          <div class="lang-switch__heading">Primary · 4</div>
          ${primaryItems.map(l => `
            <button class="lang-switch__item ${l.code === current.code ? 'active' : ''}" data-lang="${l.code}" type="button" role="option">
              <span class="lang-switch__flag">${l.flag}</span>
              <span class="lang-switch__item__name">${l.name}<span class="lang-switch__item__native">${l.native}</span></span>
              <svg class="lang-switch__item__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 12l5 5L20 7"/></svg>
            </button>
          `).join('')}
          <div class="lang-switch__divider"></div>
          <div class="lang-switch__heading">Expanding · 4</div>
          ${moreItems.map(l => `
            <button class="lang-switch__item ${l.code === current.code ? 'active' : ''}" data-lang="${l.code}" type="button" role="option">
              <span class="lang-switch__flag">${l.flag}</span>
              <span class="lang-switch__item__name">${l.name}<span class="lang-switch__item__native">${l.native}</span></span>
              <svg class="lang-switch__item__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 12l5 5L20 7"/></svg>
            </button>
          `).join('')}
        </div>
      `;
      // nav-toggle 앞에 삽입 (없으면 끝에)
      if (navToggle) header.insertBefore(wrap, navToggle);
      else header.appendChild(wrap);
    });

    // 토글 동작
    document.querySelectorAll('.lang-switch').forEach(sw => {
      const trig = sw.querySelector('.lang-switch__trigger');
      const menu = sw.querySelector('.lang-switch__menu');
      trig.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        trig.classList.toggle('open', isOpen);
        trig.setAttribute('aria-expanded', isOpen);
      });
      sw.querySelectorAll('.lang-switch__item').forEach(item => {
        item.addEventListener('click', () => {
          const code = item.dataset.lang;
          setLang(code);
        });
      });
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-switch__menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.lang-switch__trigger.open').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded','false');
      });
    });

    // ESC로 닫기
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.lang-switch__menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.lang-switch__trigger.open').forEach(t => t.classList.remove('open'));
    });
  }

  function setLang(code) {
    const lang = LANGS.find(l => l.code === code);
    if (!lang) return;
    localStorage.setItem(LANG_KEY, code);
    document.documentElement.lang = code;
    document.documentElement.dir = lang.dir;

    // UI 즉시 업데이트
    document.querySelectorAll('.lang-switch').forEach(sw => {
      const trig = sw.querySelector('.lang-switch__trigger');
      trig.querySelector('.lang-switch__flag').textContent = lang.flag;
      const nameEl = trig.querySelector('.lang-switch__trigger__name');
      if (nameEl) nameEl.textContent = lang.code.toUpperCase();
      sw.querySelectorAll('.lang-switch__item').forEach(it => {
        it.classList.toggle('active', it.dataset.lang === code);
      });
    });

    // 안내 (데모 환경 — 실제 i18n 사전은 Phase 4에서 활성화)
    if (window.IBH?.toast) {
      const msgs = {
        ko: '한국어로 설정되었습니다',
        en: 'Language preference: English (demo · UI only)',
        zh: '语言偏好：中文（演示版 · 仅切换 UI）',
        ja: '言語設定：日本語（デモ · UIのみ）',
        es: 'Idioma: Español (demo · solo UI)',
        fr: 'Langue: Français (démo · UI seulement)',
        de: 'Sprache: Deutsch (Demo · nur UI)',
        ar: 'اللغة: العربية (نسخة تجريبية · واجهة فقط)'
      };
      window.IBH.toast(msgs[code] || msgs.en, 'success');
    }

    // 커스텀 이벤트 (페이지별 i18n 훅 가능)
    document.dispatchEvent(new CustomEvent('ibh:langchange', { detail: { code, lang } }));
  }

  // 페이지 진입 시 저장된 언어 적용
  function applyInitialLang() {
    const code = getLang();
    const lang = LANGS.find(l => l.code === code);
    if (!lang) return;
    document.documentElement.lang = code;
    document.documentElement.dir = lang.dir;
  }

  /* ---------- 10. 페이지 로드 시 초기화 ---------- */
  function init() {
    applyInitialLang();
    markActiveNav();
    injectLangSwitch();
    bindMobileNav();
    bindSmoothScroll();
    bindReveal();
    bindAutoCount();
    bindErrorHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
