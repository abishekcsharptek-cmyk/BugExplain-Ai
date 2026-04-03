import { useState, useRef, useEffect } from 'react'
import { HiOutlinePaperAirplane, HiOutlineCode, HiOutlineSparkles } from 'react-icons/hi'
import { FaBug } from 'react-icons/fa'

export default function ChatBox({ onSendMessage, isLoading, currentResponse }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const examplePrompts = [
    {
      icon: <HiOutlineCode className="text-[var(--primary)]" />,
      text: "TypeError: Cannot read property 'map' of undefined",
      label: "React Error",
      description: "Common state management or API data error"
    },
    {
      icon: <FaBug className="text-[var(--accent)]" />,
      text: "CORS policy: No 'Access-Control-Allow-Origin' header",
      label: "CORS Error",
      description: "Cross-origin resource sharing issue"
    },
    {
      icon: <HiOutlineSparkles className="text-[var(--warning)]" />,
      text: "ModuleNotFoundError: No module named 'pandas'",
      label: "Python Error",
      description: "Environment or dependency missing"
    }
  ]

  return (
    <div className="w-full h-full flex flex-col justify-between pt-10">
      {/* Welcome Section - shown when no response */}
      {!currentResponse && !isLoading && (
        <div className="text-center animate-fade-in flex-1 flex flex-col justify-center mb-10">
          <div className="relative inline-block mb-10 group">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--bg-card)] transition-transform duration-300">
              <FaBug className="text-[var(--primary)] text-3xl opacity-80" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            <span className="gradient-text">BugExplain AI</span>
            <span className="block mt-2 text-[var(--text-primary)] font-semibold">Smarter debugging. Faster fixes.</span>
          </h2>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-14 px-4 text-[var(--text-secondary)] text-center">
            Paste your error message or buggy code below. We'll identify the root cause and provide the exact fix in seconds.
          </p>

          {/* Example Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2 max-w-5xl mx-auto px-4">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt.text)}
                className="group relative flex flex-col items-start gap-5 p-8 rounded-[2rem] bg-[var(--bg-card)] transition-all duration-300 text-left overflow-hidden hover:bg-[var(--bg-card-hover)] cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-input)] border border-white/5 group-hover:bg-[var(--primary)]/10 transition-colors">
                    <div className="text-2xl">{prompt.icon}</div>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                    {prompt.label}
                  </span>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <p className="text-[14px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-relaxed line-clamp-3 italic">
                    "{prompt.text}"
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                    {prompt.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 relative z-10">
                  <span className="text-[11px] font-bold text-[var(--primary)] uppercase">Try this</span>
                  <HiOutlinePaperAirplane className="text-xs text-[var(--primary)] rotate-90" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Response Section */}
      {(currentResponse || isLoading) && (
        <div className="mb-12 animate-fade-in px-4 max-w-5xl mx-auto w-full flex-1">
          <div className="relative group">
            <div className="relative bg-[var(--bg-card)] rounded-[2rem] overflow-hidden">
              {isLoading && !currentResponse ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-input)] flex items-center justify-center animate-spin-slow">
                      <FaBug className="text-[var(--primary)] text-2xl" />
                    </div>
                    <div className="absolute -inset-2 border-2 border-dashed border-[var(--primary)]/30 rounded-2xl animate-spin-reverse-slow"></div>
                  </div>
                  <div className="text-center">
                    <div className="typing-indicator justify-center mb-2">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p className="text-sm font-medium gradient-text uppercase tracking-[0.2em]">Analyzing DNA of your error...</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Generating step-by-step fix solution</p>
                  </div>
                </div>
              ) : (
                <div className="markdown-content">
                  <div className="flex items-center justify-between p-6 bg-[var(--bg-card-hover)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center">
                        <FaBug className="text-white text-lg opacity-80" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[var(--text-primary)]">BugExplain <span className="gradient-text">Intelligence</span></span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"></div>
                          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Solution Ready</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border)]">
                        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">GPT-4 Turbo</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="p-8 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={{ __html: formatResponse(currentResponse) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
    <div className="w-full py-6 bg-[var(--bg-dark)] sticky bottom-0 border-t border-[var(--border)] mt-auto z-50">
        <form onSubmit={handleSubmit} className="relative z-10 px-4 max-w-5xl mx-auto w-full">
          <div className="group relative">
            <div className="relative bg-[var(--bg-card)] rounded-[1.6rem] p-2 transition-colors duration-300 border border-[var(--border)]">
              <div className="flex items-center gap-3 rounded-[1.2rem] bg-[var(--bg-input)] transition-all duration-300 px-4 py-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What seems to be the problem? Paste your error code or stack trace..."
                  rows={1}
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:text-xs md:placeholder:text-sm text-sm resize-none outline-none py-3 min-h-[44px] max-h-[200px] overflow-y-auto custom-scrollbar"
                  style={{ lineHeight: '1.6' }}
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="shrink-0 w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-[var(--bg-dark)] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[var(--bg-dark)]/30 border-t-[var(--bg-dark)] rounded-full animate-spin"></div>
                    ) : (
                      <HiOutlinePaperAirplane className="text-lg rotate-90" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4 mb-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-white/5 shadow-sm">
               <kbd className="text-[9px] text-[var(--text-muted)] font-mono">ENTER</kbd>
               <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">to send</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--border)]"></div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-white/5 shadow-sm">
               <kbd className="text-[9px] text-[var(--text-muted)] font-mono">SHIFT + ENTER</kbd>
               <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">for new line</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Simple markdown-like formatter
function formatResponse(text) {
  if (!text) return ''
  
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block bg-[#0d0d14] rounded-lg p-4 my-3 overflow-x-auto border border-[#1e1e2e]"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#f1f1f7] mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-[#f1f1f7] mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[#f1f1f7] mt-5 mb-3">$1</h1>')
    // Bullet points
    .replace(/^[•\-\*] (.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-[#6366f1] mt-1">•</span><span>$1</span></div>')
    // Numbered lists
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-[#06b6d4] font-semibold min-w-[20px]">$1.</span><span>$2</span></div>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}
