/* eslint-disable prettier/prettier */
import { Modal, Form, Input } from "antd";

const SchoolFormModal = ({ open, mode, loading, form, onOk, onCancel }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  return (
    <Modal
      title={
        isCreate ? "Create New School" : isEdit ? "Edit School" : "School Details"
      }
      open={open}
      onOk={isView ? onCancel : onOk}
      onCancel={onCancel}
      width={600}
      okText={isCreate ? "Create" : isEdit ? "Update" : "Close"}
      cancelText={isView ? null : "Cancel"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isView}
        style={{ marginTop: 20 }}
      >
        {/* School Name */}
        <Form.Item
          label="School Name"
          name="name"
          rules={[{ required: true, message: "Please enter school name" }]}
        >
          <Input placeholder="Enter school name" />
        </Form.Item>

        {/* View Mode: show userId & password as read-only */}
        {isView && (
          <>
            <Form.Item label="User ID (Login ID)" name="userId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input disabled />
            </Form.Item>
          </>
        )}

        {/* Edit Mode: editable userId & optional password */}
        {isEdit && (
          <>
            <Form.Item
              label="User ID (Login ID)"
              name="userId"
              rules={[{ required: true, message: "Please enter user ID" }]}
            >
              <Input placeholder="Enter user ID" />
            </Form.Item>
            <Form.Item
              label="New Password (Optional)"
              name="password"
              rules={[
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              extra="Leave blank to keep current password"
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
          </>
        )}

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Please enter valid email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* Phone with 10-digit validation */}
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              pattern: /^[0-9]{10}$/,
              message: "Phone number must be exactly 10 digits",
            },
          ]}
        >
          <Input
            placeholder="Enter 10-digit phone number"
            maxLength={10}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        {/* Address */}
        <Form.Item label="Address" name="address">
          <Input.TextArea rows={3} placeholder="Enter address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SchoolFormModal;
