/* eslint-disable prettier/prettier */
import { getRequest } from '../Helpers'

export const schoolLogService = {
  getLogs:    (params = '') => getRequest(`school-logs${params}`),
  getSchools: ()            => getRequest('school-logs/schools'),
  getSummary: (schoolId)    => getRequest(`school-logs/summary/${schoolId}`),
}
