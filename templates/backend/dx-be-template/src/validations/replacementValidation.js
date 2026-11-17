import { z } from "zod";

export const createReplacementSchema = z
  .object({
    device_id: z.number().int("Device tidak valid").positive("Device wajib dipilih"),
    line_code: z.string().trim().max(10, "Line code maksimal 10 karakter").optional().nullable(),
    old_asset_info: z.string().trim().max(100, "Info aset lama maksimal 100 karakter").optional().nullable(),
    quantity: z.number().int("Jumlah harus angka bulat").min(1, "Jumlah minimal 1").max(100, "Jumlah maksimal 100"),
    reason: z.string().trim().min(5, "Alasan minimal 5 karakter").max(500, "Alasan maksimal 500 karakter"),
  })
  .strict();

export const approveReplacementSchema = z
  .object({
    review_note: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
  })
  .strict();

export const rejectReplacementSchema = z
  .object({
    review_note: z.string().trim().min(3, "Alasan penolakan wajib diisi").max(500, "Catatan maksimal 500 karakter"),
  })
  .strict();