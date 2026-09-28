/* eslint-disable prettier/prettier */
import { Card, Table, Tag, Space, Typography } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'

const { Title } = Typography

const RecentActivity = ({ activities }) => {
  const getActionColor = (action) => {
    const colorMap = {
      created: 'green',
      updated: 'blue',
      deleted: 'red',
      viewed: 'purple',
      downloaded: 'orange',
      uploaded: 'cyan',
    }
    return colorMap[action?.toLowerCase()] || 'default'
  }

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space>
          <UserOutlined />
          <span>{user}</span>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => <Tag color={getActionColor(action)}>{action}</Tag>,
    },
    {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => (
        <Space>
          <ClockCircleOutlined />
          <span>{timestamp}</span>
        </Space>
      ),
    },
  ]

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Title level={5} style={{ marginBottom: 16 }}>
        Recent Activity
      </Title>
      <Table
        columns={columns}
        dataSource={activities || []}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} activities`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  )
}

export default RecentActivity
