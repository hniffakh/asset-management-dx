import apiClient from "./apiClient.js";

export const loginApi = async (username, password) => {
  const response = await apiClient.post("/api/auth/login", {
    username,
    password,
  });

  return response.data;
};
