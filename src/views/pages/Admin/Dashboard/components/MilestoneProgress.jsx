/* eslint-disable prettier/prettier */
import { Tag, Tooltip } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { ADMIN_MILESTONES } from '../../../../../data/admin.data'

const fmt = (n) => {
  if (n >= 100000) return `${n / 100000}L`
  if (n >= 1000)   return `${n / 1000}K`
  return String(n)
}
const fmtMoney = (v) => `₹${(Number(v) || 0).toLocaleString('en-IN')}`
const fmtDate  = (v) => v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const rewardStatusColor = (s) => {
  if (s === 'Paid')     return 'green'
  if (s === 'Approved') return 'cyan'
  if (s === 'Pending')  return 'orange'
  if (s === 'Rejected') return 'red'
  return 'default'
}

const MilestoneProgress = ({ summary, achievements = {} }) => {
  const currentValue    = summary.totalOrders       ?? 432
  const totalTarget     = 100000
  const activeLogs      = summary.activeDistributors ?? 72
  const totalLogsNeeded = 100
  const milestones      = ADMIN_MILESTONES

  const progressPct = Math.min((currentValue / totalTarget) * 100, 100)
  const nextIdx       = milestones.findIndex((m) => m > currentValue)
  const nextMilestone = nextIdx !== -1 ? milestones[nextIdx] : milestones[milestones.length - 1]

  const achievementList    = achievements.achievements    || []
  const totalAchievements  = achievements.totalAchievements  || achievementList.length
  const pendingRewardAmt   = achievements.pendingRewardAmount || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Existing progress bar card ── */}
      {/* <div style={{
        background: '#f7f5ef',
        borderRadius: 14,
        padding: '18px 24px 20px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20,
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>
            Milestone progress
          </span>
          <span style={{
            background: '#fef9c3', color: '#713f12',
            fontSize: 11, fontWeight: 600,
            padding: '3px 12px', borderRadius: 20,
            border: '1px solid #fde68a',
          }}>
            {activeLogs}/{totalLogsNeeded} active distributors
          </span>
        </div>

        <div style={{ position: 'relative', height: 56, marginBottom: 8 }}>
          <div style={{
            position: 'absolute',
            top: 20, left: 12, right: 12,
            height: 3, background: '#d9d3c0', borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0,
              width: `${progressPct}%`,
              height: '100%',
              background: '#c8a000',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          </div>

          {milestones.map((m, i) => {
            const pct     = ((i + 1) / milestones.length) * 100
            const reached = currentValue >= m
            return (
              <Tooltip key={m} title={`${Number(m).toLocaleString('en-IN')} orders`} placement="top">
                <div style={{
                  position: 'absolute',
                  left: `calc(${pct}% - 10px)`,
                  top: 11,
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: reached
                    ? 'radial-gradient(circle, #d4a017 40%, #a07800 100%)'
                    : '#f0ede3',
                  border: `2px solid ${reached ? '#c8a000' : '#c8c0a0'}`,
                  zIndex: 2, cursor: 'default',
                  boxShadow: reached ? '0 1px 4px rgba(200,160,0,0.4)' : 'none',
                }} />
              </Tooltip>
            )
          })}

          {milestones.map((m, i) => {
            const pct = ((i + 1) / milestones.length) * 100
            return (
              <div key={m} style={{
                position: 'absolute',
                left: `calc(${pct}% - 12px)`,
                top: 38,
                fontSize: 10, color: '#9ca3af',
                width: 28, textAlign: 'center',
                userSelect: 'none', letterSpacing: -0.3,
              }}>
                {fmt(m)}
              </div>
            )
          })}
        </div>

        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, marginTop: 4, marginBottom: 10 }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: '#3d8c5e',
            borderRadius: 2,
            transition: 'width 0.6s ease',
          }} />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 4,
          fontSize: 12, color: '#6b7280',
        }}>
          <span>
            <strong style={{ color: '#111827' }}>{currentValue.toLocaleString('en-IN')}</strong> total orders of 1,00,000
          </span>
          <span>Track platform-wide order milestones</span>
          <span>Next milestone at {nextMilestone.toLocaleString('en-IN')} orders</span>
        </div>
      </div> */}

      {/* {achievementList.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: '18px 20px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16,
            flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrophyOutlined style={{ color: '#f59e0b' }} />
              Milestone Achievements
              <span style={{
                fontSize: 12, fontWeight: 600, color: '#042954',
                background: '#eff6ff', padding: '2px 10px',
                borderRadius: 20, border: '1px solid #bfdbfe',
                marginLeft: 4,
              }}>
                {totalAchievements} total
              </span>
            </span>
            {pendingRewardAmt > 0 && (
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#92400e',
                background: '#fffbeb', padding: '3px 12px',
                borderRadius: 20, border: '1px solid #fde68a',
              }}>
                Pending Reward: {fmtMoney(pendingRewardAmt)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {achievementList.map((a) => (
              <div key={a._id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: 10,
                padding: '10px 14px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#fef3c7', border: '2px solid #fde68a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <TrophyOutlined style={{ color: '#d97706', fontSize: 16 }} />
                </div>

                <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                    {a.milestoneTitle}
                    <Tag style={{ marginLeft: 6, fontSize: 10 }}>Level {a.milestoneLevel}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                    Code: {a.milestoneCode} &nbsp;·&nbsp; Target: {(a.targetUnit || 0).toLocaleString('en-IN')} units
                  </div>
                </div>

                <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>
                    {a.distributorData?.name || '—'}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {a.distributorData?.userId} &nbsp;·&nbsp; {a.distributorData?.distributorLevel}
                  </div>
                </div>

                <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#374151' }}>
                    <b>{(a.achievedEligibleUnits || 0).toLocaleString('en-IN')}</b> units
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    Team: {a.achievedDirectTeamCount || 0} members
                  </div>
                </div>

                <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#042954' }}>
                    {fmtMoney(a.rewardAmount)}
                  </div>
                  <Tag color={rewardStatusColor(a.rewardStatus)} style={{ marginTop: 2 }}>
                    {a.rewardStatus}
                  </Tag>
                </div>

                <div style={{ flex: '0 0 auto', fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>
                  {fmtDate(a.achievedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

export default MilestoneProgress
