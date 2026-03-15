'use client'

import React, { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppState } from '@/lib/context'

export function LoginModal() {
  const { login } = useAuth()
  const { showLoginModal, setShowLoginModal, setLoginRedirectAction } = useAppState()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!showLoginModal) return null

  function handleClose() {
    setShowLoginModal(false)
    setLoginRedirectAction(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }
    setLoading(true)
    try {
      await login(email, password, 'citizen')
      setShowLoginModal(false)
      setLoginRedirectAction(null)
    } catch {
      setError('Invalid credentials. Try a demo account below.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(type: 'citizen' | 'volunteer') {
    const accounts = {
      citizen: { email: 'arjun@example.com', password: 'demo123' },
      volunteer: { email: 'priya@example.com', password: 'demo123' },
    }
    setEmail(accounts[type].email)
    setPassword(accounts[type].password)
    setError('')
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="glass-card w-full max-w-sm p-6 shadow-glass-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
                Sign in required
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Login to report a civic issue
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="Email address"
              className="input-base pl-9"
              autoFocus
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Password"
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
              <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Sign In & Continue'
            }
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-4">
          <p className="text-xs text-[var(--text-muted)] text-center mb-2.5">
            Quick demo login
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'citizen' as const, label: 'Citizen', emoji: '🏙️' },
              { type: 'volunteer' as const, label: 'Volunteer', emoji: '🙋' },
            ].map((demo) => (
              <button
                key={demo.type}
                type="button"
                onClick={() => fillDemo(demo.type)}
                className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-xl
                           border border-[var(--border-color)] hover:border-teal-400
                           hover:bg-teal-50 dark:hover:bg-teal-900/20
                           text-[var(--text-secondary)] hover:text-teal-600 dark:hover:text-teal-400
                           transition-all font-medium"
              >
                {demo.emoji} {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => { handleClose(); window.location.href = '/auth/signup' }}
            className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  )
}