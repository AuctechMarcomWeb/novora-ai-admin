/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { Card, Row, Col, Button, Select, Space } from 'antd'
import { FilterOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'

const VideoFilters = ({
  classes, subjects, books, chapters,
  showDeleted,
  onClassFilter, onSubjectFilter, onBookFilter, onChapterFilter,
  onStatusFilter, onRefresh, onToggleDeleted, onAdd,
}) => {
  const [selClass,   setSelClass]   = useState(undefined)
  const [selSubject, setSelSubject] = useState(undefined)
  const [selBook,    setSelBook]    = useState(undefined)
  const [selChapter, setSelChapter] = useState(undefined)

  const handleClassChange = (v) => {
    setSelClass(v); setSelSubject(undefined); setSelBook(undefined); setSelChapter(undefined)
    onClassFilter(v ?? ''); onSubjectFilter(''); onBookFilter(''); onChapterFilter('')
  }
  const handleSubjectChange = (v) => {
    setSelSubject(v); setSelBook(undefined); setSelChapter(undefined)
    onSubjectFilter(v ?? ''); onBookFilter(''); onChapterFilter('')
  }
  const handleBookChange = (v) => {
    setSelBook(v); setSelChapter(undefined)
    onBookFilter(v ?? ''); onChapterFilter('')
  }
  const handleChapterChange = (v) => {
    setSelChapter(v)
    onChapterFilter(v ?? '')
  }

  return (
    <Card
      style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      bodyStyle={{ padding: '14px 20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <FilterOutlined style={{ color: '#1890ff' }} />
        <span style={{ fontWeight: 600, fontSize: 13 }}>Filters &amp; Search</span>
      </div>

      <Row gutter={[10, 10]} align="middle">
        {/* Class */}
        <Col xs={12} sm={8} md={4}>
          <Select
            placeholder="Class"
            allowClear
            value={selClass}
            style={{ width: '100%' }}
            onChange={handleClassChange}
            options={classes.map((c) => ({ label: c.className, value: c._id }))}
          />
        </Col>

        {/* Subject — filtered by class */}
        <Col xs={12} sm={8} md={4}>
          <Select
            placeholder={selClass ? 'Subject' : 'Select class first'}
            allowClear
            disabled={!selClass}
            value={selSubject}
            style={{ width: '100%' }}
            onChange={handleSubjectChange}
            options={subjects.map((s) => ({ label: s.subjectName, value: s._id }))}
          />
        </Col>

        {/* Book — filtered by subject */}
        <Col xs={12} sm={8} md={5}>
          <Select
            placeholder={selSubject ? 'Book' : 'Select subject first'}
            allowClear
            disabled={!selSubject}
            value={selBook}
            style={{ width: '100%' }}
            onChange={handleBookChange}
            options={books.map((b) => ({ label: b.title, value: b._id }))}
          />
        </Col>

        {/* Chapter — from selected book */}
        <Col xs={12} sm={8} md={4}>
          <Select
            placeholder={selBook ? 'Chapter' : 'Select book first'}
            allowClear
            disabled={!selBook}
            value={selChapter}
            style={{ width: '100%' }}
            onChange={handleChapterChange}
            options={chapters.map((c) => ({
              label: `${c.chapterNumber}. ${c.chapterTitle}`,
              value: c.chapterNumber,
            }))}
          />
        </Col>

        {/* Status */}
        {!showDeleted && (
          <Col xs={12} sm={8} md={3}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              onChange={(v) => onStatusFilter(v ?? '')}
              options={[
                { label: 'Active',   value: 'true' },
                { label: 'Inactive', value: 'false' },
              ]}
            />
          </Col>
        )}

        {/* Buttons */}
        <Col xs={24} sm={24} md={showDeleted ? 7 : 4}>
          <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>Refresh</Button>
            <Button
              type={showDeleted ? 'default' : 'primary'}
              danger={showDeleted}
              onClick={onToggleDeleted}
            >
              {showDeleted ? 'Show Active' : 'Show Deleted'}
            </Button>
            {!showDeleted && (
              <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Add Video
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default VideoFilters
