import axios from 'axios';

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://expensync-qru8.onrender.com/api',
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
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// API FUNCTIONS - Use these in your components instead of direct axios calls
// ============================================================================

// Auth Functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('❌ Signup failed:', error);
    throw error;
  }
};

// Dashboard Functions
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch dashboard data:', error);
    throw error;
  }
};

// Transaction Functions
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

export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    throw error;
  }
};

export const getTransactionSummary = async () => {
  try {
    const response = await api.get('/transactions/summary');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch transaction summary:', error);
    throw error;
  }
};

// Budget/Category Functions
export const setBudgetGoal = async (budgetData) => {
  try {
    const response = await api.post('/category-goals/set', budgetData);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to set budget goal:', error);
    throw error;
  }
};

export const getBudgetGoals = async () => {
  try {
    const response = await api.get('/category-goals');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch budget goals:', error);
    throw error;
  }
};

// Debt Functions
export const createDebt = async (debtData) => {
  try {
    const response = await api.post('/debts/create', debtData);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create debt:', error);
    throw error;
  }
};

export const getDebts = async () => {
  try {
    const response = await api.get('/debts');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch debts:', error);
    throw error;
  }
};

export const deleteDebt = async (debtId) => {
  try {
    const response = await api.delete(`/debts/${debtId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete debt:', error);
    throw error;
  }
};

// Summary Functions
export const getSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch summary:', error);
    throw error;
  }
};

// Reminder Functions
export const getReminders = async () => {
  try {
    const response = await api.get('/reminders');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch reminders:', error);
    throw error;
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await api.post('/reminders/create', reminderData);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create reminder:', error);
    throw error;
  }
};

// Budget Functions
export const getBudgets = async () => {
  try {
    const response = await api.get('/budgets');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch budgets:', error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await api.post('/budgets/create', budgetData);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create budget:', error);
    throw error;
  }
};

// Health Check
export const healthCheck = async () => {
  try {
    const response = await axios.get('https://expensync-qru8.onrender.com/');
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw error;
  }
};

// Export the configured API instance
export { api };
export default api;