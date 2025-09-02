import axios from 'axios';

export const API_CONFIG = {
   baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
};

// Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ NO TOKEN FOUND for request to:', config.url);
    }
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      token: getToken() ? 'Token exists' : 'No token'
    });

    // Handle 401 errors globally
    if (error.response?.status === 401) {
      console.warn('🔒 Authentication failed - clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API FUNCTIONS - Add these to match what your components are importing

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions/create', transactionData);
    console.log('✅ Transaction created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create transaction:', error);
    throw error;
  }
};

// Get all transactions for the user
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    throw error;
  }
};

// Get user summary (income/expenses)
export const getSummary = async () => {
  try {
    const response = await api.get('/summary/summary');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch summary:', error);
    throw error;
  }
};

// Get budget goals
export const getBudgetGoals = async () => {
  try {
    const response = await api.get('/category-goals');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch budget goals:', error);
    throw error;
  }
};

// Get debts
export const getDebts = async () => {
  try {
    const response = await api.get('/debts');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch debts:', error);
    throw error;
  }
};

// Keep the default export for the axios instance
export { api }; // Add this line
export default api; // Keep this too
