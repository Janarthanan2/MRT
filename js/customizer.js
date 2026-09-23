/**
 * MRT Metal Mart — Live Interactive Customizer Studio
 */

const AwardCustomizer = {
  state: {
    line1: 'Annual Sports Championship 2026',
    line2: 'Best Player Award',
    line3: 'Presented by MRT Metal Mart',
    font: 'serif', // serif, sans, script
    finish: 'antique-brass', // antique-brass, polished-gold, silver-chrome
    hasLogo: true,
    logoUrl: null,
    quantity: 1,
    requiredDate: '2026-10-15'
  },

  init() {
    this.bindInputs();
    this.render();
  },

  bindInputs() {
    const l1Input = document.getElementById('customizer-line-1');
    const l2Input = document.getElementById('customizer-line-2');
    const l3Input = document.getElementById('customizer-line-3');
    const logoToggle = document.getElementById('customizer-logo-toggle');
    const dateInput = document.getElementById('customizer-date');
    const qtyInput = document.getElementById('customizer-qty');

    if (l1Input) {
      l1Input.addEventListener('input', (e) => {
        this.state.line1 = e.target.value;
        this.updatePlateText();
      });
    }

    if (l2Input) {
      l2Input.addEventListener('input', (e) => {
        this.state.line2 = e.target.value;
        this.updatePlateText();
      });
    }

    if (l3Input) {
      l3Input.addEventListener('input', (e) => {
        this.state.line3 = e.target.value;
        this.updatePlateText();
      });
    }

    if (logoToggle) {
      logoToggle.addEventListener('change', (e) => {
        this.state.hasLogo = e.target.checked;
        this.updatePlateLogo();
      });
    }

    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        this.state.requiredDate = e.target.value;
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('input', (e) => {
        this.state.quantity = parseInt(e.target.value) || 1;
      });
    }

    // Finish buttons
    document.querySelectorAll('.finish-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const finish = btn.dataset.finish;
        this.setFinish(finish);
      });
    });

    // Font buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const font = btn.dataset.font;
        this.setFont(font);
      });
    });
  },

  setFinish(finish) {
    this.state.finish = finish;
    document.querySelectorAll('.finish-option-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.finish === finish);
    });
    const plate = document.getElementById('live-engraving-plate');
    if (plate) {
      plate.className = `engraving-plate-mockup finish-${finish} font-${this.state.font}`;
    }
  },

  setFont(font) {
    this.state.font = font;
    document.querySelectorAll('.font-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.font === font);
    });
    const plate = document.getElementById('live-engraving-plate');
    if (plate) {
      plate.className = `engraving-plate-mockup finish-${this.state.finish} font-${font}`;
    }
  },

  updatePlateText() {
    const l1 = document.getElementById('plate-text-line-1');
    const l2 = document.getElementById('plate-text-line-2');
    const l3 = document.getElementById('plate-text-line-3');

    if (l1) l1.textContent = this.state.line1 || 'YOUR TITLE HERE';
    if (l2) l2.textContent = this.state.line2 || 'AWARD CATEGORY';
    if (l3) l3.textContent = this.state.line3 || '';
  },

  updatePlateLogo() {
    const logoEl = document.getElementById('plate-logo-wrap');
    if (logoEl) {
      logoEl.style.display = this.state.hasLogo ? 'block' : 'none';
    }
  },

  render() {
    this.updatePlateText();
    this.updatePlateLogo();
    this.setFinish(this.state.finish);
    this.setFont(this.state.font);
  }
};
