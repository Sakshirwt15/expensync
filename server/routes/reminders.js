const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const reminderController = require("../controllers/reminderController");

router.post("/create", authMiddleware, reminderController.createReminder);
router.get("/", authMiddleware, reminderController.getReminders);
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

module.exports = router;
