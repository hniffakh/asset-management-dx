
import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categoryValidation.js";

import {
  sanitizeCategoryInput,
} from "../sanitizers/categorySanitizer.js";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

// Authentication
router.use(authenticate);

// GET
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// POST
router.post(
  "/",
  validate(createCategorySchema, sanitizeCategoryInput),
  createCategory
);

// PUT
router.put(
  "/:id",
  validate(updateCategorySchema, sanitizeCategoryInput),
  updateCategory
);

// DELETE
router.delete("/:id", deleteCategory);

export default router;
