import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { FaBug } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  if (!user) return null

  return (
    <nav className="bg-[var(--bg-dark)] border-b border-[var(--border)] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border)] transition-colors duration-300 group-hover:bg-[var(--bg-input)]">
              <FaBug className="text-[var(--text-primary)] text-lg" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-[var(--text-primary)]">BugExplain</span>
              <span className="text-[var(--primary)] font-medium ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
              <span className="text-sm text-[var(--text-secondary)] truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-all duration-200 cursor-pointer"
            >
              <HiOutlineLogout className="text-lg" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
              <span className="text-sm text-[var(--text-secondary)] truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-all duration-200 cursor-pointer"
            >
              <HiOutlineLogout className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
