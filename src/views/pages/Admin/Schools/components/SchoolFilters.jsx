/* eslint-disable prettier/prettier */
import { Card, Row, Col, Input, Button, Space } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const SchoolFilters = ({ showDeleted, onSearch, onRefresh, onToggleDeleted, onAdd }) => (
  <Card
    style={{
      marginBottom: 16,
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}
    bodyStyle={{ padding: "16px 20px" }}
  >
    {/* Title */}
    <div
      style={{
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <SearchOutlined style={{ fontSize: 15, color: "#1890ff" }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
        Filters &amp; Search
      </span>
    </div>

    <Row gutter={[12, 12]} align="middle">
      {/* Search input */}
      <Col xs={24} sm={24} md={10} lg={12}>
        <Input
          placeholder="Search by name, email, phone..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      {/* Action buttons */}
      <Col xs={24} sm={24} md={14} lg={12}>
        <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Refresh
          </Button>
          <Button
            type={showDeleted ? "default" : "primary"}
            danger={showDeleted}
            onClick={onToggleDeleted}
          >
            {showDeleted ? "Show Active" : "Show Deleted"}
          </Button>
          {!showDeleted && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Add New School
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  </Card>
);

export default SchoolFilters;
