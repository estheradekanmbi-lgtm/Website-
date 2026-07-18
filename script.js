/* ═══════════════════════════════════════════════════════
   ESTHER ADEKANMBI — PREMIUM DATA ANALYST PORTFOLIO
   script.js — Production JavaScript
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── 1. UTILITY ─────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const debounce = (fn, delay) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* ── 2. LOADING SCREEN ──────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('loader--hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    document.body.style.overflow = '';
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    setTimeout(hide, 800);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 500), { once: true });
  }
}

/* ── 3. THEME (DARK / LIGHT) ────────────────────────── */
function initTheme() {
  const toggle = $('#themeToggle');
  const html   = document.documentElement;

  const STORAGE_KEY = 'ea-portfolio-theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const apply = (theme) => {
    html.setAttribute('data-theme', theme);
    toggle && (toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`));
    localStorage.setItem(STORAGE_KEY, theme);
  };

  apply(saved || preferred);

  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    apply(current === 'dark' ? 'light' : 'dark');
  });

  // Sync with system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) apply(e.matches ? 'dark' : 'light');
  });
}

/* ── 4. STICKY NAVIGATION ───────────────────────────── */
function initNav() {
  const nav    = $('#nav');
  const toggle = $('#navToggle');
  const links  = $('#navLinks');
  if (!nav) return;

  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 20);
    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('nav__toggle--open');
    toggle.setAttribute('aria-expanded', String(open));
    links?.classList.toggle('nav__links--open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  $$('.nav__link', links).forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('nav__toggle--open');
      toggle?.setAttribute('aria-expanded', 'false');
      links?.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (links?.classList.contains('nav__links--open') && !nav.contains(e.target)) {
      toggle?.classList.remove('nav__toggle--open');
      toggle?.setAttribute('aria-expanded', 'false');
      links.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    }
  });
}

/* ── 5. SCROLL PROGRESS BAR ─────────────────────────── */
function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;

  const update = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = `${clamp(pct, 0, 100)}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── 6. SCROLL SPY (active nav link) ────────────────── */
function initScrollSpy() {
  const navLinks = $$('.nav__link[data-section]');
  if (!navLinks.length) return;

  const sections = navLinks
    .map(link => {
      const id = link.dataset.section;
      const el = $(`#${id}`);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  const activate = debounce(() => {
    const scrollY = window.scrollY + window.innerHeight * 0.35;

    let active = null;
    sections.forEach(({ el }) => {
      if (el.offsetTop <= scrollY) active = el.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('nav__link--active', link.dataset.section === active);
    });
  }, 60);

  window.addEventListener('scroll', activate, { passive: true });
  activate();
}

/* ── 7. REVEAL ON SCROLL (IntersectionObserver) ─────── */
function initReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ── 8. TYPING EFFECT ───────────────────────────────── */
function initTyping() {
  const el = $('#typingText');
  if (!el) return;

  const phrases = [
    'actionable decisions.',
    'business intelligence.',
    'measurable impact.',
    'clear insights.',
    'competitive advantage.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let timer     = null;

  const type = () => {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        timer = setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting   = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }

    timer = setTimeout(type, deleting ? 42 : 78);
  };

  timer = setTimeout(type, 800);

  return () => clearTimeout(timer); // cleanup
}

/* ── 9. ANIMATED COUNTERS ───────────────────────────── */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el, target, duration = 1600) => {
    const start  = performance.now();
    const update = (now) => {
      const elapsed  = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animate(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── 10. SKILLS TABS ────────────────────────────────── */
function initSkillsTabs() {
  const tabs   = $$('.skills__tab');
  const panels = $$('.skills__panel');
  if (!tabs.length) return;

  const activate = (tabEl) => {
    const id = tabEl.dataset.tab;

    tabs.forEach(t => {
      t.classList.toggle('skills__tab--active', t === tabEl);
      t.setAttribute('aria-selected', String(t === tabEl));
    });

    panels.forEach(panel => {
      const active = panel.id === `tab-${id}`;
      panel.classList.toggle('skills__panel--active', active);
      panel.hidden = !active;
    });

    // Re-trigger reveal animations for newly visible cards
    const newCards = $$('.reveal', $(`#tab-${id}`));
    newCards.forEach(card => {
      card.classList.remove('reveal--visible');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.add('reveal--visible'));
      });
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));

    // Keyboard navigation within tablist
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        tabs[(idx + 1) % tabs.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        tabs[(idx - 1 + tabs.length) % tabs.length].focus();
      }
    });
  });
}

/* ── 11. PROJECT FILTER ─────────────────────────────── */
function initProjectFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card');
  if (!btns.length) return;

  const filter = (category) => {
    btns.forEach(btn => {
      btn.classList.toggle('filter-btn--active', btn.dataset.filter === category);
    });

    cards.forEach((card, i) => {
      const cats   = (card.dataset.category || '').split(' ');
      const visible = category === 'all' || cats.includes(category);

      if (visible) {
        card.classList.remove('is-hidden');
        card.style.transitionDelay = `${i * 60}ms`;
      } else {
        card.classList.add('is-hidden');
        card.style.transitionDelay = '0ms';
      }
    });
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => filter(btn.dataset.filter));
  });
}

/* ── 12. CONTACT FORM VALIDATION ────────────────────── */
function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  const fields = {
    name:    { el: $('#name'),    err: $('#nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email:   { el: $('#email'),   err: $('#emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    subject: { el: $('#subject'), err: $('#subjectError'), validate: v => v ? '' : 'Please select a subject.' },
    message: { el: $('#message'), err: $('#messageError'), validate: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.' },
  };

  const showError = (field, msg) => {
    field.el?.classList.toggle('form__input--error', !!msg);
    if (field.err) field.err.textContent = msg;
  };

  const validateField = (key) => {
    const f   = fields[key];
    const msg = f.validate(f.el?.value || '');
    showError(f, msg);
    return !msg;
  };

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    fields[key].el?.addEventListener('blur', () => validateField(key));
    fields[key].el?.addEventListener('input', () => {
      if (fields[key].el?.classList.contains('form__input--error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) return;

    // Simulate async submission
    const btn  = form.querySelector('.form__submit');
    const text = form.querySelector('.form__submit-text');
    btn.disabled = true;
    if (text) text.textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      Object.keys(fields).forEach(key => showError(fields[key], ''));
      btn.disabled = false;
      if (text) text.textContent = 'Send Message';
      success && (success.hidden = false);
      setTimeout(() => success && (success.hidden = true), 5000);
    }, 1400);
  });
}

/* ── 13. BACK TO TOP ────────────────────────────────── */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const toggle = debounce(() => {
    btn.hidden = window.scrollY < 400;
  }, 100);

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 14. LAZY IMAGE LOADING ─────────────────────────── */
function initLazyImages() {
  const imgs = $$('img[loading="lazy"]');
  if (!imgs.length || !('IntersectionObserver' in window)) return;

  imgs.forEach(img => {
    img.style.transition = 'opacity 0.4s ease';
    if (!img.complete) img.style.opacity = '0';

    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => {
      // Replace broken image with a clean SVG placeholder
      img.style.opacity = '1';
      img.alt = img.alt || 'Project preview';
      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23F3F4F6'/%3E%3Crect x='340' y='200' width='120' height='100' rx='8' fill='%23E5E7EB'/%3E%3Crect x='360' y='160' width='80' height='4' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E`;
    });
  });
}

/* ── 15. SMOOTH SCROLL ──────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without jumping
      history.pushState(null, '', `#${id}`);
    });
  });
}

/* ── 16. KEYBOARD ACCESSIBILITY ─────────────────────── */
function initKeyboardA11y() {
  // Trap focus inside mobile menu when open
  const nav   = $('#nav');
  const links = $('#navLinks');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile nav on Escape
      const toggle = $('#navToggle');
      if (links?.classList.contains('nav__links--open')) {
        toggle?.classList.remove('nav__toggle--open');
        toggle?.setAttribute('aria-expanded', 'false');
        links.classList.remove('nav__links--open');
        document.body.style.overflow = '';
        toggle?.focus();
      }
    }
  });

  // Ensure all interactive elements have visible focus states
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.remove('using-mouse');
  });
}

/* ── 17. DASHBOARD BAR ANIMATION (hero) ─────────────── */
function initDashboardAnimation() {
  const bars = $$('.dashboard__bar');
  if (!bars.length) return;

  // Stagger the animation when bars come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((bar, i) => {
            bar.style.animationDelay = `${i * 80 + 200}ms`;
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  bars[0] && observer.observe(bars[0]);
}

/* ── 18. HBAR FILL ANIMATION (case study dashboard) ─── */
function initHbarAnimation() {
  const hbarFills = $$('.dashboard-mock__hbar-fill');
  if (!hbarFills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hbarFills.forEach((fill, i) => {
            fill.style.animationDelay = `${i * 100 + 300}ms`;
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  hbarFills[0] && observer.observe(hbarFills[0]);
}

/* ── 19. SKILL PANEL INITIAL STATE ─────────────────── */
function initSkillPanels() {
  const panels = $$('.skills__panel');
  panels.forEach(panel => {
    if (!panel.classList.contains('skills__panel--active')) {
      panel.hidden = true;
    } else {
      // Trigger reveal for first visible panel
      const cards = $$('.reveal', panel);
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('reveal--visible'), i * 80 + 200);
      });
    }
  });
}

/* ── INITIALISE ─────────────────────────────────────── */
(function init() {
  initLoader();
  initTheme();
  initNav();
  initScrollProgress();
  initScrollSpy();
  initReveal();
  initTyping();
  initCounters();
  initSkillsTabs();
  initSkillPanels();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initLazyImages();
  initSmoothScroll();
  initKeyboardA11y();
  initDashboardAnimation();
  initHbarAnimation();
})();
