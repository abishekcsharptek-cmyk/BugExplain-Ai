import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ChatBox from '../components/ChatBox'
import HistoryList from '../components/HistoryList'
import { HiOutlineClock, HiOutlinePlus, HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { GoogleGenerativeAI } from '@google/generative-ai'
 
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
 
export default function Dashboard() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [currentResponse, setCurrentResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
 
  // Fetch chat history on mount
  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])
 
  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
 
      if (error) throw error
      setHistory(data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }
 
  const handleSendMessage = async (question) => {
    if (!GEMINI_API_KEY) {
      toast.error('Gemini API Key missing! Please add VITE_GEMINI_API_KEY to your .env')
      return
    }
 
    setIsLoading(true)
    setCurrentResponse('')
    setSelectedChat(null)
 
    try {
      // Use Gemini 2.5 Flash
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: `You are BugExplain AI, an expert debugging assistant. When a user provides an error message or buggy code, analyze it and provide a structured response in this format:
 
 ## 🔍 Explanation
 Explain what the error means in simple terms.
 
 ## 🎯 Root Cause
 Identify the exact root cause of the error.
 
 ## 🛠️ Fix Steps
 Provide step-by-step instructions to fix the error:
 1. Step one
 2. Step two
 3. Step three
 
 ## ✅ Corrected Code
 \`\`\`
 Provide the corrected code here
 \`\`\`
 
 ## 💡 Prevention Tips
 Brief tips to prevent this error in the future.
 
 Be concise but thorough. Use markdown formatting.`,
      })
 
      const result = await model.generateContent(question)
      const aiResponse = result.response.text() || 'No response received'
 
      setCurrentResponse(aiResponse)
 
      // Save to database
      const { error: saveError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          question: question,
          response: aiResponse,
        })
 
      if (saveError) {
        console.error('Error saving chat:', saveError)
        toast.error('Failed to save chat')
      } else {
        // Refresh history
        fetchHistory()
        toast.success('Response saved with Gemini! ✨')
      }
    } catch (error) {
      console.error('Error:', error)
      if (error.message.includes('API key')) {
        toast.error('Invalid API key. Please check your Gemini API key.')
      } else if (error.message.includes('429')) {
        toast.error('Rate limit exceeded. Please wait and try again.')
      } else {
        toast.error(error.message || 'Failed to get Gemini response')
      }
      setCurrentResponse('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    setCurrentResponse(chat.response)
    setSidebarOpen(false)
  }

  const handleDeleteChat = async (chatId) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id)

      if (error) throw error

      setHistory(prev => prev.filter(h => h.id !== chatId))
      if (selectedChat?.id === chatId) {
        setSelectedChat(null)
        setCurrentResponse('')
      }
      toast.success('Chat deleted')
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const handleNewChat = () => {
    setSelectedChat(null)
    setCurrentResponse('')
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] relative overflow-hidden">
      <div className="flex h-screen relative z-10">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:relative z-40 top-0 bottom-0 left-0 w-80 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--bg-input)]">
                  <HiOutlineClock className="text-[var(--text-secondary)] text-lg" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Chat History</h2>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-medium">Your activity</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-[var(--text-muted)] transition-all cursor-pointer"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>

            <button
              onClick={handleNewChat}
              className="group w-full relative overflow-hidden rounded-2xl transition-all duration-300 bg-[var(--primary)] hover:bg-white active:scale-[0.98] cursor-pointer"
            >
              <div className="relative flex items-center justify-center gap-2 py-3">
                <HiOutlinePlus className="text-xl text-[var(--bg-dark)] transition-colors" />
                <span className="text-sm font-bold text-[var(--bg-dark)] uppercase tracking-wider">Start New Chat</span>
              </div>
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="spinner"></div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Syncing conversations</p>
              </div>
            ) : (
              <HistoryList
                history={history}
                onSelect={handleSelectChat}
                onDelete={handleDeleteChat}
                selectedId={selectedChat?.id}
              />
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]"></div>
                   <div className="absolute -inset-1 bg-[var(--success)]/20 rounded-full animate-ping"></div>
                </div>
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {history.length} <span className="text-[var(--text-muted)]">Saved</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                <span className="text-[9px] font-bold text-[var(--text-primary)] uppercase tracking-tighter italic">PRO</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-dark)]">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)] active:scale-95 cursor-pointer"
              >
                <HiOutlineMenuAlt2 className="text-xl" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest leading-none">Dashboard</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">{selectedChat ? 'Reviewing History' : 'Assistant Ready'}</span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">AI</span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 lg:pl-32 lg:pr-24">
            <div className="max-w-5xl mx-auto h-full flex flex-col items-center">
              <div className="w-full flex-1 flex flex-col py-12 mb-10">
                {/* If viewing a history item */}
                {selectedChat && !isLoading && (
                  <div className="animate-fade-in px-2 mb-12 max-w-3xl mx-auto w-full">
                    <div className="group relative">
                      <div className="relative bg-[var(--bg-card)] rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <span className="text-[12px]">👤</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Original Query</span>
                              <p className="text-[11px] text-[var(--primary)] font-medium mt-0.5">{new Date(selectedChat.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
                             <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Your Question</span>
                          </div>
                        </div>
                        <div className="bg-[var(--bg-dark)]/50 rounded-2xl p-5 border border-white/5">
                          <p className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed whitespace-pre-wrap selection:bg-[var(--primary)]/30">{selectedChat.question}</p>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center gap-4 my-8 px-10">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">Analysis Below</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                  </div>
                )}

                <ChatBox
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  currentResponse={currentResponse}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
