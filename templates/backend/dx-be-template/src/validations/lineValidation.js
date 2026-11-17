
import { z } from "zod";

// ============================================
// LINE CODE VALIDATION
// ============================================

const lineCodeSchema = z
  .string({
    required_error: "Line code wajib diisi",
    invalid_type_error: "Line code harus berupa teks",
  })
  .trim()
  .min(1, "Line code wajib diisi")
  .max(10, "Line code maksimal 10 karakter");

// ============================================
// COMPANY CODE VALIDATION
// ============================================

const companyCodeSchema = z
  .string({
    required_error: "Company code wajib diisi",
    invalid_type_error: "Company code harus berupa teks",
  })
  .trim()
  .min(1, "Company code wajib diisi")
  .max(11, "Company code maksimal 11 karakter");

// ============================================
// PLANT CODE VALIDATION
// ============================================

const plantCodeSchema = z
  .string({
    required_error: "Plant code wajib diisi",
    invalid_type_error: "Plant code harus berupa teks",
  })
  .trim()
  .min(1, "Plant code wajib diisi")
  .max(5, "Plant code maksimal 5 karakter");

// ============================================
// BU CODE VALIDATION
// ============================================

const buCodeSchema = z
  .string({
    required_error: "BU code wajib diisi",
    invalid_type_error: "BU code harus berupa teks",
  })
  .trim()
  .min(1, "BU code wajib diisi")
  .max(10, "BU code maksimal 10 karakter");

// ============================================
// PRODUCT CODE VALIDATION
// ============================================

const productCodeSchema = z
  .string({
    required_error: "Product code wajib diisi",
    invalid_type_error: "Product code harus berupa teks",
  })
  .trim()
  .min(1, "Product code wajib diisi")
  .max(8, "Product code maksimal 8 karakter");

// ============================================
// AREA CODE VALIDATION
// ============================================

const areaCodeSchema = z
  .string({
    required_error: "Area code wajib diisi",
    invalid_type_error: "Area code harus berupa teks",
  })
  .trim()
  .min(1, "Area code wajib diisi")
  .max(50, "Area code maksimal 50 karakter");

// ============================================
// LINE NAME VALIDATION
// ============================================

const lineNameSchema = z
  .string({
    required_error: "Line name wajib diisi",
    invalid_type_error: "Line name harus berupa teks",
  })
  .trim()
  .min(1, "Line name wajib diisi")
  .max(100, "Line name maksimal 100 karakter");

// ============================================
// LINE CATEGORY VALIDATION
// ============================================

const lineCategorySchema = z
  .string({
    required_error: "Line category wajib diisi",
    invalid_type_error: "Line category harus berupa teks",
  })
  .trim()
  .min(1, "Line category wajib diisi")
  .max(50, "Line category maksimal 50 karakter");

// ============================================
// FLAG VALIDATION
// A = ACTIVE
// N = NONACTIVE
// ============================================

const flagSchema = z
  .string({
    required_error: "Flag wajib diisi",
    invalid_type_error: "Flag harus berupa teks",
  })
  .trim()
  .transform((value) => value.toUpperCase())
  .refine(
    (value) => ["A", "N"].includes(value),
    "Flag hanya boleh berisi A (Active) atau N (Nonactive)"
  );

// ============================================
// CREATE LINE
// ============================================

export const createLineSchema = z
  .object({
    line_code: lineCodeSchema,
    company_code: companyCodeSchema,
    plant_code: plantCodeSchema,
    bu_code: buCodeSchema,
    product_code: productCodeSchema,
    area_code: areaCodeSchema,
    line_name: lineNameSchema,
    line_category: lineCategorySchema,
    flag: flagSchema,
  })
  .strict();

// ============================================
// UPDATE LINE
// ============================================

export const updateLineSchema = z
  .object({
    new_line_code: lineCodeSchema,
    company_code: companyCodeSchema,
    plant_code: plantCodeSchema,
    bu_code: buCodeSchema,
    product_code: productCodeSchema,
    area_code: areaCodeSchema,
    line_name: lineNameSchema,
    line_category: lineCategorySchema,
    flag: flagSchema,
  })
  .strict();
