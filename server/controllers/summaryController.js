const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");
const Transaction = require("../models/Transaction");

// Get Budget Summary for the user
const getBudgetSummary = async (req, res) => {
    try {
        // Extract user ID from req.user object
        let userId;
        if (typeof req.user === 'string') {
            userId = req.user;
        } else if (req.user && req.user.id) {
            userId = req.user.id;
        } else if (req.user && req.user._id) {
            userId = req.user._id;
        } else {
            return res.status(401).json({ message: "Invalid user authentication data" });
        }
        
        // Add validation to ensure we have a valid user ID
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Fetch all category goals for the user
        const goals = await CategoryBudgetGoal.find({ user: userId });

        // Calculate Total Budget (sum of all category goals)
        const totalBudget = goals.reduce((acc, goal) => acc + goal.goal, 0);

        // Fetch all transactions (expenses and income) for the user
        const transactions = await Transaction.find({ userId: userId });

        // Calculate Total Expenses (sum of all expense transactions)
        const totalExpenses = transactions
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);

        const totalIncome = transactions
            .filter((transaction) => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        // Calculate Savings (Total Budget - Total Expenses)
        const savings = totalBudget - totalExpenses;

        // Respond with the summary data
        res.status(200).json({
            totalIncome,
            totalExpenses,
            totalBudget,
            savings,
        });
    } catch (error) {
        console.error("Error fetching budget summary:", error);
        res.status(500).json({ message: "Error fetching summary", error: error.message });
    }
};

module.exports = {
    getBudgetSummary,
};