import axios from "axios";

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || "https://expensync-qru8.onrender.com";

console.log("🔐 Token exists:", !!localStorage.getItem("token"));
console.log("🔄 Fetching data from:", `${API_URL}/api/transactions`);

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request:", token.substring(0, 20) + "...");
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

// ✅ FIXED API FUNCTIONS WITH CORRECT ENDPOINTS

// Authentication
export const login = (credentials) => api.post("/api/auth/login", credentials);
export const signup = (userData) => api.post("/api/auth/signup", userData);

// Transactions - FIXED: /api/transactions instead of /transactions
export const getTransactions = async () => {
  try {
    const response = await api.get("/api/transactions");
    console.log("✅ Raw response:", response);
    console.log("✅ Transactions fetched:", response.data);
    console.log("✅ Number of transactions:", response.data?.length || 0);
    
    // Use sample data if no transactions
    if (!response.data || response.data.length === 0) {
      console.log("📊 Using sample data for demonstration");
      const sampleData = [
        { _id: 1, title: "Sample Income", amount: 5000, category: "Income", type: "income", date: new Date() },
        { _id: 2, title: "Sample Expense", amount: -1200, category: "Food", type: "expense", date: new Date() },
        { _id: 3, title: "Sample Shopping", amount: -420, category: "Shopping", type: "expense", date: new Date() }
      ];
      
      const totalIncome = 6500;
      const totalExpense = 1620;
      console.log("💰 Total Income:", totalIncome);
      console.log("💸 Total Expense:", totalExpense);
      
      return sampleData;
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    throw error;
  }
};

export const createTransaction = (transactionData) =>
  api.post("/api/transactions", transactionData);

export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`);

// Budget Goals - FIXED: /api/category-budget instead of /category-goals
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

// Debts - FIXED: /api/debt instead of /debts  
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

// Reminders - FIXED: /api/reminder instead of /reminders
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

// Summary - FIXED: /api/summary instead of /summary and /dashboard  
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

// Dashboard data (alias for summary) - REMOVED /dashboard endpoint
export const getSummaryData = getSummary; // ✅ Use summary endpoint for dashboard

// Legacy support - keeping old function names but with fixed endpoints
export const getDashboardData = getSummary; // ✅ Dashboard now uses summary

export default api;