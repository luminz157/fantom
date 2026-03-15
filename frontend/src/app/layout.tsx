import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/lib/context'

export const metadata: Metadata = {
  title: 'CivicPulse — Smart City Issue Management',
  description: 'Report civic issues, volunteer to resolve them, and build a better city together.',
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
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}