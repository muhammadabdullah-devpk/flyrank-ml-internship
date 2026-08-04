/* script.js — supplementary animations & micro-interactions */
(function () {
  'use strict';

  // Typing effect on paper title subtitle
  function typewriterEffect(el, text, speed) {
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }

  // Stagger workflow step animations
  const steps = document.querySelectorAll('.workflow-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 100);
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  steps.forEach((step, i) => {
    step.style.opacity = '0';
    step.style.transform = 'translateX(-20px)';
    step.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    stepObserver.observe(step);
  });

  // Nogo item stagger
  const nogoItems = document.querySelectorAll('.nogo-item');
  const nogoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }, idx * 80);
        nogoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  nogoItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    nogoObserver.observe(item);
  });

  // Badge sparkle on hover
  document.querySelectorAll('.badge').forEach(badge => {
    badge.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'translateY(-2px) scale(1.05)';
      badge.style.boxShadow = '0 4px 16px rgba(129,140,248,0.3)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
      badge.style.boxShadow = '';
    });
  });

  // Table row highlight pulse on load
  const highlightRow = document.querySelector('.highlight-row');
  if (highlightRow) {
    setTimeout(() => {
      highlightRow.style.transition = 'background 0.5s ease';
      highlightRow.style.background = 'rgba(34,211,238,0.12)';
      setTimeout(() => {
        highlightRow.style.background = '';
      }, 800);
    }, 1500);
  }

  // Metric card entrance animation
  const metricCards = document.querySelectorAll('.metric-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 120);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  metricCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    cardObserver.observe(card);
  });

  // Section number glow on hover
  document.querySelectorAll('.section-num').forEach(num => {
    num.addEventListener('mouseenter', () => {
      num.style.boxShadow = '0 0 16px rgba(129,140,248,0.5)';
      num.style.color = '#c4b5fd';
    });
    num.addEventListener('mouseleave', () => {
      num.style.boxShadow = '';
      num.style.color = '';
    });
    num.style.transition = 'box-shadow 0.3s, color 0.3s';
  });

})();
