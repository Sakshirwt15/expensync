import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api"; // Import the configured api instance

const TransactionReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Others",
    date: "",
    isRecurring: false,
  });

  // Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        console.log("Fetching reminders...");
        const res = await api.get("/reminders");

        // Ensure we always set an array
        const reminderData = Array.isArray(res.data)
          ? res.data
          : res.data?.reminders || [];
        setReminders(reminderData);
        console.log("✅ Reminders fetched successfully:", reminderData);
      } catch (err) {
        console.error("Error fetching reminders:", err);
        setError("Failed to load reminders. Please try again.");
        setReminders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.amount || !form.date) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      console.log("Creating reminder:", form);
      const res = await api.post("/reminders/create", form);
      setReminders((prev) => [...prev, res.data.reminder]);
      setForm({
        title: "",
        amount: "",
        category: "Others",
        date: "",
        isRecurring: false,
      });
      setShowForm(false);
      console.log("✅ Reminder created successfully:", res.data);
    } catch (err) {
      console.error("Error creating reminder:", err);
      alert(err.response?.data?.message || "Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting reminder:", id);
      await api.delete(`/reminders/${id}`);
      setReminders((prev) => prev.filter((r) => r._id !== id));
      console.log("✅ Reminder deleted successfully");
    } catch (err) {
      console.error("Error deleting reminder:", err);
      alert(err.response?.data?.message || "Failed to delete reminder");
    } finally {
      setLoading(false);
    }
  };

  const refreshReminders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reminders");
      const reminderData = Array.isArray(res.data)
        ? res.data
        : res.data?.reminders || [];
      setReminders(reminderData);
      setError(null);
    } catch (err) {
      console.error("Error refreshing reminders:", err);
      setError("Failed to refresh reminders");
      setReminders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-gradient-to-br from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          ⏰ Transaction Reminders
        </h3>
        <button
          onClick={refreshReminders}
          disabled={loading}
          className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
          <button
            onClick={refreshReminders}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {reminders.length === 0 && !loading ? (
        <div className="text-center text-slate-500 dark:text-slate-400">
          <div className="text-5xl animate-pulse mb-2">🕒</div>
          <p className="italic">No reminders yet. Add one below!</p>
        </div>
      ) : (
        <ul className="space-y-5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 dark:hover:scrollbar-thumb-purple-500 overflow-x-hidden">
          {Array.isArray(reminders) &&
            reminders.map((reminder) => (
              <li
                key={reminder._id}
                className="flex justify-between items-center bg-gradient-to-tr from-white/60 to-slate-100/60 dark:from-slate-800/60 dark:to-slate-700/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {reminder.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {reminder.category} •{" "}
                    {new Date(reminder.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600 dark:text-purple-400">
                    ₹{reminder.amount}
                  </p>
                  {reminder.isRecurring && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Recurring
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    disabled={loading}
                    className="text-xs text-red-500 hover:underline ml-4 disabled:opacity-50"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-xl transition disabled:opacity-50"
        >
          {showForm ? "✖️ Cancel" : "➕ Add Reminder"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAddReminder}
            className="space-y-4 mt-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Reminder Title"
                value={form.title}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Travel">Travel</option>
                <option value="Savings">Savings</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isRecurring"
                id="isRecurring"
                checked={form.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="isRecurring"
                className="text-slate-700 dark:text-slate-300"
              >
                Recurring Reminder
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-xl transition w-full disabled:opacity-50"
            >
              {loading ? "⏳ Saving..." : "✅ Save Reminder"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionReminders;
