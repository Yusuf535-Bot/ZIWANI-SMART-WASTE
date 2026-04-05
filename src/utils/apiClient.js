import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to attach token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('takaRangerUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (preferredName, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        preferredName,
        password
      });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('takaRangerUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  },

  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('takaRangerUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed'
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user'
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      if (response.data.success) {
        localStorage.setItem('takaRangerUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('takaRangerUser');
  }
};

// Bottle endpoints
export const bottleAPI = {
  addBottle: async (bottleData) => {
    try {
      const response = await apiClient.post('/bottles', bottleData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add bottle'
      };
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/bottles/history');
      return response.data;
    } catch (error) {
      return {
        success: false,
        bottleHistory: [],
        error: error.response?.data?.error || 'Failed to fetch history'
      };
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get('/bottles/stats');
      return response.data;
    } catch (error) {
      return {
        success: false,
        stats: { totalBottles: 0, totalQuantity: 0, totalPointsEarned: 0 },
        error: error.response?.data?.error || 'Failed to fetch stats'
      };
    }
  }
};

// Redemption endpoints
export const redemptionAPI = {
  redeem: async (redemptionData) => {
    try {
      const response = await apiClient.post('/redemptions', redemptionData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to redeem points'
      };
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/redemptions/history');
      return response.data;
    } catch (error) {
      return {
        success: false,
        redemptionHistory: [],
        error: error.response?.data?.error || 'Failed to fetch history'
      };
    }
  }
};

export default apiClient;
