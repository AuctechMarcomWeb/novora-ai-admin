/* eslint-disable prettier/prettier */
import axios from 'axios'
import Cookies from 'js-cookie'
import { getRequest, postRequest, putRequest, deleteRequest, patchRequest } from '../Helpers'

const BASE = import.meta.env.VITE_API_BASE_URL

// ── Axios instance with auth (for multipart uploads with progress) ────────────
const authAxios = () => {
  const token = Cookies.get('NovoraAiChat')
  return axios.create({
    baseURL: BASE,
    headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
  })
}

export const booksService = {
  // ── CRUD ─────────────────────────────────────────────────────────────────
  getAllBooks:    (params = '') => getRequest(`books${params}`),
  getDeletedBooks: (params = '') => getRequest(`books/deleted${params}`),
  getBookById:   (id) => getRequest(`books/${id}`),
  createBook:    (data) => postRequest({ url: 'books', cred: data }),
  updateBook:    (id, data) => putRequest({ url: `books/${id}`, cred: data }),
  deleteBook:    (id) => deleteRequest(`books/${id}`),
  restoreBook:   (id) => patchRequest({ url: `books/${id}/restore`, cred: {} }),
  permanentDeleteBook: (id) => deleteRequest(`books/${id}/permanent`),
  toggleStatus:  (id) => patchRequest({ url: `books/${id}/toggle-status`, cred: {} }),

  // ── PDF Upload with progress callback ────────────────────────────────────
  uploadPdf: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return authAxios().post('upload/uploadPdf', formData, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
  },

  // ── AI APIs ───────────────────────────────────────────────────────────────
  analyzeBook:    (pdfUrl) => postRequest({ url: 'books/analyze', cred: { pdfUrl } }),
  lessonPlan:     (data) => postRequest({ url: 'books/lesson-plan', cred: data }),
  generateMcq:    (data) => postRequest({ url: 'books/generate-mcq', cred: data }),
  generateAssignment: (data) => postRequest({ url: 'books/generate-assignment', cred: data }),
  generateWorksheet: (data) => postRequest({ url: 'books/generate-worksheet', cred: data }),
}
