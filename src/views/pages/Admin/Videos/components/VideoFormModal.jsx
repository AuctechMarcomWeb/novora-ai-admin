/* eslint-disable prettier/prettier */
import { useState } from 'react'
import {
  Modal, Form, Select, Button, Upload, Progress,
  Tag, Space, Row, Col, Typography,
} from 'antd'
import {
  UploadOutlined, CheckCircleFilled, LoadingOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { videoService } from '../../../../../services/video.service'
import { message } from 'antd'

const { Text } = Typography

const VideoFormModal = ({
  open, mode, loading, form,
  classes, subjects, books,
  onOk, onCancel,
}) => {
  const isView   = mode === 'view'
  const isCreate = mode === 'create'
  const isEdit   = mode === 'edit'

  // Cascading dropdown state
  const [selClass,   setSelClass]   = useState(undefined)
  const [selSubject, setSelSubject] = useState(undefined)
  const [selBook,    setSelBook]    = useState(undefined)
  const [chapterOptions, setChapterOptions] = useState([])

  // Filtered lists
  const [filteredSubjects, setFilteredSubjects] = useState([])
  const [filteredBooks,    setFilteredBooks]    = useState([])

  // Upload state
  const [uploadState,    setUploadState]    = useState('idle')  // idle|uploading|done|error
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedName,   setUploadedName]   = useState('')

  // ── Cascading handlers ────────────────────────────────────────────────────
  const handleClassChange = (val) => {
    setSelClass(val)
    setSelSubject(undefined); setSelBook(undefined); setChapterOptions([])
    form.setFieldsValue({ classRef: val, subjectRef: undefined, bookRef: undefined, chapterNumber: undefined })
    setFilteredSubjects(subjects.filter((s) => (s.classRef?._id || s.classRef) === val))
    setFilteredBooks([])
  }

  const handleSubjectChange = (val) => {
    setSelSubject(val)
    setSelBook(undefined); setChapterOptions([])
    form.setFieldsValue({ subjectRef: val, bookRef: undefined, chapterNumber: undefined })
    setFilteredBooks(books.filter((b) => (b.subjectRef?._id || b.subjectRef) === val))
  }

  const handleBookChange = (val) => {
    setSelBook(val)
    setChapterOptions([])
    form.setFieldsValue({ bookRef: val, chapterNumber: undefined })
    const book = books.find((b) => b._id === val)
    if (book?.chapters?.length) {
      setChapterOptions(book.chapters)
    }
  }

  const handleChapterChange = (val) => {
    form.setFieldValue('chapterNumber', val)
    const ch = chapterOptions.find((c) => c.chapterNumber === val)
    if (ch) form.setFieldValue('chapterTitle', ch.chapterTitle)
  }

  // ── Video upload ──────────────────────────────────────────────────────────
  const handleFileChange = async ({ file }) => {
    if (!file) return
    const raw = file.originFileObj || file
    if (!raw.type.startsWith('video/')) { message.error('Only video files allowed'); return }

    setUploadState('uploading')
    setUploadProgress(0)
    try {
      const res = await videoService.uploadVideo(raw, (pct) => setUploadProgress(pct))
      const { url, originalName } = res.data.data
      setUploadedName(originalName || file.name)
      setUploadState('done')
      form.setFieldValue('videoUrl', url)
      message.success('Video uploaded successfully!')
    } catch (err) {
      setUploadState('error')
      message.error(err?.response?.data?.message || 'Upload failed')
    }
  }

  const resetUpload = () => {
    setUploadState('idle')
    setUploadProgress(0)
    setUploadedName('')
    form.setFieldValue('videoUrl', '')
  }

  const handleCancel = () => {
    setSelClass(undefined); setSelSubject(undefined)
    setSelBook(undefined); setChapterOptions([])
    setFilteredSubjects([]); setFilteredBooks([])
    resetUpload()
    onCancel()
  }

  // On edit mode — pre-populate cascading state
  if (isEdit || isView) {
    const cv = form.getFieldValue('classRef')
    const sv = form.getFieldValue('subjectRef')
    const bv = form.getFieldValue('bookRef')
    if (cv && cv !== selClass) {
      setSelClass(cv)
      setFilteredSubjects(subjects.filter((s) => (s.classRef?._id || s.classRef) === cv))
    }
    if (sv && sv !== selSubject) {
      setSelSubject(sv)
      setFilteredBooks(books.filter((b) => (b.subjectRef?._id || b.subjectRef) === sv))
    }
    if (bv && bv !== selBook) {
      setSelBook(bv)
      const book = books.find((b) => b._id === bv)
      if (book?.chapters?.length) setChapterOptions(book.chapters)
    }
    if ((isEdit || isView) && form.getFieldValue('videoUrl') && uploadState === 'idle') {
      setUploadState('done')
      setUploadedName('Existing video')
    }
  }

  return (
    <Modal
      title={
        <span style={{ fontSize: 16, fontWeight: 700 }}>
          {isCreate ? '🎬 Add New Video' : isEdit ? '✏️ Edit Video' : '📹 Video Details'}
        </span>
      }
      open={open}
      onOk={isView ? handleCancel : onOk}
      onCancel={handleCancel}
      okText={isCreate ? 'Create' : isEdit ? 'Update' : 'Close'}
      cancelText={isView ? null : 'Cancel'}
      confirmLoading={loading}
      width={600}
      styles={{
        body:   { padding: 0, maxHeight: '75vh', overflowY: 'auto' },
        header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' },
        footer: { padding: '12px 24px', borderTop: '1px solid #f0f0f0' },
      }}
    >
      {/* ── Upload section ─────────────────────────────────────────────────── */}
      {!isView && (
        <div style={{
          background: '#fafafa', borderBottom: '1px solid #f0f0f0',
          padding: '14px 24px',
        }}>
          {uploadState === 'idle' && (
            <Upload
              accept="video/*" maxCount={1} showUploadList={false}
              customRequest={() => {}} beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <div
                style={{
                  border: '2px dashed #bae0ff', borderRadius: 10,
                  padding: '14px 20px', textAlign: 'center',
                  cursor: 'pointer', background: '#f0f8ff',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1890ff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#bae0ff'}
              >
                <VideoCameraOutlined style={{ fontSize: 26, color: '#1890ff', marginBottom: 6 }} />
                <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: 3 }}>
                  Click to select video file
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  MP4, MOV, AVI etc. · Uploaded to Cloudflare R2
                </div>
              </div>
            </Upload>
          )}

          {uploadState === 'uploading' && (
            <div style={{
              background: '#fff', borderRadius: 10, padding: '12px 16px',
              border: '1px solid #bae0ff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <LoadingOutlined style={{ color: '#1890ff' }} />
                <Text style={{ fontSize: 13 }}>Uploading video... {uploadProgress}%</Text>
              </div>
              <Progress
                percent={uploadProgress} showInfo={false}
                strokeColor="#1890ff" trailColor="#e5e7eb" strokeWidth={6}
              />
            </div>
          )}

          {(uploadState === 'done' || uploadState === 'error') && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff', borderRadius: 10, padding: '10px 16px',
              border: `1px solid ${uploadState === 'done' ? '#b7eb8f' : '#fca5a5'}`,
            }}>
              <Space>
                <VideoCameraOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {uploadState === 'done' ? uploadedName : 'Upload failed'}
                  </div>
                  {uploadState === 'done' && (
                    <div style={{ fontSize: 11, color: '#52c41a' }}>
                      <CheckCircleFilled style={{ marginRight: 4 }} />
                      Uploaded to R2 successfully
                    </div>
                  )}
                </div>
              </Space>
              <Button size="small" danger type="text" onClick={resetUpload}>
                {uploadState === 'done' ? 'Replace' : 'Retry'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Form ─────────────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px' }}>
        <Form form={form} layout="vertical" disabled={isView}>

          {/* Hidden videoUrl */}
          <Form.Item name="videoUrl"     hidden><input /></Form.Item>
          <Form.Item name="chapterTitle" hidden><input /></Form.Item>

          {/* Class + Subject */}
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Class <span style={{ color: 'red' }}>*</span></span>}
                name="classRef"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select class" showSearch
                  filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                  options={classes.map((c) => ({ label: c.className, value: c._id }))}
                  onChange={handleClassChange}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Subject <span style={{ color: 'red' }}>*</span></span>}
                name="subjectRef"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder={selClass ? 'Select subject' : 'Select class first'}
                  showSearch disabled={!selClass || isView}
                  filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                  options={filteredSubjects.map((s) => ({ label: s.subjectName, value: s._id }))}
                  onChange={handleSubjectChange}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Book + Chapter */}
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Book <span style={{ color: 'red' }}>*</span></span>}
                name="bookRef"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder={selSubject ? 'Select book' : 'Select subject first'}
                  showSearch disabled={!selSubject || isView}
                  filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                  options={filteredBooks.map((b) => ({ label: b.title, value: b._id }))}
                  onChange={handleBookChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Chapter <span style={{ color: 'red' }}>*</span></span>}
                name="chapterNumber"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder={selBook ? 'Select chapter' : 'Select book first'}
                  disabled={!selBook || isView}
                  options={chapterOptions.map((c) => ({
                    label: `${c.chapterNumber}. ${c.chapterTitle}`,
                    value: c.chapterNumber,
                  }))}
                  onChange={handleChapterChange}
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
    </Modal>
  )
}

export default VideoFormModal
