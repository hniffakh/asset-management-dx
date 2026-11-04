
import { z } from "zod";

// ============================================
// CATEGORY NAME VALIDATION
// ============================================
const categoryNameSchema = z
  .string({
    required_error: "Nama kategori wajib diisi",
    invalid_type_error: "Nama kategori harus berupa teks",
  })
  .min(1, "Nama kategori wajib diisi");

// ============================================
// ACTIVE FLAG VALIDATION
// ============================================
const activeFlagSchema = z.union([
  z.literal(0),
  z.literal(1),
], {
  errorMap: () => ({
    message: "Status kategori hanya boleh 0 (Inactive) atau 1 (Active)",
  }),
});

// ============================================
// CREATE CATEGORY
// ============================================
export const createCategorySchema = z
  .object({
    category_name: categoryNameSchema,
    active_flag: activeFlagSchema.optional().default(1),
  })
  .strict();

// ============================================
// UPDATE CATEGORY
// ============================================
export const updateCategorySchema = z
  .object({
    category_name: categoryNameSchema,
    active_flag: activeFlagSchema,
  })
  .strict();
