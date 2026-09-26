/* eslint-disable prettier/prettier */
import { CNavGroup, CNavItem } from '@coreui/react'
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
} from '@ant-design/icons'

const iconStyle = { fontSize: '16px' }
const iconClass = 'me-2'

// ─── Admin Navigation ─────────────────────────────────────────────────────────
export const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <DashboardOutlined style={iconStyle} className={iconClass} />,
  },
  {
    component: CNavItem,
    name: 'Schools',
    to: '/admin/schools',
    icon: <BankOutlined style={iconStyle} className={iconClass} />,
  },
  {
    component: CNavItem,
    name: 'Books / PDFs',
    to: '/admin/books',
    icon: <BookOutlined style={iconStyle} className={iconClass} />,
  },
  {
    component: CNavItem,
    name: 'Resources',
    to: '/admin/resources',
    icon: <FolderOpenOutlined style={iconStyle} className={iconClass} />,
  },
  {
    component: CNavItem,
    name: 'Activity Logs',
    to: '/admin/activity-logs',
    icon: <HistoryOutlined style={iconStyle} className={iconClass} />,
  },
]

// ─── Role-based nav selector ──────────────────────────────────────────────────
const navByRole = {
  Admin: adminNav,
}

const useNav = (role) => navByRole[role] || []

export default useNav
