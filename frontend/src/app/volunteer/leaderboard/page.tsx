'use client'

import React from 'react'
import { Trophy, Star, CheckCircle, TrendingUp } from 'lucide-react'
import { MOCK_LEADERBOARD } from '@/lib/data'
import { useAppState } from '@/lib/context'

export default function LeaderboardPage() {
  const { currentUser } = useAppState()
  const currentUserRank = MOCK_LEADERBOARD.find((e) => e.volunteerId === currentUser?.id)

  const BADGE_STYLES: Record<number, string> = {
    1: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    2: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
    3: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          🏆 Volunteer Leaderboard
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Top volunteers making Bengaluru cleaner and safer
        </p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((entry, podiumIdx) => {
          if (!entry) return null
          const heights = ['h-24', 'h-32', 'h-20']
          const podiumColors = [
            'from-slate-400 to-slate-500',
            'from-amber-400 to-amber-500',
            'from-orange-400 to-orange-500',
          ]
          const isCenter = podiumIdx === 1

          return (
            <div key={entry.volunteerId} className={`flex flex-col items-center ${isCenter ? 'order-2' : podiumIdx === 0 ? 'order-1' : 'order-3'}`}>
              {/* Avatar */}
              <div className={`relative ${isCenter ? 'w-14 h-14' : 'w-11 h-11'} rounded-full overflow-hidden border-4 ${
                isCenter ? 'border-amber-400' : 'border-slate-300 dark:border-slate-600'
              } mb-1`}>
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-teal-100 flex items-center justify-center font-bold text-teal-600">
                    {entry.name[0]}
                  </div>
                )}
                {isCenter && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">👑</span>
                  </div>
                )}
              </div>

              <p className={`text-xs font-bold text-[var(--text-primary)] text-center leading-tight mb-0.5 ${isCenter ? 'text-sm' : ''}`}>
                {entry.name.split(' ')[0]}
              </p>
              <p className={`font-extrabold text-center ${isCenter ? 'text-lg text-amber-500' : 'text-sm text-slate-500'}`}>
                {entry.points}
                <span className="text-xs font-medium ml-0.5">pts</span>
              </p>

              {/* Podium bar */}
              <div className={`w-full ${heights[podiumIdx]} mt-2 bg-gradient-to-t ${podiumColors[podiumIdx]} rounded-t-xl flex items-start justify-center pt-2`}>
                <span className="text-white font-extrabold text-sm">
                  #{entry.rank}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wide">
            All Rankings
          </h3>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {MOCK_LEADERBOARD.map((entry) => {
            const isCurrentUser = entry.volunteerId === currentUser?.id
            const isTop3 = entry.rank <= 3

            return (
              <div
                key={entry.volunteerId}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isCurrentUser
                    ? 'bg-teal-50 dark:bg-teal-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                } ${isTop3 ? BADGE_STYLES[entry.rank] : ''}`}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  <span className="text-base">{entry.badge}</span>
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-200 dark:border-teal-700 flex-shrink-0">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                      {entry.name[0]}
                    </div>
                  )}
                </div>

                {/* Name + stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {entry.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {entry.issuesResolved} resolved
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-amber-500 flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3" />
                    {entry.points}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">points</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Your rank card */}
      {currentUserRank && (
        <div className="glass-card p-4 border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Your Current Rank</p>
              <p className="text-xs text-[var(--text-muted)]">
                #{currentUserRank.rank} with {currentUserRank.points} points · {currentUserRank.issuesResolved} issues resolved
              </p>
            </div>
            <div className="ml-auto text-2xl">{currentUserRank.badge}</div>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}