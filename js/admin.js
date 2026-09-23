/**
 * MRT Metal Mart — Admin Console, Product Management & Bulk Enquiry Pipeline
 */

const AdminConsole = {
  init() {
    this.bindAdminForms();
    this.bindEnquiryStatuses();
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
