import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseCategoryChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full h-full flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">
          📊 Spending by Category
        </h2>
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <p className="text-slate-500 dark:text-slate-400 text-center">
            Add your first transaction to see category breakdown!
          </p>
        </div>
        <div className="min-h-[60px]"></div> {/* Spacer for alignment */}
      </div>
    );
  }

  // ✅ Group transactions by category (only expenses)
  // LINE 18-24: Update the category totals calculation
  const categoryTotals = transactions.reduce((acc, t) => {
    // ✅ Check both type field and negative amounts
    if (t.type === "expense" || (t.amount < 0 && t.type !== "income")) {
      const category = t.category || "Other";
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#F87171",
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#A78BFA",
          "#F472B6",
        ],
        borderWidth: 3,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "bottom", labels: { color: "#64748b" } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full h-full flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">
        📊 Spending by Category
      </h2>
      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="w-60 h-60 sm:w-72 sm:h-72">
          <Pie data={data} options={options} />
        </div>
      </div>
      <div className="min-h-[60px]"></div> {/* Spacer for alignment */}
    </div>
  );
};

export default ExpenseCategoryChart;
