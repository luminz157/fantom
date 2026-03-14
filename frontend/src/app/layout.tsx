import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AppStateProvider } from '@/components/providers/AppStateProvider'

export const metadata: Metadata = {
  title: 'CivicPulse — Smart City Issue Management',
  description: 'Report civic issues, volunteer to resolve them, and build a better city together.',
  keywords: ['civic', 'city', 'volunteer', 'issues', 'smart city'],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased">
        <ThemeProvider>
          <AppStateProvider>
            {children}
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}