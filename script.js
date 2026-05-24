/* ============================================
   YOUR SKIN CLINIC – Interactions v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile menu --- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('a');

  function toggleMenu() {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) toggleMenu();
  }));

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
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-modal');
      const overlay = document.getElementById(id);
      if (overlay) {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
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

  /* --- Carousel Arrow Navigation (infinite loop) --- */
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const leftBtn = wrapper.querySelector('.carousel-arrow--left');
    const rightBtn = wrapper.querySelector('.carousel-arrow--right');
    const scrollAmount = 240;

    rightBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    leftBtn.addEventListener('click', () => {
      if (track.scrollLeft <= 5) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });
  });
});
