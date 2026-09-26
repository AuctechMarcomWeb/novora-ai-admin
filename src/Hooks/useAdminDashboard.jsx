/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { adminService }   from '../services/admin.service'
import { mastersService } from '../services/masters.service'
import {
  ADMIN_DASHBOARD_SUMMARY,
  ADMIN_RECENT_ORDERS,
  ADMIN_COMMISSION_FLOW,
} from '../data/admin.data'

// ─── Static labels per position (matches image exactly) ──────────────────────
const SLAB_LABELS = [
  'You — Direct Seller',
  'Direct Sponsor',
  'Next Upline',
  'Next Upline',
  'Next Upline',
  'Remaining, up to A',
]

// ─── Bar colours per position (matches image exactly) ────────────────────────
const SLAB_COLORS = [
  '#2b7a5e', // pos 0 — dark green
  '#a0522d', // pos 1 — brown
  '#c0392b', // pos 2 — red
  '#c0392b', // pos 3 — red
  '#c0392b', // pos 4 — red
  '#b0a070', // pos 5 — olive/tan
  '#c8b400', // pos 6 — yellow
]

/**
 * Transforms commission-slab API response → commFlow format
 * { label, percent, amount, color }
 * Label = static (from SLAB_LABELS), values = dynamic from API
 */
const transformSlabs = (slabs = []) => {
  const rows = [...slabs]
    .filter((s) => s.isActive)
    .sort((a, b) => (a.order ?? a.level ?? 0) - (b.order ?? b.level ?? 0))
    .map((slab, idx) => {
      const pct = slab.commissionPercentage ?? 0
      return {
        label:   SLAB_LABELS[idx] ?? `Level ${slab.level}`,  // static
        percent: pct,                                          // dynamic
        amount:  parseFloat(((pct / 100) * 100).toFixed(1)),  // dynamic
        color:   SLAB_COLORS[idx] ?? '#9ca3af',
      }
    })

  // Always append static A+ / Leader row after all API slabs
  rows.push({
    label:   'A+ / Leader',
    percent: 0.5,
    amount:  0.5,
    color:   '#c8b400',
  })

  return rows
}

/**
 * useAdminDashboard
 * Fetches all data for Admin Dashboard.
 * Falls back to static data if API unavailable.
 */
const useAdminDashboard = () => {
  const [summary,      setSummary]      = useState(ADMIN_DASHBOARD_SUMMARY)
  const [recentOrders, setRecentOrders] = useState(ADMIN_RECENT_ORDERS)
  const [commFlow,     setCommFlow]     = useState(ADMIN_COMMISSION_FLOW)
  const [achievements, setAchievements] = useState({ achievements: [], totalAchievements: 0, pendingRewardAmount: 0 })
  const [loading,      setLoading]      = useState(false)

  useEffect(() => {
    setLoading(true)
    const safe = (promise, setter) =>
      promise
        .then((res) => { if (res?.data?.data) setter(res.data.data) })
        .catch(() => {})

    Promise.allSettled([
      // Dashboard summary — map API fields to summary state
      adminService.getDashboardSummary()
        .then((res) => {
          const d = res?.data?.data
          if (!d) return
          setSummary((prev) => ({
            ...prev,
            totalCustomers:          d.totalCustomers             ?? prev.totalCustomers,
            totalDistributors:       d.totalDistributors          ?? prev.totalDistributors,
            activeDistributors:      d.totalActiveDistributors    ?? prev.activeDistributors,
            totalRevenue:            d.totalBusinessAmount        ?? prev.totalRevenue,
            totalCommission:         d.totalCommissionDistributed ?? prev.totalCommission,
            totalOrders:             d.totalOrders                ?? prev.totalOrders,
            pendingPayout:           d.payoutSummary?.pendingPayout    ?? prev.pendingPayout,
            paidPayout:              d.payoutSummary?.paidPayout       ?? prev.paidPayout,
            totalPayoutGenerated:    d.payoutSummary?.totalPayoutGenerated ?? prev.totalPayoutGenerated,
            totalUnitSale:           d.totalUnitSale              ?? prev.totalUnitSale,
          }))
        })
        .catch(() => {}),
      safe(adminService.getRecentOrders(),     setRecentOrders),
      safe(adminService.getAllAchievements(),  setAchievements),
      // Fetch slabs from commission-slab API and transform for CommissionFlow UI
      mastersService.getCommissionSlabs('?page=1&limit=50&sortBy=order&isPagination=true')
        .then((res) => {
          const d     = res?.data?.data
          const slabs = d?.commissionSlabs ?? (Array.isArray(d) ? d : [])
          if (slabs.length > 0) setCommFlow(transformSlabs(slabs))
          // else ADMIN_COMMISSION_FLOW fallback stays
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  return { summary, recentOrders, commFlow, achievements, loading }
}

export default useAdminDashboard
