/* eslint-disable prettier/prettier */
import { Col, Row } from 'antd'

/**
 * Admin Component 1 — Row 1: 4 info cards
 * Total Customers | Total Distributors | Total Revenue | Total Commission
 */

const cardStyle = {
  background: '#fff',
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  marginBottom: 4,
}

const IconCircle = ({ bg, children }) => (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    {children}
  </div>
)

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" stroke="#2b6cb0" strokeWidth="2"/>
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2" stroke="#2b6cb0" strokeWidth="2"/>
    <path d="M21 19c0-2-1.5-3.5-4-4" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l1-5h16l1 5" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="#4a7c59" strokeWidth="2"/>
    <path d="M9 9v4a3 3 0 006 0V9" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const RevenueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7 4h10l-5 8-5-8z" stroke="#c05621" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <path d="M7 20h10l-5-8-5 8z" stroke="#c05621" strokeWidth="2" strokeLinejoin="round" fill="none"/>
  </svg>
)

const CommIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const fmt = (n) => {
  if (typeof n === 'string') return n
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`
  return `₹${Number(n).toLocaleString('en-IN')}`
}

const InfoCards = ({ summary }) => {
  const {
    totalCustomers          = 0,
    totalDistributors       = 0,
    activeDistributors      = 0,
    totalRevenue            = 0,
    totalCommission         = 0,
  } = summary

  const cards = [
    {
      label: 'TOTAL CUSTOMERS',
      icon:  <IconCircle bg="#dbeafe"><UsersIcon /></IconCircle>,
      main:  <span style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{Number(totalCustomers).toLocaleString('en-IN')}</span>,
      sub:   <span style={{ fontSize: 12, color: '#6b7280' }}>Registered on platform</span>,
    },
    {
      label: 'TOTAL DISTRIBUTORS',
      icon:  <IconCircle bg="#d1fae5"><ShopIcon /></IconCircle>,
      main:  <span style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{Number(totalDistributors).toLocaleString('en-IN')}</span>,
      sub:   <span style={{ fontSize: 12, color: '#6b7280' }}>{activeDistributors} active distributors</span>,
    },
    {
      label: 'TOTAL REVENUE',
      icon:  <IconCircle bg="#fee2e2"><RevenueIcon /></IconCircle>,
      main:  <span style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{fmt(totalRevenue)}</span>,
      sub:   <span style={{ fontSize: 12, color: '#6b7280' }}>All-time sales value</span>,
    },
    {
      label: 'TOTAL COMMISSION',
      icon:  <IconCircle bg="#fef3c7"><CommIcon /></IconCircle>,
      main:  <span style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{fmt(totalCommission)}</span>,
      sub:   <span style={{ fontSize: 12, color: '#6b7280' }}>Distributed to network</span>,
    },
  ]

  return (
    <Row gutter={[14, 14]}>
      {cards.map((c, i) => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={labelStyle}>{c.label}</div>
              {c.icon}
            </div>
            <div style={{ marginTop: 6 }}>{c.main}</div>
            <div style={{ marginTop: 6 }}>{c.sub}</div>
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default InfoCards
