/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from 'react'
import {
  Card, Row, Col, Table, Select, DatePicker, Button, Tag,
  Typography, Statistic, Space, Tooltip, Drawer, Descriptions,
  Badge, message,
} from 'antd'
import {
  ReloadOutlined, SearchOutlined, LoginOutlined,
  RobotOutlined, EyeOutlined, FilterOutlined,
} from '@ant-design/icons'
import { schoolLogService } from '../../../../services/schoolLog.service'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// ── Action tag config ─────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  login:               { color: 'green',   label: 'Login',            icon: '🔐' },
  login_failed:        { color: 'red',     label: 'Login Failed',     icon: '🚫' },
  analyze_book:        { color: 'blue',    label: 'Book Analyze',     icon: '📖' },
  lesson_plan:         { color: 'purple',  label: 'Lesson Plan',      icon: '📋' },
  generate_mcq:        { color: 'orange',  label: 'MCQ',              icon: '❓' },
  generate_assignment: { color: 'cyan',    label: 'Assignment',       icon: '📝' },
  generate_worksheet:  { color: 'magenta', label: 'Worksheet',        icon: '📄' },
}

const ActionTag = ({ action }) => {
  const cfg = ACTION_CONFIG[action] || { color: 'default', label: action, icon: '•' }
  return (
    <Tag color={cfg.color} style={{ fontSize: 12 }}>
      {cfg.icon} {cfg.label}
    </Tag>
  )
}

// ── Summary cards ─────────────────────────────────────────────────────────────
const SummaryCards = ({ summary }) => (
  <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
    {[
      { title: 'Total Logins',     value: summary.totalLogins     ?? 0, color: '#52c41a', icon: '🔐' },
      { title: 'AI Actions',       value: summary.totalAiActions  ?? 0, color: '#1890ff', icon: '🤖' },
      { title: 'Lesson Plans',     value: summary.aiBreakdown?.lesson_plan         ?? 0, color: '#722ed1', icon: '📋' },
      { title: 'MCQs',             value: summary.aiBreakdown?.generate_mcq        ?? 0, color: '#fa8c16', icon: '❓' },
      { title: 'Assignments',      value: summary.aiBreakdown?.generate_assignment ?? 0, color: '#13c2c2', icon: '📝' },
      { title: 'Worksheets',       value: summary.aiBreakdown?.generate_worksheet  ?? 0, color: '#eb2f96', icon: '📄' },
    ].map((card) => (
      <Col xs={12} sm={8} md={4} key={card.title}>
        <Card
          size="small"
          bordered={false}
          style={{ borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}
        >
          <div style={{ fontSize: 22 }}>{card.icon}</div>
          <Statistic
            title={<span style={{ fontSize: 11, color: '#6b7280' }}>{card.title}</span>}
            value={card.value}
            valueStyle={{ fontSize: 20, fontWeight: 700, color: card.color }}
          />
        </Card>
      </Col>
    ))}
  </Row>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const SchoolLogs = () => {
  const [logs, setLogs]               = useState([])
  const [schools, setSchools]         = useState([])
  const [summary, setSummary]         = useState({})
  const [loading, setLoading]         = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [pagination, setPagination]   = useState({ current: 1, pageSize: 20, total: 0 })

  // Filters
  const [schoolFilter, setSchoolFilter]   = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [actionFilter, setActionFilter]   = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [dateRange, setDateRange]         = useState([null, null])

  // Drawer
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  // Load schools list once
  useEffect(() => {
    schoolLogService.getSchools()
      .then((r) => setSchools(r.data.data.schools))
      .catch(() => {})
  }, [])

  // Load summary when school changes
  useEffect(() => {
    if (!schoolFilter) { setSummary({}); return }
    setSummaryLoading(true)
    schoolLogService.getSummary(schoolFilter)
      .then((r) => setSummary(r.data.data))
      .catch(() => {})
      .finally(() => setSummaryLoading(false))
  }, [schoolFilter])

  // Fetch logs
  const fetchLogs = useCallback(async (page = pagination.current, limit = pagination.pageSize) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit })
      if (schoolFilter)   params.set('schoolRef', schoolFilter)
      if (categoryFilter) params.set('category',  categoryFilter)
      if (actionFilter)   params.set('action',    actionFilter)
      if (statusFilter)   params.set('status',    statusFilter)
      if (dateRange[0])   params.set('startDate', dateRange[0].format('YYYY-MM-DD'))
      if (dateRange[1])   params.set('endDate',   dateRange[1].format('YYYY-MM-DD'))

      const res = await schoolLogService.getLogs(`?${params}`)
      setLogs(res.data.data.logs)
      setPagination((p) => ({ ...p, total: res.data.data.total, current: page, pageSize: limit }))
    } catch {
      message.error('Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }, [schoolFilter, categoryFilter, actionFilter, statusFilter, dateRange, pagination.current, pagination.pageSize])

  useEffect(() => {
    fetchLogs(1, pagination.pageSize)
  }, [schoolFilter, categoryFilter, actionFilter, statusFilter, dateRange])

  const handleTableChange = (pag) => fetchLogs(pag.current, pag.pageSize)

  const columns = [
    {
      title: 'School',
      key: 'school',
      width: 180,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
            {r.schoolRef?.name || '—'}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            ID: {r.schoolRef?.userId}
          </div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 160,
      render: (v) => <ActionTag action={v} />,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v) => <span style={{ fontSize: 13, color: '#374151' }}>{v || '—'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (v) => (
        <Badge
          status={v === 'success' ? 'success' : 'error'}
          text={<span style={{ fontSize: 12 }}>{v}</span>}
        />
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ip',
      width: 120,
      render: (v) => <span style={{ fontSize: 12, color: '#6b7280' }}>{v || '—'}</span>,
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (v) => (
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          {new Date(v).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      title: '',
      key: 'detail',
      width: 50,
      align: 'center',
      render: (_, r) => (
        <Tooltip title="View details">
          <Button
            type="text" size="small" icon={<EyeOutlined />}
            onClick={() => { setSelectedLog(r); setDrawerOpen(true) }}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div style={{ padding: '4px 0' }}>

      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>
            🏫 School Activity Logs
          </Title>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Track school logins and AI usage
          </Text>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={() => fetchLogs(1, pagination.pageSize)}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Summary cards (when school selected) */}
      {schoolFilter && Object.keys(summary).length > 0 && (
        <SummaryCards summary={summary} />
      )}

      {/* Filters */}
      <Card
        style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        bodyStyle={{ padding: '14px 20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <FilterOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Filters</span>
        </div>
        <Row gutter={[10, 10]} align="middle">
          {/* School */}
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="All Schools"
              allowClear
              showSearch
              style={{ width: '100%' }}
              filterOption={(inp, opt) => opt.label.toLowerCase().includes(inp.toLowerCase())}
              onChange={(v) => setSchoolFilter(v ?? '')}
              options={schools.map((s) => ({
                label: `${s.name} (${s.userId})`,
                value: s._id,
              }))}
            />
          </Col>

          {/* Category */}
          <Col xs={12} sm={6} md={3}>
            <Select
              placeholder="Category"
              allowClear
              style={{ width: '100%' }}
              onChange={(v) => setCategoryFilter(v ?? '')}
              options={[
                { label: '🔐 Auth', value: 'auth' },
                { label: '🤖 AI',   value: 'ai'   },
              ]}
            />
          </Col>

          {/* Action */}
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Action"
              allowClear
              style={{ width: '100%' }}
              onChange={(v) => setActionFilter(v ?? '')}
              options={Object.entries(ACTION_CONFIG).map(([k, v]) => ({
                label: `${v.icon} ${v.label}`,
                value: k,
              }))}
            />
          </Col>

          {/* Status */}
          <Col xs={12} sm={6} md={3}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              onChange={(v) => setStatusFilter(v ?? '')}
              options={[
                { label: '✅ Success', value: 'success' },
                { label: '❌ Failed',  value: 'failed'  },
              ]}
            />
          </Col>

          {/* Date range */}
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates || [null, null])}
            />
          </Col>

          {/* Clear */}
          <Col xs={12} sm={6} md={3}>
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                setSchoolFilter('')
                setCategoryFilter('')
                setActionFilter('')
                setStatusFilter('')
                setDateRange([null, null])
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} logs`,
            pageSizeOptions: ['20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
          size="small"
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <Space>
            <ActionTag action={selectedLog?.action} />
            <span style={{ fontSize: 14 }}>{selectedLog?.description}</span>
          </Space>
        }
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedLog(null) }}
        width={440}
      >
        {selectedLog && (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="School">
                <strong>{selectedLog.schoolRef?.name}</strong>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ID: {selectedLog.schoolRef?.userId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag>{selectedLog.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <ActionTag action={selectedLog.action} />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={selectedLog.status === 'success' ? 'success' : 'error'}
                  text={selectedLog.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {selectedLog.ipAddress || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {new Date(selectedLog.createdAt).toLocaleString('en-IN')}
              </Descriptions.Item>
            </Descriptions>

            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Metadata
                </Text>
                <div style={{
                  background: '#f9fafb', borderRadius: 8,
                  padding: 12, fontFamily: 'monospace', fontSize: 12,
                  border: '1px solid #f0f0f0',
                }}>
                  {Object.entries(selectedLog.metadata).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 4 }}>
                      <Text type="secondary">{k}: </Text>
                      <Text>{JSON.stringify(v)}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  )
}

export default SchoolLogs
