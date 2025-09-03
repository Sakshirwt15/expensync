const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const transactionController = require("../controllers/transactionController");

router.post("/", authMiddleware, transactionController.createTransaction);
router.get("/", authMiddleware, transactionController.getTransactions);
router.get("/summary", authMiddleware, transactionController.getTransactionSummary);

module.exports = router;
