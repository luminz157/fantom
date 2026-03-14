'use client'

import { useAppState } from '@/lib/context'
import { useMemo, useRef, useEffect } from 'react'

export function useChat(issueId: string) {
  const { chatMessages, sendMessage, currentUser } = useAppState()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Messages for this issue
  const messages = useMemo(
    () => chatMessages[issueId] ?? [],
    [chatMessages, issueId]
  )

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send a message for this issue
  function send(text: string) {
    if (!text.trim()) return
    sendMessage(issueId, text.trim())
  }

  // Check if a message is from the current user
  function isOwnMessage(senderId: string) {
    return senderId === currentUser?.id
  }

  // Format timestamp for display
  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: typeof messages }[] = []

    messages.forEach((msg) => {
      const date = new Date(msg.timestamp).toDateString()
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(msg)
      } else {
        groups.push({ date, messages: [msg] })
      }
    })

    return groups
  }, [messages])

  return {
    messages,
    groupedMessages,
    send,
    isOwnMessage,
    formatTime,
    messagesEndRef,
    currentUser,
    messageCount: messages.length,
  }
}