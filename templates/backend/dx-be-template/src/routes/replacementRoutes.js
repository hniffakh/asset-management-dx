import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createReplacementSchema, approveReplacementSchema, rejectReplacementSchema} from "../validations/replacementValidation.js";
import { getReplacementOptions, getReplacements, createReplacement, approveReplacement, rejectReplacement, cancelReplacement} from "../controllers/replacementController.js";

const router = Router();

router.use(authenticate);

router.get("/options", getReplacementOptions);
router.get("/", getReplacements);
router.post("/", validate(createReplacementSchema), createReplacement);

// Hanya admin
router.patch("/:id/approve", authorizeRoles("admin"), validate(approveReplacementSchema), approveReplacement);
router.patch("/:id/reject", authorizeRoles("admin"), validate(rejectReplacementSchema), rejectReplacement);

// Pemilik pengajuan atau admin
router.patch("/:id/cancel", cancelReplacement);

export default router;