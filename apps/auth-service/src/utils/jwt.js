import jwt from 'jsonwebtoken';

const SECRET_KEY = 'mcloud-local-secret-key';

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
