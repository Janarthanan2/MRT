import { useState, useMemo, useCallback } from "react"
import Admin from "./Admin"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  material: string
  weight: string
  dimensions: string
  description: string
  features: string[]
  inStock: boolean
  featured?: boolean
  badge?: string
  occasion?: string
}

interface CartItem {
  product: Product
  qty: number
}
type Page = "home" | "shop" | "product" | "cart" | "wishlist" | "custom" | "profile" | "orders"

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "Brass Pooja Items",
    name: "Brass Pooja Items",
    count: 48,
    img: "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Brass Lamps & Diyas",
    name: "Brass Lamps & Diyas",
    count: 32,
    img: "https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Brass Statues & Idols",
    name: "Brass Statues & Idols",
    count: 64,
    img: "https://images.unsplash.com/photo-1763475944771-702683b1b42c?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Brass Home Décor",
    name: "Brass Home Décor",
    count: 55,
    img: "https://images.unsplash.com/photo-1727698560440-8d3497039140?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Brass Vessels & Traditional Items",
    name: "Brass Vessels & Traditional Items",
    count: 29,
    img: "https://images.unsplash.com/photo-1750847009743-e0281d1bca7d?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Brass Gifts",
    name: "Brass Gifts",
    count: 41,
    img: "https://images.unsplash.com/photo-1766399654235-a6793895422d?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Indian Antiques",
    name: "Indian Antiques",
    count: 23,
    img: "https://images.unsplash.com/photo-1765443455193-fb043c1dca8d?w=600&h=440&fit=crop&auto=format",
  },
  {
    id: "Antique-Style Collectibles",
    name: "Antique-Style Collectibles",
    count: 37,
    img: "https://images.unsplash.com/photo-1767338718657-9006d701ce6a?w=600&h=440&fit=crop&auto=format",
  },
]

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Dancing Ganesha Brass Idol",
    category: "Brass Statues & Idols",
    price: 2499,
    originalPrice: 3299,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1767184122148-544404ead960?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1767184122148-544404ead960?w=800&h=920&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1771692820416-4b4634b82e9d?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "1.2 kg",
    dimensions: "15 × 10 × 8 cm",
    description:
      "Intricately handcrafted by master artisans from Moradabad, this Dancing Ganesha idol captures the divine grace and auspiciousness of Lord Ganesha. Cast in pure brass using the traditional lost-wax technique, every detail — from the delicate lotus crown to the flowing dhoti — is meticulously hand-finished. An ideal idol for homes, puja rooms, and gifting.",
    features: [
      "Hand-cast lost-wax technique",
      "Hand-polished mirror finish",
      "Auspicious Nritya pose",
      "Includes protective velvet pouch & certificate of authenticity",
    ],
    inStock: true,
    featured: true,
    badge: "Bestseller",
    occasion: "Puja & Festivals",
  },
  {
    id: 2,
    name: "Traditional Brass Puja Thali Set",
    category: "Brass Pooja Items",
    price: 1899,
    originalPrice: 2499,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.8 kg",
    dimensions: "30 cm diameter",
    description:
      "A complete puja thali set with all essentials for daily worship. Includes a large thali, diya holder, incense stick holder, and small bowls for kumkum and turmeric. Engraved with auspicious patterns around the rim.",
    features: [
      "Complete 7-piece set",
      "Engraved floral border",
      "Lacquered long-lasting finish",
      "Gift-ready presentation box",
    ],
    inStock: true,
    featured: true,
    occasion: "Daily Puja",
  },
  {
    id: 3,
    name: "Antique Brass Hanging Diya",
    category: "Brass Lamps & Diyas",
    price: 1299,
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.6 kg",
    dimensions: "40 cm height (with chain)",
    description:
      "An exquisite hanging diya with five oil cups, suspended from an ornate brass chain. The antique oxidized finish gives it a timeless heritage look, perfect for temples, puja rooms, or as a stunning home décor accent.",
    features: [
      "5-cup oil lamp",
      "Oxidized antique finish",
      "80 cm hanging chain included",
      "Traditional Rajasthani design",
    ],
    inStock: true,
    featured: true,
    badge: "New Arrival",
    occasion: "Diwali & Puja",
  },
  {
    id: 4,
    name: "Brass Urli Bowl — Floral Rim",
    category: "Brass Home Décor",
    price: 3299,
    originalPrice: 4199,
    rating: 4.6,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1702497508675-c67b1a38c9c6?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1702497508675-c67b1a38c9c6?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "2.1 kg",
    dimensions: "35 cm dia × 12 cm height",
    description:
      "The traditional Kerala urli, reimagined with an ornate floral rim. Float marigolds, rose petals, or candles in this stunning centerpiece bowl that brings festive warmth to any living space or entrance.",
    features: [
      "Wide-rim floral design",
      "Leakproof construction",
      "Perfect for float decoration",
      "Hand-hammered texture",
    ],
    inStock: true,
    occasion: "Home Décor",
  },
  {
    id: 5,
    name: "Engraved Brass Kalash",
    category: "Brass Vessels & Traditional Items",
    price: 1499,
    rating: 4.5,
    reviews: 58,
    image:
      "https://images.unsplash.com/photo-1766399654235-a6793895422d?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1766399654235-a6793895422d?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.5 kg",
    dimensions: "20 cm height × 12 cm width",
    description:
      "The sacred kalash, intricately engraved with auspicious symbols of prosperity. Used in all important religious ceremonies, this kalash blends spiritual significance with artisanal craft.",
    features: [
      "Hand-engraved patterns",
      "Auspicious Om symbol",
      "Used in puja ceremonies",
      "Traditional South Indian design",
    ],
    inStock: true,
    occasion: "Religious Ceremonies",
  },
  {
    id: 6,
    name: "Brass Krishna Flute Player Idol",
    category: "Brass Statues & Idols",
    price: 2899,
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1771692820416-4b4634b82e9d?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1771692820416-4b4634b82e9d?w=800&h=920&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1763475944771-702683b1b42c?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "1.5 kg",
    dimensions: "20 × 8 × 6 cm",
    description:
      "Lord Krishna in his iconic murali pose, crafted with extraordinary detail. The idol captures Krishna's serene expression and graceful form, making it a centerpiece of devotion and timeless beauty.",
    features: [
      "Detailed hand carving",
      "Peacock feather crown detail",
      "Smooth polished finish",
      "Ideal for home temples",
    ],
    inStock: true,
    badge: "Top Rated",
    occasion: "Janmashtami & Gifting",
  },
  {
    id: 7,
    name: "Brass Temple Bell — Medium",
    category: "Brass Pooja Items",
    price: 799,
    originalPrice: 999,
    rating: 4.4,
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.4 kg",
    dimensions: "12 cm height",
    description:
      "A traditional brass temple bell with a clear, resonant tone. Crafted for daily puja to invoke auspicious vibrations, this bell is both a spiritual tool and a beautiful decorative piece.",
    features: [
      "Resonant clear tone",
      "Teak wood handle",
      "Rope attachment included",
      "Traditional temple shape",
    ],
    inStock: true,
    occasion: "Daily Puja",
  },
  {
    id: 8,
    name: "Brass Plate — Madhubani Motif",
    category: "Brass Gifts",
    price: 1899,
    rating: 4.7,
    reviews: 44,
    image:
      "https://images.unsplash.com/photo-1765443254037-11cf280461a4?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1765443254037-11cf280461a4?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.7 kg",
    dimensions: "30 cm diameter",
    description:
      "A decorative wall plate inspired by Madhubani folk art. Intricately etched with peacocks, lotuses, and geometric borders in traditional Bihari patterns — doubles as wall art and a gifting masterpiece.",
    features: [
      "Madhubani folk art motif",
      "Wall-hanging bracket included",
      "Antique oxidized finish",
      "Gift-boxed",
    ],
    inStock: true,
    occasion: "Corporate & Festival Gifts",
  },
  {
    id: 9,
    name: "Kuthu Vilakku — Antique Brass Lamp",
    category: "Brass Lamps & Diyas",
    price: 4499,
    rating: 5.0,
    reviews: 32,
    image:
      "https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "3.2 kg",
    dimensions: "60 cm height",
    description:
      "The traditional South Indian Kuthu Vilakku lamp — a symbol of divine light and auspiciousness. Features a central column with five spreading arms, each holding an oil cup. A statement piece for temples and premium homes.",
    features: [
      "Traditional Kuthu Vilakku form",
      "5-wick design",
      "Antique aged finish",
      "Stable wide base",
    ],
    inStock: false,
    badge: "Limited Stock",
    occasion: "Weddings & Temples",
  },
  {
    id: 10,
    name: "Peacock Brass Incense Holder",
    category: "Brass Pooja Items",
    price: 599,
    rating: 4.3,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1650383044645-5d32141ad1a3?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.2 kg",
    dimensions: "22 cm length",
    description:
      "An elegant brass incense holder with a peacock motif. The extended ash-catching tray keeps your altar clean while the intricate peacock design adds a beautiful spiritual accent to your puja space.",
    features: [
      "Peacock design detail",
      "Extended ash tray",
      "Easy to clean",
      "Suitable for all agarbatti",
    ],
    inStock: true,
    occasion: "Daily Puja",
  },
  {
    id: 11,
    name: "Brass Lakshmi Idol — Seated Pose",
    category: "Brass Statues & Idols",
    price: 3199,
    rating: 4.8,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1763475944771-702683b1b42c?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1763475944771-702683b1b42c?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "1.8 kg",
    dimensions: "22 × 14 × 10 cm",
    description:
      "Goddess Lakshmi in her classic seated pose, showering gold coins with one hand while blessing with another. Cast in pure brass with fine detailing of lotus throne, ornaments, and garments.",
    features: [
      "Traditional seated Lakshmi pose",
      "Lotus throne base",
      "Fine jewelry detailing",
      "Ideal Diwali gift",
    ],
    inStock: true,
    featured: true,
    occasion: "Diwali & Housewarming",
  },
  {
    id: 12,
    name: "Mughal Brass Jewelry Box",
    category: "Antique-Style Collectibles",
    price: 1799,
    originalPrice: 2299,
    rating: 4.6,
    reviews: 55,
    image:
      "https://images.unsplash.com/photo-1765443455193-fb043c1dca8d?w=560&h=640&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1765443455193-fb043c1dca8d?w=800&h=920&fit=crop&auto=format",
    ],
    material: "Pure Brass",
    weight: "0.9 kg",
    dimensions: "15 × 10 × 8 cm",
    description:
      "A beautifully engraved brass jewelry box with a hinged lid and velvet-lined interior. The exterior features intricate Mughal-inspired floral and geometric patterns, making it both functional and a stunning collectible.",
    features: [
      "Velvet-lined interior",
      "Hinged brass clasp",
      "Mughal floral engraving",
      "Collector's piece",
    ],
    inStock: true,
    occasion: "Gifting",
  },
]

// ─── Helper Components ────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "md" ? "text-base" : "text-xs"
  return (
    <span className={`inline-flex gap-0.5 ${s}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= Math.round(rating) ? "text-amber-500" : "text-amber-200"
          }
        >
          ★
        </span>
      ))}
    </span>
  )
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      {label && (
        <span className="text-xs tracking-[0.2em] text-brass uppercase font-display italic">
          {label}
        </span>
      )}
      {!label && <span className="text-brass-light text-sm">◆</span>}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="text-center mb-12">
      <p className="text-xs tracking-[0.3em] text-brass-light uppercase mb-3 font-medium">
        MRT Metal Mart
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
        {title}
      </h2>
      <Divider />
      {subtitle && (
        <p className="text-brown-mid mt-4 max-w-xl mx-auto leading-relaxed text-sm">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function Badge({ text }: { text: string }) {
  const colors: Record<string, string> = {
    Bestseller: "bg-amber-700 text-cream",
    "New Arrival": "bg-brass-dark text-brass-pale",
    "Top Rated": "bg-brown text-cream",
    "Limited Stock": "bg-red-800/80 text-red-100",
  }
  return (
    <span
      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-semibold ${colors[text] || "bg-brass text-cream"}`}
    >
      {text}
    </span>
  )
}

function WishlistBtn({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
        active
          ? "bg-red-600 border-red-600 text-white"
          : "bg-cream/80 border-sand text-brown-mid hover:border-brass hover:text-brass"
      }`}
      aria-label="Toggle wishlist"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelect,
}: {
  product: Product
  wishlist: number[]
  onToggleWishlist: (id: number) => void
  onAddToCart: (p: Product) => void
  onSelect: (p: Product) => void
}) {
  const disc = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  return (
    <div
      className="product-card bg-cream rounded border border-sand/60 overflow-hidden cursor-pointer group"
      onClick={() => onSelect(product)}
    >
      <div className="relative overflow-hidden bg-parchment aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge text={product.badge} />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
            <span className="text-cream text-sm font-display italic">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <WishlistBtn
            active={wishlist.includes(product.id)}
            onToggle={() => onToggleWishlist(product.id)}
          />
        </div>
        {product.inStock && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              className="w-full bg-brass text-cream text-xs font-semibold tracking-wider uppercase py-2.5 rounded btn-primary"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-brass-light uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-charcoal text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-brown-light">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-semibold text-brass text-base">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-brown-light line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {disc > 0 && (
              <span className="text-[10px] text-green-700 font-semibold">
                {disc}% off
              </span>
            )}
          </div>
          {!product.inStock && (
            <span className="text-[10px] text-red-700 font-medium">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCat, setFilterCat] = useState("")
  const [filterMax, setFilterMax] = useState(10000)
  const [filterRating, setFilterRating] = useState(0)
  const [filterStock, setFilterStock] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [toast, setToast] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedImg, setSelectedImg] = useState(0)
  const [productQty, setProductQty] = useState(1)
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [customForm, setCustomForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    qty: "",
    details: "",
  })
  const [customSent, setCustomSent] = useState(false)

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const addToCart = useCallback(
    (p: Product) => {
      setCart((prev) => {
        const ex = prev.find((i) => i.product.id === p.id)
        if (ex)
          return prev.map((i) =>
            i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i,
          )
        return [...prev, { product: p, qty: 1 }]
      })
      showToast(`${p.name} added to cart`)
    },
    [showToast],
  )

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const goToProduct = useCallback((p: Product) => {
    setSelectedProduct(p)
    setSelectedImg(0)
    setProductQty(1)
    setPage("product")
    window.scrollTo(0, 0)
  }, [])

  const navTo = useCallback((p: Page) => {
    setPage(p)
    setCartOpen(false)
    window.scrollTo(0, 0)
  }, [])

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filterCat && p.category !== filterCat) return false
      if (p.price > filterMax) return false
      if (filterRating && p.rating < filterRating) return false
      if (filterStock && !p.inStock) return false
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price)
    else if (sortBy === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating)
    else if (sortBy === "featured")
      list = [...list].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
      )
    return list
  }, [filterCat, filterMax, filterRating, filterStock, searchQuery, sortBy])

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))
  const featuredProducts = PRODUCTS.filter((p) => p.featured)

  // ── Header ─────────────────────────────────────────────────────────────────

  const Header = (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand/80">
      {/* Announcement bar */}
      <div className="bg-brass text-cream text-center text-[11px] tracking-wider py-2 px-4">
        Free shipping on orders above ₹2,000 &nbsp;|&nbsp; Use code{" "}
        <strong>FIRSTBUY</strong> for 15% off your first order
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => navTo("home")}
          className="flex-shrink-0 text-left"
        >
          <div className="font-display text-xl font-semibold text-charcoal leading-none tracking-tight">
            MRT <span className="text-brass">Metal Mart</span>
          </div>
          <div className="text-[9px] tracking-[0.25em] text-brown-light uppercase">
            Crafted in Pure Brass
          </div>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto hidden md:flex items-center border border-sand bg-ivory rounded px-3 py-2 gap-2">
          <svg
            className="w-4 h-4 text-brown-light"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search brass idols, diyas, vessels…"
            className="flex-1 bg-transparent text-sm text-charcoal placeholder-brown-light outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navTo("shop")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-brown-light hover:text-charcoal text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Wishlist */}
          <button
            onClick={() => navTo("wishlist")}
            className="relative p-2 text-brown-mid hover:text-brass transition-colors"
            aria-label="Wishlist"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>
          {/* Cart */}
          <button
            onClick={() => setCartOpen((o) => !o)}
            className="relative p-2 text-brown-mid hover:text-brass transition-colors"
            aria-label="Cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brass text-cream text-[9px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          {/* Account */}
          <button
            onClick={() => (isLoggedIn ? navTo("profile") : setShowAuth(true))}
            className="ml-1 hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-brass text-brass text-xs font-semibold rounded hover:bg-brass hover:text-cream transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            {isLoggedIn ? "Account" : "Login"}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-t border-sand/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
          <button
            onClick={() => {
              setFilterCat("")
              navTo("shop")
            }}
            className="whitespace-nowrap text-[11px] tracking-wide px-3 py-1.5 text-brown-mid hover:text-brass hover:bg-ivory rounded transition-colors"
          >
            All Products
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setFilterCat(c.id)
                navTo("shop")
              }}
              className="whitespace-nowrap text-[11px] tracking-wide px-3 py-1.5 text-brown-mid hover:text-brass hover:bg-ivory rounded transition-colors"
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={() => navTo("custom")}
            className="whitespace-nowrap text-[11px] tracking-wide px-3 py-1.5 text-brass font-semibold hover:bg-brass hover:text-cream rounded transition-colors ml-auto"
          >
            Custom & Bulk Orders
          </button>
        </div>
      </nav>
    </header>
  )

  // ── Cart Drawer ─────────────────────────────────────────────────────────────

  const CartDrawer = cartOpen && (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-charcoal/40"
        onClick={() => setCartOpen(false)}
      />
      <div className="relative w-full max-w-sm bg-cream h-full flex flex-col shadow-2xl fade-in">
        <div className="p-5 border-b border-sand flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">
            Your Cart ({cartCount})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-brown-light hover:text-charcoal"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-brown-mid font-display italic">
                Your cart is empty
              </p>
              <p className="text-xs text-brown-light mt-1">
                Explore our brass collections
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-ivory rounded p-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display text-charcoal leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-brass font-semibold mt-1">
                    ₹{item.product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((i) =>
                            i.product.id === item.product.id
                              ? { ...i, qty: Math.max(1, i.qty - 1) }
                              : i,
                          ),
                        )
                      }
                      className="w-6 h-6 bg-parchment rounded text-xs flex items-center justify-center hover:bg-brass hover:text-cream transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xs w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((i) =>
                            i.product.id === item.product.id
                              ? { ...i, qty: i.qty + 1 }
                              : i,
                          ),
                        )
                      }
                      className="w-6 h-6 bg-parchment rounded text-xs flex items-center justify-center hover:bg-brass hover:text-cream transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((i) => i.product.id !== item.product.id),
                        )
                      }
                      className="ml-auto text-red-700 text-xs hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>