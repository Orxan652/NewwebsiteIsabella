/* ============================================
   YOUR SKIN CLINIC – Treatment Page Interactions
   Accordion with smooth animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Equalize card heights per row --- */
  function equalizeCards() {
    const grid = document.querySelector('.tx-cards-grid');
    if (!grid || window.innerWidth < 640) return;
    const cards = Array.from(grid.querySelectorAll('.tx-card'));
    // Reset heights
    cards.forEach(c => c.style.minHeight = '');
    // Group by row (same offsetTop)
    const rows = {};
    cards.forEach(c => {
      const top = Math.round(c.getBoundingClientRect().top);
      if (!rows[top]) rows[top] = [];
      rows[top].push(c);
    });
    Object.values(rows).forEach(row => {
      if (row.length < 2) return;
      const max = Math.max(...row.map(c => c.scrollHeight));
      row.forEach(c => c.style.minHeight = max + 'px');
    });
  }
  equalizeCards();
  window.addEventListener('resize', equalizeCards);

  /* --- Accordion --- */
  const triggers = document.querySelectorAll('.tx-accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close only siblings within the SAME accordion block
      const accordion = trigger.closest('.tx-accordion');
      accordion.querySelectorAll('.tx-accordion-trigger').forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = other.nextElementSibling;
          otherPanel.classList.remove('is-open');
        }
      });

      // Toggle current
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
      }
    });
  });

  /* --- Före & Efter-karusell (ett kundpar i taget, tangentbord + pilar, ingen autoplay) --- */
  const resultsTrack = document.getElementById('resultsTrack');
  if (resultsTrack) {
    const prevBtn = document.getElementById('resultsPrev');
    const nextBtn = document.getElementById('resultsNext');
    const pairs = Array.from(resultsTrack.children);

    const scrollToIndex = (i) => {
      const clamped = Math.max(0, Math.min(pairs.length - 1, i));
      pairs[clamped].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };

    const currentIndex = () => {
      const trackLeft = resultsTrack.scrollLeft;
      let closest = 0;
      let closestDist = Infinity;
      pairs.forEach((pair, i) => {
        const dist = Math.abs(pair.offsetLeft - trackLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    };

    const updateArrows = () => {
      const i = currentIndex();
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= pairs.length - 1;
    };

    if (nextBtn) nextBtn.addEventListener('click', () => scrollToIndex(currentIndex() + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => scrollToIndex(currentIndex() - 1));

    resultsTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(currentIndex() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(currentIndex() - 1); }
    });

    let resultsIdle;
    resultsTrack.addEventListener('scroll', () => {
      clearTimeout(resultsIdle);
      resultsIdle = setTimeout(updateArrows, 100);
    }, { passive: true });

    updateArrows();
    window.addEventListener('resize', () => {
      clearTimeout(resultsIdle);
      resultsIdle = setTimeout(updateArrows, 150);
    });
  }

});
