import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET || 'mcloud-local-secret-key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
