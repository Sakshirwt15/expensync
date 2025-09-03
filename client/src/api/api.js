import axios from 'axios';

// ====================
// API CONFIGURATION
// ====================
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://expensync-qru8.onrender.com/api',
  timeout: 10000,
};

// Get token from localStorage
export const getToken = () => localStorage.getItem('token');

// ====================
// AXIOS INSTANCE
// ====================
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// ====================
// REQUEST INTERCEPTOR
// ====================
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token added:', token.substring(0, 20) + '...');
    }
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ====================
// RESPONSE INTERCEPTOR
// ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!['/login', '/signup'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ====================
// API FUNCTIONS
// ====================

// ---- Auth ----
export const loginUser = (credentials) => api.post('/auth/login', credentials).then(r => r.data);
export const signupUser = (userData) => api.post('/auth/signup', userData).then(r => r.data);

// ---- Transactions ----
export const createTransaction = (data) => api.post('/transactions', data).then(r => r.data);
export const getTransactions = () => api.get('/transactions').then(r => r.data);
export const getTransactionSummary = () => api.get('/transactions/summary').then(r => r.data);

// ---- Budget ----
export const setBudgetGoal = (data) => api.post('/budget/set', data).then(r => r.data);
export const getBudgetGoals = () => api.get('/budget').then(r => r.data);
export const deleteBudgetGoal = (category) => api.delete(`/budget/${category}`).then(r => r.data);

// ---- Category Budget ----
export const setCategoryBudget = (data) => api.post('/category-budget', data).then(r => r.data);
export const getCategoryBudgets = () => api.get('/category-budget').then(r => r.data);

// ---- Debt ----
export const createDebt = (data) => api.post('/debt', data).then(r => r.data);
export const getDebts = () => api.get('/debt').then(r => r.data);
export const deleteDebt = (id) => api.delete(`/debt/${id}`).then(r => r.data);

// ---- Reminder ----
export const createReminder = (data) => api.post('/reminder/create', data).then(r => r.data);
export const getReminders = () => api.get('/reminder').then(r => r.data);
export const deleteReminder = (id) => api.delete(`/reminder/${id}`).then(r => r.data);

// ---- Dashboard / Summary ----
export const getDashboard = () => api.get('/dashboard').then(r => r.data);
export const getSummary = () => api.get('/summary').then(r => r.data);

// ---- Health Check ----
export const healthCheck = () => axios.get('https://expensync-qru8.onrender.com/').then(r => r.data);

export { api };
export default api;
