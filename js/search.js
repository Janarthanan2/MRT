/**
 * MRT Metal Mart — Intelligent Semantic Search Engine
 * Prioritizes Brass Products and interprets natural language queries.
 */

const SmartSearch = {
  init() {
    this.bindSearch();
  },

  bindSearch() {
    const searchInputs = document.querySelectorAll('.smart-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.processQuery(e.target.value.trim());
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeSearch(e.target.value.trim());
        }
      });
    });

    // Preset chips click
    document.querySelectorAll('.search-preset-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const query = chip.dataset.query;
        searchInputs.forEach(i => i.value = query);
        this.executeSearch(query);
      });
    });
  },

  interpretQuery(query) {
    const qLower = query.toLowerCase();
    const attributes = [];
    let matches = [];

    // Check pre-configured natural language scenarios
    const exactMatch = MRT_DATA.semanticSearchExamples.find(ex => 
      ex.query.toLowerCase() === qLower || qLower.includes(ex.query.toLowerCase())
    );

    if (exactMatch) {
      return {
        attributes: exactMatch.interpretedTags,
        productIds: exactMatch.matchingProductIds
      };
    }

    // Dynamic heuristic parser
    if (qLower.includes('lamp') || qLower.includes('vilakku') || qLower.includes('diya')) {
      attributes.push({ label: 'Item Type', value: 'Traditional Brass Lamp / Diya' });
    }
    if (qLower.includes('pooja') || qLower.includes('temple')) {
      attributes.push({ label: 'Usage', value: 'Pooja & Spiritual Rituals' });
    }
    if (qLower.includes('gift') || qLower.includes('return gift')) {
      attributes.push({ label: 'Occasion', value: 'Auspicious Gifting' });
    }
    if (qLower.includes('trophy') || qLower.includes('cup')) {
      attributes.push({ label: 'Category', value: 'Trophies' });
    }
    if (qLower.includes('medal') || qLower.includes('medals')) {
      attributes.push({ label: 'Category', value: 'Medals' });
    }
    if (qLower.includes('brass')) {
      attributes.push({ label: 'Material', value: '100% Virgin Bell Metal Brass' });
    }

    // Price regex
    const priceMatch = qLower.match(/under\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1]);
      attributes.push({ label: 'Max Budget', value: `₹${maxPrice.toLocaleString('en-IN')}` });
    }

    // Match products
    matches = MRT_DATA.products.filter(p => {
      const hay = (p.title + ' ' + p.category + ' ' + p.subCategory + ' ' + p.description + ' ' + p.material).toLowerCase();
      const words = qLower.split(/\s+/).filter(w => w.length > 2 && !['for', 'the', 'and', 'with', 'under'].includes(w));
      return words.some(w => hay.includes(w));
    }).map(p => p.id);

    if (matches.length === 0) {
      matches = ['p-nilavilakku-18', 'p-brass-urli-12'];
    }

    return { attributes, productIds: matches };
  },

  processQuery(query) {
    if (!query) {
      this.clearResults();
      return;
    }

    const { attributes, productIds } = this.interpretQuery(query);
    this.renderInterpretedTags(attributes);
    this.renderMatchingPreviews(productIds);
  },

  executeSearch(query) {
    this.processQuery(query);
    if (window.AppRouter) {
      window.AppRouter.navigate('search');
    }
  },

  renderInterpretedTags(attributes) {
    const container = document.getElementById('search-interpreted-tags');
    if (!container) return;

    if (!attributes || attributes.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = `
      <span class="interpreted-tag-kicker" style="font-weight: 800; font-size: 11px; text-transform: uppercase; color: var(--color-brass-dark);">AI Interpreted Attributes:</span>
      ${attributes.map(attr => `
        <span class="badge badge-brass-subtle" style="font-size: 11px;">
          <strong>${attr.label}:</strong> ${attr.value}
        </span>
      `).join('')}
    `;
  },

  renderMatchingPreviews(productIds) {
    const countEl = document.getElementById('search-result-count');
    const resultsContainer = document.getElementById('search-results-grid');
    if (countEl) {
      countEl.textContent = `${productIds.length} Matching Products Found`;
    }

    if (resultsContainer) {
      const matched = MRT_DATA.products.filter(p => productIds.includes(p.id));
      resultsContainer.innerHTML = matched.map(p => window.App.createProductCardHtml(p)).join('');
    }
  },

  clearResults() {
    const container = document.getElementById('search-interpreted-tags');
    if (container) {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  }
};
