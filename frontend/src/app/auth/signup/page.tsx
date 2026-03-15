'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, MapPin, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

export default function SignupPage() {
  const router = useRouter()
  const { loginAndRedirect } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('citizen')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await loginAndRedirect(email, password, role)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions: { value: UserRole; label: string; emoji: string; desc: string }[] = [
    { value: 'citizen', label: 'Citizen', emoji: '🏙️', desc: 'Report civic issues' },
    { value: 'volunteer', label: 'Volunteer', emoji: '🙋', desc: 'Help resolve issues' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center mesh-bg p-6">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-[var(--text-primary)]">
            Civic<span className="text-teal-500">Pulse</span>
          </span>
        </div>

        <div className="glass-card p-8 shadow-glass-lg">
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">
            Join CivicPulse 🌱
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Create your account and help build a better city
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  role === opt.value
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                    : 'border-[var(--border-color)] hover:border-teal-300'
                }`}
              >
                <div className="text-xl mb-1">{opt.emoji}</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{opt.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="input-base pl-9"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-base pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
                <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-5">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
