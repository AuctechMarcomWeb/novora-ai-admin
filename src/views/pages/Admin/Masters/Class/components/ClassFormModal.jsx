/* eslint-disable prettier/prettier */
import { Modal, Form, Input } from "antd";

const ClassFormModal = ({ open, mode, loading, form, onOk, onCancel }) => (
  <Modal
    title={mode === "create" ? "Add New Class" : "Edit Class"}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    okText={mode === "create" ? "Create" : "Update"}
    cancelText="Cancel"
    confirmLoading={loading}
    width={420}
  >
    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
      <Form.Item
        label="Class Name"
        name="className"
        rules={[{ required: true, message: "Please enter class name" }]}
      >
        <Input placeholder="e.g. Class 1, Class 10, LKG" />
      </Form.Item>
    </Form>
  </Modal>
);

export default ClassFormModal;
