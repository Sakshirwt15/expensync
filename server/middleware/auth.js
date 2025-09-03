const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided. Authorization denied." });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
