import { lazy } from 'react'

const ALL_ROLES = ['Admin']
const ADMIN_ONLY = ['Admin']

const AdminDashboard = lazy(() => import('./views/pages/Admin/Dashboard/AdminDashboard'))
const SchoolList     = lazy(() => import('./views/pages/Admin/Schools/SchoolList'))
const BookList       = lazy(() => import('./views/pages/Admin/Books/BookList'))
const ResourceList   = lazy(() => import('./views/pages/Admin/Resources/ResourceList'))
const ActivityLogs   = lazy(() => import('./views/pages/Admin/ActivityLogs/ActivityLogs'))
const ClassList      = lazy(() => import('./views/pages/Admin/Masters/Class/ClassList'))
const SubjectList    = lazy(() => import('./views/pages/Admin/Masters/Subject/SubjectList'))
const SchoolLogs     = lazy(() => import('./views/pages/Admin/SchoolLogs/SchoolLogs'))
const VideoList      = lazy(() => import('./views/pages/Admin/Videos/VideoList'))

const routes = [
  { path: '/admin/dashboard',         name: 'Admin Dashboard', element: AdminDashboard, roles: ADMIN_ONLY },
  { path: '/admin/schools',           name: 'Schools',         element: SchoolList,     roles: ADMIN_ONLY },
  { path: '/admin/books',             name: 'Books / PDFs',    element: BookList,       roles: ADMIN_ONLY },
  { path: '/admin/videos',            name: 'Videos',          element: VideoList,      roles: ADMIN_ONLY },
  { path: '/admin/resources',         name: 'Resources',       element: ResourceList,   roles: ADMIN_ONLY },
  { path: '/admin/activity-logs',     name: 'Activity Logs',   element: ActivityLogs,   roles: ADMIN_ONLY },
  { path: '/admin/masters/classes',   name: 'Class Master',    element: ClassList,      roles: ADMIN_ONLY },
  { path: '/admin/masters/subjects',  name: 'Subject Master',  element: SubjectList,    roles: ADMIN_ONLY },
  { path: '/admin/school-logs',       name: 'School Logs',     element: SchoolLogs,     roles: ADMIN_ONLY },
]

export { ALL_ROLES, ADMIN_ONLY }
export default routes
