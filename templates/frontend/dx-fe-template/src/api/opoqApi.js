import apiClient from "./apiClient.js";

export const getOpoqApi = async () => (await apiClient.get("/api/opoq")).data;

export const updateOpoqApi = async (deviceId, payload) =>
  (await apiClient.put(`/api/opoq/${deviceId}`, payload)).data;

export const deleteOpoqApi = async (deviceId) =>
  (await apiClient.delete(`/api/opoq/${deviceId}`)).data;