const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://expensync-eta.vercel.app"], credentials: true }));

// Express session (required for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/budget", require("./routes/budgets")); // fixed
app.use("/api/category-budget", require("./routes/categoryBudgetRoutes")); // fixed
app.use("/api/debt", require("./routes/debts")); // fixed
app.use("/api/reminder", require("./routes/reminders")); // fixed
app.use("/api/summary", require("./routes/summary"));
app.use("/api/transactions", require("./routes/transactions")); // fixed

// Default route
app.get("/", (req, res) => {
  res.send("🚀 ExpenseSync API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
