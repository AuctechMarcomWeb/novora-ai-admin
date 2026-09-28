/* eslint-disable prettier/prettier */
import { Modal, Form, Input, Select } from "antd";

const SubjectFormModal = ({ open, mode, loading, form, classes, onOk, onCancel }) => (
  <Modal
    title={mode === "create" ? "Add New Subject" : "Edit Subject"}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    okText={mode === "create" ? "Create" : "Update"}
    cancelText="Cancel"
    confirmLoading={loading}
    width={460}
  >
    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
      <Form.Item
        label="Subject Name"
        name="subjectName"
        rules={[{ required: true, message: "Please enter subject name" }]}
      >
        <Input placeholder="e.g. Mathematics, Science, English" />
      </Form.Item>

      <Form.Item
        label="Class"
        name="classRef"
        rules={[{ required: true, message: "Please select a class" }]}
      >
        <Select
          placeholder="Select class"
          options={classes.map((c) => ({ label: c.className, value: c._id }))}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    </Form>
  </Modal>
);

export default SubjectFormModal;
