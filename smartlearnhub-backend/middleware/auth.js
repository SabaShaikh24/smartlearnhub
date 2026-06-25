// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

    
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

   
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
