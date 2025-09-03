const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch transactions for user
    const transactions = await Transaction.find({ user: userId });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    // Get budgets
    const budgets = await Budget.find({ user: userId });
    const categoryGoals = await CategoryBudgetGoal.find({ user: userId });

    res.json({
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      budgets,
      categoryGoals,
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ message: "Server error fetching summary" });
  }
};

module.exports = { getSummary };
