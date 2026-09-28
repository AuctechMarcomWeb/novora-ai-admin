/* eslint-disable prettier/prettier */
import { Table, Button, Space, Tag, Switch, Tooltip, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  RestOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const SchoolTable = ({
  schools,
  loading,
  pagination,
  showDeleted,
  onTableChange,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onPermanentDelete,
  onToggleStatus,
  onCredentials,
}) => {
  const columns = [
    {
      title: "Sr.No.",
      key: "index",
      width: 70,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "School Info",
      key: "schoolInfo",
      width: 230,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#111827" }}>
            {record.name || "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            ID: {record.userId}
          </div>
        </div>
      ),
    },
    {
      title: "Contact Info",
      key: "contactInfo",
      width: 200,
      render: (_, record) => (
        <div>
          {record.email && (
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              📧 {record.email}
            </div>
          )}
          {record.phone && (
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              📞 {record.phone}
            </div>
          )}
          {!record.email && !record.phone && (
            <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
          )}
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 180,
      ellipsis: true,
      render: (text) => text || "—",
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      align: "center",
      render: (_, record) => {
        if (showDeleted) return <Tag color="red">Deleted</Tag>;
        return (
          <Tag color={!record.isNew ? "green" : "orange"}>
            {!record.isNew ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Active",
      key: "activeToggle",
      width: 80,
      align: "center",
      hidden: showDeleted,
      render: (_, record) => (
        <Switch
          checked={!record.isNew}
          onChange={() => onToggleStatus(record._id)}
          checkedChildren="✓"
          unCheckedChildren="✕"
          size="small"
        />
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Action",
      key: "action",
      width: 170,
      align: "center",
      fixed: "right",
      render: (_, record) =>
        showDeleted ? (
          <Space size="small">
            <Tooltip title="Restore">
              <Button
                type="primary"
                icon={<RestOutlined />}
                size="small"
                onClick={() => onRestore(record._id)}
              />
            </Tooltip>
            <Popconfirm
              title="Permanently Delete"
              description="This action cannot be undone."
              onConfirm={() => onPermanentDelete(record._id)}
              okText="Yes, Delete"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Delete Permanently">
                <Button danger icon={<CloseCircleOutlined />} size="small" />
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="View Credentials">
              <Button size="small" onClick={() => onCredentials(record)}>
                🔑
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onView(record)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Delete School"
              description="Are you sure you want to delete this school?"
              onConfirm={() => onDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
    },
  ].filter((col) => !col.hidden);

  return (
    <Table
      columns={columns}
      dataSource={schools}
      rowKey="_id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} schools`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={onTableChange}
      scroll={{ x: 1100 }}
    />
  );
};

export default SchoolTable;
