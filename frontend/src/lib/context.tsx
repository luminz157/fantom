'use client'

import React, {
  createContext, useContext, useState,
  useCallback, useEffect
} from 'react'
import type { User, IssueReport, ChatMessage, Notification } from '@/types'
import { MOCK_ISSUES, MOCK_USERS, MOCK_CHAT_MESSAGES } from '@/lib/data'

// ─── Theme ────────────────────────────────────────────────────
type Theme = 'light' | 'dark'
interface ThemeCtx { theme: Theme; toggleTheme: () => void; isDark: boolean }

export const ThemeContext = createContext<ThemeCtx>({
  theme: 'light', toggleTheme: () => {}, isDark: false,
})
export function useTheme() { return useContext(ThemeContext) }

// ─── App State ────────────────────────────────────────────────
interface AppState {
  currentUser: User | null
  isLoggedIn: boolean
  login: (email: string, password: string, role?: string) => Promise<boolean>
  logout: () => void
  issues: IssueReport[]
  addIssue: (issue: Omit<IssueReport, 'id' | 'reportedAt' | 'volunteers' | 'progressPercent' | 'upvotes'>) => IssueReport
  updateIssueStatus: (id: string, status: IssueReport['status']) => void
  joinVolunteer: (issueId: string) => void
  chatMessages: Record<string, ChatMessage[]>
  sendMessage: (issueId: string, text: string) => void
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  unreadCount: number
  showLoginModal: boolean
  setShowLoginModal: (v: boolean) => void
  loginRedirectAction: string | null
  setLoginRedirectAction: (v: string | null) => void
}

export const AppStateContext = createContext<AppState>({} as AppState)
export function useAppState() { return useContext(AppStateContext) }

// ─── Combined Provider ────────────────────────────────────────
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [issues, setIssues] = useState<IssueReport[]>(MOCK_ISSUES)
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(MOCK_CHAT_MESSAGES)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1', type: 'new_issue', title: 'New issue nearby!',
      message: 'A garbage dump was reported 0.4 km from you.',
      timestamp: new Date().toISOString(), read: false, issueId: 'issue-1',
    },
    {
      id: 'n2', type: 'volunteer_joined', title: 'Volunteer joined your report',
      message: '2 volunteers are now working on your pothole report.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, issueId: 'issue-2',
    },
  ])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginRedirectAction, setLoginRedirectAction] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Theme
    const storedTheme = localStorage.getItem('civicpulse-theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme ?? (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    if (initialTheme === 'dark') document.documentElement.classList.add('dark')
    // User
    const storedUser = localStorage.getItem('civicpulse-user')
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)) } catch {}
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      if (next === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      localStorage.setItem('civicpulse-theme', next)
      return next
    })
  }, [])

  const login = useCallback(async (email: string, _pw: string, role?: string): Promise<boolean> => {
    const found = MOCK_USERS.find((u) => u.email === email || (role && u.role === role)) ?? MOCK_USERS[0]
    const user: User = { ...found, email }
    setCurrentUser(user)
    localStorage.setItem('civicpulse-user', JSON.stringify(user))
    return true
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('civicpulse-user')
  }, [])

  const addIssue = useCallback((
    data: Omit<IssueReport, 'id' | 'reportedAt' | 'volunteers' | 'progressPercent' | 'upvotes'>
  ): IssueReport => {
    const newIssue: IssueReport = {
      ...data, id: `issue-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      volunteers: [], progressPercent: 0, upvotes: 0,
    }
    setIssues((prev) => [newIssue, ...prev])
    setNotifications((prev) => [{
      id: `n-${Date.now()}`, type: 'new_issue', title: 'New issue reported!',
      message: `${data.type} reported near ${data.location.address}.`,
      timestamp: new Date().toISOString(), read: false, issueId: newIssue.id,
    }, ...prev])
    return newIssue
  }, [])

  const updateIssueStatus = useCallback((id: string, status: IssueReport['status']) => {
    setIssues((prev) => prev.map((issue) => {
      if (issue.id !== id) return issue
      const progressMap = { pending: 5, inprogress: 55, resolved: 100 }
      return { ...issue, status, progressPercent: progressMap[status] }
    }))
  }, [])

  const joinVolunteer = useCallback((issueId: string) => {
    if (!currentUser) return
    setIssues((prev) => prev.map((issue) => {
      if (issue.id !== issueId) return issue
      if (issue.volunteers.some((v) => v.id === currentUser.id)) return issue
      return {
        ...issue,
        volunteers: [...issue.volunteers, {
          id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar,
        }],
        status: 'inprogress' as const,
        progressPercent: Math.max(issue.progressPercent, 30),
      }
    }))
    setChatMessages((prev) => ({
      ...prev,
      [issueId]: [...(prev[issueId] ?? []), {
        id: `msg-${Date.now()}`, issueId, senderId: 'system',
        senderName: 'CivicPulse Bot',
        text: `${currentUser?.name} joined the team! Coordinate to resolve this issue. 💪`,
        timestamp: new Date().toISOString(), isSystem: true,
      }],
    }))
  }, [currentUser])

  const sendMessage = useCallback((issueId: string, text: string) => {
    if (!currentUser || !text.trim()) return
    setChatMessages((prev) => ({
      ...prev,
      [issueId]: [...(prev[issueId] ?? []), {
        id: `msg-${Date.now()}`, issueId,
        senderId: currentUser.id, senderName: currentUser.name,
        senderAvatar: currentUser.avatar, text: text.trim(),
        timestamp: new Date().toISOString(),
      }],
    }))
  }, [currentUser])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }, [])

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      <AppStateContext.Provider value={{
        currentUser, isLoggedIn: !!currentUser, login, logout,
        issues, addIssue, updateIssueStatus, joinVolunteer,
        chatMessages, sendMessage,
        notifications, markNotificationRead,
        unreadCount: notifications.filter((n) => !n.read).length,
        showLoginModal, setShowLoginModal,
        loginRedirectAction, setLoginRedirectAction,
      }}>
        {children}
      </AppStateContext.Provider>
    </ThemeContext.Provider>
  )
}