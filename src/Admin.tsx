import { useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

// ΓöÇΓöÇΓöÇ Types ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

type AdminPage =
  | 'dashboard' | 'products' | 'categories' | 'inventory'
  | 'orders' | 'customers' | 'custom-orders' | 'quotations'
  | 'reviews' | 'offers' | 'notifications' | 'analytics'
  | 'admin-users' | 'settings' | 'activity-log'

interface Product {
  id: number; name: string; category: string; price: number; stock: number
  status: 'Active' | 'Inactive' | 'Draft'; material: string; weight: string
  dimensions: string; sku: string; antique: boolean; customizable: boolean
}

interface Order {
  id: string; customer: string; date: string; items: number; total: number
  payment: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'
  city: string
}

interface Customer {
  id: number; name: string; email: string; phone: string
  orders: number; totalSpent: number; joined: string; status: 'Active' | 'Inactive'
}

interface CustomRequest {
  id: string; name: string; email: string; phone: string; product: string
  qty: number; details: string; date: string; status: 'New' | 'In Review' | 'Quoted' | 'Confirmed' | 'Declined'
  budget?: number
}

// ΓöÇΓöÇΓöÇ Mock Data ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const PRODUCTS: Product[] = [
  { id: 1, name: 'Dancing Ganesha Brass Idol', category: 'Brass Statues & Idols', price: 2499, stock: 23, status: 'Active', material: 'Pure Brass', weight: '1.2 kg', dimensions: '15├ù10├ù8 cm', sku: 'MRT-BSI-001', antique: false, customizable: true },
  { id: 2, name: 'Traditional Brass Puja Thali Set', category: 'Brass Pooja Items', price: 1899, stock: 41, status: 'Active', material: 'Pure Brass', weight: '0.8 kg', dimensions: '30 cm dia', sku: 'MRT-BPI-001', antique: false, customizable: false },
  { id: 3, name: 'Antique Brass Hanging Diya', category: 'Brass Lamps & Diyas', price: 1299, stock: 7, status: 'Active', material: 'Pure Brass', weight: '0.6 kg', dimensions: '40 cm height', sku: 'MRT-BLD-001', antique: true, customizable: false },
  { id: 4, name: 'Brass Urli Bowl ΓÇö Floral Rim', category: 'Brass Home D├⌐cor', price: 3299, stock: 3, status: 'Active', material: 'Pure Brass', weight: '2.1 kg', dimensions: '35 cm dia', sku: 'MRT-BHD-001', antique: false, customizable: true },
  { id: 5, name: 'Engraved Brass Kalash', category: 'Brass Vessels', price: 1499, stock: 56, status: 'Active', material: 'Pure Brass', weight: '0.5 kg', dimensions: '20├ù12 cm', sku: 'MRT-BVT-001', antique: false, customizable: true },
  { id: 6, name: 'Brass Krishna Flute Player Idol', category: 'Brass Statues & Idols', price: 2899, stock: 0, status: 'Active', material: 'Pure Brass', weight: '1.5 kg', dimensions: '20├ù8├ù6 cm', sku: 'MRT-BSI-002', antique: false, customizable: false },
  { id: 7, name: 'Brass Temple Bell ΓÇö Medium', category: 'Brass Pooja Items', price: 799, stock: 88, status: 'Active', material: 'Pure Brass', weight: '0.4 kg', dimensions: '12 cm height', sku: 'MRT-BPI-002', antique: false, customizable: false },
  { id: 8, name: 'Mughal Brass Jewelry Box', category: 'Antique-Style Collectibles', price: 1799, stock: 14, status: 'Active', material: 'Pure Brass', weight: '0.9 kg', dimensions: '15├ù10├ù8 cm', sku: 'MRT-ASC-001', antique: true, customizable: true },
  { id: 9, name: 'Kuthu Vilakku Brass Lamp', category: 'Brass Lamps & Diyas', price: 4499, stock: 2, status: 'Active', material: 'Pure Brass', weight: '3.2 kg', dimensions: '60 cm height', sku: 'MRT-BLD-002', antique: false, customizable: false },
  { id: 10, name: 'Peacock Brass Incense Holder', category: 'Brass Pooja Items', price: 599, stock: 0, status: 'Inactive', material: 'Pure Brass', weight: '0.2 kg', dimensions: '22 cm length', sku: 'MRT-BPI-003', antique: false, customizable: false },
]

const ORDERS: Order[] = [
  { id: 'MRT-2025-1901', customer: 'Priya Nair', date: 'Sep 24, 2025', items: 2, total: 5398, payment: 'Paid', status: 'Processing', city: 'Kochi' },
  { id: 'MRT-2025-1900', customer: 'Rajesh Sharma', date: 'Sep 24, 2025', items: 1, total: 2499, payment: 'Paid', status: 'Shipped', city: 'Jaipur' },
  { id: 'MRT-2025-1899', customer: 'Ananya Krishnan', date: 'Sep 23, 2025', items: 3, total: 6897, payment: 'Paid', status: 'Delivered', city: 'Chennai' },
  { id: 'MRT-2025-1898', customer: 'Vikram Patel', date: 'Sep 23, 2025', items: 1, total: 1899, payment: 'Pending', status: 'Processing', city: 'Ahmedabad' },
  { id: 'MRT-2025-1897', customer: 'Sunita Reddy', date: 'Sep 22, 2025', items: 2, total: 3798, payment: 'Paid', status: 'Shipped', city: 'Hyderabad' },
  { id: 'MRT-2025-1896', customer: 'Amit Verma', date: 'Sep 22, 2025', items: 1, total: 4499, payment: 'Failed', status: 'Cancelled', city: 'Delhi' },
  { id: 'MRT-2025-1895', customer: 'Deepa Iyer', date: 'Sep 21, 2025', items: 4, total: 8196, payment: 'Paid', status: 'Delivered', city: 'Mumbai' },
  { id: 'MRT-2025-1894', customer: 'Suresh Menon', date: 'Sep 20, 2025', items: 1, total: 3199, payment: 'Refunded', status: 'Returned', city: 'Bangalore' },
]

const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Priya Nair', email: 'priya.nair@gmail.com', phone: '+91 98400 12345', orders: 7, totalSpent: 18340, joined: 'Jan 2024', status: 'Active' },
  { id: 2, name: 'Rajesh Sharma', email: 'rajesh.s@yahoo.com', phone: '+91 99100 23456', orders: 3, totalSpent: 7697, joined: 'Mar 2024', status: 'Active' },
  { id: 3, name: 'Ananya Krishnan', email: 'ananya.k@outlook.com', phone: '+91 97800 34567', orders: 12, totalSpent: 34580, joined: 'Sep 2023', status: 'Active' },
  { id: 4, name: 'Vikram Patel', email: 'vikram.p@gmail.com', phone: '+91 96500 45678', orders: 2, totalSpent: 4398, joined: 'Jul 2025', status: 'Active' },
  { id: 5, name: 'Sunita Reddy', email: 'sunita.r@gmail.com', phone: '+91 95200 56789', orders: 5, totalSpent: 11290, joined: 'Feb 2024', status: 'Active' },
  { id: 6, name: 'Amit Verma', email: 'amit.v@hotmail.com', phone: '+91 94900 67890', orders: 1, totalSpent: 0, joined: 'Sep 2025', status: 'Inactive' },
]

const CUSTOM_REQUESTS: CustomRequest[] = [
  { id: 'CR-2025-087', name: 'Lakshmi Ventures Pvt Ltd', email: 'procurement@lakshmiv.com', phone: '+91 80234 56789', product: 'Engraved Brass Idols with Company Logo', qty: 200, details: 'Need 200 Ganesha idols (10cm) with company name engraved on base. To be given as Diwali corporate gifts. Packaging should be premium gift boxes.', date: 'Sep 20, 2025', status: 'In Review', budget: 500000 },
  { id: 'CR-2025-086', name: 'Sri Venkateshwara Temple', email: 'admin@svtemple.org', phone: '+91 44567 89012', product: 'Brass Lamps & Kalash for New Temple', qty: 50, details: 'Require 50 Kuthu Vilakku lamps and 20 large brass kalash for consecration ceremonies. Need exact temple specifications followed.', date: 'Sep 18, 2025', status: 'Quoted', budget: 300000 },
  { id: 'CR-2025-085', name: 'Meera & Kiran Wedding', email: 'meera.k@gmail.com', phone: '+91 97654 32109', product: 'Brass Return Gifts for 500 Guests', qty: 500, details: 'Wedding return gifts ΓÇö small brass diyas or decorative items. Budget is flexible for quality items. Delivery needed by November 10th.', date: 'Sep 15, 2025', status: 'Confirmed', budget: 200000 },
  { id: 'CR-2025-084', name: 'Heritage Homes Interior', email: 'orders@heritagehomes.in', phone: '+91 11234 56789', product: 'Custom Brass Urli Bowls ΓÇö 5 variants', qty: 30, details: 'Interior design firm needs 5 different sizes of urli bowls for a luxury hotel project. Custom patina finishes required.', date: 'Sep 12, 2025', status: 'New' },
  { id: 'CR-2025-083', name: 'Rajput Arts & Crafts', email: 'bulk@rajputarts.com', phone: '+91 22345 67890', product: 'Wholesale Brass Statues Catalog', qty: 150, details: 'Looking for wholesale pricing on 8-10 statue types for resale. Need catalogue and pricing for items above 500 units/month.', date: 'Sep 10, 2025', status: 'Declined' },
]

const REVENUE_DATA = [
  { month: 'Apr', revenue: 284000, orders: 142 },
  { month: 'May', revenue: 312000, orders: 156 },
  { month: 'Jun', revenue: 298000, orders: 149 },
  { month: 'Jul', revenue: 356000, orders: 178 },
  { month: 'Aug', revenue: 389000, orders: 195 },
  { month: 'Sep', revenue: 421000, orders: 211 },
]

const CATEGORY_DATA = [
  { name: 'Statues & Idols', value: 34, color: '#8B6318' },
  { name: 'Lamps & Diyas', value: 22, color: '#C4991E' },
  { name: 'Pooja Items', value: 18, color: '#D4A843' },
  { name: 'Home D├⌐cor', value: 12, color: '#A67C52' },
  { name: 'Antiques', value: 8, color: '#7A5530' },
  { name: 'Others', value: 6, color: '#E8D48B' },
]

const BESTSELLERS = [
  { name: 'Dancing Ganesha Idol', sold: 312, revenue: 779688 },
  { name: 'Krishna Flute Idol', sold: 267, revenue: 773733 },
  { name: 'Brass Puja Thali Set', sold: 244, revenue: 463156 },
  { name: 'Antique Hanging Diya', sold: 198, revenue: 257202 },
  { name: 'Brass Kalash', sold: 189, revenue: 283311 },
]

const DAILY_ORDERS = [
  { day: 'Mon', orders: 28 }, { day: 'Tue', orders: 35 }, { day: 'Wed', orders: 31 },
  { day: 'Thu', orders: 42 }, { day: 'Fri', orders: 38 }, { day: 'Sat', orders: 55 }, { day: 'Sun', orders: 47 },
]

const ACTIVITY_LOG = [
  { id: 1, user: 'Suresh Admin', action: 'Updated stock for "Brass Urli Bowl"', time: '2 min ago', type: 'edit' },
  { id: 2, user: 'Priya Admin', action: 'Marked order MRT-2025-1899 as Delivered', time: '15 min ago', type: 'order' },
  { id: 3, user: 'Suresh Admin', action: 'Added new product "Brass Elephant Figurine"', time: '1 hr ago', type: 'add' },
  { id: 4, user: 'Priya Admin', action: 'Approved quotation for CR-2025-086', time: '2 hr ago', type: 'approve' },
  { id: 5, user: 'Suresh Admin', action: 'Deactivated product "Old Diya Set V1"', time: '3 hr ago', type: 'delete' },
  { id: 6, user: 'Rahul Admin', action: 'Logged in from IP 103.45.67.89', time: '4 hr ago', type: 'login' },
  { id: 7, user: 'Priya Admin', action: 'Applied 20% Diwali discount to 8 products', time: '5 hr ago', type: 'edit' },
]

// ΓöÇΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const BRASS = '#8B6318'
const GOLD = '#C4991E'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-600',
    'Draft': 'bg-amber-100 text-amber-700',
    'Paid': 'bg-green-100 text-green-800',
    'Pending': 'bg-amber-100 text-amber-700',
    'Failed': 'bg-red-100 text-red-700',
    'Refunded': 'bg-blue-100 text-blue-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-700',
    'Returned': 'bg-orange-100 text-orange-700',
    'New': 'bg-blue-100 text-blue-700',
    'In Review': 'bg-amber-100 text-amber-700',
    'Quoted': 'bg-purple-100 text-purple-700',
    'Confirmed': 'bg-green-100 text-green-800',
    'Declined': 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function StatCard({ icon, label, value, sub, trend, color = 'brass' }: {
  icon: string; label: string; value: string; sub?: string; trend?: string; color?: string
}) {
  const accent: Record<string, string> = {
    brass: 'border-l-brass',
    green: 'border-l-green-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
  }
  return (
    <div className={`bg-white rounded-lg border border-stone-200 border-l-4 ${accent[color] || 'border-l-brass'} p-5 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        {trend && <span className={`text-[10px] font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-xs font-medium text-stone-600 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        <div className="h-0.5 w-12 mt-1 rounded" style={{ background: `linear-gradient(90deg, ${BRASS}, ${GOLD})` }} />
      </div>
      {action && (
        <button onClick={onAction} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-md transition-all hover:opacity-90" style={{ background: BRASS }}>
          <span>+</span> {action}
        </button>
      )}
    </div>
  )
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-stone-200">
        {cols.map(c => (
          <th key={c} className="text-left text-[10px] font-semibold uppercase tracking-widest text-stone-500 py-3 px-3 first:pl-5 last:pr-5">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">ΓÜá∩╕Å</span>
        </div>
        <h3 className="font-bold text-stone-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-stone-600 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg bg-red-600 hover:bg-red-700">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ΓöÇΓöÇΓöÇ Nav Items ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Γùê' },
  { id: 'products', label: 'Products', icon: 'Γè₧' },
  { id: 'categories', label: 'Categories', icon: 'Γèƒ' },
  { id: 'inventory', label: 'Inventory', icon: 'Γù½' },
  { id: 'orders', label: 'Orders', icon: 'Γù╖' },
  { id: 'customers', label: 'Customers', icon: 'ΓùÄ' },
  { id: 'custom-orders', label: 'Custom & Bulk', icon: 'Γùê' },
  { id: 'quotations', label: 'Quotations', icon: 'Γùê' },
  { id: 'reviews', label: 'Reviews', icon: 'Γÿà' },
  { id: 'offers', label: 'Offers & Discounts', icon: '%' },
  { id: 'notifications', label: 'Notifications', icon: 'Γùë' },
  { id: 'analytics', label: 'Analytics', icon: 'Γùî' },
  { id: 'admin-users', label: 'Admin Users', icon: 'Γùì' },
  { id: 'settings', label: 'Settings', icon: 'ΓèÖ' },
  { id: 'activity-log', label: 'Activity Log', icon: 'Γùê' },
]

// ΓöÇΓöÇΓöÇ Admin Component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export default function Admin({ onBack }: { onBack: () => void }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false })
  const [loginError, setLoginError] = useState('')
  const [forgotPw, setForgotPw] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const [page, setPage] = useState<AdminPage>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Products state
  const [products, setProducts] = useState(PRODUCTS)
  const [productSearch, setProductSearch] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', category: 'Brass Statues & Idols', price: '', stock: '', material: 'Pure Brass',
    dimensions: '', weight: '', sku: '', status: 'Active' as 'Active' | 'Inactive' | 'Draft',
    antique: false, customizable: false, description: '',
  })

  // Orders state
  const [orders, setOrders] = useState(ORDERS)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Customers state
  const [custSearch, setCustSearch] = useState('')

  // Custom orders
  const [requests, setRequests] = useState(CUSTOM_REQUESTS)
  const [selectedReq, setSelectedReq] = useState<CustomRequest | null>(null)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ amount: '', validity: '30', notes: '', deliveryDays: '45' })

  // Reviews mock
  const REVIEWS = [
    { id: 1, customer: 'Priya N.', product: 'Dancing Ganesha Idol', rating: 5, comment: 'Absolutely stunning, exceeded all expectations. Masterful craftsmanship!', date: 'Sep 22, 2025', status: 'Published' },
    { id: 2, customer: 'Rajesh S.', product: 'Brass Puja Thali Set', rating: 4, comment: 'Very good quality. Minor delay in delivery but packaging was excellent.', date: 'Sep 20, 2025', status: 'Published' },
    { id: 3, customer: 'Ananya K.', product: 'Brass Urli Bowl', rating: 5, comment: 'Perfect for my living room d├⌐cor. Exactly as described.', date: 'Sep 18, 2025', status: 'Published' },
    { id: 4, customer: 'Anonymous', product: 'Peacock Incense Holder', rating: 2, comment: 'Quality was below expectation. Not worth the price.', date: 'Sep 15, 2025', status: 'Flagged' },
    { id: 5, customer: 'Sunita P.', product: 'Kuthu Vilakku Lamp', rating: 5, comment: 'Museum quality. I was speechless when I opened the package.', date: 'Sep 12, 2025', status: 'Published' },
  ]

  // Offers mock
  const OFFERS = [
    { id: 1, code: 'DIWALI25', discount: '25%', type: 'Percentage', minOrder: 2000, used: 142, validity: 'Oct 31, 2025', status: 'Active' },
    { id: 2, code: 'FIRSTBUY', discount: '15%', type: 'Percentage', minOrder: 0, used: 389, validity: 'Dec 31, 2025', status: 'Active' },
    { id: 3, code: 'FREESHIP', discount: 'Free Shipping', type: 'Shipping', minOrder: 1500, used: 201, validity: 'Dec 31, 2025', status: 'Active' },
    { id: 4, code: 'SUMMER500', discount: 'Γé╣500 off', type: 'Fixed', minOrder: 3000, used: 67, validity: 'Sep 30, 2025', status: 'Expired' },
  ]

  // Notifications
  const NOTIFS = [
    { id: 1, type: '≡ƒö┤', msg: 'Stock critically low: Brass Urli Bowl (3 units remaining)', time: '5 min ago', read: false },
    { id: 2, type: '≡ƒƒí', msg: 'New custom order request from Lakshmi Ventures (Γé╣5,00,000 potential)', time: '20 min ago', read: false },
    { id: 3, type: '≡ƒƒó', msg: 'Order MRT-2025-1899 delivered successfully', time: '1 hr ago', read: false },
    { id: 4, type: '≡ƒö╡', msg: 'New review posted for Dancing Ganesha Idol ΓÇö 5Γÿà', time: '2 hr ago', read: true },
    { id: 5, type: '≡ƒö┤', msg: 'Payment failed: Order MRT-2025-1896 ΓÇö Γé╣4,499', time: '3 hr ago', read: true },
    { id: 6, type: '≡ƒƒí', msg: 'Kuthu Vilakku Lamp ΓÇö Only 2 units left!', time: '4 hr ago', read: true },
  ]

  // Admin users mock
  const ADMIN_USERS = [
    { id: 1, name: 'Suresh Kumar', email: 'suresh@mrtmetalmart.in', role: 'Super Admin', lastLogin: '2 min ago', status: 'Active' },
    { id: 2, name: 'Priya Anand', email: 'priya@mrtmetalmart.in', role: 'Manager', lastLogin: '1 hr ago', status: 'Active' },
    { id: 3, name: 'Rahul Mehta', email: 'rahul@mrtmetalmart.in', role: 'Order Manager', lastLogin: 'Yesterday', status: 'Active' },
    { id: 4, name: 'Deepa Nair', email: 'deepa@mrtmetalmart.in', role: 'Content Editor', lastLogin: '3 days ago', status: 'Active' },
    { id: 5, name: 'Arjun Singh', email: 'arjun@mrtmetalmart.in', role: 'Viewer', lastLogin: 'Never', status: 'Inactive' },
  ]

  const handleLogin = () => {
    if (loginForm.email === 'admin@mrtmetalmart.in' && loginForm.password === 'admin123') {
      setLoggedIn(true); setLoginError('')
    } else {
      setLoginError('Invalid credentials. Contact your system administrator.')
    }
  }

  const filteredProducts = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())),
    [products, productSearch]
  )

  const filteredOrders = useMemo(() =>
    orders.filter(o => {
      const matchSearch = o.id.includes(orderSearch) || o.customer.toLowerCase().includes(orderSearch.toLowerCase())
      const matchFilter = !orderFilter || o.status === orderFilter
      return matchSearch && matchFilter
    }),
    [orders, orderSearch, orderFilter]
  )

  const openEditProduct = (p: Product) => {
    setEditProduct(p)
    setProductForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), material: p.material, dimensions: p.dimensions, weight: p.weight, sku: p.sku, status: p.status, antique: p.antique, customizable: p.customizable, description: '' })
    setShowProductForm(true)
  }

  const saveProduct = () => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...productForm, price: +productForm.price, stock: +productForm.stock } : p))
    } else {
      const np: Product = { id: Date.now(), name: productForm.name, category: productForm.category, price: +productForm.price, stock: +productForm.stock, status: productForm.status, material: productForm.material, weight: productForm.weight, dimensions: productForm.dimensions, sku: productForm.sku, antique: productForm.antique, customizable: productForm.customizable }
      setProducts(prev => [np, ...prev])
    }
    setShowProductForm(false); setEditProduct(null)
  }

  const unreadCount = NOTIFS.filter(n => !n.read).length

  // ΓöÇΓöÇ Login Screen ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1C1308 0%, #2E1A06 50%, #1C1308 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4991E 0px 1px, transparent 1px 30px), repeating-linear-gradient(-45deg, #C4991E 0px 1px, transparent 1px 30px)' }} />

        <div className="relative w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header strip */}
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${BRASS}, ${GOLD}, ${BRASS})` }} />

            <div className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{ background: `linear-gradient(135deg, ${BRASS}, ${GOLD})` }}>
                  <span className="text-white text-2xl font-serif font-bold">M</span>
                </div>
                <h1 className="text-xl font-bold text-stone-800">MRT Metal Mart</h1>
                <p className="text-xs text-stone-500 tracking-widest uppercase mt-0.5">Admin Portal</p>
                <div className="flex items-center gap-2 mt-3 mx-auto w-fit bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <span className="text-amber-700 text-[10px]">≡ƒöÆ</span>
                  <span className="text-[10px] text-amber-700 font-medium">Authorized Access Only</span>
                </div>
              </div>

              {forgotPw ? (
                <div>
                  <h2 className="font-semibold text-stone-700 mb-4 text-sm">Reset Password</h2>
                  {forgotSent ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-green-700 text-sm font-medium">Reset link sent!</p>
                      <p className="text-green-600 text-xs mt-1">Check your admin email inbox.</p>
                    </div>
                  ) : (
                    <>
                      <input type="email" placeholder="Admin email address" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm mb-4 outline-none focus:border-amber-600" />
                      <button onClick={() => setForgotSent(true)} className="w-full py-3 text-sm font-semibold text-white rounded-lg mb-3" style={{ background: BRASS }}>
                        Send Reset Link
                      </button>
                    </>
                  )}
                  <button onClick={() => { setForgotPw(false); setForgotSent(false) }} className="w-full text-xs text-stone-500 hover:text-stone-700 mt-2">ΓåÉ Back to Login</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Admin Email</label>
                    <input
                      type="email"
                      placeholder="admin@mrtmetalmart.in"
                      value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Password</label>
                    <input
                      type="password"
                      placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-xs text-red-700">
                      ≡ƒöÆ {loginError}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                      <input type="checkbox" checked={loginForm.remember} onChange={e => setLoginForm(f => ({ ...f, remember: e.target.checked }))} className="accent-amber-700" />
                      Remember me
                    </label>
                    <button onClick={() => setForgotPw(true)} className="hover:underline" style={{ color: BRASS }}>Forgot password?</button>
                  </div>

                  <button onClick={handleLogin} className="w-full py-3.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90" style={{ background: `linear-gradient(135deg, ${BRASS}, ${GOLD})` }}>
                    Secure Login ΓåÆ
                  </button>

                  <p className="text-[10px] text-stone-400 text-center mt-2">
                    Hint: admin@mrtmetalmart.in / admin123
                  </p>
                </div>
              )}
            </div>

            <div className="bg-stone-50 border-t border-stone-100 px-8 py-4 flex items-center justify-between">
              <p className="text-[10px] text-stone-400">≡ƒ¢í∩╕Å SSL Secured ┬╖ 2FA Available</p>
              <button onClick={onBack} className="text-[10px] text-stone-400 hover:text-stone-600">ΓåÉ Back to Store</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ΓöÇΓöÇ Dashboard Layout ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const navItem = (id: AdminPage, label: string, icon: string, badge?: number) => (
    <button
      key={id}
      onClick={() => setPage(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
        page === id
          ? 'text-white font-semibold shadow-sm'
          : 'text-stone-400 hover:text-white hover:bg-white/5'
      }`}
      style={page === id ? { background: `linear-gradient(90deg, ${BRASS}cc, ${GOLD}88)` } : {}}
    >
      <span className={`text-base flex-shrink-0 w-5 text-center ${page === id ? 'text-amber-200' : 'text-stone-500'}`}>{icon}</span>
      {sidebarOpen && (
        <>
          <span className="flex-1 text-left text-[13px]">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{badge}</span>
          )}
        </>
      )}
    </button>
  )

  // ΓöÇΓöÇ Page: Dashboard ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const DashboardPage = (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-xs text-stone-500 mt-0.5">Welcome back, Suresh. Here's your business at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="Γé╣" label="Total Revenue" value="Γé╣21.4L" sub="This fiscal year" trend="+12.4%" color="brass" />
        <StatCard icon="≡ƒôª" label="Total Orders" value="1,247" sub="Last 30 days: 211" trend="+8.2%" color="green" />
        <StatCard icon="≡ƒæÑ" label="Customers" value="892" sub="68 new this month" trend="+9.1%" color="blue" />
        <StatCard icon="≡ƒÅ║" label="Products Listed" value="128" sub="10 categories" color="purple" />
        <StatCard icon="ΓÜá∩╕Å" label="Low Stock Items" value="6" sub="Need reorder" color="amber" />
        <StatCard icon="ΓÅ│" label="Pending Orders" value="23" sub="Awaiting processing" color="amber" />
        <StatCard icon="Γ£ë∩╕Å" label="Custom Requests" value="5" sub="Needs attention" trend="+2 new" color="red" />
        <StatCard icon="Γå⌐∩╕Å" label="Return Requests" value="3" sub="Awaiting review" color="red" />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-stone-700 text-sm">Revenue & Orders ΓÇö Last 6 Months</h3>
            <span className="text-[10px] text-stone-400">AprΓÇôSep 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRASS} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={BRASS} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9e8a70' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9e8a70' }} tickFormatter={v => `Γé╣${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`Γé╣${Number(v).toLocaleString()}`]} />
              <Area type="monotone" dataKey="revenue" stroke={BRASS} strokeWidth={2} fill="url(#rev)" />
              <Line type="monotone" dataKey="orders" stroke={GOLD} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-700 text-sm mb-5">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_DATA.slice(0, 4).map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-stone-600">{c.name}</span>
                </div>
                <span className="font-semibold text-stone-700">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-700 text-sm">Recent Orders</h3>
            <button onClick={() => setPage('orders')} className="text-[11px] font-medium hover:underline" style={{ color: BRASS }}>View all ΓåÆ</button>
          </div>
          <div className="space-y-2">
            {ORDERS.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <div>
                  <p className="text-xs font-medium text-stone-700">{o.id}</p>
                  <p className="text-[10px] text-stone-400">{o.customer} ┬╖ {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-stone-700">Γé╣{o.total.toLocaleString()}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock & activity */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
            <h3 className="font-semibold text-stone-700 text-sm mb-4">ΓÜá∩╕Å Low Stock Alert</h3>
            <div className="space-y-2">
              {products.filter(p => p.stock <= 5).slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-xs text-stone-700 truncate max-w-[200px]">{p.name}</span>
                  <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{p.stock === 0 ? 'Out' : `${p.stock} left`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
            <h3 className="font-semibold text-stone-700 text-sm mb-4">Recent Activity</h3>
            <div className="space-y-2.5">
              {ACTIVITY_LOG.slice(0, 4).map(a => (
                <div key={a.id} className="text-xs text-stone-600">
                  <span className="font-medium text-stone-700">{a.user}</span> ΓÇö {a.action}
                  <p className="text-[10px] text-stone-400">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ΓöÇΓöÇ Page: Products ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const ProductsPage = (
    <div>
      <SectionHeader title="Product Management" action="Add Product" onAction={() => { setEditProduct(null); setProductForm({ name:'',category:'Brass Statues & Idols',price:'',stock:'',material:'Pure Brass',dimensions:'',weight:'',sku:'',status:'Active',antique:false,customizable:false,description:'' }); setShowProductForm(true) }} />

      <div className="flex items-center gap-3 mb-4">
        <input type="text" placeholder="Search products or SKUΓÇª" value={productSearch} onChange={e => setProductSearch(e.target.value)} className="border border-stone-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-600 flex-1 max-w-xs" />
        <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option>All Categories</option>
          {['Brass Statues & Idols','Brass Lamps & Diyas','Brass Pooja Items','Brass Home D├⌐cor','Antique-Style Collectibles'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option>All Status</option>
          <option>Active</option><option>Inactive</option><option>Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <TableHeader cols={['SKU', 'Product Name', 'Category', 'Price', 'Stock', 'Status', 'Tags', 'Actions']} />
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className="border-b border-stone-100 hover:bg-amber-50/30 transition-colors">
                <td className="py-3 px-3 pl-5 text-[10px] text-stone-400 font-mono">{p.sku}</td>
                <td className="py-3 px-3 text-sm font-medium text-stone-700 max-w-[180px]">{p.name}</td>
                <td className="py-3 px-3 text-xs text-stone-500">{p.category}</td>
                <td className="py-3 px-3 text-sm font-semibold text-stone-700">Γé╣{p.price.toLocaleString()}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 px-3 text-[10px] space-x-1">
                  {p.antique && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Antique</span>}
                  {p.customizable && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Custom</span>}
                </td>
                <td className="py-3 px-3 pr-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditProduct(p)} className="text-xs font-medium hover:underline" style={{ color: BRASS }}>Edit</button>
                    <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x))} className="text-xs text-stone-500 hover:text-stone-700">
                      {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)} className="text-xs text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product form modal */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setShowProductForm(false)} />
          <div className="relative bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-5 flex items-center justify-between z-10">
              <h3 className="font-bold text-stone-800">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowProductForm(false)} className="text-stone-400 hover:text-stone-700">Γ£ò</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Dancing Ganesha Idol' },
                { label: 'SKU', key: 'sku', type: 'text', placeholder: 'e.g. MRT-BSI-001' },
                { label: 'Price (Γé╣) *', key: 'price', type: 'number', placeholder: '2499' },
                { label: 'Stock Quantity *', key: 'stock', type: 'number', placeholder: '50' },
                { label: 'Material', key: 'material', type: 'text', placeholder: 'Pure Brass' },
                { label: 'Dimensions', key: 'dimensions', type: 'text', placeholder: '15 ├ù 10 ├ù 8 cm' },
                { label: 'Weight', key: 'weight', type: 'text', placeholder: '1.2 kg' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={productForm[f.key as keyof typeof productForm] as string} onChange={e => setProductForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Category</label>
                <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600">
                  {['Brass Statues & Idols','Brass Lamps & Diyas','Brass Pooja Items','Brass Home D├⌐cor','Brass Vessels & Traditional Items','Brass Gifts','Indian Antiques','Antique-Style Collectibles'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Status</label>
                <select value={productForm.status} onChange={e => setProductForm(f => ({ ...f, status: e.target.value as 'Active' | 'Inactive' | 'Draft' }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600">
                  <option>Active</option><option>Inactive</option><option>Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Description / Craftsmanship Details</label>
                <textarea rows={3} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 resize-none" placeholder="Describe the craftsmanshipΓÇª" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                  <input type="checkbox" checked={productForm.antique} onChange={e => setProductForm(f => ({ ...f, antique: e.target.checked }))} className="accent-amber-700" />
                  Antique Classification
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                  <input type="checkbox" checked={productForm.customizable} onChange={e => setProductForm(f => ({ ...f, customizable: e.target.checked }))} className="accent-amber-700" />
                  Customizable
                </label>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Product Images</label>
                <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center">
                  <p className="text-stone-400 text-xs">Drag & drop images or click to upload</p>
                  <p className="text-[10px] text-stone-300 mt-1">PNG, JPG up to 5MB ┬╖ Min. 800├ù800px</p>
                  <button className="mt-3 text-xs font-medium px-4 py-2 rounded-lg" style={{ color: BRASS, border: `1px solid ${BRASS}` }}>Browse Files</button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-stone-200 p-5 flex gap-3">
              <button onClick={() => setShowProductForm(false)} className="flex-1 py-2.5 text-sm font-semibold border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50">Cancel</button>
              <button onClick={saveProduct} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg" style={{ background: BRASS }}>
                {editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          title="Delete Product"
          message="This will permanently remove the product and all associated data. This action cannot be undone."
          onConfirm={() => { setProducts(prev => prev.filter(p => p.id !== confirmDelete)); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )

  // ΓöÇΓöÇ Page: Orders ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const OrdersPage = (
    <div>
      <SectionHeader title="Order Management" />
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Search by Order ID or CustomerΓÇª" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="border border-stone-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-600 flex-1 max-w-xs" />
        <div className="flex gap-2">
          {['','Processing','Shipped','Delivered','Cancelled'].map(s => (
            <button key={s} onClick={() => setOrderFilter(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${orderFilter === s ? 'text-white border-transparent' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`} style={orderFilter === s ? { background: BRASS } : {}}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <TableHeader cols={['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions']} />
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} className="border-b border-stone-100 hover:bg-amber-50/30 transition-colors">
                <td className="py-3 px-3 pl-5 text-xs font-mono text-stone-600">{o.id}</td>
                <td className="py-3 px-3">
                  <p className="text-sm font-medium text-stone-700">{o.customer}</p>
                  <p className="text-[10px] text-stone-400">{o.city}</p>
                </td>
                <td className="py-3 px-3 text-xs text-stone-500">{o.date}</td>
                <td className="py-3 px-3 text-xs text-stone-600">{o.items} item{o.items > 1 ? 's' : ''}</td>
                <td className="py-3 px-3 text-sm font-semibold text-stone-700">Γé╣{o.total.toLocaleString()}</td>
                <td className="py-3 px-3"><StatusBadge status={o.payment} /></td>
                <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                <td className="py-3 px-3 pr-5">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedOrder(o)} className="text-xs font-medium hover:underline" style={{ color: BRASS }}>View</button>
                    {o.status === 'Processing' && (
                      <button onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Shipped' } : x))} className="text-xs text-purple-600 hover:underline">Ship</button>
                    )}
                    {['Processing','Shipped'].includes(o.status) && (
                      <button onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Cancelled' } : x))} className="text-xs text-red-600 hover:underline">Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-stone-800">{selectedOrder.id}</h3>
                <p className="text-xs text-stone-500">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700">Γ£ò</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[['Customer', selectedOrder.customer], ['City', selectedOrder.city], ['Items', String(selectedOrder.items)], ['Total', `Γé╣${selectedOrder.total.toLocaleString()}`]].map(([l,v]) => (
                  <div key={l} className="bg-stone-50 rounded-lg p-3">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">{l}</p>
                    <p className="text-sm font-semibold text-stone-700 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-stone-50 rounded-lg p-3">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Payment</p>
                  <StatusBadge status={selectedOrder.payment} />
                </div>
                <div className="flex-1 bg-stone-50 rounded-lg p-3">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              {/* Order timeline */}
              <div>
                <p className="text-xs font-semibold text-stone-600 mb-3">Order Timeline</p>
                {['Order Placed','Payment Confirmed','Processing','Shipped','Delivered'].map((step, i) => {
                  const statusMap = { 'Processing': 2, 'Shipped': 3, 'Delivered': 4, 'Cancelled': 1, 'Returned': 4 }
                  const current = statusMap[selectedOrder.status as keyof typeof statusMap] ?? 0
                  const done = i < current
                  const active = i === current - 1
                  return (
                    <div key={step} className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${done || active ? 'text-white' : 'bg-stone-100 text-stone-400'}`} style={done || active ? { background: BRASS } : {}}>
                        {done || active ? 'Γ£ô' : i + 1}
                      </div>
                      <span className={`text-xs ${done || active ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>{step}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3 pt-2">
                {selectedOrder.payment === 'Paid' && selectedOrder.status === 'Delivered' && (
                  <button className="flex-1 py-2 text-xs font-semibold border border-red-300 text-red-600 rounded-lg hover:bg-red-50">Process Refund</button>
                )}
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: BRASS }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ΓöÇΓöÇ Page: Customers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const CustomersPage = (
    <div>
      <SectionHeader title="Customer Management" />
      <input type="text" placeholder="Search customersΓÇª" value={custSearch} onChange={e => setCustSearch(e.target.value)} className="border border-stone-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-600 mb-4 w-full max-w-xs" />
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <TableHeader cols={['Customer', 'Contact', 'Orders', 'Total Spent', 'Member Since', 'Status', 'Actions']} />
          <tbody>
            {CUSTOMERS.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.email.includes(custSearch)).map(c => (
              <tr key={c.id} className="border-b border-stone-100 hover:bg-amber-50/30 transition-colors">
                <td className="py-3 px-3 pl-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: BRASS }}>{c.name[0]}</div>
                    <span className="text-sm font-medium text-stone-700">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <p className="text-xs text-stone-600">{c.email}</p>
                  <p className="text-[10px] text-stone-400">{c.phone}</p>
                </td>
                <td className="py-3 px-3 text-sm text-stone-600">{c.orders}</td>
                <td className="py-3 px-3 text-sm font-semibold text-stone-700">Γé╣{c.totalSpent.toLocaleString()}</td>
                <td className="py-3 px-3 text-xs text-stone-500">{c.joined}</td>
                <td className="py-3 px-3"><StatusBadge status={c.status} /></td>
                <td className="py-3 px-3 pr-5">
                  <div className="flex gap-2">
                    <button className="text-xs font-medium hover:underline" style={{ color: BRASS }}>View</button>
                    <button className="text-xs text-stone-400 hover:text-stone-600">Orders</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ΓöÇΓöÇ Page: Custom Orders ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const CustomOrdersPage = (
    <div>
      <SectionHeader title="Custom & Bulk Order Requests" />
      <div className="grid gap-4">
        {requests.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-stone-400">{r.id}</span>
                  <StatusBadge status={r.status} />
                </div>
                <h3 className="font-semibold text-stone-800">{r.name}</h3>
                <p className="text-xs text-stone-500">{r.email} ┬╖ {r.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">{r.date}</p>
                {r.budget && <p className="text-sm font-bold text-stone-700 mt-1">Budget: Γé╣{r.budget.toLocaleString()}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              <div className="bg-stone-50 rounded p-2.5">
                <p className="text-[9px] text-stone-400 uppercase tracking-wider">Product Required</p>
                <p className="text-xs font-medium text-stone-700 mt-0.5">{r.product}</p>
              </div>
              <div className="bg-stone-50 rounded p-2.5">
                <p className="text-[9px] text-stone-400 uppercase tracking-wider">Quantity</p>
                <p className="text-sm font-bold text-stone-700 mt-0.5">{r.qty} units</p>
              </div>
              <div className="bg-stone-50 rounded p-2.5">
                <p className="text-[9px] text-stone-400 uppercase tracking-wider">Status</p>
                <StatusBadge status={r.status} />
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4 bg-amber-50/50 rounded p-3">{r.details}</p>
            <div className="flex gap-2">
              {r.status === 'New' && <button onClick={() => setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: 'In Review' } : x))} className="text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: BRASS, color: 'white' }}>Start Review</button>}
              {['New','In Review'].includes(r.status) && (
                <button onClick={() => { setSelectedReq(r); setShowQuoteForm(true) }} className="text-xs font-semibold px-4 py-2 rounded-lg border" style={{ borderColor: BRASS, color: BRASS }}>Create Quotation</button>
              )}
              {r.status === 'New' && <button onClick={() => setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: 'Declined' } : x))} className="text-xs px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Decline</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Quotation Form */}
      {showQuoteForm && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setShowQuoteForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-stone-800 mb-1">Create Quotation</h3>
            <p className="text-xs text-stone-500 mb-5">For: {selectedReq.name} ΓÇö {selectedReq.product}</p>
            <div className="space-y-4">
              {[
                { label: 'Quote Amount (Γé╣)', key: 'amount', type: 'number', placeholder: '250000' },
                { label: 'Validity (days)', key: 'validity', type: 'number', placeholder: '30' },
                { label: 'Estimated Delivery (days)', key: 'deliveryDays', type: 'number', placeholder: '45' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={quoteForm[f.key as keyof typeof quoteForm]} onChange={e => setQuoteForm(q => ({ ...q, [f.key]: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">Notes to Customer</label>
                <textarea rows={3} value={quoteForm.notes} onChange={e => setQuoteForm(q => ({ ...q, notes: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-600 resize-none" placeholder="Customization details, payment termsΓÇª" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowQuoteForm(false)} className="flex-1 py-2.5 text-sm border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50">Cancel</button>
                <button onClick={() => { setRequests(prev => prev.map(x => x.id === selectedReq.id ? { ...x, status: 'Quoted' } : x)); setShowQuoteForm(false) }} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg" style={{ background: BRASS }}>
                  Send Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ΓöÇΓöÇ Page: Analytics ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  const AnalyticsPage = (
    <div className="space-y-6">
      <SectionHeader title="Analytics & Insights" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="₹" label="Monthly Revenue" value="₹4.21L" trend="+8.4%" color="brass" />
        <StatCard icon="📦" label="Orders This Month" value="211" trend="+11.2%" color="green" />
        <StatCard icon="🛒" label="Avg. Order Value" value="₹1,995" trend="+2.1%" color="blue" />
        <StatCard icon="👥" label="Active Customers" value="1,842" trend="+5.3%" color="purple" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-sm font-semibold text-stone-800 mb-2">Revenue Trend</h3>
        <p className="text-xs text-stone-500">Analytics data is ready for integration with the backend reporting API.</p>
      </div>
    </div>
  )

  // -- Main render ----------------------------------------------------------

  const pageContent: Record<AdminPage, ReactNode> = {
    dashboard: DashboardPage,
    products: ProductsPage,
    categories: <div className="p-6 text-stone-500 text-sm">Categories coming soon.</div>,
    inventory: <div className="p-6 text-stone-500 text-sm">Inventory coming soon.</div>,
    orders: OrdersPage,
    customers: CustomersPage,
    'custom-orders': CustomOrdersPage,
    quotations: <div className="p-6 text-stone-500 text-sm">Quotations coming soon.</div>,
    reviews: <div className="p-6 text-stone-500 text-sm">Reviews coming soon.</div>,
    offers: <div className="p-6 text-stone-500 text-sm">Offers coming soon.</div>,
    notifications: <div className="p-6 text-stone-500 text-sm">Notifications coming soon.</div>,
    analytics: AnalyticsPage,
    'admin-users': <div className="p-6 text-stone-500 text-sm">Admin users coming soon.</div>,
    settings: <div className="p-6 text-stone-500 text-sm">Settings coming soon.</div>,
    'activity-log': <div className="p-6 text-stone-500 text-sm">Activity log coming soon.</div>,
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f4' }}>
      <aside
        className="flex flex-col flex-shrink-0 overflow-y-auto transition-all"
        style={{ width: sidebarOpen ? 240 : 64, background: '#1C1308', minHeight: '100vh' }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,#b8860b,#d4a017)' }}>M</div>
          {sidebarOpen && <span className="text-white text-sm font-semibold truncate">MRT Admin</span>}
          <button onClick={() => setSidebarOpen(v => !v)} className="ml-auto text-stone-400 hover:text-white text-xs">{sidebarOpen ? '<' : '>'}</button>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map(n => navItem(n.id as AdminPage, n.label, n.icon, n.id === 'notifications' ? unreadCount : undefined))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <span>&larr;</span>
            {sidebarOpen && <span>Back to Store</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center gap-4 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700 capitalize">{page.replace('-', ' ')}</h2>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-stone-500">admin@mrtmetalmart.in</span>
            <div className="w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center text-white text-xs font-bold">S</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {pageContent[page]}
        </main>
      </div>
    </div>
  )
}

