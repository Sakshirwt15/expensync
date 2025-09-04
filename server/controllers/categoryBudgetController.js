const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");

// Create or Update multiple category goals
const setCategoryGoal = async (req, res) => {
  try {
    const { categoryGoals } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(categoryGoals)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    for (let goalData of categoryGoals) {
      const { category, goal } = goalData;
      if (!category || goal === undefined) {
        return res.status(400).json({ message: "Category and goal are required" });
      }

      await CategoryBudgetGoal.findOneAndUpdate(
        { userId: userId, category },

        { goal, userId: userId },

        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Category goals updated successfully" });
  } catch (err) {
    console.error("❌ Error setting goal:", err);
    res.status(500).json({ message: "Error setting goal" });
  }
};

// Get all category goals
const getCategoryGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryGoals = await CategoryBudgetGoal.find({ userId: userId });

    res.status(200).json({
      categoryGoals: categoryGoals.map(goal => ({
        category: goal.category,
        goal: goal.goal,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching goals:", err);
    res.status(500).json({ message: "Error fetching category goals" });
  }
};

module.exports = {
  setCategoryGoal,
  getCategoryGoals,
};
