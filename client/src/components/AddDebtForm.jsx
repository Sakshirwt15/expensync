import React, { useState } from "react";
import axios from "axios";

const AddDebtForm = ({ onDebtAdded }) => {
  const [debt, setDebt] = useState({
    name: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = `${
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  }/api/debts/create`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebt({ ...debt, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!debt.name || !debt.amount) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(debt.amount) || parseFloat(debt.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        API_URL,
        {
          name: debt.name.trim(),
          amount: parseFloat(debt.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onDebtAdded(response.data); // Pass new debt to parent
      setDebt({ name: "", amount: "" }); // Reset form
    } catch (err) {
      console.error("Error adding debt:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add debt. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 transition-all">
      <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        ➕ Add New Debt
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Debt Name (e.g., Credit Card)"
              value={debt.name}
              onChange={handleChange}
              required
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <input
              type="number"
              name="amount"
              placeholder="Amount ($)"
              value={debt.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-all w-full focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          disabled={loading || !debt.name.trim() || !debt.amount}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            "✅ Save Debt"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddDebtForm;
