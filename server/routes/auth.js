const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const router = express.Router();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // No password needed for Google OAuth users
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback - UPDATED FOR VERCEL
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // ✅ UPDATED: Dynamic frontend URL based on environment
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? 'https://expensync-eta.vercel.app'  // Your Vercel URL
        : 'http://localhost:5173';           // Development URL

      console.log(`🔗 Redirecting to: ${frontendURL}/dashboard?token=${token}`);
      
      // Redirect to frontend dashboard with token
      res.redirect(`${frontendURL}/dashboard?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      
      // ✅ UPDATED: Same dynamic URL for error redirect
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? 'https://expensync-eta.vercel.app' 
        : 'http://localhost:5173';
      
      res.redirect(`${frontendURL}/login?error=auth_failed`);
    }
  }
);

// Register User
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please provide all required fields." });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Respond with success and token
        res.status(201).json({ msg: "User registered successfully!", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide both email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // Compare password (only if user has a password - Google users might not)
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
        } else {
            return res.status(400).json({ msg: "Please login with Google" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Respond with token
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;