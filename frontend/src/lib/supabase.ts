export const supabase = {
  from: (_table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: (_data: unknown) => Promise.resolve({ data: null, error: null }),
    update: (_data: unknown) => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
  }),
  auth: {
    signIn: (_opts: unknown) => Promise.resolve({ user: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
  channel: (_name: string) => ({
    on: () => ({ subscribe: () => {} }),
  }),
}