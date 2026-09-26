import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './Context/AppContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AppContext)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace /> 
  }

  return children
}

export default ProtectedRoute
