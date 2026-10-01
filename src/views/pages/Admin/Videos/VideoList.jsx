/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Form, Typography, message } from 'antd'
import { ExportOutlined } from '@ant-design/icons'

import { videoService } from '../../../../services/video.service'
import { getRequest } from '../../../../Helpers'
import VideoFilters from './components/VideoFilters'
import VideoTable from './components/VideoTable'
import VideoFormModal from './components/VideoFormModal'

const { Title } = Typography

const VideoList = () => {
  // ── Master data ────────────────────────────────────────────────────────────
  const [allClasses,  setAllClasses]  = useState([])
  const [allSubjects, setAllSubjects] = useState([])
  const [allBooks,    setAllBooks]    = useState([])

  // Filtered for filter bar
  const [filterSubjects, setFilterSubjects] = useState([])
  const [filterBooks,    setFilterBooks]    = useState([])
  const [filterChapters, setFilterChapters] = useState([])

  // ── Table state ────────────────────────────────────────────────────────────
  const [videos,      setVideos]      = useState([])
  const [loading,     setLoading]     = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)
  const [pagination,  setPagination]  = useState({ current: 1, pageSize: 20, total: 0 })

  // ── Filters ────────────────────────────────────────────────────────────────
  const [classFilter,   setClassFilter]   = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [bookFilter,    setBookFilter]    = useState('')
  const [chapterFilter, setChapterFilter] = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen]     = useState(false)
  const [modalMode, setModalMode]     = useState('create')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [form] = Form.useForm()

  // ── Load master data once ──────────────────────────────────────────────────
  useEffect(() => {
    getRequest('classes?isPagination=false&activeStatus=true')
      .then((r) => setAllClasses(r.data.data.classes)).catch(() => {})
    getRequest('subjects?isPagination=false&activeStatus=true')
      .then((r) => setAllSubjects(r.data.data.subjects)).catch(() => {})
    getRequest('books?isPagination=false&activeStatus=true')
      .then((r) => setAllBooks(r.data.data.books)).catch(() => {})
  }, [])

  // ── Fetch videos ───────────────────────────────────────────────────────────
  useEffect(() => { fetchVideos() }, [
    pagination.current, pagination.pageSize,
    classFilter, subjectFilter, bookFilter, chapterFilter, statusFilter, showDeleted,
  ])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:  pagination.current,
        limit: pagination.pageSize,
        ...(classFilter   && { classRef:       classFilter   }),
        ...(subjectFilter && { subjectRef:      subjectFilter }),
        ...(bookFilter    && { bookRef:         bookFilter    }),
        ...(chapterFilter && { chapterNumber:   chapterFilter }),
        ...(statusFilter  && { activeStatus:    statusFilter  }),
      })
      const endpoint = showDeleted
        ? `videos/deleted?${params}`
        : `videos?${params}`
      const res = await getRequest(endpoint)
      setVideos(res.data.data.videos)
      setPagination((p) => ({ ...p, total: res.data.data.total }))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  // ── Filter bar cascading ───────────────────────────────────────────────────
  const handleClassFilter = (v) => {
    setClassFilter(v)
    setSubjectFilter(''); setBookFilter(''); setChapterFilter('')
    setFilterSubjects(allSubjects.filter((s) => (s.classRef?._id || s.classRef) === v))
    setFilterBooks([]); setFilterChapters([])
    setPagination((p) => ({ ...p, current: 1 }))
  }
  const handleSubjectFilter = (v) => {
    setSubjectFilter(v)
    setBookFilter(''); setChapterFilter('')
    setFilterBooks(allBooks.filter((b) => (b.subjectRef?._id || b.subjectRef) === v))
    setFilterChapters([])
    setPagination((p) => ({ ...p, current: 1 }))
  }
  const handleBookFilter = (v) => {
    setBookFilter(v)
    setChapterFilter('')
    const book = allBooks.find((b) => b._id === v)
    setFilterChapters(book?.chapters || [])
    setPagination((p) => ({ ...p, current: 1 }))
  }
  const handleChapterFilter = (v) => {
    setChapterFilter(v)
    setPagination((p) => ({ ...p, current: 1 }))
  }

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setModalMode('create')
    setSelectedVideo(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setModalMode('edit')
    setSelectedVideo(record)
    form.setFieldsValue({
      classRef:      record.classRef?._id,
      subjectRef:    record.subjectRef?._id,
      bookRef:       record.bookRef?._id,
      chapterNumber: record.chapterNumber,
      chapterTitle:  record.chapterTitle,
      videoUrl:      record.videoUrl,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    form.resetFields()
    setSelectedVideo(null)
  }

  const handleFormOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (!values.videoUrl) {
        message.error('Please upload a video first')
        setLoading(false)
        return
      }

      const payload = {
        classRef:      values.classRef,
        subjectRef:    values.subjectRef,
        bookRef:       values.bookRef,
        chapterNumber: values.chapterNumber,
        chapterTitle:  values.chapterTitle || '',
        videoUrl:      values.videoUrl,
      }

      if (modalMode === 'create') {
        await videoService.create(payload)
        message.success('Video added successfully')
      } else {
        await videoService.update(selectedVideo._id, payload)
        message.success('Video updated successfully')
      }

      closeModal()
      fetchVideos()
    } catch (err) {
      if (!err.errorFields) {
        message.error(err?.response?.data?.message || 'Operation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try { await videoService.delete(id); message.success('Video deleted'); fetchVideos() }
    catch (err) { message.error(err?.response?.data?.message || 'Failed to delete') }
  }
  const handleRestore = async (id) => {
    try { await videoService.restore(id); message.success('Video restored'); fetchVideos() }
    catch (err) { message.error(err?.response?.data?.message || 'Failed to restore') }
  }
  const handlePermanentDelete = async (id) => {
    try { await videoService.permanentDelete(id); message.success('Permanently deleted'); fetchVideos() }
    catch (err) { message.error(err?.response?.data?.message || 'Failed') }
  }
  const handleToggleStatus = async (id) => {
    try { await videoService.toggleStatus(id); message.success('Status updated'); fetchVideos() }
    catch (err) { message.error(err?.response?.data?.message || 'Failed') }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '4px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>🎬 Videos</Title>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            Manage chapterwise video content
          </div>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Col>
      </Row>

      <VideoFilters
        classes={allClasses}
        subjects={filterSubjects}
        books={filterBooks}
        chapters={filterChapters}
        showDeleted={showDeleted}
        onClassFilter={handleClassFilter}
        onSubjectFilter={handleSubjectFilter}
        onBookFilter={handleBookFilter}
        onChapterFilter={handleChapterFilter}
        onStatusFilter={(v) => { setStatusFilter(v); setPagination((p) => ({ ...p, current: 1 })) }}
        onRefresh={fetchVideos}
        onToggleDeleted={() => { setShowDeleted((p) => !p); setPagination((p) => ({ ...p, current: 1 })) }}
        onAdd={openCreate}
      />

      <Card
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        bodyStyle={{ padding: 0 }}
      >
        <VideoTable
          videos={videos}
          loading={loading}
          pagination={pagination}
          showDeleted={showDeleted}
          onTableChange={(pag) =>
            setPagination((p) => ({ ...p, current: pag.current, pageSize: pag.pageSize }))
          }
          onEdit={openEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      <VideoFormModal
        open={modalOpen}
        mode={modalMode}
        loading={loading}
        form={form}
        classes={allClasses}
        subjects={allSubjects}
        books={allBooks}
        onOk={handleFormOk}
        onCancel={closeModal}
      />
    </div>
  )
}

export default VideoList
