import axios from "axios";

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || "https://expensync-qru8.onrender.com";

console.log("🔐 Token exists:", !!localStorage.getItem("token"));

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request");
    }
    console.log("Making", config.method?.toUpperCase(), "request to:", config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response || error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = (credentials) => api.post("/api/auth/login", credentials);
export const signup = (userData) => api.post("/api/auth/signup", userData);

// Transactions - ✅ FIXED: Removed sample data logic
export const getTransactions = async () => {
  try {
    const response = await api.get("/api/transactions");
    console.log("✅ Transactions fetched:", response.data);
    console.log("✅ Number of transactions:", response.data?.length || 0);
    
    // Always return actual data from backend (can be empty array)
    return response.data || [];
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    throw error;
  }
};

export const createTransaction = (transactionData) =>
  api.post("/api/transactions", transactionData);

export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`);

// ✅ ADDED: Transaction Summary function
export const getTransactionSummary = async () => {
  try {
    const response = await api.get("/api/transactions/summary");
    console.log("✅ Transaction summary fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch transaction summary:", error);
    throw error;
  }
};

// Budget Goals
export const getBudgetGoals = async () => {
  try {
    const response = await api.get("/api/category-budget");
    console.log("✅ Budget goals fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch budget goals:", error);
    throw error;
  }
};

export const setBudgetGoals = (goalData) =>
  api.post("/api/category-budget", goalData);

// ✅ ADDED: Delete budget goal function
export const deleteBudgetGoal = (category) => 
  api.delete(`/api/budget/${category}`);

// Debts
export const getDebts = async () => {
  try {
    const response = await api.get("/api/debt");
    console.log("✅ Debts fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch debts:", error);
    throw error;
  }
};

export const createDebt = (debtData) => api.post("/api/debt", debtData);
export const deleteDebt = (id) => api.delete(`/api/debt/${id}`);

// Reminders
export const getReminders = async () => {
  try {
    const response = await api.get("/api/reminder");
    console.log("✅ Reminders fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch reminders:", error);
    throw error;
  }
};

export const createReminder = (reminderData) =>
  api.post("/api/reminder/create", reminderData);

export const deleteReminder = (id) => api.delete(`/api/reminder/${id}`);

// Summary
export const getSummary = async () => {
  try {
    const response = await api.get("/api/summary");
    console.log("✅ Summary fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch summary:", error);
    throw error;
  }
};

// Legacy support - keeping old function names for compatibility
export const getSummaryData = getSummary;
export const getDashboardData = getSummary;

export default api;