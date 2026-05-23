import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/auth'

const AuthInput = ({ type, placeholder, name, value, onChange }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border-b-2 border-black bg-transparent py-3 text-lg font-medium text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-0"
    required
  />
)

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok || !result.status) {
        setMessage({ type: 'error', text: result.message || 'Login failed' })
        return
      }
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      navigate(result.user?.role === 'admin' ? '/dashboard' : '/')
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-white p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-12">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
            Sign In
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Access your account
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <AuthInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
          <AuthInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full cursor-pointer border-b-2 border-black bg-transparent py-3 text-lg font-medium text-black outline-none focus:border-black"
          >
            <option value="user">User Access</option>
            <option value="admin">Admin Access</option>
          </select>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-black bg-black py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
          >
            {isLoading ? 'Processing...' : 'Enter'}
          </button>
        </form>

        {message.text && (
          <p className="mt-6 border-2 border-black p-3 text-center text-sm font-bold uppercase">
            {message.text}
          </p>
        )}

        <p className="mt-12 text-center text-sm font-bold uppercase text-gray-500">
          No account? <Link to="/signup" className="text-black hover:underline">Create One</Link>
        </p>
      </div>
    </section>
  )
}

export default SignIn