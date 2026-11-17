import { z } from "zod";

// SUPPLIER BY VALIDATION
const supplierBySchema = z
  .string({
    required_error: "Nama supplier wajib diisi",
    invalid_type_error: "Nama supplier harus berupa teks",
  })
  .min(1, "Nama supplier wajib diisi");

// SUPPLIER DATE VALIDATION
const supplierDateSchema = z
  .string({
    required_error: "Tanggal supplier wajib diisi",
    invalid_type_error: "Tanggal supplier harus berupa teks",
  })
  .min(1, "Tanggal supplier wajib diisi")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD");

// PRICE SUPPLIER VALIDATION
const priceSupplierSchema = z
  .number({
    required_error: "Harga supplier wajib diisi",
    invalid_type_error: "Harga supplier harus berupa angka",
  })
  .finite("Harga supplier harus berupa angka yang valid")
  .min(0, "Harga supplier tidak boleh negatif");

// CREATE SUPPLIER
export const createSupplierSchema = z
  .object({
    supplier_by: supplierBySchema,
    supplier_date: supplierDateSchema,
    price_supplier: priceSupplierSchema,
  })
  .strict();

// UPDATE SUPPLIER
export const updateSupplierSchema = z
  .object({
    supplier_by: supplierBySchema,
    supplier_date: supplierDateSchema,
    price_supplier: priceSupplierSchema,
  })
  .strict();