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

/* ============================================================
   영문 약어 자동 확장기 (Abbreviation Auto-Expander)
   - 페이지 첫 등장 시 1회 "(English · 한글)" 형태로 확장 표기
   - 코드/링크/버튼/노스크립트 등은 건너뜀
   - opt-out: 부모 요소에 class="no-abbr"
   - 이미 "(...)" 가 뒤따르면 중복 확장 방지
============================================================ */
(function() {
  if (typeof document === 'undefined') return;

  const ABBR_DICT = {
    // ===== AI / Tech =====
    'AI':     { en: 'Artificial Intelligence',                ko: '인공지능' },
    'LLM':    { en: 'Large Language Model',                   ko: '대규모 언어 모델' },
    'RAG':    { en: 'Retrieval-Augmented Generation',         ko: '검색 증강 생성' },
    'NER':    { en: 'Named Entity Recognition',               ko: '개체명 인식' },
    'RE':     { en: 'Relation Extraction',                    ko: '관계 추출' },
    'ML':     { en: 'Machine Learning',                       ko: '머신러닝' },
    'NLP':    { en: 'Natural Language Processing',            ko: '자연어 처리' },
    'GPT':    { en: 'Generative Pre-trained Transformer',     ko: '생성형 사전학습 트랜스포머' },
    'OCR':    { en: 'Optical Character Recognition',          ko: '광학 문자 인식' },
    'PoC':    { en: 'Proof of Concept',                       ko: '개념 검증' },
    'MVP':    { en: 'Minimum Viable Product',                 ko: '최소 기능 제품' },

    // ===== Web / API =====
    'API':    { en: 'Application Programming Interface',      ko: '응용 프로그램 인터페이스' },
    'SDK':    { en: 'Software Development Kit',               ko: '소프트웨어 개발 키트' },
    'SaaS':   { en: 'Software as a Service',                  ko: '서비스형 소프트웨어' },
    'CMS':    { en: 'Content Management System',              ko: '콘텐츠 관리 시스템' },
    'CDN':    { en: 'Content Delivery Network',               ko: '콘텐츠 전송 네트워크' },
    'PWA':    { en: 'Progressive Web App',                    ko: '프로그레시브 웹 앱' },
    'UI':     { en: 'User Interface',                         ko: '사용자 인터페이스' },
    'UX':     { en: 'User Experience',                        ko: '사용자 경험' },
    'URL':    { en: 'Uniform Resource Locator',               ko: '인터넷 주소' },
    'HTTP':   { en: 'HyperText Transfer Protocol',            ko: '웹 통신 프로토콜' },
    'HTTPS':  { en: 'HyperText Transfer Protocol Secure',     ko: '보안 웹 통신 프로토콜' },
    'TLS':    { en: 'Transport Layer Security',               ko: '전송 계층 보안' },
    'DNS':    { en: 'Domain Name System',                     ko: '도메인 이름 시스템' },
    'JSON':   { en: 'JavaScript Object Notation',             ko: 'JSON 데이터 형식' },
    'HTML':   { en: 'HyperText Markup Language',              ko: '하이퍼텍스트 마크업 언어' },
    'CSS':    { en: 'Cascading Style Sheets',                 ko: '스타일시트 언어' },
    'SVG':    { en: 'Scalable Vector Graphics',               ko: '확장 가능한 벡터 그래픽' },
    'PDF':    { en: 'Portable Document Format',               ko: '휴대용 문서 형식' },
    'RSS':    { en: 'Really Simple Syndication',              ko: 'RSS 피드' },
    'LCP':    { en: 'Largest Contentful Paint',               ko: '최대 콘텐츠 표시 시간' },
    'TTL':    { en: 'Time To Live',                           ko: '유효 시간' },

    // ===== Auth / Security =====
    'SSO':    { en: 'Single Sign-On',                         ko: '통합 인증' },
    'OAuth':  { en: 'Open Authorization',                     ko: '개방형 인증' },
    'SAML':   { en: 'Security Assertion Markup Language',     ko: '보안 어설션 마크업 언어' },
    'RBAC':   { en: 'Role-Based Access Control',              ko: '역할 기반 접근 제어' },
    'SLA':    { en: 'Service Level Agreement',                ko: '서비스 수준 협약' },

    // ===== Marketing / SEO =====
    'SEO':    { en: 'Search Engine Optimization',             ko: '검색 엔진 최적화' },
    'GEO':    { en: 'Generative Engine Optimization',         ko: '생성형 검색 최적화' },
    'AIO':    { en: 'AI Output',                              ko: 'AI 출력 구조화' },
    'CPM':    { en: 'Cost Per Mille',                         ko: '1000회 노출당 비용' },
    'CPC':    { en: 'Cost Per Click',                         ko: '클릭당 비용' },
    'CTR':    { en: 'Click-Through Rate',                     ko: '클릭률' },

    // ===== Business / Finance =====
    'KPI':    { en: 'Key Performance Indicator',              ko: '핵심 성과 지표' },
    'ROI':    { en: 'Return on Investment',                   ko: '투자 수익률' },
    'ARR':    { en: 'Annual Recurring Revenue',               ko: '연간 반복 매출' },
    'MRR':    { en: 'Monthly Recurring Revenue',              ko: '월간 반복 매출' },
    'ACV':    { en: 'Annual Contract Value',                  ko: '연간 계약 금액' },
    'LTV':    { en: 'Lifetime Value',                         ko: '고객 생애 가치' },
    'CAC':    { en: 'Customer Acquisition Cost',              ko: '고객 획득 비용' },
    'BEP':    { en: 'Break-Even Point',                       ko: '손익분기점' },
    'TAM':    { en: 'Total Addressable Market',               ko: '총 시장 규모' },
    'SAM':    { en: 'Serviceable Addressable Market',         ko: '유효 시장 규모' },
    'SOM':    { en: 'Serviceable Obtainable Market',          ko: '획득 가능 시장 규모' },
    'WTP':    { en: 'Willingness to Pay',                     ko: '지불 의지' },
    'BM':     { en: 'Business Model',                         ko: '비즈니스 모델' },
    'EV':     { en: 'Enterprise Value',                       ko: '기업 가치' },
    'EBITDA': { en: 'Earnings Before Interest, Taxes, Depreciation, and Amortization', ko: '이자·세금·감가상각비 차감 전 영업이익' },
    'B2B':    { en: 'Business-to-Business',                   ko: '기업 간 거래' },
    'B2C':    { en: 'Business-to-Consumer',                   ko: '기업·소비자 거래' },
    'OKR':    { en: 'Objectives and Key Results',             ko: '목표와 핵심 결과' },

    // ===== Capital Market =====
    'IPO':    { en: 'Initial Public Offering',                ko: '기업공개·상장' },
    'M&A':    { en: 'Mergers and Acquisitions',               ko: '인수합병' },
    'VC':     { en: 'Venture Capital',                        ko: '벤처 캐피털' },
    'PEF':    { en: 'Private Equity Fund',                    ko: '사모펀드' },
    'IB':     { en: 'Investment Bank',                        ko: '투자은행' },
    'IR':     { en: 'Investor Relations',                     ko: '투자자 관계' },
    'CVC':    { en: 'Corporate Venture Capital',              ko: '기업형 벤처 캐피털' },
    'LP':     { en: 'Limited Partner',                        ko: '유한책임 출자자' },
    'GP':     { en: 'General Partner',                        ko: '운용사·무한책임사원' },
    'R&D':    { en: 'Research and Development',               ko: '연구개발' },
    'VAT':    { en: 'Value-Added Tax',                        ko: '부가가치세' },
    'CPE':    { en: 'Continuing Professional Education',      ko: '전문가 보수교육' },
    'SOW':    { en: 'Statement of Work',                      ko: '작업 명세서' },
    'FTE':    { en: 'Full-Time Equivalent',                   ko: '정규직 환산 인력' },

    // ===== Standards (Ontology / Data) =====
    'FIBO':   { en: 'Financial Industry Business Ontology',   ko: '금융산업 비즈니스 온톨로지' },
    'XBRL':   { en: 'eXtensible Business Reporting Language', ko: '확장 가능한 비즈니스 보고 언어' },
    'RDF':    { en: 'Resource Description Framework',         ko: '자원 기술 프레임워크' },
    'OWL':    { en: 'Web Ontology Language',                  ko: '웹 온톨로지 언어' },
    'SHACL':  { en: 'Shapes Constraint Language',             ko: '셰이프 제약 언어' },
    'SPARQL': { en: 'SPARQL Protocol and RDF Query Language', ko: 'SPARQL 그래프 쿼리 언어' },
    'BM25':   { en: 'Best Matching 25',                       ko: 'BM25 정보 검색 알고리즘' },
    'QID':    { en: 'Wikidata Item Identifier',               ko: 'Wikidata 항목 식별자' },

    // ===== Defense / Tech (사례 분석용) =====
    'UGV':    { en: 'Unmanned Ground Vehicle',                ko: '무인 지상 로봇' },
    'UAV':    { en: 'Unmanned Aerial Vehicle',                ko: '무인 항공기' },
    'USV':    { en: 'Unmanned Surface Vehicle',               ko: '무인 수상정' },
    'UUV':    { en: 'Unmanned Underwater Vehicle',            ko: '무인 잠수정' },
    'KMUS':   { en: 'Korean Manned-Unmanned System',          ko: '한국형 유무인 복합체계' },
    'SLAM':   { en: 'Simultaneous Localization and Mapping',  ko: '동시적 위치 추정 및 지도 작성' },
    'ISR':    { en: 'Intelligence, Surveillance, Reconnaissance', ko: '정보·감시·정찰' },

    // ===== Org / Brand =====
    'IBH':    { en: 'Insight Bank Hub',                       ko: '인사이트 뱅크 허브' },
    'ARG':    { en: 'Atlas Research Group',                   ko: '애틀러스 리서치' },
    'KMNA':   { en: 'Korea M&A News Agency',                  ko: '한국 M&A 경제신문' },
    'KIC':    { en: 'Korea Investment Corporation',           ko: '한국투자공사' },
    'NIA':    { en: 'National Information Society Agency',    ko: '한국지능정보사회진흥원' },
    'KIPO':   { en: 'Korean Intellectual Property Office',    ko: '특허청' },
    'KST':    { en: 'Korea Standard Time',                    ko: '한국 표준시' },
    'MENA':   { en: 'Middle East and North Africa',           ko: '중동·북아프리카' },
    'DACH':   { en: 'Germany, Austria, Switzerland',          ko: '독일·오스트리아·스위스 권역' }
  };

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function expandAbbreviations() {
    const SKIP_TAGS = new Set([
      'CODE', 'PRE', 'SCRIPT', 'STYLE', 'A', 'ABBR', 'BUTTON',
      'TEXTAREA', 'INPUT', 'NOSCRIPT', 'OPTION', 'SELECT', 'KBD', 'SAMP',
      'STRONG', 'B', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
    ]);
    const SKIP_CLASSES = new Set([
      'no-abbr', 'brand', 'brand__name', 'brand__mark', 'brand__logo',
      'chip', 'badge-num', 'lang-switch', 'footer__seal', 'footer__legal',
      'sparql-box', 'kg-svg', 'pdf-pageinfo', 'eyebrow', 'stat__value', 'stat__label',
      'card__title', 'phase-card__title', 'card__icon',
      'kg-node-label', 'kg-node-sub', 'kg-edge-label'
    ]);

    function shouldSkip(node) {
      let p = node.parentNode;
      while (p && p.nodeType === 1) {
        if (SKIP_TAGS.has(p.tagName)) return true;
        if (p.classList) {
          for (const c of p.classList) {
            if (SKIP_CLASSES.has(c)) return true;
          }
        }
        if (p.tagName === 'BODY') break;
        p = p.parentNode;
      }
      return false;
    }

    const seen = new Set();
    const keys = Object.keys(ABBR_DICT).sort((a, b) => b.length - a.length);
    const pattern = '(?<![A-Za-z0-9])(' + keys.map(escapeRegex).join('|') + ')(?![A-Za-z0-9])';
    let re;
    try {
      re = new RegExp(pattern, 'g');
    } catch (e) {
      // Older browser without lookbehind support — skip silently
      return;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeValue && n.nodeValue.trim().length > 0 && !shouldSkip(n)) {
        textNodes.push(n);
      }
    }

    for (const node of textNodes) {
      const text = node.nodeValue;
      const matches = [];
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[1].length, abbr: m[1] });
      }
      if (matches.length === 0) continue;

      const frag = document.createDocumentFragment();
      let lastIdx = 0;
      let mutated = false;

      for (const match of matches) {
        if (match.start > lastIdx) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx, match.start)));
        }
        frag.appendChild(document.createTextNode(match.abbr));

        const after = text.slice(match.end);
        const hasParen = /^\s*[(（]/.test(after);

        if (!seen.has(match.abbr)) {
          if (!hasParen) {
            const def = ABBR_DICT[match.abbr];
            const span = document.createElement('span');
            span.className = 'abbr-expansion';
            span.textContent = ' (' + def.en + ' · ' + def.ko + ')';
            frag.appendChild(span);
            mutated = true;
          }
          seen.add(match.abbr);
        }
        lastIdx = match.end;
      }
      if (lastIdx < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx)));
      }
      if (mutated && node.parentNode) {
        node.parentNode.replaceChild(frag, node);
      }
    }
  }

  function safeRun() {
    try { expandAbbreviations(); } catch (e) { /* ignore on legacy browsers */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeRun);
  } else {
    safeRun();
  }
})();
