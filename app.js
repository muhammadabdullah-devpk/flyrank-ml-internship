/* ================================================================
   FlyRank Applied ML & Search Intelligence — Capstone Web Controller
   Developer: Muhammad Abdullah
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initCopyButtons();
  initQueueSearch();
});

// Tab Navigation logic
function initTabNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetId === 'all') {
        sections.forEach(s => s.style.display = 'block');
      } else {
        sections.forEach(s => {
          if (s.id === targetId || s.classList.contains('always-visible')) {
            s.style.display = 'block';
          } else {
            s.style.display = 'none';
          }
        });
      }
    });
  });
}

// Copy to Clipboard logic
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      let textToCopy = '';
      
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        textToCopy = targetEl ? targetEl.innerText : '';
      } else {
        textToCopy = btn.getAttribute('data-copy-text') || '';
      }

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
          const origText = btn.innerText;
          btn.innerText = 'Copied! ✓';
          btn.style.background = 'var(--accent)';
          btn.style.color = '#000000';
          setTimeout(() => {
            btn.innerText = origText;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
  });
}

// Interactive Queue Filter / Search
function initQueueSearch() {
  const searchInput = document.getElementById('queue-search-input');
  const reasonFilter = document.getElementById('reason-code-filter');
  const queueRows = document.querySelectorAll('.queue-row');

  if (!searchInput || !reasonFilter) return;

  function filterQueue() {
    const q = searchInput.value.toLowerCase();
    const reason = reasonFilter.value.toLowerCase();

    queueRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const rowReason = row.getAttribute('data-reason') || '';

      const matchesSearch = text.includes(q);
      const matchesReason = reason === 'all' || rowReason.toLowerCase().includes(reason);

      if (matchesSearch && matchesReason) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', filterQueue);
  reasonFilter.addEventListener('change', filterQueue);
}
