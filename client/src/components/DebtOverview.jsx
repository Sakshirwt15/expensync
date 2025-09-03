import React, { useEffect, useState } from "react";
// ✅ Import centralized API functions instead of mixing api and getDebts
import { getDebts, deleteDebt } from "../api/api";
import AddDebtForm from "./AddDebtForm";

const DebtOverview = ({ debts: propDebts }) => {
  const [debts, setDebts] = useState(propDebts || []);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Only fetch debts if not passed as props
  useEffect(() => {
    if (!propDebts) {
      fetchDebts();
    } else {
      setDebts(propDebts);
    }
  }, [propDebts]);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const data = await getDebts();
      setDebts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError("Failed to load debts");
    } finally {
      setLoading(false);
    }
  };

  const totalDebt = debts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleDebtAdded = (newDebt) => {
    setDebts((prevDebts) => [...prevDebts, newDebt]);
    setShowForm(false); // Close form after adding
  };

  const handleDelete = async (id) => {
    try {
      // ✅ Use the centralized deleteDebt function
      await deleteDebt(id);
      setDebts((prevDebts) => prevDebts.filter((debt) => debt._id !== id));
    } catch (error) {
      console.error("Error deleting debt:", error);
      setError("Failed to delete debt");
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h4 className="text-lg font-semibold mb-4">Debt Overview</h4>
        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow border dark:border-slate-700">
          <p className="text-center text-gray-500">Loading debts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold mb-4">Debt Overview</h4>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
          <button
            onClick={fetchDebts}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-red-50 dark:bg-slate-800 p-4 rounded-xl shadow border dark:border-slate-700">
        <p className="text-lg font-bold text-red-500 mb-4">
          Total Debt: ₹{totalDebt.toLocaleString()}
        </p>

        {debts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No debts recorded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {debts.map((debt) => (
              <li
                key={debt._id}
                className="flex justify-between items-center bg-white dark:bg-slate-700 px-4 py-2 rounded shadow"
              >
                <div>
                  <p className="font-medium">{debt.name || "Unnamed Debt"}</p>
                  <p className="text-red-600 text-sm">
                    ₹{(debt.amount || 0).toLocaleString()}
                  </p>
                  {debt.description && (
                    <p className="text-xs text-gray-500">{debt.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(debt._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-colors"
                  title="Delete debt"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-xl transition-colors"
        >
          {showForm ? "Cancel" : "Add Debt"}
        </button>

        {showForm && (
          <div className="mt-4">
            <AddDebtForm
              onDebtAdded={handleDebtAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtOverview;
