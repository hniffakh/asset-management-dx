import apiClient from "./apiClient.js";

const BASE = "/api/replacement-requests";

export const getReplacementOptions = async () => (await apiClient.get(`${BASE}/options`)).data;

export const getReplacements = async () => (await apiClient.get(BASE)).data;

export const createReplacement = async (data) => (await apiClient.post(BASE, data)).data;

export const approveReplacement = async (id, data) =>
  (await apiClient.patch(`${BASE}/${id}/approve`, data)).data;

export const rejectReplacement = async (id, data) =>
  (await apiClient.patch(`${BASE}/${id}/reject`, data)).data;

export const cancelReplacement = async (id) =>
  (await apiClient.patch(`${BASE}/${id}/cancel`, {})).data;

export const getAssetHistory = async () => (await apiClient.get("/api/asset-history")).data;