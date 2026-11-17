import apiClient from "./apiClient.js";

// GET ALL SUPPLIERS
export const getSuppliers = async () => {
  const response = await apiClient.get("/api/suppliers");
  return response.data;
};

// GET SUPPLIER BY ID
export const getSupplierById = async (id) => {
  const response = await apiClient.get(`/api/suppliers/${id}`);
  return response.data;
};

// CREATE SUPPLIER
export const createSupplier = async (data) => {
  const response = await apiClient.post("/api/suppliers", data);
  return response.data;
};

// UPDATE SUPPLIER
export const updateSupplier = async (id, data) => {
  const response = await apiClient.put(`/api/suppliers/${id}`, data);
  return response.data;
};

// DELETE SUPPLIER
export const deleteSupplier = async (id) => {
  const response = await apiClient.delete(`/api/suppliers/${id}`);
  return response.data;
};