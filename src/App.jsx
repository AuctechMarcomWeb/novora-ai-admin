/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import './App.css'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
