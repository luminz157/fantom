'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText, CheckCircle, TrendingUp, Plus,
  Quote, ChevronRight, MapPin, Sparkles
} from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAuth } from '@/hooks/useAuth'
import { useAppState } from '@/lib/context'
import { IssueCard } from '@/components/shared/IssueCard'
import { CIVIC_QUOTES } from '@/lib/data'

export default function CitizenDashboard() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { setShowLoginModal } = useAppState()
  const { myStats, myIssues, allIssues } = useIssues()

  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % CIVIC_QUOTES.length)
        setQuoteVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  function handleReportClick() {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    router.push('/citizen/report')
  }

  const currentQuote = CIVIC_QUOTES[quoteIndex]

  const statCards = [
    {
      label: 'Reports Submitted',
      value: myStats.total,
      icon: FileText,
      bg: 'from-teal-500/10 to-cyan-500/10',
      border: 'border-teal-200 dark:border-teal-800',
      iconBg: 'bg-teal-100 dark:bg-teal-900/50',
      iconColor: 'text-teal-600 dark:text-teal-400',
      sub: `${myStats.inProgress} in progress`,
      subColor: 'text-amber-500',
    },
    {
      label: 'Issues Resolved',
      value: myStats.resolved,
      icon: CheckCircle,
      bg: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      sub: myStats.total > 0
        ? `${Math.round((myStats.resolved / myStats.total) * 100)}% resolution rate`
        : 'Start reporting!',
      subColor: 'text-teal-500',
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">

      {/* Welcome */}
      <div className="animate-fade-in">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          {isLoggedIn ? 'Welcome back 👋' : 'Welcome to CivicPulse 🌆'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Report civic issues and help build a better city.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`glass-card bg-gradient-to-br ${card.bg} border ${card.border} p-4`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">{card.value}</p>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">{card.label}</p>
              <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Quote */}
      <div className={`glass-card p-5 border border-teal-200 dark:border-teal-800 transition-opacity duration-300 ${quoteVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
            <Quote className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed italic">
              "{currentQuote.text}"
            </p>
            <p className="text-xs text-teal-500 mt-1.5 font-medium">— {currentQuote.author}</p>
          </div>
          <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
        </div>
        <div className="flex items-center gap-1.5 mt-3 justify-center">
          {CIVIC_QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setQuoteIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === quoteIndex ? 'bg-teal-500 w-3' : 'bg-teal-200 dark:bg-teal-800'}`}
            />
          ))}
        </div>
      </div>

      {/* Report Button */}
      <button
        onClick={handleReportClick}
        className="w-full relative overflow-hidden rounded-2xl p-6 text-left group
                   bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg
                   hover:shadow-xl hover:from-teal-600 hover:to-cyan-700
                   transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Civic Report
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight">Report an Issue</h2>
            <p className="text-teal-100/80 text-xs mt-1">Pothole • Garbage • Streetlight • Water leak</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <span className="text-xs">🤖</span>
          <span className="text-white/90 text-xs font-medium">AI Severity Detection</span>
        </div>
      </button>

      {/* My Reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[var(--text-primary)]">📋 My Reports</h2>
          {myIssues.length > 0 && (
            <button
              onClick={() => router.push('/citizen/issues')}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {myIssues.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-teal-400" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">No reports yet</p>
            <p className="text-xs text-[var(--text-muted)] mb-4">Spot a civic issue? Be the first to report it!</p>
            <button onClick={handleReportClick} className="btn-primary text-xs py-2 px-5">
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myIssues.slice(0, 3).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                variant="citizen"
                onViewDetail={(id) => router.push(`/citizen/issues/${id}`)}
              />
            ))}
            {myIssues.length > 3 && (
              <button
                onClick={() => router.push('/citizen/issues')}
                className="w-full py-3 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-dashed border-teal-300 dark:border-teal-800 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                View {myIssues.length - 3} more reports →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="glass-card p-5 border border-[var(--border-color)]">
        <h3 className="text-xs font-extrabold text-[var(--text-primary)] mb-4 uppercase tracking-wide">
          🌆 Community Impact
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: allIssues.length, label: 'Total Issues', emoji: '📍' },
            { value: allIssues.filter((i) => i.status === 'resolved').length, label: 'Resolved', emoji: '✅' },
            { value: [...new Set(allIssues.flatMap((i) => i.volunteers.map((v) => v.id)))].length, label: 'Volunteers', emoji: '🙋' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg mb-1">{stat.emoji}</div>
              <p className="text-lg font-extrabold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
