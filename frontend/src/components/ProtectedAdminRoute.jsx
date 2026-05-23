import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import NotFound from '../pages/NotFound'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/auth'

const ProtectedAdminRoute = ({ children }) => {
  const [status, setStatus] = useState('checking')
  const [role, setRole] = useState('')

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setStatus('not-found')
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
          setStatus('not-found')
          return
        }

        localStorage.setItem('user', JSON.stringify(result.user))
        setRole(result.user.role)
        setStatus('ready')
      } catch (error) {
        setStatus('not-found')
      }
    }

    verifyUser()
  }, [])

  if (status === 'checking') {
    return (
      <section className="grid min-h-screen place-items-center bg-[#0b0c0f] text-sm font-bold text-white">
        Checking access...
      </section>
    )
  }

  if (status === 'not-found') return <NotFound />
  if (role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default ProtectedAdminRoute