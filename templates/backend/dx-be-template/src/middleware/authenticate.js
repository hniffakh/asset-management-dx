
import { verifyToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

/**
 * Middleware: Memverifikasi JWT dari Authorization Header.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek keberadaan Authorization Header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Token autentikasi tidak ditemukan"
      );
    }

    // Ambil token setelah prefix Bearer
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError(
        "Token autentikasi tidak ditemukan"
      );
    }

    // Verifikasi JWT
    const decoded = verifyToken(token);

    // Simpan identitas user ke request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Token tidak valid atau expired
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return next(
        new UnauthorizedError("Token tidak valid atau sudah kedaluwarsa")
      );
    }

    next(error);
  }
};
