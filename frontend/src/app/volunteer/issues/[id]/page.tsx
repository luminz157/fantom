'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Users, MapPin, Clock, AlertCircle } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAppState } from '@/lib/context'
import { IssueCard } from '@/components/shared/IssueCard'
import { ChatRoom } from '@/components/chat/ChatRoom'
import { CompletionForm } from '@/components/forms/CompletionForm'
import { SeverityCard } from '@/components/shared/SeverityCard'
import { ISSUE_TYPE_LABELS, ISSUE_TYPE_ICONS } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export default function VolunteerIssueDetailPage() {
  const router = useRouter()
  const params = useParams()
  const issueId = params?.id as string

  const { getIssueById, joinVolunteer } = useIssues()
  const { currentUser, setShowLoginModal } = useAppState()

  const [showChat, setShowChat] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const issue = getIssueById(issueId)

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[var(--text-muted)] mb-3" />
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Issue Not Found</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          This issue may have been removed.
        </p>
        <button onClick={() => router.push('/volunteer')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const hasJoined = issue.volunteers.some((v) => v.id === currentUser?.id)
  const timeAgo = formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })

  function handleJoin() {
    if (!currentUser) { setShowLoginModal(true); return }
    joinVolunteer(issueId)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-semibold
                   text-[var(--text-secondary)] hover:text-teal-600 dark:hover:text-teal-400
                   transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Issue card — full detail */}
      <IssueCard
        issue={issue}
        variant="volunteer"
        onVolunteerClick={handleJoin}
        onChatClick={() => setShowChat(true)}
      />

      {/* Severity details */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wide mb-3">
          🤖 AI Severity Assessment
        </h3>
        <SeverityCard severity={issue.severity} showLabel={true} />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Reported', value: timeAgo },
            { label: 'Upvotes', value: issue.upvotes },
            { label: 'Progress', value: `${issue.progressPercent}%` },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
              <p className="text-sm font-extrabold text-[var(--text-primary)]">{item.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team section */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wide">
            👥 Volunteer Team
          </h3>
          <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium">
            {issue.volunteers.length} joined
          </span>
        </div>

        {issue.volunteers.length === 0 ? (
          <div className="text-center py-4">
            <Users className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)]">
              No volunteers yet. Be the first to join!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {issue.volunteers.map((v) => {
              const isYou = v.id === currentUser?.id
              return (
                <div
                  key={v.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    isYou
                      ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800'
                      : 'bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-200 dark:border-teal-700 flex-shrink-0">
                    {v.avatar
                      ? <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">{v.name[0]}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {v.name}
                      {isYou && <span className="text-teal-500 ml-1 font-medium">(you)</span>}
                    </p>
                  </div>
                  {isYou && (
                    <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Join / Chat / Complete buttons */}
        <div className="flex gap-2 mt-4">
          {!hasJoined ? (
            <button onClick={handleJoin} className="flex-1 btn-primary py-2.5 text-xs">
              + Join Volunteer Team
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowChat(true)}
                className="flex-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400
                           border border-teal-200 dark:border-teal-800 rounded-xl text-xs py-2.5
                           font-semibold hover:bg-teal-100 transition-colors"
              >
                💬 Team Chat
              </button>
              {issue.status !== 'resolved' && (
                <button
                  onClick={() => setShowCompletion(true)}
                  className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400
                             border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs py-2.5
                             font-semibold hover:bg-emerald-100 transition-colors"
                >
                  ✅ Mark Resolved
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-4" />

      {/* Chat modal */}
      {showChat && (
        <ChatRoom issueId={issueId} onClose={() => setShowChat(false)} />
      )}

      {/* Completion modal */}
      {showCompletion && (
        <div className="modal-overlay" onClick={() => setShowCompletion(false)}>
          <div
            className="glass-card w-full max-w-sm shadow-glass-lg overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <CompletionForm
              issueId={issueId}
              onClose={() => setShowCompletion(false)}
              onCompleted={() => router.push('/volunteer')}
            />
          </div>
        </div>
      )}
    </div>
  )
}