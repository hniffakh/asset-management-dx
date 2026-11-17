import apiClient from "./apiClient.js";

// GET ALL SPECS
export const getSpecs = async () => {
  const response = await apiClient.get("/api/specs");
  return response.data;
};

// GET SPEC BY ID
export const getSpecById = async (id) => {
  const response = await apiClient.get(`/api/specs/${id}`);
  return response.data;
};

// CREATE SPEC
export const createSpec = async (data) => {
  const response = await apiClient.post("/api/specs", data);
  return response.data;
};

// UPDATE SPEC
export const updateSpec = async (id, data) => {
  const response = await apiClient.put(`/api/specs/${id}`, data);
  return response.data;
};

// DELETE SPEC (SOFT DELETE)
export const deleteSpec = async (id) => {
  const response = await apiClient.delete(`/api/specs/${id}`);
  return response.data;
};
