
export const sanitizeCategoryInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  return {
    ...input,
    category_name:
      typeof input.category_name === "string"
        ? input.category_name.trim()
        : input.category_name,
  };
};
