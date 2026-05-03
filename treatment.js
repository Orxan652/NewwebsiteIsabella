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

});
