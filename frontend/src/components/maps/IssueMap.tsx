'use client'

import React, { useState } from 'react'
import { MapPin, Layers, RefreshCw } from 'lucide-react'
import type { IssueReport } from '@/types'
import { ISSUE_TYPE_LABELS, ISSUE_TYPE_ICONS } from '@/types'
import { StatusPill, SeverityBadge } from '@/components/shared/StatusPill'

interface IssueMapProps {
  issues: IssueReport[]
  height?: string
  showControls?: boolean
  onIssueClick?: (issue: IssueReport) => void
}

// Bengaluru bounding box for random placement in demo
const BLURU_BOUNDS = {
  minLat: 12.88, maxLat: 13.05,
  minLng: 77.55, maxLng: 77.72,
}

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - BLURU_BOUNDS.minLng) / (BLURU_BOUNDS.maxLng - BLURU_BOUNDS.minLng)) * 100
  const y = ((BLURU_BOUNDS.maxLat - lat) / (BLURU_BOUNDS.maxLat - BLURU_BOUNDS.minLat)) * 100
  return {
    x: Math.min(Math.max(x, 5), 92),
    y: Math.min(Math.max(y, 5), 92),
  }
}

const SEVERITY_PIN_COLOR: Record<string, string> = {
  high: '#f43f5e',
  medium: '#f59e0b',
  low: '#14b8a6',
}

export function IssueMap({
  issues,
  height = 'h-80',
  showControls = true,
  onIssueClick,
}: IssueMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const visibleIssues = issues.filter(
    (i) => filter === 'all' || i.severity === filter
  )

  function handlePinClick(issue: IssueReport) {
    setSelectedIssue(issue.id === selectedIssue?.id ? null : issue)
    onIssueClick?.(issue)
  }

  return (
    <div className={`relative ${height} rounded-2xl overflow-hidden border border-[var(--border-color)]`}>
      {/* Map background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #115e59 100%)',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #115e59 100%)
          `,
          backgroundSize: '40px 40px, 40px 40px, 100% 100%',
        }}
      >
        {/* City roads — SVG overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          {/* Horizontal roads */}
          <line x1="0" y1="30%" x2="100%" y2="35%" stroke="white" strokeWidth="2" />
          <line x1="0" y1="55%" x2="100%" y2="50%" stroke="white" strokeWidth="3" />
          <line x1="0" y1="75%" x2="100%" y2="78%" stroke="white" strokeWidth="1.5" />
          {/* Vertical roads */}
          <line x1="20%" y1="0" x2="18%" y2="100%" stroke="white" strokeWidth="1.5" />
          <line x1="45%" y1="0" x2="48%" y2="100%" stroke="white" strokeWidth="3" />
          <line x1="72%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="2" />
          {/* Parks */}
          <rect x="60%" y="20%" width="15%" height="12%" fill="rgba(16,185,129,0.3)" rx="4" />
          <rect x="5%" y="60%" width="10%" height="15%" fill="rgba(16,185,129,0.25)" rx="4" />
          {/* Water body */}
          <ellipse cx="80%" cy="70%" rx="8%" ry="5%" fill="rgba(56,189,248,0.2)" />
        </svg>

        {/* City label */}
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur rounded-lg px-2 py-1">
          <p className="text-white/80 text-xs font-mono">Bengaluru, KA</p>
        </div>
      </div>

      {/* Issue pins */}
      {visibleIssues.map((issue) => {
        const pos = issue.location.lat && issue.location.lng
          ? latLngToPercent(issue.location.lat, issue.location.lng)
          : { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }

        const isSelected = selectedIssue?.id === issue.id
        const pinColor = SEVERITY_PIN_COLOR[issue.severity]

        return (
          <button
            key={issue.id}
            onClick={() => handlePinClick(issue)}
            className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-125 z-10"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={ISSUE_TYPE_LABELS[issue.type]}
          >
            {/* Pin */}
            <div
              className={`relative flex items-center justify-center rounded-full shadow-lg transition-transform ${
                isSelected ? 'scale-125' : ''
              }`}
              style={{
                width: isSelected ? 36 : 28,
                height: isSelected ? 36 : 28,
                background: pinColor,
                boxShadow: `0 0 0 3px ${pinColor}40`,
              }}
            >
              <span className="text-xs">{ISSUE_TYPE_ICONS[issue.type]}</span>
              {/* Pulse for high severity */}
              {issue.severity === 'high' && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: pinColor, opacity: 0.4 }}
                />
              )}
            </div>
            {/* Pin tail */}
            <div
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `8px solid ${pinColor}`,
              }}
            />
          </button>
        )
      })}

      {/* Tooltip for selected issue */}
      {selectedIssue && (() => {
        const pos = selectedIssue.location.lat && selectedIssue.location.lng
          ? latLngToPercent(selectedIssue.location.lat, selectedIssue.location.lng)
          : { x: 50, y: 50 }

        return (
          <div
            className="absolute z-20 w-52 glass-card p-3 shadow-glass-lg animate-fade-in pointer-events-none"
            style={{
              left: `${Math.min(pos.x, 65)}%`,
              top: `${Math.max(pos.y - 45, 5)}%`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span>{ISSUE_TYPE_ICONS[selectedIssue.type]}</span>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {ISSUE_TYPE_LABELS[selectedIssue.type]}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-2">
              {selectedIssue.description}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <SeverityBadge severity={selectedIssue.severity} size="sm" />
              <StatusPill status={selectedIssue.status} size="sm" />
            </div>
          </div>
        )
      })()}

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Filter buttons */}
          <div className="flex gap-1">
            {(['all', 'high', 'medium', 'low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-white text-teal-700 shadow'
                    : 'bg-black/30 text-white/70 hover:bg-black/50 backdrop-blur'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur rounded-xl px-3 py-2 z-10">
        <div className="flex items-center gap-3">
          {[
            { color: '#f43f5e', label: 'High' },
            { color: '#f59e0b', label: 'Med' },
            { color: '#14b8a6', label: 'Low' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-white/70 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Issue count badge */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur rounded-lg px-2 py-1 z-10">
        <p className="text-white/80 text-xs font-medium">
          {visibleIssues.length} issue{visibleIssues.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}