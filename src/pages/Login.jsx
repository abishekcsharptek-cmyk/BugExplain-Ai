import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaBug, FaGoogle } from 'react-icons/fa'
import { HiOutlineShieldCheck, HiOutlineLightningBolt } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Redirecting to Google...')
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-dark)] px-4 py-12">

      <div className="w-full max-w-[480px] z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
             <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--bg-card)] mb-6 border border-[var(--border)]">
               <FaBug className="text-[var(--primary)] text-3xl" />
             </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            <span className="text-[var(--text-primary)]">Welcome to BugExplain AI</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base font-medium max-w-[320px] mx-auto">
            Sign in with your Google account to start debugging with AI.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[var(--bg-card)] rounded-[2rem] p-10 border border-[var(--border)]">
          {/* Features List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center shrink-0">
                <HiOutlineLightningBolt className="text-[var(--primary)] text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">AI-Powered Solutions</h3>
                <p className="text-xs text-[var(--text-muted)]">Get instant explanations and fixes for your bugs</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center shrink-0">
                <HiOutlineShieldCheck className="text-[var(--primary)] text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Secure & Private</h3>
                <p className="text-xs text-[var(--text-muted)]">Your code and queries are protected</p>
              </div>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full h-16 rounded-2xl bg-white hover:bg-gray-200 border border-gray-300 text-gray-900 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <FaGoogle className="text-2xl" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Info Text */}
          <p className="text-xs text-[var(--text-muted)] text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Support Link */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-8 font-medium">
          Need help? Contact <a href="#" className="underline hover:text-[var(--text-secondary)]">Support Team</a>
        </p>
      </div>
    </div>
  )
}

