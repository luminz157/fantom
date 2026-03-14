'use client'

import React, { useState } from 'react'
import { X, Send, ChevronDown } from 'lucide-react'
import { useIssues } from '@/hooks/useIssues'
import { useAppState } from '@/lib/context'
import { MapPicker } from '@/components/maps/MapPicker'
import { PhotoUpload } from './PhotoUpload'
import { AISeverityAnalyzer } from '@/components/shared/SeverityCard'
import { ISSUE_TYPE_LABELS } from '@/types'
import type { IssueType, Severity } from '@/types'

interface ReportIssueFormProps {
  onClose: () => void
  onSuccess?: () => void
}

const ISSUE_TYPES: IssueType[] = [
  'garbage', 'pothole', 'streetlight', 'water_leakage',
  'road_damage', 'illegal_dumping', 'drainage', 'fallen_tree', 'other',
]

export function ReportIssueForm({ onClose, onSuccess }: ReportIssueFormProps) {
  const { addIssue, detectSeverity } = useIssues()
  const { currentUser } = useAppState()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [issueType, setIssueType] = useState<IssueType>('garbage')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<{ lat?: number; lng?: number; address: string }>({ address: '' })
  const [photo, setPhoto] = useState<string | undefined>()
  const [analyzing, setAnalyzing] = useState(false)
  const [severity, setSeverity] = useState<Severity | undefined>()
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Step 1 validation
  function validateStep1() {
    const e: Record<string, string> = {}
    if (!description.trim()) e.description = 'Please describe the issue.'
    if (description.trim().length < 10) e.description = 'Description too short (min 10 chars).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Step 2 validation
  function validateStep2() {
    const e: Record<string, string> = {}
    if (!location.address.trim()) e.location = 'Please set your location.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleAnalyze() {
    if (!validateStep2()) return
    setStep(3)
    setAnalyzing(true)
    // Simulate AI analysis delay
    await new Promise((r) => setTimeout(r, 2200))
    const detected = detectSeverity(description, issueType)
    setSeverity(detected)
    setAnalyzing(false)
  }

  async function handleSubmit() {
    if (!currentUser) return
    const finalSeverity = severity ?? detectSeverity(description, issueType)

    addIssue({
      type: issueType,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        area: location.address.split(',')[0],
      },
      photoUrl: photo,
      severity: finalSeverity,
      status: 'pending',
      reportedBy: currentUser.id,
    })

    setSubmitted(true)
    setTimeout(() => {
      onSuccess?.()
      onClose()
    }, 2000)
  }

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-4 animate-float">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-lg font-extrabold text-[var(--text-primary)] mb-2">Issue Reported!</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-xs">
          Your report has been submitted. Volunteers will be notified and the issue will be tracked in real-time.
        </p>
        {severity && (
          <div className="mt-4 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800">
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              AI Severity: {severity.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] flex-shrink-0">
        <div>
          <h2 className="text-base font-extrabold text-[var(--text-primary)]">Report Civic Issue</h2>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-[var(--text-muted)]'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-6 h-0.5 ${step > s ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
            <span className="text-xs text-[var(--text-muted)] ml-2">
              {step === 1 ? 'Issue Details' : step === 2 ? 'Location & Photo' : 'Review & Submit'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* ── Step 1: Issue Details ── */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            {/* Issue type */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Issue Type *
              </label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as IssueType)}
                  className="input-base appearance-none pr-8 cursor-pointer"
                >
                  {ISSUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ISSUE_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors({}) }}
                placeholder="Describe the issue in detail. What does it look like? How severe is it? Is it blocking traffic or causing harm?"
                rows={5}
                className="input-base resize-none leading-relaxed"
              />
              <div className="flex justify-between mt-1">
                {errors.description
                  ? <p className="text-xs text-rose-500">{errors.description}</p>
                  : <span />
                }
                <span className={`text-xs ${description.length < 10 ? 'text-[var(--text-muted)]' : 'text-teal-500'}`}>
                  {description.length} chars
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Location & Photo ── */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                📍 Location *
              </label>
              <MapPicker
                onLocationSet={setLocation}
                currentAddress={location.address}
              />
              {errors.location && (
                <p className="text-xs text-rose-500 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                📸 Photo (Recommended)
              </label>
              <PhotoUpload
                onPhotoCapture={setPhoto}
                capturedPhoto={photo}
                onClear={() => setPhoto(undefined)}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Submit ── */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            {/* AI Analysis */}
            <AISeverityAnalyzer isAnalyzing={analyzing} severity={severity} />

            {/* Summary card */}
            {!analyzing && (
              <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
                {photo && (
                  <img src={photo} alt="Issue" className="w-full h-36 object-cover" />
                )}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Issue Type</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {ISSUE_TYPE_LABELS[issueType]}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Description</span>
                    <p className="text-xs text-[var(--text-primary)] mt-0.5 leading-relaxed">{description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Location</span>
                    <span className="text-xs text-[var(--text-primary)] max-w-[180px] text-right truncate">
                      {location.address}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="px-5 py-4 border-t border-[var(--border-color)] flex gap-3 flex-shrink-0">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold
                       text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            ← Back
          </button>
        )}

        {step === 1 && (
          <button
            onClick={() => { if (validateStep1()) setStep(2) }}
            className="flex-1 btn-primary py-2.5"
          >
            Next: Add Location →
          </button>
        )}
        {step === 2 && (
          <button
            onClick={handleAnalyze}
            className="flex-1 btn-primary py-2.5"
          >
            Next: Analyze Issue →
          </button>
        )}
        {step === 3 && !analyzing && severity && (
          <button
            onClick={handleSubmit}
            className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Report
          </button>
        )}
      </div>
    </div>
  )
}