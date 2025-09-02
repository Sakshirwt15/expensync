import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ totalIncome, totalExpense }) => {
  const hasData = totalIncome > 0 || totalExpense > 0;

  const data = {
    labels: hasData ? ["Income", "Expense"] : ["Add Data", "Get Started"],
    datasets: [
      {
        data: hasData ? [totalIncome, totalExpense] : [3, 2],
        backgroundColor: hasData
          ? ["#10B981", "#F59E0B"]
          : ["#6366F1", "#8B5CF6"],
        borderWidth: 3,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#64748b" },
      },
      tooltip: { enabled: hasData },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full h-full flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">
        💰 Income vs Expense
      </h2>

      {!hasData && (
        <div className="text-center mb-4">
          <p className="text-slate-500 dark:text-slate-400">
            Ready to track your finances?
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Add your first transaction to see beautiful charts!
          </p>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="w-60 h-60 sm:w-72 sm:h-72">
          <Pie data={data} options={options} />
        </div>
      </div>

      {hasData && (
        <div className="mt-4 text-center space-y-1 min-h-[60px] flex flex-col justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Income:{" "}
            <span className="font-semibold text-green-600">
              ${totalIncome.toLocaleString()}
            </span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Expenses:{" "}
            <span className="font-semibold text-red-600">
              ${totalExpense.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
