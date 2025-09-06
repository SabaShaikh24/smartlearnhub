import jwt from "jsonwebtoken";
import User from '../models/User.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Token is usually sent as: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  try {
    // Verify token
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next(); // continue to protected route
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  
};



export default authMiddleware;
