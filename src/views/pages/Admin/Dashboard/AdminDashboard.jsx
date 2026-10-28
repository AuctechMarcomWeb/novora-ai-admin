/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import {
  Row, Col, Card, Statistic, Table, Tag, Select,
  DatePicker, Badge, Typography, Spin,
} from 'antd'
import {
  BankOutlined, BookOutlined, RobotOutlined,
  LoginOutlined, FileTextOutlined, QuestionCircleOutlined,
  FormOutlined, DesktopOutlined, ArrowUpOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { getRequest } from '../../../../Helpers'

const { Title, Text } = Typography

// ── Action tag config ─────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  login:               { color: 'green',   label: 'Login',         icon: <LoginOutlined /> },
  login_failed:        { color: 'red',     label: 'Login Failed',  icon: <LoginOutlined /> },
  analyze_book:        { color: 'blue',    label: 'Book Analyze',  icon: <BookOutlined /> },
  lesson_plan:         { color: 'purple',  label: 'Lesson Plan',   icon: <FileTextOutlined /> },
  generate_mcq:        { color: 'orange',  label: 'MCQ',           icon: <QuestionCircleOutlined /> },
  generate_assignment: { color: 'cyan',    label: 'Assignment',    icon: <FormOutlined /> },
  generate_worksheet:  { color: 'magenta', label: 'Worksheet',     icon: <DesktopOutlined /> },
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, suffix, loading }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: 14,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      height: '100%',
    }}
    bodyStyle={{ padding: '20px 22px' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{title}</Text>
        <div style={{ marginTop: 6 }}>
          {loading ? (
            <Spin size="small" />
          ) : (
            <Statistic
              value={value ?? 0}
              suffix={suffix}
              valueStyle={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}
            />
          )}
        </div>
      </div>
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </Card>
)

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null)
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [logPage, setLogPage] = useState({ current: 1, pageSize: 8, total: 0 })

  // Fetch dashboard stats from real APIs
  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchLogs(1, 8)
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [schoolsRes, booksRes, logsRes] = await Promise.allSettled([
        getRequest('schools?isPagination=false'),
        getRequest('books?isPagination=false'),
        getRequest('school-logs?isPagination=false'),
      ])

      const schools = schoolsRes.status === 'fulfilled' ? schoolsRes.value?.data?.data?.schools || [] : []
      const books   = booksRes.status   === 'fulfilled' ? booksRes.value?.data?.data?.books     || [] : []
      const allLogs = logsRes.status    === 'fulfilled' ? logsRes.value?.data?.data?.logs        || [] : []

      // Compute stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const aiLogs     = allLogs.filter(l => l.category === 'ai')
      const loginLogs  = allLogs.filter(l => l.action === 'login' && l.status === 'success')
      const todayLogins = loginLogs.filter(l => new Date(l.createdAt) >= today)

      setStats({
        totalSchools:    schools.length,
        activeSchools:   schools.filter(s => !s.isNew).length,
        inactiveSchools: schools.filter(s => s.isNew).length,
        totalBooks:      books.length,
        activeBooks:     books.filter(b => b.activeStatus).length,
        totalAI:         aiLogs.length,
        lessonPlans:     aiLogs.filter(l => l.action === 'lesson_plan').length,
        mcqs:            aiLogs.filter(l => l.action === 'generate_mcq').length,
        worksheets:      aiLogs.filter(l => l.action === 'generate_worksheet').length,
        assignments:     aiLogs.filter(l => l.action === 'generate_assignment').length,
        recentLogins:    loginLogs.length,
        todayLogins:     todayLogins.length,
      })
    } catch {
      // keep null stats — StatCards show 0
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async (page = 1, limit = 8) => {
    try {
      const res = await getRequest(`school-logs?page=${page}&limit=${limit}`)
      const data = res?.data?.data
      setLogs(data?.logs || [])
      setLogPage(p => ({ ...p, current: page, total: data?.total || 0 }))
    } catch {
      setLogs([])
    }
  }

  // Stat cards config
  const cards = [
    { title: 'Total Schools',       value: stats?.totalSchools,    icon: <BankOutlined />,            color: '#1890ff' },
    { title: 'Active Schools',      value: stats?.activeSchools,   icon: <BankOutlined />,            color: '#52c41a' },
    { title: 'Inactive Schools',    value: stats?.inactiveSchools, icon: <BankOutlined />,            color: '#fa8c16' },
    { title: 'Total Books',         value: stats?.totalBooks,      icon: <BookOutlined />,            color: '#722ed1' },
    { title: 'Active Books',        value: stats?.activeBooks,     icon: <BookOutlined />,            color: '#52c41a' },
    { title: 'AI Content Generated',value: stats?.totalAI,         icon: <RobotOutlined />,           color: '#eb2f96' },
    { title: 'Lesson Plans',        value: stats?.lessonPlans,     icon: <FileTextOutlined />,        color: '#722ed1' },
    { title: 'Worksheets',          value: stats?.worksheets,      icon: <DesktopOutlined />,         color: '#13c2c2' },
    { title: 'MCQs',                value: stats?.mcqs,            icon: <QuestionCircleOutlined />,  color: '#fa8c16' },
    { title: 'Assignments',         value: stats?.assignments,     icon: <FormOutlined />,            color: '#1890ff' },
    { title: 'Total Logins',        value: stats?.recentLogins,    icon: <LoginOutlined />,           color: '#52c41a' },
    { title: "Today's Logins",      value: stats?.todayLogins,     icon: <LoginOutlined />,           color: '#eb2f96' },
  ]

  // Recent activity table columns
  const columns = [
    {
      title: 'School',
      key: 'school',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
            {r.schoolRef?.name || '—'}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            ID: {r.schoolRef?.userId || '—'}
          </div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 160,
      render: (action) => {
        const cfg = ACTION_CONFIG[action] || { color: 'default', label: action }
        return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>
      },
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
      width: 100,
      align: 'center',
      render: (v) => (
        <Badge
          status={v === 'success' ? 'success' : 'error'}
          text={<span style={{ fontSize: 12, textTransform: 'capitalize' }}>{v}</span>}
        />
      ),
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v) => (
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(v).toLocaleString('en-IN', {
            day: '2-digit', month: 'short',
            hour: '2-digit', minute: '2-digit',
          })}
        </div>
      ),
    },
  ]

  return (
    <div style={{ padding: '0 0 24px' }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #042954 0%, #0d4a8a 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        color: '#fff',
      }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          Welcome back, Admin 👋
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
          Here's what's happening with Novora AI today
        </Text>
      </div>

      {/* Stats Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {cards.map((card, i) => (
          <Col xs={12} sm={8} md={6} lg={4} key={i}>
            <StatCard {...card} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* Recent Activity */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 700 }}>Recent School Activity</span>
          </div>
        }
        bordered={false}
        style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="_id"
          size="small"
          pagination={{
            ...logPage,
            showTotal: (t) => `Total ${t} logs`,
            onChange: (page, size) => fetchLogs(page, size),
          }}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  )
}

export default AdminDashboard
