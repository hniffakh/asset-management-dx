import apiClient from "./apiClient.js";

// GET ALL CATEGORIES
export const getCategories = async () => {
  const response = await apiClient.get("/api/categories");
  return response.data;
};

// GET CATEGORY BY ID
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/api/categories/${id}`);
  return response.data;
};

// CREATE CATEGORY
export const createCategory = async (data) => {
  const response = await apiClient.post("/api/categories", data);
  return response.data;
};

// UPDATE CATEGORY
export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`/api/categories/${id}`, data);
  return response.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};
