import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createSpecSchema, updateSpecSchema} from "../validations/specValidation.js";
import { sanitizeSpecInput} from "../sanitizers/specSanitizer.js";
import { getAllSpecs, getSpecById, createSpec, updateSpec, deleteSpec} from "../controllers/specController.js";

const router = Router();

// Authentication
router.use(authenticate);

// GET
router.get("/", getAllSpecs);
router.get("/:id", getSpecById);

// POST
router.post(
  "/",
  validate(createSpecSchema, sanitizeSpecInput),
  createSpec
);

// PUT
router.put(
  "/:id",
  validate(updateSpecSchema, sanitizeSpecInput),
  updateSpec
);

// DELETE
router.delete("/:id", deleteSpec);

export default router;
