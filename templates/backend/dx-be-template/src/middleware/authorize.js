/**
 * Middleware: membatasi akses berdasarkan role user (dari JWT).
 * Contoh: authorizeRoles("admin")
 */
export const authorizeRoles = (...roles) => (req, res, next) => {
  const role = String(req.user?.role || "").trim().toLowerCase();

  if (!roles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Anda tidak memiliki akses untuk melakukan aksi ini",
    });
  }

  next();
};

/**
 * Middleware: GET boleh untuk semua user yang login,
 * selain GET (tambah / ubah / hapus) hanya untuk admin.
 */
export const adminForWrites = (req, res, next) => {
  if (req.method === "GET") return next();
  return authorizeRoles("admin")(req, res, next);
};