export const sanitizeSupplierInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  return {
    ...input,

    supplier_by:
      typeof input.supplier_by === "string"
        ? input.supplier_by.trim()
        : input.supplier_by,

    supplier_date:
      typeof input.supplier_date === "string"
        ? input.supplier_date.trim()
        : input.supplier_date,

    price_supplier: input.price_supplier,
  };
};