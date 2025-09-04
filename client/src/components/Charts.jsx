import React, { useEffect, useState } from "react";
import ExpenseChart from "./ExpenseChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import Layout from "./Layout";
import { motion } from "framer-motion";
import { getTransactions, getSummary } from "../api/api"; // ✅ removed getDashboardData

const Charts = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch transactions
        const transactionsData = await getTransactions();
        setTransactions(transactionsData);

        // ✅ Calculate totals
        let income = 0,
          expense = 0;
        // LINE 21-29: Fix the data calculation logic
        transactionsData.forEach((t) => {
          if (t.type === "income" || (t.amount > 0 && t.type !== "expense")) {
            income += Math.abs(t.amount);
          } else if (
            t.type === "expense" ||
            (t.amount < 0 && t.type !== "income")
          ) {
            expense += Math.abs(t.amount);
          }
        });
        setTotalIncome(income);
        setTotalExpense(expense);

        // ✅ Fetch summary instead of dashboard
        const summaryData = await getSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <motion.div
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Income vs Expense */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
          <ExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} />
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
          <ExpenseCategoryChart transactions={transactions} />
        </div>
      </motion.div>
    </Layout>
  );
};

export default Charts;
