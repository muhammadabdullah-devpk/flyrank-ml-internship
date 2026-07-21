function copyUrl() {
  const liveUrlText = document.getElementById('live-url').innerText;
  navigator.clipboard.writeText(liveUrlText).then(() => {
    const btn = document.getElementById('copy-url-btn');
    const origText = btn.innerText;
    btn.innerText = 'Copied!';
    btn.style.background = '#10b981';
    btn.style.color = '#09090b';
    setTimeout(() => {
      btn.innerText = origText;
      btn.style.background = 'var(--accent)';
      btn.style.color = '#ffffff';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
