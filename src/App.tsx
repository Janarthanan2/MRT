import { useState, useMemo, useCallback, useEffect } from "react"
import Admin from "./Admin"
import { authApi, productApi, cartApi, wishlistApi, customOrderApi, orderApi, userApi, paymentApi } from "./api/api"

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

function normalizeApiProduct(p: any): Product {
  const image = p.image_url || p.image || ""
  return { id: Number(p.id), name: p.name, category: p.category || "", price: Number(p.price || 0), originalPrice: p.original_price == null ? undefined : Number(p.original_price), rating: Number(p.rating || 0), reviews: Number(p.review_count || 0), image, images: image ? [image] : [], material: p.material || "", weight: p.weight || "", dimensions: p.dimensions || "", description: p.description || "", features: [], inStock: Number(p.stock || 0) > 0, featured: Boolean(p.featured), badge: p.badge || undefined, occasion: p.occasion || undefined }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])\n  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [account, setAccount] = useState<any>(null)
  const [serverOrders, setServerOrders] = useState<any[]>([])
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

  useEffect(() => {
    productApi.list().then(rows => {
      if (rows.length) setProducts(rows.map(normalizeApiProduct))
    }).catch(() => {})
    authApi.me().then(async (me) => {
      setIsLoggedIn(true)
      setAccount(me)
      const [serverCart, serverWishlist, serverOrderRows] = await Promise.all([
        cartApi.list().catch(() => []),
        wishlistApi.list().catch(() => []),
        orderApi.list().catch(() => []),
      ])
      setCart(serverCart.map((item: any) => {
        const product = products.find(p => p.id === Number(item.product_id)) || normalizeApiProduct(item)
        return { product, qty: Number(item.quantity || 1) }
      }))
      setWishlist(serverWishlist.map((item: any) => Number(item.product_id)))
      setServerOrders(serverOrderRows)
      userApi.profile().then(setAccount).catch(() => {})
    }).catch(() => {})
  }, [])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const addToCart = useCallback(
    async (p: Product) => {
      setCart((prev) => {
        const ex = prev.find((i) => i.product.id === p.id)
        if (ex) return prev.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        return [...prev, { product: p, qty: 1 }]
      })
      if (localStorage.getItem("mrt_access_token")) {
        try { await cartApi.add(p.id, 1) } catch (e) { showToast(e instanceof Error ? e.message : "Could not sync cart") }
      }
      showToast(`${p.name} added to cart`)
    },
    [showToast],
  )

  const toggleWishlist = useCallback(async (id: number) => {
    const active = wishlist.includes(id)
    setWishlist((prev) => active ? prev.filter((x) => x !== id) : [...prev, id])
    if (localStorage.getItem("mrt_access_token")) {
      try {
        if (active) await wishlistApi.remove(id)
        else await wishlistApi.add(id)
      } catch (e) { showToast(e instanceof Error ? e.message : "Could not sync wishlist") }
    }
  }, [wishlist, showToast])

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
    let list = products.filter((p) => {
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
  }, [products, filterCat, filterMax, filterRating, filterStock, searchQuery, sortBy])

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id))
  const featuredProducts = products.filter((p) => p.featured)

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
        </div>        {cart.length > 0 && (
          <div className="p-4 border-t border-sand space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brown-mid">Subtotal</span>
              <span className="font-display font-semibold text-charcoal">
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>
            {cartTotal < 2000 && (
              <p className="text-[10px] text-brown-light">
                Add ₹{(2000 - cartTotal).toLocaleString()} more for free
                shipping
              </p>
            )}
            <button
              onClick={() => {
                setCartOpen(false)
                navTo("cart")
              }}
              className="w-full bg-brass text-cream py-3 text-sm font-semibold tracking-wide rounded btn-primary"
            >
              View Cart & Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // ── Auth Modal ──────────────────────────────────────────────────────────────

  const AuthModal = showAuth && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/60"
        onClick={() => setShowAuth(false)}
      />
      <div className="relative bg-cream rounded-lg w-full max-w-md p-8 shadow-2xl fade-in">
        <button
          onClick={() => setShowAuth(false)}
          className="absolute top-4 right-4 text-brown-light hover:text-charcoal"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <p className="font-display text-xs text-brass-light tracking-widest uppercase mb-1">
            Welcome to
          </p>
          <h2 className="font-display text-2xl text-charcoal">
            MRT Metal Mart
          </h2>
          <Divider />
        </div>
        <div className="flex border border-sand rounded mb-6">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAuthTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                authTab === tab
                  ? "bg-brass text-cream"
                  : "text-brown-mid hover:bg-ivory"
              }`}
            >
              {tab === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {authTab === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full border border-sand bg-ivory rounded px-3 py-2.5 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm((f) => ({ ...f, email: e.target.value }))
            }
            className="w-full border border-sand bg-ivory rounded px-3 py-2.5 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full border border-sand bg-ivory rounded px-3 py-2.5 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors"
          />
          <button
            onClick={async () => {
              try {
                if (authTab === "login") await authApi.login(authForm.email, authForm.password)
                else await authApi.register(authForm.name, authForm.email, authForm.password)
                setIsLoggedIn(true); setShowAuth(false)
                showToast(authTab === "login" ? "Welcome back!" : "Account created successfully!")
              } catch (error) { showToast(error instanceof Error ? error.message : "Authentication failed") }
            }}
            className="w-full bg-brass text-cream py-3 text-sm font-semibold tracking-wide rounded btn-primary mt-2"
          >
            {authTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
        {authTab === "login" && (
          <p className="text-center text-[11px] text-brown-light mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => setAuthTab("register")}
              className="text-brass hover:underline"
            >
              Register now
            </button>
          </p>
        )}
      </div>
    </div>
  )

  // ── Home Page ───────────────────────────────────────────────────────────────

  const HomePage = (
    <main className="fade-in">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1763475944771-702683b1b42c?w=1600&h=1000&fit=crop&auto=format"
            alt="Collection of brass Hindu deities"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-brass-light/40 opacity-60" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-brass-light/40 opacity-60" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-brass-light/40 opacity-60" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-brass-light/40 opacity-60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brass-pale text-xs tracking-[0.4em] uppercase mb-5">
              Heritage Craftsmanship Since 1978
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-cream leading-tight mb-6">
              Heritage
              <br />
              <em className="text-brass-light">Crafted</em>
              <br />
              in Brass
            </h1>
            <p className="text-sand text-base leading-relaxed mb-8 max-w-md">
              Authentic Indian brassware — sacred idols, traditional lamps, and
              antique collectibles — handcrafted by master artisans using
              centuries-old techniques.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navTo("shop")}
                className="bg-brass text-cream px-8 py-3.5 text-sm font-semibold tracking-wider uppercase rounded btn-primary"
              >
                Explore Collection
              </button>
              <button
                onClick={() => navTo("custom")}
                className="border border-brass-light text-brass-pale px-8 py-3.5 text-sm font-semibold tracking-wider uppercase rounded hover:bg-brass-light/10 transition-colors"
              >
                Custom Orders
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-brass-light/20">
              {[
                "10,000+ Products Sold",
                "Master Artisans",
                "Free Shipping ₹2000+",
              ].map((t) => (
                <div
                  key={t}
                  className="text-xs text-sand/70 tracking-wide flex items-center gap-1.5"
                >
                  <span className="text-brass-light">◆</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero product highlight */}
          <div className="hidden md:flex justify-end">
            <div className="relative">
              <div className="w-72 h-80 border border-brass-light/30 rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1767184122148-544404ead960?w=600&h=700&fit=crop&auto=format"
                  alt="Golden Ganesha idol"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-cream/95 rounded border border-sand p-4 max-w-[180px] shadow-xl">
                <p className="text-[10px] text-brass uppercase tracking-widest mb-1">
                  Bestseller
                </p>
                <p className="font-display text-charcoal text-sm leading-tight">
                  Dancing Ganesha Idol
                </p>
                <p className="text-brass font-semibold text-base mt-1">
                  ₹2,499
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Explore Collections"
          subtitle="Discover our curated range of authentic brass products, each handcrafted to preserve India's rich metalware tradition."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCat(cat.id)
                navTo("shop")
              }}
              className="category-card relative rounded overflow-hidden aspect-[3/4] text-left group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="cat-overlay absolute inset-0 bg-charcoal/55 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <p className="text-cream font-display text-sm leading-snug">
                  {cat.name}
                </p>
                <p className="text-brass-pale text-[10px] mt-1">
                  {cat.count} items
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 indian-pattern-bg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Featured Pieces"
            subtitle="Handpicked by our curators — each piece reflects the finest in Indian brass craftsmanship."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
                onSelect={goToProduct}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navTo("shop")}
              className="border border-brass text-brass px-10 py-3 text-sm font-semibold tracking-wider uppercase rounded hover:bg-brass hover:text-cream transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="py-20 bg-charcoal-light">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1750847009743-e0281d1bca7d?w=500&h=700&fit=crop&auto=format"
                alt="Brass pots in market"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 mt-6">
              <div className="aspect-square rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1766399654235-a6793895422d?w=400&h=400&fit=crop&auto=format"
                  alt="Antique brass pot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1771257350846-ff4af8ef91cd?w=400&h=300&fit=crop&auto=format"
                  alt="Brass shrine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-brass-light text-xs tracking-[0.35em] uppercase mb-4">
              Our Heritage
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight mb-5">
              Four Decades of
              <br />
              <em className="text-gold">Artisanal Mastery</em>
            </h2>
            <Divider />
            <p className="text-sand/80 leading-relaxed text-sm mt-4 mb-5">
              Since 1978, MRT Metal Mart has been the custodian of India's
              brass-making tradition. We partner directly with master artisans
              from Moradabad, Aligarh, and Thanjavur — communities that have
              shaped metal with fire and skill for generations.
            </p>
            <p className="text-sand/70 leading-relaxed text-sm mb-8">
              Each piece is crafted using the traditional <em>dhokra</em> and
              lost-wax casting techniques, ensuring that every idol, lamp, and
              vessel you receive carries not just brass — but centuries of
              living craft.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brass-light/20">
              {[
                ["48+", "Years of Craft"],
                ["200+", "Master Artisans"],
                ["10,000+", "Happy Customers"],
              ].map(([n, l]) => (
                <div key={n}>
                  <p className="font-display text-2xl text-brass-light">{n}</p>
                  <p className="text-[10px] text-sand/60 tracking-wide uppercase mt-0.5">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <SectionHeader title="What Our Customers Say" />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Priya Nair",
              loc: "Kochi, Kerala",
              rating: 5,
              review:
                "The Kuthu Vilakku lamp I ordered is absolutely exquisite. The quality far exceeded my expectations — solid brass, beautifully finished. It now holds pride of place in our puja room.",
            },
            {
              name: "Rajesh Sharma",
              loc: "Jaipur, Rajasthan",
              rating: 5,
              review:
                "Ordered a Ganesha idol as a housewarming gift. The packaging was beautiful, the craftsmanship superb, and delivery was swift. Everyone at the ceremony was amazed. Will definitely order again.",
            },
            {
              name: "Ananya Krishnan",
              loc: "Chennai, Tamil Nadu",
              rating: 5,
              review:
                "I've been searching for an authentic brass urli for years. MRT Metal Mart delivered exactly what I envisioned — traditional design, excellent weight, and a warm patina. Truly heritage quality.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="bg-cream rounded border border-sand/60 p-6"
            >
              <Stars rating={t.rating} size="md" />
              <p className="text-charcoal/80 text-sm leading-relaxed mt-3 mb-5 font-display italic">
                "{t.review}"
              </p>
              <div className="flex items-center gap-3 border-t border-sand pt-4">
                <div className="w-9 h-9 rounded-full bg-brass/20 flex items-center justify-center font-display text-brass font-semibold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-charcoal text-xs font-semibold">
                    {t.name}
                  </p>
                  <p className="text-brown-light text-[10px]">{t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Orders Banner */}
      <section className="bg-brass py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brass-dark via-gold to-brass-dark opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brass-dark via-gold to-brass-dark opacity-80" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-brass-pale text-xs tracking-[0.4em] uppercase mb-3">
            For Business & Events
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
            Custom & Bulk Orders
          </h2>
          <Divider />
          <p className="text-brass-pale/90 text-sm leading-relaxed mt-4 mb-8 max-w-xl mx-auto">
            Need personalized brass products for corporate gifting, weddings,
            temples, or events? Our artisans craft bespoke pieces with custom
            engravings, sizes, and finishes — at wholesale pricing for bulk
            orders.
          </p>
          <button
            onClick={() => navTo("custom")}
            className="bg-cream text-brass px-10 py-3.5 text-sm font-semibold tracking-wider uppercase rounded hover:bg-brass-pale transition-colors"
          >
            Request a Quote
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 max-w-3xl mx-auto px-6 text-center">
        <p className="text-brass text-xs tracking-[0.3em] uppercase mb-2">
          Stay Connected
        </p>
        <h3 className="font-display text-2xl text-charcoal mb-2">
          Heritage in Your Inbox
        </h3>
        <p className="text-brown-mid text-sm mb-6">
          New arrivals, festival collections, artisan stories, and exclusive
          member offers.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 border border-sand bg-cream rounded px-4 py-3 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors"
          />
          <button className="bg-brass text-cream px-6 py-3 text-xs font-semibold tracking-wider uppercase rounded btn-primary flex-shrink-0">
            Subscribe
          </button>
        </div>
        <p className="text-[10px] text-brown-light mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </section>
    </main>
  )

  // ── Shop Page ───────────────────────────────────────────────────────────────

  const ShopPage = (
    <main className="fade-in max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal">
            {filterCat || "All Brass Products"}
          </h1>
          <p className="text-xs text-brown-light mt-1">
            {filteredProducts.length} products found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-brown-mid">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-sand bg-cream rounded px-2 py-1.5 text-xs text-charcoal outline-none focus:border-brass"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-cream rounded border border-sand/60 p-5 sticky top-36 space-y-6">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-brass mb-3 font-semibold">
                Category
              </h3>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    checked={filterCat === ""}
                    onChange={() => setFilterCat("")}
                    className="accent-amber-700"
                  />
                  <span className="text-xs text-brown-mid">All Categories</span>
                </label>
                {CATEGORIES.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cat"
                      checked={filterCat === c.id}
                      onChange={() => setFilterCat(c.id)}
                      className="accent-amber-700"
                    />
                    <span className="text-xs text-brown-mid">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-brass mb-3 font-semibold">
                Max Price
              </h3>
              <input
                type="range"
                min={500}
                max={10000}
                step={250}
                value={filterMax}
                onChange={(e) => setFilterMax(+e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-brown-light mt-1">
                <span>₹500</span>
                <span className="font-semibold text-brass">
                  ₹{filterMax.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-brass mb-3 font-semibold">
                Min Rating
              </h3>
              <div className="space-y-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filterRating === r}
                      onChange={() => setFilterRating(r)}
                      className="accent-amber-700"
                    />
                    <span className="text-xs text-brown-mid">
                      {r === 0 ? "Any" : `${r}+ ★`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterStock}
                  onChange={(e) => setFilterStock(e.target.checked)}
                  className="accent-amber-700"
                />
                <span className="text-xs text-brown-mid">In Stock Only</span>
              </label>
            </div>

            <button
              onClick={() => {
                setFilterCat("")
                setFilterMax(10000)
                setFilterRating(0)
                setFilterStock(false)
                setSearchQuery("")
              }}
              className="w-full text-xs text-brass-dark border border-brass/30 py-2 rounded hover:bg-ivory transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Mobile search */}
          <div className="md:hidden flex items-center border border-sand bg-cream rounded px-3 py-2 gap-2 mb-4">
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
              placeholder="Search products…"
              className="flex-1 bg-transparent text-sm text-charcoal placeholder-brown-light outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-xl text-charcoal mb-2">
                No products found
              </p>
              <p className="text-brown-light text-sm">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                  onSelect={goToProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )

  // ── Product Detail Page ─────────────────────────────────────────────────────

  const ProductDetailPage = selectedProduct && (
    <main className="fade-in max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-brown-light mb-6">
        <button onClick={() => navTo("home")} className="hover:text-brass">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navTo("shop")} className="hover:text-brass">
          Shop
        </button>
        <span>/</span>
        <button
          onClick={() => {
            setFilterCat(selectedProduct.category)
            navTo("shop")
          }}
          className="hover:text-brass"
        >
          {selectedProduct.category}
        </button>
        <span>/</span>
        <span className="text-charcoal">{selectedProduct.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="aspect-square bg-parchment rounded overflow-hidden mb-3">
            <img
              src={selectedProduct.images[selectedImg] || selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-2">
              {selectedProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-20 rounded overflow-hidden border-2 transition-all ${
                    selectedImg === i
                      ? "border-brass"
                      : "border-sand/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {selectedProduct.badge && (
            <div className="mb-3">
              <Badge text={selectedProduct.badge} />
            </div>
          )}
          <p className="text-[10px] text-brass uppercase tracking-widest mb-2">
            {selectedProduct.category}
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-charcoal leading-tight mb-3">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <Stars rating={selectedProduct.rating} size="md" />
            <span className="text-xs text-brown-light">
              {selectedProduct.rating} ({selectedProduct.reviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-display text-3xl font-bold text-brass">
              ₹{selectedProduct.price.toLocaleString()}
            </span>
            {selectedProduct.originalPrice && (
              <>
                <span className="text-brown-light line-through text-lg">
                  ₹{selectedProduct.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm text-green-700 font-semibold">
                  {Math.round(
                    (1 -
                      selectedProduct.price / selectedProduct.originalPrice) *
                      100,
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          <p
            className={`text-xs font-semibold mb-4 ${
              selectedProduct.inStock ? "text-green-700" : "text-red-700"
            }`}
          >
            {selectedProduct.inStock
              ? "✓ In Stock — Ready to Ship"
              : "✕ Currently Out of Stock"}
          </p>

          <Divider />

          <div className="mt-4 mb-5">
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              ["Material", selectedProduct.material],
              ["Weight", selectedProduct.weight],
              ["Dimensions", selectedProduct.dimensions],
            ].map(([l, v]) => (
              <div key={l} className="bg-ivory rounded p-3 text-center">
                <p className="text-[9px] text-brown-light uppercase tracking-wider">
                  {l}
                </p>
                <p className="text-xs text-charcoal font-semibold mt-1">{v}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-brass font-semibold mb-3">
              Craftsmanship Details
            </h3>
            <ul className="space-y-1.5">
              {selectedProduct.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-xs text-charcoal/75"
                >
                  <span className="text-brass-light mt-0.5 flex-shrink-0">
                    ◆
                  </span>{" "}
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & actions */}
          {selectedProduct.inStock && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-brown-mid">Quantity:</span>
                <div className="flex items-center border border-sand rounded">
                  <button
                    onClick={() => setProductQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-sm hover:bg-ivory transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm border-x border-sand">
                    {productQty}
                  </span>
                  <button
                    onClick={() => setProductQty((q) => q + 1)}
                    className="px-3 py-2 text-sm hover:bg-ivory transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    for (let i = 0; i < productQty; i++)
                      addToCart(selectedProduct)
                    setCartOpen(true)
                  }}
                  className="flex-1 bg-brass text-cream py-3.5 text-sm font-semibold tracking-wide rounded btn-primary"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    for (let i = 0; i < productQty; i++)
                      addToCart(selectedProduct)
                    navTo("cart")
                  }}
                  className="flex-1 border border-brass text-brass py-3.5 text-sm font-semibold tracking-wide rounded hover:bg-brass hover:text-cream transition-colors"
                >
                  Buy Now
                </button>
                <WishlistBtn
                  active={wishlist.includes(selectedProduct.id)}
                  onToggle={() => toggleWishlist(selectedProduct.id)}
                />
              </div>
            </>
          )}

          {/* Delivery info */}
          <div className="bg-ivory rounded p-4 space-y-2">
            {[
              ["🚚", "Free delivery on orders above ₹2,000"],
              ["📦", "Packed with premium velvet wrapping"],
              ["↩️", "15-day hassle-free returns"],
              ["✅", "Authenticity certificate included"],
            ].map(([icon, text]) => (
              <div
                key={text as string}
                className="flex items-center gap-2 text-xs text-brown-mid"
              >
                <span>{icon}</span> {text as string}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-14">
        <h2 className="font-display text-xl text-charcoal mb-6">
          Customer Reviews
        </h2>
        <Divider />
        <div className="mt-6 space-y-5">
          {[
            {
              name: "Sunita Patel",
              date: "August 2025",
              rating: 5,
              review:
                "Absolutely stunning quality. The craftsmanship is incredible — every detail is perfect. This will be treasured for generations.",
            },
            {
              name: "Arjun Mehta",
              date: "July 2025",
              rating: 5,
              review:
                "Purchased as a gift for my parents' anniversary. They were overwhelmed by the quality and beauty. Packaging was also exceptional.",
            },
            {
              name: "Deepa Reddy",
              date: "June 2025",
              rating: 4,
              review:
                "Beautiful piece, very well made. Delivery was slightly delayed but customer service was responsive and helpful.",
            },
          ].map((r) => (
            <div key={r.name} className="border-b border-sand/50 pb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brass/20 flex items-center justify-center font-display text-brass text-sm font-semibold">
                    {r.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {r.name}
                  </span>
                  <Stars rating={r.rating} />
                </div>
                <span className="text-[10px] text-brown-light">{r.date}</span>
              </div>
              <p className="text-sm text-charcoal/75 leading-relaxed font-display italic ml-11">
                "{r.review}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )

  // ── Cart Page ───────────────────────────────────────────────────────────────

  const CartPage = (
    <main className="fade-in max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl text-charcoal mb-2">
        Shopping Cart
      </h1>
      <Divider />
      {cart.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-display text-xl text-charcoal mb-2">
            Your cart is empty
          </h2>
          <p className="text-brown-mid text-sm mb-6">
            Explore our brass collections and find something beautiful.
          </p>
          <button
            onClick={() => navTo("shop")}
            className="bg-brass text-cream px-8 py-3 text-sm font-semibold rounded btn-primary"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-cream rounded border border-sand/60 p-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-28 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[10px] text-brass uppercase tracking-widest">
                    {item.product.category}
                  </p>
                  <h3 className="font-display text-charcoal text-sm leading-snug mt-0.5">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-brown-light mt-1">
                    {item.product.material} · {item.product.weight}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-sand rounded">
                      <button
                        onClick={async () => {
                          const nextQty = Math.max(1, item.qty - 1)
                          setCart((prev) => prev.map((i) => i.product.id === item.product.id ? { ...i, qty: nextQty } : i))
                          if (localStorage.getItem("mrt_access_token")) {
                            const serverItem = await cartApi.list().then(rows => rows.find((x: any) => Number(x.product_id) === item.product.id)).catch(() => null)
                            if (serverItem) await cartApi.update(Number(serverItem.id), nextQty).catch(() => {})
                          }
                        }
                        className="px-3 py-1.5 text-sm hover:bg-ivory"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm border-x border-sand">                        {item.qty}
                      </span>
                      <button
                        onClick={async () => {
                          const nextQty = item.qty + 1
                          setCart((prev) => prev.map((i) => i.product.id === item.product.id ? { ...i, qty: nextQty } : i))
                          if (localStorage.getItem("mrt_access_token")) {
                            const serverItem = await cartApi.list().then(rows => rows.find((x: any) => Number(x.product_id) === item.product.id)).catch(() => null)
                            if (serverItem) await cartApi.update(Number(serverItem.id), nextQty).catch(() => {})
                          }
                        }
                        className="px-3 py-1.5 text-sm hover:bg-ivory"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display font-semibold text-brass">
                        ₹{(item.product.price * item.qty).toLocaleString()}
                      </span>
                      <button
                        onClick={async () => {
                          setCart((prev) => prev.filter(i => i.product.id !== item.product.id))
                          if (localStorage.getItem("mrt_access_token")) {
                            const serverItem = await cartApi.list().then(rows => rows.find((x: any) => Number(x.product_id) === item.product.id)).catch(() => null)
                            if (serverItem) await cartApi.remove(Number(serverItem.id)).catch(() => {})
                          }
                        }
                        className="text-red-700 text-xs hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-cream rounded border border-sand/60 p-5 sticky top-36">
              <h3 className="font-display text-lg text-charcoal mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-brown-mid">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brown-mid">
                  <span>Shipping</span>
                  <span>
                    {cartTotal >= 2000 ? (
                      <span className="text-green-700">Free</span>
                    ) : (
                      "₹120"
                    )}
                  </span>
                </div>
                <div className="h-px bg-sand my-2" />
                <div className="flex justify-between font-semibold text-charcoal">
                  <span>Total</span>
                  <span className="font-display text-brass text-lg">
                    ₹
                    {(
                      cartTotal + (cartTotal >= 2000 ? 0 : 120)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
              {cartTotal < 2000 && (
                <p className="text-[10px] text-brown-light mb-3">
                  Add ₹{(2000 - cartTotal).toLocaleString()} more for free
                  shipping
                </p>
              )}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 border border-sand bg-ivory rounded px-3 py-2 text-xs outline-none focus:border-brass"
                />
                <button className="text-xs bg-parchment border border-sand px-3 py-2 rounded hover:bg-brass hover:text-cream transition-colors">
                  Apply
                </button>
              </div>
              <button
                onClick={async () => {
                  if (!isLoggedIn) { setShowAuth(true); return }
                  try {
                    const shipping = cartTotal >= 2000 ? 0 : 120
                    const created = await orderApi.create({ total: cartTotal + shipping, shippingAddress: account?.address || "", items: cart.map((item) => ({ productId: item.product.id, productName: item.product.name, quantity: item.qty, unitPrice: item.product.price })) })
                    const payment = await paymentApi.create({ orderId: created?.id, amount: cartTotal + shipping }).catch(() => null)
                    if (payment) await paymentApi.verify({ orderId: created?.id, paymentId: payment.paymentId }).catch(() => null)
                    setServerOrders((prev) => [created, ...prev])
                    await cartApi.clear().catch(() => {})
                    setCart([])
                    showToast("Order placed successfully")
                    navTo("orders")
                  } catch (e) { showToast(e instanceof Error ? e.message : "Could not place order") }
                }}
                className="w-full bg-brass text-cream py-3.5 text-sm font-semibold tracking-wide rounded btn-primary"
              >
                Proceed to Checkout
              </button>
              <p className="text-[10px] text-brown-light text-center mt-3">
                Secure payment · GST included
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )

  // ── Wishlist Page ───────────────────────────────────────────────────────────

  const WishlistPage = (
    <main className="fade-in max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl text-charcoal mb-2">
        My Wishlist ({wishlistProducts.length})
      </h1>
      <Divider />
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">♡</div>
          <h2 className="font-display text-xl text-charcoal mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-brown-mid text-sm mb-6">
            Save items you love and find them here anytime.
          </p>
          <button
            onClick={() => navTo("shop")}
            className="bg-brass text-cream px-8 py-3 text-sm font-semibold rounded btn-primary"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {wishlistProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onSelect={goToProduct}
            />
          ))}
        </div>
      )}
    </main>
  )

  // ── Custom Orders Page ──────────────────────────────────────────────────────

  const CustomOrdersPage = (
    <main className="fade-in">
      {/* Hero */}
      <section className="relative bg-charcoal py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1765443455193-fb043c1dca8d?w=1400&h=600&fit=crop&auto=format"
            alt="Antique collectibles"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <p className="text-brass-light text-xs tracking-[0.4em] uppercase mb-4">
            Bespoke Brassware
          </p>
          <h1 className="font-display text-4xl text-cream mb-4">
            Custom & Bulk Orders
          </h1>
          <Divider />
          <p className="text-sand/80 text-sm leading-relaxed mt-4">
            Commission personalized brass pieces with custom engravings, sizes,
            and finishes. Ideal for corporate gifting, temple donations,
            weddings, and bulk procurement.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="font-display text-2xl text-charcoal mb-6">
            Request a Quote
          </h2>
          {customSent ? (
            <div className="bg-green-50 border border-green-200 rounded p-8 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-display text-lg text-green-800 mb-2">
                Request Submitted!
              </h3>
              <p className="text-green-700 text-sm">
                Our team will contact you within 24 hours with a customized
                quote and design proposal.
              </p>
              <button
                onClick={() => setCustomSent(false)}
                className="mt-4 text-xs text-brass hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  label: "Your Name",
                  key: "name",
                  type: "text",
                  placeholder: "Full name",
                },
                {
                  label: "Email Address",
                  key: "email",
                  type: "email",
                  placeholder: "your@email.com",
                },
                {
                  label: "Phone Number",
                  key: "phone",
                  type: "tel",
                  placeholder: "+91 98765 43210",
                },
                {
                  label: "Product / Item Required",
                  key: "product",
                  type: "text",
                  placeholder: "e.g., Engraved Ganesha Idols, Custom Diyas…",
                },
                {
                  label: "Quantity Required",
                  key: "qty",
                  type: "number",
                  placeholder: "e.g., 50 pieces",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] text-brass uppercase tracking-widest mb-1.5 font-semibold">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={customForm[(key as keyof typeof customForm)]}
                    onChange={(e) =>
                      setCustomForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full border border-sand bg-cream rounded px-3 py-2.5 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] text-brass uppercase tracking-widest mb-1.5 font-semibold">
                  Additional Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe customizations — engravings, size, finish, occasion, delivery timeline…"
                  value={customForm.details}
                  onChange={(e) =>
                    setCustomForm((f) => ({ ...f, details: e.target.value }))
                  }
                  className="w-full border border-sand bg-cream rounded px-3 py-2.5 text-sm text-charcoal placeholder-brown-light outline-none focus:border-brass transition-colors resize-none"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await customOrderApi.create(customForm)
                    setCustomSent(true)
                    showToast("Custom order request submitted")
                  } catch (e) {
                    showToast(e instanceof Error ? e.message : "Could not submit request")
                  }
                }}
                className="w-full bg-brass text-cream py-3.5 text-sm font-semibold tracking-wide rounded btn-primary"
              >
                Submit Request
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="font-display text-2xl text-charcoal mb-6">
            Why Choose MRT for Custom Orders?
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "Corporate Gifting",
                desc: "Premium branded brass gifts — ideal for Diwali, client appreciation, and employee recognition. Custom packaging with your logo.",
              },
              {
                title: "Wedding & Events",
                desc: "Traditional brass return gifts, decorative pieces, and ceremonial items crafted for your special occasions.",
              },
              {
                title: "Temple & Religious Orders",
                desc: "Sacred idols, lamps, and ritual items crafted to exact specifications for temples and religious institutions.",
              },
              {
                title: "Bulk Discounts",
                desc: "Attractive pricing for orders of 25+ pieces. Volume discounts up to 40% based on quantity and order value.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-8 h-8 flex-shrink-0 rounded bg-brass/15 flex items-center justify-center mt-0.5">
                  <span className="text-brass text-sm">◆</span>
                </div>
                <div>
                  <h3 className="font-display text-base text-charcoal">
                    {title}
                  </h3>
                  <p className="text-xs text-brown-mid leading-relaxed mt-1">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-ivory rounded border border-sand p-5">
            <h3 className="font-display text-base text-charcoal mb-3">
              Contact Our Team
            </h3>
            <div className="space-y-2 text-xs text-brown-mid">
              <p>📧 orders@mrtmetalmart.in</p>
              <p>📞 +91 98765 43210 (Mon–Sat, 9am–7pm)</p>
              <p>💬 WhatsApp orders accepted</p>
              <p>⏱ Quote delivery within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // ── Profile Page ────────────────────────────────────────────────────────────

  const ProfilePage = (
    <main className="fade-in max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl text-charcoal mb-2">My Account</h1>
      <Divider />
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="bg-cream rounded border border-sand/60 p-5 text-center">
          <div className="w-16 h-16 rounded-full bg-brass/20 mx-auto flex items-center justify-center font-display text-brass text-2xl font-semibold mb-3">
            {account?.name ? String(account.name)[0].toUpperCase() : isLoggedIn ? "A" : "?"}
          </div>
          <h3 className="font-display text-charcoal">{account?.name || "My Account"}</h3>
          <p className="text-xs text-brown-light mt-1">{account?.email || "Sign in to view your account"}</p>
          <p className="text-xs text-brown-light">{account?.phone || "MRT Metal Mart customer"}</p>
          <button
            onClick={() => {
              authApi.logout().catch(() => {})
              setIsLoggedIn(false)
              navTo("home")
            }}
            className="mt-4 text-xs text-red-700 hover:underline"
          >
            Sign Out
          </button>
        </div>
        <div className="md:col-span-2 space-y-4">
          {[
            {
              icon: "📦",
              label: "My Orders",
              desc: "3 orders · 1 pending delivery",
              action: () => navTo("orders"),
            },
            {
              icon: "♡",
              label: "Wishlist",
              desc: `${wishlist.length} items saved`,
              action: () => navTo("wishlist"),
            },
            {
              icon: "📍",
              label: "Saved Addresses",
              desc: "2 addresses saved",
              action: () => {},
            },
            {
              icon: "🔔",
              label: "Notifications",
              desc: "Manage email & SMS preferences",
              action: () => {},
            },
          ].map(({ icon, label, desc, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-4 bg-cream rounded border border-sand/60 p-4 hover:border-brass transition-colors text-left"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-charcoal">{label}</p>
                <p className="text-xs text-brown-light">{desc}</p>
              </div>
              <svg
                className="w-4 h-4 text-brown-light ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </main>
  )

  // ── Orders Page ─────────────────────────────────────────────────────────────

  const OrdersPage = (
    <main className="fade-in max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl text-charcoal mb-2">My Orders</h1>
      <Divider />
      <div className="mt-6 space-y-4">
        {(serverOrders.length ? serverOrders : []).map((order: any) => (
          <div key={order.id || order.orderNumber} className="bg-cream rounded border border-sand/60 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-mono text-brown-mid">{order.order_number || order.orderNumber || "MRT-" + order.id}</p>
                <p className="text-[10px] text-brown-light mt-0.5">Ordered: {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recently"}</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-700">{order.status || "Processing"}</span>
            </div>
            {(order.items || []).map((item: any) => (
              <p key={item.productId || item.product_id || item.productName} className="text-xs text-charcoal/80 mb-0.5">· {item.productName || item.product_name}</p>
            ))}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand/50">
              <span className="font-display text-brass font-semibold">₹{Number(order.total || 0).toLocaleString()}</span>
              <button onClick={async () => { const tracking = await orderApi.tracking(Number(order.id)).catch(() => null); if (tracking) showToast("Tracking information loaded") }} className="text-xs text-brass hover:underline">View Details</button>
            </div>
          </div>
        ))}
        {!serverOrders.length && <div className="text-center py-20 text-sm text-brown-light">No orders yet. Your completed orders will appear here.</div>}
      </div>
    </main>
  )

  // ── Footer ──────────────────────────────────────────────────────────────────

  const Footer = (
    <footer className="bg-charcoal mt-20">
      <div className="brass-strip" />
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl text-cream mb-1">
            MRT <span className="text-brass-light">Metal Mart</span>
          </div>
          <div className="text-[10px] tracking-[0.25em] text-sand/50 uppercase mb-4">
            Crafted in Pure Brass
          </div>
          <p className="text-xs text-sand/60 leading-relaxed">
            Authentic Indian brassware and antique collectibles, sourced
            directly from master artisans. Preserving tradition since 1978.
          </p>
          <div className="flex gap-3 mt-5">
            {["F", "I", "W", "Y"].map((s) => (
              <div
                key={s}
                className="w-8 h-8 rounded-full border border-sand/20 flex items-center justify-center text-sand/50 text-xs hover:border-brass hover:text-brass transition-colors cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {[
          {
            title: "Collections",
            links: [
              "Brass Idols & Statues",
              "Lamps & Diyas",
              "Puja Items",
              "Home Décor",
              "Antiques & Collectibles",
              "Gift Sets",
            ],
          },
          {
            title: "Customer Care",
            links: [
              "Track Your Order",
              "Returns & Exchanges",
              "Shipping Policy",
              "Custom Orders",
              "Wholesale Enquiry",
              "Contact Us",
            ],
          },
          {
            title: "Company",
            links: [
              "About MRT",
              "Our Artisans",
              "Sustainability",
              "Press & Media",
              "Careers",
              "Terms & Privacy",
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-[10px] uppercase tracking-widest text-brass-light font-semibold mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-xs text-sand/55 hover:text-brass-light transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sand/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-sand/40">
            © 2025 MRT Metal Mart. All rights reserved. GST: 27AAFCM1234A1Z5 ·{" "}
            <button
              onClick={() => setShowAdmin(true)}
              className="hover:text-sand/70 underline underline-offset-2"
            >
              Admin Portal
            </button>
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "UPI", "Paytm", "NetBanking"].map((p) => (
              <span
                key={p}
                className="text-[9px] text-sand/35 border border-sand/15 rounded px-1.5 py-0.5"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )

  // ── Render ──────────────────────────────────────────────────────────────────

  const renderPage = () => {
    switch (page) {
      case "home":
        return HomePage
      case "shop":
        return ShopPage
      case "product":
        return ProductDetailPage
      case "cart":
        return CartPage
      case "wishlist":
        return WishlistPage
      case "custom":
        return CustomOrdersPage
      case "profile":
        return ProfilePage
      case "orders":
        return OrdersPage
      default:
        return HomePage
    }
  }

  if (showAdmin) return <Admin onBack={() => setShowAdmin(false)} />

  return (
    <div className="min-h-screen flex flex-col">
      {Header}
      <div className="flex-1">{renderPage()}</div>
      {Footer}
      {CartDrawer}
      {AuthModal}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast">
          <div className="bg-charcoal text-cream text-xs px-5 py-3 rounded shadow-xl flex items-center gap-2">
            <span className="text-brass-light">✓</span> {toast}
          </div>
        </div>
      )}
    </div>
  )
}