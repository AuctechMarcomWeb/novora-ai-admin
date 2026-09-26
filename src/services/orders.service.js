/* eslint-disable prettier/prettier */
import { getRequest, postRequest, patchRequest, fileUpload } from '../Helpers'

export const ordersService = {
  // ── Admin ──────────────────────────────────────────────────────────────────
  getAll:              (params = '') => getRequest(`order/admin/all${params}`),
  getById:             (id)          => getRequest(`order/${id}`),
  updateOrderStatus:   (id, cred)    => patchRequest({ url: `order/${id}/status`, cred }),
  cancelOrder:         (id, cred)    => patchRequest({ url: `order/${id}/cancel`, cred }),

  // ── Distributor / Buyer ────────────────────────────────────────────────────
  placeOrder:          (cred)        => postRequest({ url: 'order/place', cred }),
  placeOrderForOthers: (cred)        => postRequest({ url: 'order/placeOthers', cred }),
  getMyOrders:         (params = '') => getRequest(`order/my-orders${params}`),

  // ── Upload payment screenshot ──────────────────────────────────────────────
  uploadPaymentScreenshot: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return fileUpload({ url: 'upload/uploadImage', cred: formData })
  },
}
