/* eslint-disable prettier/prettier */
import axios from 'axios'
import Cookies from 'js-cookie'
import { getRequest, postRequest, putRequest, deleteRequest, patchRequest } from '../Helpers'

const BASE = import.meta.env.VITE_API_BASE_URL

const authAxios = () => {
  const token = Cookies.get('NovoraAiChat')
  return axios.create({
    baseURL: BASE,
    headers: { Authorization: token },
  })
}

export const videoService = {
  // ── CRUD ──────────────────────────────────────────────────────────────────
  getAll:          (params = '') => getRequest(`videos${params}`),
  getDeleted:      (params = '') => getRequest(`videos/deleted${params}`),
  getById:         (id)          => getRequest(`videos/${id}`),
  create:          (data)        => postRequest({ url: 'videos', cred: data }),
  update:          (id, data)    => putRequest({ url: `videos/${id}`, cred: data }),
  delete:          (id)          => deleteRequest(`videos/${id}`),
  restore:         (id)          => patchRequest({ url: `videos/${id}/restore`, cred: {} }),
  permanentDelete: (id)          => deleteRequest(`videos/${id}/permanent`),
  toggleStatus:    (id)          => patchRequest({ url: `videos/${id}/toggle-status`, cred: {} }),

  // ── Video Upload to R2 with progress ─────────────────────────────────────
  uploadVideo: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return authAxios().post('upload/uploadVideo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
  },
}
