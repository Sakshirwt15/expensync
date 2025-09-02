const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Middlewares
// ========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expensync-eta.vercel.app", // ✅ Ye tumhara Vercel URL
    ],
    credentials: true,
  })
);
app.use(express.json());

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from React build (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
}

// ========================
// Test Route
// ========================
app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  } else {
    res.send("API running 🎯");
  }
});

// ========================
// MongoDB Connection
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ========================
// API Routes
// ========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/budgets", require("./routes/budgets"));
app.use("/api/category-goals", require("./routes/categoryBudgetRoutes"));
app.use("/api/debts", require("./routes/debts"));
app.use("/api/summary", require("./routes/summary"));
app.use("/api/reminders", require("./routes/reminders"));

// ========================
// NEW Dashboard Route
// ========================
app.get("/api/dashboard", (req, res) => {
  try {
    res.json({
      message: "✅ Dashboard data fetched successfully",
      stats: {
        totalIncome: 12000, // dummy data for now
        totalExpenses: 7500,
        savings: 4500,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching dashboard" });
  }
});

// ========================
// Handle React routing (Production)
// ========================
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
