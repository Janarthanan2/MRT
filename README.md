# MRT Metal Mart :  Brass Heritage & Modern Recognition E-Commerce UI/UX

> **"MRT Metal Mart — Brass Heritage. Modern Shopping. Meaningful Awards."**  
> A complete, modern, premium, responsive e-commerce web platform and UI/UX design system for **MRT Metal Mart**, a metal products business based in Kerala, India.

---

## 🪔 Product Focus & Architecture

The website primarily centers around **Brass Products** as its dominant visual and commercial category, with **Trophies and Medals** as important secondary categories.

### 1. Primary Category: Brass Products (Visually Dominant)
* **Pooja & Spiritual**: Traditional Kerala Temple Nilavilakku (18"), Ashta Lakshmi Kamakshi Deepam lamps, resonant hand-cast pooja bells with Nandi finials, Panchapatra & Pali spoon sets
* **Home Décor**: Handcrafted decorative floral urlis with peacock handles, brass statues, Ganesha idols, and traditional urns.
* **Traditional Brassware**: Heirloom dining thalis, vessels, containers, and bell-metal cookware.
* **Brass Gifts**: Auspicious mementos curated for weddings, housewarmings (Griha Pravesh), and festive gifting.
* **Brass Awards & Mementos**: Burled walnut plaques with deep-etched brass faceplates and traditional fretwork jaali mementos.
* **Custom Brass**: Tailor-made castings, temple trust dedications, and laser-engraved metal inscriptions.

### 2. Secondary Category: Trophies
* Sports championships, tournament cups, school/college honors, and corporate geometric spires.

### 3. Secondary Category: Medals
* Die-struck brass, gold, silver, and bronze medallions with woven grosgrain silk neck ribbons and institutional bulk tier pricing.

---

## 🎨 Design System & Showroom Aesthetics

* **Foundry Warmth**: Neutral Warm Ivory (`#FBF8F1`), Warm Cream (`#F5EFE4`), and Off-White (`#FCFAF6`) paired with Deep Brown (`#332317`) and Charcoal (`#1F1D1A`).
* **Restrained Brass Accents**: Muted Antique Brass (`#B08D57`) and Polished Gold Brass (`#C59B27`) used with discipline for badges, primary CTAs, borders, and active indicators without gaudy gradients.
* **Typography Pairing**: Elegant *Playfair Display* for brand headlines and major titles paired with crisp *Plus Jakarta Sans* for modern e-commerce UI controls.
* **Stitch & Figma Synced**:
  * **Stitch Project**: `projects/2200235937806180796` (*MRT Metal Mart — Premium E-Commerce UI/UX*)
  * **Design System Asset**: `assets/3558222112426950848` (Light mode, Round 8px, `#B08D57` seed color)

---

## 🚀 Key Features & Interactive Screens

1. **Storefront & Hero Section**: Brass-dominant hero (*"Timeless Brass. Crafted for Every Occasion."*) with high-resolution photography, foundry guarantees, and 3-card category showcase where Brass Products is visually highlighted.
2. **Featured Brass Collection & 6 Product Collections**: High-detail product cards with material purity tags, weights in kg/grams, bulk tier pricing, and Add to Cart.
3. **Festive Brass Collection**: Auspicious promotions for Vishu, Onam, Diwali, and Wedding Return Gifts.
4. **Brass Products Catalogue (PLP)**: Faceted sidebar filters for Sub-Category, Occasion (Daily Mandir, Temple, Wedding, Festival), Weight tiers (under 1kg, 1-3kg, 3kg+ heavy cast), and natural-language filter input.
5. **Dedicated Trophies & Medals Catalogues**: Quantity-oriented shopping calculator for 50+, 100+, and 500+ medals.
6. **Product Detail Page (PDP)**: 18-inch Kerala Temple Nilavilakku with technical specifications table, bulk price discounts, and *Frequently Bought Together* pooja bundle.
7. **Brass Customizer ("Make It Yours")**: Real-time visual award plate previewer with live text line updates, font switcher (Classic Serif, Modern Sans, Script), metal finish selector (Antique Brass, Polished Gold, Silver Chrome), and logo upload.
8. **Bulk Order & RFQ Portal**: 1-click loading for real-world bulk presets (100 Brass Wedding Return Gifts, 50 School Trophies, 500 Sports Medals, Temple Offerings) with quotation request form.
9. **Intelligent Semantic Search**: Natural-language query parser (*"brass lamp for pooja"*, *"brass gift under ₹1500"*, *"football trophy under ₹1000"*) with AI interpreted attribute tags.
10. **Wishlist**: Product wishlist management with dedicated empty-state view.
11. **Shopping Cart & 4-Step Checkout**: Slide-out cart drawer, item custom specs, and clean checkout (*Address → Delivery → Payment → Confirmation*).
12. **Customer Account & Dual Order Tracking**:
    * **Retail Timeline**: *Order Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered*
    * **Custom/Bulk Timeline**: *Enquiry → Quote Sent → Accepted → Production Casting → Ready → Shipped → Delivered*
13. **Admin Console & Operations**:
    * Dashboard KPIs (Today's Sales, Total Orders, Pending RFQs, Low Stock).
    * Interactive weekly sales chart and category share breakdown (Brass Products 62% dominant).
    * Product Management screen with brass metallurgical attributes.
    * Bulk Enquiry Management pipeline with interactive status updates (*New → Reviewing → Quote Sent → Accepted → Processing → Completed*).
    * AI Product Categorization Tool for automated taxonomy extraction.
14. **Responsive Testing Bar**: Instant viewport switcher between **Desktop (1440px)**, **Tablet (768px)**, and **Mobile (390px)**.

---

## 💻 Local Quick Start

Clone and run locally using any standard static file server:

```bash
# Clone the repository
git clone https://github.com/Janarthanan2/MRT-.git

# Navigate to project directory
cd MRT-

# Run with Python
python -m http.server 3000

# Or with Node
npx serve .
```

Open `http://localhost:3000` in your web browser.

---

## 📁 Repository Structure

```
├── index.html                   # Master UI/UX Prototype & Viewport Simulation Shell
├── README.md                    # Project documentation
├── css/
│   ├── design-tokens.css        # Color palette, brass tones, typography, spacing tokens
│   ├── base.css                 # Base resets, Playfair Display & Plus Jakarta Sans typography
│   ├── components.css           # Buttons, badges, cards, form inputs, modals, drawers
│   ├── store.css                # Showroom header, hero, collections, festive banner, footer
│   ├── customizer.css           # Live interactive engraving plate preview styles
│   ├── rfq.css                  # Bulk order RFQ form, presets, and 5-step workflow
│   ├── dashboard.css            # Customer account, dual order tracking, admin charts & KPIs
│   ├── design-system.css        # Design system palette swatches & presentation bar
│   └── responsive.css           # Desktop (1440px), Tablet (768px), and Mobile (390px) breakpoints
├── js/
│   ├── data.js                  # Brass catalog, trophies, medals, bulk presets, demo analytics
│   ├── app.js                   # Master SPA view router, cart, wishlist, modals
│   ├── customizer.js            # Live interactive award engraving rendering engine
│   ├── search.js                # Intelligent semantic natural-language search parser
│   ├── rfq.js                   # Bulk RFQ workflow handler & preset loaders
│   └── admin.js                 # Admin dashboard, product management, pipeline & AI categorizer
└── assets/
    └── images/                  # High-resolution studio photography
        ├── brass-memento.jpg    # Traditional Nilavilakku & Brassware
        ├── hero-awards.jpg      # Curated showroom collection
        ├── trophy-football.jpg  # Championship football star trophy
        ├── medals-set.jpg       # Die-struck gold, silver, bronze medal set
        ├── plaque-shield.jpg    # Burled walnut & engraved brass plaque
        └── trophy-corporate.jpg # Architectural geometric brass spire award
```

---

*© 2026 MRT Metal Mart. All rights reserved. Handcrafted Kerala Metalcraft Heritage.*
