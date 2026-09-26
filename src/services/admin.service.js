/* eslint-disable prettier/prettier */
import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from '../Helpers'

export const adminService = {
  // Dashboard
  getDashboardStats:     ()       => getRequest('admin/dashboard/stats'),
  getDashboardSummary:   ()       => getRequest('dashboard/admin'),
  getRecentOrders:       ()       => getRequest('admin/dashboard/recent-orders'),
  getTopDistributors:    ()       => getRequest('admin/dashboard/top-distributors'),
  getCommissionFlow:     ()       => getRequest('admin/dashboard/commission-flow'),

  // Earnings
  getLevelWiseEarnings:   ()       => getRequest('admin/earnings/level-wise'),
  getBonusMilestones:     ()       => getRequest('admin/earnings/bonus-milestones'),
  getMilestoneProgress:   (userId) => getRequest(`milestone/progress/${userId}`),
  checkMilestone:         (userId) => getRequest(`milestone/check/${userId}`),
  getAllAchievements:      (params = '') => getRequest(`milestone/admin/all-achievements${params}`),

  // Users (real API)
  getAllUsers: (params = '') => getRequest(`auth/getAllUsers${params}`),
  getUserById: (id) => getRequest(`auth/${id}`),
  createUser: (cred) => postRequest({ url: 'auth/create', cred }),
  updateUser: (id, cred) => patchRequest({ url: `auth/update/${id}`, cred }),
  deleteUser: (id) => deleteRequest(`auth/delete/${id}`),

  // Customers (filtered from getAllUsers)
  getAllCustomers: (params = '') => getRequest(`auth/getAllUsers?userType=Customer${params ? '&' + params.replace('?', '') : ''}`),
  getCustomerById: (id) => getRequest(`auth/${id}`),
  updateCustomerStatus: (id, cred) => patchRequest({ url: `auth/update/${id}`, cred }),

  // Distributors (filtered from getAllUsers)
  getAllDistributors: (params = '') => getRequest(`auth/getAllUsers?userType=Distributor${params ? '&' + params.replace('?', '') : ''}`),
  getDistributorById: (id) => getRequest(`auth/${id}`),
  createDistributor: (cred) => postRequest({ url: 'auth/create', cred: { ...cred, userType: 'Distributor', role: 'Distributor' } }),
  updateDistributor: (id, cred) => patchRequest({ url: `auth/update/${id}`, cred }),
  updateDistributorStatus: (id, cred) => patchRequest({ url: `auth/update/${id}`, cred }),
}
