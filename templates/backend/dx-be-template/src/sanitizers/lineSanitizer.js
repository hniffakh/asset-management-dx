const TRIM_FIELDS = [
  "line_code",
  "new_line_code",
  "company_code",
  "plant_code",
  "bu_code",
  "product_code",
  "area_code",
  "line_name",
  "line_category",
  "flag",
];

export const sanitizeLineInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  const result = { ...input };

  for (const key of TRIM_FIELDS) {
    // Hanya proses field yang memang dikirim, jangan tambah field baru
    if (Object.prototype.hasOwnProperty.call(result, key) && typeof result[key] === "string") {
      result[key] = result[key].trim();
    }
  }

  if (typeof result.flag === "string") {
    result.flag = result.flag.toUpperCase();
  }

  return result;
};