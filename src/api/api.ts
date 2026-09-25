const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "")

type ApiEnvelope<T> = { success?: boolean; data?: T; message?: string }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("mrt_access_token")
  const headers = new Headers(options.headers)
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const text = await response.text()
  let payload: ApiEnvelope<T> | T = {} as T
  try { payload = text ? JSON.parse(text) : ({} as T) } catch { payload = {} as T }

  if (!response.ok) {
    const message = (payload as ApiEnvelope<T>)?.message || `API request failed: ${response.status}`
    throw new Error(message)
  }
  if (typeof payload === "object" && payload !== null && "success" in payload && (payload as ApiEnvelope<T>).success === false) {
    throw new Error((payload as ApiEnvelope<T>).message || "API request failed")
  }
  if (typeof payload === "object" && payload !== null && "data" in payload && (payload as ApiEnvelope<T>).data !== undefined) {
    return (payload as ApiEnvelope<T>).data as T
  }
  return payload as T
}

const query = (params: Record<string, unknown>) =>
  Object.entries(params).filter(([,v]) => v !== undefined && v !== "").map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")
const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) })
const put = <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) })
const patch = <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) })
const del = <T>(path: string) => request<T>(path, { method: "DELETE" })

export const authApi = {
  login: async (email: string, password: string) => {
    const data = await post<{ token: string; user: unknown }>("/auth/login", { email, password })
    localStorage.setItem("mrt_access_token", data.token)
    return data
  },
  register: async (name: string, email: string, password: string, phone?: string) => {
    const data = await post<{ token: string; user: unknown }>("/auth/register", { name, email, password, phone })
    localStorage.setItem("mrt_access_token", data.token)
    return data
  },
  me: () => get("/auth/me"),
  logout: async () => { try { await post("/auth/logout") } finally { localStorage.removeItem("mrt_access_token") } },
  forgotPassword: (email: string) => post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) => post("/auth/reset-password", { token, password }),
}

export const productApi = {
  list: (search = "", categoryId?: number) => {
    const q = query({ search, categoryId })
    return get<any[]>(`/products${q ? `?${q}` : ""}`)
  },
  get: (id: number) => get<any>(`/products/${id}`),
  featured: () => get<any[]>("/products/featured"),
  offers: () => get<any[]>("/products/offers"),
  images: (id: number) => get<any[]>(`/products/${id}/images`),
}

export const categoryApi = {
  list: () => get<any[]>("/categories"),
  get: (id: number) => get<any>(`/categories/${id}`),
  image: (id: number) => get<any>(`/categories/${id}/image`),
}

export const cartApi = {
  list: () => get<any[]>("/cart"),
  add: (productId: number, quantity = 1) => post<any[]>("/cart/items", { productId, quantity }),
  update: (id: number, quantity: number) => put<any[]>(`/cart/items/${id}`, { quantity }),
  remove: (id: number) => del<any[]>(`/cart/items/${id}`),
  clear: () => del("/cart"),
}

export const wishlistApi = {
  list: () => get<any[]>("/wishlist"),
  add: (productId: number) => post<any[]>(`/wishlist/items/${productId}`),
  remove: (productId: number) => del<any[]>(`/wishlist/items/${productId}`),
}

export const orderApi = {
  list: () => get<any[]>("/orders"),
  get: (id: number) => get<any>(`/orders/${id}`),
  create: (payload: unknown) => post<any>("/orders", payload),
  cancel: (id: number) => post<any>(`/orders/${id}/cancel`),
  tracking: (id: number) => get<any>(`/orders/${id}/tracking`),
}

export const paymentApi = {
  create: (payload: unknown) => post<any>("/payments/create", payload),
  verify: (payload: unknown) => post<any>("/payments/verify", payload),
  status: (orderId: number) => get<any>(`/payments/${orderId}`),
}

export const customOrderApi = {
  create: (payload: unknown) => post<any>("/custom-orders", payload),
  list: () => get<any[]>("/custom-orders"),
  get: (id: number) => get<any>(`/custom-orders/${id}`),
  message: (id: number, message: string) => post<any>(`/custom-orders/${id}/messages`, { message }),
}

export const quotationApi = {
  list: () => get<any[]>("/quotations"),
  get: (id: number) => get<any>(`/quotations/${id}`),
  accept: (id: number) => post<any>(`/quotations/${id}/accept`),
}

export const reviewApi = {
  list: (productId: number) => get<any[]>(`/reviews/product/${productId}`),
  create: (payload: unknown) => post<any>("/reviews", payload),
}

export const userApi = {
  profile: () => get<any>("/user/profile"),
  update: (payload: unknown) => put<any>("/user/profile", payload),
  updatePassword: (payload: unknown) => put<any>("/user/password", payload),
}

export const notificationApi = {
  list: () => get<any[]>("/notifications"),
  markRead: (id: number) => patch<any>(`/notifications/${id}/read`),
  markAllRead: () => patch<any>("/notifications/read-all"),
}

export const adminApi = {
  dashboard: () => get<any>("/admin/dashboard"),
  dashboardRevenue: () => get<any[]>("/admin/dashboard/revenue"),
  dashboardOrders: () => get<any[]>("/admin/dashboard/orders"),
  dashboardCategories: () => get<any[]>("/admin/dashboard/categories"),

  products: () => get<any[]>("/admin/products"),
  product: (id: number) => get<any>(`/admin/products/${id}`),
  createProduct: (payload: unknown) => post<any>("/admin/products", payload),
  updateProduct: (id: number, payload: unknown) => put<any>(`/admin/products/${id}`, payload),
  deleteProduct: (id: number) => del<any>(`/admin/products/${id}`),
  productStatus: (id: number, status: string) => patch<any>(`/admin/products/${id}/status`, { status }),
  productImages: (id: number) => get<any[]>(`/products/${id}/images`),
  addProductImage: (id: number, imageUrl: string, sortOrder = 0) => post<any>(`/admin/products/${id}/images`, { imageUrl, sortOrder }),
  deleteProductImage: (id: number, imageId: number) => del<any>(`/admin/products/${id}/images/${imageId}`),

  categories: () => get<any[]>("/admin/categories"),
  createCategory: (payload: unknown) => post<any>("/admin/categories", payload),
  updateCategory: (id: number, payload: unknown) => put<any>(`/admin/categories/${id}`, payload),
  deleteCategory: (id: number) => del<any>(`/admin/categories/${id}`),
  addCategoryImage: (id: number, imageUrl: string) => post<any>(`/admin/categories/${id}/image`, { imageUrl }),
  deleteCategoryImage: (id: number) => del<any>(`/admin/categories/${id}/image`),

  inventory: () => get<any[]>("/admin/inventory"),
  lowStock: () => get<any[]>("/admin/inventory/low-stock"),
  updateInventory: (productId: number, payload: unknown) => patch<any>(`/admin/inventory/${productId}`, payload),

  orders: () => get<any[]>("/admin/orders"),
  order: (id: number) => get<any>(`/admin/orders/${id}`),
  orderStatus: (id: number, status: string) => patch<any>(`/admin/orders/${id}/status`, { status }),
  paymentStatus: (id: number, paymentStatus: string) => patch<any>(`/admin/orders/${id}/payment`, { paymentStatus }),
  refund: (id: number) => post<any>(`/admin/orders/${id}/refund`),

  customers: () => get<any[]>("/admin/customers"),
  customer: (id: number) => get<any>(`/admin/customers/${id}`),
  customerOrders: (id: number) => get<any[]>(`/admin/customers/${id}/orders`),
  customerStatus: (id: number, status: string) => patch<any>(`/admin/customers/${id}/status`, { status }),

  customOrders: () => get<any[]>("/admin/custom-orders"),
  customOrder: (id: number) => get<any>(`/admin/custom-orders/${id}`),
  customOrderStatus: (id: number, status: string) => patch<any>(`/admin/custom-orders/${id}/status`, { status }),
  quoteCustomOrder: (id: number, payload: unknown) => post<any>(`/admin/custom-orders/${id}/quote`, payload),

  quotations: () => get<any[]>("/admin/quotations"),
  quotation: (id: number) => get<any>(`/admin/quotations/${id}`),
  createQuotation: (payload: unknown) => post<any>("/admin/quotations", payload),
  updateQuotation: (id: number, payload: unknown) => put<any>(`/admin/quotations/${id}`, payload),
  quotationStatus: (id: number, status: string) => patch<any>(`/admin/quotations/${id}/status`, { status }),

  reviews: () => get<any[]>("/admin/reviews"),
  review: (id: number) => get<any>(`/admin/reviews/${id}`),
  reviewStatus: (id: number, status: string) => patch<any>(`/admin/reviews/${id}/status`, { status }),
  deleteReview: (id: number) => del<any>(`/admin/reviews/${id}`),

  offers: () => get<any[]>("/admin/offers"),
  createOffer: (payload: unknown) => post<any>("/admin/offers", payload),
  updateOffer: (id: number, payload: unknown) => put<any>(`/admin/offers/${id}`, payload),
  deleteOffer: (id: number) => del<any>(`/admin/offers/${id}`),
  offerStatus: (id: number, status: string) => patch<any>(`/admin/offers/${id}/status`, { status }),

  notifications: () => get<any[]>("/admin/notifications"),
  notificationRead: (id: number) => patch<any>(`/admin/notifications/${id}/read`),
  notificationsReadAll: () => patch<any>("/admin/notifications/read-all"),

  analytics: () => get<any>("/admin/analytics/overview"),
  revenue: () => get<any[]>("/admin/analytics/revenue"),
  analyticsOrders: () => get<any[]>("/admin/analytics/orders"),
  analyticsProducts: () => get<any[]>("/admin/analytics/products"),
  analyticsCustomers: () => get<any[]>("/admin/analytics/customers"),

  users: () => get<any[]>("/admin/users"),
  createUser: (payload: unknown) => post<any>("/admin/users", payload),
  updateUser: (id: number, payload: unknown) => put<any>(`/admin/users/${id}`, payload),
  deleteUser: (id: number) => del<any>(`/admin/users/${id}`),
  userStatus: (id: number, status: string) => patch<any>(`/admin/users/${id}/status`, { status }),

  settings: () => get<any>("/admin/settings"),
  updateSettings: (payload: unknown) => put<any>("/admin/settings", payload),
  updatePassword: (payload: unknown) => put<any>("/admin/settings/password", payload),
  activityLog: () => get<any[]>("/admin/activity-log"),
}
