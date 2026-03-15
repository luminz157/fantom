'use client'

import React from 'react'
import type { Severity } from '@/types'

interface SeverityCardProps {
  severity: Severity
  showLabel?: boolean
  className?: string
}

const SEVERITY_STYLES: Record<Severity, {
  bar: string
  bg: string
  text: string
  label: string
  description: string
  width: string
}> = {
  high: {
    bar: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-600 dark:text-rose-400',
    label: '🔴 High Priority',
    description: 'Needs immediate attention',
    width: 'w-full',
  },
  medium: {
    bar: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    label: '🟡 Medium Priority',
    description: 'Should be resolved soon',
    width: 'w-2/3',
  },
  low: {
    bar: 'bg-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-600 dark:text-teal-400',
    label: '🟢 Low Priority',
    description: 'Can be scheduled',
    width: 'w-1/3',
  },
}

export function SeverityCard({
  severity,
  showLabel = true,
  className = '',
}: SeverityCardProps) {
  const style = SEVERITY_STYLES[severity]

  return (
    <div className={`rounded-xl p-3 ${style.bg} ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold ${style.text}`}>{style.label}</span>
          <span className={`text-xs ${style.text} opacity-75`}>{style.description}</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${style.bar} ${style.width} transition-all duration-700`} />
      </div>
    </div>
  )
}

interface AISeverityProps {
  isAnalyzing?: boolean
  severity?: Severity
}

export function AISeverityAnalyzer({ isAnalyzing = false, severity }: AISeverityProps) {
  if (isAnalyzing) {
    return (
      <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
            AI analyzing severity...
          </span>
        </div>
        <div className="mt-2 space-y-1">
          {['Scanning image...', 'Detecting issue type...', 'Calculating urgency...'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-1 h-1 rounded-full bg-teal-400 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
              <span className="text-xs text-teal-500">{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!severity) return null

  return (
    <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🤖</span>
        <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
          AI Severity Assessment
        </span>
      </div>
      <SeverityCard severity={severity} showLabel={true} />
    </div>
  )
}


