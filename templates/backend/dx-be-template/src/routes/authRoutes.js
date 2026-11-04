import { Router } from "express";
import { login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validations/authValidation.js";
import { sanitizeLoginInput } from "../sanitizers/authSanitizer.js";

const router = Router();

/**
 * Pipeline: Route -> Sanitization -> Validation (req.validated) -> Controller
 */
router.post("/login", validate(loginSchema, sanitizeLoginInput), login);

export default router;
