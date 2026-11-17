export const sanitizeSpecInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  return {
    ...input,

    spec_name:
      typeof input.spec_name === "string"
        ? input.spec_name.trim()
        : input.spec_name,

    lifetime_start:
      typeof input.lifetime_start === "string"
        ? input.lifetime_start.trim()
        : input.lifetime_start,

    lifetime_end:
      typeof input.lifetime_end === "string"
        ? input.lifetime_end.trim()
        : input.lifetime_end,
  };
};