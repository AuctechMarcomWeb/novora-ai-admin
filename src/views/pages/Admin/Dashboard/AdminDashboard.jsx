/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { Typography, Row, Col, DatePicker, Select } from 'antd'
import { ADMIN_DASHBOARD_SUMMARY, ADMIN_RECENT_ACTIVITY } from '../../../../data/admin.data'
import { SCHOOLS_LIST } from '../../../../data/schools.data'
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from '../../../../data/books.data'
import { CONTENT_TYPE_OPTIONS } from '../../../../data/activity-logs.data'
import SummaryCards from './components/SummaryCards'
import RecentActivity from './components/RecentActivity'

const { Title } = Typography
const { RangePicker } = DatePicker

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: null,
    school: null,
    class: null,
    subject: null,
    book: null,
    contentType: null,
  })

  const summary = ADMIN_DASHBOARD_SUMMARY
  const recentActivity = ADMIN_RECENT_ACTIVITY

  return (
    <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Title level={4} style={{ color: '#111827', margin: 0 }}>
        Dashboard
      </Title>

      {/* Filters Section */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '16px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4}>
            <Select
              placeholder="School"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, school: value })}
              options={SCHOOLS_LIST.map(s => ({ label: s.schoolName, value: s._id }))}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4}>
            <Select
              placeholder="Class"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, class: value })}
              options={CLASS_OPTIONS.map(c => ({ label: c, value: c }))}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4}>
            <Select
              placeholder="Subject"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, subject: value })}
              options={SUBJECT_OPTIONS.map(s => ({ label: s, value: s }))}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4}>
            <Select
              placeholder="Content Type"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, contentType: value })}
              options={CONTENT_TYPE_OPTIONS.map(c => ({ label: c, value: c }))}
            />
          </Col>
        </Row>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  )
}

export default AdminDashboard
