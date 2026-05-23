import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-assignment-6-topaz.vercel.app/api/v1/auth'

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

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [profilePic, setProfilePic] = useState(null)
  const [profilePreview, setProfilePreview] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!profilePic) return setProfilePreview('')
    const previewUrl = URL.createObjectURL(profilePic)
    setProfilePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [profilePic])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setIsLoading(true)

    const body = new FormData()
    body.append('name', formData.name)
    body.append('email', formData.email)
    body.append('password', formData.password)
    if (profilePic) body.append('profilePic', profilePic)

    try {
      const response = await fetch(`${API_URL}/signup`, { method: 'POST', credentials: 'include', body })
      const result = await response.json()

      if (!response.ok || !result.status) {
        setMessage({ type: 'error', text: result.message || 'Signup failed' })
        return
      }
      navigate('/signin')
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
            Sign Up
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            Create New Identity
          </p>
        </div>

        <label className="mx-auto mb-8 block w-fit cursor-pointer">
          <div className="flex h-24 w-24 items-center justify-center border-2 border-black border-dashed bg-gray-50 transition hover:bg-gray-200">
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
            {profilePreview ? (
              <img src={profilePreview} alt="Preview" className="h-full w-full object-cover grayscale" />
            ) : (
              <div className="text-center">
                <span className="block text-2xl font-black">+</span>
                <span className="block text-[10px] font-bold uppercase tracking-widest mt-1">Avatar</span>
              </div>
            )}
          </div>
        </label>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <AuthInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
          <AuthInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
          <AuthInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-black bg-black py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black mt-4"
          >
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>

        {message.text && (
          <p className="mt-6 border-2 border-black p-3 text-center text-sm font-bold uppercase">
            {message.text}
          </p>
        )}

        <p className="mt-12 text-center text-sm font-bold uppercase text-gray-500">
          Already registered? <Link to="/signin" className="text-black hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  )
}

export default SignUp