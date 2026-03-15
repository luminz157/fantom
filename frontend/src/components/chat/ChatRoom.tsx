'use client'

import React, { useState } from 'react'
import { X, Send, MessageCircle, Users } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useIssues } from '@/hooks/useIssues'
import { MessageBubble } from './MessageBubble'
import { ISSUE_TYPE_LABELS, ISSUE_TYPE_ICONS } from '@/types'

interface ChatRoomProps {
  issueId: string
  onClose: () => void
}

export function ChatRoom({ issueId, onClose }: ChatRoomProps) {
  const {
    messages,
    send,
    isOwnMessage,
    formatTime,
    messagesEndRef,
    currentUser,
  } = useChat(issueId)

  const { getIssueById } = useIssues()
  const [input, setInput] = useState('')

  const issue = getIssueById(issueId)

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    send(input)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        send(input)
        setInput('')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md glass-card shadow-glass-lg flex flex-col overflow-hidden animate-slide-up"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] flex-shrink-0 bg-gradient-to-r from-teal-50/50 to-transparent dark:from-teal-900/20">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-teal-500" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-[var(--text-primary)]">
              Volunteer Team Chat
            </p>
            {issue && (
              <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                {ISSUE_TYPE_ICONS[issue.type]} {ISSUE_TYPE_LABELS[issue.type]}
                {' · '}
                {issue.location.area ?? issue.location.address}
              </p>
            )}
          </div>

          {/* Team member avatars */}
          {issue && issue.volunteers.length > 0 && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex -space-x-2">
                {issue.volunteers.slice(0, 4).map((v) => (
                  <div
                    key={v.id}
                    title={v.name}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-teal-100 dark:bg-teal-900"
                  >
                    {v.avatar ? (
                      <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                        {v.name[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-0.5">
                <Users className="w-3 h-3" />
                {issue.volunteers.length}
              </span>
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No messages yet
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Start coordinating with your team!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={isOwnMessage(msg.senderId)}
                  formatTime={formatTime}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Input ── */}
        <div className="border-t border-[var(--border-color)] p-3 flex-shrink-0 bg-[var(--bg-secondary)]/50">
          {currentUser ? (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Current user mini avatar */}
              <div className="w-7 h-7 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900/40 flex-shrink-0 border-2 border-teal-200 dark:border-teal-700">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                    {currentUser.name[0]}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send)"
                className="input-base flex-1 py-2 text-xs"
                autoFocus
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-teal-500 hover:bg-teal-600
                           disabled:opacity-40 disabled:cursor-not-allowed
                           flex items-center justify-center transition-all
                           hover:shadow-md active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-[var(--text-muted)]">
                Sign in to send messages to the volunteer team
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  )
}