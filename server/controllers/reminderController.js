const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");
const Transaction = require("../models/Transaction");
// Add Reminder model if you have one, or create reminder logic

// Get Budget Summary for the user
const getBudgetSummary = async (req, res) => {
    try {
        // ✅ FIX: Use req.user.id instead of req.user
        const userId = req.user.id;
        console.log("🔍 Fetching summary for user:", userId);

        // ✅ FIX: CategoryBudgetGoal uses 'user' field, not 'userId'
        const goals = await CategoryBudgetGoal.find({ user: userId });
        console.log("📊 Found goals:", goals.length);

        // Calculate Total Budget (sum of all category goals)
        const totalBudget = goals.reduce((acc, goal) => acc + goal.goal, 0);

        // ✅ FIX: Transaction uses 'userId' field
        const transactions = await Transaction.find({ userId: userId });
        console.log("💰 Found transactions:", transactions.length);

        // Calculate Total Expenses (sum of all expense transactions)
        const totalExpenses = transactions
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);

        const totalIncome = transactions
            .filter((transaction) => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        // Calculate Savings (Total Budget - Total Expenses)
        const savings = totalBudget - totalExpenses;

        console.log("📈 Summary calculated:", {
            totalIncome,
            totalExpenses,
            totalBudget,
            savings
        });

        // Respond with the summary data
        res.status(200).json({
            totalIncome,
            totalExpenses,
            totalBudget,
            savings,
        });
    } catch (error) {
        console.error("❌ Error fetching budget summary:", error);
        res.status(500).json({ message: "Error fetching summary", error: error.message });
    }
};

// CREATE REMINDER - Add this function
const createReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, dueDate, category } = req.body;
        
        // You'll need to create a Reminder model or modify an existing one
        // For now, I'll provide a basic structure
        
        // If you have a Reminder model:
        // const Reminder = require("../models/Reminder");
        // const newReminder = new Reminder({
        //     userId,
        //     title,
        //     description,
        //     dueDate,
        //     category
        // });
        // const savedReminder = await newReminder.save();
        
        // Temporary response until you create the Reminder model
        res.status(201).json({
            message: "Reminder created successfully",
            reminder: {
                id: Date.now(), // temporary ID
                userId,
                title,
                description,
                dueDate,
                category,
                createdAt: new Date()
            }
        });
    } catch (error) {
        console.error("❌ Error creating reminder:", error);
        res.status(500).json({ message: "Error creating reminder", error: error.message });
    }
};

// GET REMINDERS - Add this function
const getReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // If you have a Reminder model:
        // const reminders = await Reminder.find({ userId });
        
        // Temporary response until you create the Reminder model
        res.status(200).json({
            message: "Reminders fetched successfully",
            reminders: [] // Return empty array for now
        });
    } catch (error) {
        console.error("❌ Error fetching reminders:", error);
        res.status(500).json({ message: "Error fetching reminders", error: error.message });
    }
};

// DELETE REMINDER - Add this function
const deleteReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        // If you have a Reminder model:
        // const deletedReminder = await Reminder.findOneAndDelete({ 
        //     _id: id, 
        //     userId: userId 
        // });
        // 
        // if (!deletedReminder) {
        //     return res.status(404).json({ message: "Reminder not found" });
        // }
        
        // Temporary response until you create the Reminder model
        res.status(200).json({
            message: "Reminder deleted successfully",
            deletedId: id
        });
    } catch (error) {
        console.error("❌ Error deleting reminder:", error);
        res.status(500).json({ message: "Error deleting reminder", error: error.message });
    }
};

// Export all functions including the new reminder functions
module.exports = {
    getBudgetSummary,
    createReminder,
    getReminders,
    deleteReminder
};