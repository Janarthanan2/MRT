/**
 * MRT Metal Mart — Bulk Order & RFQ Workflow Handler
 * Supports 100 brass gifts, 50 trophies, 500 medals & temple offerings.
 */

const RFQManager = {
  presets: {
    'wedding-gifts': {
      org: 'Wedding Celebrations / Family Housewarming',
      category: 'brass-gifts',
      qty: '100',
      script: 'With Best Compliments from Mr. & Mrs. Nair',
      notes: 'Requirement: 100 units of Handcrafted Brass Urli Bowls (8") or Diya Sets with individual silk gift boxing. Needed 2 weeks before wedding muhurtham.'
    },
    'school-sports': {
      org: 'St. Xavier High School / DPS Academy',
      category: 'combo-sports',
      qty: '120',
      script: 'Annual Sports Meet 2026 — Champion',
      notes: 'Requirement:\n- 50 Gold Medals (70mm die-struck)\n- 30 Silver Medals (70mm)\n- 30 Bronze Medals (70mm)\n- 10 Star Football & Athletics Trophies (14")\nSchool crest attached.'
    },
    'temple-offering': {
      org: 'Sri Krishna Seva Samithi / Temple Trust',
      category: 'temple-brass',
      qty: '25',
      script: 'Dedicated to Sri Mahavishnu Temple',
      notes: 'Requirement: 2 large 36" Standing Nilavilakku Lamps and 20 Heavy Brass Pooja Bells with Nandi finials. 100% Virgin Bell Metal Brass certification required.'
    }
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Preset buttons
    document.querySelectorAll('.load-rfq-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        this.loadPreset(presetKey);
      });
    });

    const rfqForm = document.getElementById('bulk-rfq-form');
    if (rfqForm) {
      rfqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitRFQ(new FormData(rfqForm));
      });
    }
  },

  loadPreset(presetKey) {
    const preset = this.presets[presetKey];
    if (!preset) return;

    const orgInput = document.getElementById('rfq-organization');
    const qtyInput = document.getElementById('rfq-quantity');
    const scriptInput = document.getElementById('rfq-engraving-notes');
    const notesInput = document.getElementById('rfq-notes');

    if (orgInput) orgInput.value = preset.org;
    if (qtyInput) qtyInput.value = preset.qty;
    if (scriptInput) scriptInput.value = preset.script;
    if (notesInput) notesInput.value = preset.notes;

    if (window.App) {
      window.App.showToast(`✓ "${preset.org}" bulk requirements loaded!`, 'success');
    }

    const formCard = document.getElementById('bulk-rfq-form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth' });
    }
  },

  submitRFQ(formData) {
    const quoteRef = 'RFQ-MRT-' + Math.floor(100000 + Math.random() * 900000);
    
    const summaryHtml = `
      <div style="text-align: center; padding: 20px 0;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--color-brass-tint); border: 2px solid var(--color-brass); color: var(--color-brass-dark); font-size: 24px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">✓</div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Quotation Request Registered</h3>
        <p style="color: var(--color-light-gray); font-size: 14px; margin-bottom: 20px;">Reference ID: <strong>${quoteRef}</strong></p>
        <div style="background-color: var(--color-warm-ivory); border: 1px solid var(--color-border-gray); border-radius: 8px; padding: 16px; text-align: left; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
          <div><strong>Workflow Stage:</strong> <span style="color: var(--color-brass-dark); font-weight: 700;">Enquiry Received → Foundry Costing</span></div>
          <div><strong>Response Window:</strong> Direct factory quotation sent via WhatsApp & Email within 4 working hours.</div>
          <div><strong>Auspicious Assurance:</strong> 100% Virgin Bell Metal Purity guaranteed with official brass foundry metallurgical certificates.</div>
        </div>
        <button class="btn btn-primary" onclick="window.App.closeModal()">Return to Showcase</button>
      </div>
    `;

    if (window.App) {
      window.App.openModal('Quotation Submitted', summaryHtml);
    }
  }
};
