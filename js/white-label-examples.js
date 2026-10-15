(() => {
  const section = document.querySelector('.co-white-labels');
  if (!section) return;
  const tabs = [...section.querySelectorAll('.co-brand-tabs [role="tab"]')];
  const select = tab => {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); select(tabs[next]); tabs[next].focus();
    });
  });
  section.querySelectorAll('[data-brand-shot]').forEach(button => {
    button.addEventListener('click', () => {
      const dialog = document.querySelector('.co-shot-dialog');
      dialog.querySelector('img').src = button.dataset.brandShot;
      dialog.querySelector('img').alt = button.dataset.caption;
      dialog.querySelector('p').textContent = button.dataset.caption;
      dialog.showModal();
    });
  });
})();
