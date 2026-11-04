import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { AppError } from "../errors/AppError.js";

/**
 * Centralized Global Error Handler
 */
export const errorHandler = (err, req, res, _next) => {
  // Operational errors yang diketahui (AppError, ValidationError, UnauthorizedError)
  if (err instanceof AppError) {
    const responseBody = {
      success: false,
      message: err.message,
    };

    if (err.details) {
      responseBody.details = err.details;
    }

    return res.status(err.statusCode).json(responseBody);
  }

  // SyntaxError dari JSON malformed body
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Format JSON tidak valid",
    });
  }

  // Unhandled / unexpected errors (SQL connection failure, bug, dll)
  console.error("[Unhandled Error]:", err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isDev = process.env.NODE_ENV !== "production";

  return res.status(statusCode).json({
    success: false,
    message: isDev ? err.message : "Terjadi kesalahan internal pada server",
    ...(isDev && { stack: err.stack }),
  });
};
