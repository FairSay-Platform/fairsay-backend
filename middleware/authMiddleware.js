const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    
    }

    // Expected Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;
    console.log("User role in middleware:", req.user.role);

    next(); // Continue to route

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


module.exports = verifyToken;
