import axios from 'axios';
import { Product, Project, MatchProjectResult, CartModel, OrderModel, User } from '../types';

// Axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach user ID if logged in
api.interceptors.request.use((config) => {
  try {
    const savedUser = localStorage.getItem('partmatch_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user && user.id) {
        config.headers['x-user-id'] = user.id;
      }
    }
  } catch (e) {
    // Ignore storage parse error
  }
  return config;
});

// Response error handler helper
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// --- Auth APIs ---
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  getProfile: async (): Promise<User> => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// --- Product APIs ---
export interface ProductQueryParams {
  search?: string;
  category?: string;
  condition?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
  sellerId?: number;
}

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getProductById: async (id: number): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const res = await api.post('/products', productData);
    return res.data;
  },
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id: number): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  getUserProducts: async (): Promise<Product[]> => {
    const res = await api.get('/user/products');
    return res.data;
  },
};

// --- Project APIs ---
export interface ProjectQueryParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

export const projectService = {
  getProjects: async (params?: ProjectQueryParams): Promise<Project[]> => {
    const res = await api.get('/projects', { params });
    return res.data;
  },
  getProjectById: async (id: number): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  getProjectsByComponent: async (productId: number): Promise<Array<Project & { quantityRequired: number; totalComponentsCount: number }>> => {
    const res = await api.get('/projects/by-component', { params: { productId } });
    return res.data;
  },
};

// --- Smart Matching API ---
export const matchService = {
  matchByComponents: async (productIds: number[]): Promise<MatchProjectResult[]> => {
    const res = await api.post('/match', { productIds });
    return res.data;
  },
};

// --- Cart APIs ---
export const cartService = {
  getCart: async (): Promise<CartModel> => {
    const res = await api.get('/cart');
    return res.data;
  },
  addToCart: async (productId: number, quantity: number = 1): Promise<CartModel> => {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data.cart;
  },
  bulkAddToCart: async (items: { productId: number; quantity?: number }[]): Promise<{ message: string; addedCount: number; cart: CartModel }> => {
    const res = await api.post('/cart/bulk', { items });
    return res.data;
  },
  updateCartItem: async (cartItemId: number, quantity: number): Promise<CartModel> => {
    const res = await api.put(`/cart/items/${cartItemId}`, { quantity });
    return res.data;
  },
  removeCartItem: async (cartItemId: number): Promise<CartModel> => {
    const res = await api.delete(`/cart/items/${cartItemId}`);
    return res.data.cart;
  },
  clearCart: async (): Promise<void> => {
    await api.delete('/cart/clear');
  },
};

// --- Order APIs ---
export const orderService = {
  createOrder: async (pickupLocation: string, paymentMethod: string): Promise<{ success: boolean; order: OrderModel }> => {
    const res = await api.post('/orders', { pickupLocation, paymentMethod });
    return res.data;
  },
  getOrders: async (): Promise<OrderModel[]> => {
    const res = await api.get('/orders');
    return res.data;
  },
  getOrderById: async (id: string | number): Promise<OrderModel> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id: number, status: string): Promise<OrderModel> => {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },
};

export const resetData = async (): Promise<void> => {
  await api.post('/reset');
};

export default api;
