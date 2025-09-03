const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = new Transaction({
      user: userId,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    res.status(500).json({ message: "Server error creating transaction" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Transaction.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted", deletedId: id });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({ message: "Server error deleting transaction" });
  }
};

module.exports = { createTransaction, getTransactions, deleteTransaction };
