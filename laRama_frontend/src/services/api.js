/**
 * API Service Layer - LaRama Frontend
 * Centralized service for all backend API communications
 * Handles authentication, error management, and request/response formatting
 * Provides methods for user auth, products, cart, orders, and newsletter operations
 */

// Environment-based API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * ApiService Class
 * Singleton service class managing all HTTP requests to the backend
 * Implements JWT token management and standardized error handling
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic HTTP Request Method
   * Handles authentication headers, error responses, and JSON parsing
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options (method, headers, body)
   * @returns {Promise<object>} - Parsed JSON response
   */
  async request(endpoint, options = {}) {
    // Construct full URL from base URL and endpoint
    const url = `${this.baseURL}${endpoint}`;
    
    // Default request configuration with JSON content type
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Attach JWT authentication token if available in localStorage
    const token = localStorage.getItem('larama-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Execute HTTP request and parse JSON response
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle HTTP error status codes
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Log error for debugging in development mode
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('API Request Error:', error);
      }
      throw error;
    }
  }

  /**
   * HTTP Method Wrappers
   * Simplified methods for common HTTP operations
   */

  // GET request for data retrieval
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request for data creation
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request for data updates
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request for data removal
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Authentication Methods
   * Handle user registration, login, logout, and profile management
   * Manage JWT token storage and validation
   */

  // Register new user account and store authentication token
  async register(userData) {
    const response = await this.post('/api/auth/register', userData);
    if (response.success && response.data.token) {
      localStorage.setItem('larama-auth-token', response.data.token);
    }
    return response;
  }

  // Authenticate user login and store authentication token
  async login(credentials) {
    const response = await this.post('/api/auth/login', credentials);
    if (response.success && response.data.token) {
      localStorage.setItem('larama-auth-token', response.data.token);
    }
    return response;
  }

  // Clear authentication data from local storage
  async logout() {
    localStorage.removeItem('larama-auth-token');
    localStorage.removeItem('larama-auth-user');
  }

  // Retrieve current authenticated user profile information
  async getProfile() {
    return this.get('/api/auth/profile');
  }

  // Verify JWT token validity with backend
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

  async searchProducts(searchTerm, category = null) {
    const params = { search: searchTerm };
    if (category && category !== 'all') {
      params.category = category;
    }
    return this.getProducts(params);
  }

  async getProductsByCategory(category, page = 1, limit = 10) {
    const params = { category, page, limit };
    return this.getProducts(params);
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

  // Newsletter methods
  async subscribeNewsletter(email, source = 'website') {
    return this.post('/api/newsletter/subscribe', { email, source });
  }

  async unsubscribeNewsletter(email) {
    return this.post('/api/newsletter/unsubscribe', { email });
  }

  async getNewsletterStats() {
    return this.get('/api/newsletter/stats');
  }

  async getActiveSubscribers(page = 1, limit = 50) {
    return this.get(`/api/newsletter/subscribers?page=${page}&limit=${limit}`);
  }
}

export const apiService = new ApiService();
export default apiService;