const Transaction = require("../models/Transaction");

// @desc Create new transaction
const createTransaction = async (req, res) => {
  try {
    // ✅ FIXED: Get userId from the authenticated user
    const userId = req.user.id;
    const { title, amount, category, type, note, tags, date } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Additional validation
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'income' or 'expense'" });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const transaction = new Transaction({
      userId: userId,  // ✅ Now properly defined
      title,
      amount,
      category,
      type,
      note,
      tags: tags || [],
      date: date || new Date(),
    });

    const saved = await transaction.save();
    console.log("✅ Transaction created successfully:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    res.status(500).json({ 
      message: "Server error creating transaction",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc Get all transactions
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
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