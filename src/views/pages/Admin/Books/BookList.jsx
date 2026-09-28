import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'

const BookList = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch books from API
    // For now, using mock data
    setBooks([])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Books / PDFs</strong>
            <CButton color="primary" size="sm">
              <CIcon icon={cilPlus} className="me-2" />
              Add Book
            </CButton>
          </CCardHeader>
          <CCardBody>
            {books.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No books found</p>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Author</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {books.map((book, index) => (
                    <CTableRow key={book.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{book.title}</CTableDataCell>
                      <CTableDataCell>{book.author}</CTableDataCell>
                      <CTableDataCell>{book.category}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={book.isActive ? 'success' : 'danger'}>
                          {book.isActive ? 'Active' : 'Inactive'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm">
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BookList
