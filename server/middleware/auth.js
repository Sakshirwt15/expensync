const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    // Check if token exists and has proper format
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided. Authorization denied." });
    }

    try {
        // Extract and verify JWT token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        
        // ✅ FIX: Set req.user as an object with id property
        // This ensures req.user.id works in controllers
        req.user = { id: decoded.userId };
        
        next();
    } catch (err) {
        console.error("❌ JWT verification failed:", err.message);
        return res.status(401).json({ msg: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;