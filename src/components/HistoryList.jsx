import { HiOutlineClock, HiOutlineTrash, HiOutlineChat, HiOutlineChevronRight } from 'react-icons/hi'
import { FaBug } from 'react-icons/fa'

export default function HistoryList({ history, onSelect, onDelete, selectedId }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-input)] border border-[var(--border)] flex items-center justify-center mb-4">
          <HiOutlineChat className="text-2xl text-[var(--text-muted)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">No history yet</p>
        <p className="text-xs text-[var(--text-muted)]">Your conversations will appear here</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {history.map((item, index) => (
        <div
          key={item.id}
          className={`group relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 animate-slide-in-left ${
            selectedId === item.id
              ? 'bg-[var(--bg-input)] border border-transparent'
              : 'hover:bg-[var(--bg-input)] border border-transparent'
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelect(item)}
        >
          {/* Active Indicator Bar */}
          {selectedId === item.id && (
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--primary)] rounded-r-full"></div>
          )}

          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            selectedId === item.id
              ? 'bg-[var(--primary)] text-[var(--bg-dark)]'
              : 'bg-[var(--bg-card)]'
          }`}>
            <FaBug className={`text-sm ${selectedId === item.id ? 'text-[var(--bg-dark)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`} />
          </div>
 
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-[13px] font-semibold truncate transition-colors ${
              selectedId === item.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
            }`}>
              {item.question}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <HiOutlineClock className="text-[10px] text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[var(--border)]"></div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">CHAT</span>
            </div>
          </div>
 
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="p-2 rounded-xl hover:bg-[var(--error)]/10 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors cursor-pointer"
                title="Delete Conversation"
              >
                <HiOutlineTrash className="text-sm" />
              </button>
            )}
            <HiOutlineChevronRight className={`text-sm ${selectedId === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
