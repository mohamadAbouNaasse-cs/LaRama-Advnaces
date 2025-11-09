const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('larama-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth methods
  async register(userData) {
    const response = await this.post('/api/auth/register', userData);
    if (response.success && response.data.token) {
      localStorage.setItem('larama-auth-token', response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/api/auth/login', credentials);
    if (response.success && response.data.token) {
      localStorage.setItem('larama-auth-token', response.data.token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('larama-auth-token');
    localStorage.removeItem('larama-auth-user');
  }

  async getProfile() {
    return this.get('/api/auth/profile');
  }

  async verifyToken() {
    return this.get('/api/auth/verify');
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.get(`/api/products/${id}`);
  }

  async getCategories() {
    return this.get('/api/products/categories');
  }

  async getFeaturedProducts(limit = 6) {
    return this.get(`/api/products/featured?limit=${limit}`);
  }

  // Cart methods
  async getCart() {
    return this.get('/api/cart');
  }

  async addToCart(productId, quantity) {
    return this.post('/api/cart/add', {
      product_id: productId,
      quantity: quantity,
    });
  }

  async updateCartItem(cartItemId, quantity) {
    return this.put(`/api/cart/items/${cartItemId}`, { quantity });
  }

  async removeFromCart(cartItemId) {
    return this.delete(`/api/cart/items/${cartItemId}`);
  }

  async clearCart() {
    return this.delete('/api/cart');
  }

  // Order methods
  async getOrders() {
    return this.get('/api/orders');
  }

  async getOrder(id) {
    return this.get(`/api/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.post('/api/orders', orderData);
  }
}

export const apiService = new ApiService();
export default apiService;