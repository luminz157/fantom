'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, MapPin, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { loginAndRedirect } = useAuth()

  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const DEMO_ACCOUNTS = {
    citizen: { email: 'arjun@example.com', password: 'demo123' },
    volunteer: { email: 'priya@example.com', password: 'demo123' },
    admin: { email: 'admin@bbmp.gov.in', password: 'demo123' },
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const role: UserRole = activeTab === 'admin' ? 'admin' : 'citizen'
      await loginAndRedirect(email, password, role)
    } catch {
      setError('Invalid credentials. Try a demo account below.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(type: 'citizen' | 'volunteer' | 'admin') {
    setEmail(DEMO_ACCOUNTS[type].email)
    setPassword(DEMO_ACCOUNTS[type].password)
    if (type === 'admin') setActiveTab('admin')
    else setActiveTab('citizen')
  }

  return (
    <div className="min-h-screen flex mesh-bg">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-32 right-16 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">
              Civic<span className="text-teal-300">Pulse</span>
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center py-12">
            <div className="animate-float text-center">
              <div className="text-8xl mb-6">🏙️</div>
              <div className="flex justify-center gap-4 text-4xl mb-4">
                <span className="animate-float" style={{ animationDelay: '0.2s' }}>🚛</span>
                <span className="animate-float" style={{ animationDelay: '0.4s' }}>🙋</span>
                <span className="animate-float" style={{ animationDelay: '0.6s' }}>📍</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-white text-2xl font-extrabold leading-tight mb-3">
              Build a Cleaner,<br />
              <span className="text-teal-300">Smarter City</span> Together
            </h2>
            <p className="text-teal-200/70 text-sm leading-relaxed mb-6">
              Report civic issues, coordinate with volunteers, and work with your local government to resolve problems faster.
            </p>
            <div className="flex gap-6">
              {[
                { value: '2,400+', label: 'Issues Resolved' },
                { value: '840+', label: 'Volunteers' },
                { value: '12', label: 'City Zones' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-teal-300 font-extrabold text-lg">{stat.value}</p>
                  <p className="text-teal-200/60 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-[var(--text-primary)]">
              Civic<span className="text-teal-500">Pulse</span>
            </span>
          </div>

          <div className="glass-card p-8 shadow-glass-lg">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">
              Welcome back 👋
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Sign in to continue to CivicPulse
            </p>

            {/* Tab Toggle */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
              {[
                { key: 'citizen', label: '🏙️ Citizen / Volunteer' },
                { key: 'admin', label: '🛡️ Government' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'citizen' | 'admin')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    autoComplete="email"
                  />
                </div>
              </div>

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
                    placeholder="••••••••"
                    className="input-base pl-9 pr-10"
                    autoComplete="current-password"
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

              <div className="flex justify-end">
                <button type="button" className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                  Forgot password?
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
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="text-xs text-[var(--text-muted)]">demo accounts</span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'citizen' as const, label: 'Citizen', emoji: '🏙️' },
                { type: 'volunteer' as const, label: 'Volunteer', emoji: '🙋' },
                { type: 'admin' as const, label: 'Admin', emoji: '🛡️' },
              ].map((demo) => (
                <button
                  key={demo.type}
                  type="button"
                  onClick={() => fillDemo(demo.type)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-[var(--border-color)] hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all text-center group"
                >
                  <span className="text-lg">{demo.emoji}</span>
                  <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {demo.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-[var(--text-muted)] mt-5">
              New to CivicPulse?{' '}
              <button
                onClick={() => router.push('/auth/signup')}
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
 