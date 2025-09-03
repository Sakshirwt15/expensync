const express = require("express");
const router = express.Router();
const { setCategoryGoal, getCategoryGoals } = require("../controllers/categoryBudgetController");
const authMiddleware = require("../middleware/auth");

// Set category-specific budget
router.post("/", authMiddleware, setCategoryGoal);

// Get category-specific budgets
router.get("/", authMiddleware, getCategoryGoals);

module.exports = router;
