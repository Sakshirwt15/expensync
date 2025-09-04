const Reminder = require("../models/Reminder");

// CREATE REMINDER
const createReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category, date, isRecurring } = req.body;

    // ✅ FIXED: Match frontend form fields
    if (!title || !amount || !date) {
      return res.status(400).json({ message: "Title, amount and date are required" });
    }

    const newReminder = new Reminder({
      userId,
      title,
      amount: parseFloat(amount), // ✅ Ensure amount is number
      category: category || "Others",
      date, // ✅ Use 'date' instead of 'dueDate'
      isRecurring: isRecurring || false,
    });

    const savedReminder = await newReminder.save();

    res.status(201).json({
      message: "Reminder created successfully",
      reminder: savedReminder,
    });
  } catch (error) {
    console.error("❌ Error creating reminder:", error);
    res.status(500).json({ message: "Error creating reminder", error: error.message });
  }
};

// GET ALL REMINDERS
const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.find({ userId }).sort({ date: 1 });

    res.status(200).json({
      message: "Reminders fetched successfully",
      reminders,
    });
  } catch (error) {
    console.error("❌ Error fetching reminders:", error);
    res.status(500).json({ message: "Error fetching reminders", error: error.message });
  }
};

// DELETE REMINDER
const deleteReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedReminder = await Reminder.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("❌ Error deleting reminder:", error);
    res.status(500).json({ message: "Error deleting reminder", error: error.message });
  }
};

module.exports = {
  createReminder,
  getReminders,
  deleteReminder,
};