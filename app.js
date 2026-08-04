/* ================================================================
   FlyRank Capstone — Premium App JavaScript
   Particle system, scroll reveal, count-up, animations, queue filter
   ================================================================ */

(function () {
  'use strict';

  // ── PARTICLE SYSTEM ──────────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return Math.random() * (b - a) + a; }

  const COLORS = ['rgba(34,211,238,', 'rgba(129,140,248,', 'rgba(232,121,249,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.vx = randomBetween(-0.3, 0.3);
      this.vy = randomBetween(-0.3, 0.3);
      this.r = randomBetween(1, 2.5);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = randomBetween(0.3, 0.8);
    }
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor((W * H) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = (1 - dist / 150) * 0.2;
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  let raf;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.move(); p.draw(); });
    raf = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); });


  // ── SCROLL REVEAL ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── ANIMATED RESULT BARS ─────────────────────────────────────
  const barsSection = document.getElementById('results-bars');
  if (barsSection) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.result-bar-fill');
          fills.forEach(fill => {
            const w = parseFloat(fill.style.getPropertyValue('--bar-width') || '0');
            fill.style.transformOrigin = 'left center';
            fill.style.transform = `scaleX(0)`;
            setTimeout(() => {
              fill.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
              fill.style.transform = `scaleX(${w})`;
            }, 100);
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barObserver.observe(barsSection);
  }


  // ── VIEW SECTION SWITCHER ────────────────────────────────────
  const navBtns = document.querySelectorAll('.nav-btn');
  const viewSections = document.querySelectorAll('.view-section');

  function showAll() {
    viewSections.forEach(s => { s.style.display = ''; });
    navBtns.forEach(b => b.classList.remove('active'));
    document.getElementById('btn-all')?.classList.add('active');
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (target === 'all') {
        showAll();
        return;
      }

      viewSections.forEach(s => {
        const alwaysVisible = s.classList.contains('always-visible');
        const isTarget = s.id === target;
        s.style.display = (alwaysVisible || isTarget) ? '' : 'none';
      });

      // Scroll to target
      const el = document.getElementById(target);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  // Show all on page load
  showAll();


  // ── QUEUE FILTER ─────────────────────────────────────────────
  const searchInput = document.getElementById('queue-search-input');
  const reasonFilter = document.getElementById('reason-code-filter');
  const queueRows = document.querySelectorAll('.queue-row');

  function filterQueue() {
    const search = (searchInput?.value || '').toLowerCase();
    const reason = reasonFilter?.value || 'all';

    queueRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowReason = (row.getAttribute('data-reason') || '');
      const matchesSearch = !search || text.includes(search);
      const matchesReason = reason === 'all' || rowReason.includes(reason);
      row.style.display = (matchesSearch && matchesReason) ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', filterQueue);
  reasonFilter?.addEventListener('change', filterQueue);


  // ── COPY BUTTON HANDLER ──────────────────────────────────────
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const el = document.getElementById(targetId);
      if (!el) return;
      const text = el.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.color = '#34d399';
        setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
      });
    });
  });

  // Pitch copy button
  const pitchBtn = document.getElementById('copy-pitch-btn');
  const pitchText = document.querySelector('.pitch-quote')?.innerText || '';
  pitchBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(pitchText).then(() => {
      pitchBtn.textContent = '✓ Copied!';
      setTimeout(() => { pitchBtn.textContent = 'Copy Pitch Text 📋'; }, 2000);
    });
  });


  // ── METRIC CARD HOVER 3D TILT ────────────────────────────────
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      card.style.transform = `translateY(-4px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });


  // ── SMOOTH HASH SCROLL ───────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── SECTION HIGHLIGHT ON SCROLL ──────────────────────────────
  const sections = document.querySelectorAll('article[id], header[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Could highlight nav items if needed
      }
    });
  }, { threshold: 0.2 });
  sections.forEach(s => sectionObserver.observe(s));


  // ── PAGE LOAD REVEAL ─────────────────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });


  // ── ANIMATED GRADIENT BORDER ON SECTION HOVER ────────────────
  document.querySelectorAll('.paper-section').forEach(section => {
    section.addEventListener('mouseenter', () => {
      section.style.borderColor = 'rgba(129,140,248,0.35)';
      section.style.boxShadow = '0 8px 48px rgba(129,140,248,0.12), inset 0 1px 0 rgba(255,255,255,0.06)';
      section.style.transition = 'border-color 0.3s, box-shadow 0.3s';
    });
    section.addEventListener('mouseleave', () => {
      section.style.borderColor = '';
      section.style.boxShadow = '';
    });
  });

})();
