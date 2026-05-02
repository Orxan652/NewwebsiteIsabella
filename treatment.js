/* ============================================
   YOUR SKIN CLINIC – Treatment Page Interactions
   Accordion with smooth animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Accordion --- */
  const triggers = document.querySelectorAll('.tx-accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all siblings within the same accordion group
      const accordion = trigger.closest('.tx-accordion');
      accordion.querySelectorAll('.tx-accordion-trigger').forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = other.nextElementSibling;
          otherPanel.classList.remove('is-open');
          otherPanel.style.maxHeight = '0';
          otherPanel.style.opacity = '0';
          setTimeout(() => {
            otherPanel.setAttribute('hidden', '');
            otherPanel.style.maxHeight = '';
            otherPanel.style.opacity = '';
          }, 350);
        }
      });

      // Toggle current
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.style.maxHeight = '0';
        panel.style.opacity = '0';
        setTimeout(() => {
          panel.setAttribute('hidden', '');
          panel.style.maxHeight = '';
          panel.style.opacity = '';
        }, 350);
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
        requestAnimationFrame(() => {
          panel.classList.add('is-open');
        });
      }
    });
  });

});
