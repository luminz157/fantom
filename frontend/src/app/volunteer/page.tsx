'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, CheckCircle, Star, TrendingUp,
  ChevronRight, Bell, MapPin, Search
} from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAppState } from '@/lib/context'
import { useAuth } from '@/hooks/useAuth'
import { IssueCard } from '@/components/shared/IssueCard'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { MOCK_LEADERBOARD } from '@/lib/data'

export default function VolunteerDashboard() {
  const router = useRouter()
  const { currentUser, isLoggedIn, setShowLoginModal } = useAppState()
  const { requireLogin } = useAuth()
  const { allIssues, joinVolunteer, volunteerStats, myVolunteerIssues } = useIssues()

  const [activeChatIssueId, setActiveChatIssueId] = useState<string | null>(null)

  // Issues that need volunteers (pending or inprogress, not yet joined)
  const availableIssues = allIssues
    .filter((i) => i.status !== 'resolved')
    .filter((i) => !i.volunteers.some((v) => v.id === currentUser?.id))
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.severity] - order[b.severity]
    })

  function handleVolunteerJoin(issueId: string) {
    if (!requireLogin('volunteer')) {
      setShowLoginModal(true)
      return
    }
    joinVolunteer(issueId)
  }

  function handleChatOpen(issueId: string) {
    setActiveChatIssueId(issueId)
  }

  const topVolunteers = MOCK_LEADERBOARD.slice(0, 3)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="animate-fade-in">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          Volunteer Dashboard 🙋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Join tasks, coordinate with teams, and earn points for helping your city.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up">
        {[
          {
            label: 'Tasks Joined',
            value: volunteerStats.joined,
            icon: Users,
            color: 'text-teal-500',
            bg: 'bg-teal-50 dark:bg-teal-900/30',
          },
          {
            label: 'Resolved',
            value: volunteerStats.resolved,
            icon: CheckCircle,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          },
          {
            label: 'Points',
            value: currentUser?.points ?? 0,
            icon: Star,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/30',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card p-3 text-center">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-lg font-extrabold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] leading-tight">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Nearby Notification ── */}
      <div className="glass-card p-4 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 animate-slide-up flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
          <Bell className="w-4 h-4 text-amber-500 animate-pulse-soft" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
            {availableIssues.length} civic issue{availableIssues.length !== 1 ? 's' : ''} need your help!
          </p>
          <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-0.5">
            New civic issues reported near you. Become a volunteer and help resolve them.
          </p>
        </div>
        <button
          onClick={() => router.push('/volunteer/browse')}
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex-shrink-0"
        >
          Browse →
        </button>
      </div>

      {/* ── My Active Tasks ── */}
      {myVolunteerIssues.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
              ✅ My Active Tasks
            </h2>
            <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium">
              {myVolunteerIssues.filter(i => i.status !== 'resolved').length} active
            </span>
          </div>
          <div className="space-y-3">
            {myVolunteerIssues.slice(0, 3).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                variant="volunteer"
                onVolunteerClick={handleVolunteerJoin}
                onChatClick={handleChatOpen}
                showChat
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Available Issues Feed ── */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
            📋 Issues Needing Volunteers
          </h2>
          <button
            onClick={() => router.push('/volunteer/browse')}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium flex items-center gap-1"
          >
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {availableIssues.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <CheckCircle className="w-10 h-10 text-teal-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              All caught up! 🎉
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              No pending issues right now. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableIssues.slice(0, 4).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                variant="volunteer"
                onVolunteerClick={handleVolunteerJoin}
                onChatClick={handleChatOpen}
              />
            ))}
            {availableIssues.length > 4 && (
              <button
                onClick={() => router.push('/volunteer/browse')}
                className="w-full py-3 text-xs font-semibold text-teal-600 dark:text-teal-400
                           border border-dashed border-teal-300 dark:border-teal-800 rounded-xl
                           hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                View {availableIssues.length - 4} more issues →
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Mini Leaderboard ── */}
      <div className="glass-card p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
            🏆 Top Volunteers
          </h2>
          <button
            onClick={() => router.push('/volunteer/leaderboard')}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
          >
            Full Board →
          </button>
        </div>

        <div className="space-y-3">
          {topVolunteers.map((entry) => {
            const isCurrentUser = entry.volunteerId === currentUser?.id
            return (
              <div
                key={entry.volunteerId}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                  isCurrentUser
                    ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Rank */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{entry.badge}</span>
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-200 dark:border-teal-700 flex-shrink-0">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                      {entry.name[0]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {entry.name}
                    {isCurrentUser && <span className="text-teal-500 ml-1">(you)</span>}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.issuesResolved} resolved
                  </p>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-amber-500">{entry.points}</p>
                  <p className="text-xs text-[var(--text-muted)]">pts</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-4" />

      {/* ── Chat Panel Modal ── */}
      {activeChatIssueId && (
        <ChatPanel
          issueId={activeChatIssueId}
          onClose={() => setActiveChatIssueId(null)}
        />
      )}
    </div>
  )
}