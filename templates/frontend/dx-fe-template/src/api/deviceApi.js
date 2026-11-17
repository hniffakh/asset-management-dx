import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getDevicesApi = () => api.get("/devices");

export const createDeviceApi = (payload) => api.post("/devices", payload);

export const updateDeviceApi = (id, payload) =>
  api.put(`/devices/${id}`, payload);

export const deleteDeviceApi = (id) => api.delete(`/devices/${id}`);

export const addStockApi = (id, qty) =>
  api.post(`/devices/${id}/stock`, { qty });

