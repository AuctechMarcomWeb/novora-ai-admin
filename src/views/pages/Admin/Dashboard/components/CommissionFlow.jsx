/* eslint-disable prettier/prettier */

/**
 * CommissionFlow — "How ₹100 flows on your sale"
 * Data comes from commission-slab API via useAdminDashboard hook.
 * flow: [{ label, percent, amount, color }]
 */
const CommissionFlow = ({ flow = [] }) => {
  const maxPct = flow.length > 0 ? Math.max(...flow.map((f) => f.percent)) : 1

  return (
    <div
      style={{
        background:   '#fff',
        borderRadius: 14,
        padding:      '18px 20px 20px',
        boxShadow:    '0 1px 6px rgba(0,0,0,0.07)',
        height:       '100%',
      }}
    >
      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 16 }}>
        How ₹100 flows on your sale
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {flow.map((item, i) => {
          // bar width relative to the highest percentage (max = ~90% of track)
          const barW = maxPct > 0 ? Math.max((item.percent / maxPct) * 90, 1.5) : 1.5

          return (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              {/* Coloured dot */}
              <span
                style={{
                  width:        9,
                  height:       9,
                  borderRadius: '50%',
                  background:   item.color,
                  flexShrink:   0,
                }}
              />

              {/* Label — API title */}
              <div
                style={{
                  width:        150,
                  fontSize:     13,
                  color:        '#374151',
                  flexShrink:   0,
                  lineHeight:   1.3,
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                }}
              >
                {item.label}
              </div>

              {/* Bar track */}
              <div
                style={{
                  flex:         1,
                  height:       18,
                  background:   '#f0ede4',
                  borderRadius: 4,
                  overflow:     'hidden',
                }}
              >
                <div
                  style={{
                    width:        `${barW}%`,
                    height:       '100%',
                    background:   item.color,
                    borderRadius: 4,
                    transition:   'width 0.5s ease',
                  }}
                />
              </div>

              {/* Percent · ₹amount */}
              <div
                style={{
                  minWidth:   80,
                  fontSize:   13,
                  color:      '#374151',
                  textAlign:  'right',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.percent}%</span>
                <span style={{ color: '#9ca3af' }}> · ₹{item.amount}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop:    16,
          padding:      '10px 14px',
          background:   '#f9fafb',
          border:       '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize:     12,
          color:        '#6b7280',
          lineHeight:   1.6,
        }}
      >
        If the full chain is not available, unpaid portions remain with the company.
        No commission on failed, cancelled or refunded orders.
      </div>
    </div>
  )
}

export default CommissionFlow
