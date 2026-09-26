/* eslint-disable prettier/prettier */
import { useEffect, useContext } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AppContext } from '../Context/AppContext'
import { authService } from '../services/auth.service'

const DefaultLayout = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)

  useEffect(() => {
    const token = Cookies.get('MLM')
    if (!token) {
      navigate('/login')
      return
    }

    // If user is already in context (from localStorage), skip the fetch
    if (user) return

    // Token exists but no user in context — fetch profile (e.g. after hard refresh)
    authService.getProfile()
      .then((res) => {
        setUser(res.data.data.user)
      })
      .catch(() => {
        Cookies.remove('MLM')
        setUser(null)
        navigate('/login')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100" style={{ position: 'relative', zIndex: 1 }}>
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
