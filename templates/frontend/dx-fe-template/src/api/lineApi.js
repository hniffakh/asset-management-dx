
import apiClient from "./apiClient.js";

// ============================================
// GET ALL LINES
// ============================================

export const getLines = async () => {
  const response = await apiClient.get("/api/lines");
  return response.data;
};

// ============================================
// GET LINE BY CODE
// ============================================

export const getLineByCode = async (lineCode) => {
  const response = await apiClient.get(`/api/lines/${lineCode}`);
  return response.data;
};

// ============================================
// CREATE LINE
// ============================================

export const createLine = async (data) => {
  const response = await apiClient.post("/api/lines", data);
  return response.data;
};

// ============================================
// UPDATE LINE
// ============================================

export const updateLine = async (lineCode, data) => {
  const response = await apiClient.put(
    `/api/lines/${lineCode}`,
    data
  );
  return response.data;
};

// ============================================
// DELETE LINE
// ============================================

export const deleteLine = async (lineCode) => {
  const response = await apiClient.delete(`/api/lines/${lineCode}`);
  return response.data;
};
