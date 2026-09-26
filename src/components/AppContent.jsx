import React, { Suspense, useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import ProtectedRoute from '../ProtectedRoute'
import { AppContext } from '../Context/AppContext'

// routes config
import routes from '../routes'

// Role-based default redirect
const roleDefaultPath = {
  Admin: '/admin/dashboard',
  Customer: '/customer/dashboard',
  Distributor: '/distributor/dashboard',
}

const AppContent = () => {
  const { user } = useContext(AppContext)
  const defaultPath = roleDefaultPath[user?.role] || '/login'

  return (
    <>
      <div style={{ backgroundColor: '#F7F7F7', padding: 'clamp(8px, 2vw, 16px)', minHeight: 'calc(100vh - 56px)' }}>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={
                      <ProtectedRoute allowedRoles={route.roles}>
                        <route.element />
                      </ProtectedRoute>
                    }
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to={defaultPath} replace />} />
            <Route path="/dashboard" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default React.memo(AppContent)
