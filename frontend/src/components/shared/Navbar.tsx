'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Bell, Sun, Moon, Menu, X, LogOut, User,
  LayoutDashboard, Users, ShieldCheck, MapPin
} from 'lucide-react'
import { useTheme } from '@/lib/context'
import { useAppState } from '@/lib/context'

interface NavbarProps {
  onMenuToggle?: () => void
  sidebarOpen?: boolean
}

export function Navbar({ onMenuToggle, sidebarOpen }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()
  const { currentUser, isLoggedIn, logout, notifications, unreadCount, markNotificationRead } = useAppState()

  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const roleLabel: Record<string, string> = {
    citizen: 'Citizen',
    volunteer: 'Volunteer',
    admin: 'Admin',
  }

  const navLinks = [
    { label: 'Citizen', href: '/citizen', icon: LayoutDashboard },
    { label: 'Volunteer', href: '/volunteer', icon: Users },
    { label: 'Admin', href: '/admin', icon: ShieldCheck },
  ]

  function handleLogout() {
    logout()
    setShowUserMenu(false)
    router.push('/citizen')
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">

        {/* Left — Logo + Menu toggle */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 text-[var(--text-secondary)] transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Logo */}
          <button
            onClick={() => router.push('/citizen')}
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm text-[var(--text-primary)] tracking-tight hidden sm:block">
              Civic<span className="text-teal-500">Pulse</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname?.startsWith(link.href)
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                      : 'text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false) }}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-10 w-80 glass-card shadow-glass-lg z-50 overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--text-primary)]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`w-full text-left px-4 py-3 border-b border-[var(--border-color)] hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors ${
                          !notif.read ? 'bg-teal-50/30 dark:bg-teal-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-base mt-0.5">
                            {notif.type === 'new_issue' ? '📍' : notif.type === 'volunteer_joined' ? '🙋' : '✅'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[var(--text-primary)]">{notif.title}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{notif.message}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false) }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900 border-2 border-teal-200 dark:border-teal-700">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
                      {currentUser?.name?.[0] ?? 'U'}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-none">{currentUser?.name}</p>
                  <p className="text-xs text-teal-500 mt-0.5">{currentUser?.role ? roleLabel[currentUser.role] : ''}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-10 w-48 glass-card shadow-glass-lg z-50 overflow-hidden animate-slide-up">
                  <div className="px-4 py-3 border-b border-[var(--border-color)]">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser?.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-primary text-xs py-1.5 px-4"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifs || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowNotifs(false); setShowUserMenu(false) }}
        />
      )}
    </nav>
  )
}