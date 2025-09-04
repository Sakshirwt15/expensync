import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AddTransaction from "./AddTransaction";
import ExpenseChart from "./ExpenseChart";
import BudgetGoalProgress from "./BudgetGoalProgress";
import DebtOverview from "./DebtOverview";
import NetWorthCard from "./NetWorthCard";
import Layout from "./Layout";
// ✅ Import centralized API functions
import {
  getTransactions,
  getBudgetGoals,
  getDebts,
  getSummaryData, // ✅ fixed name
} from "../api/api";

const Dashboard = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalBalance = totalIncome - totalExpense;
  const budgetUsed = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  // ✅ Decode token (from URL or localStorage)
  useEffect(() => {
    let token = null;
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      token = urlToken;
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      token = localStorage.getItem("token");
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid session. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      setError("No authentication found. Please log in.");
      window.location.href = "/login";
    }
  }, [location]);

  // ✅ Fetch all dashboard data using centralized API functions
  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const [summaryRes, transactionsRes, budgetRes, debtsRes] =
        await Promise.all([
          getSummary(), // Use getSummary instead of getSummaryData // ✅ fixed call
          getTransactions(),
          getBudgetGoals(),
          getDebts(),
        ]);

      // ✅ Handle summary response
      if (summaryRes?.data) {
        setTotalIncome(summaryRes.data.totalIncome || 0);
        setTotalExpense(summaryRes.data.totalExpenses || 0);
      }

      // ✅ Handle transactions response
      setTransactions(
        Array.isArray(transactionsRes?.data) ? transactionsRes.data : []
      );

      // ✅ Handle budget goals response
      setBudgetGoals(
        Array.isArray(budgetRes?.data?.categoryGoals)
          ? budgetRes.data.categoryGoals
          : []
      );

      // ✅ Handle debts response
      setDebts(Array.isArray(debtsRes?.data) ? debtsRes.data : []);
    } catch (err) {
      console.error("Data fetch error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        setError("Failed to load data. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId, fetchData]);

  // ✅ Calculate spent per category
  const calculateSpentPerCategory = useCallback((transactions) => {
    return transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
  }, []);

  const budgetGoalsWithSpent = budgetGoals.map((goal) => {
    const spentPerCategory = calculateSpentPerCategory(transactions);
    return { ...goal, spent: spentPerCategory[goal.category] || 0 };
  });

  const handleTransactionSuccess = useCallback(() => {
    setShowModal(false);
    fetchData();
  }, [fetchData]);

  // ✅ Loading
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </Layout>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Error</p>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ✅ Keeping your existing UI unchanged */}
      <div
        className={`p-8 transition-all duration-500 ${
          showModal ? "blur-sm pointer-events-none" : ""
        } bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e]
        text-slate-800 dark:text-white rounded-3xl shadow-xl`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-extrabold">Your Financial Overview</h2>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              title: "Total Balance",
              amount: totalBalance,
              icon: <Wallet className="w-8 h-8 text-green-500" />,
              textColor: totalBalance >= 0 ? "text-green-600" : "text-red-500",
            },
            {
              title: "Total Income",
              amount: totalIncome,
              icon: <ArrowUpRight className="w-8 h-8 text-blue-600" />,
              textColor: "text-blue-600",
            },
            {
              title: "Total Expense",
              amount: totalExpense,
              icon: <ArrowDownRight className="w-8 h-8 text-red-500" />,
              textColor: "text-red-500",
            },
          ].map(({ title, amount, icon, textColor }, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-tr from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                {icon}
              </div>
              <p className={`text-3xl font-bold ${textColor}`}>
                ₹{(amount || 0).toLocaleString()}
              </p>
            </div>
          ))}
          <NetWorthCard income={totalIncome} expense={totalExpense} />
        </div>

        {/* Budget Progress */}
        <div className="mt-16">
          <h4 className="text-xl font-semibold mb-4">Monthly Budget Usage</h4>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4"
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            ₹{totalExpense.toLocaleString()} spent out of ₹
            {totalIncome.toLocaleString()} ({budgetUsed.toFixed(1)}%)
          </p>
        </div>

        {/* Budget & Chart */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BudgetGoalProgress goals={budgetGoalsWithSpent} />
          <ExpenseChart
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            transactions={transactions}
          />
        </div>

        {/* Recent Transactions */}
        <div className="mt-16">
          <h4 className="text-xl font-semibold mb-6">Recent Transactions</h4>
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.slice(0, 3).map((tx, idx) => (
                <li
                  key={tx.id || idx}
                  className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-lg shadow-md"
                >
                  <div>
                    <span className="font-semibold">{tx.category}</span>
                    {tx.description && (
                      <p className="text-xs text-slate-500">{tx.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={
                        tx.amount > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      ₹{Math.abs(tx.amount || 0).toLocaleString()}
                    </span>
                    {tx.date && (
                      <p className="text-xs text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-center">No transactions yet.</p>
          )}
        </div>

        {/* Savings */}
        <div className="mt-16">
          <h4 className="text-xl font-semibold mb-4">Savings This Month</h4>
          <p
            className={`text-4xl font-extrabold ${
              totalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{totalBalance.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {totalBalance >= 0
              ? "Great job saving money!"
              : "Consider reducing expenses to improve savings."}
          </p>
        </div>

        {/* Debt */}
        <DebtOverview debts={debts} />
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-2xl"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Transaction Modal */}
      {showModal && userId && (
        <div
          className="fixed inset-0 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AddTransaction
              userId={userId}
              onSuccess={handleTransactionSuccess}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
