(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = document.querySelectorAll('.co-game-modes, .co-sports-section');
  window.SportRegistry?.hydrate();

  sections.forEach(section => {
    const rows = [...section.querySelectorAll('.co-mode-cards, .co-sports-row')];
    const rebuilds = rows.map((track, index) => {
      const originals = [...track.children];
      const viewport = document.createElement('div');
      viewport.className = 'co-conveyor';
      viewport.tabIndex = 0;
      viewport.setAttribute('role', 'region');
      viewport.setAttribute('aria-label', track.getAttribute('aria-label'));
      track.removeAttribute('tabindex');
      track.before(viewport);
      viewport.append(track);
      track.classList.add('co-conveyor-track');
      if (index % 2) track.classList.add('co-conveyor-reverse');
      let previousWidth = 0;
      const rebuild = () => {
        track.querySelectorAll('[data-loop-copy]').forEach(copy => copy.remove());
        if (reducedMotion.matches) return;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const period = originals.reduce((total, card) => total + card.getBoundingClientRect().width + gap, 0);
        if (!period) return;
        // Repeat whole sets and travel exactly one set, including its trailing gap.
        const copies = Math.ceil(viewport.clientWidth / period) + 1;
        for (let i = 0; i < copies; i++) originals.forEach(card => {
          const copy = card.cloneNode(true);
          copy.dataset.loopCopy = '';
          copy.setAttribute('aria-hidden', 'true');
          copy.inert = true;
          track.append(copy);
        });
        track.style.setProperty('--co-loop-distance', `${-period}px`);
        track.style.setProperty('--co-loop-duration', `${period / (innerWidth <= 620 ? 26 : 40)}s`);
      };
      new ResizeObserver(() => {
        const width = viewport.clientWidth;
        if (width !== previousWidth) { previousWidth = width; rebuild(); }
      }).observe(viewport);
      return rebuild;
    });
    const sync = () => {
      section.classList.toggle('co-motion-paused', document.hidden);
    };
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', () => { rebuilds.forEach(rebuild => rebuild()); sync(); });
    rebuilds.forEach(rebuild => rebuild());
    sync();
  });
})();
