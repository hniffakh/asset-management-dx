export const sanitizeOpoqItemInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const out = { ...input };
  if (typeof out.item_name === "string") out.item_name = out.item_name.trim();
  for (const k of ["current_stock", "order_point", "order_qty"]) {
    if (out[k] !== undefined && out[k] !== "") out[k] = Number(out[k]);
  }
  return out;
};