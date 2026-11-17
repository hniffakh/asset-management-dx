export const sanitizeLoginInput = (data = {}) => {
  return {
    ...data,
    username: typeof data.username === "string" ? data.username.trim() : data.username,
    password: typeof data.password === "string" ? data.password : data.password,
  };
};
