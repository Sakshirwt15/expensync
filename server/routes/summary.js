const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/summaryController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getSummary);

module.exports = router;
