import { postRequest, getRequest, patchRequest } from '../Helpers'

export const authService = {
  login:             (cred)   => postRequest({ url: 'auth/loginWithPassword', cred }),
  getProfile:        ()       => getRequest('auth/profile'),
  updatePassword:    (cred)   => postRequest({ url: 'auth/updatePassword', cred }),
  createCustomer:    (cred)   => postRequest({ url: 'auth/create', cred }),
  createDistributor: (cred)   => postRequest({ url: 'auth/create', cred }),
  getAllCustomers:    (page = 1, limit = 10) => getRequest(`auth/getAllUsers?role=Customer&userType=Customer&isPagination=false&page=${page}&limit=${limit}`),
  getAllDistributors:          ()       => getRequest('auth/getAllUsers?role=Distributor&userType=Distributor&isPagination=false'),
  getDistributorsBySearch:     (q, page = 1, limit = 10) => getRequest(`auth/getAllUsers?role=Distributor&userType=Distributor&isPagination=false&page=${page}&limit=${limit}${q ? `&search=${encodeURIComponent(q)}&q=${encodeURIComponent(q)}&name=${encodeURIComponent(q)}` : ''}`),
  getCustomersBySearch:        (q, page = 1, limit = 10) => getRequest(`auth/getAllUsers?role=Customer&userType=Customer&isPagination=false&page=${page}&limit=${limit}${q ? `&search=${encodeURIComponent(q)}&q=${encodeURIComponent(q)}&name=${encodeURIComponent(q)}` : ''}`),
  getUsersCreatedBy:           (id)     => getRequest(`auth/getAllUsers?createdBy=${id}&isPagination=false`),
  getCustomerById:             (id)     => getRequest(`auth/${id}`),
  getMyTeam:                   (userId) => getRequest(`auth/my-team/${userId}`),
  getMyTeamBusiness:           (userId) => getRequest(`team/my-team-business/${userId}`),
  getMySponsoredUsers:         (userId, userType) => getRequest(`auth/getMySponsoredUsers/${userId}?userType=${userType}`),
  convertToDistributor:        (id)     => patchRequest({ url: `auth/convert-distributor/${id}`, cred: {} }),
}
