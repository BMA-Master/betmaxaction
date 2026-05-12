// Knowledge Base — list page filter/search + article TOC

(function () {
    'use strict';

    // ----- List page: search + category filter (with #category=slug hash) -----
    function initKbList() {
        const searchInput = document.getElementById('kb-search-input');
        const categoryTags = document.querySelectorAll('.kb-category-tag');
        const articleCards = document.querySelectorAll('.kb-article-card');
        const articlesGrid = document.querySelector('.kb-articles-grid');

        if (!articlesGrid && !searchInput) return;

        const searchIndex = Array.from(articleCards).map(function (card) {
            const title = (card.querySelector('.kb-article-title') || {}).textContent || '';
            const excerpt = (card.querySelector('.kb-article-excerpt') || {}).textContent || '';
            const tags = Array.from(card.querySelectorAll('.kb-article-tag'))
                .map(function (t) { return t.textContent; }).join(' ');
            return {
                element: card,
                category: card.dataset.category || '',
                searchText: (title + ' ' + excerpt + ' ' + tags).toLowerCase()
            };
        });

        let activeCategory = 'all';
        let activeQuery = '';

        function applyFilters() {
            let visibleCount = 0;
            searchIndex.forEach(function (item) {
                const matchCategory = activeCategory === 'all' || item.category === activeCategory;
                const matchQuery = activeQuery === '' || item.searchText.indexOf(activeQuery) !== -1;
                const visible = matchCategory && matchQuery;
                item.element.style.display = visible ? 'flex' : 'none';
                if (visible) visibleCount++;
            });

            let emptyEl = document.querySelector('.kb-empty-search');
            if (visibleCount === 0 && articlesGrid) {
                if (!emptyEl) {
                    emptyEl = document.createElement('div');
                    emptyEl.className = 'kb-empty-state kb-empty-search';
                    emptyEl.innerHTML =
                        '<span class="material-symbols-outlined kb-empty-icon">search_off</span>' +
                        '<h3>No results</h3>' +
                        '<p>Try a different search term or category.</p>';
                    articlesGrid.parentNode.insertBefore(emptyEl, articlesGrid.nextSibling);
                }
            } else if (emptyEl) {
                emptyEl.remove();
            }
        }

        function setCategory(slug) {
            activeCategory = slug;
            categoryTags.forEach(function (tag) {
                const isActive = tag.dataset.category === slug;
                tag.classList.toggle('active', isActive);
                tag.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            applyFilters();
        }

        // Click handlers on category chips
        categoryTags.forEach(function (tag) {
            tag.addEventListener('click', function () {
                const slug = this.dataset.category;
                setCategory(slug);
                if (slug === 'all') {
                    history.replaceState(null, '', window.location.pathname);
                } else {
                    history.replaceState(null, '', '#category=' + slug);
                }
            });
        });

        // Search input (debounced)
        if (searchInput) {
            let timer;
            searchInput.addEventListener('input', function (e) {
                clearTimeout(timer);
                const value = e.target.value.toLowerCase().trim();
                timer = setTimeout(function () {
                    activeQuery = value;
                    applyFilters();
                }, 200);
            });
        }

        // Read hash on load (e.g. #category=press-release)
        function readHash() {
            const hash = window.location.hash.replace('#', '');
            if (!hash) return;
            const params = hash.split('&').reduce(function (acc, kv) {
                const parts = kv.split('=');
                if (parts.length === 2) acc[parts[0]] = decodeURIComponent(parts[1]);
                return acc;
            }, {});
            if (params.category) {
                const valid = Array.from(categoryTags).some(function (t) {
                    return t.dataset.category === params.category;
                });
                if (valid) setCategory(params.category);
            }
        }
        readHash();
        window.addEventListener('hashchange', readHash);
    }

    // ----- Article page: TOC build + scrollspy -----
    function initKbToc() {
        const tocNav = document.getElementById('kb-toc-nav');
        const content = document.getElementById('kb-article-content');
        if (!tocNav || !content) return;

        const headings = content.querySelectorAll('h2, h3');
        if (headings.length < 2) {
            const tocPanel = document.getElementById('kb-toc');
            if (tocPanel) tocPanel.style.display = 'none';
            return;
        }

        const ul = document.createElement('ul');
        const tocLinks = [];

        headings.forEach(function (h, i) {
            if (!h.id) {
                h.id = 'section-' + i + '-' + h.textContent.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-');
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            if (h.tagName === 'H3') a.classList.add('kb-toc-h3');
            li.appendChild(a);
            ul.appendChild(li);
            tocLinks.push({ link: a, target: h });
        });

        tocNav.appendChild(ul);

        // Scrollspy
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    tocLinks.forEach(function (item) {
                        item.link.classList.toggle('active', item.target === entry.target);
                    });
                }
            });
        }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

        tocLinks.forEach(function (item) { observer.observe(item.target); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initKbList();
        initKbToc();
    });
})();
