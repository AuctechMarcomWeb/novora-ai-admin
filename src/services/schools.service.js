/* eslint-disable prettier/prettier */
import { getRequest, postRequest, patchRequest, deleteRequest } from '../Helpers'

export const schoolsService = {
  // Schools CRUD
  getAllSchools: (params = '') => getRequest(`schools${params}`),
  getSchoolById: (id) => getRequest(`schools/${id}`),
  createSchool: (cred) => postRequest({ url: 'schools', cred }),
  updateSchool: (id, cred) => patchRequest({ url: `schools/${id}`, cred }),
  deleteSchool: (id) => deleteRequest(`schools/${id}`),
  
  // School Actions
  resetPassword: (id, cred) => patchRequest({ url: `schools/${id}/reset-password`, cred }),
  updateStatus: (id, cred) => patchRequest({ url: `schools/${id}/status`, cred }),
  generateCredentialsPDF: (id) => getRequest(`schools/${id}/credentials-pdf`),
  
  // Stats
  getSchoolStats: () => getRequest('schools/stats'),
}
