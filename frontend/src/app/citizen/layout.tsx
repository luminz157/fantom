'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, MapPin, LogOut, User
} from 'lucide-react'
import { useAppState } from '@/lib/context'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { href: '/citizen', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/citizen/report', label: 'Report Issue', icon: FileText },
  { href: '/citizen/issues', label: 'My Reports', icon: MapPin },
]

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, currentUser } = useAppState()
  const { logoutAndRedirect, initials } = useAuth()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">

          {/* Left — Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/citizen')}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm text-[var(--text-primary)]">
                Civic<span className="text-teal-500">Pulse</span>
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1 ml-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href, item.exact)
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                        : 'text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/volunteer')}
              className="hidden sm:block text-xs text-[var(--text-secondary)] hover:text-teal-500 px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            >
              🙋 Volunteer
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="hidden sm:block text-xs text-[var(--text-secondary)] hover:text-teal-500 px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            >
              🛡️ Admin
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900 border-2 border-teal-200 dark:border-teal-700">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                      {initials}
                    </div>
                  )}
                </div>
                <button
                  onClick={logoutAndRedirect}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav tabs */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  active
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

