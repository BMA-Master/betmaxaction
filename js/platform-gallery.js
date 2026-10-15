(() => {
  const dialog = document.querySelector('.co-shot-dialog');
  if (!dialog) return;
  const preview = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  document.querySelectorAll('[data-shot-gallery]').forEach(gallery => {
    const main = gallery.querySelector('.co-shot-main img');
    const text = gallery.querySelector('figcaption');
    const expand = gallery.querySelector('.co-shot-expand');
    gallery.querySelectorAll('.co-shot-option').forEach(button => {
      button.addEventListener('click', () => {
        gallery.querySelectorAll('.co-shot-option').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        main.src = button.dataset.src;
        main.alt = text.textContent = button.dataset.caption;
        expand.setAttribute('aria-label', 'Enlarge ' + button.dataset.title);
      });
    });
    expand.addEventListener('click', () => {
      preview.src = main.src;
      preview.alt = caption.textContent = main.alt;
      dialog.showModal();
    });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
