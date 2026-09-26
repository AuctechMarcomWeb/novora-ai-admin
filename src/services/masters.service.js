/* eslint-disable prettier/prettier */
import { getRequest, postRequest, putRequest, patchRequest, deleteRequest, fileUpload } from '../Helpers'

export const mastersService = {
  // Product Categories
  getProductCategories:    (params = '') => getRequest(`category${params}`),
  createProductCategory:   (cred) => postRequest({ url: 'category', cred }),
  updateProductCategory:   (id, cred) => putRequest({ url: `category/${id}`, cred }),
  deleteProductCategory:   (id) => deleteRequest(`category/${id}`),

  // User Levels
  getUserLevels:           (params = '') => getRequest(`admin/masters/user-levels${params}`),
  createUserLevel:         (cred) => postRequest({ url: 'admin/masters/user-levels', cred }),
  updateUserLevel:         (id, cred) => putRequest({ url: `admin/masters/user-levels/${id}`, cred }),
  deleteUserLevel:         (id) => deleteRequest(`admin/masters/user-levels/${id}`),

  // Payment Modes
  getPaymentModes:         (params = '') => getRequest(`admin/masters/payment-modes${params}`),
  createPaymentMode:       (cred) => postRequest({ url: 'admin/masters/payment-modes', cred }),
  updatePaymentMode:       (id, cred) => putRequest({ url: `admin/masters/payment-modes/${id}`, cred }),
  deletePaymentMode:       (id) => deleteRequest(`admin/masters/payment-modes/${id}`),

  // Payout Statuses
  getPayoutStatuses:       (params = '') => getRequest(`admin/masters/payout-statuses${params}`),
  createPayoutStatus:      (cred) => postRequest({ url: 'admin/masters/payout-statuses', cred }),
  updatePayoutStatus:      (id, cred) => putRequest({ url: `admin/masters/payout-statuses/${id}`, cred }),
  deletePayoutStatus:      (id) => deleteRequest(`admin/masters/payout-statuses/${id}`),

  // Commission Slabs  — POST /commission-slab
  getCommissionSlabs:      (params = '') => getRequest(`commission-slab${params}`),
  createCommissionSlab:    (cred)        => postRequest({ url: 'commission-slab', cred }),
  updateCommissionSlab:    (id, cred)    => putRequest({ url: `commission-slab/${id}`, cred }),
  deleteCommissionSlab:    (id)          => deleteRequest(`commission-slab/${id}`),
  rearrangeCommissionSlabs:(cred)        => patchRequest({ url: 'commission-slab/rearrange', cred }),

  // Milestone Master  — POST /milestone-master
  getMilestones:        (params = '') => getRequest(`milestone-master${params}`),
  createMilestone:      (cred)        => postRequest({ url: 'milestone-master', cred }),
  updateMilestone:      (id, cred)    => putRequest({ url: `milestone-master/${id}`, cred }),
  deleteMilestone:      (id)          => deleteRequest(`milestone-master/${id}`),
  rearrangeMilestones:  (cred)        => putRequest({ url: 'milestone-master/rearrange/order', cred }),

  // Bank Master  — POST /bank
  getBanks:             (params = '') => getRequest(`bank${params}`),
  createBank:           (cred)        => postRequest({ url: 'bank', cred }),
  updateBank:           (id, cred)    => putRequest({ url: `bank/${id}`, cred }),
  deleteBank:           (id)          => deleteRequest(`bank/${id}`),
  toggleBankStatus:     (id, cred)    => patchRequest({ url: `bank/status/${id}`, cred }),
  uploadBankQr:         (file)        => {
    const formData = new FormData()
    formData.append('file', file)
    return fileUpload({ url: 'upload/uploadImage', cred: formData })
  },
}
