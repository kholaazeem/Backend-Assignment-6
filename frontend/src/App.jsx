// frontend/src/App.jsx
import { Route, Routes } from 'react-router-dom'
import SignUp from './authPages/signup'
import SignIn from './authPages/signin'
import ForgotPassword from './authPages/ForgotPassword'
import ResetPassword from './authPages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import ProtectedRoute from './components/ProtectedRoute' // <-- Naya import
import Blog from './pages/blog'
import About from './pages/about'
import Contact from './pages/contact'

const App = () => {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Routes>
        {/* Public Routes - Ye koi bhi dekh sakta hai */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Route - Sirf logged in users dekh sakte hain */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* Agar specifically koi Admin page ho toh usko aise hi rehne dein */}
        {/* <Route path="/admin-panel" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App