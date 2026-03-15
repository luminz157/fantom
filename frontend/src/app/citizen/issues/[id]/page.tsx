'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, MapPin, Plus } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAuth } from '@/hooks/useAuth'
import { IssueCard } from '@/components/shared/IssueCard'
import type { IssueStatus, Severity } from '@/types'

export default function MyIssuesPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { myIssues } = useIssues()

  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = myIssues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !issue.description.toLowerCase().includes(q) &&
        !issue.location.address.toLowerCase().includes(q) &&
        !issue.type.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  // Summary counts
  const counts = {
    all: myIssues.length,
    pending: myIssues.filter((i) => i.status === 'pending').length,
    inprogress: myIssues.filter((i) => i.status === 'inprogress').length,
    resolved: myIssues.filter((i) => i.status === 'resolved').length,
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
            My Reports
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {myIssues.length} total issue{myIssues.length !== 1 ? 's' : ''} reported
          </p>
        </div>
        <button
          onClick={() => router.push('/citizen/report')}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          New Report
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { key: 'all', label: 'All', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
          { key: 'pending', label: 'Pending', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
          { key: 'inprogress', label: 'Active', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
          { key: 'resolved', label: 'Resolved', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as IssueStatus | 'all')}
            className={`rounded-xl p-2.5 text-center transition-all border-2 ${
              statusFilter === tab.key
                ? 'border-teal-400 dark:border-teal-600 ' + tab.color
                : 'border-transparent ' + tab.color + ' opacity-70'
            }`}
          >
            <p className="text-base font-extrabold">
              {counts[tab.key as keyof typeof counts]}
            </p>
            <p className="text-xs font-medium leading-tight mt-0.5">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your reports..."
          className="input-base pl-9"
        />
      </div>

      {/* Severity filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-muted)] font-medium">Priority:</span>
        </div>
        {(['all', 'high', 'medium', 'low'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              severityFilter === s
                ? s === 'high' ? 'bg-rose-500 text-white border-rose-500'
                  : s === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                  : s === 'low' ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-slate-500 text-white border-slate-500'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
            }`}
          >
            {s === 'all' ? 'All'
              : s === 'high' ? '🔴 High'
              : s === 'medium' ? '🟡 Medium'
              : '🟢 Low'}
          </button>
        ))}
      </div>

      {/* Results */}
      {!isLoggedIn ? (
        <div className="glass-card p-10 text-center border-dashed">
          <MapPin className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            Sign in to see your reports
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Create an account to track your civic issue reports
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="btn-primary text-xs py-2 px-6"
          >
            Sign In
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-10 text-center border-dashed">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-teal-400" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            {myIssues.length === 0 ? 'No reports yet' : 'No results found'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            {myIssues.length === 0
              ? 'Spot a civic issue? Be the first to report it!'
              : 'Try adjusting your search or filters'}
          </p>
          {myIssues.length === 0 && (
            <button
              onClick={() => router.push('/citizen/report')}
              className="btn-primary text-xs py-2 px-6"
            >
              Report First Issue
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          <p className="text-xs text-[var(--text-muted)]">
            Showing{' '}
            <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span>
            {' '}issue{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              variant="citizen"
              onViewDetail={(id) => router.push(`/citizen/issues/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}