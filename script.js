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
