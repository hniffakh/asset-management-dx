import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Sign payload to JWT token
 * @param {object} payload
 * @returns {string}
 */
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
