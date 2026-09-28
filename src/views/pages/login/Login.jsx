/* eslint-disable prettier/prettier */
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import logo from '../../../assets/logo.png'
import sideImage from '../../../assets/banner.png'
import { authService } from '../../../services/auth.service'
import { AppContext } from '../../../Context/AppContext'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(AppContext)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const loginRes = await authService.login({ userId: values.userId, password: values.password })
      const { authToken, role } = loginRes.data.data
      Cookies.set('NovoraAiChat', authToken, { expires: 30 })
      const profileRes = await authService.getProfile()
      const userData = profileRes.data.data.user
      setUser(userData)
      toast.success('Login successful')
      if (role === 'Admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/login')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
        }

        /* LEFT PANEL */
        .login-left {
          flex: 1;
          background: #011747;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-width: 0;
        }
        .login-left img {
          width: 100%;
          height: 100vh;
          object-fit: contain;
        }

        /* RIGHT PANEL */
        .login-right {
          flex: 1;
          min-width: 0;
          background: #f5f6f8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 24px;
          position: relative;
        }

        /* Logo */
        .login-logo {
          position: absolute;
          top: 88px;
          right: 106px;
        }
        .login-logo img {
          height: 44px;
        }

        /* Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 40px 36px;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.09);
        }

        .login-card h2 {
          font-weight: 700;
          color: #042954;
          margin-bottom: 4px;
          font-size: 26px;
        }
        .login-card p {
          color: #6c757d;
          margin-bottom: 28px;
          font-size: 14px;
        }

        /* ── Tablet (≤ 900px): hide left panel ── */
        @media (max-width: 900px) {
          .login-left {
            display: none;
          }
          .login-right {
            flex: unset;
            width: 100%;
            min-height: 100vh;
          }
        }

        /* ── Mobile (≤ 480px): tighter card padding ── */
        @media (max-width: 480px) {
          .login-right {
            padding: 24px 16px;
          }
          .login-card {
            padding: 28px 20px;
            border-radius: 8px;
          }
          .login-card h2 {
            font-size: 22px;
          }
          .login-logo {
            top: 16px;
            right: 16px;
          }
          .login-logo img {
            height: 36px;
          }
        }

        /* ── Very small screens (≤ 360px) ── */
        @media (max-width: 360px) {
          .login-card {
            padding: 24px 14px;
          }
        }
      `}</style>

      <div className="login-wrapper">

        {/* LEFT SIDE — illustration */}
        <div className="login-left">
          <img src={sideImage} alt="MLM Illustration" />
        </div>

        {/* RIGHT SIDE — login form */}
        <div className="login-right">

          {/* Logo — top-right corner */}
          <div className="login-logo">
            <img src={logo} alt="SECI Logo" />
          </div>

          {/* Card */}
          <div className="login-card">
            <h2>Login</h2>
            <p>Sign in to your account</p>

            <Form layout="vertical" onFinish={onFinish} size="middle" requiredMark={false}>
              <Form.Item
                name="userId"
                label={<span style={{ fontWeight: 600 }}>User<span style={{ color: "red", marginRight: 4 }}>*</span></span>}
                rules={[{ required: true, message: 'Please enter user ID' }]}
                style={{ marginBottom: 16 }}
              >
                <Input
                  placeholder="Enter user ID"
                  autoComplete="username"
                  style={{ height: 42, borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontWeight: 600 }}>Password<span style={{ color: "red", marginRight: 4 }}>*</span></span>}
                rules={[{ required: true, message: 'Please enter password' }]}
                style={{ marginBottom: 24 }}
              >
                <Input.Password
                  placeholder="Enter password"
                  style={{ height: 42, borderRadius: 6 }}
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    background: '#042954',
                    borderColor: '#042954',
                    fontWeight: 600,
                    height: 44,
                    borderRadius: 8,
                    fontSize: 15,
                  }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
