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

// ✅ Import API functions
import {
  getTransactions,
  getBudgetGoals,
  getDebts,
  getSummary, // ✅ use this directly
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

  // Decode token
  useEffect(() => {
    const urlToken = new URLSearchParams(location.search).get("token");
    const token = urlToken || localStorage.getItem("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // simple jwtDecode
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, [location]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const [summaryRes, transactionsRes, budgetRes, debtsRes] =
        await Promise.all([
          getSummary(),
          getTransactions(),
          getBudgetGoals(),
          getDebts(),
        ]);

      setTotalIncome(summaryRes?.totalIncome || 0);
      setTotalExpense(summaryRes?.totalExpense || 0);
      setTransactions(Array.isArray(transactionsRes) ? transactionsRes : []);
      setBudgetGoals(
        Array.isArray(budgetRes?.categoryGoals) ? budgetRes.categoryGoals : []
      );
      setDebts(Array.isArray(debtsRes) ? debtsRes : []);
    } catch (err) {
      console.error("Data fetch error:", err);
      setError("Failed to load data. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId, fetchData]);

  // Calculate spent per category
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

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return <Layout>{/* Dashboard UI remains the same */}</Layout>;
};

export default Dashboard;
