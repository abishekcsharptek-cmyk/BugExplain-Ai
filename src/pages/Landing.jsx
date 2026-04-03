import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCode } from 'react-icons/hi';
import { FaBug, FaMagic, FaCogs } from 'react-icons/fa';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans overflow-x-hidden selection:bg-[#ffffff] selection:text-[#131313]">
      
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <FaBug className="text-white text-2xl" />
          <span className="text-lg font-bold tracking-tight text-white">BugExplain <span className="opacity-50">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-[#c6c6c6] hover:text-white transition-colors">Log In</Link>
          <Link to="/signup" className="text-sm font-medium text-[#1a1c1c] bg-white px-5 py-2.5 rounded-lg hover:bg-[#e2e2e2] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-8 max-w-4xl leading-[1.1]">
          Smarter debugging. <br />
          <span className="text-[#a1a1a1]">Faster fixes.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#c6c6c6] max-w-2xl font-light leading-relaxed mb-12">
          Paste your stack trace. Get instant, structured root-cause analysis and the exact code required to fix it. Powered by Gemini AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/signup" className="text-base font-semibold text-[#1a1c1c] bg-white px-8 py-4 rounded-xl hover:bg-[#e2e2e2] transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Start Debugging Free
          </Link>
          <a href="#features" className="text-base font-medium text-[#e2e2e2] bg-[#1f1f1f] px-8 py-4 rounded-xl hover:bg-[#2a2a2a] transition-all">
            See How It Works
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#1b1b1b] p-10 flex flex-col gap-6 group hover:bg-[#1f1f1f] transition-colors rounded-2xl">
            <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
              <FaCogs className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Root Cause</h3>
              <p className="text-[#c6c6c6] leading-relaxed text-sm">
                Stop guessing. We analyze your logs and instantly point you to the exact line of code causing the failure.
              </p>
            </div>
          </div>

          <div className="bg-[#1b1b1b] p-10 flex flex-col gap-6 group hover:bg-[#1f1f1f] transition-colors rounded-2xl">
            <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
              <HiOutlineCode className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Structured Fixes</h3>
              <p className="text-[#c6c6c6] leading-relaxed text-sm">
                Get more than just an explanation. Receive copy-paste ready code snippets that implement the correct fix securely.
              </p>
            </div>
          </div>

          <div className="bg-[#1b1b1b] p-10 flex flex-col gap-6 group hover:bg-[#1f1f1f] transition-colors rounded-2xl">
            <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
              <FaMagic className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Powered by Gemini AI</h3>
              <p className="text-[#c6c6c6] leading-relaxed text-sm">
                Backed by Google's Gemini 1.5 Flash, bringing unparalleled speed and context understanding to your debugging workflow.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] border-opacity-50 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <FaBug className="text-[#5d5f5f]" />
            <span className="text-sm font-medium text-[#5d5f5f]">BugExplain AI</span>
          </div>
          <p className="text-[#5d5f5f] text-sm">© {new Date().getFullYear()} BugExplain AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
