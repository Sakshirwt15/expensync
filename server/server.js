const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Add this for production session store
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
      "https://expensync-eta.vercel.app", // ✅ Your Vercel URL
    ],
    credentials: true,
  })
);
app.use(express.json());

// Session middleware with production-ready store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ========================
// API Test Route
// ========================
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ ExpenseSync API is running!", 
    status: "healthy",
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
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
// Dashboard Route
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
// 404 Handler for undefined API routes
// ========================
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// ========================
// Global Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});