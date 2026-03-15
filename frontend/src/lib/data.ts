import type { IssueReport, User, ChatMessage, LeaderboardEntry } from '@/types'

export const MOCK_USERS: User[] = [
  {
    id: 'user-1', name: 'Arjun Sharma', email: 'arjun@example.com',
    role: 'citizen', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Arjun',
    points: 120, joinedAt: '2024-01-15',
  },
  {
    id: 'user-2', name: 'Priya Nair', email: 'priya@example.com',
    role: 'volunteer', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya',
    points: 380, joinedAt: '2024-02-10',
  },
  {
    id: 'user-3', name: 'Rahul Verma', email: 'rahul@example.com',
    role: 'volunteer', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul',
    points: 520, joinedAt: '2023-12-01',
  },
  {
    id: 'admin-1', name: 'BBMP Admin', email: 'admin@bbmp.gov.in',
    role: 'admin', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Admin',
    points: 0, joinedAt: '2023-06-01',
  },
]

export const MOCK_ISSUES: IssueReport[] = [
  {
    id: 'issue-1', type: 'garbage',
    description: 'Large garbage pile near Indiranagar metro station entrance. Overflowing bins attracting stray animals.',
    location: { lat: 12.9784, lng: 77.6408, address: 'Indiranagar Metro, Bengaluru', area: 'Indiranagar' },
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    severity: 'high', status: 'inprogress', reportedBy: 'user-1',
    reportedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    volunteers: [
      { id: 'user-2', name: 'Priya Nair', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya' },
      { id: 'user-3', name: 'Rahul Verma', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul' },
    ],
    progressPercent: 55, upvotes: 14,
  },
  {
    id: 'issue-2', type: 'pothole',
    description: 'Deep pothole on 100 Feet Road causing traffic slowdown and vehicle damage.',
    location: { lat: 12.9352, lng: 77.6245, address: '100 Feet Road, Koramangala', area: 'Koramangala' },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80',
    severity: 'high', status: 'pending', reportedBy: 'user-1',
    reportedAt: new Date(Date.now() - 86400000).toISOString(),
    volunteers: [], progressPercent: 5, upvotes: 22,
  },
  {
    id: 'issue-3', type: 'streetlight',
    description: 'Three streetlights not working on MG Road stretch near Trinity Metro.',
    location: { lat: 12.9758, lng: 77.6096, address: 'MG Road, Trinity Circle', area: 'MG Road' },
    photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    severity: 'medium', status: 'inprogress', reportedBy: 'user-2',
    reportedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    volunteers: [
      { id: 'user-3', name: 'Rahul Verma', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul' },
    ],
    progressPercent: 40, upvotes: 8,
  },
  {
    id: 'issue-4', type: 'water_leakage',
    description: 'Water pipe burst near HSR Layout BDA complex causing waterlogging.',
    location: { lat: 12.9116, lng: 77.6389, address: 'HSR Layout BDA Complex', area: 'HSR Layout' },
    photoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    severity: 'high', status: 'resolved', reportedBy: 'user-1',
    reportedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    volunteers: [
      { id: 'user-2', name: 'Priya Nair', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya' },
      { id: 'user-3', name: 'Rahul Verma', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul' },
    ],
    progressPercent: 100, upvotes: 31,
  },
  {
    id: 'issue-5', type: 'fallen_tree',
    description: 'Large tree fell on Sarjapur Road blocking one lane after last night storm.',
    location: { lat: 12.9010, lng: 77.6880, address: 'Sarjapur Road, Bellandur', area: 'Bellandur' },
    photoUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
    severity: 'high', status: 'pending', reportedBy: 'user-2',
    reportedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    volunteers: [], progressPercent: 5, upvotes: 41,
  },
  {
    id: 'issue-6', type: 'drainage',
    description: 'Clogged storm drain near Jayanagar 4th Block. Water overflowing onto road.',
    location: { lat: 12.9250, lng: 77.5938, address: 'Jayanagar 4th Block', area: 'Jayanagar' },
    photoUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
    severity: 'medium', status: 'inprogress', reportedBy: 'user-1',
    reportedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    volunteers: [
      { id: 'user-2', name: 'Priya Nair', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya' },
    ],
    progressPercent: 35, upvotes: 17,
  },
]

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'issue-1': [
    {
      id: 'msg-1', issueId: 'issue-1', senderId: 'system',
      senderName: 'CivicPulse Bot',
      text: 'Volunteer team created! Discuss and coordinate to solve this issue together. 💪',
      timestamp: new Date(Date.now() - 86400000).toISOString(), isSystem: true,
    },
    {
      id: 'msg-2', issueId: 'issue-1', senderId: 'user-2', senderName: 'Priya Nair',
      senderAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya',
      text: "I can be there by 8am tomorrow. Anyone else free in the morning?",
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    {
      id: 'msg-3', issueId: 'issue-1', senderId: 'user-3', senderName: 'Rahul Verma',
      senderAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul',
      text: "I'll bring gloves and bags. Let's meet at 8:30am at the metro entrance.",
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  'issue-3': [
    {
      id: 'msg-4', issueId: 'issue-3', senderId: 'system',
      senderName: 'CivicPulse Bot',
      text: 'Volunteer team created! Coordinate here to resolve the streetlight issue.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), isSystem: true,
    },
  ],
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, volunteerId: 'user-3', name: 'Rahul Verma', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul', points: 520, issuesResolved: 18, badge: '🏆' },
  { rank: 2, volunteerId: 'user-2', name: 'Priya Nair', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya', points: 380, issuesResolved: 13, badge: '🥈' },
  { rank: 3, volunteerId: 'u-4', name: 'Karthik Rao', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Karthik', points: 290, issuesResolved: 10, badge: '🥉' },
  { rank: 4, volunteerId: 'u-5', name: 'Sneha Patel', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sneha', points: 210, issuesResolved: 7, badge: '⭐' },
  { rank: 5, volunteerId: 'u-6', name: 'Amit Kumar', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Amit', points: 165, issuesResolved: 5, badge: '⭐' },
  { rank: 6, volunteerId: 'user-1', name: 'Arjun Sharma', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Arjun', points: 120, issuesResolved: 4, badge: '🌱' },
]

export const CIVIC_QUOTES = [
  { text: "Let's work together to make our city cleaner and greener.", author: "CivicPulse" },
  { text: "Small actions by citizens create big changes in cities.", author: "Urban Wisdom" },
  { text: "A clean city is a happy city. Be the change you want to see.", author: "Community Voice" },
  { text: "Your report today is someone's safer commute tomorrow.", author: "CivicPulse" },
  { text: "Cities are what we make them. Make yours great.", author: "Urban Wisdom" },
]

export const ADMIN_STATS = {
  totalIssues: MOCK_ISSUES.length,
  resolvedIssues: MOCK_ISSUES.filter((i) => i.status === 'resolved').length,
  activeIssues: MOCK_ISSUES.filter((i) => i.status === 'inprogress').length,
  totalVolunteers: 4,
  issuesByCategory: [
    { name: 'Garbage', value: 12 },
    { name: 'Pothole', value: 8 },
    { name: 'Streetlight', value: 6 },
    { name: 'Water', value: 5 },
    { name: 'Road', value: 4 },
    { name: 'Other', value: 7 },
  ],
  monthlyTrend: [
    { month: 'Oct', reported: 18, resolved: 12 },
    { month: 'Nov', reported: 24, resolved: 18 },
    { month: 'Dec', reported: 20, resolved: 16 },
    { month: 'Jan', reported: 32, resolved: 22 },
    { month: 'Feb', reported: 28, resolved: 24 },
    { month: 'Mar', reported: 35, resolved: 28 },
  ],
}