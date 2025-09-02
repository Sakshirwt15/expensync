const Transaction = require("../models/Transaction");

// ✅ Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    // Debug logs to help with troubleshooting
    console.log("🔍 Creating transaction - User ID:", req.user.id);
    console.log("🔍 Request body:", req.body);

    const { title, amount, category, note, tags, date } = req.body;
    const userId = req.user.id; // Now works correctly with updated auth middleware

    // Validate required fields
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        required: ["title", "amount", "category"] 
      });
    }

    const newTransaction = new Transaction({
      title,
      amount,
      category,
      note: note || "", // Default to empty string if not provided
      tags: tags || [], // Default to empty array if not provided
      date: date || new Date(), // Default to current date if not provided
      userId,
    });

    const savedTransaction = await newTransaction.save();
        
    // ✅ Add type field based on amount
    const transactionWithType = {
      ...savedTransaction.toObject(),
      type: savedTransaction.amount >= 0 ? 'income' : 'expense'
    };
        
    console.log("✅ Transaction created successfully:", savedTransaction._id);
    res.status(201).json(transactionWithType);
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Fetching transactions for user:", userId);
    
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        
    // ✅ Add type field to each transaction based on amount
    const transactionsWithType = transactions.map(txn => ({
      ...txn.toObject(),
      type: txn.amount >= 0 ? 'income' : 'expense'
    }));
        
    console.log(`✅ Found ${transactionsWithType.length} transactions`);
        
    res.status(200).json(transactionsWithType);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get transaction summary for the logged-in user
exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Fetching transaction summary for user:", userId);
    
    const transactions = await Transaction.find({ userId });

    const summary = transactions.reduce(
      (acc, txn) => {
        if (txn.amount >= 0) {
          acc.income += txn.amount;
        } else {
          acc.expense += Math.abs(txn.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    // Add balance calculation
    summary.balance = summary.income - summary.expense;
    
    console.log("✅ Transaction summary:", summary);
    res.status(200).json(summary);
  } catch (error) {
    console.error("❌ Error fetching summary:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};