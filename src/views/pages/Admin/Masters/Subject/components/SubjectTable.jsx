/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Switch, Tooltip, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RestOutlined, CloseCircleOutlined, HolderOutlined } from "@ant-design/icons";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { subjectService } from "../../../../../../services/subject.service";

// ── Draggable row ────────────────────────────────────────────────────────────
const DraggableRow = ({ "data-row-key": rowKey, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: rowKey });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#e6f4ff" : undefined,
    cursor: "default",
  };

  return <tr ref={setNodeRef} style={style} {...attributes} {...props} />;
};

// ── Drag handle cell ─────────────────────────────────────────────────────────
const DragHandle = ({ rowKey }) => {
  const { listeners, setActivatorNodeRef } = useSortable({ id: rowKey });
  return (
    <HolderOutlined
      ref={setActivatorNodeRef}
      {...listeners}
      style={{ cursor: "grab", color: "#adb5bd", fontSize: 16, touchAction: "none" }}
    />
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const SubjectTable = ({
  subjects, loading, pagination, showDeleted,
  onTableChange, onEdit, onDelete, onRestore, onPermanentDelete, onToggleStatus,
  onReorderSuccess,
}) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(subjects);
  }, [subjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = dataSource.findIndex((r) => r._id === active.id);
    const newIndex = dataSource.findIndex((r) => r._id === over.id);
    const reordered = arrayMove(dataSource, oldIndex, newIndex);

    setDataSource(reordered); // Optimistic update

    try {
      await subjectService.reorder(reordered.map((r) => r._id));
      message.success("Order saved");
      onReorderSuccess?.();
    } catch {
      message.error("Failed to save order");
      setDataSource(subjects); // Rollback
    }
  };

  const columns = [
    {
      title: "",
      key: "drag",
      width: 40,
      align: "center",
      hidden: showDeleted,
      render: (_, record) => <DragHandle rowKey={record._id} />,
    },
    {
      title: "Sr.No.",
      key: "index",
      width: 70,
      render: (_, __, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (text) => <span style={{ fontWeight: 600, color: "#111827" }}>{text}</span>,
    },
    {
      title: "Class",
      key: "class",
      width: 160,
      render: (_, record) => (
        <Tag color="blue">{record.classRef?.className || "—"}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      align: "center",
      render: (_, record) =>
        showDeleted ? (
          <Tag color="red">Deleted</Tag>
        ) : (
          <Tag color={record.activeStatus ? "green" : "orange"}>
            {record.activeStatus ? "Active" : "Inactive"}
          </Tag>
        ),
    },
    {
      title: "Toggle",
      key: "toggle",
      width: 80,
      align: "center",
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) => new Date(d).toLocaleDateString("en-GB"),
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      align: "center",
      fixed: "right",
      render: (_, record) =>
        showDeleted ? (
          <Space size="small">
            <Tooltip title="Restore">
              <Button type="primary" icon={<RestOutlined />} size="small" onClick={() => onRestore(record._id)} />
            </Tooltip>
            <Popconfirm
              title="Permanently delete?"
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
              title="Delete this subject?"
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
  ].filter((c) => !c.hidden);

  // ── Render ────────────────────────────────────────────────────────────────
  if (showDeleted) {
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `Total ${t} subjects`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={onTableChange}
        scroll={{ x: 700 }}
      />
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={dataSource.map((r) => r._id)} strategy={verticalListSortingStrategy}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="_id"
          loading={loading}
          components={{ body: { row: DraggableRow } }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} subjects`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={onTableChange}
          scroll={{ x: 700 }}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SubjectTable;
