/* eslint-disable prettier/prettier */
import { getRequest, postRequest, patchRequest, deleteRequest, fileUpload } from '../Helpers'

export const resourcesService = {
  // Resources CRUD
  getAllResources: (params = '') => getRequest(`resources${params}`),
  getResourceById: (id) => getRequest(`resources/${id}`),
  createResource: (formData) => fileUpload({ url: 'resources', cred: formData }),
  updateResource: (id, formData) => fileUpload({ url: `resources/${id}`, cred: formData }),
  deleteResource: (id) => deleteRequest(`resources/${id}`),
  
  // Resource Actions
  updateStatus: (id, cred) => patchRequest({ url: `resources/${id}/status`, cred }),
  
  // Stats
  getResourceStats: () => getRequest('resources/stats'),
}
