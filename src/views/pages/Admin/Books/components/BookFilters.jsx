/* eslint-disable prettier/prettier */
import { Card, Row, Col, Input, Button, Select, Space } from 'antd'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'

const BookFilters = ({
  showDeleted, classes, subjects,
  onSearch, onRefresh, onToggleDeleted, onAdd,
  onClassFilter, onSubjectFilter, onStatusFilter,
}) => (
  <Card
    style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
    bodyStyle={{ padding: '16px 20px' }}
  >
    <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
      <SearchOutlined style={{ fontSize: 15, color: '#1890ff' }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Filters &amp; Search</span>
    </div>

    <Row gutter={[12, 12]} align="middle">
      {/* Search */}
      <Col xs={24} sm={12} md={7}>
        <Input
          placeholder="Search by title or summary..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      {/* Class filter */}
      {!showDeleted && (
        <Col xs={12} sm={8} md={4}>
          <Select
            placeholder="Class"
            allowClear
            style={{ width: '100%' }}
            onChange={(v) => onClassFilter(v ?? '')}
            options={classes.map((c) => ({ label: c.className, value: c._id }))}
          />
        </Col>
      )}

      {/* Subject filter */}
      {!showDeleted && (
        <Col xs={12} sm={8} md={4}>
          <Select
            placeholder="Subject"
            allowClear
            style={{ width: '100%' }}
            onChange={(v) => onSubjectFilter(v ?? '')}
            options={subjects.map((s) => ({ label: s.subjectName, value: s._id }))}
          />
        </Col>
      )}

      {/* Status filter */}
      {!showDeleted && (
        <Col xs={12} sm={8} md={3}>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: '100%' }}
            onChange={(v) => onStatusFilter(v ?? '')}
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </Col>
      )}

      {/* Buttons */}
      <Col xs={24} sm={24} md={showDeleted ? 17 : 6}>
        <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>Refresh</Button>
          <Button
            type={showDeleted ? 'default' : 'primary'}
            danger={showDeleted}
            onClick={onToggleDeleted}
          >
            {showDeleted ? 'Show Active' : 'Show Deleted'}
          </Button>
          {!showDeleted && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Add Book
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  </Card>
)

export default BookFilters
