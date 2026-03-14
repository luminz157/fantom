export type Severity = 'high' | 'medium' | 'low'
export type IssueStatus = 'pending' | 'inprogress' | 'resolved'
export type UserRole = 'citizen' | 'volunteer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  points?: number
  badges?: Badge[]
  joinedAt: string
}

export interface Badge {
  id: string
  label: string
  icon: string
  color: string
}

export interface IssueReport {
  id: string
  type: IssueType
  description: string
  location: LocationData
  photoUrl?: string
  severity: Severity
  status: IssueStatus
  reportedBy: string
  reportedAt: string
  volunteers: Volunteer[]
  progressPercent: number
  upvotes: number
}

export interface LocationData {
  lat?: number
  lng?: number
  address: string
  area?: string
}

export type IssueType =
  | 'garbage'
  | 'pothole'
  | 'streetlight'
  | 'water_leakage'
  | 'road_damage'
  | 'illegal_dumping'
  | 'drainage'
  | 'fallen_tree'
  | 'other'

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  garbage: 'Garbage Dump',
  pothole: 'Pothole',
  streetlight: 'Broken Streetlight',
  water_leakage: 'Water Leakage',
  road_damage: 'Road Damage',
  illegal_dumping: 'Illegal Dumping',
  drainage: 'Drainage Blockage',
  fallen_tree: 'Fallen Tree',
  other: 'Other Issue',
}

export const ISSUE_TYPE_ICONS: Record<IssueType, string> = {
  garbage: '🗑️',
  pothole: '🕳️',
  streetlight: '💡',
  water_leakage: '💧',
  road_damage: '🚧',
  illegal_dumping: '⚠️',
  drainage: '🌊',
  fallen_tree: '🌳',
  other: '📋',
}

export interface Volunteer {
  id: string
  name: string
  avatar?: string
}

export interface ChatMessage {
  id: string
  issueId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  text: string
  timestamp: string
  isSystem?: boolean
}

export interface LeaderboardEntry {
  rank: number
  volunteerId: string
  name: string
  avatar?: string
  points: number
  issuesResolved: number
  badge: string
}

export interface Notification {
  id: string
  type: 'new_issue' | 'volunteer_joined' | 'status_update' | 'achievement'
  title: string
  message: string
  timestamp: string
  read: boolean
  issueId?: string
}

export interface AdminStats {
  totalIssues: number
  resolvedIssues: number
  activeIssues: number
  totalVolunteers: number
  issuesByCategory: { name: string; value: number }[]
  monthlyTrend: { month: string; reported: number; resolved: number }[]
}