'use client'

import React from 'react'
import type { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  formatTime: (timestamp: string) => string
}

export function MessageBubble({ message, isOwn, formatTime }: MessageBubbleProps) {
  // System message
  if (message.isSystem) {
    return (
      <div className="flex justify-center my-1">
        <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-xl px-3 py-2 max-w-[85%]">
          <p className="text-xs text-teal-600 dark:text-teal-400 text-center">
            {message.text}
          </p>
          <p className="text-xs text-teal-400/60 text-center mt-0.5">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900/40 flex-shrink-0 self-end border-2 border-teal-200 dark:border-teal-700">
        {message.senderAvatar ? (
          <img
            src={message.senderAvatar}
            alt={message.senderName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-teal-600">
            {message.senderName[0]}
          </div>
        )}
      </div>

      {/* Bubble + meta */}
      <div className={`max-w-[72%] flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name — only for others */}
        {!isOwn && (
          <p className="text-xs text-[var(--text-muted)] ml-1 font-medium">
            {message.senderName}
          </p>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-3 py-2 ${
            isOwn
              ? 'bg-teal-500 text-white rounded-tr-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] rounded-tl-sm'
          }`}
        >
          <p className="text-xs leading-relaxed break-words">{message.text}</p>
        </div>

        {/* Timestamp */}
        <p className={`text-xs text-[var(--text-muted)] ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}