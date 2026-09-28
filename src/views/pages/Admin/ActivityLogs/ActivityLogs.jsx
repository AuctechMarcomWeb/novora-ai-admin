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
  CSpinner,
  CBadge,
} from '@coreui/react'

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch activity logs from API
    // For now, using mock data
    setLogs([])
    setLoading(false)
  }, [])

  const getActionBadgeColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return 'success'
      case 'update':
        return 'info'
      case 'delete':
        return 'danger'
      case 'login':
        return 'primary'
      default:
        return 'secondary'
    }
  }

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
          <CCardHeader>
            <strong>Activity Logs</strong>
          </CCardHeader>
          <CCardBody>
            {logs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No activity logs found</p>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">User</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Entity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Timestamp</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {logs.map((log, index) => (
                    <CTableRow key={log.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{log.user}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getActionBadgeColor(log.action)}>
                          {log.action}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{log.entity}</CTableDataCell>
                      <CTableDataCell>{log.details}</CTableDataCell>
                      <CTableDataCell>{log.timestamp}</CTableDataCell>
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

export default ActivityLogs
