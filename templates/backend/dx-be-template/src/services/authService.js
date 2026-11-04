import bcrypt from "bcryptjs";
import { findUserByUsername } from "../models/userModel.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { signToken } from "../utils/jwt.js";
import { AUTH_MESSAGES } from "../constants/authConstants.js";

/**
 * Service: Menangani business logic autentikasi
 * Tidak berurusan dengan HTTP req / res / status code.
 *
 * @param {object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @returns {Promise<{ token: string, user: { id: number, username: string, email: string } }>}
 */
export const loginService = async ({ username, password }) => {
  const user = await findUserByUsername(username);

  console.log("Username dicari:", username);
  console.log("User ditemukan:", !!user);

  if (!user) {
    throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  console.log("Password tersedia:", !!user.password);
  console.log("Password hash:", user.password?.substring(0, 7));

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Buat JWT token
  const token = signToken({
  id: user.id,
  username: user.username,
  role: user.role,
});

  return {
  token,
  user: {
    id: user.id,
    username: user.username,
    role: user.role,
    department: user.department,
  },
};
};
