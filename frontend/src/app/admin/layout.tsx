'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, MapPin, LogOut, Shield } from 'lucide-react'
import { useAppState } from '@/lib/context'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/issues', label: 'Issue Management', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn } = useAppState()
  const { logoutAndRedirect } = useAuth()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <nav className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/citizen')} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm text-[var(--text-primary)]">
                Civic<span className="text-teal-500">Pulse</span>
              </span>
            </button>
            <div className="flex items-center gap-1 ml-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Admin Panel</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 ml-2">
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

          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/citizen')} className="text-xs text-[var(--text-secondary)] hover:text-teal-500 px-2 py-1">🏙️ Citizen</button>
            <button onClick={() => router.push('/volunteer')} className="text-xs text-[var(--text-secondary)] hover:text-teal-500 px-2 py-1">🙋 Volunteer</button>
            {isLoggedIn && (
              <button onClick={logoutAndRedirect} className="text-xs text-rose-500 flex items-center gap-1">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}