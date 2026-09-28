/* eslint-disable prettier/prettier */
import { Modal } from "antd";

const credBox = {
  background: "#fff",
  padding: "8px 12px",
  borderRadius: 4,
  marginTop: 4,
  fontFamily: "monospace",
  fontSize: 16,
  letterSpacing: 1,
};

const CredentialsModal = ({ open, newCredentials, selectedSchool, onClose }) => {
  const isNew = !!newCredentials;

  return (
    <Modal
      title="🔑 School Login Credentials"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      width={520}
      okText="Close"
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div style={{ padding: "12px 0" }}>
        {isNew ? (
          // ── Newly created credentials ──
          <>
            <div
              style={{
                background: "#f0f9ff",
                border: "1px solid #bae7ff",
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 14, color: "#0958d9", marginBottom: 16 }}>
                ✅ School created successfully! Share these credentials with the school.
              </div>

              <div style={{ marginBottom: 12 }}>
                <strong>User ID</strong>
                <div style={credBox}>{newCredentials.userId}</div>
              </div>

              <div>
                <strong>Password</strong>
                <div style={credBox}>{newCredentials.password}</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: 8,
                padding: 14,
                fontSize: 13,
                color: "#ad6800",
              }}
            >
              ⚠️ <strong>Important:</strong> Save these credentials now. You can always view them later from the 🔑 button.
            </div>
          </>
        ) : (
          // ── View existing credentials ──
          <>
            <div
              style={{
                background: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <strong>School Name</strong>
                <div style={{ marginTop: 4, fontSize: 15 }}>
                  {selectedSchool?.name}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <strong>User ID</strong>
                <div style={credBox}>{selectedSchool?.userId}</div>
              </div>

              <div>
                <strong>Password</strong>
                <div style={credBox}>
                  {selectedSchool?.password || "Not available"}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#e6f4ff",
                border: "1px solid #91caff",
                borderRadius: 8,
                padding: 14,
                fontSize: 13,
                color: "#003eb3",
              }}
            >
              💡 <strong>Tip:</strong> Use the ✏️ Edit button to update User ID or Password.
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CredentialsModal;
