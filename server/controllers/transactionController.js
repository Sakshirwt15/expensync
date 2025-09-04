const Transaction = require("../models/Transaction");

// @desc Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, note, tags, date } = req.body;
    const userId = req.user.id;

    // ✅ FIXED: Match the frontend AddTransaction component fields
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = new Transaction({
      userId: userId,  // ✅ FIXED: Use 'userId' instead of 'user'
      title,           // ✅ FIXED: Use 'title' instead of 'type'
      amount,
      category,
      note,            // ✅ FIXED: Use 'note' instead of 'description'
      tags: tags || [], // ✅ FIXED: Include tags
      date: date || new Date(),
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    res.status(500).json({ message: "Server error creating transaction" });
  }
};

// @desc Get all transactions
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ FIXED: Use 'userId' instead of 'user'
    const transactions = await Transaction.find({ userId: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};

// @desc Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // ✅ FIXED: Use 'userId' instead of 'user'
    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted", deletedId: id });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({ message: "Server error deleting transaction" });
  }
};

// @desc Get transaction summary (category-wise total)
const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIXED: Use 'userId' instead of 'user'
    const summary = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ message: "Server error fetching summary" });
  }
};

module.exports = { 
  createTransaction, 
  getTransactions, 
  deleteTransaction, 
  getTransactionSummary 
};