import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createSupplierSchema, updateSupplierSchema} from "../validations/supplierValidation.js";
import { sanitizeSupplierInput} from "../sanitizers/supplierSanitizer.js";
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier} from "../controllers/supplierController.js";

const router = Router();

// Authentication
router.use(authenticate);

// GET
router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);

// POST
router.post(
  "/",
  validate(createSupplierSchema, sanitizeSupplierInput),
  createSupplier
);

// PUT
router.put(
  "/:id",
  validate(updateSupplierSchema, sanitizeSupplierInput),
  updateSupplier
);

// DELETE
router.delete("/:id", deleteSupplier);

export default router;