import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/auth'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      const result = await response.json()

      if (!response.ok || !result.status) {
        setMessage({ type: 'error', text: result.message || 'Password reset failed' })
        return
      }

      setMessage({ type: 'success', text: result.message })
      setTimeout(() => navigate('/signin'), 1200)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not connect to the backend' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white">
      <div className="w-full max-w-[340px]">
        <div className="mb-6">
          <h1 className="text-[26px] font-extrabold leading-tight">
            Reset <span className="text-[#ffc414]">Password</span>
          </h1>
          <p className="mt-2 text-sm text-[#cfd0d5]">Create a new password for your account.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="flex h-12 items-center rounded-md bg-[#1f1f22] px-4 text-[#9698a1]">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="New password"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#7f8290]"
              required
            />
          </label>

          <label className="flex h-12 items-center rounded-md bg-[#1f1f22] px-4 text-[#9698a1]">
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#7f8290]"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-md bg-[#ffc414] text-sm font-bold text-black transition hover:bg-[#ffd24a]"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message.text && (
          <p
            className={`mt-3 text-center text-xs font-medium ${
              message.type === 'error' ? 'text-red-500' : 'text-green-400'
            }`}
          >
            {message.text}
          </p>
        )}

        <p className="mt-8 text-center text-xs text-[#c8c8cc]">
          Back to{' '}
          <Link to="/signin" className="font-bold text-white">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword