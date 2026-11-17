import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createDeviceSchema, updateDeviceSchema, addStockSchema } from "../validations/deviceValidation.js";
import { sanitizeDeviceInput, sanitizeStockInput } from "../sanitizers/deviceSanitizer.js";
import {
  getAllDevices, getDeviceById, createDevice, updateDevice, deleteDevice, addStock,
} from "../controllers/deviceController.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllDevices);
router.get("/:id", getDeviceById);

router.post("/", validate(createDeviceSchema, sanitizeDeviceInput), createDevice);
router.post("/:id/stock", validate(addStockSchema, sanitizeStockInput), addStock);

router.put("/:id", validate(updateDeviceSchema, sanitizeDeviceInput), updateDevice);

router.delete("/:id", deleteDevice);

export default router;