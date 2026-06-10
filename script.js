/* ============================================
   YOUR SKIN CLINIC – Interactions v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile menu --- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('a');

  function closeMobileSubgroups() {
    mobileNav.querySelectorAll('.mobile-nav-toggle[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const sub = document.getElementById(btn.getAttribute('aria-controls'));
      if (sub) sub.hidden = true;
    });
  }

  function toggleMenu() {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) closeMobileSubgroups();
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) toggleMenu();
  }));

  // Ackordeon-knappar (Hudproblem / Behandlingar) i mobilmenyn — fäll ut/in undermenyn
  mobileNav.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const sub = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (sub) sub.hidden = expanded;
    });
  });

  /* --- Header shadow on scroll --- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.06)'
      : 'none';
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Fade-in on scroll --- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* --- Smooth scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Desktop dropdown click toggle --- */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    dd.querySelector('a').addEventListener('click', (e) => {
      if (window.innerWidth >= 768) {
        e.preventDefault();
        dd.classList.toggle('active');
        dropdowns.forEach(other => {
          if (other !== dd) other.classList.remove('active');
        });
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(dd => dd.classList.remove('active'));
    }
  });

  /* --- Info Modals --- */
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    const id = trigger.getAttribute('data-modal');
    const overlay = document.getElementById(id);
    // Skip triggers that target the treatment-modal system — it owns body.modal-open.
    if (!overlay || !overlay.classList.contains('info-modal-overlay')) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.info-modal-overlay').forEach(overlay => {
    // Close on X button (top)
    overlay.querySelector('.info-modal-close')?.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    });
    // Close on bottom button
    overlay.querySelector('.info-modal-close-bottom')?.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    });
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.info-modal-overlay.is-open').forEach(overlay => {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
  });

  /* --- Carousel: 2 kort per pilklick + sömlös oändlig loop (klonade kort) --- */
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const leftBtn = wrapper.querySelector('.carousel-arrow--left');
    const rightBtn = wrapper.querySelector('.carousel-arrow--right');
    if (!track) return;

    const reals = Array.from(track.children);
    const setCount = reals.length;
    if (setCount < 2) return;

    // Klona hela uppsättningen FÖRE och EFTER (kopierar attribut, t.ex. loading="lazy"/decoding="async").
    // Klonerna döljs för skärmläsare/tab och får 'visible' (fade-in-observern hinner inte se dem).
    const makeClones = () => reals.map(node => {
      const c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('tabindex', '-1');
      c.classList.add('visible', 'is-clone');
      return c;
    });
    const before = document.createDocumentFragment();
    makeClones().forEach(c => before.appendChild(c));
    const after = document.createDocumentFragment();
    makeClones().forEach(c => after.appendChild(c));
    track.appendChild(after);
    track.insertBefore(before, track.firstChild);

    let setWidth = 0, step = 0;
    const measure = () => {
      const items = track.children;
      step = items[1].offsetLeft - items[0].offsetLeft;            // ett kort + gap
      setWidth = items[setCount].offsetLeft - items[0].offsetLeft; // en hel uppsättning (= första riktiga kortet)
    };

    const setInstant = (x) => {
      const prev = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = x;
      void track.offsetWidth; // tvinga reflow
      track.style.scrollBehavior = prev || '';
    };

    measure();
    setInstant(setWidth); // starta på första riktiga kortet (mitten-uppsättningen)

    // Tyst återställning när rörelsen lagt sig och vi hamnat i en klonzon.
    // Innehållet i klonzonen är identiskt med de riktiga korten → hoppet blir osynligt.
    const normalize = () => {
      if (!setWidth) return;
      if (track.scrollLeft > setWidth * 2 - step / 2) {
        setInstant(track.scrollLeft - setWidth);
      } else if (track.scrollLeft < setWidth - step / 2) {
        setInstant(track.scrollLeft + setWidth);
      }
    };

    let idle;
    track.addEventListener('scroll', () => {
      clearTimeout(idle);
      idle = setTimeout(normalize, 120); // normalisera efter pil-smooth-scroll / touch-momentum
    }, { passive: true });

    const jump = (dir) => track.scrollBy({ left: dir * step * 2, behavior: 'smooth' }); // 2 kort
    if (rightBtn) rightBtn.addEventListener('click', () => jump(1));
    if (leftBtn)  leftBtn.addEventListener('click', () => jump(-1));

    let rz;
    window.addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => { measure(); setInstant(setWidth); }, 150);
    });
  });
});

// ============================================
// Modal-system för behandlingsval
// ============================================
(function() {
  let activeModal = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    activeModal = modal;
    // Fokusera stängknappen för tillgänglighet
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.hidden = true;
    document.body.classList.remove('modal-open');
    activeModal = null;
  }

  // Öppna modal vid klick på kort med data-modal
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.modal);
      return;
    }
    // Stäng modal vid klick på backdrop eller close-knapp
    if (e.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  // Stäng modal med Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
})();

// ============================================
// Reviews panel — "Visa fler" toggle (independent per column)
// ============================================
(function() {
  document.querySelectorAll('.reviews-panel-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.reviews-panel');
      if (!panel) return;
      const hidden = panel.querySelectorAll('.review-card[hidden]');
      if (hidden.length > 0) {
        hidden.forEach(card => card.hidden = false);
        btn.textContent = 'Visa färre';
      } else {
        panel.querySelectorAll('.review-card').forEach((card, i) => {
          if (i >= 3) card.hidden = true;
        });
        btn.textContent = 'Visa fler';
      }
    });
  });
})();

// ============================================
// FAQ — tab switching + accordion (used on laser-harborttagning + pormaskar)
// ============================================
(function() {
  // FAQ — tab switching
  document.querySelectorAll('.faq-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update tab active states
      document.querySelectorAll('.faq-tab').forEach(t => {
        t.classList.remove('faq-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('faq-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show only matching content
      document.querySelectorAll('.faq-content').forEach(content => {
        if (content.dataset.category === category) {
          content.classList.add('faq-content--active');
        } else {
          content.classList.remove('faq-content--active');
        }
      });

      // Close any open accordions when switching tabs
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = null;
      });
    });
  });

  // FAQ — accordion (one open at a time within the visible category)
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      // Open clicked if it was closed
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
      }
    });
  });
})();

// ===== Cookie-samtycke (GDPR, opt-in) + Google Analytics 4 =====
// Laddar INGA analys-cookies/gtag före uttryckligt samtycke ("Acceptera").
(function() {
  const GA_ID = 'G-XX1817FQJM';
  const KEY = 'ysc-cookie-consent'; // 'granted' | 'denied'

  // Google Consent Mode v2 – allt nekat som standard (cookielöst, laddar inget script).
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  let gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function grant() {
    setConsent('granted');
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGA();
    hideBanner();
  }
  function deny() {
    setConsent('denied');
    gtag('consent', 'update', { analytics_storage: 'denied' });
    hideBanner();
  }

  // --- Banner (injiceras via JS, ingen HTML-redigering) ---
  let bannerEl = null;
  let scrimEl = null;
  function injectStyles() {
    if (document.getElementById('ysc-cc-styles')) return;
    const css = `
      .ysc-cc-scrim{position:fixed;inset:0;z-index:9998;background:rgba(31,45,42,.12);
        backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);
        opacity:0;pointer-events:none;transition:opacity .4s ease}
      .ysc-cc-scrim.is-visible{opacity:1}
      .ysc-cc{position:fixed;left:50%;bottom:28px;transform:translate(-50%,32px) scale(.98);z-index:9999;
        width:min(680px,calc(100% - 32px));background:#f3efe9;color:#4a4340;
        border:2px solid #9aa897;border-radius:16px;
        box-shadow:0 28px 70px rgba(31,45,42,.42),0 10px 24px rgba(31,45,42,.22),0 0 0 1px rgba(154,168,151,.18);
        padding:20px 22px;font-family:'Inter',system-ui,sans-serif;font-size:.92rem;line-height:1.5;
        display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;opacity:0;
        transition:opacity .45s ease,transform .45s cubic-bezier(.16,1,.3,1)}
      .ysc-cc.is-visible{opacity:1;transform:translate(-50%,0) scale(1)}
      .ysc-cc__text{flex:1 1 280px;margin:0}
      .ysc-cc__text a{color:#8a7d6d;text-decoration:underline}
      .ysc-cc__btns{display:flex;gap:10px;flex:0 0 auto}
      .ysc-cc__btn{font:inherit;font-weight:600;border-radius:100px;padding:.62rem 1.4rem;cursor:pointer;
        min-width:124px;text-align:center;border:1.5px solid transparent;
        box-shadow:0 2px 6px rgba(31,45,42,.10);transition:all .2s ease;white-space:nowrap}
      .ysc-cc__btn:focus-visible{outline:2px solid #4a4340;outline-offset:2px}
      .ysc-cc__btn--accept{background:#9aa897;color:#fff;border-color:#9aa897}
      .ysc-cc__btn--accept:hover{background:#86977f;border-color:#86977f}
      .ysc-cc__btn--decline{background:transparent;color:#5f6b59;border-color:#9aa897}
      .ysc-cc__btn--decline:hover{background:rgba(154,168,151,.14);border-color:#86977f;color:#4a4340}
      @media(max-width:520px){.ysc-cc{flex-direction:column;align-items:stretch}.ysc-cc__btns{justify-content:stretch}.ysc-cc__btn{flex:1}}
      @media(prefers-reduced-motion:reduce){.ysc-cc,.ysc-cc-scrim{transition:opacity .2s ease}.ysc-cc{transform:translate(-50%,0) scale(1)}}`;
    const st = document.createElement('style');
    st.id = 'ysc-cc-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    injectStyles();
    if (!scrimEl) {
      scrimEl = document.createElement('div');
      scrimEl.className = 'ysc-cc-scrim';
      document.body.appendChild(scrimEl);
    }
    if (bannerEl) {
      scrimEl.classList.add('is-visible');
      bannerEl.classList.add('is-visible');
      return;
    }
    bannerEl = document.createElement('div');
    bannerEl.className = 'ysc-cc';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-label', 'Cookie-samtycke');
    bannerEl.innerHTML =
      '<p class="ysc-cc__text">Vi använder cookies för anonym besöksstatistik (Google Analytics) ' +
      'för att förbättra sidan. Inget laddas utan ditt samtycke. ' +
      '<a href="integritetspolicy.html">Läs mer</a>.</p>' +
      '<div class="ysc-cc__btns">' +
      '<button type="button" class="ysc-cc__btn ysc-cc__btn--decline">Avböj</button>' +
      '<button type="button" class="ysc-cc__btn ysc-cc__btn--accept">Acceptera</button>' +
      '</div>';
    document.body.appendChild(bannerEl);
    bannerEl.querySelector('.ysc-cc__btn--accept').addEventListener('click', grant);
    bannerEl.querySelector('.ysc-cc__btn--decline').addEventListener('click', deny);
    requestAnimationFrame(() => {
      scrimEl.classList.add('is-visible');
      bannerEl.classList.add('is-visible');
    });
  }
  function hideBanner() {
    if (bannerEl) bannerEl.classList.remove('is-visible');
    if (scrimEl) scrimEl.classList.remove('is-visible');
  }

  function init() {
    const consent = getConsent();
    if (consent === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      loadGA();
    } else if (consent !== 'denied') {
      showBanner(); // inget val gjort → visa banner (inget analytics laddas än)
    }

    // Footer "Cookies"-länk öppnar samtyckesrutan igen (alla varianter).
    // Capture-fas så den kör FÖRE ev. gammal data-modal-hanterare (som annars
    // skulle öppna info-modalen på index/ansiktsbehandlingar/microneedling).
    document.addEventListener('click', function(e) {
      const a = e.target.closest('a');
      if (a && a.textContent.trim().toLowerCase() === 'cookies') {
        e.preventDefault();
        e.stopPropagation();
        showBanner();
      }
    }, true);

    // Händelsespårning – bokningsavsikt (endast om samtycke givits).
    document.addEventListener('click', function(e) {
      if (getConsent() !== 'granted') return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.indexOf('bokadirekt.se') !== -1) {
        const card = link.closest('.behandling-card-vertical, .method-card, .tx-hero-content');
        const titleEl = card && card.querySelector('h3, h1');
        const isHeader = link.classList.contains('header-cta') || link.closest('.header, .mobile-nav');
        gtag('event', 'boka_klick', {
          behandling: titleEl ? titleEl.textContent.trim() : (document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : document.title),
          plats: isHeader ? 'header' : (link.closest('.tx-hero-content') ? 'hero' : 'kort'),
          sidnamn: document.title,
          lank: href
        });
      } else if (href.indexOf('tel:') === 0) {
        gtag('event', 'telefon_klick', { sidnamn: document.title, nummer: href.replace('tel:', '') });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Topp-toggle: "Fråga terapeuten" (visa/dölj hela Q&A-blocket) =====
(function() {
  document.querySelectorAll('.ask-therapist__toggle').forEach(function(btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function() {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
})();

// ============================================
// Lead-widget: flytande "Vill du bli kontaktad?"-knapp + formulär (FormSubmit AJAX)
// Lättviktig, ingen SDK. Injiceras via JS på alla sidor. Rör inte GA4/samtycke.
// ============================================
(function() {
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/by.isabella.kazimova@gmail.com';
  var CONSENT_KEY = 'ysc-cookie-consent'; // samma nyckel som cookie-samtycke/boka_klick

  function hasConsent() {
    try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch (e) { return false; }
  }

  function injectStyles() {
    if (document.getElementById('ysc-lead-styles')) return;
    var css =
      '.ysc-lead-fab{position:fixed;right:20px;bottom:20px;z-index:9990;' +
        'font-family:\'Inter\',system-ui,sans-serif;font-size:.9rem;font-weight:600;' +
        'background:#9aa897;color:#fff;border:1.5px solid #9aa897;border-radius:100px;' +
        'padding:.7rem 1.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(31,45,42,.22),0 3px 8px rgba(31,45,42,.12);' +
        'transition:background .2s ease,border-color .2s ease,transform .2s ease}' +
      '.ysc-lead-fab:hover{background:#86977f;border-color:#86977f}' +
      '.ysc-lead-fab:focus-visible{outline:2px solid #4a4340;outline-offset:2px}' +
      '.ysc-lead-overlay{position:fixed;inset:0;z-index:9995;display:none;align-items:flex-end;' +
        'justify-content:flex-end;padding:20px;background:rgba(31,45,42,.28)}' +
      '.ysc-lead-overlay.is-open{display:flex}' +
      '.ysc-lead-modal{width:min(360px,calc(100% - 0px));background:#f3efe9;color:#4a4340;' +
        'border:1px solid #d8cfc2;border-radius:16px;' +
        'box-shadow:0 18px 50px rgba(31,45,42,.30),0 6px 16px rgba(31,45,42,.14);' +
        'padding:22px;font-family:\'Inter\',system-ui,sans-serif;font-size:.92rem;line-height:1.5}' +
      '.ysc-lead-modal h2{margin:0 0 4px;font-size:1.15rem;color:#4a4340}' +
      '.ysc-lead-modal p.ysc-lead-sub{margin:0 0 14px;font-size:.85rem;color:#6b635c}' +
      '.ysc-lead-close{position:absolute;top:14px;right:16px;background:none;border:none;' +
        'font-size:1.5rem;line-height:1;color:#8a7d6d;cursor:pointer;padding:4px}' +
      '.ysc-lead-modal{position:relative}' +
      '.ysc-lead-field{margin-bottom:12px}' +
      '.ysc-lead-field label{display:block;font-size:.8rem;font-weight:600;margin-bottom:4px}' +
      '.ysc-lead-field input{width:100%;box-sizing:border-box;font:inherit;color:#4a4340;' +
        'padding:.6rem .7rem;border:1.5px solid #d8cfc2;border-radius:10px;background:#fff}' +
      '.ysc-lead-field input:focus{outline:none;border-color:#9aa897}' +
      '.ysc-lead-honey{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
      '.ysc-lead-submit{width:100%;font:inherit;font-weight:600;background:#9aa897;color:#fff;' +
        'border:1.5px solid #9aa897;border-radius:100px;padding:.7rem 1.4rem;cursor:pointer;' +
        'transition:background .2s ease;margin-top:4px}' +
      '.ysc-lead-submit:hover{background:#86977f}' +
      '.ysc-lead-submit[disabled]{opacity:.6;cursor:default}' +
      '.ysc-lead-gdpr{margin:12px 0 0;font-size:.74rem;color:#6b635c;line-height:1.45}' +
      '.ysc-lead-gdpr a{color:#8a7d6d;text-decoration:underline}' +
      '.ysc-lead-msg{margin:12px 0 0;font-size:.86rem}' +
      '.ysc-lead-msg--ok{color:#5a6b54}' +
      '.ysc-lead-msg--err{color:#9a5a4a}' +
      '@media(max-width:520px){.ysc-lead-overlay{align-items:center;justify-content:center}' +
        '.ysc-lead-modal{width:min(360px,calc(100% - 32px))}}' +
      '@media(prefers-reduced-motion:reduce){.ysc-lead-fab{transition:none}}';
    var st = document.createElement('style');
    st.id = 'ysc-lead-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  var overlay = null, form = null, fab = null, msgEl = null, submitBtn = null, lastFocus = null;

  function openModal() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    var nameInput = form.querySelector('#ysc-lead-name');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function setMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text || '';
    msgEl.className = 'ysc-lead-msg' + (type ? ' ysc-lead-msg--' + type : '');
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Honeypot ifyllt → tyst avbryt (bot).
    var honey = form.querySelector('.ysc-lead-honey input');
    if (honey && honey.value) return;

    setMsg('', null);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Skickar…';

    var payload = {
      Namn: form.querySelector('#ysc-lead-name').value.trim(),
      Telefon: form.querySelector('#ysc-lead-phone').value.trim(),
      'E-post': form.querySelector('#ysc-lead-email').value.trim(),
      _subject: 'Ny kontaktförfrågan från hemsidan',
      _template: 'table',
      _honey: honey ? honey.value : ''
    };

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function() {
        form.reset();
        // Dölj fälten, visa tack-meddelandet.
        Array.prototype.forEach.call(form.querySelectorAll('.ysc-lead-field, .ysc-lead-submit, .ysc-lead-gdpr'), function(el) {
          el.style.display = 'none';
        });
        setMsg('Tack! Vi hör av oss snart.', 'ok');
        // GA4: lead_skickad – endast vid samtycke (samma check som boka_klick).
        if (hasConsent() && typeof window.gtag === 'function') {
          window.gtag('event', 'lead_skickad', { sidnamn: document.title });
        }
      })
      .catch(function() {
        setMsg('Något gick fel. Försök igen eller mejla oss direkt.', 'err');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Skicka';
      });
  }

  function build() {
    injectStyles();

    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'ysc-lead-fab';
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.textContent = 'Vill du bli kontaktad?';

    overlay = document.createElement('div');
    overlay.className = 'ysc-lead-overlay';
    overlay.innerHTML =
      '<div class="ysc-lead-modal" role="dialog" aria-modal="true" aria-labelledby="ysc-lead-title">' +
        '<button type="button" class="ysc-lead-close" aria-label="Stäng">×</button>' +
        '<h2 id="ysc-lead-title">Vill du bli kontaktad?</h2>' +
        '<p class="ysc-lead-sub">Lämna dina uppgifter så hör vi av oss.</p>' +
        '<form novalidate>' +
          '<div class="ysc-lead-field">' +
            '<label for="ysc-lead-name">Namn</label>' +
            '<input id="ysc-lead-name" name="Namn" type="text" autocomplete="name" required>' +
          '</div>' +
          '<div class="ysc-lead-field">' +
            '<label for="ysc-lead-phone">Telefon</label>' +
            '<input id="ysc-lead-phone" name="Telefon" type="tel" autocomplete="tel" required>' +
          '</div>' +
          '<div class="ysc-lead-field">' +
            '<label for="ysc-lead-email">E-post</label>' +
            '<input id="ysc-lead-email" name="E-post" type="email" autocomplete="email" required>' +
          '</div>' +
          '<div class="ysc-lead-honey" aria-hidden="true">' +
            '<label>Lämna tomt<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label>' +
          '</div>' +
          '<button type="submit" class="ysc-lead-submit">Skicka</button>' +
          '<p class="ysc-lead-gdpr">Vi använder dina uppgifter endast för att kontakta dig. ' +
            '<a href="integritetspolicy.html">Integritetspolicy</a>.</p>' +
          '<p class="ysc-lead-msg" role="status" aria-live="polite"></p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    form = overlay.querySelector('form');
    msgEl = overlay.querySelector('.ysc-lead-msg');
    submitBtn = overlay.querySelector('.ysc-lead-submit');

    fab.addEventListener('click', openModal);
    overlay.querySelector('.ysc-lead-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
    form.addEventListener('submit', handleSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
