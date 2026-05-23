import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/auth'

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  }).format(new Date(date))
}

const mapUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: 'Active',
  joined: formatDate(user.createdAt),
})

// B&W Stat Component
const StatBox = ({ title, value, meta }) => (
  <div className="border-2 border-black bg-white p-8">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{title}</p>
    <p className="mt-4 text-6xl font-black tracking-tighter text-black">{value}</p>
    <div className="mt-6 border-t border-black/10 pt-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{meta}</p>
    </div>
  </div>
)

// B&W Table Component
const UserTable = ({ users, onDelete, onToggleRole }) => (
  <div className="overflow-x-auto border-2 border-black bg-white">
    <table className="w-full min-w-[900px] text-left border-collapse">
      <thead>
        <tr className="border-b-2 border-black bg-black text-white">
          <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">Identification</th>
          <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">Privilege</th>
          <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">State</th>
          <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">Registration</th>
          <th className="p-5 text-right text-[11px] font-black uppercase tracking-[0.2em]">Operations</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/10">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className="p-5">
              <p className="font-black uppercase text-sm tracking-tight text-black">{user.name}</p>
              <p className="text-xs font-medium text-gray-400">{user.email}</p>
            </td>
            <td className="p-5">
              <span className={`text-[10px] font-black uppercase tracking-widest border border-black px-2 py-1 ${user.role === 'admin' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                {user.role}
              </span>
            </td>
            <td className="p-5 text-xs font-bold uppercase tracking-tighter text-black">
              {user.status}
            </td>
            <td className="p-5 text-xs font-bold text-gray-400 uppercase">{user.joined}</td>
            <td className="p-5 text-right">
              <div className="flex justify-end gap-6">
                <button 
                  onClick={() => onToggleRole(user)} 
                  className="text-[10px] font-black uppercase tracking-widest hover:line-through decoration-2"
                >
                  Switch Role
                </button>
                <button 
                  onClick={() => onDelete(user.id)} 
                  className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:line-through decoration-2"
                >
                  Terminate
                </button>
              </div>
            </td>
          </tr>
        ))}
        {!users.length && (
          <tr>
            <td colSpan="5" className="p-8 text-center text-sm font-bold uppercase text-gray-400">No Data Found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ users: 0, admins: 0, database: 'OFFLINE' })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const authFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 
        ...(options.body ? { 'Content-Type': 'application/json' } : {}), 
        Authorization: `Bearer ${token}` 
      },
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message)
    return result
  }

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true)
        const result = await authFetch('/dashboard')
        // ISSUE FIXED HERE: result.data.users.map(mapUser) kar diya hai
        setUsers(result.data.users.map(mapUser))
        setStats({
            ...result.data.stats,
            database: result.data.stats.database === 'Active' ? 'LIVE' : 'DOWN'
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(keyword))
  }, [search, users])

  const handleLogout = async () => {
    try { await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' }) } catch (err) {}
    localStorage.clear()
    navigate('/signin')
  }

  const handleDeleteUser = async (id) => {
    try {
      await authFetch(`/users/${id}`, { method: 'DELETE' })
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setModal(null)
    } catch (err) { console.error(err) }
  }

  const handleToggleUserRole = async (id) => {
    const user = users.find((u) => u.id === id)
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const result = await authFetch(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role: nextRole }) })
      setUsers((prev) => prev.map((u) => (u.id === id ? mapUser(result.data) : u)))
      setModal(null)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col md:flex-row text-black selection:bg-black selection:text-white font-sans">
      {/* Sidebar - Sharp & Solid */}
      <aside className="w-full md:w-80 border-r-2 border-black bg-white p-10 flex flex-col justify-between">
        <div className="space-y-16">
          <div className="border-l-8 border-black pl-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">CORE<br/>ADMIN.</h2>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-[0.3em]">Version 2.0.1</p>
          </div>
          
          <nav className="flex flex-col gap-4">
            {['dashboard', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left text-xs font-black uppercase tracking-[0.2em] py-3 border-b-2 transition-all ${
                  activeTab === tab 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-300 hover:text-black'
                }`}
              >
                {tab === 'dashboard' ? '01. Overview' : '02. User Directory'}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <div className="bg-black p-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operator</p>
            <p className="font-bold uppercase truncate mt-1">{storedUser?.name}</p>
          </div>
          <button 
            onClick={() => setModal({ type: 'logout' })} 
            className="w-full border-2 border-black p-4 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Terminal Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 md:p-20 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <header className="mb-16">
              <h1 className="text-7xl font-black uppercase tracking-tighter text-black">System Status</h1>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest border-l-2 border-black pl-4">Real-time database analytics</p>
            </header>

            <div className="grid gap-1 md:grid-cols-3 bg-black border-2 border-black mb-20 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <StatBox title="Active Accounts" value={stats.users} meta="Live database entries" />
              <StatBox title="Privileged" value={stats.admins} meta="Accounts with root access" />
              <StatBox title="Database Link" value={stats.database} meta="Global cluster state" />
            </div>

            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Recent Entries</h2>
                <div className="h-1 w-20 bg-black mt-2"></div>
              </div>
              <button onClick={() => setActiveTab('users')} className="text-xs font-black uppercase tracking-widest underline underline-offset-4">Browse All Data</button>
            </div>

            {isLoading ? <div className="p-20 border-2 border-black bg-white text-center font-black uppercase animate-pulse">Synchronizing...</div> : <UserTable users={users.slice(0, 5)} onDelete={(id) => setModal({ type: 'delete', userId: id })} onToggleRole={(user) => setModal({ type: 'role', user })} />}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h1 className="text-7xl font-black uppercase tracking-tighter text-black">Directory</h1>
                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest border-l-2 border-black pl-4">Total management of user base</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH ENTRIES..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-80 bg-white border-2 border-black p-4 text-xs font-black uppercase outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-300"
                />
              </div>
            </header>

            {isLoading ? <div className="p-20 border-2 border-black bg-white text-center font-black uppercase animate-pulse">Fetching Directory...</div> : <UserTable users={filteredUsers} onDelete={(id) => setModal({ type: 'delete', userId: id })} onToggleRole={(user) => setModal({ type: 'role', user })} />}
          </div>
        )}
      </main>

      {/* Modals - Strictly B&W */}
      {modal?.type === 'logout' && <ConfirmModal title="LOGOUT" message="End terminal session?" confirmLabel="TERMINATE" onCancel={() => setModal(null)} onConfirm={handleLogout} />}
      {modal?.type === 'delete' && <ConfirmModal title="DELETE" message="Permanent account removal?" confirmLabel="DELETE" onCancel={() => setModal(null)} onConfirm={() => handleDeleteUser(modal.userId)} />}
      {modal?.type === 'role' && <ConfirmModal title="ROLE UPDATE" message={`Modify access level for ${modal.user.name}?`} confirmLabel="UPGRADE" onCancel={() => setModal(null)} onConfirm={() => handleToggleUserRole(modal.user.id)} />}
    </div>
  )
}

export default Dashboard