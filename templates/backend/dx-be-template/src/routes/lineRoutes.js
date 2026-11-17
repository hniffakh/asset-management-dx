
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import {
  createLineSchema,
  updateLineSchema,
} from "../validations/lineValidation.js";
import { sanitizeLineInput } from "../sanitizers/lineSanitizer.js";
import {
  getAllLines,
  getLineByCode,
  createLine,
  updateLine,
  deleteLine,
} from "../controllers/lineController.js";

const router = Router();

// ============================================
// AUTHENTICATION
// ============================================

router.use(authenticate);

// ============================================
// GET
// ============================================

router.get("/", getAllLines);
router.get("/:line_code", getLineByCode);

// ============================================
// POST - CREATE LINE
// ============================================

router.post(
  "/",
  validate(createLineSchema, sanitizeLineInput),
  createLine
);

// ============================================
// PUT - UPDATE LINE
// ============================================

router.put(
  "/:line_code",
  validate(updateLineSchema, sanitizeLineInput),
  updateLine
);

// ============================================
// DELETE LINE
// ============================================

router.delete("/:line_code", deleteLine);

export default router;
