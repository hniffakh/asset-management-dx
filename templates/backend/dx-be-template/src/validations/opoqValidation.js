import { z } from "zod";

const intField = (label) =>
  z.number({ error: `${label} harus berupa angka` })
    .int(`${label} harus bilangan bulat`)
    .min(0, `${label} minimal 0`);

export const opoqSchema = z
  .object({
    item_name: z
      .string({ error: "Nama item wajib diisi" })
      .min(1, "Nama item wajib diisi")
      .max(100, "Nama item maksimal 100 karakter"),
    current_stock: intField("Stok"),
    order_point: intField("Order Point"),
    order_qty: intField("Order Quantity"),
  })
  .strict();