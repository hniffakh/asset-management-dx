import { ValidationError } from "../errors/ValidationError.js";

/**
 * Validation & Sanitization Middleware
 * Flow: Sanitization -> Zod Schema Validation -> req.validated -> next()
 *
 * @param {import('zod').ZodSchema} schema
 * @param {Function} [sanitizer]
 */
export const validate = (schema, sanitizer = null) => {
  return (req, _res, next) => {
    try {
      const dataToValidate = sanitizer ? sanitizer(req.body) : req.body;
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        // Mendukung Zod v4 (issues) maupun Zod v3 (errors)
        const issues = result.error.issues || result.error.errors || [];
        const firstMessage = issues[0]?.message || "Validasi data gagal";
        const details = issues.map((err) => ({
          field: Array.isArray(err.path) ? err.path.join(".") : String(err.path),
          message: err.message,
        }));

        throw new ValidationError(firstMessage, details);
      }

      // Simpan data yang sudah divalidasi dan di-sanitize ke req.validated
      req.validated = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
