// ATELIER — Frontend API Client Layer
// This file coordinates all frontend API requests for both customers and admin.
// By default, it operates in MOCK mode to support pure frontend demonstration with network latencies,
// but can be toggled to communicate with a live backend API by changing the USE_MOCK flag.

import { products as initialProducts, categories as initialCategories, orders as initialOrders, users as initialUsers } from './mock-data';

// --- CONFIGURATION ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const USE_MOCK = false; // Toggle false to connect immediately to a live backend service

// Network latency simulator
const simulateNetwork = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to handle standard headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('atelier_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Helper for live fetches
async function fetcher(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...options.headers };
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: Status ${response.status}`);
  }
  return response.json();
}


// ==========================================
// 1. AUTHENTICATION APIs (Customer + Admin)
// ==========================================
export const authApi = {
  signup: async (userData) => {
    if (USE_MOCK) {
      await simulateNetwork(400);
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'USER',
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        addresses: [],
      };
      localStorage.setItem('atelier_token', 'mock-jwt-token-string');
      localStorage.setItem('atelier_user', JSON.stringify(newUser));
      return { success: true, user: newUser, token: 'mock-jwt-token-string' };
    }
    const res = await fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.success && res.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_token', res.data.accessToken);
        localStorage.setItem('atelier_refresh_token', res.data.refreshToken);
        localStorage.setItem('atelier_user', JSON.stringify(res.data.user));
      }
      return { success: true, user: res.data.user, token: res.data.accessToken };
    }
    return res;
  },

  login: async (credentials) => {
    if (USE_MOCK) {
      await simulateNetwork(400);
      // Validate credentials in mock mode
      const isAltAdmin = credentials.email.includes('admin');
      const mockUser = {
        id: isAltAdmin ? 'usr-admin' : 'usr-101',
        name: isAltAdmin ? 'Admin Director' : 'Julian Sterling',
        email: credentials.email,
        role: isAltAdmin ? 'ADMIN' : 'USER',
        avatar: isAltAdmin ? 'AD' : 'JS',
        addresses: isAltAdmin ? [] : initialUsers[0].addresses,
      };
      localStorage.setItem('atelier_token', 'mock-jwt-token-string');
      localStorage.setItem('atelier_user', JSON.stringify(mockUser));
      return { success: true, user: mockUser, token: 'mock-jwt-token-string' };
    }
    const res = await fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_token', res.data.accessToken);
        localStorage.setItem('atelier_refresh_token', res.data.refreshToken);
        localStorage.setItem('atelier_user', JSON.stringify(res.data.user));
      }
      return { success: true, user: res.data.user, token: res.data.accessToken };
    }
    return res;
  },

  logout: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      localStorage.removeItem('atelier_token');
      localStorage.removeItem('atelier_user');
      localStorage.removeItem('atelier_refresh_token');
      return { success: true, message: 'Logged out successfully' };
    }
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('atelier_refresh_token') : null;
    try {
      await fetcher('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.error('Logout error', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atelier_token');
      localStorage.removeItem('atelier_user');
      localStorage.removeItem('atelier_refresh_token');
    }
    return { success: true, message: 'Logged out successfully' };
  },

  refreshToken: async () => {
    if (USE_MOCK) {
      await simulateNetwork(100);
      return { token: 'new-mock-jwt-token-string' };
    }
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('atelier_refresh_token') : null;
    const res = await fetcher('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (res.success && res.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_token', res.data.accessToken);
      }
      return { token: res.data.accessToken };
    }
    return res;
  },

  forgotPassword: async (email) => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      return { success: true, message: 'Reset email dispatched.' };
    }
    return fetcher('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password) => {
    if (USE_MOCK) {
      await simulateNetwork(350);
      return { success: true, message: 'Password reset completed.' };
    }
    return fetcher(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  getMe: async () => {
    if (USE_MOCK) {
      await simulateNetwork(150);
      const userStr = localStorage.getItem('atelier_user');
      if (!userStr) throw new Error('Unauthenticated');
      return JSON.parse(userStr);
    }
    const res = await fetcher('/auth/me');
    if (res.success && res.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_user', JSON.stringify(res.data));
      }
      return res.data;
    }
    throw new Error('Unauthenticated');
  },
};


// ==========================================
// 2. USER APIs
// ==========================================
export const userApi = {
  getUser: async (id) => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return initialUsers.find(u => u.id === id) || initialUsers[0];
    }
    return fetcher(`/users/${id}`);
  },

  updateUser: async (id, userData) => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      const cached = localStorage.getItem('atelier_user');
      const currentUser = cached ? JSON.parse(cached) : initialUsers[0];
      const updated = { ...currentUser, ...userData };
      localStorage.setItem('atelier_user', JSON.stringify(updated));
      return { success: true, user: updated };
    }
    const res = await fetcher(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    if (res.success && res.data) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('atelier_user');
        const currentUser = cached ? JSON.parse(cached) : {};
        const updated = { ...currentUser, ...res.data };
        localStorage.setItem('atelier_user', JSON.stringify(updated));
      }
      return { success: true, user: res.data };
    }
    return res;
  },

  deleteUser: async (id) => {
    if (USE_MOCK) {
      await simulateNetwork(250);
      return { success: true, message: `User ${id} terminated.` };
    }
    return fetcher(`/users/${id}`, { method: 'DELETE' });
  },
};


// ==========================================
// 3. PRODUCT APIs (Public & Admin)
// ==========================================
export const productApi = {
  // Supports filtering, search, sorting and pagination
  listProducts: async (queryParams = {}) => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      let result = [...initialProducts];
      const { search, category, sort, page = 1, limit = 10 } = queryParams;

      // Filter: Search query
      if (search) {
        result = result.filter(
          p => p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter: Category slug
      if (category) {
        result = result.filter(p => p.category === category);
      }

      // Sort criteria
      if (sort === 'price_asc') {
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price_desc') {
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      }

      // Paginate results
      const startIndex = (page - 1) * limit;
      const paginatedItems = result.slice(startIndex, startIndex + limit);

      return {
        products: paginatedItems,
        total: result.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.length / limit),
      };
    }
    
    const mappedParams = { ...queryParams };
    if (queryParams.sort === 'price-low') {
      mappedParams.sort = 'price_asc';
    } else if (queryParams.sort === 'price-high') {
      mappedParams.sort = 'price_desc';
    }

    const query = new URLSearchParams(mappedParams).toString();
    const res = await fetcher(`/products?${query}`);
    
    if (res.success && res.data) {
      const mappedProducts = res.data.products.map(p => ({
        ...p,
        category: p.category ? p.category.slug : p.categoryId,
        images: p.images && p.images.length > 0 ? p.images.map(img => img.imageUrl) : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'],
        sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        colors: p.colors || ['Black', 'Off-White', 'Cream', 'Charcoal'],
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 0,
        featured: p.price > 200,
        stock: p.stockQuantity
      }));
      return {
        products: mappedProducts,
        total: res.data.pagination.total,
        page: res.data.pagination.page,
        limit: res.data.pagination.limit,
        totalPages: res.data.pagination.totalPages,
      };
    }
    return res;
  },

  getProductDetails: async (idOrSlug) => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      const match = initialProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (!match) throw new Error('Product not found');
      return match;
    }
    const res = await fetcher(`/products/${idOrSlug}`);
    if (res.success && res.data) {
      const p = res.data;
      return {
        ...p,
        category: p.category ? p.category.slug : p.categoryId,
        images: p.images && p.images.length > 0 ? p.images.map(img => img.imageUrl) : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'],
        sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        colors: p.colors || ['Black', 'Off-White', 'Cream', 'Charcoal'],
        rating: p.rating || 5.0,
        reviewsCount: p.reviews?.length || 0,
        featured: p.price > 200,
        stock: p.stockQuantity
      };
    }
    return res;
  },

  listCategories: async () => {
    if (USE_MOCK) {
      await simulateNetwork(150);
      return initialCategories;
    }
    const res = await fetcher('/products/categories');
    if (res.success && res.data) {
      return res.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat._count?.products || 10,
        image: cat.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'
      }));
    }
    return res;
  },

  // Admin CRUD Operations
  adminCreateProduct: async (productData) => {
    if (USE_MOCK) {
      await simulateNetwork(400);
      const newProduct = {
        id: `prod-${Date.now()}`,
        slug: productData.name.toLowerCase().replace(/ /g, '-'),
        rating: 5.0,
        reviewsCount: 0,
        ...productData,
      };
      return { success: true, product: newProduct };
    }
    return fetcher('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  adminUpdateProduct: async (id, productData) => {
    if (USE_MOCK) {
      await simulateNetwork(350);
      return { success: true, message: `Product ${id} modified.` };
    }
    return fetcher(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  adminDeleteProduct: async (id) => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      return { success: true, message: `Product ${id} deleted.` };
    }
    return fetcher(`/admin/products/${id}`, { method: 'DELETE' });
  },

  adminUpdateProductImages: async (id, images) => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      return { success: true, images };
    }
    return fetcher(`/admin/products/${id}/images`, {
      method: 'PATCH',
      body: JSON.stringify({ images }),
    });
  },
};


// ==========================================
// 4. CART APIs (Customer)
// ==========================================
export const cartApi = {
  getCart: async () => {
    if (USE_MOCK) {
      await simulateNetwork(100);
      const cartStr = localStorage.getItem('atelier_cart');
      return cartStr ? JSON.parse(cartStr) : [];
    }
    return fetcher('/cart');
  },

  addToCart: async (productId, size, color, quantity = 1) => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      const product = initialProducts.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      const cartStr = localStorage.getItem('atelier_cart');
      let currentCart = cartStr ? JSON.parse(cartStr) : [];
      
      const existingIdx = currentCart.findIndex(
        i => i.id === productId && i.size === size && i.color === color
      );

      if (existingIdx > -1) {
        currentCart[existingIdx].quantity += quantity;
      } else {
        currentCart.push({
          cartItemId: `${productId}-${size}-${color}-${Date.now()}`,
          id: productId,
          name: product.name,
          slug: product.slug,
          price: product.discountPrice || product.price,
          size,
          color,
          quantity,
          image: product.images[0],
        });
      }
      localStorage.setItem('atelier_cart', JSON.stringify(currentCart));
      return { success: true, cart: currentCart };
    }
    return fetcher('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, size, color, quantity }),
    });
  },

  updateCartItemQty: async (cartItemId, quantity) => {
    if (USE_MOCK) {
      await simulateNetwork(150);
      const cartStr = localStorage.getItem('atelier_cart');
      if (!cartStr) return { success: false };
      
      let currentCart = JSON.parse(cartStr);
      currentCart = currentCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);

      localStorage.setItem('atelier_cart', JSON.stringify(currentCart));
      return { success: true, cart: currentCart };
    }
    return fetcher(`/cart/items/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (cartItemId) => {
    if (USE_MOCK) {
      await simulateNetwork(150);
      const cartStr = localStorage.getItem('atelier_cart');
      if (!cartStr) return { success: false };
      
      const currentCart = JSON.parse(cartStr).filter(item => item.cartItemId !== cartItemId);
      localStorage.setItem('atelier_cart', JSON.stringify(currentCart));
      return { success: true, cart: currentCart };
    }
    return fetcher(`/cart/items/${cartItemId}`, { method: 'DELETE' });
  },

  clearCart: async () => {
    if (USE_MOCK) {
      await simulateNetwork(100);
      localStorage.removeItem('atelier_cart');
      return { success: true, cart: [] };
    }
    return fetcher('/cart', { method: 'DELETE' });
  },
};


// ==========================================
// 5. CHECKOUT & ORDERS
// ==========================================
export const orderApi = {
  checkout: async (orderData) => {
    if (USE_MOCK) {
      await simulateNetwork(500);
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total: orderData.total,
        paymentMethod: orderData.paymentMethod || 'Apple Pay',
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
      };
      
      // Save order in mock storage
      const existingOrdersStr = localStorage.getItem('atelier_orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : initialOrders;
      localStorage.setItem('atelier_orders', JSON.stringify([newOrder, ...existingOrders]));
      
      // Clear cart
      localStorage.removeItem('atelier_cart');
      
      return { success: true, order: newOrder };
    }
    return fetcher('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  ordersHistory: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      const cached = localStorage.getItem('atelier_orders');
      return cached ? JSON.parse(cached) : initialOrders;
    }
    return fetcher('/orders/my');
  },

  orderDetails: async (id) => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      const cached = localStorage.getItem('atelier_orders');
      const orderList = cached ? JSON.parse(cached) : initialOrders;
      const match = orderList.find(o => o.id === id);
      if (!match) throw new Error('Order not found');
      return match;
    }
    return fetcher(`/orders/${id}`);
  },

  // Admin order endpoints
  adminListOrders: async () => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      const cached = localStorage.getItem('atelier_orders');
      return cached ? JSON.parse(cached) : initialOrders;
    }
    return fetcher('/admin/orders');
  },

  adminUpdateOrderStatus: async (id, status) => {
    if (USE_MOCK) {
      await simulateNetwork(250);
      const cached = localStorage.getItem('atelier_orders');
      const orderList = cached ? JSON.parse(cached) : initialOrders;
      const updated = orderList.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('atelier_orders', JSON.stringify(updated));
      return { success: true, order: updated.find(o => o.id === id) };
    }
    return fetcher(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};


// ==========================================
// 6. ADMIN & ANALYTICS APIs
// ==========================================
export const adminApi = {
  getAdminMe: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return {
        id: 'usr-admin',
        name: 'Admin Director',
        email: 'admin@atelier.com',
        role: 'ADMIN',
        avatar: 'AD',
      };
    }
    return fetcher('/admin/me');
  },

  getAnalyticsOverview: async () => {
    if (USE_MOCK) {
      await simulateNetwork(350);
      return {
        totalSales: 24890,
        totalOrders: 48,
        totalUsers: 142,
        salesChangePercent: 12.5,
        ordersChangePercent: 8.2,
        usersChangePercent: 15.4,
      };
    }
    return fetcher('/admin/analytics/overview');
  },

  getAnalyticsSales: async (range = '7d') => {
    if (USE_MOCK) {
      await simulateNetwork(300);
      return {
        range,
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sales: [1200, 1900, 3000, 500, 2400, 3500, 4200],
        orders: [4, 8, 12, 2, 9, 14, 18],
      };
    }
    return fetcher(`/admin/analytics/sales?range=${range}`);
  },

  getAnalyticsTopProducts: async () => {
    if (USE_MOCK) {
      await simulateNetwork(250);
      return initialProducts.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        salesCount: Math.floor(10 + Math.random() * 40),
        revenue: p.price * Math.floor(10 + Math.random() * 40),
        image: p.images[0],
      }));
    }
    return fetcher('/admin/analytics/top-products');
  },

  getAnalyticsRecentOrders: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return initialOrders.slice(0, 3);
    }
    return fetcher('/admin/analytics/recent-orders');
  },

  getAnalyticsInventory: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return {
        totalItems: initialProducts.reduce((acc, p) => acc + p.stock, 0),
        lowStockItemsCount: initialProducts.filter(p => p.stock < 10).length,
        outOfStockItemsCount: initialProducts.filter(p => p.stock === 0).length,
      };
    }
    return fetcher('/admin/analytics/inventory');
  },
};


// ==========================================
// 7. INVENTORY APIs
// ==========================================
export const inventoryApi = {
  getInventoryStock: async () => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return initialProducts.map(p => ({
        productId: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        status: p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock',
        image: p.images[0],
      }));
    }
    return fetcher('/admin/inventory');
  },

  updateInventoryStock: async (productId, stock) => {
    if (USE_MOCK) {
      await simulateNetwork(200);
      return { success: true, productId, stock };
    }
    return fetcher(`/admin/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  getLowStockAlerts: async () => {
    if (USE_MOCK) {
      await simulateNetwork(150);
      return initialProducts.filter(p => p.stock < 10).map(p => ({
        productId: p.id,
        name: p.name,
        stock: p.stock,
        image: p.images[0],
      }));
    }
    return fetcher('/admin/inventory/low-stock');
  },
};
