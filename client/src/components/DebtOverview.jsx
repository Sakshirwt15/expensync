import React, { useEffect, useState } from "react";
import api, { getDebts } from "../api/api";
import AddDebtForm from "./AddDebtForm";

const DebtOverview = () => {
  const [debts, setDebts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts();
        setDebts(data);
      } catch (err) {
        console.error("Error fetching debts:", err);
      }
    };
    fetchDebts();
  }, []);

  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDebtAdded = (newDebt) => {
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/debts/${id}`);
      setDebts((prevDebts) => prevDebts.filter((debt) => debt._id !== id));
    } catch (error) {
      console.error("Error deleting debt:", error);
    }
  };

  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold mb-4">Debt Overview</h4>
      <div className="bg-red-50 dark:bg-slate-800 p-4 rounded-xl shadow border dark:border-slate-700">
        <p className="text-lg font-bold text-red-500 mb-4">
          Total Debt: ₹{totalDebt.toLocaleString()}
        </p>
        <ul className="space-y-2">
          {debts.map((debt) => (
            <li
              key={debt._id}
              className="flex justify-between items-center bg-white dark:bg-slate-700 px-4 py-2 rounded shadow"
            >
              <div>
                <p className="font-medium">{debt.name}</p>
                <p className="text-red-600 text-sm">
                  ₹{debt.amount.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(debt._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-xl transition"
        >
          {showForm ? "✖️ Cancel" : "➕ Add Debt"}
        </button>

        {showForm && <AddDebtForm onDebtAdded={handleDebtAdded} />}
      </div>
    </div>
  );
};

export default DebtOverview;
