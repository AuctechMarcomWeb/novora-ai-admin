/* eslint-disable prettier/prettier */
import { Table, Button, Space, Tag, Switch, Tooltip, Popconfirm, Image } from 'antd'
import {
  EditOutlined, DeleteOutlined, EyeOutlined,
  RestOutlined, CloseCircleOutlined, FilePdfOutlined, PictureOutlined,
} from '@ant-design/icons'

const BookTable = ({
  books, loading, pagination, showDeleted,
  onTableChange, onView, onEdit, onDelete,
  onRestore, onPermanentDelete, onToggleStatus,
}) => {
  const columns = [
    {
      title: 'Sr.No.',
      key: 'index',
      width: 65,
      render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'Cover',
      key: 'cover',
      width: 70,
      align: 'center',
      render: (_, record) =>
        record.coverImage ? (
          <Image
            src={record.coverImage}
            width={42}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
            preview={{ mask: <EyeOutlined style={{ fontSize: 12 }} /> }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div style={{
            width: 42, height: 56, borderRadius: 4,
            background: '#f5f5f5', border: '1px dashed #d9d9d9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PictureOutlined style={{ color: '#d9d9d9', fontSize: 16 }} />
          </div>
        ),
    },
    {
      title: 'Book Info',
      key: 'bookInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{record.title}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
            {record.classRef?.className} &nbsp;|&nbsp; {record.subjectRef?.subjectName}
          </div>
          {record.summary && (
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {record.summary.length > 80 ? record.summary.substring(0, 80) + '...' : record.summary}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Chapters',
      key: 'chapters',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Tag color="blue">{record.chapters?.length || 0} ch.</Tag>
      ),
    },
    {
      title: 'PDF',
      key: 'pdf',
      width: 70,
      align: 'center',
      render: (_, record) =>
        record.pdfUrl ? (
          <Tooltip title="Open PDF">
            <Button
              type="link"
              icon={<FilePdfOutlined style={{ color: '#ef4444', fontSize: 18 }} />}
              href={record.pdfUrl}
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
          checkedChildren="✓"
          unCheckedChildren="✕"
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
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) =>
        showDeleted ? (
          <Space size="small">
            <Tooltip title="Restore">
              <Button type="primary" icon={<RestOutlined />} size="small" onClick={() => onRestore(record._id)} />
            </Tooltip>
            <Popconfirm
              title="Permanently delete this book?"
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
            <Tooltip title="View">
              <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
            </Tooltip>
            <Tooltip title="Edit">
              <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
            </Tooltip>
            <Popconfirm
              title="Delete this book?"
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
      dataSource={books}
      rowKey="_id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (t) => `Total ${t} books`,
        pageSizeOptions: ['10', '20', '50'],
      }}
      onChange={onTableChange}
      scroll={{ x: 900 }}
    />
  )
}

export default BookTable
