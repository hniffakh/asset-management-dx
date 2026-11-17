import { z } from "zod";

const deviceNameSchema = z
  .string({ error: "Nama device wajib diisi" })
  .min(1, "Nama device wajib diisi")
  .max(100, "Nama device maksimal 100 karakter");

const activeFlagSchema = z.union([z.literal(0), z.literal(1)], {
  error: "Status device hanya boleh 0 (Inactive) atau 1 (Active)",
});

export const createDeviceSchema = z
  .object({
    device_name: deviceNameSchema,
    active_flag: activeFlagSchema.optional().default(1),
  })
  .strict();

export const updateDeviceSchema = z
  .object({
    device_name: deviceNameSchema,
    active_flag: activeFlagSchema,
  })
  .strict();

export const addStockSchema = z
  .object({
    qty: z
      .number({ error: "Jumlah unit harus berupa angka" })
      .int("Jumlah unit harus bilangan bulat")
      .min(1, "Minimal 1 unit")
      .max(500, "Maksimal 500 unit"),
  })
  .strict();
  