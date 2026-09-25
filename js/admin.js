/**
 * MRT Metal Mart — Admin Console, Product Management & Bulk Enquiry Pipeline
 */

const AdminConsole = {
  init() {
    this.bindAdminForms();
    this.bindEnquiryStatuses();
    if (window.ProductImageManager) window.ProductImageManager.init();
  },

  bindAdminForms() {
    // Product management form submission (Section 21)
    const productForm = document.getElementById('admin-add-product-form');
    if (productForm) {
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('admin-prod-title').value;
        if (window.App) {
          window.App.showToast(`✓ Brass product "${title}" successfully cataloged!`, 'success');
        }
        productForm.reset();
      });
    }

    this.bindImageUpload();

    // AI Categorizer buttons
    const runBtn = document.getElementById('run-ai-categorizer-btn');
    const input = document.getElementById('ai-product-input');
    const saveBtn = document.getElementById('save-ai-product-btn');

    if (runBtn && input) {
      runBtn.addEventListener('click', () => {
        this.runCategorization(input.value.trim());
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (window.App) {
          window.App.showToast('✓ AI-classified brass specifications saved to catalog!', 'success');
        }
      });
    }
  },

  bindImageUpload() {
    const fileInput = document.getElementById('admin-prod-images');
    const preview = document.getElementById('admin-image-preview');
    const uploadBtn = document.getElementById('admin-upload-images-btn');
    const clearBtn = document.getElementById('admin-clear-images-btn');
    const productIdInput = document.getElementById('admin-prod-id');
    const status = document.getElementById('admin-image-upload-status');

    if (!fileInput || !preview || !uploadBtn) return;

    const renderPreview = () => {
      preview.innerHTML = '';
      Array.from(fileInput.files || []).forEach((file, index) => {
        const url = URL.createObjectURL(file);
        const card = document.createElement('div');
        card.className = 'image-preview-card';
        card.innerHTML = `
          <img src="${url}" alt="Preview of ${file.name}">
          <div class="image-preview-meta">
            <strong>${file.name}</strong>
            <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <label class="image-primary-toggle">
            <input type="radio" name="admin-primary-image" value="${index}" ${index === 0 ? 'checked' : ''}>
            Primary image
          </label>
        `;
        preview.appendChild(card);
      });
    };

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 10) {
        fileInput.value = '';
        preview.innerHTML = '';
        if (window.App) window.App.showToast('Maximum 10 images can be uploaded at once.', 'info');
        return;
      }
      renderPreview();
    });

    clearBtn?.addEventListener('click', () => {
      fileInput.value = '';
      preview.innerHTML = '';
      if (status) status.textContent = '';
    });

    uploadBtn.addEventListener('click', async () => {
      const productId = productIdInput?.value?.trim();
      const files = Array.from(fileInput.files || []);
      const primaryIndex = Number(document.querySelector('input[name="admin-primary-image"]:checked')?.value || 0);

      if (!productId) {
        if (window.App) window.App.showToast('Enter the existing Product ID before uploading images.', 'info');
        return;
      }
      if (!files.length) {
        if (window.App) window.App.showToast('Select at least one product image.', 'info');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading…';
      if (status) status.textContent = 'Uploading product images…';

      try {
        for (let index = 0; index < files.length; index++) {
          await window.MRTApi.uploadProductImage(
            productId,
            files[index],
            index === primaryIndex,
            (progress) => {
              if (status) status.textContent = `Uploading ${index + 1}/${files.length}: ${progress}%`;
            }
          );
        }

        if (status) status.textContent = `${files.length} image(s) uploaded successfully.`;
        if (window.App) window.App.showToast(`✓ ${files.length} product image(s) uploaded.`, 'success');
        fileInput.value = '';
        preview.innerHTML = '';
      } catch (error) {
        if (status) status.textContent = error.message;
        if (window.App) window.App.showToast(`Image upload failed: ${error.message}`, 'info');
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Images to Product →';
      }
    });
  },

  bindEnquiryStatuses() {
    // Interactive status update for bulk enquiries (Section 22)
    document.querySelectorAll('.enquiry-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = btn.closest('tr');
        const badge = row.querySelector('.enquiry-status-badge');
        const nextStatus = btn.dataset.status;
        if (badge) {
          badge.textContent = nextStatus;
          if (nextStatus === 'Quote Sent') {
            badge.style.backgroundColor = 'var(--color-brass-tint)';
            badge.style.color = 'var(--color-brass-dark)';
          } else if (nextStatus === 'Accepted') {
            badge.style.backgroundColor = 'var(--color-success-bg)';
            badge.style.color = 'var(--color-success)';
          }
        }
        if (window.App) {
          window.App.showToast(`✓ RFQ status updated to: ${nextStatus}`, 'info');
        }
      });
    });
  },

  runCategorization(title) {
    if (!title) return;

    // Simulate intelligent metadata extraction
    const results = {
      productType: title.toLowerCase().includes('lamp') || title.toLowerCase().includes('vilakku') ? 'Temple Oil Lamp' : 'Traditional Brassware',
      category: 'Brass Products (Primary)',
      material: '100% Virgin Bell Metal Brass',
      finish: 'Hand-Buffed Antique Patina',
      weight: '3.2 kg (Heavy Gauge Sand Cast)',
      occasion: 'Pooja, Temple & Housewarming',
      customization: 'Available (Custom Inscription)'
    };

    const resGrid = document.getElementById('ai-categorizer-results');
    if (resGrid) {
      resGrid.style.display = 'grid';
      document.getElementById('ai-res-type').textContent = results.productType;
      document.getElementById('ai-res-category').textContent = results.category;
      document.getElementById('ai-res-sport').textContent = results.material;
      document.getElementById('ai-res-finish').textContent = results.finish;
      document.getElementById('ai-res-height').textContent = results.weight;
      document.getElementById('ai-res-purpose').textContent = results.occasion;
      document.getElementById('ai-res-custom').textContent = results.customization;
    }

    if (window.App) {
      window.App.showToast('✓ Brass taxonomy & metallurgical specs extracted!', 'info');
    }
  }
};
