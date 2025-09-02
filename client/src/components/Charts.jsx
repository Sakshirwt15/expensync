import React, { useEffect, useState } from "react";
import ExpenseChart from "./ExpenseChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import Layout from "./Layout";
import axios from "axios";
import { motion } from "framer-motion";

const Charts = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

  // Sample data for testing
  const sampleTransactions = [
    {
      id: 1,
      title: "Salary",
      amount: 5000,
      type: "income",
      category: "Salary",
    },
    {
      id: 2,
      title: "Freelance",
      amount: 1500,
      type: "income",
      category: "Freelance",
    },
    {
      id: 3,
      title: "Groceries",
      amount: -300,
      type: "expense",
      category: "Food",
    },
    {
      id: 4,
      title: "Rent",
      amount: -1200,
      type: "expense",
      category: "Housing",
    },
    {
      id: 5,
      title: "Gas",
      amount: -80,
      type: "expense",
      category: "Transportation",
    },
    { id: 6, title: "Coffee", amount: -25, type: "expense", category: "Food" },
    {
      id: 7,
      title: "Netflix",
      amount: -15,
      type: "expense",
      category: "Entertainment",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        console.log("🔑 Token exists:", !!token);

        if (!token) {
          throw new Error("No authentication token found. Please login.");
        }

        console.log(
          "🔄 Fetching data from:",
          "http://localhost:5000/api/transactions"
        );

        const res = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        const data = res.data;
        console.log("✅ Raw response:", res);
        console.log("✅ Transactions fetched:", data);
        console.log("✅ Number of transactions:", data.length);

        // If no real data, use sample data for demonstration
        let transactionsToUse = data;
        let isSample = false;

        if (data.length === 0) {
          transactionsToUse = sampleTransactions;
          isSample = true;
          console.log("📊 Using sample data for demonstration");
        }

        setTransactions(transactionsToUse);
        setUsingSampleData(isSample);

        // Calculate totals - handle both real data (with type field) and amount-based
        const income = transactionsToUse
          .filter((t) => t.type === "income" || t.amount > 0)
          .reduce((acc, t) => acc + Math.abs(t.amount), 0);

        const expense = transactionsToUse
          .filter((t) => t.type === "expense" || t.amount < 0)
          .reduce((acc, t) => acc + Math.abs(t.amount), 0);

        console.log("💰 Total Income:", income);
        console.log("💸 Total Expense:", expense);

        setTotalIncome(income);
        setTotalExpense(expense);
      } catch (err) {
        console.error("❌ Full error object:", err);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error response:", err.response?.data);
        console.error("❌ Error status:", err.response?.status);

        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading your financial data...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-6 sm:p-10 space-y-10">
        {/* Debug Info */}
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Debug Info:
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>
              • Total Transactions: {transactions.length}{" "}
              {usingSampleData ? "(Sample)" : "(Real)"}
            </p>
            <p>• Total Income: ${totalIncome}</p>
            <p>• Total Expenses: ${totalExpense}</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1E2A45] dark:text-white drop-shadow">
            Financial Dashboard
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
            A visual glance at your income and spending patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="h-full"
          >
            <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">
              Income vs Expense
            </h3>
            <div className="h-[500px]">
              <ExpenseChart
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-full"
          >
            <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">
              Spending by Category
            </h3>
            <div className="h-[500px]">
              <ExpenseCategoryChart transactions={transactions} />
            </div>
          </motion.div>
        </div>

        {/* Add Transaction Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/add")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Add Your First Transaction
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Charts;
