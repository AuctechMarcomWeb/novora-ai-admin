/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Typography, message } from "antd";
import { ExportOutlined } from "@ant-design/icons";

import { schoolService } from "../../../../services/schools.service";
import SchoolFilters from "./components/SchoolFilters";
import SchoolTable from "./components/SchoolTable";
import SchoolFormModal from "./components/SchoolFormModal";
import CredentialsModal from "./components/CredentialsModal";

const { Title } = Typography;

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit | view
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [form] = Form.useForm();

  // Credentials modal state
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchSchools();
  }, [pagination.current, pagination.pageSize, searchText, showDeleted]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      };
      const res = showDeleted
        ? await schoolService.getDeletedSchools(params)
        : await schoolService.getAllSchools(params);

      setSchools(res.data.data.schools);
      setPagination((prev) => ({ ...prev, total: res.data.data.total }));
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  // ─── Search / Table ──────────────────────────────────────────────────────────
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pag) => {
    setPagination((prev) => ({ ...prev, current: pag.current, pageSize: pag.pageSize }));
  };

  // ─── Form modal helpers ──────────────────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setSelectedSchool(null);
    form.resetFields();
    setFormModalOpen(true);
  };

  const openEdit = (record) => {
    setFormMode("edit");
    setSelectedSchool(record);
    form.setFieldsValue({
      name: record.name,
      userId: record.userId,
      email: record.email,
      phone: record.phone,
      address: record.address,
    });
    setFormModalOpen(true);
  };

  const openView = (record) => {
    setFormMode("view");
    setSelectedSchool(record);
    form.setFieldsValue({
      name: record.name,
      userId: record.userId,
      email: record.email,
      phone: record.phone,
      address: record.address,
      password: record.password,
    });
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    form.resetFields();
    setSelectedSchool(null);
  };

  const handleFormOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (formMode === "create") {
        const res = await schoolService.createSchool(values);
        message.success("School created successfully");
        closeFormModal();
        fetchSchools();

        // Show credentials modal after creation
        if (res.data.data.credentials) {
          setNewCredentials(res.data.data.credentials);
          setSelectedSchool(null);
          setCredModalOpen(true);
        }
      } else if (formMode === "edit") {
        await schoolService.updateSchool(selectedSchool._id, values);
        message.success("School updated successfully");
        closeFormModal();
        fetchSchools();
      }
    } catch (err) {
      if (err.errorFields) {
        // Ant Design validation error — do nothing, form shows inline errors
      } else {
        message.error(err.response?.data?.message || "Operation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Credentials modal helpers ───────────────────────────────────────────────
  const openCredentials = (record) => {
    setNewCredentials(null);
    setSelectedSchool(record);
    setCredModalOpen(true);
  };

  const closeCredentials = () => {
    setCredModalOpen(false);
    setNewCredentials(null);
    setSelectedSchool(null);
  };

  // ─── CRUD operations ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await schoolService.deleteSchool(id);
      message.success("School deleted successfully");
      fetchSchools();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete school");
    }
  };

  const handleRestore = async (id) => {
    try {
      await schoolService.restoreSchool(id);
      message.success("School restored successfully");
      fetchSchools();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to restore school");
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await schoolService.permanentDeleteSchool(id);
      message.success("School permanently deleted");
      fetchSchools();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to permanently delete school");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await schoolService.toggleSchoolStatus(id);
      message.success("School status updated");
      fetchSchools();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "4px 0" }}>

      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: "#111827" }}>
            🏫 School Management
          </Title>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
            Manage all schools
          </div>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Col>
      </Row>

      {/* Filters */}
      <SchoolFilters
        showDeleted={showDeleted}
        onSearch={handleSearch}
        onRefresh={fetchSchools}
        onToggleDeleted={() => {
          setShowDeleted((prev) => !prev);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        onAdd={openCreate}
      />

      {/* Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
        bodyStyle={{ padding: 0 }}
      >
        <SchoolTable
          schools={schools}
          loading={loading}
          pagination={pagination}
          showDeleted={showDeleted}
          onTableChange={handleTableChange}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onToggleStatus={handleToggleStatus}
          onCredentials={openCredentials}
        />
      </Card>

      {/* Create / Edit / View Modal */}
      <SchoolFormModal
        open={formModalOpen}
        mode={formMode}
        loading={loading}
        form={form}
        onOk={handleFormOk}
        onCancel={closeFormModal}
      />

      {/* Credentials Modal */}
      <CredentialsModal
        open={credModalOpen}
        newCredentials={newCredentials}
        selectedSchool={selectedSchool}
        onClose={closeCredentials}
      />
    </div>
  );
};

export default SchoolList;
