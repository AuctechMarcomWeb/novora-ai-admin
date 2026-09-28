/* eslint-disable prettier/prettier */
import { Card, Row, Col, Input, Button, Select, Space } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";

const SubjectFilters = ({
  showDeleted, classes,
  onSearch, onRefresh, onToggleDeleted, onAdd, onClassFilter, onStatusFilter,
}) => (
  <Card
    style={{ marginBottom: 16, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
    bodyStyle={{ padding: "16px 20px" }}
  >
    <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
      <SearchOutlined style={{ fontSize: 15, color: "#1890ff" }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Filters &amp; Search</span>
    </div>

    <Row gutter={[12, 12]} align="middle">
      {/* Search */}
      <Col xs={24} sm={12} md={7}>
        <Input
          placeholder="Search by subject name..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      {/* Class filter */}
      {!showDeleted && (
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Filter by Class"
            allowClear
            style={{ width: "100%" }}
            onChange={(val) => onClassFilter(val ?? "")}
            options={classes.map((c) => ({ label: c.className, value: c._id }))}
          />
        </Col>
      )}

      {/* Status filter */}
      {!showDeleted && (
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: "100%" }}
            onChange={(val) => onStatusFilter(val ?? "")}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />
        </Col>
      )}

      {/* Action buttons */}
      <Col xs={24} sm={24} md={showDeleted ? 17 : 8}>
        <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>Refresh</Button>
          <Button type={showDeleted ? "default" : "primary"} danger={showDeleted} onClick={onToggleDeleted}>
            {showDeleted ? "Show Active" : "Show Deleted"}
          </Button>
          {!showDeleted && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>Add Subject</Button>
          )}
        </Space>
      </Col>
    </Row>
  </Card>
);

export default SubjectFilters;
