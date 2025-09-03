const express = require("express");
const router = express.Router();
const { getBudgetSummary } = require("../controllers/summaryController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getBudgetSummary);

module.exports = router;
