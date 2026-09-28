import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const subjectService = {
  getAll: (params = {}) => axiosInstance.get("/subjects", { params }),
  getById: (id) => axiosInstance.get(`/subjects/${id}`),
  create: (data) => axiosInstance.post("/subjects", data),
  update: (id, data) => axiosInstance.put(`/subjects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/subjects/${id}`),
  toggleStatus: (id) => axiosInstance.patch(`/subjects/${id}/toggle-status`),
  getDeleted: (params = {}) => axiosInstance.get("/subjects/deleted", { params }),
  restore: (id) => axiosInstance.patch(`/subjects/${id}/restore`),
  permanentDelete: (id) => axiosInstance.delete(`/subjects/${id}/permanent`),
  reorder: (orderedIds) => axiosInstance.put("/subjects/reorder", { orderedIds }),
};
