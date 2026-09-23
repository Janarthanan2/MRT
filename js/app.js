/**
 * MRT Metal Mart — Master Application Controller & Router
 * Prioritizes Brass Products with Trophies & Medals as secondary categories.
 */

const App = {
  state: {
    currentView: 'home',
    currentViewport: 'desktop',
    cart: [
      {
        id: 'p-nilavilakku-18',
        title: 'Brass Traditional Kerala Temple Nilavilakku (18")',
        price: 2499,
        qty: 1,
        engraving: 'Complimentary Temple Gift Box',
        finish: 'Hand-Buffed Antique Brass',
        image: 'assets/images/brass-memento.jpg'
      }
    ],
    wishlist: ['p-brass-urli-12'],
    activeCategory: 'all'
  },

  init() {
    this.bindNavigation();
    this.bindViewportControls();
    this.bindCartEvents();
    this.renderProducts();
    this.updateCartBadge();
    this.updateWishlistBadge();
    
    // Initialize sub-modules
    if (window.AwardCustomizer) window.AwardCustomizer.init();
    if (window.SmartSearch) window.SmartSearch.init();
    if (window.RFQManager) window.RFQManager.init();
    if (window.AdminConsole) window.AdminConsole.init();

    // Check URL hash for routing
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.navigate(hash);
    }
  },

  navigate(viewId) {
    this.state.currentView = viewId;
    window.location.hash = viewId;

    // Hide all view screens
    document.querySelectorAll('.view-screen').forEach(el => {
      el.style.display = 'none';
    });

    // Show target view
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewId);
    });

    // Update presentation bar dropdown
    const screenDropdown = document.getElementById('presentation-screen-select');
    if (screenDropdown) {
      screenDropdown.value = viewId;
    }

    // Close any open drawers
    this.closeMobileNav();
  },

  bindNavigation() {
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const view = el.dataset.view;
        this.navigate(view);
      });
    });

    const screenDropdown = document.getElementById('presentation-screen-select');
    if (screenDropdown) {
      screenDropdown.addEventListener('change', (e) => {
        this.navigate(e.target.value);
      });
    }

    const mobileToggle = document.getElementById('mobile-nav-toggle-btn');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileNav();
      });
    }
  },

  bindViewportControls() {
    const wrapper = document.getElementById('viewport-frame-wrapper');
    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.viewport;
        this.state.currentViewport = mode;

        if (wrapper) {
          wrapper.className = `viewport-frame-wrapper mode-${mode}`;
        }
      });
    });
  },

  bindCartEvents() {
    const cartBtns = document.querySelectorAll('.cart-drawer-trigger');
    cartBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleCartDrawer(true));
    });

    const closeCartBtn = document.getElementById('close-cart-drawer-btn');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => this.toggleCartDrawer(false));
    }
  },

  toggleCartDrawer(show) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      if (show) {
        this.renderCartDrawerItems();
        drawer.classList.add('active');
        overlay.classList.add('active');
      } else {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
      }
    }
  },

  toggleMobileNav() {
    const nav = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (nav && overlay) {
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
    }
  },

  closeMobileNav() {
    const nav = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (nav && overlay) {
      nav.classList.remove('active');
      overlay.classList.remove('active');
    }
  },

  addToCart(productId, customOptions = null) {
    const prod = MRT_DATA.products.find(p => p.id === productId);
    if (!prod) return;

    this.state.cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      qty: customOptions ? customOptions.quantity || 1 : 1,
      engraving: customOptions ? customOptions.engraving || 'Standard Finishing' : 'Standard Finishing',
      finish: customOptions ? customOptions.finish || prod.finish : prod.finish,
      image: prod.image
    });

    this.updateCartBadge();
    this.showToast(`✓ "${prod.title}" added to cart!`, 'success');
    this.toggleCartDrawer(true);
  },

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const totalCount = this.state.cart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => {
      b.textContent = totalCount;
    });
  },

  updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = this.state.wishlist.length;
    });
    this.renderWishlistItems();
  },

  renderCartDrawerItems() {
    const list = document.getElementById('cart-drawer-items-list');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    if (!list) return;

    if (this.state.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--color-light-gray);">
          <div style="font-size: 32px; margin-bottom: 8px;">🛒</div>
          <p>Your shopping cart is currently empty.</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 12px;" onclick="App.toggleCartDrawer(false); App.navigate('brass-catalog');">Explore Brass Products</button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    list.innerHTML = this.state.cart.map((item, idx) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <div style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--color-border-subtle); align-items: center;">
          <img src="${item.image}" alt="${item.title}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border-gray);">
          <div style="flex-grow: 1;">
            <div style="font-weight: 700; font-size: 13px; color: var(--color-charcoal); line-height: 1.3;">${item.title}</div>
            <div style="font-size: 11px; color: var(--color-brass-dark); margin-top: 2px;">${item.engraving}</div>
            <div style="font-size: 12px; font-weight: 800; color: var(--color-charcoal); margin-top: 4px;">Qty: ${item.qty} × ₹${item.price.toLocaleString('en-IN')}</div>
          </div>
          <button style="color: var(--color-muted-gray); font-size: 16px; cursor: pointer; padding: 4px;" onclick="window.App.removeFromCart(${idx})">✕</button>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }
  },

  removeFromCart(index) {
    this.state.cart.splice(index, 1);
    this.updateCartBadge();
    this.renderCartDrawerItems();
  },

  renderWishlistItems() {
    const list = document.getElementById('wishlist-items-container');
    const emptyState = document.getElementById('wishlist-empty-state');
    if (!list) return;

    if (this.state.wishlist.length === 0) {
      list.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    list.style.display = 'grid';

    const items = MRT_DATA.products.filter(p => this.state.wishlist.includes(p.id));
    list.innerHTML = items.map(p => this.createProductCardHtml(p)).join('');
  },

  toggleWishlist(productId, btnEl) {
    const idx = this.state.wishlist.indexOf(productId);
    if (idx > -1) {
      this.state.wishlist.splice(idx, 1);
      if (btnEl) btnEl.classList.remove('active');
      this.showToast('Removed from wishlist', 'info');
    } else {
      this.state.wishlist.push(productId);
      if (btnEl) btnEl.classList.add('active');
      this.showToast('Added to wishlist', 'success');
    }
    this.updateWishlistBadge();
  },

  renderProducts() {
    // 1. Featured Brass Collection (Section 4)
    const featuredBrassContainer = document.getElementById('featured-brass-grid');
    if (featuredBrassContainer) {
      const brassItems = MRT_DATA.products.filter(p => p.categoryId === 'brass');
      featuredBrassContainer.innerHTML = brassItems.map(p => this.createProductCardHtml(p)).join('');
    }

    // 2. Brass Products Listing Page Grid (Section 7)
    const brassCatalogGrid = document.getElementById('brass-catalog-grid');
    if (brassCatalogGrid) {
      const brassItems = MRT_DATA.products.filter(p => p.categoryId === 'brass');
      brassCatalogGrid.innerHTML = brassItems.map(p => this.createProductCardHtml(p)).join('');
    }

    // 3. Trophies Page Grid (Section 11)
    const trophiesCatalogGrid = document.getElementById('trophies-catalog-grid');
    if (trophiesCatalogGrid) {
      const trophyItems = MRT_DATA.products.filter(p => p.categoryId === 'trophies');
      trophiesCatalogGrid.innerHTML = trophyItems.map(p => this.createProductCardHtml(p)).join('');
    }

    // 4. Medals Page Grid (Section 12)
    const medalsCatalogGrid = document.getElementById('medals-catalog-grid');
    if (medalsCatalogGrid) {
      const medalItems = MRT_DATA.products.filter(p => p.categoryId === 'medals');
      medalsCatalogGrid.innerHTML = medalItems.map(p => this.createProductCardHtml(p)).join('');
    }
  },

  createProductCardHtml(p) {
    const isWishlisted = this.state.wishlist.includes(p.id);
    return `
      <div class="product-card">
        <div class="product-card-img-wrap">
          <img src="${p.image}" alt="${p.title}" class="product-card-img">
          <div class="product-card-badges">
            ${p.badges.map(b => `<span class="badge ${b.includes('BRASS') || b.includes('HERITAGE') ? 'badge-brass' : 'badge-bestseller'}">${b}</span>`).join('')}
          </div>
          <button class="product-card-wishlist ${isWishlisted ? 'active' : ''}" onclick="window.App.toggleWishlist('${p.id}', this)" title="Save to Wishlist">
            ♥
          </button>
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${p.subCategory || p.category}</span>
          <h4 class="product-card-title">${p.title}</h4>
          <div class="product-card-rating">
            <div class="rating-stars">★★★★★</div>
            <span class="rating-count">(${p.reviewsCount})</span>
          </div>
          <div class="product-card-specs">
            <span class="badge badge-spec">${p.height}</span>
            <span class="badge badge-spec">${p.weight}</span>
          </div>
          <div class="product-card-footer">
            <div class="product-card-price-wrap">
              <span class="product-card-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="product-card-old-price">₹${p.oldPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-sm btn-outline-brass" onclick="window.App.viewProductDetail('${p.id}')">View</button>
              <button class="btn btn-sm btn-primary" onclick="window.App.addToCart('${p.id}')">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  viewProductDetail(productId) {
    const prod = MRT_DATA.products.find(p => p.id === productId);
    if (!prod) return;

    this.navigate('detail');
    
    // Set PDP fields
    const titleEl = document.getElementById('pdp-title');
    const priceEl = document.getElementById('pdp-price');
    const oldPriceEl = document.getElementById('pdp-old-price');
    const descEl = document.getElementById('pdp-desc');
    const mainImgEl = document.getElementById('pdp-main-image');
    const materialEl = document.getElementById('pdp-spec-material');
    const heightEl = document.getElementById('pdp-spec-height');
    const weightEl = document.getElementById('pdp-spec-weight');
    const finishEl = document.getElementById('pdp-spec-finish');

    if (titleEl) titleEl.textContent = prod.title;
    if (priceEl) priceEl.textContent = `₹${prod.price.toLocaleString('en-IN')}`;
    if (oldPriceEl) oldPriceEl.textContent = `₹${prod.oldPrice.toLocaleString('en-IN')}`;
    if (descEl) descEl.textContent = prod.description;
    if (mainImgEl) mainImgEl.src = prod.image;
    if (materialEl) materialEl.textContent = prod.material;
    if (heightEl) heightEl.textContent = prod.height;
    if (weightEl) weightEl.textContent = prod.weight;
    if (finishEl) finishEl.textContent = prod.finish;

    const pdpAddBtn = document.getElementById('pdp-add-cart-btn');
    if (pdpAddBtn) {
      pdpAddBtn.onclick = () => this.addToCart(prod.id);
    }
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-alert';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: var(--color-deep-brown);
      color: var(--color-white);
      padding: 12px 20px;
      border-radius: var(--radius-sm);
      border-left: 4px solid var(--color-brass-gold);
      box-shadow: var(--shadow-lg);
      font-size: 13.5px;
      font-weight: 600;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      transform: translateY(20px);
      opacity: 0;
    `;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  openModal(title, bodyHtml) {
    const overlay = document.getElementById('global-modal-overlay');
    const titleEl = document.getElementById('global-modal-title');
    const bodyEl = document.getElementById('global-modal-body');
    if (overlay && titleEl && bodyEl) {
      titleEl.textContent = title;
      bodyEl.innerHTML = bodyHtml;
      overlay.classList.add('active');
    }
  },

  closeModal() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }
};

window.App = App;
window.AppRouter = {
  navigate: (view) => App.navigate(view)
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
