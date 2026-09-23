/**
 * MRT Metal Mart — Catalog & Application Data (Kerala Brass Heritage & Recognition)
 * 
 * Note: All metrics, reviews, and pricing shown are illustrative UI demonstration data.
 */

const MRT_DATA = {
  // Brand Manifesto
  brand: {
    name: 'MRT Metal Mart',
    tagline: 'Brass Heritage • Modern Shopping • Meaningful Awards',
    location: 'Kerala, India',
    heritageYears: '35+ Years of Metalcraft Mastery',
    phone: '+91 80 2234 5678',
    email: 'contact@mrtmetalmart.com'
  },

  // 3 Primary Categories (Section 3 — Brass Products is Visually Dominant)
  primaryCategories: [
    {
      id: 'cat-brass-main',
      name: 'Brass Products',
      subtitle: 'Traditional elegance for every space.',
      cta: 'Explore Brass →',
      image: 'assets/images/brass-memento.jpg',
      isDominant: true,
      description: 'Handcrafted Nilavilakku, pooja diyas, sacred idols, urlis, temple bells, and timeless artisanal home accents cast from virgin bell metal brass.'
    },
    {
      id: 'cat-trophies-main',
      name: 'Trophies',
      subtitle: 'Celebrate achievements.',
      cta: 'Explore Trophies →',
      image: 'assets/images/trophy-football.jpg',
      isDominant: false,
      description: 'Championship cups, sculptural stars, and tournament trophies on polished teak pedestals.'
    },
    {
      id: 'cat-medals-main',
      name: 'Medals',
      subtitle: 'Recognize every achievement.',
      cta: 'Explore Medals →',
      image: 'assets/images/medals-set.jpg',
      isDominant: false,
      description: 'Die-struck brass, gold, silver, and bronze medallions with woven grosgrain neck ribbons.'
    }
  ],

  // 6 Brass Product Collections (Section 5)
  brassCollections: [
    {
      id: 'pooja-spiritual',
      title: 'Pooja & Spiritual',
      tagline: 'Brass diyas, lamps, bells, and sacred pooja accessories.',
      itemCount: 42,
      image: 'assets/images/brass-memento.jpg'
    },
    {
      id: 'home-decor',
      title: 'Home Décor',
      tagline: 'Artisanal brass statues, floral urlis, showpieces, and urns.',
      itemCount: 36,
      image: 'assets/images/hero-awards.jpg'
    },
    {
      id: 'traditional-brassware',
      title: 'Traditional Brassware',
      tagline: 'Plates, thalis, vessels, containers, and heirloom dining pieces.',
      itemCount: 28,
      image: 'assets/images/brass-memento.jpg'
    },
    {
      id: 'brass-gifts',
      title: 'Brass Gifts',
      tagline: 'Auspicious mementos for weddings, housewarmings, and festivals.',
      itemCount: 31,
      image: 'assets/images/plaque-shield.jpg'
    },
    {
      id: 'awards-mementos',
      title: 'Awards & Mementos',
      tagline: 'Hand-engraved brass plaques, mementos, and corporate distinction.',
      itemCount: 24,
      image: 'assets/images/trophy-corporate.jpg'
    },
    {
      id: 'custom-brass',
      title: 'Custom Brass',
      tagline: 'Bespoke castings, corporate crest inlays, and customized metalwork.',
      itemCount: 16,
      image: 'assets/images/trophy-football.jpg'
    }
  ],

  // Festive Promotional Collection (Section 6)
  festivePromotions: [
    { name: 'Vishu & Onam Editions', badge: 'KERALA HERITAGE', desc: 'Handcrafted Nilavilakku & auspicious brass kinaris' },
    { name: 'Diwali Deepam Special', badge: 'FESTIVE GLOW', desc: 'Tiered brass diyas and peacock thookkuvilakku' },
    { name: 'Wedding Return Gifts', badge: 'BULK PACKS', desc: 'Curated sets of brass urlis and bells with gift boxing' },
    { name: 'Temple Offerings', badge: 'SACRED CAST', desc: 'Heavy bell-metal brass bells & large sanctum lamps' }
  ],

  // Full Catalog (Brass Products prominently featured first, then Trophies & Medals)
  products: [
    {
      id: 'p-nilavilakku-18',
      title: 'Brass Traditional Kerala Temple Nilavilakku (18 Inch)',
      category: 'Brass Products',
      subCategory: 'Pooja & Spiritual',
      categoryId: 'brass',
      price: 2499,
      oldPrice: 2999,
      rating: 4.9,
      reviewsCount: 184,
      image: 'assets/images/brass-memento.jpg',
      badges: ['FEATURED BRASS', 'HERITAGE CRAFT'],
      material: '100% Virgin Bell Metal Brass',
      height: '18 Inches (45.7 cm)',
      weight: '3.2 kg (Heavy Cast)',
      finish: 'Hand-Buffed Antique Golden Brass',
      inStock: true,
      customizable: true,
      occasion: 'Pooja, Housewarming, Temple & Vishu',
      bulkTiers: [
        { qty: '1 - 4 pcs', price: '₹2,499' },
        { qty: '5 - 19 pcs', price: '₹2,150' },
        { qty: '20+ pcs', price: '₹1,850' }
      ],
      description: 'Handcrafted by Kerala brass metal artisans, this sacred 18-inch Nilavilakku features an authentic 5-wick lotus oil bowl, tapered ribbed spire, and a weighted stepped base for absolute stability. Cast from virgin bell-metal brass to retain a radiant warmth across generations.',
      specs: {
        'Material Purity': '100% Virgin Grade Bell Metal Brass',
        'Height': '18 Inches (45.7 cm)',
        'Weight': '3.2 kg',
        'Oil Reservoir': '5 Cotton Wick Grooves (Pancha Mukha)',
        'Origin': 'Mannar / Alappuzha Artisanal Cluster, Kerala',
        'Care Instructions': 'Clean with pitambari or tamarind water; dry immediately.'
      }
    },
    {
      id: 'p-brass-urli-12',
      title: 'Brass Decorative Floral Urli with Hand-Carved Handles (12")',
      category: 'Brass Products',
      subCategory: 'Home Décor',
      categoryId: 'brass',
      price: 1899,
      oldPrice: 2350,
      rating: 4.9,
      reviewsCount: 96,
      image: 'assets/images/hero-awards.jpg',
      badges: ['BEST SELLER', 'HOME DÉCOR'],
      material: 'Solid Spun & Cast Brass',
      height: '4.5" Depth, 12" Diameter',
      weight: '2.1 kg',
      finish: 'Warm Satin Gold',
      inStock: true,
      customizable: false,
      occasion: 'Home Entrance, Diwali, Floating Flowers',
      bulkTiers: [
        { qty: '1 - 9 pcs', price: '₹1,899' },
        { qty: '10 - 49 pcs', price: '₹1,599' },
        { qty: '50+ pcs', price: '₹1,350' }
      ],
      description: 'An auspicious brass urli bowl designed for entrance foyers and festive floral arrangements. Cast with decorative fluted sides and ornate peacock side handles. Perfect for floating marigold blossoms and scented tea-lights.',
      specs: {
        'Material': 'High-tensile Solid Cast Brass',
        'Diameter': '12 Inches (30.5 cm)',
        'Capacity': '2.5 Liters of water',
        'Weight': '2.1 kg',
        'Finish': 'Tarnish-resistant clear protective lacquer'
      }
    },
    {
      id: 'p-lakshmi-diya',
      title: 'Brass Ashta Lakshmi Kamakshi Deepam Lamp (8")',
      category: 'Brass Products',
      subCategory: 'Pooja & Spiritual',
      categoryId: 'brass',
      price: 1299,
      oldPrice: 1599,
      rating: 4.8,
      reviewsCount: 142,
      image: 'assets/images/brass-memento.jpg',
      badges: ['AUSPICIOUS', 'POOJA ESSENTIAL'],
      material: 'Solid Cast Brass',
      height: '8 Inches',
      weight: '1.1 kg',
      finish: 'Antique Temple Finish',
      inStock: true,
      customizable: true,
      occasion: 'Daily Pooja & Griha Pravesh',
      bulkTiers: [
        { qty: '1 - 10 pcs', price: '₹1,299' },
        { qty: '11 - 50 pcs', price: '₹1,050' },
        { qty: '51+ pcs', price: '₹899' }
      ],
      description: 'Traditional Kamakshi Amman vilakku embossed with the divine Ashta Lakshmi forms along the crown arch. Heavy cast base ensures safe burning during evening prayers and auspicious festivals.',
      specs: {
        'Material': 'Solid Virgin Brass',
        'Height': '8 Inches (20 cm)',
        'Weight': '1.1 kg',
        'Finish': 'Traditional Temple Brass Patina'
      }
    },
    {
      id: 'p-pooja-bell',
      title: 'Handcrafted Brass Pooja Bell with Sacred Nandi Finial',
      category: 'Brass Products',
      subCategory: 'Pooja & Spiritual',
      categoryId: 'brass',
      price: 799,
      oldPrice: 999,
      rating: 5.0,
      reviewsCount: 78,
      image: 'assets/images/brass-memento.jpg',
      badges: ['RESONANT TONE', 'HAND-CAST'],
      material: 'High-Resonance Bell Metal',
      height: '7 Inches',
      weight: '650 grams',
      finish: 'Mirror Polished Brass',
      inStock: true,
      customizable: false,
      occasion: 'Daily Temple & Home Mandir',
      bulkTiers: [
        { qty: '1 - 10 pcs', price: '₹799' },
        { qty: '11 - 50 pcs', price: '₹650' },
        { qty: '51+ pcs', price: '₹550' }
      ],
      description: 'Tuned for sustained harmonic acoustic resonance, this classic prayer bell is crowned with an intricately detailed Nandi bull finial. Cast using traditional sand molds in Alappuzha, Kerala.',
      specs: {
        'Material': 'Acoustic Bell Metal (78% Copper, 22% Tin/Zinc)',
        'Height': '7 Inches',
        'Weight': '650 grams',
        'Tone': 'Long resonant sustain (approx. 8 seconds)'
      }
    },
    {
      id: 'p-panchapatra-set',
      title: 'Traditional Brass Panchapatra with Achamani Pali Spoon',
      category: 'Brass Products',
      subCategory: 'Pooja & Spiritual',
      categoryId: 'brass',
      price: 649,
      oldPrice: 799,
      rating: 4.8,
      reviewsCount: 52,
      image: 'assets/images/brass-memento.jpg',
      badges: ['POOJA VESSEL'],
      material: 'Pure Heavy Gauge Brass',
      height: '4 Inches',
      weight: '380 grams',
      finish: 'Polished Brass',
      inStock: true,
      customizable: false,
      occasion: 'Daily Sandhyavandanam & Pooja',
      bulkTiers: [
        { qty: '1 - 15 pcs', price: '₹649' },
        { qty: '16+ pcs', price: '₹520' }
      ],
      description: 'A classic ritual water vessel and handcrafted spoon for daily abhishekam, arghyam, and pooja offerings.',
      specs: {
        'Material': 'Heavy Gauge Sheet Brass',
        'Vessel Volume': '220 ml',
        'Weight': '380g set'
      }
    },
    {
      id: 'p-walnut-plaque',
      title: 'Imperial Walnut & Brass Recognition Plaque',
      category: 'Brass Products',
      subCategory: 'Awards & Mementos',
      categoryId: 'brass',
      price: 2400,
      oldPrice: 2850,
      rating: 4.8,
      reviewsCount: 86,
      image: 'assets/images/plaque-shield.jpg',
      badges: ['AWARDS', 'HANDCRAFTED'],
      material: 'Burled Walnut & Brass Inlay',
      height: '10 x 8 Inches',
      weight: '1.2 kg',
      finish: 'Satin Brass Plate with Deep Etching',
      inStock: true,
      customizable: true,
      occasion: 'Retirement, Institutional Distinction, Corporate Honors',
      bulkTiers: [
        { qty: '1 - 9 pcs', price: '₹2,400' },
        { qty: '10 - 29 pcs', price: '₹2,050' },
        { qty: '30+ pcs', price: '₹1,750' }
      ],
      description: 'Rich burled walnut hardwood plaque set with a thick 0.8mm brass faceplate etched with ornate corner scrollwork and high-contrast lettering.',
      specs: {
        'Plate Material': '0.8mm Virgin Brass Sheet',
        'Wood Backing': 'Hand-oiled Burled Walnut',
        'Dimensions': '10" High x 8" Wide',
        'Customization': 'Free Laser Engraving Included'
      }
    },
    {
      id: 'p-football-star',
      title: 'Gold Star Football Champion Trophy (14")',
      category: 'Trophies',
      subCategory: 'Sports Trophies',
      categoryId: 'trophies',
      price: 1850,
      oldPrice: 2200,
      rating: 4.9,
      reviewsCount: 128,
      image: 'assets/images/trophy-football.jpg',
      badges: ['FEATURED TROPHY', 'ENGRAVABLE'],
      material: 'Solid Brass & Mahogany',
      height: '14 Inches',
      weight: '1.45 kg',
      finish: 'Brushed Antique Brass',
      inStock: true,
      customizable: true,
      occasion: 'Sports Tournaments & Annual Sports Day',
      bulkTiers: [
        { qty: '1 - 9 pcs', price: '₹1,850' },
        { qty: '10 - 49 pcs', price: '₹1,550' },
        { qty: '50+ pcs', price: '₹1,280' }
      ],
      description: 'A dynamic cast-brass star rising above a golden soccer sphere, mounted on a solid mahogany wood pedestal with a customizable brass engraving plate.',
      specs: {
        'Figure': 'Cast Brass Football & Star Sculpture',
        'Pedestal': 'Hand-turned Polished Teak / Mahogany',
        'Height': '14 Inches',
        'Weight': '1.45 kg'
      }
    },
    {
      id: 'p-school-medals',
      title: 'School & Sports Achievement Medals Trio (Gold, Silver, Bronze)',
      category: 'Medals',
      subCategory: 'School & College',
      categoryId: 'medals',
      price: 450,
      oldPrice: 550,
      rating: 5.0,
      reviewsCount: 214,
      image: 'assets/images/medals-set.jpg',
      badges: ['POPULAR MEDALS', 'BULK DISCOUNTS'],
      material: 'Heavy Die-Struck Brass',
      height: '70mm Diameter',
      weight: '95g each',
      finish: 'Antique Gold, Silver & Bronze',
      inStock: true,
      customizable: true,
      occasion: 'School Annual Sports Day & Academic Honors',
      bulkTiers: [
        { qty: '1 - 24 pcs', price: '₹450' },
        { qty: '25 - 99 pcs', price: '₹340' },
        { qty: '100+ pcs', price: '₹260' }
      ],
      description: 'Hand-finished 70mm diameter die-struck solid brass medals featuring an embossed laurel wreath frame and blank center ready for school crests and category text. Includes woven silk neck ribbons.',
      specs: {
        'Diameter': '70mm (2.75 inches)',
        'Thickness': '3.5mm Heavyweight feel',
        'Neck Ribbon': '32mm Woven Grosgrain Silk Ribbon Included'
      }
    }
  ],

  // Sample Demo Analytics Data (Section 20 & 23)
  demoAnalytics: {
    disclaimer: 'Note: All metrics shown below are mock demonstration data for the MRT Metal Mart UI/UX prototype.',
    todaysSales: '₹48,900',
    monthlyRevenue: '₹18,42,600',
    totalOrders: 342,
    pendingOrders: 16,
    bulkEnquiries: 14,
    lowStockItems: 3,
    customizationRequests: 28,
    categoryShare: [
      { name: 'Brass Products (Primary)', percent: '62%', revenue: '₹11.4L' },
      { name: 'Trophies & Cups', percent: '22%', revenue: '₹4.1L' },
      { name: 'Medals (Bulk)', percent: '16%', revenue: '₹2.9L' }
    ]
  },

  // Natural Language Queries mapping for Smart Semantic Search (Section 13)
  semanticSearchExamples: [
    {
      query: 'brass lamp for pooja',
      interpretedTags: [
        { label: 'Primary Category', value: 'Brass Products' },
        { label: 'Item Type', value: 'Nilavilakku / Diya' },
        { label: 'Purpose', value: 'Pooja & Temple' }
      ],
      matchingProductIds: ['p-nilavilakku-18', 'p-lakshmi-diya']
    },
    {
      query: 'brass gift under ₹1500',
      interpretedTags: [
        { label: 'Category', value: 'Brass Gifts' },
        { label: 'Max Budget', value: '₹1,500' },
        { label: 'Occasion', value: 'Wedding / Housewarming' }
      ],
      matchingProductIds: ['p-lakshmi-diya', 'p-pooja-bell', 'p-panchapatra-set']
    },
    {
      query: 'football trophy under ₹1000',
      interpretedTags: [
        { label: 'Category', value: 'Trophies' },
        { label: 'Sport', value: 'Football / Athletics' },
        { label: 'Max Budget', value: '₹1,000' }
      ],
      matchingProductIds: ['p-football-star']
    },
    {
      query: 'gold medals for school competition',
      interpretedTags: [
        { label: 'Category', value: 'Medals' },
        { label: 'Finish', value: 'Gold / Die-struck' },
        { label: 'Audience', value: 'School & College Meet' }
      ],
      matchingProductIds: ['p-school-medals']
    },
    {
      query: '100 custom medals',
      interpretedTags: [
        { label: 'Type', value: 'Bulk Custom Order' },
        { label: 'Tier', value: '100+ Pieces (₹260/pc)' },
        { label: 'Customization', value: 'Emblem Embossing' }
      ],
      matchingProductIds: ['p-school-medals']
    },
    {
      query: 'brass award with engraving',
      interpretedTags: [
        { label: 'Material', value: 'Solid Brass' },
        { label: 'Category', value: 'Awards & Mementos' },
        { label: 'Service', value: 'Complimentary Laser Etching' }
      ],
      matchingProductIds: ['p-walnut-plaque']
    }
  ]
};
