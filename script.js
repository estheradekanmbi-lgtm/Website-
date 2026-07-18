/**
 * Esther Adekanmbi Portfolio – script.js
 * Vanilla JS, no frameworks, no dependencies.
 * All features implemented as self-contained initialisation functions.
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Select a single element (shorthand for querySelector)
 * @param {string} sel – CSS selector
 * @param {Element} [ctx=document] – search context
 * @returns {Element|null}
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Select all matching elements (shorthand for querySelectorAll)
 * @param {string} sel – CSS selector
 * @param {Element} [ctx=document] – search context
 * @returns {NodeList}
 */
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);


/* ============================================================
   1. LOADING SCREEN
   Fades out after 1.5 s, then removes itself from the DOM.
   ============================================================ */
function initLoadingScreen() {
  const screen = $('#loading-screen');
  if (!screen) return;

  // Hide after 1.5 s (CSS loader-fill animation ~1.4 s)
  setTimeout(() => {
    screen.classList.add('hidden');

    // Remove from DOM after CSS transition (600 ms)
    screen.addEventListener('transitionend', () => screen.remove(), { once: true });

    // Fallback removal in case transitionend doesn't fire
    setTimeout(() => { if (screen.parentNode) screen.remove(); }, 700);
  }, 1500);
}


/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   Reads system preference on first load; persists to localStorage.
   ============================================================ */
function initDarkMode() {
  const btn   = $('#theme-toggle');
  const html  = document.documentElement;
  const icon  = btn ? btn.querySelector('.theme-icon') : null;

  // Determine initial theme
  const saved  = localStorage.getItem('ea-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system;

  applyTheme(initial);

  btn && btn.addEventListener('click', () => {
    const current = html.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ea-theme', next);
  });

  // Also listen for system preference changes (when no saved preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('ea-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    html.dataset.theme = theme;
    html.classList.toggle('light-mode', theme === 'light');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (btn) btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}


/* ============================================================
   3. SCROLL PROGRESS BAR
   Updates the width of #scroll-progress as the user scrolls.
   ============================================================ */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = window.scrollY || document.documentElement.scrollTop;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct.toFixed(2) + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // run once on load
}


/* ============================================================
   4. STICKY NAVBAR – glassmorphism on scroll
   ============================================================ */
function initStickyNav() {
  const nav = $('#navbar');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================================
   5. SCROLL SPY
   Highlights the correct nav link based on the current section.
   ============================================================ */
function initScrollSpy() {
  const links    = $$('.nav-link');
  const sections = $$('section[id], div[id="home"]');

  const sectionIds = Array.from(links).map(l => l.getAttribute('href')?.replace('#', '')).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
          link.setAttribute('aria-current', matches ? 'page' : 'false');
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(s => {
    if (sectionIds.includes(s.id)) observer.observe(s);
  });
}


/* ============================================================
   6. MOBILE NAV TOGGLE
   Opens/closes the full-screen nav overlay on small screens.
   ============================================================ */
function initMobileNav() {
  const toggle = $('#nav-toggle');
  const links  = $('#nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}


/* ============================================================
   7. TYPING ANIMATION
   Cycles through an array of role strings with a typewriter effect.
   ============================================================ */
function initTyping() {
  const target = $('#typing-text');
  if (!target) return;

  const phrases = [
    'Aspiring Data Analyst',
    'Computer Science Student',
    'Excel Enthusiast',
    'SQL Learner',
    'Power BI Explorer',
    'Python for Data'
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let pauseTimer = null;

  const TYPING_SPEED   = 80;   // ms per character typed
  const DELETING_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER    = 2000; // ms pause after full phrase

  function tick() {
    const current = phrases[phraseIdx];

    if (deleting) {
      // Remove one character
      charIdx--;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
      } else {
        setTimeout(tick, DELETING_SPEED);
      }
    } else {
      // Add one character
      charIdx++;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        // Full phrase typed – pause before deleting
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
      } else {
        setTimeout(tick, TYPING_SPEED);
      }
    }
  }

  // Short initial delay so loading screen has faded
  setTimeout(tick, 1800);
}


/* ============================================================
   8. HERO PARTICLES
   Creates lightweight floating particle elements in the hero.
   ============================================================ */
function initHeroParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 5 + 3;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 10;
    const dur    = Math.random() * 12 + 10;
    const opacity = Math.random() * 0.3 + 0.1;

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      opacity:${opacity};
    `;
    container.appendChild(p);
  }
}


/* ============================================================
   9. INTERSECTION OBSERVER – Scroll animations
   Adds "visible" class when elements enter viewport.
   Also triggers skill bars and counter animations.
   ============================================================ */
function initScrollAnimations() {
  const elements = $$('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Skill bars: animate fill width when visible
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          const width = fill.dataset.width || '0';
          setTimeout(() => { fill.style.width = width + '%'; }, 100);
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


/* ============================================================
   10. COUNTER ANIMATION
   Animates .stat-number elements from 0 to their data-target value.
   ============================================================ */
function initCounterAnimations() {
  const counters = $$('.stat-number');
  if (!counters.length) return;

  const DURATION = 1800; // ms

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const startVal = 0;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3); // cubic ease out
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value    = Math.round(easeOut(progress) * (target - startVal) + startVal);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


/* ============================================================
   11. SKILLS TABS
   Switches between Technical and Professional skill panels.
   ============================================================ */
function initSkillsTabs() {
  const buttons  = $$('.tab-btn');
  const contents = $$('.tab-content');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update button states
      buttons.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });

      // Show/hide panels
      contents.forEach(panel => {
        const show = panel.id === `tab-${target}`;
        panel.classList.toggle('active', show);
        panel.hidden = !show;

        // Re-trigger skill bar animations for newly shown panel
        if (show) {
          panel.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
            el.querySelectorAll('.skill-fill').forEach(fill => {
              fill.style.width = '0%';
              setTimeout(() => { fill.style.width = (fill.dataset.width || '0') + '%'; }, 50);
            });
          });
        }
      });
    });

    // Keyboard: arrow key navigation between tabs
    btn.addEventListener('keydown', (e) => {
      const btns = Array.from(buttons);
      const idx  = btns.indexOf(btn);
      if (e.key === 'ArrowRight' && idx < btns.length - 1) {
        e.preventDefault();
        btns[idx + 1].focus();
        btns[idx + 1].click();
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        btns[idx - 1].focus();
        btns[idx - 1].click();
      }
    });
  });
}


/* ============================================================
   12. PROJECT FILTER
   Filters project cards based on category data-attribute.
   ============================================================ */
function initProjectFilter() {
  const buttons = $$('.filter-btn');
  const cards   = $$('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Re-animate
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        } else {
          card.classList.add('hidden');
        }
      });

      // Announce to screen readers
      const grid = $('#projects-grid');
      if (grid) {
        const visible = Array.from(cards).filter(c => !c.classList.contains('hidden')).length;
        grid.setAttribute('aria-label', `${visible} project${visible !== 1 ? 's' : ''} shown`);
      }
    });
  });
}


/* ============================================================
   13. CONTACT FORM VALIDATION
   Client-side JS validation with aria-live error messages.
   ============================================================ */
function initContactForm() {
  const form    = $('#contact-form');
  const submitBtn = $('#form-submit');
  const success = $('#form-success');
  if (!form) return;

  /**
   * Validate a single field
   * @param {HTMLElement} field
   * @returns {boolean} isValid
   */
  function validateField(field) {
    const errorEl = $('#' + field.getAttribute('aria-describedby'));
    let error = '';

    if (field.required && !field.value.trim()) {
      error = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(field.value.trim())) {
        error = 'Please enter a valid email address.';
      }
    } else if (field.tagName === 'TEXTAREA' && field.value.trim().length < 10) {
      error = 'Message must be at least 10 characters.';
    }

    field.classList.toggle('error', !!error);
    if (errorEl) errorEl.textContent = error;

    return !error;
  }

  // Validate on blur for instant feedback
  $$('input, textarea', form).forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields  = Array.from($$('input, textarea', form));
    const allValid = fields.every(validateField);

    if (!allValid) {
      // Focus first invalid field
      const firstError = fields.find(f => f.classList.contains('error'));
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (no backend — GitHub Pages is static)
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    }, 1200);
  });
}


/* ============================================================
   14. BACK TO TOP BUTTON
   Shows when scrolled more than 300px; smooth scrolls to top.
   ============================================================ */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Return focus to top landmark
    const main = $('#main-content');
    if (main) main.focus();
  });
}


/* ============================================================
   15. LAZY LOAD IMAGES
   Uses IntersectionObserver + native loading="lazy" as backup.
   Adds a fade-in effect as images load.
   ============================================================ */
function initLazyImages() {
  // Native lazy loading is already set via loading="lazy" in HTML.
  // This adds a visual fade-in when images load.
  $$('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
      img.addEventListener('error', () => {
        // Graceful degradation: show a styled placeholder
        img.style.opacity = '0.4';
        img.setAttribute('alt', img.getAttribute('alt') + ' (image unavailable)');
      }, { once: true });
    }
  });
}


/* ============================================================
   16. KEYBOARD ACCESSIBILITY ENHANCEMENTS
   Ensures cards and project overlays are keyboard-reachable.
   ============================================================ */
function initKeyboardA11y() {
  // Make project cards keyboard-focusable for overlay reveal effect
  $$('.project-card').forEach(card => {
    const link = card.querySelector('.project-overlay a');
    if (!link) return;

    card.setAttribute('tabindex', '-1'); // card itself not focusable; link is

    // Show overlay on focus of inner link
    link.addEventListener('focus', () => card.querySelector('.project-overlay').style.opacity = '1');
    link.addEventListener('blur',  () => card.querySelector('.project-overlay').style.opacity = '');
  });

  // Accordion: ensure keyboard activation works (details/summary is native)
  $$('.accordion-summary').forEach(summary => {
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.closest('details').open = !summary.closest('details').open;
      }
    });
  });
}


/* ============================================================
   17. SMOOTH ANCHOR NAVIGATION
   Offsets scroll target by navbar height.
   ============================================================ */
function initSmoothScroll() {
  const nav = $('#navbar');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 72;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL without triggering jump
      history.pushState(null, '', href);

      // Move focus to the section for screen readers
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}


/* ============================================================
   18. INITIAL SKILL BAR FILL
   Fills skill bars that are already in view on page load.
   ============================================================ */
function initSkillBarsVisible() {
  // Run after a short delay to allow IntersectionObserver to fire first
  setTimeout(() => {
    $$('.skill-card.visible .skill-fill').forEach(fill => {
      fill.style.width = (fill.dataset.width || '0') + '%';
    });
  }, 300);
}


/* ============================================================
   MAIN INIT – runs when DOM is ready
   ============================================================ */
function init() {
  // Core
  initLoadingScreen();
  initDarkMode();
  initScrollProgress();
  initStickyNav();
  initScrollSpy();
  initMobileNav();
  initSmoothScroll();

  // Hero
  initTyping();
  initHeroParticles();

  // Sections
  initScrollAnimations();
  initCounterAnimations();
  initSkillsTabs();
  initSkillBarsVisible();
  initProjectFilter();

  // Contact & UI
  initContactForm();
  initBackToTop();
  initLazyImages();
  initKeyboardA11y();
}

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM already parsed (deferred script)
}
