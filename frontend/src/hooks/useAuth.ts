'use client'

import { useAppState } from '@/lib/context'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole } from '@/types'

export function useAuth() {
  const {
    currentUser,
    isLoggedIn,
    login,
    logout,
    setShowLoginModal,
    setLoginRedirectAction,
  } = useAppState()

  const router = useRouter()

  // Login and redirect based on role
  const loginAndRedirect = useCallback(
    async (email: string, password: string, role?: UserRole) => {
      const success = await login(email, password, role)
      if (success) {
        if (role === 'admin') router.push('/admin')
        else if (role === 'volunteer') router.push('/volunteer')
        else router.push('/citizen')
      }
      return success
    },
    [login, router]
  )

  // Require login before doing an action
  const requireLogin = useCallback(
    (action: string, onSuccess?: () => void) => {
      if (isLoggedIn) {
        onSuccess?.()
        return true
      }
      setLoginRedirectAction(action)
      setShowLoginModal(true)
      return false
    },
    [isLoggedIn, setLoginRedirectAction, setShowLoginModal]
  )

  // Logout and go home
  const logoutAndRedirect = useCallback(() => {
    logout()
    router.push('/citizen')
  }, [logout, router])

  // Check if user has a specific role
  const hasRole = useCallback(
    (role: UserRole) => currentUser?.role === role,
    [currentUser]
  )

  // Get display name initials
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return {
    currentUser,
    isLoggedIn,
    login,
    loginAndRedirect,
    requireLogin,
    logout,
    logoutAndRedirect,
    hasRole,
    initials,
    role: currentUser?.role ?? null,
    isCitizen: currentUser?.role === 'citizen',
    isVolunteer: currentUser?.role === 'volunteer',
    isAdmin: currentUser?.role === 'admin',
  }
}