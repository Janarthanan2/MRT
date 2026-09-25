const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "")

type ApiResponse<T> = { success: boolean; data?: T; message?: string }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("mrt_access_token")
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>
  if (!response.ok || payload.success === false) throw new Error(payload.message || `API request failed: ${response.status}`)
  return payload.data as T
}

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
}

export const productApi = {
  list: (search = "") => get<any[]>(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  get: (id: number) => get<any>(`/products/${id}`),
  images: (id: number) => get<any[]>(`/products/${id}/images`),
}

export const categoryApi = {
  list: () => get<any[]>("/categories"),
  get: (id: number) => get<any>(`/categories/${id}`),
}

export const cartApi = {
  list: () => get<any[]>("/cart"),
  add: (productId: number, quantity = 1) => post("/cart/items", { productId, quantity }),
  update: (id: number, quantity: number) => put(`/cart/items/${id}`, { quantity }),
  remove: (id: number) => del(`/cart/items/${id}`),
}

export const wishlistApi = {
  list: () => get<any[]>("/wishlist"),
  add: (productId: number) => post(`/wishlist/items/${productId}`),
  remove: (productId: number) => del(`/wishlist/items/${productId}`),
}

export const orderApi = {
  list: () => get<any[]>("/orders"),
  get: (id: number) => get<any>(`/orders/${id}`),
}

export const customOrderApi = {
  create: (payload: unknown) => post("/custom-orders", payload),
  list: () => get<any[]>("/custom-orders"),
}

export const reviewApi = {
  list: (productId: number) => get<any[]>(`/reviews/product/${productId}`),
  create: (payload: unknown) => post("/reviews", payload),
}

export const userApi = {
  profile: () => get("/user/profile"),
  update: (payload: unknown) => put("/user/profile", payload),
}

export const adminApi = {
  dashboard: () => get("/admin/dashboard"),
  products: () => get<any[]>("/admin/products"),
  createProduct: (payload: unknown) => post("/admin/products", payload),
  updateProduct: (id: number, payload: unknown) => put(`/admin/products/${id}`, payload),
  deleteProduct: (id: number) => del(`/admin/products/${id}`),
  productStatus: (id: number, status: string) => patch(`/admin/products/${id}/status`, { status }),
  productImages: (id: number) => get<any[]>(`/products/${id}/images`),
  addProductImage: (id: number, imageUrl: string, sortOrder = 0) => post(`/admin/products/${id}/images`, { imageUrl, sortOrder }),
  deleteProductImage: (id: number, imageId: number) => del(`/admin/products/${id}/images/${imageId}`),
  categories: () => get<any[]>("/admin/categories"),
  createCategory: (payload: unknown) => post("/admin/categories", payload),
  updateCategory: (id: number, payload: unknown) => put(`/admin/categories/${id}`, payload),
  deleteCategory: (id: number) => del(`/admin/categories/${id}`),
  inventory: () => get<any[]>("/admin/inventory"),
  lowStock: () => get<any[]>("/admin/inventory/low-stock"),
  orders: () => get<any[]>("/admin/orders"),
  orderStatus: (id: number, status: string) => patch(`/admin/orders/${id}/status`, { status }),
  paymentStatus: (id: number, paymentStatus: string) => patch(`/admin/orders/${id}/payment`, { paymentStatus }),
  customers: () => get<any[]>("/admin/customers"),
  customOrders: () => get<any[]>("/admin/custom-orders"),
  quotations: () => get<any[]>("/admin/quotations"),
  reviews: () => get<any[]>("/admin/reviews"),
  offers: () => get<any[]>("/admin/offers"),
  notifications: () => get<any[]>("/admin/notifications"),
  analytics: () => get("/admin/analytics/overview"),
  revenue: () => get("/admin/analytics/revenue"),
  users: () => get<any[]>("/admin/users"),
  settings: () => get<any[]>("/admin/settings"),
  activityLog: () => get<any[]>("/admin/activity-log"),
}
