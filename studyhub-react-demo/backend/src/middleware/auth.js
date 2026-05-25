import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responses.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

export const generateToken = (payload, opts = {}) => jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || '7d' });

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const parts = String(authHeader).split(' ').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    sendError(res, 401, 'Missing or invalid Authorization header');
    return;
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    sendError(res, 401, 'Invalid or expired token');
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    sendError(res, 401, 'Not authenticated');
    return;
  }
  if (roles.length > 0 && !roles.includes(req.user.role)) {
    sendError(res, 403, 'Insufficient role');
    return;
  }
  next();
};

export default { generateToken, authenticate, authorize };
