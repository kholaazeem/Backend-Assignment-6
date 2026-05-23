// frontend/src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-assignment-6-topaz.vercel.app/api/v1/auth'

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token')

      // Agar token nahi hai toh user logged in nahi hai
      if (!token) {
        setStatus('unauthorized')
        return
      }

      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })
        const result = await response.json()

        if (!response.ok || !result.status || !result.user) {
          setStatus('unauthorized')
          return
        }

        // Token valid hai, user data save kar lein
        localStorage.setItem('user', JSON.stringify(result.user))
        setStatus('ready')
      } catch (error) {
        setStatus('unauthorized')
      }
    }

    verifyUser()
  }, [])

  if (status === 'checking') {
    return (
      <section className="grid min-h-screen place-items-center bg-white text-sm font-bold text-black">
        Loading...
      </section>
    )
  }

  // Agar unauthorized hai toh login page par redirect kar dein
  if (status === 'unauthorized') {
      return <Navigate to="/signin" replace />
  }

  // Agar login hai toh requested page (children) dikha dein
  return children
}

export default ProtectedRoute