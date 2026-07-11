/* ─────────────────────────────────────────────────────────────────────
   Portfolio Sitemap — script.js
   Week 01 Task 04 | FlyRank AI Fluency Track
───────────────────────────────────────────────────────────────────── */

/* ── Animated Background Canvas ── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // Floating particles
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.4 + 0.05,
    hue: Math.random() > 0.5 ? 215 : 260,
  }));

  // Connection lines
  const maxDist = 140;

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(${particles[i].hue}, 80%, 70%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

/* ── Scroll Reveal Animation ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.page-card, .excluded-card, .step-card, .prompt-card, .response-card, .change-noted, .visitor-node, .goal-node, .claim-inner'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger cards within the same parent
          const siblings = Array.from(entry.target.parentNode.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ── Header Scroll Effect ── */
(function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(8,11,20,0.92)';
    } else {
      header.style.background = 'rgba(8,11,20,0.7)';
    }
  }, { passive: true });
})();

/* ── Page Card Interactive Glow ── */
(function initCardGlow() {
  document.querySelectorAll('.page-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      card.style.setProperty('--mx', `${px}%`);
      card.style.setProperty('--my', `${py}%`);
      card.style.background = `
        radial-gradient(circle at ${px}% ${py}%, rgba(91,158,244,0.07) 0%, transparent 60%),
        var(--card-bg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ── Flow Line Animated Dashes ── */
(function initFlowPulse() {
  const lines = document.querySelectorAll('.flow-line');
  lines.forEach((line, i) => {
    line.style.animation = `flowPulse ${1.5 + i * 0.2}s ease-in-out infinite alternate`;
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes flowPulse {
      from { opacity: 0.4; }
      to   { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── Number counter animation for page count ── */
(function initCounterBadge() {
  // Show a toast after 3 seconds
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: rgba(14,20,34,0.95);
      border: 1px solid rgba(91,158,244,0.3);
      border-radius: 14px;
      padding: 16px 22px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: #e2e8f5;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      z-index: 200;
      animation: slideInRight 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
      max-width: 300px;
      line-height: 1.5;
    `;
    toast.innerHTML = `
      <span style="font-size:1.4rem">💡</span>
      <span><strong style="color:#5b9ef4">Pro tip:</strong> Every page card is interactive — hover to explore!</span>
    `;
    document.body.appendChild(toast);

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(styleEl);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }, 3000);
})();
