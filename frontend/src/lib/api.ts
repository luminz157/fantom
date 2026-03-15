// API utility — ready for backend integration
// Currently uses mock data via context, but structured for real API calls

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// Issues
export const issuesApi = {
  getAll: () => request('/api/issues'),
  getById: (id: string) => request(`/api/issues/${id}`),
  create: (data: unknown) => request('/api/issues', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    request(`/api/issues/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  joinVolunteer: (id: string) =>
    request(`/api/issues/${id}/volunteer`, { method: 'POST' }),
}

// Auth
export const authApi = {
  login: (email: string, password: string, role?: string) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  signup: (data: unknown) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
}

// Chat
export const chatApi = {
  getMessages: (issueId: string) => request(`/api/chat/${issueId}`),
  sendMessage: (issueId: string, text: string) =>
    request(`/api/chat/${issueId}`, { method: 'POST', body: JSON.stringify({ text }) }),
}

// Upload
export const uploadApi = {
  photo: async (dataUrl: string): Promise<{ url: string }> => {
    const blob = await fetch(dataUrl).then((r) => r.blob())
    const form = new FormData()
    form.append('file', blob, 'issue-photo.jpg')
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form })
    return res.json()
  },
}