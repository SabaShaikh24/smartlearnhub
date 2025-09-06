// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Accept token in header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

    // Support "Bearer <token>" or just the token string
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    // Verify token (will throw if invalid/expired)
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload (userId, role) to request
    req.user = decoded;
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
