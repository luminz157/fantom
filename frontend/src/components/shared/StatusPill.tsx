'use client'

import React from 'react'
import type { IssueStatus, Severity } from '@/types'

interface StatusPillProps {
  status: IssueStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<IssueStatus, { label: string; className: string; dot: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  inprogress: {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500 animate-pulse',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    dot: 'bg-teal-500',
  },
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const config = STATUS_CONFIG[status]
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${textSize} ${padding} ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

// ─── Severity Badge ───────────────────────────────────────────
interface SeverityBadgeProps {
  severity: Severity
  size?: 'sm' | 'md'
}

const SEVERITY_CONFIG: Record<Severity, { label: string; className: string; icon: string }> = {
  high: {
    label: 'High',
    className: 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    icon: '🔴',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    icon: '🟡',
  },
  low: {
    label: 'Low',
    className: 'bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
    icon: '🟢',
  },
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity]
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-xs font-semibold ${padding} ${config.className}`}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  )
}