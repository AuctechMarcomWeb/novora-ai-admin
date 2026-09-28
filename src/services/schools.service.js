import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const schoolService = {
  // Get all schools
  getAllSchools: (params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    return axiosInstance.get("/schools", {
      params: { page, limit, search },
    });
  },

  // Get single school
  getSchoolById: (id) => {
    return axiosInstance.get(`/schools/${id}`);
  },

  // Create school
  createSchool: (data) => {
    return axiosInstance.post("/schools", data);
  },

  // Update school
  updateSchool: (id, data) => {
    return axiosInstance.put(`/schools/${id}`, data);
  },

  // Soft delete school
  deleteSchool: (id) => {
    return axiosInstance.delete(`/schools/${id}`);
  },

  // Toggle school status
  toggleSchoolStatus: (id) => {
    return axiosInstance.patch(`/schools/${id}/toggle-status`);
  },

  // Get deleted schools
  getDeletedSchools: (params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    return axiosInstance.get("/schools/deleted", {
      params: { page, limit, search },
    });
  },

  // Restore deleted school
  restoreSchool: (id) => {
    return axiosInstance.patch(`/schools/${id}/restore`);
  },

  // Permanent delete school
  permanentDeleteSchool: (id) => {
    return axiosInstance.delete(`/schools/${id}/permanent`);
  },
};
