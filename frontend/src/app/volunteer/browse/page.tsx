'use client'

import React, { useState } from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAppState } from '@/lib/context'
import { IssueCard } from '@/components/shared/IssueCard'
import { ChatPanel } from '@/components/chat/ChatPanel'
import type { Severity, IssueStatus } from '@/types'

export default function BrowseIssuesPage() {
  const { allIssues, joinVolunteer } = useIssues()
  const { currentUser, setShowLoginModal } = useAppState()

  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const [status, setStatus] = useState<IssueStatus | 'all'>('all')
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = allIssues.filter((issue) => {
    if (severity !== 'all' && issue.severity !== severity) return false
    if (status !== 'all' && issue.status !== status) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !issue.description.toLowerCase().includes(q) &&
        !issue.location.address.toLowerCase().includes(q) &&
        !issue.type.toLowerCase().includes(q)
      ) return false
    }
    return true
  }).sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  function handleJoin(issueId: string) {
    if (!currentUser) { setShowLoginModal(true); return }
    joinVolunteer(issueId)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Browse Issues</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Find civic issues near you and volunteer to help resolve them
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues by type, location..."
            className="input-base pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 rounded-xl border transition-all ${
            showFilters
              ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-600'
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card p-4 space-y-3 animate-slide-up">
          {/* Severity */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Priority</p>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'high', 'medium', 'low'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    severity === s
                      ? s === 'high' ? 'bg-rose-500 text-white border-rose-500'
                        : s === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                        : s === 'low' ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-teal-500 text-white border-teal-500'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
                  }`}
                >
                  {s === 'all' ? 'All' : s === 'high' ? '🔴 High' : s === 'medium' ? '🟡 Medium' : '🟢 Low'}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'inprogress'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    status === s
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
                  }`}
                >
                  {s === 'all' ? 'All' : s === 'inprogress' ? 'In Progress' : 'Pending'}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => { setSeverity('all'); setStatus('all'); setSearch('') }}
            className="text-xs text-rose-500 hover:underline font-medium"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span> issue{filtered.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
          <Filter className="w-3 h-3" />
          Sorted by priority
        </div>
      </div>

      {/* Issue cards */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Search className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">No issues found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              variant="volunteer"
              onVolunteerClick={handleJoin}
              onChatClick={(id) => setActiveChatId(id)}
            />
          ))}
        </div>
      )}

      {/* Chat Panel */}
      {activeChatId && (
        <ChatPanel issueId={activeChatId} onClose={() => setActiveChatId(null)} />
      )}
    </div>
  )
}