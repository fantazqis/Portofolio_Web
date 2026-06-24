(function () {
  'use strict';

  const cards      = Array.from(document.querySelectorAll('.cert-card'));
  const filterBar  = document.getElementById('certFilterBar');
  const searchInput= document.getElementById('certSearch');
  const countEl    = document.getElementById('certCount');
  const emptyEl    = document.getElementById('certEmpty');
  const summaryEl  = document.getElementById('certSummary');

  let activeFilter = 'all';
  let searchQuery  = '';

  /* ── Summary chips ── */
  const catLabels = {
    qa:       { label: '🧪 QA & Testing',   count: 0 },
    data:     { label: '📊 Data Analytics', count: 0 },
    frontend: { label: '🎨 Frontend',       count: 0 },
    tools:    { label: '🛠️ Tools & Cloud',  count: 0 },
  };
  cards.forEach(function (c) {
    const cat = c.dataset.cat;
    if (catLabels[cat]) catLabels[cat].count++;
  });
  Object.values(catLabels).forEach(function (item) {
    const chip = document.createElement('span');
    chip.className   = 'cert-summary-chip';
    chip.textContent = item.label + ' · ' + item.count;
    summaryEl.appendChild(chip);
  });

  /* ── Filter + search logic ── */
  function applyFilters() {
    let visible = 0;
    cards.forEach(function (card) {
      const matchCat    = activeFilter === 'all' || card.dataset.cat === activeFilter;
      const nameText    = card.querySelector('.cert-name').textContent.toLowerCase();
      const issuerText  = card.querySelector('.cert-issuer').textContent.toLowerCase();
      const matchSearch = searchQuery === '' ||
                          nameText.includes(searchQuery) ||
                          issuerText.includes(searchQuery);
      if (matchCat && matchSearch) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    countEl.textContent = 'Showing ' + visible + ' of ' + cards.length + ' certificates';
    emptyEl.style.display = visible === 0 ? 'block' : 'none';
  }

  /* ── Filter buttons ── */
  filterBar.addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });

  /* ── Search ── */
  searchInput.addEventListener('input', function () {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  /* ── Initial render ── */
  applyFilters();

})();
