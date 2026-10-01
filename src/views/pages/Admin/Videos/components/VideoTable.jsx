/* eslint-disable prettier/prettier */
import { Table, Button, Space, Tag, Switch, Tooltip, Popconfirm } from 'antd'
import {
  EditOutlined, DeleteOutlined, RestOutlined,
  CloseCircleOutlined, PlayCircleOutlined,
} from '@ant-design/icons'

const VideoTable = ({
  videos, loading, pagination, showDeleted,
  onTableChange, onEdit, onDelete, onRestore, onPermanentDelete, onToggleStatus,
}) => {
  const columns = [
    {
      title: 'Sr.No.',
      key: 'index',
      width: 65,
      render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'Chapter',
      key: 'chapter',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
            Ch. {record.chapterNumber} — {record.chapterTitle || '—'}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
            {record.bookRef?.title || '—'}
          </div>
        </div>
      ),
    },
    {
      title: 'Class / Subject',
      key: 'classSubject',
      width: 160,
      render: (_, record) => (
        <div>
          <Tag color="blue"  style={{ fontSize: 11 }}>{record.classRef?.className   || '—'}</Tag>
          <Tag color="green" style={{ fontSize: 11 }}>{record.subjectRef?.subjectName || '—'}</Tag>
        </div>
      ),
    },
    {
      title: 'Video',
      key: 'video',
      width: 80,
      align: 'center',
      render: (_, record) =>
        record.videoUrl ? (
          <Tooltip title="Play video">
            <Button
              type="link"
              icon={<PlayCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
              href={record.videoUrl}
              target="_blank"
            />
          </Tooltip>
        ) : '—',
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) =>
        showDeleted ? (
          <Tag color="red">Deleted</Tag>
        ) : (
          <Tag color={record.activeStatus ? 'green' : 'orange'}>
            {record.activeStatus ? 'Active' : 'Inactive'}
          </Tag>
        ),
    },
    {
      title: 'Toggle',
      key: 'toggle',
      width: 80,
      align: 'center',
      hidden: showDeleted,
      render: (_, record) => (
        <Switch
          checked={record.activeStatus}
          onChange={() => onToggleStatus(record._id)}
          checkedChildren="✓" unCheckedChildren="✕"
          size="small"
        />
      ),
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (d) => new Date(d).toLocaleDateString('en-GB'),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) =>
        showDeleted ? (
          <Space size="small">
            <Tooltip title="Restore">
              <Button type="primary" icon={<RestOutlined />} size="small" onClick={() => onRestore(record._id)} />
            </Tooltip>
            <Popconfirm
              title="Permanently delete this video?"
              description="This cannot be undone."
              onConfirm={() => onPermanentDelete(record._id)}
              okText="Yes" cancelText="No" okButtonProps={{ danger: true }}
            >
              <Tooltip title="Delete Permanently">
                <Button danger icon={<CloseCircleOutlined />} size="small" />
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="Edit">
              <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
            </Tooltip>
            <Popconfirm
              title="Delete this video?"
              onConfirm={() => onDelete(record._id)}
              okText="Yes" cancelText="No"
            >
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
    },
  ].filter((c) => !c.hidden)

  return (
    <Table
      columns={columns}
      dataSource={videos}
      rowKey="_id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (t) => `Total ${t} videos`,
        pageSizeOptions: ['10', '20', '50'],
      }}
      onChange={onTableChange}
      scroll={{ x: 850 }}
    />
  )
}

export default VideoTable
