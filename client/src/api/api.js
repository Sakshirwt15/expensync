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

// ===== Authentication =====
export const login = (credentials) => api.post("/api/auth/login", credentials);
export const signup = (userData) => api.post("/api/auth/signup", userData);

// ===== Transactions =====
export const getTransactions = async () => {
  const res = await api.get("/api/transactions");
  return res.data || [];
};
export const createTransaction = (data) => api.post("/api/transactions", data);
export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`);
export const getTransactionSummary = async () => {
  const res = await api.get("/api/transactions/summary");
  return res.data || {};
};

// ===== Budget Goals =====
export const getBudgetGoals = async () => {
  const res = await api.get("/api/category-budget");
  return res.data || {};
};
export const setBudgetGoals = (data) => api.post("/api/category-budget", data);
export const deleteBudgetGoal = (category) => api.delete(`/api/budget/${category}`);

// ===== Debts =====
export const getDebts = async () => {
  const res = await api.get("/api/debt");
  return res.data || [];
};
export const createDebt = (data) => api.post("/api/debt", data);
export const deleteDebt = (id) => api.delete(`/api/debt/${id}`);

// ===== Reminders =====
export const getReminders = async () => {
  const res = await api.get("/api/reminder");
  return res.data || [];
};
export const createReminder = (data) => api.post("/api/reminder/create", data);
export const deleteReminder = (id) => api.delete(`/api/reminder/${id}`);

// ===== Summary =====
export const getSummary = async () => {
  const res = await api.get("/api/summary");
  return res.data || {};
};

// ===== Legacy / Aliases (future-proof) =====
export const getSummaryData = getSummary;
export const getDashboardData = getSummary;

export default api;
