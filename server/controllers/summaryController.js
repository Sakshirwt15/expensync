const Transaction = require("../models/Transaction");
const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIXED: Use 'userId' instead of 'user' for Transaction model
    const transactions = await Transaction.find({ userId: userId });


    // ✅ FIXED: Calculate based on amount values (positive = income, negative = expense)
    const totalIncome = transactions
      .filter(t => t.amount > 0)  // Positive amounts are income
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = Math.abs(transactions
      .filter(t => t.amount < 0)  // Negative amounts are expenses
      .reduce((acc, t) => acc + t.amount, 0)); // Make positive for display

    // ✅ Keep 'user' field for Budget and CategoryBudgetGoal (they use 'user')
    const categoryGoals = await CategoryBudgetGoal.find({ userId: userId });


    res.json({
  totalIncome,
  totalExpense,
  savings: totalIncome - totalExpense,
  categoryGoals,
});
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ message: "Server error fetching summary" });
  }
};

module.exports = { getSummary };