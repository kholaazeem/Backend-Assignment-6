import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-assignment-6-topaz.vercel.app/api/v1/auth'

const Home = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' })
    } catch (error) {
      console.error('Logout request failed:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setShowLogoutModal(false)
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="flex flex-wrap items-center justify-between border-b-2 border-black bg-white px-6 py-4">
        {/* Left Side: Navigation Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm font-bold uppercase tracking-widest">
          <Link to="/" className="border-2 border-transparent px-3 py-2 transition-colors hover:border-black hover:bg-black hover:text-white">
            Home
          </Link>
          <Link to="/blog" className="border-2 border-transparent px-3 py-2 transition-colors hover:border-black hover:bg-black hover:text-white">
            Blog
          </Link>
          <Link to="/about" className="border-2 border-transparent px-3 py-2 transition-colors hover:border-black hover:bg-black hover:text-white">
            About
          </Link>
          <Link to="/contact" className="border-2 border-transparent px-3 py-2 transition-colors hover:border-black hover:bg-black hover:text-white">
            Contact
          </Link>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="mt-4 flex items-center gap-4 sm:mt-0">
          {user ? (
            <>
              {/* Optional: Show Username */}
              <span className="hidden text-sm font-bold uppercase tracking-widest md:block">
                Hi, {user.name.split(' ')[0]}
              </span>
              
              {user.role === 'admin' && (
                <Link
                  to="/dashboard"
                  className="border-2 border-black bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="border-2 border-black bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="border-2 border-black bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="border-2 border-black bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero / Main Content */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        {user?.profilePic && (
          <img
            src={user.profilePic}
            alt={user.name || 'Profile'}
            className="mx-auto mb-8 h-32 w-32 object-cover grayscale border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        )}

        <h1 className="text-5xl font-black uppercase tracking-tighter md:text-8xl">
          {user ? 'Welcome Back.' : 'The System.'}
        </h1>
        
        <p className="mt-6 max-w-xl text-lg font-medium text-gray-500 uppercase tracking-widest">
          {user 
            ? 'Your session is active. Ready to explore?' 
            : 'A clean, distraction-free space. Authentication Required.'}
        </p>

        {!user && (
          <div className="mt-12">
            <Link
              to="/blog"
              className="border-2 border-black bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Explore Without Login
            </Link>
          </div>
        )}
      </section>

      {showLogoutModal && (
        <ConfirmModal
          title="TERMINATE SESSION"
          message="Are you sure you want to log out?"
          confirmLabel="LOGOUT"
          danger
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}

export default Home