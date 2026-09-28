import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const classService = {
  getAll: (params = {}) => axiosInstance.get("/classes", { params }),
  getById: (id) => axiosInstance.get(`/classes/${id}`),
  create: (data) => axiosInstance.post("/classes", data),
  update: (id, data) => axiosInstance.put(`/classes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/classes/${id}`),
  toggleStatus: (id) => axiosInstance.patch(`/classes/${id}/toggle-status`),
  getDeleted: (params = {}) => axiosInstance.get("/classes/deleted", { params }),
  restore: (id) => axiosInstance.patch(`/classes/${id}/restore`),
  permanentDelete: (id) => axiosInstance.delete(`/classes/${id}/permanent`),
  reorder: (orderedIds) => axiosInstance.put("/classes/reorder", { orderedIds }),
};
