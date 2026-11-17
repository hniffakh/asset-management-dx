import { z } from "zod";

// ============================================
// SPEC NAME VALIDATION
// ============================================
const specNameSchema = z
  .string({
    required_error: "Nama spesifikasi wajib diisi",
    invalid_type_error: "Nama spesifikasi harus berupa teks",
  })
  .trim()
  .min(1, "Nama spesifikasi wajib diisi");

// ============================================
// LIFETIME START VALIDATION
// ============================================
const lifetimeStartSchema = z
  .string({
    required_error: "Lifetime start wajib diisi",
    invalid_type_error: "Lifetime start harus berupa tanggal",
  })
  .min(1, "Lifetime start wajib diisi")
  .date("Format lifetime start tidak valid");

// ============================================
// LIFETIME END VALIDATION
// ============================================
const lifetimeEndSchema = z
  .string({
    required_error: "Lifetime end wajib diisi",
    invalid_type_error: "Lifetime end harus berupa tanggal",
  })
  .min(1, "Lifetime end wajib diisi")
  .date("Format lifetime end tidak valid");

// ============================================
// ACTIVE FLAG VALIDATION
// ============================================
const activeFlagSchema = z.union([
  z.literal(0),
  z.literal(1),
], {
  errorMap: () => ({
    message: "Status spesifikasi hanya boleh 0 (Inactive) atau 1 (Active)",
  }),
});

// ============================================
// LIFETIME RANGE VALIDATION
// ============================================
const validateLifetimeRange = (data, ctx) => {
  if (
    data.lifetime_start &&
    data.lifetime_end &&
    data.lifetime_end < data.lifetime_start
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Lifetime end tidak boleh lebih awal dari lifetime start",
      path: ["lifetime_end"],
    });
  }
};

// ============================================
// CREATE SPEC
// ============================================
export const createSpecSchema = z
  .object({
    spec_name: specNameSchema,
    lifetime_start: lifetimeStartSchema,
    lifetime_end: lifetimeEndSchema,
    active_flag: activeFlagSchema.optional().default(1),
  })
  .strict()
  .superRefine(validateLifetimeRange);

// ============================================
// UPDATE SPEC
// ============================================
export const updateSpecSchema = z
  .object({
    spec_name: specNameSchema,
    lifetime_start: lifetimeStartSchema,
    lifetime_end: lifetimeEndSchema,
    active_flag: activeFlagSchema,
  })
  .strict()
  .superRefine(validateLifetimeRange);
