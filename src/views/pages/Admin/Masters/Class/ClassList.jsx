/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Typography, message } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { classService } from "../../../../../services/class.service";
import ClassFilters from "./components/ClassFilters";
import ClassTable from "./components/ClassTable";
import ClassFormModal from "./components/ClassFormModal";

const { Title } = Typography;

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClasses();
  }, [pagination.current, pagination.pageSize, searchText, activeStatusFilter, showDeleted]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        ...(activeStatusFilter !== "" && { activeStatus: activeStatusFilter }),
      };
      const res = showDeleted
        ? await classService.getDeleted(params)
        : await classService.getAll(params);
      setClasses(res.data.data.classes);
      setPagination((p) => ({ ...p, total: res.data.data.total }));
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearchText(val);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleStatusFilter = (val) => {
    setActiveStatusFilter(val ?? "");
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleTableChange = (pag) => {
    setPagination((p) => ({ ...p, current: pag.current, pageSize: pag.pageSize }));
  };

  const openCreate = () => {
    setModalMode("create");
    setSelectedClass(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setModalMode("edit");
    setSelectedClass(record);
    form.setFieldsValue({ className: record.className });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setSelectedClass(null);
  };

  const handleFormOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (modalMode === "create") {
        await classService.create(values);
        message.success("Class created successfully");
      } else {
        await classService.update(selectedClass._id, values);
        message.success("Class updated successfully");
      }
      closeModal();
      fetchClasses();
    } catch (err) {
      if (!err.errorFields) {
        message.error(err.response?.data?.message || "Operation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await classService.delete(id);
      message.success("Class deleted");
      fetchClasses();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleRestore = async (id) => {
    try {
      await classService.restore(id);
      message.success("Class restored");
      fetchClasses();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to restore");
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await classService.permanentDelete(id);
      message.success("Class permanently deleted");
      fetchClasses();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to permanently delete");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await classService.toggleStatus(id);
      message.success("Status updated");
      fetchClasses();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: "#111827" }}>📚 Class Master</Title>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>Manage all classes</div>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Col>
      </Row>

      <ClassFilters
        showDeleted={showDeleted}
        onSearch={handleSearch}
        onRefresh={fetchClasses}
        onStatusFilter={handleStatusFilter}
        onToggleDeleted={() => {
          setShowDeleted((p) => !p);
          setPagination((p) => ({ ...p, current: 1 }));
        }}
        onAdd={openCreate}
      />

      <Card style={{ borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: 0 }}>
        <ClassTable
          classes={classes}
          loading={loading}
          pagination={pagination}
          showDeleted={showDeleted}
          onTableChange={handleTableChange}
          onEdit={openEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onToggleStatus={handleToggleStatus}
          onReorderSuccess={fetchClasses}
        />
      </Card>

      <ClassFormModal
        open={modalOpen}
        mode={modalMode}
        loading={loading}
        form={form}
        onOk={handleFormOk}
        onCancel={closeModal}
      />
    </div>
  );
};

export default ClassList;
