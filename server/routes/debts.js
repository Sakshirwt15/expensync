const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const debtController = require("../controllers/debtController");

router.post("/", authMiddleware, debtController.createDebt);
router.get("/", authMiddleware, debtController.getDebts);
router.delete("/:id", authMiddleware, debtController.deleteDebt);

module.exports = router;
