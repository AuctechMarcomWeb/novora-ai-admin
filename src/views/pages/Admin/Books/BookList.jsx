/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Form, Typography, message } from 'antd'
import { ExportOutlined } from '@ant-design/icons'

import { booksService } from '../../../../services/books.service'
import { getRequest } from '../../../../Helpers'
import BookFilters from './components/BookFilters'
import BookTable from './components/BookTable'
import BookFormModal from './components/BookFormModal'

const { Title } = Typography

const BookList = () => {
  const [books, setBooks]               = useState([])
  const [allClasses, setAllClasses]     = useState([])
  const [allSubjects, setAllSubjects]   = useState([])
  const [loading, setLoading]           = useState(false)
  const [showDeleted, setShowDeleted]   = useState(false)
  const [searchText, setSearchText]     = useState('')
  const [classFilter, setClassFilter]   = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination]     = useState({ current: 1, pageSize: 10, total: 0 })

  const [modalOpen, setModalOpen]       = useState(false)
  const [modalMode, setModalMode]       = useState('create')   // create | edit | view
  const [selectedBook, setSelectedBook] = useState(null)
  const [form]                          = Form.useForm()

  // ── Load dropdowns once ────────────────────────────────────────────────────
  useEffect(() => {
    getRequest('classes?isPagination=false&activeStatus=true')
      .then((r) => setAllClasses(r.data.data.classes))
      .catch(() => {})
    getRequest('subjects?isPagination=false&activeStatus=true')
      .then((r) => setAllSubjects(r.data.data.subjects))
      .catch(() => {})
  }, [])

  // ── Fetch books ────────────────────────────────────────────────────────────
  useEffect(() => { fetchBooks() }, [
    pagination.current, pagination.pageSize,
    searchText, classFilter, subjectFilter, statusFilter, showDeleted,
  ])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({
        page:  pagination.current,
        limit: pagination.pageSize,
        ...(searchText    && { search:       searchText }),
        ...(classFilter   && { classRef:     classFilter }),
        ...(subjectFilter && { subjectRef:   subjectFilter }),
        ...(statusFilter  && { activeStatus: statusFilter }),
      }).toString()

      const endpoint = showDeleted ? `books/deleted?${q}` : `books?${q}`
      const res = await getRequest(endpoint)
      setBooks(res.data.data.books)
      setPagination((p) => ({ ...p, total: res.data.data.total }))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  // ── Search / filters ───────────────────────────────────────────────────────
  const handleSearch = (v) => {
    setSearchText(v)
    setPagination((p) => ({ ...p, current: 1 }))
  }

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setModalMode('create')
    setSelectedBook(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setModalMode('edit')
    setSelectedBook(record)
    form.setFieldsValue({
      title:      record.title,
      summary:    record.summary,
      coverImage: record.coverImage,
      classRef:   record.classRef?._id,
      subjectRef: record.subjectRef?._id,
      pdfUrl:     record.pdfUrl,
      pdfKey:     record.pdfKey,
      chapters:   record.chapters || [],
    })
    setModalOpen(true)
  }

  const openView = (record) => {
    setModalMode('view')
    setSelectedBook(record)
    form.setFieldsValue({
      title:      record.title,
      summary:    record.summary,
      coverImage: record.coverImage,
      classRef:   record.classRef?._id,
      subjectRef: record.subjectRef?._id,
      pdfUrl:     record.pdfUrl,
      pdfKey:     record.pdfKey,
      chapters:   record.chapters || [],
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    form.resetFields()
    setSelectedBook(null)
  }

  const handleFormOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload = {
        title:      values.title,
        summary:    values.summary    || '',
        coverImage: values.coverImage || '',
        classRef:   values.classRef,
        subjectRef: values.subjectRef,
        pdfUrl:     values.pdfUrl     || '',
        pdfKey:     values.pdfKey     || '',
        chapters:   values.chapters   || [],
      }

      if (modalMode === 'create') {
        if (!payload.pdfUrl) {
          message.error('Please upload a PDF first')
          setLoading(false)
          return
        }
        await booksService.createBook(payload)
        message.success('Book created successfully')
      } else {
        await booksService.updateBook(selectedBook._id, payload)
        message.success('Book updated successfully')
      }

      closeModal()
      fetchBooks()
    } catch (err) {
      if (!err.errorFields) {
        message.error(err?.response?.data?.message || 'Operation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── CRUD operations ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await booksService.deleteBook(id)
      message.success('Book deleted')
      fetchBooks()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to delete')
    }
  }

  const handleRestore = async (id) => {
    try {
      await booksService.restoreBook(id)
      message.success('Book restored')
      fetchBooks()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to restore')
    }
  }

  const handlePermanentDelete = async (id) => {
    try {
      await booksService.permanentDeleteBook(id)
      message.success('Book permanently deleted')
      fetchBooks()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to permanently delete')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await booksService.toggleStatus(id)
      message.success('Status updated')
      fetchBooks()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '4px 0' }}>

      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>📚 Books / PDFs</Title>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            Manage all books and PDF resources
          </div>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Col>
      </Row>

      {/* Filters */}
      <BookFilters
        showDeleted={showDeleted}
        classes={allClasses}
        subjects={allSubjects}
        onSearch={handleSearch}
        onRefresh={fetchBooks}
        onClassFilter={(v) => { setClassFilter(v); setPagination((p) => ({ ...p, current: 1 })) }}
        onSubjectFilter={(v) => { setSubjectFilter(v); setPagination((p) => ({ ...p, current: 1 })) }}
        onStatusFilter={(v) => { setStatusFilter(v); setPagination((p) => ({ ...p, current: 1 })) }}
        onToggleDeleted={() => {
          setShowDeleted((p) => !p)
          setPagination((p) => ({ ...p, current: 1 }))
        }}
        onAdd={openCreate}
      />

      {/* Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        bodyStyle={{ padding: 0 }}
      >
        <BookTable
          books={books}
          loading={loading}
          pagination={pagination}
          showDeleted={showDeleted}
          onTableChange={(pag) =>
            setPagination((p) => ({ ...p, current: pag.current, pageSize: pag.pageSize }))
          }
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* Form Modal */}
      <BookFormModal
        open={modalOpen}
        mode={modalMode}
        loading={loading}
        form={form}
        classes={allClasses}
        subjects={allSubjects}
        onOk={handleFormOk}
        onCancel={closeModal}
      />
    </div>
  )
}

export default BookList
