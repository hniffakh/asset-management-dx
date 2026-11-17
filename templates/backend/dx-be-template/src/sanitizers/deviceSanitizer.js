const isPlainObject = (v) => v && typeof v === "object" && !Array.isArray(v);

export const sanitizeDeviceInput = (input) => {
  if (!isPlainObject(input)) return input;
  const out = { ...input };
  if (typeof out.device_name === "string") out.device_name = out.device_name.trim();
  return out;
};

export const sanitizeStockInput = (input) => {
  if (!isPlainObject(input)) return input;
  const out = { ...input };
  if (out.qty !== undefined && out.qty !== "") out.qty = Number(out.qty);
  return out;
};

export const sanitizeOpoqInput = (input) => {
  if (!isPlainObject(input)) return input;
  const out = { ...input };
  if (out.order_point !== undefined && out.order_point !== "") out.order_point = Number(out.order_point);
  if (out.order_qty !== undefined && out.order_qty !== "") out.order_qty = Number(out.order_qty);
  return out;
};