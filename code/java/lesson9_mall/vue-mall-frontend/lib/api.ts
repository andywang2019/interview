// API 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085"

// API 工具函数
async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// 商品相关 API
export const productApi = {
  // 获取商品列表
  getProducts: (params: {
    pageNum?: number
    pageSize?: number
    keyword?: string
    brandId?: number
    productCategoryId?: number
  }) => request(`/api/product/search?${new URLSearchParams(params as any)}`),

  // 获取商品详情
  getProductDetail: (id: number) => request(`/api/product/detail/${id}`),

  // 搜索商品
  searchProducts: (keyword: string, pageNum = 1, pageSize = 20) =>
    request(`/api/product/search?keyword=${keyword}&pageNum=${pageNum}&pageSize=${pageSize}`),
}

// 购物车相关 API
export const cartApi = {
  // 获取购物车列表
  getCartList: () => request("/api/cart/list"),

  // 添加商品到购物车
  addCartItem: (data: { productId: number; quantity: number }) =>
    request("/api/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新购物车商品数量
  updateCartItem: (id: number, quantity: number) =>
    request(`/api/cart/update/${id}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    }),

  // 删除购物车商品
  deleteCartItem: (ids: number[]) =>
    request("/api/cart/delete", {
      method: "POST",
      body: JSON.stringify(ids),
    }),

  // 清空购物车
  clearCart: () => request("/api/cart/clear", { method: "POST" }),
}

// 用户相关 API
export const memberApi = {
  // 用户登录
  login: (data: { username: string; password: string }) =>
    request("/api/member/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 用户注册
  register: (data: {
    username: string
    password: string
    telephone: string
    authCode: string
  }) =>
    request("/api/member/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 获取用户信息
  getInfo: () => request("/api/member/info"),

  // 获取验证码
  getAuthCode: (telephone: string) => request(`/api/member/getAuthCode?telephone=${telephone}`),
}

// 订单相关 API
export const orderApi = {
  // 生成确认订单
  generateConfirmOrder: (cartIds: number[]) =>
    request("/api/order/generateConfirmOrder", {
      method: "POST",
      body: JSON.stringify(cartIds),
    }),

  // 生成订单
  generateOrder: (data: any) =>
    request("/api/order/generateOrder", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 获取订单列表
  getOrderList: (status?: number, pageNum = 1, pageSize = 10) =>
    request(`/api/order/list?status=${status || ""}&pageNum=${pageNum}&pageSize=${pageSize}`),

  // 获取订单详情
  getOrderDetail: (orderId: number) => request(`/api/order/${orderId}`),

  // 取消订单
  cancelOrder: (orderId: number) =>
    request("/api/order/cancelOrder", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  // 删除订单
  deleteOrder: (orderId: number) =>
    request(`/api/order/deleteOrder`, {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
}

// 收藏相关 API
export const favoriteApi = {
  // 添加收藏
  addFavorite: (productId: number) =>
    request("/api/member/productCollection/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  // 取消收藏
  deleteFavorite: (productId: number) =>
    request("/api/member/productCollection/delete", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  // 获取收藏列表
  getFavoriteList: (pageNum = 1, pageSize = 10) =>
    request(`/api/member/productCollection/list?pageNum=${pageNum}&pageSize=${pageSize}`),
}

// 首页相关 API
export const homeApi = {
  // 获取首页内容
  getHomeContent: () => request("/api/home/content"),

  // 获取商品分类
  getProductCategories: () => request("/api/home/productCateList/1"),

  // 获取推荐商品
  getRecommendProducts: (pageNum = 1, pageSize = 12) =>
    request(`/api/home/recommendProductList?pageNum=${pageNum}&pageSize=${pageSize}`),

  // 获取新品推荐
  getNewProducts: (pageNum = 1, pageSize = 12) =>
    request(`/api/home/newProductList?pageNum=${pageNum}&pageSize=${pageSize}`),

  // 获取人气推荐
  getHotProducts: (pageNum = 1, pageSize = 12) =>
    request(`/api/home/hotProductList?pageNum=${pageNum}&pageSize=${pageSize}`),
}
