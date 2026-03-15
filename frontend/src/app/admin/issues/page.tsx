'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, RefreshCw } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { StatusPill, SeverityBadge } from '@/components/shared/StatusPill'
import { ISSUE_TYPE_LABELS, ISSUE_TYPE_ICONS } from '@/types'
import type { IssueStatus, Severity } from '@/types'

export default function AdminIssuesPage() {
  const { allIssues, updateIssueStatus } = useIssues()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = allIssues.filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !issue.description.toLowerCase().includes(q) &&
        !issue.location.address.toLowerCase().includes(q) &&
        !issue.type.toLowerCase().includes(q) &&
        !issue.id.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  async function handleAction(issueId: string, action: 'resolve' | 'dispatch' | 'assign') {
    setActionLoading(`${issueId}-${action}`)
    await new Promise((r) => setTimeout(r, 600))
    if (action === 'resolve') updateIssueStatus(issueId, 'resolved')
    else updateIssueStatus(issueId, 'inprogress')
    setActionLoading(null)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
            Issue Management
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {filtered.length} issues · Manage, dispatch, and resolve civic reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:border-teal-400 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:border-teal-400 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, type, location..."
            className="input-base pl-9"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">Priority</p>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'high', 'medium', 'low'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    severityFilter === s
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">Status</p>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'pending', 'inprogress', 'resolved'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    statusFilter === s
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
                  }`}
                >
                  {s === 'all' ? 'All' : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-800/30">
                {['Issue ID', 'Type', 'Location', 'Severity', 'Volunteers', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Filter className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--text-muted)]">No issues match your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((issue) => (
                  <tr key={issue.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        #{issue.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                        <span>{ISSUE_TYPE_ICONS[issue.type]}</span>
                        {ISSUE_TYPE_LABELS[issue.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[var(--text-secondary)] max-w-[110px] truncate block">
                        {issue.location.area ?? issue.location.address}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={issue.severity} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {issue.volunteers.slice(0, 3).map((v) => (
                            <div
                              key={v.id}
                              title={v.name}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-teal-100"
                            >
                              {v.avatar
                                ? <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">{v.name[0]}</div>
                              }
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{issue.volunteers.length}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={issue.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {issue.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(issue.id, 'dispatch')}
                              disabled={actionLoading === `${issue.id}-dispatch`}
                              className="text-xs px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors font-medium whitespace-nowrap disabled:opacity-50"
                            >
                              {actionLoading === `${issue.id}-dispatch` ? '...' : '🚛 Dispatch'}
                            </button>
                            <button
                              onClick={() => handleAction(issue.id, 'assign')}
                              disabled={actionLoading === `${issue.id}-assign`}
                              className="text-xs px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors font-medium whitespace-nowrap disabled:opacity-50"
                            >
                              {actionLoading === `${issue.id}-assign` ? '...' : '👥 Assign'}
                            </button>
                          </>
                        )}
                        {issue.status !== 'resolved' && (
                          <button
                            onClick={() => handleAction(issue.id, 'resolve')}
                            disabled={actionLoading === `${issue.id}-resolve`}
                            className="text-xs px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors font-medium whitespace-nowrap disabled:opacity-50"
                          >
                            {actionLoading === `${issue.id}-resolve` ? '...' : '✓ Resolve'}
                          </button>
                        )}
                        {issue.status === 'resolved' && (
                          <span className="text-xs text-teal-500 font-medium">✅ Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            Showing {filtered.length} of {allIssues.length} issues
          </p>
          <div className="flex items-center gap-1">
            {(['pending', 'inprogress', 'resolved'] as const).map((s) => {
              const count = allIssues.filter((i) => i.status === s).length
              return (
                <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s === 'pending' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  : s === 'inprogress' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                  : 'bg-teal-50 dark:bg-teal-900/20 text-teal-600'
                }`}>
                  {count} {s === 'inprogress' ? 'active' : s}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}