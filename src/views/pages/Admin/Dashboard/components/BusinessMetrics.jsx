/* eslint-disable prettier/prettier */
import { Col, Row } from 'antd'

/**
 * Admin Component 2 — Row 2: 4 business metric cards
 * Total Orders | Active Distributors | Pending Payout | Paid Payout
 */

const fmt = (n) => {
  if (typeof n === 'string') return n
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `${(n / 1000).toFixed(1)}K`
  return Number(n).toLocaleString('en-IN')
}

const fmtRs = (n) => {
  if (typeof n === 'string') return n
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`
  return `₹${Number(n).toLocaleString('en-IN')}`
}

const MetricCard = ({ label, value, unit, sub }) => (
  <div style={{
    background: '#fff',
    borderRadius: 14,
    padding: '18px 20px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
    height: '100%',
  }}>
    <div style={{
      fontSize: 10, fontWeight: 700, color: '#9ca3af',
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
    }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
        {value}
      </span>
      {unit && <span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{sub}</div>}
  </div>
)

const BusinessMetrics = ({ summary }) => {
  const {
    totalOrders             = 0,
    activeDistributors      = 0,
    pendingPayout           = 0,
    paidPayout              = 0,
  } = summary

  return (
    <Row gutter={[14, 14]}>
      <Col xs={12} sm={12} lg={6}>
        <MetricCard
          label="TOTAL ORDERS"
          value={fmt(totalOrders)}
          sub="All orders placed"
        />
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <MetricCard
          label="ACTIVE DISTRIBUTORS"
          value={fmt(activeDistributors)}
          sub="Currently active in network"
        />
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <MetricCard
          label="PENDING PAYOUT"
          value={fmtRs(pendingPayout)}
          sub="Awaiting disbursement"
        />
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <MetricCard
          label="PAID PAYOUT"
          value={fmtRs(paidPayout)}
          sub="Successfully disbursed"
        />
      </Col>
    </Row>
  )
}

export default BusinessMetrics
