/* eslint-disable prettier/prettier */
import { useState } from 'react'
import {
  Modal, Form, Input, Select, Button, Upload, Progress,
  Tag, Space, Tooltip, Table, InputNumber,
  Row, Col, Typography,
} from 'antd'
import {
  RobotOutlined, DeleteOutlined, PlusOutlined,
  FilePdfOutlined, CheckCircleFilled, LoadingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { booksService } from '../../../../../services/books.service'
import { message } from 'antd'

const { Text } = Typography

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepBadge = ({ num, label, status }) => {
  const c = {
    active:   { bg: '#1890ff', text: '#fff', labelColor: '#1890ff' },
    done:     { bg: '#52c41a', text: '#fff', labelColor: '#52c41a' },
    inactive: { bg: '#f0f0f0', text: '#aaa', labelColor: '#aaa' },
  }[status] || { bg: '#f0f0f0', text: '#aaa', labelColor: '#aaa' }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', background: c.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: c.text, flexShrink: 0,
      }}>
        {status === 'done' ? '✓' : num}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: c.labelColor }}>{label}</span>
    </div>
  )
}

// ─── Chapter Table Editor ─────────────────────────────────────────────────────
const ChapterEditor = ({ value = [], onChange, disabled }) => {
  const add    = () => onChange([...value, { chapterNumber: value.length + 1, chapterTitle: '', pageNumber: null }])
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i))
  const update = (i, field, val) => onChange(value.map((r, idx) => idx === i ? { ...r, [field]: val } : r))

  const cols = [
    {
      title: '#', dataIndex: 'chapterNumber', width: 56,
      render: (v, _, i) => (
        <InputNumber value={v} min={1} size="small" disabled={disabled}
          onChange={(val) => update(i, 'chapterNumber', val)} style={{ width: '100%' }} />
      ),
    },
    {
      title: 'Chapter Title', dataIndex: 'chapterTitle',
      render: (v, _, i) => (
        <Input value={v} size="small" disabled={disabled}
          onChange={(e) => update(i, 'chapterTitle', e.target.value)}
          placeholder="Enter chapter title" />
      ),
    },
    {
      title: 'Page', dataIndex: 'pageNumber', width: 72,
      render: (v, _, i) => (
        <InputNumber value={v} min={1} size="small" disabled={disabled}
          onChange={(val) => update(i, 'pageNumber', val)}
          style={{ width: '100%' }} placeholder="—" />
      ),
    },
    {
      title: '', width: 36,
      render: (_, __, i) => !disabled && (
        <Button danger type="text" size="small" icon={<DeleteOutlined />} onClick={() => remove(i)} />
      ),
    },
  ]

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
      <Table columns={cols} dataSource={value.map((r, i) => ({ ...r, key: i }))}
        pagination={false} size="small" scroll={{ y: 200 }}
        locale={{ emptyText: 'No chapters yet — upload PDF and use AI to auto-fill.' }} />
      {!disabled && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
          <Button type="dashed" icon={<PlusOutlined />} onClick={add} size="small" style={{ width: '100%' }}>
            Add Chapter
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const BookFormModal = ({ open, mode, loading, form, classes, subjects, onOk, onCancel }) => {
  const isView   = mode === 'view'
  const isCreate = mode === 'create'
  const isEdit   = mode === 'edit'

  // Track class+subject selection
  const [classSelected, setClassSelected]   = useState(false)
  const [subjectSelected, setSubjectSelected] = useState(false)
  const classSubjectReady = classSelected && subjectSelected

  // Upload state
  const [uploadState, setUploadState]       = useState('idle')   // idle|uploading|done|error
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedName, setUploadedName]     = useState('')

  // Analyze state
  const [analyzeState, setAnalyzeState]     = useState('idle')   // idle|loading|done|error

  // Fields are editable once upload is done OR user wants to fill manually
  // During uploading or analyzing — lock fields
  const fieldsLocked = uploadState === 'uploading' || analyzeState === 'loading'

  // Step statuses
  const step1 = classSubjectReady ? 'done' : 'active'
  const step2 = !classSubjectReady ? 'inactive' : uploadState === 'done' ? 'done' : uploadState === 'uploading' ? 'active' : 'active'
  const step3 = uploadState === 'done' ? (analyzeState === 'done' ? 'done' : 'active') : 'inactive'

  const handleFileChange = async ({ file }) => {
    if (!file) return
    const raw = file.originFileObj || file
    if (raw.type !== 'application/pdf') { message.error('Only PDF files are allowed'); return }
    setUploadState('uploading')
    setUploadProgress(0)
    try {
      const res = await booksService.uploadPdf(raw, (pct) => setUploadProgress(pct))
      const { url, key, originalName } = res.data.data
      setUploadedName(originalName || file.name)
      setUploadState('done')
      form.setFieldsValue({ pdfUrl: url, pdfKey: key })
      message.success('PDF uploaded successfully!')
    } catch (err) {
      setUploadState('error')
      message.error(err?.response?.data?.message || 'Upload failed')
    }
  }

  const handleAnalyze = async () => {
    const pdfUrl = form.getFieldValue('pdfUrl')
    if (!pdfUrl) { message.warning('Upload a PDF first'); return }
    setAnalyzeState('loading')
    try {
      const res = await booksService.analyzeBook(pdfUrl)
      const { title, summary, chapters } = res.data.data
      if (title)           form.setFieldValue('title', title)
      if (summary)         form.setFieldValue('summary', summary)
      if (chapters?.length) form.setFieldValue('chapters', chapters)
      setAnalyzeState('done')
      message.success('AI auto-filled! Review and edit if needed.')
    } catch (err) {
      setAnalyzeState('error')
      message.error(err?.response?.data?.message || 'AI analysis failed — fill manually')
    }
  }

  const resetUpload = () => {
    setUploadState('idle')
    setUploadProgress(0)
    setUploadedName('')
    setAnalyzeState('idle')
    form.setFieldsValue({ pdfUrl: '', pdfKey: '' })
  }

  const handleCancel = () => {
    setClassSelected(false)
    setSubjectSelected(false)
    resetUpload()
    onCancel()
  }

  return (
    <Modal
      title={<span style={{ fontSize: 16, fontWeight: 700 }}>
        {isCreate ? '📚 Add New Book' : isEdit ? '✏️ Edit Book' : '📖 Book Details'}
      </span>}
      open={open}
      onOk={isView ? handleCancel : onOk}
      onCancel={handleCancel}
      okText={isCreate ? 'Create Book' : isEdit ? 'Update Book' : 'Close'}
      cancelText={isView ? null : 'Cancel'}
      confirmLoading={loading}
      width={800}
      styles={{
        body:   { padding: 0, maxHeight: '78vh', overflowY: 'auto' },
        header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' },
        footer: { padding: '12px 24px', borderTop: '1px solid #f0f0f0' },
      }}
    >

      {/* ── Top section: Steps + Class/Subject + Upload + AI ──────────────────── */}
      {!isView && (
        <div style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}>

          {/* Steps */}
          <Row style={{ marginBottom: 16 }}>
            {[
              { num: 1, label: 'Select Class & Subject', st: step1 },
              { num: 2, label: 'Upload PDF',             st: step2 },
              { num: 3, label: 'AI Auto-fill & Save',    st: step3 },
            ].map((s, i) => (
              <Col key={i} span={8}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StepBadge num={s.num} label={s.label} status={s.st} />
                  {i < 2 && (
                    <div style={{
                      flex: 1, height: 1, marginLeft: 8,
                      background: s.st === 'done' ? '#52c41a' : '#e5e7eb',
                    }} />
                  )}
                </div>
              </Col>
            ))}
          </Row>

          {/* ── Step 1: Class + Subject (create + edit mode) ──────────────── */}
          {(isCreate || isEdit) && (
            <Row gutter={12} style={{ marginBottom: 14 }}>
              <Col span={12}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>
                  Class <span style={{ color: 'red' }}>*</span>
                </div>
                <Form.Item name="classRef" noStyle rules={[{ required: true, message: 'Required' }]}>
                  <Select
                    placeholder="Select class" showSearch style={{ width: '100%' }}
                    filterOption={(inp, opt) => opt.label.toLowerCase().includes(inp.toLowerCase())}
                    options={classes.map((c) => ({ label: c.className, value: c._id }))}
                    onChange={() => setClassSelected(true)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>
                  Subject <span style={{ color: 'red' }}>*</span>
                </div>
                <Form.Item name="subjectRef" noStyle rules={[{ required: true, message: 'Required' }]}>
                  <Select
                    placeholder="Select subject" showSearch style={{ width: '100%' }}
                    filterOption={(inp, opt) => opt.label.toLowerCase().includes(inp.toLowerCase())}
                    options={subjects.map((s) => ({ label: s.subjectName, value: s._id }))}
                    onChange={() => setSubjectSelected(true)}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* ── Step 2: Upload area ────────────────────────────────────── */}
          {!classSubjectReady ? (
            <div style={{
              border: '1.5px dashed #d1d5db', borderRadius: 10, padding: '14px 18px',
              textAlign: 'center', background: '#f9fafb', color: '#9ca3af',
            }}>
              <FilePdfOutlined style={{ fontSize: 22, marginBottom: 6, display: 'block' }} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                Select Class &amp; Subject first to enable PDF upload
              </div>
            </div>
          ) : uploadState === 'idle' ? (
            <Upload
              accept=".pdf" maxCount={1} showUploadList={false}
              customRequest={() => {}} beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <div
                style={{
                  border: '2px dashed #bae0ff', borderRadius: 10,
                  padding: '16px 24px', textAlign: 'center',
                  cursor: 'pointer', background: '#f0f8ff',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1890ff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#bae0ff'}
              >
                <FilePdfOutlined style={{ fontSize: 28, color: '#ef4444', marginBottom: 6 }} />
                <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: 3 }}>
                  Click to select PDF file
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  Supports large files (500MB+) · Uploaded to Cloudflare R2
                </div>
              </div>
            </Upload>
          ) : uploadState === 'uploading' ? (
            <div style={{
              background: '#fff', borderRadius: 10, padding: '14px 18px',
              border: '1px solid #bae0ff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <LoadingOutlined style={{ color: '#1890ff' }} />
                <Text style={{ fontSize: 13 }}>Uploading PDF... {uploadProgress}%</Text>
              </div>
              <Progress
                percent={uploadProgress} showInfo={false}
                strokeColor="#1890ff" trailColor="#e5e7eb" strokeWidth={6}
              />
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                Please wait — other fields will unlock once upload completes.
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff', borderRadius: 10, padding: '10px 16px',
              border: `1px solid ${uploadState === 'done' ? '#b7eb8f' : '#fca5a5'}`,
            }}>
              <Space>
                <FilePdfOutlined style={{ fontSize: 20, color: '#ef4444' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                    {uploadedName || 'Upload failed'}
                  </div>
                  {uploadState === 'done' && (
                    <div style={{ fontSize: 11, color: '#52c41a' }}>
                      <CheckCircleFilled style={{ marginRight: 4 }} />
                      Uploaded to R2 successfully
                    </div>
                  )}
                </div>
              </Space>
              <Button size="small" danger type="text" onClick={resetUpload}>Remove</Button>
            </div>
          )}

          {/* ── Step 3: AI section ────────────────────────────────────── */}
          {uploadState === 'done' && (
            <div style={{
              marginTop: 10, padding: '10px 16px', borderRadius: 10,
              background: analyzeState === 'done' ? '#f6ffed' : '#f0f5ff',
              border: `1px solid ${analyzeState === 'done' ? '#b7eb8f' : '#bae0ff'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1d4ed8', marginBottom: 2 }}>
                  🤖 AI Auto-fill
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {analyzeState === 'done'
                    ? '✅ Title, summary and chapters auto-filled. Review and edit below.'
                    : analyzeState === 'error'
                    ? '⚠️ AI failed — fill details manually below.'
                    : 'AI will read the PDF and fill title, summary & chapters. Or fill manually below.'}
                </div>
              </div>
              <Button
                icon={analyzeState === 'loading' ? <LoadingOutlined /> : <RobotOutlined />}
                type="primary" ghost size="small"
                loading={analyzeState === 'loading'}
                disabled={analyzeState === 'loading'}
                onClick={handleAnalyze}
                style={{ flexShrink: 0, marginLeft: 12 }}
              >
                {analyzeState === 'loading' ? 'Analyzing...' : analyzeState === 'done' ? 'Re-analyze' : 'Auto-fill with AI'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Form fields ───────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px' }}>
        <Form form={form} layout="vertical">

          {/* Hidden */}
          <Form.Item name="pdfUrl" hidden><Input /></Form.Item>
          <Form.Item name="pdfKey" hidden><Input /></Form.Item>

          {/* Class + Subject shown in view mode only (read-only) */}
          {isView && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 600 }}>Class</span>} name="classRef">
                  <Select disabled options={classes.map((c) => ({ label: c.className, value: c._id }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 600 }}>Subject</span>} name="subjectRef">
                  <Select disabled options={subjects.map((s) => ({ label: s.subjectName, value: s._id }))} />
                </Form.Item>
              </Col>
            </Row>
          )}
          {/* ── Book detail fields ─────────────────────────────────────── */}
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Book Title <span style={{ color: 'red' }}>*</span></span>}
                name="title"
                rules={[{ required: true, message: 'Please enter book title' }]}
              >
                <Input
                  placeholder="e.g. Bhasha Saurabh Hindi - 4"
                  size="large"
                  disabled={isView || fieldsLocked || (isCreate && uploadState === 'idle')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span style={{ fontWeight: 600 }}>
                    Cover Image <Text type="secondary" style={{ fontSize: 11 }}>(optional)</Text>
                  </span>
                }
                name="coverImage"
              >
                <Input
                  placeholder="https://..."
                  disabled={isView || fieldsLocked || (isCreate && uploadState === 'idle')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Summary</span>}
            name="summary"
          >
            <Input.TextArea
              rows={3}
              placeholder="Brief description of the book..."
              showCount maxLength={1000}
              disabled={isView || fieldsLocked || (isCreate && uploadState === 'idle')}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <span style={{ fontWeight: 600 }}>Chapter Index</span>
                <Tag color="blue" style={{ fontSize: 11 }}>
                  {(form.getFieldValue('chapters') || []).length} chapters
                </Tag>
                <Tooltip title="Add/edit chapters manually or use AI Auto-fill.">
                  <InfoCircleOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
                </Tooltip>
              </Space>
            }
            name="chapters"
          >
            <ChapterEditor
              disabled={isView || fieldsLocked || (isCreate && uploadState === 'idle')}
            />
          </Form.Item>

        </Form>
      </div>
    </Modal>
  )
}

export default BookFormModal
