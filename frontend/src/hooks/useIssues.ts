'use client'

import { useAppState } from '@/lib/context'
import { useCallback, useMemo } from 'react'
import type { IssueReport, IssueType, Severity, IssueStatus } from '@/types'

interface FilterOptions {
  type?: IssueType | 'all'
  severity?: Severity | 'all'
  status?: IssueStatus | 'all'
  reportedBy?: string
  searchQuery?: string
}

export function useIssues(filters?: FilterOptions) {
  const { issues, addIssue, updateIssueStatus, joinVolunteer, currentUser } =
    useAppState()

  // Apply filters
  const filteredIssues = useMemo(() => {
    let result = [...issues]

    if (filters?.type && filters.type !== 'all') {
      result = result.filter((i) => i.type === filters.type)
    }
    if (filters?.severity && filters.severity !== 'all') {
      result = result.filter((i) => i.severity === filters.severity)
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((i) => i.status === filters.status)
    }
    if (filters?.reportedBy) {
      result = result.filter((i) => i.reportedBy === filters.reportedBy)
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.description.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q)
      )
    }

    return result
  }, [issues, filters])

  // My issues (reported by current user)
  const myIssues = useMemo(
    () => issues.filter((i) => i.reportedBy === currentUser?.id),
    [issues, currentUser]
  )

  // Issues I volunteered for
  const myVolunteerIssues = useMemo(
    () =>
      issues.filter((i) =>
        i.volunteers.some((v) => v.id === currentUser?.id)
      ),
    [issues, currentUser]
  )

  // Stats for citizen dashboard
  const myStats = useMemo(() => ({
    total: myIssues.length,
    resolved: myIssues.filter((i) => i.status === 'resolved').length,
    inProgress: myIssues.filter((i) => i.status === 'inprogress').length,
    pending: myIssues.filter((i) => i.status === 'pending').length,
  }), [myIssues])

  // Stats for volunteer dashboard
  const volunteerStats = useMemo(() => ({
    joined: myVolunteerIssues.length,
    resolved: myVolunteerIssues.filter((i) => i.status === 'resolved').length,
    active: myVolunteerIssues.filter((i) => i.status === 'inprogress').length,
  }), [myVolunteerIssues])

  // Stats for admin
  const adminStats = useMemo(() => ({
    total: issues.length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    active: issues.filter((i) => i.status === 'inprogress').length,
    pending: issues.filter((i) => i.status === 'pending').length,
    highSeverity: issues.filter((i) => i.severity === 'high').length,
    totalVolunteers: [...new Set(issues.flatMap((i) => i.volunteers.map((v) => v.id)))].length,
  }), [issues])

  // Get single issue by ID
  const getIssueById = useCallback(
    (id: string): IssueReport | undefined => issues.find((i) => i.id === id),
    [issues]
  )

  // AI severity detection (mock — based on keywords)
  const detectSeverity = useCallback((description: string, type: IssueType): Severity => {
    const highKeywords = ['burst', 'flood', 'fire', 'collapse', 'accident', 'dangerous', 'urgent', 'blocked']
    const lowKeywords = ['minor', 'small', 'slight', 'little']
    const desc = description.toLowerCase()

    const highTypes: IssueType[] = ['water_leakage', 'fallen_tree', 'road_damage']
    const lowTypes: IssueType[] = ['streetlight', 'other']

    if (highKeywords.some((k) => desc.includes(k)) || highTypes.includes(type)) return 'high'
    if (lowKeywords.some((k) => desc.includes(k)) || lowTypes.includes(type)) return 'low'
    return 'medium'
  }, [])

  return {
    issues: filteredIssues,
    allIssues: issues,
    myIssues,
    myVolunteerIssues,
    myStats,
    volunteerStats,
    adminStats,
    addIssue,
    updateIssueStatus,
    joinVolunteer,
    getIssueById,
    detectSeverity,
  }
}