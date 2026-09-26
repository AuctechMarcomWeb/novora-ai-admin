/* eslint-disable prettier/prettier */
import { getRequest } from '../Helpers'

export const activityService = {
  // Login Logs
  getLoginLogs: (params = '') => getRequest(`activity/login-logs${params}`),
  
  // Usage / Generated Content Logs
  getUsageLogs: (params = '') => getRequest(`activity/usage-logs${params}`),
  getGeneratedContent: (params = '') => getRequest(`activity/generated-content${params}`),
  getGeneratedContentById: (id) => getRequest(`activity/generated-content/${id}`),
  
  // Stats
  getActivityStats: () => getRequest('activity/stats'),
}
