/* Torna itens-pai da sidebar não-clicáveis e só expande/colapsa */
(function () {
  // Edite a lista abaixo com os “pais” que NÃO devem navegar:
  const BLOCK = new Set([
    "Setup",
    "Fundamentals",
    "Identification",
    "Modeling",
    "Control",
    "Interface",
    "Attitude",
    "Vertical",
    "Horizontal",
    // "Início", // só adicione se quiser bloquear também
  ]);

  function shouldBlock(linkEl) {
    if (!linkEl) return false;
    const label = (linkEl.getAttribute('aria-label') || linkEl.textContent || '').trim();
    return BLOCK.has(label);
  }

  function toggleItem(item) {
    // Material usa um input.md-nav__toggle para abrir/fechar
    const toggle = item.querySelector('input.md-nav__toggle');
    if (toggle) {
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    // Fallback: alterna aria-expanded
    const link = item.querySelector('.md-nav__link');
    if (link) {
      const expanded = link.getAttribute('aria-expanded') === 'true';
      link.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    }
  }

  function bind() {
    // Delegação no contêiner da nav (pega itens novos com instant loading)
    const root = document.querySelector('nav.md-nav, .md-sidebar .md-nav');
    if (!root) return;

    // Evita dupla ligação
    if (root.dataset.qcBlockBound === '1') return;
    root.dataset.qcBlockBound = '1';

    root.addEventListener('click', (e) => {
      const link = e.target.closest('.md-nav__link');
      if (!link || !root.contains(link)) return;

      const item = link.closest('.md-nav__item--nested, .md-nav__item');
      if (!item || !shouldBlock(link)) return;

      // Se o clique foi no chevron/toggle, deixa o tema lidar
      if (e.target.closest('.md-nav__icon, .md-nav__toggle, summary')) return;

      // Bloqueia navegação e só alterna abrir/fechar
      e.preventDefault();
      e.stopPropagation();
      toggleItem(item);
    }, true);
  }

  // Suporta navegação instantânea
  if (window.document$) {
    window.document$.subscribe(() => {
      // Pequeno delay garante que a nav já foi re-renderizada
      setTimeout(bind, 0);
    });
  } else {
    document.addEventListener('DOMContentLoaded', bind);
  }
})();
