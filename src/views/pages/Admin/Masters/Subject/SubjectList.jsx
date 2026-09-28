/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Typography, message } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { subjectService } from "../../../../../services/subject.service";
import { classService } from "../../../../../services/class.service";
import SubjectFilters from "./components/SubjectFilters";
import SubjectTable from "./components/SubjectTable";
import SubjectFormModal from "./components/SubjectFormModal";

const { Title } = Typography;

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [allClasses, setAllClasses] = useState([]); // For dropdowns
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form] = Form.useForm();

  // Fetch all active classes once (for dropdown — no pagination)
  useEffect(() => {
    classService
      .getAll({ isPagination: "false", activeStatus: "true" })
      .then((res) => setAllClasses(res.data.data.classes))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [pagination.current, pagination.pageSize, searchText, classFilter, activeStatusFilter, showDeleted]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        ...(classFilter && { classRef: classFilter }),
        ...(activeStatusFilter !== "" && { activeStatus: activeStatusFilter }),
      };
      const res = showDeleted
        ? await subjectService.getDeleted(params)
        : await subjectService.getAll(params);
      setSubjects(res.data.data.subjects);
      setPagination((p) => ({ ...p, total: res.data.data.total }));
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearchText(val);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleClassFilter = (val) => {
    setClassFilter(val);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleStatusFilter = (val) => {
    setActiveStatusFilter(val);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleTableChange = (pag) => {
    setPagination((p) => ({ ...p, current: pag.current, pageSize: pag.pageSize }));
  };

  const openCreate = () => {
    setModalMode("create");
    setSelectedSubject(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setModalMode("edit");
    setSelectedSubject(record);
    form.setFieldsValue({
      subjectName: record.subjectName,
      classRef: record.classRef?._id,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setSelectedSubject(null);
  };

  const handleFormOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (modalMode === "create") {
        await subjectService.create(values);
        message.success("Subject created successfully");
      } else {
        await subjectService.update(selectedSubject._id, values);
        message.success("Subject updated successfully");
      }
      closeModal();
      fetchSubjects();
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
      await subjectService.delete(id);
      message.success("Subject deleted");
      fetchSubjects();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleRestore = async (id) => {
    try {
      await subjectService.restore(id);
      message.success("Subject restored");
      fetchSubjects();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to restore");
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await subjectService.permanentDelete(id);
      message.success("Subject permanently deleted");
      fetchSubjects();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to permanently delete");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await subjectService.toggleStatus(id);
      message.success("Status updated");
      fetchSubjects();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: "#111827" }}>📖 Subject Master</Title>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>Manage all subjects</div>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Col>
      </Row>

      <SubjectFilters
        showDeleted={showDeleted}
        classes={allClasses}
        onSearch={handleSearch}
        onRefresh={fetchSubjects}
        onClassFilter={handleClassFilter}
        onStatusFilter={handleStatusFilter}
        onToggleDeleted={() => {
          setShowDeleted((p) => !p);
          setPagination((p) => ({ ...p, current: 1 }));
        }}
        onAdd={openCreate}
      />

      <Card style={{ borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: 0 }}>
        <SubjectTable
          subjects={subjects}
          loading={loading}
          pagination={pagination}
          showDeleted={showDeleted}
          onTableChange={handleTableChange}
          onEdit={openEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onToggleStatus={handleToggleStatus}
          onReorderSuccess={fetchSubjects}
        />
      </Card>

      <SubjectFormModal
        open={modalOpen}
        mode={modalMode}
        loading={loading}
        form={form}
        classes={allClasses}
        onOk={handleFormOk}
        onCancel={closeModal}
      />
    </div>
  );
};

export default SubjectList;
