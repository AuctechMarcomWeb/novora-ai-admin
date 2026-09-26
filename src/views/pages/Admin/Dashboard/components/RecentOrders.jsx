/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { Spin }                from 'antd'
import { ordersService }       from '../../../../../services/orders.service'

const STATUS_DOT = {
  Placed:     '#1677ff',
  Processing: '#0891b2',
  Shipped:    '#7c3aed',
  Delivered:  '#10b981',
  Cancelled:  '#ef4444',
  Pending:    '#f59e0b',
  Completed:  '#10b981',
}

const fmtDate = (v) => v ? new Date(v).toLocaleDateString('en-IN') : '—'

const RecentOrders = () => {
  const navigate              = useNavigate()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    ordersService.getAll('?page=1&limit=6&sortBy=createdAt&sortOrder=desc')
      .then((res) => {
        const d    = res?.data?.data
        const list = Array.isArray(d) ? d : (d?.orders ?? d?.data ?? [])
        setOrders(list.slice(0, 6))
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{
      background:    '#fff',
      borderRadius:  14,
      boxShadow:     '0 1px 6px rgba(0,0,0,0.07)',
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '16px 20px 12px',
        borderBottom:   '1px solid #f3f4f6',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
          Recent Orders
        </span>
        <span
          onClick={() => navigate('/admin/orders')}
          style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer', fontWeight: 500 }}
        >
          View all
        </span>
      </div>

      {/* Body */}
      {loading ? (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          No recent orders
        </div>
      ) : (
        orders.map((o, i) => {
          const status   = o.orderStatus || o.status || 'Placed'
          const dotColor = STATUS_DOT[status] || '#9ca3af'
          const name     = o.buyerName || o.customerName || o.customer
                         || o.buyer?.name || o.userId?.name || '—'
          const orderId  = o.orderId || o._id || '—'
          const amount   = Number(o.totalAmount || o.amount || 0).toLocaleString('en-IN')

          return (
            <div
              key={o._id || i}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '10px 20px',
                borderBottom:   '1px solid #f3f4f6',
              }}
            >
              {/* Left */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: dotColor, marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 13, color: '#111827',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {name}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    {o.orderNumber} · {fmtDate(o.createdAt)}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div style={{ flexShrink: 0, marginLeft: 12, textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                  ₹{amount}
                </div>
                <div style={{ fontSize: 11, color: dotColor, fontWeight: 500, marginTop: 1 }}>
                  {status}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default RecentOrders
