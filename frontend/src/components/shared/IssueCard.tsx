'use client'

import React, { useState } from 'react'
import { MapPin, Users, ThumbsUp, Clock, ChevronRight } from 'lucide-react'
import type { IssueReport } from '@/types'
import { ISSUE_TYPE_LABELS, ISSUE_TYPE_ICONS } from '@/types'
import { StatusPill, SeverityBadge } from './StatusPill'
import { useAppState } from '@/lib/context'
import { formatDistanceToNow } from 'date-fns'

interface IssueCardProps {
  issue: IssueReport
  variant?: 'citizen' | 'volunteer' | 'admin'
  onVolunteerClick?: (issueId: string) => void
  onChatClick?: (issueId: string) => void
  onViewDetail?: (issueId: string) => void
  showChat?: boolean
  className?: string
}

export function IssueCard({
  issue,
  variant = 'citizen',
  onVolunteerClick,
  onChatClick,
  onViewDetail,
  showChat = false,
  className = '',
}: IssueCardProps) {
  const { currentUser } = useAppState()
  const [imgError, setImgError] = useState(false)

  const hasJoined = issue.volunteers.some((v) => v.id === currentUser?.id)
  const timeAgo = formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })

  const severityBorder: Record<string, string> = {
    high: 'border-l-rose-500',
    medium: 'border-l-amber-500',
    low: 'border-l-teal-500',
  }

  return (
    <div className={`glass-card border-l-4 ${severityBorder[issue.severity]} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group ${className}`}>
      {issue.photoUrl && !imgError && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={issue.photoUrl}
            alt={ISSUE_TYPE_LABELS[issue.type]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <SeverityBadge severity={issue.severity} size="sm" />
          </div>
          <div className="absolute top-2 right-2">
            <StatusPill status={issue.status} size="sm" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-2 left-2">
            <span className="text-white text-xs font-medium bg-black/40 rounded px-1.5 py-0.5">
              📍 {issue.location.area ?? issue.location.address}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{ISSUE_TYPE_ICONS[issue.type]}</span>
              <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                {ISSUE_TYPE_LABELS[issue.type]}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              #{issue.id.slice(-8).toUpperCase()}
            </p>
          </div>
          {(!issue.photoUrl || imgError) && (
            <div className="flex flex-col items-end gap-1">
              <SeverityBadge severity={issue.severity} size="sm" />
              <StatusPill status={issue.status} size="sm" />
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 leading-relaxed">
          {issue.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{issue.location.address}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>Resolution Progress</span>
            <span className="font-medium text-[var(--accent)]">{issue.progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${issue.progressPercent}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {issue.volunteers.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-teal-100"
                  title={v.name}
                >
                  {v.avatar ? (
                    <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-teal-600 font-bold">
                      {v.name[0]}
                    </div>
                  )}
                </div>
              ))}
              {issue.volunteers.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-teal-500 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">+{issue.volunteers.length - 3}</span>
                </div>
              )}
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              <Users className="w-3 h-3 inline mr-0.5" />
              {issue.volunteers.length} volunteer{issue.volunteers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <ThumbsUp className="w-3 h-3" />
            {issue.upvotes}
          </div>
        </div>

        {variant === 'volunteer' && (
          <div className="mt-3 flex gap-2">
            {!hasJoined ? (
              <button
                onClick={() => onVolunteerClick?.(issue.id)}
                className="flex-1 btn-primary text-xs py-2"
              >
                + Volunteer
              </button>
            ) : (
              <button
                onClick={() => onChatClick?.(issue.id)}
                className="flex-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-lg text-xs py-2 font-semibold hover:bg-teal-100 transition-colors"
              >
                💬 Open Team Chat
              </button>
            )}
            {hasJoined && (
              <button
                onClick={() => onVolunteerClick?.(issue.id)}
                className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs py-2 font-medium"
              >
                ✓ Joined
              </button>
            )}
          </div>
        )}

        {variant === 'citizen' && onViewDetail && (
          <button
            onClick={() => onViewDetail(issue.id)}
            className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
          >
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}