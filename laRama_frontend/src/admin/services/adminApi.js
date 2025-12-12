/**
 * Administrative API Service - LaRama Frontend
 * Provides minimal request helpers for the administrative authentication flow.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const ADMIN_TOKEN_KEY = 'larama-admin-token';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Admin API request failed.');
    }

    return data;
  }

  login(credentials) {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  verify() {
    return this.request('/api/admin/verify', {
      method: 'GET',
    });
  }
}

export const ADMIN_TOKEN_STORAGE_KEY = ADMIN_TOKEN_KEY;
export const adminApi = new AdminApiService();
export default adminApi;
