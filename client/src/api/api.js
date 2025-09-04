import axios from "axios";

// Base API configuration with fallback
const API_URL = import.meta.env.VITE_API_URL || "https://expensync-qru8.onrender.com";

// Enhanced logging
console.log("🌐 API Base URL:", API_URL);
console.log("🔐 Token exists:", !!localStorage.getItem("token"));

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request");
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    
    console.log(`📤 Making ${config.method?.toUpperCase()} request to:`, 
      `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response [${response.status}]:`, 
      response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle different error types
    if (error.response?.status === 401) {
      console.warn("🚨 Unauthorized - Clearing token and redirecting");
      localStorage.removeItem("token");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 404) {
      console.error("🚨 Endpoint not found:", error.config?.url);
    } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error("🚨 Network error - Backend might be down");
    }

    return Promise.reject(error);
  }
);

// Enhanced API functions with better error handling and validation
export const login = async (credentials) => {
  try {
    console.log("🔑 Attempting login...");
    const response = await api.post("/api/auth/login", credentials);
    console.log("✅ Login successful");
    return response;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    console.log("📝 Attempting signup...");
    const response = await api.post("/api/auth/signup", userData);
    console.log("✅ Signup successful");
    return response;
  } catch (error) {
    console.error("❌ Signup failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

// ===== Transactions =====
export const getTransactions = async () => {
  try {
    console.log("📋 Fetching transactions...");
    const res = await api.get("/api/transactions");
    const data = Array.isArray(res.data) ? res.data : res.data?.transactions || [];
    console.log("✅ Transactions fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    return []; // Return empty array as fallback
  }
};

export const createTransaction = async (data) => {
  try {
    // ✅ Enhanced logging - show the actual data being sent
    console.log("➕ Creating transaction with data:", JSON.stringify(data, null, 2));
    
    // ✅ Validate data on frontend before sending
    if (!data.title || !data.amount || !data.category || !data.type) {
      throw new Error("Missing required fields: title, amount, category, and type are required");
    }

    if (!['income', 'expense'].includes(data.type)) {
      throw new Error("Type must be 'income' or 'expense'");
    }

    if (typeof data.amount !== 'number' || data.amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    const response = await api.post("/api/transactions", data);
    console.log("✅ Transaction created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Failed to create transaction:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      sentData: data
    });
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    console.log("🗑️ Deleting transaction:", id);
    const response = await api.delete(`/api/transactions/${id}`);
    console.log("✅ Transaction deleted successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to delete transaction:", error);
    throw error;
  }
};

export const getTransactionSummary = async () => {
  try {
    console.log("📊 Fetching transaction summary...");
    const res = await api.get("/api/transactions/summary");
    const data = res.data || {};
    console.log("✅ Transaction summary fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch transaction summary:", error);
    return {};
  }
};

// ===== Budget Goals =====
export const getBudgetGoals = async () => {
  try {
    console.log("🎯 Fetching budget goals...");
    const res = await api.get("/api/category-budget");
    const data = res.data || { categoryGoals: [] };
    console.log("✅ Budget goals fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch budget goals:", error);
    return { categoryGoals: [] };
  }
};

export const setBudgetGoals = async (data) => {
  try {
    console.log("💾 Setting budget goals:", data);
    const response = await api.post("/api/category-budget", data);
    console.log("✅ Budget goals set successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to set budget goals:", error);
    throw error;
  }
};

export const deleteBudgetGoal = async (category) => {
  try {
    console.log("🗑️ Deleting budget goal for category:", category);
    const response = await api.delete(`/api/budget/${category}`);
    console.log("✅ Budget goal deleted successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to delete budget goal:", error);
    throw error;
  }
};

// ===== Debts =====
export const getDebts = async () => {
  try {
    console.log("💳 Fetching debts...");
    const res = await api.get("/api/debt");
    const data = Array.isArray(res.data) ? res.data : res.data?.debts || [];
    console.log("✅ Debts fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch debts:", error);
    return [];
  }
};

export const createDebt = async (data) => {
  try {
    console.log("➕ Creating debt:", data);
    const response = await api.post("/api/debt", data);
    console.log("✅ Debt created successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to create debt:", error);
    throw error;
  }
};

export const deleteDebt = async (id) => {
  try {
    console.log("🗑️ Deleting debt:", id);
    const response = await api.delete(`/api/debt/${id}`);
    console.log("✅ Debt deleted successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to delete debt:", error);
    throw error;
  }
};

// ===== Reminders =====
export const getReminders = async () => {
  try {
    console.log("⏰ Fetching reminders...");
    const res = await api.get("/api/reminder");
    const data = Array.isArray(res.data) ? res.data : res.data?.reminders || [];
    console.log("✅ Reminders fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch reminders:", error);
    return [];
  }
};

export const createReminder = async (data) => {
  try {
    console.log("➕ Creating reminder:", data);
    const response = await api.post("/api/reminder/create", data);
    console.log("✅ Reminder created successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to create reminder:", error);
    throw error;
  }
};

export const deleteReminder = async (id) => {
  try {
    console.log("🗑️ Deleting reminder:", id);
    const response = await api.delete(`/api/reminder/${id}`);
    console.log("✅ Reminder deleted successfully");
    return response;
  } catch (error) {
    console.error("❌ Failed to delete reminder:", error);
    throw error;
  }
};

// ===== Summary =====
export const getSummary = async () => {
  try {
    console.log("📈 Fetching summary...");
    const res = await api.get("/api/summary");
    const data = res.data || {
      totalIncome: 0,
      totalExpenses: 0,
      totalBudget: 0,
      netWorth: 0
    };
    console.log("✅ Summary fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch summary:", error);
    // Return default structure to prevent crashes
    return {
      totalIncome: 0,
      totalExpenses: 0,
      totalBudget: 0,
      netWorth: 0
    };
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    console.log("🏥 Performing health check...");
    const response = await api.get("/health");
    console.log("✅ Server is healthy");
    return response;
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return null;
  }
};

// Test API connectivity
export const testConnection = async () => {
  try {
    console.log("🧪 Testing API connection...");
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log("✅ API connection successful");
    return true;
  } catch (error) {
    console.error("❌ API connection failed:", error);
    return false;
  }
};

// Legacy aliases for backward compatibility
export const getSummaryData = getSummary;
export const getDashboardData = getSummary;

export default api;