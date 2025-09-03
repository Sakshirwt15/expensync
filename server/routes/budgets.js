const express = require("express");
const router = express.Router();
const {
  setCategoryGoal,
  getCategoryGoals,
  deleteCategoryGoal,
} = require("../controllers/budgetController");
const authMiddleware = require("../middleware/auth");

// Create / update budget goal
router.post("/set", authMiddleware, setCategoryGoal);

// Get all budget goals
router.get("/", authMiddleware, getCategoryGoals);

// Delete budget goal by category
router.delete("/:category", authMiddleware, deleteCategoryGoal);

module.exports = router;
