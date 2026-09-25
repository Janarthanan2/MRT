/**
 * MRT Metal Mart — Product Image Manager
 */
const ProductImageManager = {
  state: { productId: '', images: [] },

  init() {
    this.productInput = document.getElementById('admin-prod-id');
    this.dropzone = document.getElementById('product-image-dropzone');
    this.fileInput = document.getElementById('product-image-input');
    this.grid = document.getElementById('product-image-grid');
    this.status = document.getElementById('product-image-status');
    if (!this.dropzone || !this.fileInput) return;

    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', e => this.handleFiles([...e.target.files]));
    this.dropzone.addEventListener('dragover', e => { e.preventDefault(); this.dropzone.classList.add('dragover'); });
    this.dropzone.addEventListener('dragleave', () => this.dropzone.classList.remove('dragover'));
    this.dropzone.addEventListener('drop', e => {
      e.preventDefault();
      this.dropzone.classList.remove('dragover');
      this.handleFiles([...e.dataTransfer.files]);
    });

    const loadBtn = document.getElementById('load-product-images-btn');
    if (loadBtn) loadBtn.addEventListener('click', () => this.load());
    if (this.productInput) this.productInput.addEventListener('change', () => this.load());
    this.load();
  },

  setStatus(message, type = 'info') {
    if (!this.status) return;
    this.status.textContent = message;
    this.status.className = 'image-manager-status show';
    this.status.style.background = type === 'error' ? 'var(--color-kumkum-tint)' : 'var(--color-brass-tint)';
    this.status.style.color = type === 'error' ? 'var(--color-kumkum-red)' : 'var(--color-brass-dark)';
  },

  async load() {
    const productId = this.productInput?.value.trim();
    if (!productId) return;
    this.state.productId = productId;
    try {
      const result = await MRTApi.getProductImages(productId);
      this.state.images = Array.isArray(result) ? result : (result?.content || result?.images || []);
      this.render();
    } catch (error) {
      this.state.images = [];
      this.render();
      this.setStatus('Image API is not connected yet. Start the backend and try again.', 'error');
    }
  },

  async handleFiles(files) {
    const productId = this.productInput?.value.trim();
    if (!productId) return this.setStatus('Enter a backend Product ID before uploading images.', 'error');

    const valid = files.filter(file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    if (!valid.length) return this.setStatus('Choose image files up to 10 MB each.', 'error');

    for (const [index, file] of valid.entries()) {
      try {
        this.setStatus('Uploading ' + (index + 1) + '/' + valid.length + ': ' + file.name + ' (0%)');
        await MRTApi.uploadProductImage(productId, file, this.state.images.length === 0 && index === 0,
          percent => this.setStatus('Uploading ' + (index + 1) + '/' + valid.length + ': ' + file.name + ' (' + percent + '%)')
        );
      } catch (error) {
        this.setStatus(error.message, 'error');
        return;
      }
    }

    this.setStatus('✓ ' + valid.length + ' image(s) uploaded successfully.');
    this.fileInput.value = '';
    await this.load();
  },

  async setPrimary(imageId) {
    try {
      await MRTApi.setPrimaryProductImage(this.state.productId, imageId);
      this.setStatus('✓ Primary product image updated.');
      await this.load();
    } catch (error) { this.setStatus(error.message, 'error'); }
  },

  async remove(imageId) {
    if (!confirm('Remove this product image?')) return;
    try {
      await MRTApi.deleteProductImage(this.state.productId, imageId);
      this.setStatus('✓ Product image removed.');
      await this.load();
    } catch (error) { this.setStatus(error.message, 'error'); }
  },

  render() {
    if (!this.grid) return;
    if (!this.state.images.length) {
      this.grid.innerHTML = '<div style="grid-column: 1/-1; color: var(--color-light-gray); font-size: 13px;">No images loaded for this product.</div>';
      return;
    }

    this.grid.innerHTML = this.state.images.map(image => {
      const id = image.id ?? image.imageId;
      const url = image.imageUrl ?? image.image_url ?? image.url;
      const primary = Boolean(image.isPrimary ?? image.is_primary);
      return '<article class="image-manager-card">' +
        '<img class="image-manager-thumb" src="' + url + '" alt="' + (image.altText || 'Product image') + '">' +
        '<div class="image-manager-meta">' +
        '<div style="font-weight:800;font-size:12px;">' + (primary ? '★ Primary image' : 'Product image') + '</div>' +
        '<div style="font-size:11px;color:var(--color-light-gray);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + url + '">' + url + '</div>' +
        '<div class="image-manager-actions">' +
        (primary ? '' : `<button class="btn btn-sm btn-outline-brass" onclick="ProductImageManager.setPrimary('${id}')">Set Primary</button>`) +
        `<button class="btn btn-sm btn-secondary" onclick="ProductImageManager.remove('${id}')">Delete</button>` +
        '</div></div></article>';
    }).join('');
  }
};
window.ProductImageManager = ProductImageManager;
