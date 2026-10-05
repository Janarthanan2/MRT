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

  async runCategorization(title) {
    if (!title) return;

    const runBtn = document.getElementById('run-ai-categorizer-btn');
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = 'Classifying…';
    }

    try {
      const result = await window.MRTApi.predictProductHsn(title, 3);
      const top = result.topPredictions || [];
      const resGrid = document.getElementById('ai-categorizer-results');

      if (resGrid) {
        resGrid.style.display = 'grid';

        const setText = (id, value) => {
          const element = document.getElementById(id);
          if (element) element.textContent = value;
        };

        setText('ai-res-type', 'HSN Classification');
        setText('ai-res-category', result.hsnCode || '—');
        setText('ai-res-hsn', result.hsnCode || '—');
        setText('ai-res-confidence', ((Number(result.confidence || 0)) * 100).toFixed(2) + '%');
        setText(
          'ai-res-status',
          result.reviewRequired ? 'Manual review recommended' : 'High-confidence suggestion'
        );

        setText(
          'ai-res-sport',
          top.map((item, index) => (index + 1) + '. ' + item.hsnCode).join('  •  ') || '—'
        );

        setText(
          'ai-res-finish',
          top.map(item => (Number(item.confidence || 0) * 100).toFixed(1) + '%').join('  •  ') || '—'
        );

        setText('ai-res-height', 'ML model: TF-IDF + Logistic Regression');
        setText('ai-res-purpose', result.modelVersion || 'hsn-tfidf-logreg-v1');
        setText('ai-res-custom', result.reviewRequired ? 'Review before saving' : 'Prediction ready');
      }

      if (window.App) {
        window.App.showToast(
          result.reviewRequired
            ? '⚠ HSN prediction returned with low confidence. Please review it.'
            : '✓ HSN classification completed.',
          result.reviewRequired ? 'info' : 'success'
        );
      }
    } catch (error) {
      const resGrid = document.getElementById('ai-categorizer-results');
      if (resGrid) resGrid.style.display = 'grid';

      const status = document.getElementById('ai-res-status');
      if (status) status.textContent = 'ML service unavailable';

      if (window.App) {
        window.App.showToast(
          'ML classification failed: ' + error.message,
          'info'
        );
      }
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = 'Run AI Classification';
      }
    }
  }
};
