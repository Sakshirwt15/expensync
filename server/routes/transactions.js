const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const transactionController = require("../controllers/transactionController");

// ✅ Create a new transaction (protected)
router.post("/create", authMiddleware, transactionController.createTransaction);

// ✅ Get all transactions for the logged-in user (protected)
router.get("/", authMiddleware, transactionController.getTransactions);

// ✅ Get transactions by user ID (protected) 
// 👉 currently same as "/", since req.user.id is used
router.get("/user", authMiddleware, transactionController.getTransactions);

// ✅ Get transaction summary by user ID (protected)
router.get("/summary", authMiddleware, transactionController.getTransactionSummary);

module.exports = router;
