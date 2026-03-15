'use client'

import React, { useState } from 'react'
import { CheckCircle, Camera, X } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { PhotoUpload } from './PhotoUpload'

interface CompletionFormProps {
  issueId: string
  onClose: () => void
  onCompleted?: () => void
}

export function CompletionForm({ issueId, onClose, onCompleted }: CompletionFormProps) {
  const { updateIssueStatus, getIssueById } = useIssues()
  const issue = getIssueById(issueId)

  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    updateIssueStatus(issueId, 'resolved')
    setDone(true)
    setTimeout(() => {
      onCompleted?.()
      onClose()
    }, 1800)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-3 animate-float">
          <CheckCircle className="w-8 h-8 text-teal-500" />
        </div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)] mb-1">
          Issue Marked Resolved! 🎉
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Great work! You've earned volunteer points.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-sm font-extrabold text-[var(--text-primary)]">Mark Issue Resolved</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Confirm this issue has been resolved
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Completion photo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
            📸 After Photo (proof of resolution)
          </label>
          <PhotoUpload
            onPhotoCapture={setPhoto}
            capturedPhoto={photo}
            onClear={() => setPhoto(undefined)}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            Resolution Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was done to resolve this issue? Any notes for the admin?"
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2"
        >
          {submitting
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><CheckCircle className="w-4 h-4" /> Confirm Resolution</>
          }
        </button>
      </div>
    </div>
  )
}