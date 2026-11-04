/**
 * Immutable Authentication domain constants
 */
export const AUTH_MESSAGES = Object.freeze({
  LOGIN_SUCCESS: "Login berhasil",
  INVALID_CREDENTIALS: "Username atau password salah",
  VALIDATION_ERROR: "Validasi data gagal",
  USERNAME_REQUIRED: "Username wajib diisi",
  PASSWORD_REQUIRED: "Password wajib diisi",
  INTERNAL_ERROR: "Terjadi kesalahan pada server",
});

export const AUTH_ROLES = Object.freeze({
  ADMIN: "admin",
  OPERATOR: "operator",
  VIEWER: "viewer",
});
