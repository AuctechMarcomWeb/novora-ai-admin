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

const ResourceList = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch resources from API
    // For now, using mock data
    setResources([])
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
            <strong>Resources</strong>
            <CButton color="primary" size="sm">
              <CIcon icon={cilPlus} className="me-2" />
              Add Resource
            </CButton>
          </CCardHeader>
          <CCardBody>
            {resources.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No resources found</p>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Resource Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {resources.map((resource, index) => (
                    <CTableRow key={resource.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{resource.name}</CTableDataCell>
                      <CTableDataCell>{resource.type}</CTableDataCell>
                      <CTableDataCell>{resource.category}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={resource.isActive ? 'success' : 'danger'}>
                          {resource.isActive ? 'Active' : 'Inactive'}
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

export default ResourceList
